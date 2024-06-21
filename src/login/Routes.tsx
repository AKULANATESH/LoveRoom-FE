import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";

export function LoginRoutes(): ReactElement {
  return (
    <Routes>
      <Route index element={<Login />} />
    </Routes>
  );
}
