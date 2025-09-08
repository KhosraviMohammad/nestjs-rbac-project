## پروژه RBAC با NestJS (بک‌اند) و React/Vite (فرانت‌اند)

یک سامانه کامل کنترل دسترسی مبتنی بر نقش با بک‌اند NestJS و فرانت‌اند React (در پوشه `app/`).

### نکات برجسته
- احراز هویت با JWT و هش کردن گذرواژه (bcrypt)
- نقش‌ها با فیلد `roleType` (مثل `admin` و `support`)
- پایگاه‌داده PostgreSQL با Prisma ORM
- مستندسازی API با Swagger/OpenAPI
- تست‌های واحد و E2E
- فرانت‌اند: React 19 + Vite 7 + MUI + TanStack Query

## پیش‌نیازها
- Node.js 22 و npm
- PostgreSQL

## راه‌اندازی
1) دریافت کد و نصب وابستگی‌ها
```bash
git clone <repository-url>
cd nestjs-rbac-project
npm install
```

2) تنظیم متغیرهای محیطی
```bash
cp env.example .env
```
مقادیر لازم را تنظیم کنید (نمونه):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nestjs_rbac_db?schema=public"
JWT_SECRET="secret-قوی-قرار-دهید"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
```

3) دیتابیس
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```
اسکریپت سید در `prisma/seed.ts` اجرا می‌شود و کاربرهای پیش‌فرض می‌سازد. اطلاعات ادمین:
- نام کاربری: `admin`
- گذرواژه: `admin`

کاربر پشتیبانی:
- نام کاربری: `support`
- گذرواژه: `password123`

## اجرای بک‌اند
```bash
npm run start:dev
```
آدرس: `http://localhost:3000`

### مستندات API
`http://localhost:3000/api/docs`

## فرانت‌اند (پوشه app/)
راهنمای کامل در `app/README.md` است. شروع سریع:
```bash
cd app
npm install
cp env.example .env   # مقدار VITE_API_URL را تنظیم کنید (مثلاً http://localhost:3000)
npm run dev
```
آدرس توسعه: `http://localhost:5173`

## Docker Compose
با اجرای Docker Compose، مایگریشن‌ها و سید به‌صورت خودکار قبل از بالا آمدن بک‌اند اجرا می‌شوند:
```bash
docker compose up -d --build
```
سرویس `seed` ابتدا `prisma migrate deploy` و سپس `dist/prisma/seed.js` را اجرا می‌کند. سید فقط یک‌بار انجام می‌شود و در اجراهای بعدی رد می‌شود.

## نقش‌ها و احراز هویت
- کاربرها دارای `roleType` هستند (مثل `admin`، `support`).
- بعد از سید، با `admin/admin` می‌توانید وارد شوید.

## امنیت
- JWT
- هش گذرواژه با bcrypt
- اعتبارسنجی ورودی‌ها
- فعال‌سازی CORS

## مجوز
MIT

