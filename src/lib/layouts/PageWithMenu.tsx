import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";

import { FullScreenPageLayout } from "./FullScreenPageLayout";
import { MenuDrawer } from "./MenuDrawer";

export function PageWithMenu() {
  return (
    <FullScreenPageLayout>
      <MenuDrawer />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 1,
          overflow: "hidden",
        }}
        component="main"
      >
        <Toolbar />
        <Box
          sx={{
            padding: 1,
            border: "1px solid",
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          <Outlet></Outlet>
        </Box>
      </Box>
    </FullScreenPageLayout>
  );
}
