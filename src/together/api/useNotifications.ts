import { type AllowedUseQueryOptions, get } from "@src/api";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import type { NotificationItem } from "../types";
import { notificationSchema } from "./schemas";

const notificationsQueryKey = ["notifications"];

async function getNotifications(): Promise<NotificationItem[]> {
  const response = await get({
    url: "/notifications",
    responseSchema: z.array(notificationSchema),
  });

  return response.data;
}

export function useNotifications(options?: AllowedUseQueryOptions<NotificationItem[]>) {
  return useQuery({
    queryKey: notificationsQueryKey,
    queryFn: getNotifications,
    ...options,
  });
}
