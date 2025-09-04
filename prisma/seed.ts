import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  });

  const supportRole = await prisma.role.upsert({
    where: { name: 'support' },
    update: {},
    create: {
      name: 'support',
      description: 'Support staff with limited access',
    },
  });

  console.log('✅ Roles created');

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
    },
  });

  console.log('✅ Users created');

  // Assign roles to users
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: supportUser.id,
        roleId: supportRole.id,
      },
    },
    update: {},
    create: {
      userId: supportUser.id,
      roleId: supportRole.id,
    },
  });

  console.log('✅ User roles assigned');

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