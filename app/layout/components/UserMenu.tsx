import { Brightness4, ContentCopy, Logout, MailOutline, Settings } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import { Link as NavLink, redirect, useNavigate } from "react-router-dom";
import { useSignOut } from "../../core/auth.js";
import { useTheme, useToggleTheme } from "../../theme/index.js";
import Cookies from "js-cookie";
import { t } from "i18next";
import { AccountType, TokenType } from "@/core/enum.js";
import { IconMenuSvg } from "@/assets/svg/IconMenuSvg.js";
import { Line } from '@/assets/svg/Line'
import { Phone } from '@/assets/svg/Phone'
import { Telegram } from '@/assets/svg/Telegram'
import { useCustomerSearchStore } from "@/core/storerecoil/useCustomerSearchStore.js";
import { useCustomerProductSearchStore } from "@/core/storerecoil/useCustomerProductSearchStore.js";
export function UserMenu(props: any) {
  const { PaperProps, MenuListProps, profile, ...other } = props;
  const close = useClose(props.onClose);
  const toggleTheme = useToggleTheme();
  const theme = useTheme();

  const navigate = useNavigate();

  const mouseNotFocus = () => {
    // setCopyMessage("")
  }
  const logOut = () => {
    Cookies.remove(TokenType.AuthToken);
    Cookies.remove(TokenType.TempToken);

    Cookies.remove(TokenType.AuthToken, { path: window.location.pathname });
    Cookies.remove(TokenType.TempToken, { path: window.location.pathname });

    useCustomerSearchStore.getState().resetSearchCustomer();
    useCustomerProductSearchStore.getState().resetSearchCustomerProduct();
    navigate('/login')
  }

  return (
    <Menu
      id="user-menu"
      role="menu"
      open={Boolean(props.anchorEl)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        ...PaperProps,
        sx: {
          ...PaperProps?.sx,
          width: 320,
          backdropFilter: 'blur(8px)',
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(0, 0, 0, 0.8)'
            : 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 30px rgba(255, 255, 255, 0.1)'
            : '0 4px 30px rgba(0, 0, 0, 0.1)',
        }
      }}
      MenuListProps={{ ...MenuListProps, dense: true }}
      {...other}
    >
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 4,
        gap: 1,
        px: 2
      }}>
        <Avatar sx={{
          width: "77px",
          height: "77px",
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)'
            : 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
          color: "white",
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}>
          <Typography component="h6" sx={{
            lineHeight: 'normal',
            fontSize: '1.5rem',
            fontWeight: 600
          }}>
            {profile?.full_name[0]?.toUpperCase()}
          </Typography>
        </Avatar>

        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
          width: '100%'
        }}>
          <Typography variant="h6" component="h2" sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
          }}>
            {t('placeholder.username')} : {profile?.username}
          </Typography>
          <Typography variant="body1" sx={{
            color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'GrayText'
          }}>
            {t('placeholder.fullname')} : {profile?.full_name}
          </Typography>
          {profile?.email &&
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <MailOutline sx={{
                width: "16px",
                height: "16px",
                color: theme.palette.mode === 'dark' ? '#fff' : '#42424D'
              }} />
              <Typography variant="body1" sx={{
                marginLeft: 1,
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'GrayText'
              }}>
                {profile?.email}
              </Typography>
            </Box>
          }
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "0.8rem", mb: 3 }}>
          <Tooltip placement='top' arrow
            title={profile?.phone_number}
            onMouseLeave={mouseNotFocus}>
            <div>
              <IconButton data-testid="globalcomponent-customerprofile-copyphonenumber-button" onClick={() => {
                // handleCopyToClipboard(customerProfile.phone_number)
              }}>
                <Phone status={profile?.phone_number ? true : false} />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip placement='top' arrow
            title={profile?.line_id}
            onMouseLeave={mouseNotFocus}>
            <div>
              <IconButton data-testid="globalcomponent-customerprofile-copylineid-button" onClick={() => {
                // handleCopyToClipboard(customerProfile.line_id)
              }}>
                <Line status={profile?.line_id ? true : false} />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip placement='top' arrow
            title={profile?.telegram}
            onMouseLeave={mouseNotFocus}>
            <div>
              <IconButton data-testid="globalcomponent-customerprofile-copylineid-button" onClick={() => {
                // handleCopyToClipboard(customerProfile.line_id)
              }}>
                <Telegram status={profile?.telegram ? true : false} />
              </IconButton>
            </div>
          </Tooltip>
        </Box>
      </Box>
      <MenuItem sx={{
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(33, 150, 243, 0.15)'
            : 'rgba(33, 150, 243, 0.08)'
        }
      }}>
        <ListItemIcon sx={{ minWidth: 40 }} children={<Brightness4 />} />
        <ListItemText primary={t('button.dark-mode')} />
        <Switch
          name="theme"
          checked={theme?.palette?.mode === "dark"}
          onChange={toggleTheme}
        />
      </MenuItem>

      <MenuItem onClick={logOut} sx={{
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(244, 67, 54, 0.15)'
            : 'rgba(244, 67, 54, 0.08)'
        }
      }}>
        <ListItemIcon sx={{ minWidth: 40 }} children={<Logout />} />
        <ListItemText primary={t('button.log-out')} />
      </MenuItem>

      <MenuItem
        sx={{
          "&:hover": { background: "none" },
          color: theme.palette.mode === 'dark'
            ? theme.palette.grey[400]
            : theme.palette.grey[500],
          paddingTop: (x) => x.spacing(0.5),
          paddingBottom: (x) => x.spacing(0.5),
          fontSize: "0.75rem",
        }}
      >
        <span>&copy; 2023 Orange Working</span>
      </MenuItem>
    </Menu>
  );
}

function useClose(onClose?: MenuProps["onClose"]) {
  return React.useCallback(
    (event: React.MouseEvent) => {
      onClose?.(event, "backdropClick");
    },
    [onClose],
  );
}

export type UserMenuProps = Omit<MenuProps, "open">;
