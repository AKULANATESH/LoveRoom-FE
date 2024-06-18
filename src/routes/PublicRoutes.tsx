import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { LoginRoutes } from "../login/Routes";

export function PublicRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/login/*" element={<LoginRoutes />} />
    </Routes>
  );
}
