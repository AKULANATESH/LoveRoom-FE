import { useAuthContext } from "@src/auth/useAuth";
import { PostRoutes } from "@src/posts/Routes";
import { type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

export function PrivateRoutes(): ReactElement {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      <Route index element={<Navigate to="/posts" />} />
      <Route path="/posts/*" element={<PostRoutes />} />
    </Routes>
  );
}
