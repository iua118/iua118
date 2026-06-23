# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CRM System** - A comprehensive, multi-platform customer relationship management platform supporting web, mobile (React Native), and desktop (Tauri) applications. Designed for teams of ~20 users managing leads, deals, contacts, and sales pipelines.

**Architecture**: Monorepo with NestJS backend, Next.js web, React Native mobile, and Tauri desktop apps.

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | NestJS + TypeScript | ^10.3.0 |
| Frontend Web | Next.js 14 + React 18 | ^14.0.0 |
| Mobile | React Native + Expo | ^51.0.0 |
| Desktop | Tauri + React | ^1.5.0 |
| Database | PostgreSQL | 16 |
| ORM | Prisma | ^5.7.0 |
| Cache | Redis | 7 |
| Storage | MinIO (S3-compatible) | latest |
| Real-time | Socket.io | ^4.7.2 |
| UI Components | shadcn/ui + Radix | latest |
| Styling | TailwindCSS | ^3.3.6 |

## Quick Start

### Prerequisites
- Node.js 20+ and npm 10+
- Docker and Docker Compose (for local development)
- PostgreSQL 16 (via Docker Compose)

### Setup Local Development

```bash
# 1. Install dependencies for all workspaces
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start Docker services (PostgreSQL, Redis, MinIO)
npm run docker:up

# 4. Run database migrations
npm run db:migrate

# 5. Start all services in development mode
npm run dev

# Individual services:
npm run backend:dev   # Backend on http://localhost:3001
npm run web:dev       # Web on http://localhost:3000
npm run mobile:dev    # Mobile via Expo
npm run desktop:dev   # Desktop app
```

## Build & Test Commands

### Backend
```bash
# Development
cd backend && npm run dev

# Build
npm run build --workspace=crm-backend

# Run migrations
npm run db:migrate
npm run db:reset      # ⚠️ DESTRUCTIVE - resets database

# Test
npm test --workspace=crm-backend

# Lint & Format
npm run lint --workspace=crm-backend
npm run format --workspace=crm-backend
```

### Frontend Web
```bash
# Development
cd web && npm run dev

# Build for production
npm run build --workspace=crm-web

# Lint
npm run lint --workspace=crm-web
```

### Mobile
```bash
# Start Expo dev server
cd mobile && npm run start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Docker
```bash
# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

## Project Architecture

### Monorepo Structure
```
iua118/
├── backend/              # NestJS API server
│   ├── src/modules/     # Feature modules (leads, deals, contacts, etc.)
│   ├── prisma/          # Database schema and migrations
│   └── Dockerfile
├── web/                 # Next.js web application
│   ├── app/            # Next.js app directory (routes, layouts)
│   ├── components/     # React components
│   └── lib/            # Utilities, API clients
├── mobile/             # React Native (Expo) mobile app
├── desktop/            # Tauri desktop app
├── shared/             # Shared types and utilities
├── docker-compose.yml  # Local dev environment
└── package.json        # Workspace root (pnpm workspaces)
```

### Core Data Model

**Central Entities**:
- **User**: Team members with roles (ADMIN, MANAGER, USER, VIEWER)
- **Lead**: Prospective customers captured from multiple sources
- **Contact**: Individual person (often associated with Account or Lead)
- **Account**: Company/organization record
- **Deal**: Sales opportunity with pipeline stages and probability
- **Task**: Action items linked to deals, leads, or contacts
- **Activity**: Audit trail of all actions (CRM-wide timeline)

**Relations** (simplified):
- Lead → (converts to) → Contact → Account
- Account → contains → Contacts
- Deal → includes → Contacts (many-to-many via DealContact)
- All entities → Activities (audit trail)

See `backend/prisma/schema.prisma` for the complete schema.

### API Architecture

NestJS modular architecture with feature-based modules:
- `auth/` - JWT authentication, user login/register
- `users/` - User management
- `leads/` - Lead capture, distribution, conversion
- `deals/` - Sales pipeline and deal management
- `contacts/` - Contact information and relationships
- `accounts/` - Company/organization accounts
- `tasks/` - Task and subtask management
- `communication/` - Emails, calls, meetings
- `automation/` - Automation sequences and workflows
- `reports/` - Analytics and reporting

Each module follows the pattern:
```
module-name/
├── module-name.module.ts      # Module definition
├── module-name.service.ts     # Business logic
├── module-name.controller.ts  # HTTP endpoints
└── dto/                        # Data transfer objects
```

### Frontend Architecture

**Next.js App Router** structure:
- `(auth)/` - Authentication pages (login, register)
- `(dashboard)/` - Protected dashboard and features
  - `leads/` - Lead management pages
  - `deals/` - Deal and pipeline pages
  - `contacts/` - Contact management
  - `tasks/` - Task management
  - `reports/` - Analytics dashboards

**State Management**: Zustand + TanStack Query
- Global app state: Zustand
- Server state (API data): TanStack Query (React Query)

**Component Library**: shadcn/ui + custom components

## Development Conventions

### Code Organization

**Backend (NestJS)**:
1. Services contain business logic, no HTTP concerns
2. Controllers handle HTTP - no heavy logic
3. DTOs for input validation using class-validator
4. Prisma for all database access
5. Modules group related features

**Frontend (Next.js)**:
1. Components in `components/` follow single responsibility
2. API calls via `lib/api/` utility functions (using axios)
3. TanStack Query hooks for server state
4. Zustand stores for client state
5. shadcn/ui for standard components

### Naming Conventions

- **Enums**: PascalCase, singular (e.g., `LeadStatus`, `UserRole`)
- **Database Models**: PascalCase (e.g., `User`, `Deal`)
- **Tables**: snake_case, plural (e.g., `users`, `automation_sequences`)
- **Routes**: kebab-case (e.g., `/api/leads`, `/dashboard/sales-pipeline`)
- **Files**: lowercase.ts or PascalCase.tsx (components only)

### Validation & Type Safety

- Always use TypeScript in strict mode
- Validate API inputs with DTOs and class-validator
- Share types between frontend and backend via `@crm/shared` package
- Use `zod` or `class-validator` for runtime validation

### Error Handling

- Backend: Custom exception filters in NestJS
- Frontend: Centralized error handling in API utilities
- All errors logged with context (userId, endpoint, etc.)
- User-facing errors should be sanitized (no stack traces)

## Important Setup Notes

### Environment Variables

Copy `.env.example` to `.env` and update:
- `DATABASE_URL`: Must match Docker Compose PostgreSQL credentials
- `JWT_SECRET`: Change for production (use strong random string)
- `NEXT_PUBLIC_API_URL`: Backend URL for frontend
- `NODE_ENV`: "development" or "production"

Database credentials in docker-compose.yml MUST match `DATABASE_URL`.

### Database Migrations

Prisma is the migration tool:
```bash
# Create new migration (after schema changes)
npm run db:migrate -- --name <migration_name>

# Apply pending migrations
npm run db:migrate deploy

# Reset database (development only)
npm run db:reset
```

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Key Dependencies & Their Purposes

| Package | Purpose | Notes |
|---------|---------|-------|
| NestJS | Backend framework | Enterprise-grade, strong DI |
| Prisma | ORM | Type-safe database access |
| Socket.io | Real-time updates | Live notifications, collaborative features |
| TanStack Query | Server state | Automatic caching, synchronization |
| shadcn/ui | UI components | Built on Radix, Tailwind, fully customizable |
| Zustand | Client state | Lightweight, simpler than Redux |
| TailwindCSS | Styling | Utility-first, excellent DX |
| JWT | Authentication | Stateless token-based auth |
| Bcrypt | Password hashing | Industry standard |

## Common Development Tasks

### Adding a New Module (Backend)

1. Create folder in `backend/src/modules/<module-name>/`
2. Create `.module.ts`, `.service.ts`, `.controller.ts`
3. Add Prisma models to `schema.prisma` if needed
4. Create DTOs in `dto/` folder
5. Import module in `app.module.ts`

### Adding a New API Endpoint

1. Add method to service (contains logic)
2. Add route to controller (HTTP handler)
3. Add DTO for validation if needed
4. Test with curl or Postman
5. Update API client in frontend

### Adding a New Page (Frontend)

1. Create folder in `app/(dashboard)/<feature>/`
2. Add `page.tsx` for the route
3. Create component in `components/<feature>/`
4. Use TanStack Query hook for data fetching
5. Add to navigation if needed

### Database Schema Changes

1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate -- --name <description>`
3. Prisma generates migrations automatically
4. Commit both schema and migration files

## Debugging Tips

- **Backend logs**: `npm run backend:dev` shows all server logs
- **Database**: Access PgAdmin on http://localhost:5050 (admin@crm.local / admin)
- **Redis**: Use Redis CLI or tools like RedisInsight
- **MinIO**: Access console on http://localhost:9001 (minioadmin / minioadmin)
- **Network**: Check `NEXT_PUBLIC_API_URL` in frontend `.env`

## Performance Considerations

- Prisma queries should use `select` to fetch only needed fields
- Use pagination for list endpoints
- Implement caching strategies with Redis
- TanStack Query handles request deduplication
- Consider database indexing for frequently filtered fields

---

**Last Updated**: 2024-06-23  
**Status**: Foundation phase - Core services implemented, auth and CRUD operations ready for feature development
