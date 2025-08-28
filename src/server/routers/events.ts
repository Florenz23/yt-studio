import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@/lib/prisma';

export const GENERATION_LIMIT = 20;

export const eventsRouter = router({
  trackEvent: publicProcedure
    .input(z.object({
      userId: z.string().optional(),
      sessionId: z.string().optional(),
      eventType: z.string(),
      eventCategory: z.string().optional(),
      eventAction: z.string().optional(),
      eventLabel: z.string().optional(),
      eventValue: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        await prisma.events.create({
          data: {
            user_id: input.userId,
            session_id: input.sessionId,
            event_type: input.eventType,
            event_category: input.eventCategory,
            event_action: input.eventAction,
            event_label: input.eventLabel,
            event_value: input.eventValue,
          },
        });
        return { success: true };
      } catch (error) {
        console.error('Failed to track event:', error);
        // Don't throw - allow the app to continue working even if tracking fails
        return { success: false, error: 'Failed to track event' };
      }
    }),

  getUserGenerationCount: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      // If no database connection, return default values
      if (!process.env.DATABASE_URL) {
        console.warn('No DATABASE_URL configured, returning default generation count');
        return {
          count: 0,
          remaining: GENERATION_LIMIT,
          limit: GENERATION_LIMIT,
        };
      }

      try {
        const count = await prisma.events.count({
          where: {
            user_id: input.userId,
            event_type: 'title_generation',
            event_action: 'generate',
          },
        });
        return {
          count,
          remaining: Math.max(0, GENERATION_LIMIT - count),
          limit: GENERATION_LIMIT,
        };
      } catch (error) {
        console.error('Failed to get user generation count:', error);
        return {
          count: 0,
          remaining: GENERATION_LIMIT,
          limit: GENERATION_LIMIT,
        };
      }
    }),

  canUserGenerate: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      // If no database connection, allow generation
      if (!process.env.DATABASE_URL) {
        console.warn('No DATABASE_URL configured, allowing generation');
        return {
          canGenerate: true,
          remaining: GENERATION_LIMIT,
        };
      }

      try {
        const count = await prisma.events.count({
          where: {
            user_id: input.userId,
            event_type: 'title_generation',
            event_action: 'generate',
          },
        });
        return {
          canGenerate: count < GENERATION_LIMIT,
          remaining: Math.max(0, GENERATION_LIMIT - count),
        };
      } catch (error) {
        console.error('Failed to check user generation limit:', error);
        return {
          canGenerate: true,
          remaining: GENERATION_LIMIT,
        };
      }
    }),
});