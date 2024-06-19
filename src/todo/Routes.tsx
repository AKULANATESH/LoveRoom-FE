import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { TodosList } from "./pages/TodosList";

export function TodoRoutes(): ReactElement {
  return (
    <Routes>
      <Route index element={<TodosList />} />
    </Routes>
  );
}
