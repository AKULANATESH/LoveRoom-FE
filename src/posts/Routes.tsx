import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { PostDetails } from "./pages/PostDetails";
import { Posts } from "./pages/Posts";

export function PostRoutes(): ReactElement {
  return (
    <Routes>
      <Route index element={<Posts />} />
      <Route path="/:postId" element={<PostDetails />} />
    </Routes>
  );
}
