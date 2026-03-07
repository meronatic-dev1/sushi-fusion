const fs = require('fs');

async function setFirstUserAdmin() {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) env[match[1].trim()] = match[2].trim();
    });

    const secretKey = env['CLERK_SECRET_KEY'];
    if (!secretKey) throw new Error('CLERK_SECRET_KEY not found in .env.local');

    console.log('Fetching Clerk users...');
    const res = await fetch('https://api.clerk.com/v1/users?limit=100', {
      headers: { Authorization: `Bearer ${secretKey}` }
    });

    if (!res.ok) throw new Error('Failed to fetch users: ' + await res.text());

    const users = await res.json();

    const targetEmail = 'dev1@meronatic.com';
    const targetUser = users.find(u =>
      u.email_addresses.some(e => e.email_address === targetEmail)
    );

    if (!targetUser) {
      console.log(`❌ User with email ${targetEmail} not found in Clerk! Please sign up first at http://localhost:3000/admin/login`);
      return;
    }

    console.log(`Found target user: ${targetEmail} (${targetUser.id})`);

    const updateRes = await fetch(`https://api.clerk.com/v1/users/${targetUser.id}/metadata`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        public_metadata: { role: 'admin' }
      })
    });

    if (!updateRes.ok) throw new Error('Failed to update user: ' + await updateRes.text());

    console.log(`✅ Successfully made ${targetEmail} a Super Admin!`);
    console.log('You can now log into the /admin dashboard.');

  } catch (error) {
    console.error('Error:', error.message || error);
  }
}

setFirstUserAdmin();
