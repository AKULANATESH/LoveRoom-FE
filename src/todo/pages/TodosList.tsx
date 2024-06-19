import { Box, CircularProgress, Stack } from "@mui/material";

import { useGetTodos } from "../api/useGetTodos";

export function TodosList() {
  const { isLoading: isGetTodosLoading, data: todos } = useGetTodos();

  if (isGetTodosLoading) {
    <Stack sx={{ height: "100%", alignItems: "center" }}>
      <CircularProgress />
    </Stack>;
  }

  return <Box>{todos?.map((todo) => <div key={todo.id}>{todo.title}</div>)}</Box>;
}
