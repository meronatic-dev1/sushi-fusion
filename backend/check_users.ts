import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:merodev@localhost:5432/sushi_fusion?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Database User Check ---');
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
    }
  });
  console.table(users);
  
  const admins = users.filter(u => u.role === 'ADMIN');
  console.log('\nAdmins found:', admins.length);
  admins.forEach(a => console.log(`- ${a.email} (${a.role})`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
