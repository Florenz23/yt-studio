// Centralized environment configuration
export const env = {
  // Client-side environment variables (available in browser)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,

  // Server-side only environment variables
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
} as const;

// Helper function to get the correct site URL
export function getSiteUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side
    const currentOrigin = window.location.origin;
    const isLocalhost = currentOrigin.includes('localhost');
    
    return isLocalhost 
      ? currentOrigin 
      : env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Server-side
  return env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}