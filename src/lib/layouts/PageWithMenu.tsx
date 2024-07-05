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
          paddingX: { sm: 4, xs: 2 },
          overflow: "hidden",
        }}
        component="main"
      >
        <Toolbar sx={{ display: { sm: "none" } }} />
        <Box
          sx={{
            overflow: "hidden",
            flexGrow: 1,
            paddingY: { sm: 4, xs: 2 },
          }}
        >
          <Outlet></Outlet>
        </Box>
      </Box>
    </FullScreenPageLayout>
  );
}
