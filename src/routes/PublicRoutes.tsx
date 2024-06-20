import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { LoginRoutes } from "../login/Routes";
import { PostRoutes } from "../posts/Routes";

export function PublicRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="/posts/*" element={<PostRoutes />} />
    </Routes>
  );
}
