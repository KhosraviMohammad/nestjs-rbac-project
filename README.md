## NestJS RBAC Project (Backend + Frontend)

A full-stack RBAC system with a NestJS backend and a React (Vite) frontend located in `app/`.

### Highlights
- **JWT Authentication** with secure password hashing (bcrypt)
- **RBAC via roleType** field (e.g., `admin`, `support`)
- **Prisma ORM** with PostgreSQL
- **Swagger/OpenAPI** docs
- **Testing**: unit and E2E
- **Frontend**: React 19 + Vite 7 + MUI + TanStack Query

## Prerequisites
- Node.js 22
- PostgreSQL
- npm (or yarn/pnpm)

## Setup
1) Clone and install
```bash
git clone <repository-url>
cd nestjs-rbac-project
npm install
```

2) Environment
```bash
cp env.example .env
```
Set database and JWT variables (examples):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nestjs_rbac_db?schema=public"
JWT_SECRET="replace-with-strong-secret"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
```

3) Database
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```
Seeding uses `prisma/seed.ts` and creates default users. Admin credentials are:
- username: `admin`
- password: `admin`

Support user credentials:
- username: `support`
- password: `password123`

## Run Backend
```bash
npm run start:dev
```
Backend: `http://localhost:3000`

### API Docs
`http://localhost:3000/api/docs`

## Frontend (app/)
The frontend lives in `app/`. See `app/README.md` for full details.

Quick start:
```bash
cd app
npm install
cp env.example .env  # set VITE_API_URL (e.g., http://localhost:3000)
npm run dev
```
Dev server: `http://localhost:5173`

Production build + preview:
```bash
npm run build
npm run preview
```

## Docker Compose
Using Docker Compose will automatically run migrations and seed the database before starting the backend:

```bash
docker compose up -d --build
```

The `seed` service runs `prisma migrate deploy` and then executes `dist/prisma/seed.js`. Seeding is performed once and skipped on subsequent runs.

## Auth & Roles
- Users have a `roleType` such as `admin` or `support` (see `prisma/seed.ts`).
- Use `admin/admin` to log in as the default administrator after seeding.

## Project Structure (backend)
```
src/
├── common/
│   ├── decorators/          # Audit, roles, permissions decorators
│   └── guards/              # Roles/permissions guards
├── modules/
│   ├── auth/
│   ├── users/
│   ├── email/
│   ├── reports/
│   └── database/
├── app.module.ts
└── main.ts
```

## Security
- JWT-based auth
- Bcrypt password hashing
- Input validation (class-validator)
- CORS enabled

## Deployment (backend)
Typical Dockerfile example:
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

Required env in production: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT`.

## License
MIT

---

For Persian documentation, see `README.fa.md`.
