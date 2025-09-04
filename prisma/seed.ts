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

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: {
      name: 'moderator',
      description: 'Moderator with limited admin access',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Regular user with basic access',
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

  // Moderator gets no permissions (since posts are removed)
  const moderatorPermissions: any[] = [];
  for (const permission of moderatorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: moderatorRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: moderatorRole.id,
        permissionId: permission.id,
      },
    });
  }

  // User gets basic permissions
  const userPermissions = permissions.filter(
    (p) => p.name === 'users:read'
  );
  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
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
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  const moderatorUser = await prisma.user.upsert({
    where: { username: 'moderator' },
    update: {},
    create: {
      username: 'moderator',
      password: hashedPassword,
      firstName: 'Moderator',
      lastName: 'User',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: hashedPassword,
      firstName: 'Regular',
      lastName: 'User',
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
        userId: moderatorUser.id,
        roleId: moderatorRole.id,
      },
    },
    update: {},
    create: {
      userId: moderatorUser.id,
      roleId: moderatorRole.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: regularUser.id,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId: regularUser.id,
      roleId: userRole.id,
    },
  });

  console.log('✅ User roles assigned');



  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin: admin / password123');
  console.log('Moderator: moderator / password123');
  console.log('User: user / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
