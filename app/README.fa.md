## فرانت‌اند (React + Vite + TypeScript)

فرانت‌اند سبک پروژه RBAC با React 19، Vite 7، TypeScript 5، MUI، React Router، React Hook Form، Zod و TanStack Query.

### قابلیت‌ها
- احراز هویت (لاگین/ثبت‌نام) با اعتبارسنجی فرم
- واکشی داده با Axios + TanStack Query و مدیریت خطای متمرکز
- UI با MUI و Toast
- مسیربندی با React Router

### پیش‌نیاز
- Node.js 20+ (بررسی‌شده با Node.js 22)
- npm/pnpm/yarn (در مثال‌ها npm)

### متغیرهای محیطی
از `env.example` یک `.env` بسازید و مقداردهی کنید:
```bash
cp env.example .env
```
مقادیر رایج:
- `VITE_API_URL` آدرس پایه API بک‌اند (مثلاً `http://localhost:3000`)

توجه: فقط متغیرهایی با پیشوند `VITE_` در کد کلاینت قابل دسترس‌اند.

### نصب
```bash
npm install
```

### اسکریپت‌ها
- `npm run dev` اجرای سرور توسعه Vite روی پورت 5173
- `npm run build` بیلد production در `dist/`
- `npm run preview` پیش‌نمایش بیلد روی پورت 4173
- `npm run start` سرو `dist/` با `serve` (ساده)
- `npm run lint` اجرای ESLint

### توسعه
1) مطمئن شوید بک‌اند روی `VITE_API_URL` در دسترس است.
2) اجرا:
```bash
npm run dev
```
آدرس: `http://localhost:5173`

### بیلد و پیش‌نمایش
```bash
npm run build
npm run preview
```
آدرس پیش‌نمایش: `http://localhost:4173`

### Docker
بیلد و اجرا:
```bash
docker build -t rbac-frontend .
docker run --rm -p 4173:4173 \
  -e VITE_API_URL=http://localhost:3000 \
  rbac-frontend
```
سپس `http://localhost:4173` را باز کنید.

#### استفاده از Docker Compose ریشه مخزن
در صورت استفاده از `docker-compose.yml` ریشه، قبل از اجرای بک‌اند، مایگریشن و سید به‌صورت خودکار انجام می‌شود. اطلاعات ادمین بعد از سید:
- نام کاربری: `admin`
- گذرواژه: `admin`

فرانت‌اند در Docker روی پورت `4173` بالا می‌آید: `http://localhost:4173`.

### یکپارچه‌سازی با بک‌اند
- بک‌اند ریشه پروژه را اجرا کنید (مثلاً `npm run start:dev` یا Docker Compose) و `VITE_API_URL` را درست تنظیم کنید.
- در صورت نیاز `src/services/urls.ts` و پیکربندی پایه axios را به‌روز کنید.

### اطلاعات ورود (پس از سید)
- Admin: `admin / admin`

### عیب‌یابی
- خطای 404 از API: مقدار `VITE_API_URL` و CORS بک‌اند را بررسی کنید.
- صفحه خالی: کنسول و تب شبکه مرورگر را بررسی کنید.
- اعمال نشدن env: بعد از تغییر `.env` سرور Vite را ری‌استارت کنید.

---

# React + TypeScript + Vite
(بخش راهنمای پیش‌فرض Vite برای مرجع در ادامه آمده است.)

