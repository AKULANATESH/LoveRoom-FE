import { type ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

import { PublicRoutes } from "./PublicRoutes";

export function RouterProvider(): ReactElement {
  return (
    <BrowserRouter>
      <PublicRoutes />
    </BrowserRouter>
  );
}
