# Nextify

A production-ready, scalable Next.js 16 boilerplate with feature-based architecture.

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
```

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

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/nextify?schema=public
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
pnpm test         # Run Playwright tests
pnpm test:ui      # Run Playwright tests with UI
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

## License

MIT
