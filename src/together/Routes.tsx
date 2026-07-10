import { NotFoundPage } from "@src/lib/layouts";
import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { ChatPage } from "./chat/pages/ChatPage";
import { LiveLocationPage } from "./pages/LiveLocationPage";
import { RelationshipHome } from "./pages/RelationshipHome";
import { SharedCalendarPage } from "./pages/SharedCalendarPage";

export function TogetherRoutes(): ReactElement {
  return (
    <Routes>
      <Route index element={<RelationshipHome />} />
      <Route path="home" element={<RelationshipHome />} />
      <Route path="calendar" element={<SharedCalendarPage />} />
      <Route path="location" element={<LiveLocationPage />} />
      <Route path="chat" element={<ChatPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
