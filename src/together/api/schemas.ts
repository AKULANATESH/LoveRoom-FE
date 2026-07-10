import { z } from "zod";

export const moodSchema = z.enum(["HAPPY", "SAD", "EXCITED", "STRESSED", "MISSING_YOU", "SLEEPY"]);

export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAtLabel: z.string(),
  isRead: z.boolean(),
});

export const relationshipHomeSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
  partner: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
    mood: moodSchema,
    moodLabel: z.string(),
    presence: z.object({
      isOnline: z.boolean(),
      lastActiveLabel: z.string(),
      currentActivity: z.string(),
    }),
  }),
  relationship: z.object({
    id: z.string(),
    daysTogether: z.number(),
    startedAtLabel: z.string(),
    dailyPrompt: z.string(),
  }),
  milestones: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      dateLabel: z.string(),
      daysUntil: z.number().optional(),
    }),
  ),
  recentNotification: notificationSchema.nullable(),
});

export const emotionalActionResponseSchema = z.object({
  id: z.string(),
  type: z.enum(["HUG", "KISS", "MISS_YOU", "THINKING_OF_YOU"]),
  message: z.string().optional(),
  delivered: z.boolean(),
});

export const moodResponseSchema = z.object({
  id: z.string(),
  mood: moodSchema,
  note: z.string().optional(),
});

export const partnerActivityItemSchema = z.discriminatedUnion("kind", [
  z.object({
    id: z.string(),
    kind: z.literal("ACTION"),
    actionType: z.enum(["HUG", "KISS", "MISS_YOU", "THINKING_OF_YOU"]),
    label: z.string(),
    message: z.string().optional(),
    createdAtLabel: z.string(),
  }),
  z.object({
    id: z.string(),
    kind: z.literal("MOOD"),
    mood: moodSchema,
    moodLabel: z.string(),
    note: z.string().optional(),
    createdAtLabel: z.string(),
  }),
]);

export const emotionStatsSchema = z.object({
  partnerSent: z.number(),
  mySent: z.number(),
  total: z.number(),
  partnerActions: z.number(),
  myActions: z.number(),
  partnerMoods: z.number(),
  myMoods: z.number(),
});

export const partnerActivityFeedSchema = z.object({
  partnerName: z.string(),
  items: z.array(partnerActivityItemSchema),
  emotionStats: emotionStatsSchema,
});

export const connectionAwarenessSchema = z.object({
  streak: z.object({
    current: z.number(),
    longest: z.number(),
    label: z.string(),
  }),
  daytimeHours: z.array(z.number()),
  hourlyTouches: z.array(
    z.object({
      hour: z.number(),
      hourLabel: z.string(),
      mine: z.boolean(),
      partner: z.boolean(),
      both: z.boolean(),
    }),
  ),
  myLocation: z.object({
    isSharing: z.boolean(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    accuracy: z.number().optional(),
    locationLabel: z.string().optional(),
    isLive: z.boolean().optional(),
    updatedAtLabel: z.string().optional(),
    mapUrl: z.string().optional(),
  }),
  partnerLocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      accuracy: z.number().optional(),
      locationLabel: z.string().optional(),
      isSharing: z.boolean(),
      isLive: z.boolean(),
      updatedAtLabel: z.string(),
      mapUrl: z.string(),
    })
    .nullable(),
});

export const hourlyTouchResponseSchema = z.object({
  id: z.string(),
  hour: z.number(),
  hourLabel: z.string(),
  recorded: z.boolean(),
});

export const locationResponseSchema = z.object({
  isSharing: z.boolean(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accuracy: z.number().optional(),
  locationLabel: z.string().optional(),
  isLive: z.boolean().optional(),
  updatedAtLabel: z.string().optional(),
  mapUrl: z.string().optional(),
});

export const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  dateLabel: z.string(),
  timeLabel: z.string(),
  daysUntil: z.number(),
  location: z.string().optional(),
  note: z.string().optional(),
});

export const calendarEventsSchema = z.array(calendarEventSchema);
