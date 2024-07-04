import {
  ListAlt as ListAltIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useBreakpoint } from "../mui/useBreakpoint";

const drawerWidth = 240;

export function MenuDrawer() {
  const isSmallScreen = useBreakpoint();
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { sm: `${drawerWidth}px` },
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ marginRight: 2, display: { sm: "none" } }}
            color="secondary"
            onClick={() => {
              setDrawerIsOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="secondary">
            React Template App
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant={isSmallScreen ? "temporary" : "permanent"}
          open={!isSmallScreen || drawerIsOpen}
          onClose={() => {
            setDrawerIsOpen(false);
          }}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "1px solid",
            },
          }}
        >
          <Toolbar sx={{ borderBottom: "1px solid" }} />
          <Box
            sx={{
              padding: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "inherit",
            }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ListAltIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Posts"} />
                </ListItemButton>
              </ListItem>
            </List>
            <ListItem disablePadding sx={{ borderTop: "1px solid" }}>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItemButton>
            </ListItem>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
