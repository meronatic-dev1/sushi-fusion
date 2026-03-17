'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserSync() {
    const { user, isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) return;

        const syncUser = async () => {
            try {
                // Use a session storage flag to avoid repeated syncs in same session
                const syncKey = `synced_${user.id}`;
                if (sessionStorage.getItem(syncKey)) return;

                console.log('Syncing user to backend...');
                const res = await fetch('/api/clerk/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName || user.username || 'User',
                        phone: user.primaryPhoneNumber?.phoneNumber || null,
                    }),
                });

                if (res.ok) {
                    sessionStorage.setItem(syncKey, 'true');
                    console.log('User synced successfully');
                } else {
                    const errData = await res.json().catch(() => ({ message: 'No error body' }));
                    console.error('User sync failed:', errData.message);
                }
            } catch (err) {
                console.error('Error in UserSync component:', err);
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user]);

    return null;
}
