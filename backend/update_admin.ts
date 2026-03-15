import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:merodev@localhost:5432/sushi_fusion?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash('pecjab-qyQman-kirqe2', 12);
  
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  
  if (admin) {
    console.log('Found ADMIN user, updating...', admin.email);
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        email: 'sushi.fusion.uae@gmail.com',
        password: hash
      }
    });
    console.log('Admin user updated!');
  } else {
    console.log('No ADMIN user found, looking for sushi.fusion.uae@gmail.com...');
    admin = await prisma.user.findFirst({ where: { email: 'sushi.fusion.uae@gmail.com' } });
    if (admin) {
      console.log('Found user with target email, setting role to ADMIN and updating password...', admin.id);
      await prisma.user.update({
        where: { id: admin.id },
        data: { role: 'ADMIN', password: hash }
      });
      console.log('User updated to Admin!');
    } else {
      console.log('No ADMIN or target user found, creating a new Admin user...');
      await prisma.user.create({
        data: {
          email: 'sushi.fusion.uae@gmail.com',
          password: hash,
          name: 'Admin',
          role: 'ADMIN'
        }
      });
      console.log('New Admin user created!');
    }
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
