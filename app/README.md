## Frontend App (React + Vite + TypeScript)

A lightweight frontend for the NestJS RBAC project, built with React 19, Vite 7, TypeScript 5, MUI, React Router, React Hook Form, Zod, and TanStack Query.

### Features
- **Auth**: Login/Register flows with form validation
- **Data fetching**: Axios + TanStack Query with centralized error handling
- **UI**: MUI components and theming, toast notifications
- **Routing**: React Router

### Requirements
- Node.js 20+ (tested with Node.js 22)
- pnpm/npm/yarn (examples use npm)

### Environment variables
Copy `env.example` to `.env` and set values:

```bash
cp env.example .env
```

Common variables:
- `VITE_API_URL` – Base URL of the backend API (e.g. `http://localhost:3000`)

Vite exposes variables prefixed with `VITE_` to the client code.

### Install
```bash
npm install
```

### Scripts
- `npm run dev` – Start Vite dev server (HMR) on port 5173
- `npm run build` – Type-check and build a production bundle into `dist/`
- `npm run preview` – Preview the production build locally on port 4173
- `npm run start` – Serve `dist/` with `serve` on port 4173 (for simple hosting)
- `npm run lint` – Run ESLint

### Development
1) Ensure backend is running and accessible at `VITE_API_URL`.
2) Start the app:
```bash
npm run dev
```
App will be available at `http://localhost:5173`.

### Build and preview
```bash
npm run build
npm run preview
```
Preview runs at `http://localhost:4173`.

### Docker
Build a production image and run it:
```bash
docker build -t rbac-frontend .
docker run --rm -p 4173:4173 \
  -e VITE_API_URL=http://localhost:3000 \
  rbac-frontend
```
Then open `http://localhost:4173`.

#### Using root Docker Compose
If you use the repository's root `docker-compose.yml` (recommended for local), the backend will run migrations and seed automatically before starting. Default admin credentials after seeding:

- username: `admin`
- password: `admin`

Frontend (Docker) will be available at: `http://localhost:4173`.

### Project structure (key folders)
- `src/pages` – Route pages (e.g., `Login`, `Register`, `Users`)
- `src/components` – Reusable UI components
- `src/hooks` – App-specific hooks (e.g., auth, users)
- `src/services` – Axios instance, API clients, URL helpers
- `src/schemas` – Zod validation schemas
- `src/providers` – App providers (theme, query, etc.)
- `src/utils` – Utilities (error handling)

### Backend integration
- Ensure the NestJS backend in the repository root is running (e.g., `npm run start:dev` or via Docker Compose) and reachable via `VITE_API_URL`.
- Update `src/services/urls.ts` and axios base config (if needed) to point to the correct API base URL.

### Credentials (after seed)
- Admin: `admin / admin`

### Troubleshooting
- 404s from API: verify `VITE_API_URL` and CORS on backend
- Empty pages: check network tab and console for errors
- Env not picked up: restart Vite after changing `.env`

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
