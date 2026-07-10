import { type ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./AppRoutes";

export function RouterProvider(): ReactElement {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
