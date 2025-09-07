import { PrismaClient } from '@prisma/client';
import { PasswordUtil } from '../src/common/utils/password.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const hashedPassword = await PasswordUtil.hashPassword('password123');
  const adminPassword = await PasswordUtil.hashPassword('admin');

  // Admin user
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      roleType: 'admin',
      emailVerified: true,
      isActive: true,
    },
  });

  // Support users
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
      emailVerified: true,
      isActive: true,
    },
  });

  // Create fake users
  const fakeUsers = [
    {
      email: 'john.doe@example.com',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      roleType: 'support',
    },
    {
      email: 'jane.smith@example.com',
      username: 'janesmith',
      firstName: 'Jane',
      lastName: 'Smith',
      roleType: 'support',
    },
    {
      email: 'mike.johnson@example.com',
      username: 'mikej',
      firstName: 'Mike',
      lastName: 'Johnson',
      roleType: 'support',
    },
    {
      email: 'sarah.wilson@example.com',
      username: 'sarahw',
      firstName: 'Sarah',
      lastName: 'Wilson',
      roleType: 'admin',
    },
    {
      email: 'david.brown@example.com',
      username: 'davidb',
      firstName: 'David',
      lastName: 'Brown',
      roleType: 'support',
    },
    {
      email: 'lisa.garcia@example.com',
      username: 'lisag',
      firstName: 'Lisa',
      lastName: 'Garcia',
      roleType: 'support',
    },
    {
      email: 'robert.miller@example.com',
      username: 'robertm',
      firstName: 'Robert',
      lastName: 'Miller',
      roleType: 'support',
    },
    {
      email: 'emily.davis@example.com',
      username: 'emilyd',
      firstName: 'Emily',
      lastName: 'Davis',
      roleType: 'admin',
    },
  ];

  for (const userData of fakeUsers) {
    await prisma.user.upsert({
      where: { username: userData.username },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        emailVerified: true,
        isActive: Math.random() > 0.2, // 80% chance of being active
      },
    });
  }

  console.log('✅ Users created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin: admin / admin');
  console.log('Support: support / password123');
  console.log('Fake Users: All use password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });