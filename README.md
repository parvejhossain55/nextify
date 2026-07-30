# Nextify

A production-ready, scalable Next.js 16 boilerplate with authentication, Prisma, PostgreSQL, reusable UI components, and feature-based architecture.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Base UI)
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Zustand
- **ORM**: Prisma 7
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js v5
- **HTTP Client**: Axios
- **Git Hooks**: Husky + lint-staged
- **Linting**: ESLint + Prettier
- **Testing**: Playwright
- **Package Manager**: pnpm

## Architecture

### Feature-Based Structure

```
src/
├── app/              # Next.js App Router
├── features/         # Feature modules
│   ├── auth/         # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── api/
│   └── user/         # User feature
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── api/
├── shared/           # Shared utilities
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── config/
├── lib/              # Core libraries
│   ├── auth/         # NextAuth configuration
│   ├── prisma/       # Prisma client
│   └── query-client/ # TanStack Query provider
└── store/            # Zustand stores
test/
└── e2e/              # End-to-end tests (Playwright)
```

## Features

- 🔐 Authentication with NextAuth.js
- 👥 User management with role-based access
- 📝 Form validation with React Hook Form + Zod
- 🗄️ Database ORM with Prisma
- 🎨 Beautiful UI with shadcn/ui
- 📊 Data fetching with TanStack Query
- 🧪 E2E testing with Playwright
- 🎯 Type-safe with TypeScript
- 🚀 Optimized for production

## Screenshots

![Dashboard screenshot](screenshot/dashboard.jpg)

Screenshots are available in the `screenshot/` folder.

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm
- PostgreSQL

### Installation

```bash
# Clone the repository
git clone https://github.com/parvejhossain55/nextify.git
cd nextify

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run Prisma migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

### Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nextify"
AUTH_SECRET="your-auth-secret"
AUTH_URL="http://127.0.0.1:3000"
```

Generate a strong `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

### Set Up the Database

Run the Prisma migration and generate the Prisma client:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

The Prisma client is generated into `generated/prisma`.

### Run the Development Server

```bash
pnpm dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

## Authentication

Nextify uses NextAuth.js with a credentials provider. Users can register with a name, email, and password. Passwords are hashed with `bcryptjs` before being stored.

The dashboard route is protected. Unauthenticated users are redirected to `/login`, and users with the `ADMIN` role can see the user list.

## Database

The Prisma schema includes:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Role`

The current datasource is PostgreSQL and reads its connection string from `DATABASE_URL`.

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
pnpm test:install # Install Playwright browsers
pnpm test         # Run Playwright tests
pnpm test:ui      # Run Playwright tests with UI
pnpm test:headed  # Run Playwright tests in headed mode
```

## Testing

E2E tests are located in `test/e2e/` and use Playwright.

Install Playwright browsers before running tests for the first time:

```bash
pnpm test:install
```

Then run:

```bash
pnpm test
```

## License

This project is licensed under the terms in [LICENSE](./LICENSE).
