import {
  ChatBubble as ChatBubbleIcon,
  Event as EventIcon,
  Favorite as FavoriteIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  MyLocation as MyLocationIcon,
  Notifications as NotificationsIcon,
  Timeline as TimelineIcon,
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
import { useAuthContext } from "@src/auth/useAuth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useBreakpoint } from "../mui/useBreakpoint";
import { PartnerActivitySidebar } from "@src/together/components/PartnerActivitySidebar";

const drawerWidth = 300;

export function MenuDrawer() {
  const isSmallScreen = useBreakpoint();
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const { logout, authState } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { label: "Relationship Home", path: "/together", icon: FavoriteIcon },
    { label: "Chat", path: "/together/chat", icon: ChatBubbleIcon },
    { label: "Milestones", path: "/together/home", icon: TimelineIcon },
    { label: "Notifications", path: "/together/home", icon: NotificationsIcon },
    { label: "Calendar", path: "/together/calendar", icon: EventIcon },
    { label: "Location", path: "/together/location", icon: MyLocationIcon },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { sm: `${drawerWidth}px` },
          display: { sm: "none" },
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
            sx={{ marginRight: 2 }}
            color="secondary"
            onClick={() => {
              setDrawerIsOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" fontWeight={800}>
            Together
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
              borderRight: "1px solid rgba(233, 30, 99, 0.12)",
              bgcolor: "background.paper",
            },
          }}
        >
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
              <ListItem sx={{ mb: 1, flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h3" color="primary">
                  Together
                </Typography>
                {authState?.user.name ? (
                  <Typography variant="caption" color="text.secondary">
                    Hi, {authState.user.name}
                  </Typography>
                ) : null}
              </ListItem>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isSelected =
                  item.path === "/together"
                    ? location.pathname === "/together" || location.pathname === "/together/"
                    : location.pathname.startsWith(item.path);

                return (
                  <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => {
                        navigate(item.path);
                        setDrawerIsOpen(false);
                      }}
                      sx={{ borderRadius: 3 }}
                    >
                      <ListItemIcon>
                        <Icon color={isSelected ? "primary" : "inherit"} />
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>

            <Box sx={{ flex: 1, overflowY: "auto", mt: 1 }}>
              <PartnerActivitySidebar />
            </Box>

            <ListItem disablePadding sx={{ borderTop: "1px solid rgba(233, 30, 99, 0.12)", pt: 1 }}>
              <ListItemButton
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                sx={{ borderRadius: 3 }}
              >
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
