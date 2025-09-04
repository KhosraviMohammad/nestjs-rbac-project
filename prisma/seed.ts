import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      roleType: 'admin',
    },
  });

  const supportUser = await prisma.user.upsert({
    where: { username: 'support' },
    update: {},
    create: {
      email: 'support@example.com',
      username: 'support',
      password: hashedPassword,
      firstName: 'Support',
      lastName: 'Staff',
      roleType: 'support',
    },
  });

  console.log('✅ Users created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin: admin / password123');
  console.log('Support: support / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });