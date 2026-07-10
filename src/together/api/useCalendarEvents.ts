import { type AllowedUseQueryOptions, get } from "@src/api";
import { useQuery } from "@tanstack/react-query";

import type { CalendarEventItem } from "../types";
import { calendarEventsSchema } from "./schemas";

export const calendarEventsQueryKey = ["calendar", "events"];

async function getCalendarEvents(): Promise<CalendarEventItem[]> {
  const response = await get({
    url: "/calendar/events",
    responseSchema: calendarEventsSchema,
  });

  return response.data;
}

export function useCalendarEvents(options?: AllowedUseQueryOptions<CalendarEventItem[]>) {
  return useQuery({
    queryKey: calendarEventsQueryKey,
    queryFn: getCalendarEvents,
    ...options,
  });
}
