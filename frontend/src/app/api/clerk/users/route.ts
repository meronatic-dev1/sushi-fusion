import { NextRequest, NextResponse } from 'next/server';
import { clerkClient, auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        // 1. Verify caller is a valid admin
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clerkClient();
        const caller = await client.users.getUser(userId);
        
        if (caller.publicMetadata?.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Only admins can create users' }, { status: 403 });
        }

        // 2. Parse request body
        const body = await req.json();
        const { name, email, password, phone, role, branchId } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // 3. Create user in Clerk
        let clerkUser;
        try {
            clerkUser = await client.users.createUser({
                firstName: name,
                emailAddress: [email],
                password: password,
                publicMetadata: {
                    role: role === 'ADMIN' ? 'admin' : 'branch_manager',
                    branchId: role === 'BRANCH_MANAGER' ? branchId : null,
                },
                skipPasswordChecks: true,
                skipPasswordRequirement: false,
            });
        } catch (clerkError: any) {
            console.error('Clerk Creation Error:', clerkError.errors || clerkError);
            return NextResponse.json({ 
                message: clerkError.errors?.[0]?.message || 'Failed to create user in Clerk' 
            }, { status: 400 });
        }

        // 4. Sync user to NestJS Database (so Orders can link to it)
        const nestjsPayload = {
            id: clerkUser.id, // Force Prisma to use the exact Clerk ID
            name,
            email,
            password, // Sent to NestJS (NestJS hashes it, though never used for login again)
            phone: phone || null,
            role, // 'ADMIN' or 'BRANCH_MANAGER' (matches Prisma enum)
            branchId: role === 'BRANCH_MANAGER' ? branchId : null,
        };

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const syncRes = await fetch(`${backendUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nestjsPayload),
        });

        if (!syncRes.ok) {
            // Rollback Clerk user if db fails
            await client.users.deleteUser(clerkUser.id);
            const errorText = await syncRes.text();
            throw new Error(`Failed to sync with Database: ${errorText}`);
        }

        const dbUser = await syncRes.json();
        return NextResponse.json({ success: true, user: dbUser });

    } catch (error: any) {
        console.error('User Sync API Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        // 1. Verify caller is a valid admin
        const { userId: callerId } = await auth();
        if (!callerId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clerkClient();
        const caller = await client.users.getUser(callerId);
        
        if (caller.publicMetadata?.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Only admins can update users' }, { status: 403 });
        }

        // 2. Parse request body
        const body = await req.json();
        const { id, name, email, phone, role, branchId } = body;

        if (!id) {
            return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
        }

        // 3. Update user in Clerk Metadata if role/branch changed
        try {
            await client.users.updateUser(id, {
                firstName: name,
                publicMetadata: {
                    role: role === 'ADMIN' ? 'admin' : role === 'BRANCH_MANAGER' ? 'branch_manager' : null,
                    branchId: role === 'BRANCH_MANAGER' ? branchId : null,
                },
            });
        } catch (clerkError: any) {
            console.error('Clerk Update Error:', clerkError.errors || clerkError);
            return NextResponse.json({ 
                message: clerkError.errors?.[0]?.message || 'Failed to update user in Clerk' 
            }, { status: 400 });
        }

        // 4. Update user in NestJS Database
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const syncRes = await fetch(`${backendUrl}/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, role, branchId }),
        });

        if (!syncRes.ok) {
            const errorText = await syncRes.text();
            throw new Error(`Failed to update in Database: ${errorText}`);
        }

        const dbUser = await syncRes.json();
        return NextResponse.json({ success: true, user: dbUser });

    } catch (error: any) {
        console.error('User Update API Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
