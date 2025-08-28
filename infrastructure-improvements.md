# YT Studio - Infrastructure Improvement Report

## Executive Summary

Your YT Studio project has a solid foundation with Next.js 15, Supabase, tRPC, and PostgreSQL. However, there are several areas where infrastructure improvements can enhance reliability, security, performance, and maintainability. This report provides actionable recommendations with implementation examples.

## Current Infrastructure Assessment

### ✅ Strengths
- Modern tech stack (Next.js 15, React 19, TypeScript)
- Well-structured tRPC API with proper event tracking
- Prisma ORM with comprehensive database schema
- Supabase authentication with Google OAuth
- Proper environment variable management
- Clean project structure and separation of concerns

### ⚠️ Areas for Improvement
- No testing infrastructure
- Limited error handling and monitoring
- Missing development tools (linting, formatting)
- No containerization for consistent deployments
- Lack of security hardening
- No CI/CD pipeline
- Missing performance optimizations

---

## 1. Environment & Configuration Management

### Current State
- Basic environment variable handling in `/src/lib/env.ts`
- No validation or type safety for environment variables

### Recommended Improvements

#### 1.1 Add Environment Validation with Zod

**File: `src/lib/env.ts`**
```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Client-side (available in browser)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // Server-side only
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  
  // Optional
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;
export type Env = z.infer<typeof envSchema>;
```

#### 1.2 Environment-Specific Configuration

**File: `config/index.ts`**
```typescript
import { env } from '@/lib/env';

export const config = {
  app: {
    name: 'YT Studio',
    version: '1.0.0',
    env: env.NODE_ENV,
    url: env.NEXT_PUBLIC_SITE_URL,
  },
  database: {
    url: env.DATABASE_URL,
    directUrl: env.DIRECT_URL,
    poolSize: env.NODE_ENV === 'production' ? 10 : 3,
  },
  ai: {
    geminiApiKey: env.GEMINI_API_KEY,
    rateLimit: env.NODE_ENV === 'production' ? 100 : 1000, // requests per hour
  },
  auth: {
    supabase: {
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
  logging: {
    level: env.LOG_LEVEL,
  },
} as const;
```

---

## 2. Error Handling & Monitoring

### Current State
- Basic try-catch blocks in API routes
- Console logging only
- No centralized error handling

### Recommended Improvements

#### 2.1 Centralized Error Handling

**File: `src/lib/errors.ts`**
```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, true, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, true, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}
```

#### 2.2 Error Handling Middleware

**File: `src/middleware/errorHandler.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export function errorHandler(error: Error, request: NextRequest): NextResponse {
  logger.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  });

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
        },
      },
      { status: error.statusCode }
    );
  }

  // Unhandled errors
  return NextResponse.json(
    {
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
    },
    { status: 500 }
  );
}
```

#### 2.3 Structured Logging

**File: `src/lib/logger.ts`**
```typescript
import { config } from '../../config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogData = Record<string, unknown>;

class Logger {
  private logLevel: LogLevel = config.logging.level;

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.logLevel];
  }

  private log(level: LogLevel, message: string, data?: LogData): void {
    if (!this.shouldLog(level)) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data,
    };

    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, data?: LogData): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: LogData): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: LogData): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: LogData): void {
    this.log('error', message, data);
  }
}

export const logger = new Logger();
```

---

## 3. Testing Infrastructure

### Current State
- No testing framework configured
- No test files present

### Recommended Improvements

#### 3.1 Package.json Updates
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vitest/ui": "^2.0.0",
    "c8": "^10.0.0",
    "@playwright/test": "^1.40.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

#### 3.2 Vitest Configuration

**File: `vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

#### 3.3 Test Utilities

**File: `src/test/utils.tsx`**
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { TRPCProvider } from '@/components/TRPCProvider';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <TRPCProvider>{children}</TRPCProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

#### 3.4 Example API Route Test

**File: `src/test/api/generate-titles.test.ts`**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/generate-titles/route';
import { generateTitlesWithGemini } from '@/lib/gemini';

vi.mock('@/lib/gemini');

describe('/api/generate-titles', () => {
  it('should generate titles successfully', async () => {
    const mockTitles = ['Title 1', 'Title 2', 'Title 3'];
    vi.mocked(generateTitlesWithGemini).mockResolvedValue(mockTitles);

    const request = new Request('http://localhost/api/generate-titles', {
      method: 'POST',
      body: JSON.stringify({ description: 'Test description' }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.titles).toEqual(mockTitles);
  });

  it('should handle missing description', async () => {
    const request = new Request('http://localhost/api/generate-titles', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });
});
```

---

## 4. Development Tools & Code Quality

### Recommended Improvements

#### 4.1 ESLint Configuration

**File: `.eslintrc.json`**
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.test.tsx"],
      "rules": {
        "no-console": "off"
      }
    }
  ]
}
```

#### 4.2 Prettier Configuration

**File: `.prettierrc`**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### 4.3 Husky Git Hooks

**File: `.husky/pre-commit`**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint
pnpm typecheck
pnpm test --run
```

---

## 5. Security Enhancements

### Recommended Improvements

#### 5.1 Rate Limiting Middleware

**File: `src/middleware/rateLimit.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { RateLimitError } from '@/lib/errors';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const store = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return (request: NextRequest): NextResponse | null => {
    const key = request.ip || 'anonymous';
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up old entries
    for (const [k, v] of store.entries()) {
      if (v.resetTime < now) {
        store.delete(k);
      }
    }

    const current = store.get(key) || { count: 0, resetTime: now + config.windowMs };

    if (current.resetTime < now) {
      current.count = 0;
      current.resetTime = now + config.windowMs;
    }

    current.count += 1;
    store.set(key, current);

    if (current.count > config.maxRequests) {
      throw new RateLimitError(`Rate limit exceeded. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds.`);
    }

    return null;
  };
}
```

#### 5.2 CORS Configuration

**File: `src/middleware/cors.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { config } from '../../config';

export function cors(request: NextRequest, response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', config.app.url);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
```

#### 5.3 Security Headers

**File: `next.config.ts`**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
```

---

## 6. Performance Optimizations

### Recommended Improvements

#### 6.1 Database Connection Pooling

**File: `src/lib/prisma.ts`**
```typescript
import { PrismaClient } from '@prisma/client';
import { config } from '../../config';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: config.app.env === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: config.database.url,
      },
    },
  });

if (config.app.env !== 'production') globalForPrisma.prisma = prisma;
```

#### 6.2 Caching Layer (Redis)

**File: `src/lib/cache.ts`**
```typescript
interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

class MemoryCache {
  private store = new Map<string, { data: any; expires: number; tags?: string[] }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item || item.expires < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.data;
  }

  async set(key: string, data: any, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || 3600; // 1 hour default
    const expires = Date.now() + (ttl * 1000);
    this.store.set(key, { data, expires, tags: options.tags });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async invalidateByTag(tag: string): Promise<void> {
    for (const [key, value] of this.store.entries()) {
      if (value.tags?.includes(tag)) {
        this.store.delete(key);
      }
    }
  }
}

export const cache = new MemoryCache();
```

#### 6.3 Bundle Analysis

**File: `scripts/analyze-bundle.js`**
```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer && process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    return config;
  },
};
```

---

## 7. Containerization

### Recommended Improvements

#### 7.1 Production Dockerfile

**File: `Dockerfile`**
```dockerfile
# Multi-stage build for production
FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 7.2 Development Docker Compose

**File: `docker-compose.yml`**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: yt_studio
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 8. CI/CD Pipeline

### Recommended Improvements

#### 8.1 GitHub Actions Workflow

**File: `.github/workflows/ci.yml`**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run linting
        run: pnpm run lint
        
      - name: Run type checking
        run: pnpm run typecheck
        
      - name: Run tests
        run: pnpm run test --coverage
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build application
        run: pnpm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

## 9. Observability & Monitoring

### Recommended Improvements

#### 9.1 Health Check Endpoint

**File: `src/app/api/health/route.ts`**
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      database: 'unknown',
      supabase: 'unknown',
    },
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    checks.checks.database = 'healthy';
  } catch (error) {
    checks.checks.database = 'unhealthy';
    checks.status = 'unhealthy';
  }

  try {
    // Check Supabase connection
    const { error } = await supabase.from('events').select('count').limit(1);
    checks.checks.supabase = error ? 'unhealthy' : 'healthy';
    if (error) checks.status = 'unhealthy';
  } catch (error) {
    checks.checks.supabase = 'unhealthy';
    checks.status = 'unhealthy';
  }

  const status = checks.status === 'healthy' ? 200 : 503;
  return NextResponse.json(checks, { status });
}
```

#### 9.2 Metrics Collection

**File: `src/lib/metrics.ts`**
```typescript
interface Metric {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp?: Date;
}

class MetricsCollector {
  private metrics: Metric[] = [];

  increment(name: string, labels?: Record<string, string>): void {
    this.record(name, 1, labels);
  }

  record(name: string, value: number, labels?: Record<string, string>): void {
    this.metrics.push({
      name,
      value,
      labels,
      timestamp: new Date(),
    });
  }

  timer(name: string, labels?: Record<string, string>) {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.record(`${name}_duration_ms`, duration, labels);
    };
  }

  flush(): Metric[] {
    const result = [...this.metrics];
    this.metrics = [];
    return result;
  }
}

export const metrics = new MetricsCollector();
```

---

## 10. Implementation Priority

### Phase 1 (Immediate - Week 1)
1. Environment validation with Zod
2. ESLint and Prettier setup
3. Basic error handling improvements
4. Security headers configuration

### Phase 2 (Short-term - Week 2-3)
1. Testing infrastructure (Vitest + Playwright)
2. Structured logging
3. Rate limiting implementation
4. Health check endpoints

### Phase 3 (Medium-term - Month 1)
1. Containerization (Docker)
2. CI/CD pipeline setup
3. Caching layer implementation
4. Performance optimizations

### Phase 4 (Long-term - Month 2+)
1. Advanced monitoring and alerting
2. Database optimization and backup strategies
3. Advanced security features
4. Load testing and performance tuning

---

## Cost Considerations

### Free/Low Cost Solutions
- **GitHub Actions**: 2,000 minutes/month free
- **Vercel**: Hobby plan covers most needs
- **Supabase**: Current free tier should suffice
- **Sentry**: 5,000 errors/month free

### Potential Paid Services
- **Redis**: $15-50/month for managed Redis
- **Advanced Monitoring**: $50-200/month
- **Enhanced Security**: $100-300/month

---

## Conclusion

These infrastructure improvements will significantly enhance your YT Studio project's reliability, security, and maintainability. Start with Phase 1 improvements for immediate benefits, then progressively implement the remaining phases based on your project's growth and requirements.

The total implementation effort is estimated at 2-4 weeks for a senior developer, with ongoing maintenance requirements minimal once established.