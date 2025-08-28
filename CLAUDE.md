# YT Studio - Claude Development Notes

## Project Overview
YouTube Title Generator with Google OAuth authentication, Supabase backend, and generation tracking via tRPC.

## Package Manager
**Use PNPM only** - This project uses pnpm as the package manager as specified in package.json:
```json
"packageManager": "pnpm@10.7.1+sha512.2d92c86b7928dc8284f53494fb4201f983da65f0fb4f0d40baafa5cf628fa31dae3e5968f12466f17df7e97310e30f343a648baea1b9b350685dafafffdf5808"
```

### Important Commands:
- `pnpm install` - Install dependencies (includes `prisma generate` via postinstall)
- `pnpm run dev` - Start development server
- `pnpm run build` - Generate Prisma client and build for production
- `pnpm run typecheck` - Run TypeScript checks
- `npx prisma generate` - Generate Prisma client manually
- `npx prisma migrate dev` - Run database migrations

## Environment Variables Required

### Development (.env.local):
```env
NEXT_PUBLIC_SUPABASE_URL=https://rpqnorqwosfqoenhwmiq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@[host]:5432/postgres"
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Production:
```env
NEXT_PUBLIC_SUPABASE_URL=https://rpqnorqwosfqoenhwmiq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@[host]:5432/postgres"
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_SITE_URL="https://studio.florenzerstling.com"
```

## Key Features Implemented

### 1. Authentication
- Google OAuth via Supabase
- Email/password authentication
- Auth modal with sign up/sign in forms
- User session management

### 2. Generation Limits
- 10 generations per user limit
- Real-time tracking via tRPC
- UI shows remaining generations
- Button disabled when limit reached

### 3. Event Tracking
- PostgreSQL database with Prisma ORM
- Events table tracks user actions
- tRPC API for tracking generation clicks
- Generation counter in UI

### 4. Technical Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: PostgreSQL via Supabase with Prisma ORM
- **API**: tRPC v11 with React Query
- **AI**: Google Gemini for title generation

## Database Schema

### Events Table:
```sql
model events {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id        String?  @db.Uuid
  session_id     String?
  event_type     String   -- e.g., "title_generation"
  event_category String?  -- e.g., "product"
  event_action   String?  -- e.g., "generate"
  event_label    String?  -- e.g., "button_click"
  event_value    Float?
  timestamp      DateTime @default(now()) @db.Timestamptz(6)
}
```

## Development Notes

### Google OAuth Setup:
- Authorized redirect URI: `https://rpqnorqwosfqoenhwmiq.supabase.co/auth/v1/callback`
- Production domain: `https://studio.florenzerstling.com`

### tRPC Procedures:
- `events.trackEvent` - Track user actions
- `events.getUserGenerationCount` - Get user's generation count
- `events.canUserGenerate` - Check if user can generate more titles

### Common Issues:
1. **Lockfile sync**: Always use `pnpm install` to keep lockfile updated
2. **OAuth redirects**: Ensure `NEXT_PUBLIC_SITE_URL` is set correctly for production
3. **Database migrations**: Run `npx prisma migrate dev` after schema changes
4. **Prisma Client**: If you get "Module has no exported member 'PrismaClient'", run `npx prisma generate`
5. **Build scripts**: The `postinstall` script ensures Prisma client is generated after dependency installation

## Deployment
- Platform: Vercel
- Ensure all environment variables are set in Vercel dashboard
- Database migrations run automatically via Prisma
- Uses pnpm as package manager (specified in package.json)


## Git and Versioning

whenever I write "commit" run the git-commit-writer subagent todo the commit for me 