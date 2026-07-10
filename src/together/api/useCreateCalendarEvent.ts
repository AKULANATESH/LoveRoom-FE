import { type AllowedUseMutationOptions, post, queryClient } from "@src/api";
import { useMutation } from "@tanstack/react-query";

import type { CalendarEventItem, CreateCalendarEventRequest } from "../types";
import { calendarEventSchema } from "./schemas";
import { calendarEventsQueryKey } from "./useCalendarEvents";

async function createCalendarEvent(
  data: CreateCalendarEventRequest,
): Promise<CalendarEventItem> {
  const response = await post({
    url: "/calendar/events",
    data,
    responseSchema: calendarEventSchema,
  });

  return response.data;
}

export function useCreateCalendarEvent(
  options?: AllowedUseMutationOptions<CalendarEventItem, CreateCalendarEventRequest>,
) {
  return useMutation({
    mutationFn: createCalendarEvent,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: calendarEventsQueryKey });
      options?.onSuccess?.(...args);
    },
  });
}
