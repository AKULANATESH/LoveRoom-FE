import { useAuthContext } from "@src/auth/useAuth";
import { NotFoundPage, PageWithMenu } from "@src/lib/layouts";
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
      <Route path="/" element={<PageWithMenu />}>
        <Route index element={<Navigate to="/posts" />} />
        <Route path="/posts/*" element={<PostRoutes />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
