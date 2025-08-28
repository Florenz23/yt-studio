import { prisma } from './prisma'

export interface TrackEventParams {
  userId?: string
  sessionId?: string
  eventType: string
  eventCategory?: string
  eventAction?: string
  eventLabel?: string
  eventValue?: number
}

export async function trackEvent(params: TrackEventParams) {
  try {
    await prisma.events.create({
      data: {
        user_id: params.userId,
        session_id: params.sessionId,
        event_type: params.eventType,
        event_category: params.eventCategory,
        event_action: params.eventAction,
        event_label: params.eventLabel,
        event_value: params.eventValue,
      },
    })
  } catch (error) {
    console.error('Failed to track event:', error)
    // Don't throw - we don't want tracking failures to break the app
  }
}

export async function getUserGenerationCount(userId: string): Promise<number> {
  try {
    const count = await prisma.events.count({
      where: {
        user_id: userId,
        event_type: 'title_generation',
        event_action: 'generate',
      },
    })
    return count
  } catch (error) {
    console.error('Failed to get user generation count:', error)
    return 0
  }
}

export const GENERATION_LIMIT = 20