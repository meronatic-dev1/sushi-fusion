import { NextRequest, NextResponse } from 'next/server';
import { clerkClient, auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        console.log('--- Clerk Sync Started ---');
        const { userId } = await auth();
        if (!userId) {
            console.error('Clerk Sync: No userId found');
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clerkClient();
        console.log('Clerk Sync: Fetching user from Clerk...');
        const user = await client.users.getUser(userId);

        const body = await req.json();
        const { email, name, phone } = body;
        
        if (!email && !user.primaryEmailAddress?.emailAddress) {
            console.error('Clerk Sync: No email found for user', userId);
        }

        console.log(`Clerk Sync: Processing userId=${userId}, email=${email || user.primaryEmailAddress?.emailAddress}`);

        // 1. Ensure user has 'customer' role in Clerk if no role is set
        let currentRole = user.publicMetadata?.role as string | undefined;
        if (!currentRole) {
            console.log('Clerk Sync: Setting default customer role...');
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    role: 'customer'
                }
            });
            currentRole = 'customer';
        }

        // 2. Sync to local Database (NestJS)
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        console.log(`Clerk Sync: Fetching backend sync at ${backendUrl}/users/sync`);
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
            console.error(`Clerk Sync: Backend sync failed: ${syncRes.status} ${errorText}`);
            throw new Error(`Failed to sync with local DB: ${errorText}`);
        }

        const dbUser = await syncRes.json();
        console.log('Clerk Sync: Successfully synced to backend');
        return NextResponse.json({ success: true, user: dbUser, role: currentRole });

    } catch (error: any) {
        console.error('--- Clerk Sync Error ---');
        const errorMessage = error.message || 'Internal Server Error';
        console.error('User Sync Error:', errorMessage);
        if (error.stack) console.error(error.stack);
        
        return NextResponse.json(
            { success: false, message: errorMessage, error: error.toString() }, 
            { status: 500 }
        );
    }
}
