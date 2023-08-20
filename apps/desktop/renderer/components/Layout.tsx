import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CssBaseline from "@mui/material/CssBaseline";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "@mui/material/Button";
import HomeIcon from '@mui/icons-material/Home';
import WalletIcon from '@mui/icons-material/Wallet';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BugReportIcon from '@mui/icons-material/BugReport';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RouterIcon from '@mui/icons-material/Router';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

const drawerWidth = 200;

const MenuOptions = [
  {
    Text: "总览",
    Icon: <HomeIcon />,
    Link: "/"
  },
  {
    Text: "钱包管理",
    Icon: <WalletIcon />,
    Link: "/wallet-manage"
  },
  {
    Text: "策略列表",
    Icon: <ListAltIcon />,
    Link: "/strategy-list"
  },
  {
    Text: "策略验证",
    Icon: <BugReportIcon />,
    Link: "/strategy-check"
  },
  {
    Text: "在线交易",
    Icon: <ShoppingBagIcon />,
    Link: "/trade-online"
  },
  {
    Text: "代理设置",
    Icon: <RouterIcon />,
    Link: "/vpn-setting"
  },
  {
    Text: "智能问答",
    Icon: <HeadsetMicIcon />,
    Link: "https://poe.com/"
  }
];

export default function LayoutDefault({
  children,
}: {
  children: React.ReactElement;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number|null>(null);
  const open = Boolean(anchorEl);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">WBOT</Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <IconButton aria-label="notifications" size="small" sx={{ ml: 2 }}>
              <NotificationsNoneIcon sx={{ width: 32, height: 32 }} />
            </IconButton>
            <IconButton aria-label="notifications" size="small" sx={{ ml: 2 }}>
              <MenuIcon sx={{ width: 32, height: 32 }} />
            </IconButton>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> My account
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ margin: "0 auto", padding: "20px" }}>
            <Button variant="contained" startIcon={<AddBoxIcon />} >创建策略</Button>
          </Box>
          <Divider />
          <List>
            {MenuOptions.map((option, index) => (
              <ListItem key={option.Text} disablePadding >
                <ListItemButton
                  component="a"
                  href={option.Link}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index)}>
                  <ListItemIcon>
                    {option.Icon}
                  </ListItemIcon>
                  <ListItemText primary={option.Text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
