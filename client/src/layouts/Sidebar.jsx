import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  School,
  Person,
  Phone,
  Email,
  Business,
  History,
  Logout,
  AccountBalanceWallet,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import useUserStore from "../stores/userStore";
import { useState } from "react";
import { Asterisk, Eye, EyeOff } from "lucide-react";

const Sidebar = ({ user, currentPage, onPageChange, open, onToggle }) => {
  if (!user) return null;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const drawerWidth = 320;

  const logout = useUserStore((state) => state.logout);
  const [showBalance, setShowBalance] = useState(false);

  const onLogout = () => {
    logout();
    onPageChange("login");
  };

  const SidebarContent = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "primary.main",
              mr: 2,
            }}
          >
            <Business />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              TDTU Bank
            </Typography>
            <Typography variant="body2" color="text.secondary">
              iBanking System
            </Typography>
          </Box>
          {isMobile && (
            <IconButton onClick={onToggle} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* User Info */}
      <Box
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "primary.50",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="600"
          color="primary.main"
          gutterBottom
        >
          Thông tin người nộp tiền
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Person sx={{ fontSize: 18, color: "primary.main", mr: 1 }} />
            <Typography variant="body1" color="text.primary">
              {user.fullname}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Phone sx={{ fontSize: 18, color: "primary.main", mr: 1 }} />
            <Typography variant="body1" color="text.primary">
              {user.phone}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Email sx={{ fontSize: 18, color: "primary.main", mr: 1 }} />
            <Typography variant="body1" color="text.primary">
              {user.email}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccountBalanceWallet
              sx={{ fontSize: 18, color: "success.main", mr: 1 }}
            />
            <Typography variant="body1" fontWeight="600" color="success.main">
              {showBalance ? (
                user.balance.toLocaleString() + " VNĐ"
              ) : (
                <div className="flex gap-[-1px]">
                  {Array.from({ length: 8 }).map((item, index) => (
                    <Asterisk strokeWidth={3} size={13} />
                  ))}
                </div>
              )}
            </Typography>
            <div
              className="ml-2"
              onClick={() => setShowBalance((prev) => !prev)}
            >
              {showBalance ? (
                <EyeOff className="text-[#31773a] cursor-pointer" />
              ) : (
                <Eye className="text-[#31773a] cursor-pointer" />
              )}
            </div>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, p: 2 }}>
        <List>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                onPageChange("payment");
                if (isMobile) onToggle();
              }}
              sx={{
                borderRadius: 1.5,
                py: 1.5,
                ...(currentPage === "payment" && {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <School />
              </ListItemIcon>
              <ListItemText primary="Thanh toán học phí" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                onPageChange("history");
                if (isMobile) onToggle();
              }}
              sx={{
                borderRadius: 1.5,
                py: 1.5,
                ...(currentPage === "history" && {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <History />
              </ListItemIcon>
              <ListItemText primary="Lịch sử thanh toán" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button
          fullWidth
          onClick={onLogout}
          startIcon={<Logout />}
          sx={{
            py: 1.5,
            color: "error.main",
            borderRadius: 1.5,
            textTransform: "none",
            "&:hover": {
              bgcolor: "error.50",
            },
          }}
        >
          Đăng xuất
        </Button>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          boxShadow: 1,
        },
      }}
    >
      <SidebarContent />
    </Drawer>
  );
};

// Mobile Header Component
const MobileHeader = ({ onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <IconButton onClick={onToggle} sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", mr: 2 }}>
        <Business fontSize="small" />
      </Avatar>
      <Typography variant="h6" fontWeight="bold">
        TDTU Bank
      </Typography>
    </Box>
  );
};

export default Sidebar;
export { MobileHeader };
