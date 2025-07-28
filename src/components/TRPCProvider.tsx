"use client";

import { trpc } from '@/lib/trpc';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export default trpc.withTRPC(TRPCProvider);