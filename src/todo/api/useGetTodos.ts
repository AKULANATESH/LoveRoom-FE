import { type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

import { useGetQuery, type UseGetQueryOptions } from "../../api/useGetQuery";
import { environmentConfig } from "../../environment";

const todosResponseSchema = z.array(
  z.object({
    title: z.string(),
    id: z.number(),
    userId: z.number(),
    completed: z.boolean(),
  }),
);
export type TodosResponse = z.infer<typeof todosResponseSchema>;

export const GET_TO_DOS_PATH = "/todos";

export function useGetTodos(
  options: UseGetQueryOptions<TodosResponse> = {},
): UseQueryResult<TodosResponse> {
  return useGetQuery({
    url: `${environmentConfig.BACKEND_API_URL}${GET_TO_DOS_PATH}`,
    responseSchema: todosResponseSchema,
    meta: {
      userErrorMessage: "Error while getting todos",
    },
    ...options,
  });
}
