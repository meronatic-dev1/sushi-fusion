import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:merodev@localhost:5432/sushi_fusion?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const targetEmail = 'sushi.fusion.uae@gmail.com';
  const targetPassword = 'pecjab-qyQman-kirqe2';
  const hash = await bcrypt.hash(targetPassword, 12);
  const secretKey = process.env.CLERK_SECRET_KEY;

  console.log(`Starting Admin update for: ${targetEmail}`);

  let clerkUserId: string | null = null;

  if (secretKey) {
    try {
      console.log('Fetching users from Clerk...');
      const clerkRes = await fetch('https://api.clerk.com/v1/users?limit=100', {
        headers: { Authorization: `Bearer ${secretKey}` }
      });
      
      if (clerkRes.ok) {
        const users = await clerkRes.json() as any[];
        const user = users.find(u => 
          u.email_addresses.some((e: any) => e.email_address === targetEmail)
        );
        
        if (user) {
          clerkUserId = user.id;
          console.log(`Found Clerk user: ${clerkUserId}`);
          
          // Update Clerk Metadata
          console.log('Updating Clerk public metadata...');
          const metaRes = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}/metadata`, {
            method: 'PATCH',
            headers: { 
              Authorization: `Bearer ${secretKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              public_metadata: { role: 'admin' }
            })
          });
          
          if (metaRes.ok) {
            console.log('✅ Clerk metadata updated successfully.');
          } else {
            console.error('❌ Failed to update Clerk metadata:', await metaRes.text());
          }
        } else {
          console.log(`⚠️ User ${targetEmail} not found in Clerk. Please sign up first.`);
        }
      } else {
        console.error('❌ Failed to fetch Clerk users:', await clerkRes.text());
      }
    } catch (err) {
      console.error('⚠️ Clerk Sync Error:', err);
    }
  } else {
    console.log('⚠️ CLERK_SECRET_KEY not found in environment. Skipping Clerk sync.');
  }

  // Database Update
  console.log('Checking database for conflicts...');
  const existingRecords = await prisma.user.findMany({
    where: { email: targetEmail }
  });

  if (existingRecords.length > 0) {
    console.log(`Found ${existingRecords.length} records with email ${targetEmail}.`);
    
    // If we have a Clerk ID, we want to make sure THAT specific record exists and is correct
    if (clerkUserId) {
      // Delete any records that DON'T have the correct Clerk ID but have the same email
      const wrongIdRecords = existingRecords.filter(r => r.id !== clerkUserId);
      if (wrongIdRecords.length > 0) {
        console.log(`Cleaning up ${wrongIdRecords.length} records with mismatched IDs...`);
        await prisma.user.deleteMany({
          where: { id: { in: wrongIdRecords.map(r => r.id) } }
        });
      }
      
      // Now update or create the correct record
      console.log(`Upserting ADMIN record for ${targetEmail} with ID ${clerkUserId}...`);
      await prisma.user.upsert({
        where: { id: clerkUserId },
        update: {
          email: targetEmail,
          password: hash,
          role: 'ADMIN',
          name: 'Admin'
        },
        create: {
          id: clerkUserId,
          email: targetEmail,
          password: hash,
          role: 'ADMIN',
          name: 'Admin'
        }
      });
      console.log('✅ Database updated successfully with Clerk ID.');
    } else {
      // No Clerk ID found/available, just update the first existing record or create one
      console.log('No Clerk ID available, updating existing record role to ADMIN...');
      await prisma.user.update({
        where: { id: existingRecords[0].id },
        data: {
          role: 'ADMIN',
          password: hash
        }
      });
      console.log('✅ Database updated (using existing internal ID).');
    }
  } else {
    // No existing record, create one
    console.log(`No existing record found for ${targetEmail}. Creating...`);
    await prisma.user.create({
      data: {
        id: clerkUserId || undefined, // Use Clerk ID if we have it
        email: targetEmail,
        password: hash,
        name: 'Admin',
        role: 'ADMIN'
      }
    });
    console.log('✅ New Admin user created in database.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
