import { NextRequest, NextResponse } from 'next/server';
import { clerkClient, auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { email, name, phone } = body;

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        // 1. Ensure user has 'customer' role in Clerk if no role is set
        let currentRole = user.publicMetadata?.role as string | undefined;
        if (!currentRole) {
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    role: 'customer'
                }
            });
            currentRole = 'customer';
        }

        // 2. Sync to local Database (NestJS)
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const syncRes = await fetch(`${backendUrl}/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: userId,
                email: email,
                name: name,
                phone: phone || null,
            }),
        });

        if (!syncRes.ok) {
            const errorText = await syncRes.text();
            throw new Error(`Failed to sync with local DB: ${errorText}`);
        }

        const dbUser = await syncRes.json();
        return NextResponse.json({ success: true, user: dbUser, role: currentRole });

    } catch (error: any) {
        console.error('User Sync Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
