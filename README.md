# NestJS Role-Based Access Control (RBAC) Project

A comprehensive NestJS application implementing Role-Based Access Control with JWT authentication, comprehensive testing, and API documentation.

## 🚀 Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Flexible permission system with roles and permissions
- **Database Integration**: PostgreSQL with Prisma ORM
- **API Documentation**: Swagger/OpenAPI documentation
- **Comprehensive Testing**: Unit tests and E2E tests
- **Type Safety**: Full TypeScript support
- **Validation**: Request validation with class-validator
- **Security**: Password hashing with bcrypt

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestjs-rbac-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your database credentials and JWT secret:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/nestjs_rbac_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="24h"
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with initial data
   npm run db:seed
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:
`http://localhost:3000/api/docs`

## 🧪 Testing

### Run Unit Tests
```bash
npm run test
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run Tests with Coverage
```bash
npm run test:cov
```

## 🏗️ Project Structure

```
src/
├── common/
│   ├── decorators/          # Custom decorators (Roles, Permissions)
│   └── guards/              # Authorization guards
├── modules/
│   ├── auth/                # Authentication module
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── guards/          # JWT auth guard
│   │   └── strategies/      # Passport strategies
│   ├── users/               # User management module
│   ├── roles/               # Role management module
│   ├── posts/               # Example module with RBAC
│   └── prisma/              # Database service
├── app.module.ts            # Main application module
└── main.ts                  # Application entry point
```

## 🔐 Authentication & Authorization

### Default Test Accounts

After running the seed script, you can use these test accounts:

- **Admin**: `admin@example.com` / `password123`
- **Moderator**: `moderator@example.com` / `password123`
- **User**: `user@example.com` / `password123`

### Role Hierarchy

1. **Admin**: Full access to all resources
2. **Moderator**: Limited admin access (can manage posts, read users)
3. **User**: Basic access (can read posts and users)

### Permission System

The application uses a granular permission system:

- `users:read` - Read user information
- `users:write` - Create/update users
- `users:delete` - Delete users
- `posts:read` - Read posts
- `posts:write` - Create/update posts
- `posts:delete` - Delete posts
- `roles:read` - Read role information
- `roles:write` - Create/update roles

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

### Users (Protected)
- `GET /users` - Get all users (requires `users:read`)
- `GET /users/:id` - Get user by ID (requires `users:read`)
- `POST /users` - Create user (requires `admin` role + `users:write`)
- `PATCH /users/:id` - Update user (requires `admin` role + `users:write`)
- `DELETE /users/:id` - Delete user (requires `admin` role + `users:delete`)

### Roles (Protected)
- `GET /roles` - Get all roles (requires `roles:read`)
- `GET /roles/:id` - Get role by ID (requires `roles:read`)
- `POST /roles` - Create role (requires `admin` role + `roles:write`)
- `PATCH /roles/:id` - Update role (requires `admin` role + `roles:write`)
- `DELETE /roles/:id` - Delete role (requires `admin` role + `roles:write`)

### Posts (Protected)
- `GET /posts` - Get all posts (requires `posts:read`)
- `GET /posts/published` - Get published posts (public)
- `GET /posts/:id` - Get post by ID (requires `posts:read`)
- `POST /posts` - Create post (requires `posts:write`)
- `PATCH /posts/:id` - Update post (author/moderator/admin + `posts:write`)
- `DELETE /posts/:id` - Delete post (author/admin + `posts:delete`)

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Role-Based Access**: Granular permission system
- **Input Validation**: Request validation with class-validator
- **CORS**: Cross-origin resource sharing enabled
- **Environment Variables**: Sensitive data in environment variables

## 🗄️ Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication
- **Role**: User roles (admin, moderator, user)
- **Permission**: Granular permissions
- **UserRole**: Many-to-many relationship between users and roles
- **RolePermission**: Many-to-many relationship between roles and permissions
- **Post**: Example content entity

## 🚀 Deployment

### Using Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### Environment Variables for Production

Make sure to set these environment variables in production:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Strong secret key for JWT signing
- `NODE_ENV`: Set to `production`
- `PORT`: Application port (default: 3000)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📞 Support

If you have any questions or need help, please open an issue in the repository.
