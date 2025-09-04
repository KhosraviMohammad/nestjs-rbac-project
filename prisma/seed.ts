import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { name: 'users:read' },
      update: {},
      create: {
        name: 'users:read',
        description: 'Read users',
        resource: 'users',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'users:write' },
      update: {},
      create: {
        name: 'users:write',
        description: 'Create and update users',
        resource: 'users',
        action: 'write',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'users:delete' },
      update: {},
      create: {
        name: 'users:delete',
        description: 'Delete users',
        resource: 'users',
        action: 'delete',
      },
    }),

    prisma.permission.upsert({
      where: { name: 'roles:read' },
      update: {},
      create: {
        name: 'roles:read',
        description: 'Read roles',
        resource: 'roles',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { name: 'roles:write' },
      update: {},
      create: {
        name: 'roles:write',
        description: 'Create and update roles',
        resource: 'roles',
        action: 'write',
      },
    }),
  ]);

  console.log('✅ Permissions created');

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

  // Assign permissions to roles
  // Admin gets all permissions
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Support gets limited permissions (read only)
  const supportPermissions = permissions.filter(
    (p) => p.name === 'users:read' || p.name === 'roles:read'
  );
  for (const permission of supportPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: supportRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: supportRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Role permissions assigned');

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
