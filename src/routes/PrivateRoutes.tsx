import { useAuthContext } from "@src/auth/useAuth";
import { NotFoundPage, PageWithMenu } from "@src/lib/layouts";
import { TogetherRoutes } from "@src/together/Routes";
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
        <Route index element={<Navigate to="/together" />} />
        <Route path="/together/*" element={<TogetherRoutes />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
