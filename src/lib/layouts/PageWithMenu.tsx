import { Box, Toolbar } from "@mui/material";
import { CallListener } from "@src/together/chat/call/CallListener";
import { CallProvider } from "@src/together/chat/call/CallProvider";
import { Outlet } from "react-router-dom";

import { FullScreenPageLayout } from "./FullScreenPageLayout";
import { MenuDrawer } from "./MenuDrawer";

export function PageWithMenu() {
  return (
    <CallProvider>
      <FullScreenPageLayout>
        <MenuDrawer />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            paddingX: { sm: 4, xs: 2 },
            overflow: "auto",
          }}
          component="main"
        >
          <Toolbar sx={{ display: { sm: "none" } }} />
          <Box
            sx={{
              overflow: "visible",
              flexGrow: 1,
              paddingY: { sm: 4, xs: 2 },
            }}
          >
            <Outlet></Outlet>
          </Box>
        </Box>
        <CallListener />
      </FullScreenPageLayout>
    </CallProvider>
  );
}
