import { LoginRoutes } from "@src/login/Routes";
import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

export function PublicRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/*" element={<LoginRoutes />} />
    </Routes>
  );
}
