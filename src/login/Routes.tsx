import { NotFoundPage } from "@src/lib/layouts";
import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { InvitePartner } from "./pages/InvitePartner";
import { JoinWithCode } from "./pages/JoinWithCode";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Welcome } from "./pages/Welcome";

export function LoginRoutes(): ReactElement {
  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="join" element={<JoinWithCode />} />
      <Route path="join/:code" element={<JoinWithCode />} />
      <Route path="invite" element={<InvitePartner />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
