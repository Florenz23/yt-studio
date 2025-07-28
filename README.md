# YT Studio - YouTube Title Generator

A powerful YouTube title generator with Google OAuth authentication, generation tracking, and user limits. Built with Next.js 15, Supabase, tRPC, and Google Gemini AI.

## Features

- 🎯 **AI-Powered Title Generation**: Generate 5 high-converting YouTube titles using Google Gemini
- 🔐 **Authentication**: Google OAuth and email/password login via Supabase
- 📊 **Usage Tracking**: Track generations with 10 per user limit
- 🚀 **Modern Stack**: Next.js 15, React 19, TypeScript, tRPC, Tailwind CSS
- 💾 **Database**: PostgreSQL with Prisma ORM for event tracking

## Prerequisites

- Node.js 18+ 
- pnpm (this project uses pnpm as package manager)
- PostgreSQL database (via Supabase)
- Google Cloud Console project for OAuth
- Google AI Studio account for Gemini API

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/Florenz23/yt-studio.git
cd yt-studio
```

2. **Install dependencies using pnpm**
```bash
pnpm install
```

3. **Set up environment variables**
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@[host]:5432/postgres"
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
npx prisma migrate dev
```

5. **Run the development server**
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Setup Instructions

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your URL and anon key
3. Go to Settings → Database to get your database connection strings
4. Enable Google OAuth in Authentication → Providers

### 2. Google Cloud Console Setup
1. Create a new project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable Google Identity Services API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

### 3. Google AI Studio Setup
1. Get your API key from [aistudio.google.com](https://aistudio.google.com)
2. Add it as `GEMINI_API_KEY` in your environment variables

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run typecheck` - Run TypeScript checks
- `npx prisma migrate dev` - Run database migrations
- `npx prisma studio` - Open Prisma Studio

## Project Structure

```
src/
├── app/                 # Next.js 15 App Router
├── components/          # React components
├── lib/                 # Utility functions and configurations
├── server/              # tRPC server setup
└── prisma/              # Database schema and migrations
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
