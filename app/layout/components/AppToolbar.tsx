import * as React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, AccessTime as AccessTimeIcon, ExpandLess, ExpandMore, MonetizationOn, Task } from "@mui/icons-material";
import {
  AppBar,
  AppBarProps,
  Avatar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Collapse,
  Chip,
} from "@mui/material";

import { Link as NavLink } from "../../common/Link.js";
import { Logo } from "./Logo.js";
import { ThemeButton } from "./ThemeButton.js";
import { UserMenu } from "./UserMenu.js";
import { version } from "../../../package.json";
import SwitchLanguage from "@/routes/auth/components/SwitchLanguage.js";
import { config } from "@/core/config.js";
import { IconMenuSvg } from "@/assets/svg/IconMenuSvg.js";

import { NavLink as NavLinkDom } from "react-router-dom";
import { TokenType } from "@/core/enum.js";
import CustomerService from "@/services/CustomerService.js";
import { IGetCustomerOneReq } from "@/core/interface/services.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import { useProfileStore } from "@/core/storerecoil/useProfileStore.js";
import dayjs from "dayjs";
import 'dayjs/locale/th';
import Cookies from "js-cookie";
import { useAlertDialog } from "./alert-dialog/useAlertDialog.js";
import { getEnvironment } from "@/core/utils/index.js";

export function AppToolbar(props: any) {
  // console.log("version", version)
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { getProfile } = CustomerService()
  const { profile, setProfile } = useProfileStore();
  const { sx, ...other } = props;
  const menuAnchorRef = React.createRef<HTMLButtonElement>();
  const { t } = useTranslation()
  const { alertError } = useAlertDialog();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [environment, _] = React.useState(getEnvironment());

  React.useEffect(() => {
    // Update the current date every second (1000 milliseconds)
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    getUserProfile()
    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = currentDate.toLocaleString();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState({
    userMenu: null as HTMLElement | null,
    notifications: null as HTMLElement | null,
  });

  const getUserProfile = async () => {
    try {
      const res = await getProfile()
      setProfile(res?.data)
    } catch (error: any) {
      alertError(TranslateErrorCode(error?.response?.data?.code))
    }
  }

  function openUserMenu() {
    setAnchorEl((x) => ({ ...x, userMenu: menuAnchorRef.current }));
  }

  function closeUserMenu() {
    setAnchorEl((x) => ({ ...x, userMenu: null }));
  }

  const [open, setOpen] = React.useState(false);
  const [openBilling, setOpenBilling] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickBilling = () => {
    setOpenBilling(!openBilling);
  };

  const enableFeature = config?.app?.enable_feature
  const productFeature = ['product', 'product-management', 'pricing-group']

  const drawerWidth = 240;

  // Add this style object
  const activeMenuItemStyle = {
    '&.active': {
      boxShadow: 'inset 8px 0px 0px #2196F3',
      bgcolor: 'primary.lighter',
      '& .MuiListItemIcon-root': {
        color: 'primary.main'
      },
      '& .MuiListItemText-primary': {
        color: 'primary.main',
        fontWeight: 600,
      }
    }
  };

  const language = Cookies.get("LANGUAGE")
  React.useEffect(() => {
    dayjs.locale(language)
  }, [language]);

  const drawer = (
    <Box>
      <Toolbar />
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {
          enableFeature.includes("customer") &&
          <ListItemButton
            component={NavLinkDom}
            to="/customer"
            sx={activeMenuItemStyle}
          >
            <ListItemIcon>
              <IconMenuSvg icon="customer" />
            </ListItemIcon>
            <ListItemText primary={t("title.customer")} />
          </ListItemButton>
        }
        {
          enableFeature.includes("admin") && profile?.username === "superadmin" &&
          <ListItemButton
            component={NavLinkDom}
            to="/employee"
            sx={activeMenuItemStyle}
          >
            <ListItemIcon>
              <IconMenuSvg icon="employee" />
            </ListItemIcon>
            <ListItemText primary={t("title.employee")} />
          </ListItemButton>
        }
        {
          enableFeature.includes("activity-log") && profile?.username === "superadmin" &&
          <ListItemButton
            component={NavLinkDom}
            to="/activity-log"
            sx={activeMenuItemStyle}
          >
            <ListItemIcon>
              <IconMenuSvg icon="activity-log" />
            </ListItemIcon>
            <ListItemText primary={t("title.activity-log")} />
          </ListItemButton>
        }
        {
          productFeature.some(feature => enableFeature.includes(feature)) &&
          <>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <IconMenuSvg icon="product-cate" />
              </ListItemIcon>
              <ListItemText primary={t("title.product-cate")} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {
                  enableFeature.includes("product") &&
                  <ListItemButton
                    component={NavLinkDom}
                    to="/products"
                    sx={{ ...activeMenuItemStyle, pl: 4 }}
                  >
                    <ListItemIcon>
                      <IconMenuSvg icon="product" />
                    </ListItemIcon>
                    <ListItemText primary={t("title.product")} />
                  </ListItemButton>
                }
                {
                  enableFeature.includes("product-management") &&
                  <ListItemButton
                    component={NavLinkDom}
                    to="/product-management"
                    sx={{ ...activeMenuItemStyle, pl: 4 }}
                  >
                    <ListItemIcon>
                      <Menu />
                    </ListItemIcon>
                    <ListItemText primary={t("title.product-management")} />
                  </ListItemButton>
                }
                {
                  enableFeature.includes("direct-api") &&
                  <ListItemButton
                    component={NavLinkDom}
                    to="/direct-api"
                    sx={{ ...activeMenuItemStyle, pl: 4 }}
                  >
                    <ListItemIcon>
                      <Menu />
                    </ListItemIcon>
                    <ListItemText primary={t("title.direct-api")} />
                  </ListItemButton>
                }
                {
                  enableFeature.includes("pricing-group") &&
                  <ListItemButton
                    component={NavLinkDom}
                    to="/pricing-group"
                    sx={{ ...activeMenuItemStyle, pl: 4 }}
                  >
                    <ListItemIcon>
                      <MonetizationOn />
                    </ListItemIcon>
                    <ListItemText primary={t("title.pricing-group")} />
                  </ListItemButton>
                }
              </List>
            </Collapse>
          </>
        }
        {
          enableFeature.includes("discount") &&
          <ListItemButton
            component={NavLinkDom}
            to="/discount"
            sx={activeMenuItemStyle}
          >
            <ListItemIcon>
              <IconMenuSvg icon="discount" />
            </ListItemIcon>
            <ListItemText primary={t("title.discount")} />
          </ListItemButton>
        }
        {
          enableFeature.includes("invoice") &&
          <ListItemButton
            component={NavLinkDom}
            to="/invoice"
            sx={activeMenuItemStyle}
          >
            <ListItemIcon>
              <IconMenuSvg icon="invoice" />
            </ListItemIcon>
            <ListItemText primary={t("title.invoice")} />
          </ListItemButton>
        }
        {
          productFeature.some(feature => enableFeature.includes(feature)) &&
          <>
            <ListItemButton onClick={handleClickBilling}>
              <ListItemIcon>
                <IconMenuSvg icon="billing-note" />
              </ListItemIcon>
              <ListItemText primary={t("title.billing-note")} />
              {openBilling ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openBilling} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {
                  enableFeature.includes("billing-note") &&
                  <ListItemButton
                    component={NavLinkDom}
                    to="/billing-note"
                    sx={{ ...activeMenuItemStyle, pl: 4 }}
                  >
                    <ListItemIcon>
                      <IconMenuSvg icon="billing-note" />
                    </ListItemIcon>
                    <ListItemText primary={t("title.billing-note")} />
                  </ListItemButton>
                }
                {
                  enableFeature.includes("billing-note-multi") &&
                  <ListItemButton
                    component={NavLinkDom}
                    to="/billing-note-multi"
                    sx={{ ...activeMenuItemStyle, pl: 4 }}
                  >
                    <ListItemIcon>
                      <IconMenuSvg icon="billing-note-multi" />
                    </ListItemIcon>
                    <ListItemText primary={t("title.billing-note-multi")} />
                  </ListItemButton>
                }
                {
                  enableFeature.includes("one-time-billing") &&
                  <ListItemButton
                    component={NavLinkDom}
                    to="/one-time-billing"
                    sx={{ ...activeMenuItemStyle, pl: 4 }}
                  >
                    <ListItemIcon>
                      <IconMenuSvg icon="receipt-long" />
                    </ListItemIcon>
                    <ListItemText primary={t("title.billing-one-time")} />
                  </ListItemButton>
                }
              </List>
            </Collapse>
          </>
        }
        {
          enableFeature.includes("task-management") &&
          <ListItemButton
            component={NavLinkDom}
            to="/task-management"
            sx={activeMenuItemStyle}
          >
            <ListItemIcon>
              <Task />
            </ListItemIcon>
            <ListItemText primary={t("title.task-management")} />
          </ListItemButton>
        }
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        color="primary"
        elevation={1}
        {...other}
      >
        <Toolbar>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Typography variant="h6" noWrap component="div">
              <Link
                color="inherit"
                underline="none"
                href="/customer"
                component={NavLink}
              >
                <Logo paddingLeft={"28px"} />
              </Link>
            </Typography>
            {environment && (
              <Chip
                label={environment.toUpperCase()}
                color="default"
                variant="filled"
                size="small"
                sx={{
                  position: "absolute",
                  top: 6,
                  right: -50,
                  borderRadius: 2,
                  fontSize: "0.65rem",
                  height: 20,
                  lineHeight: 1,
                  minWidth: 'unset',
                  bgcolor: 'rgba(224, 224, 224, 0.8)',
                  color: '#424242',
                  fontWeight: 700,
                  fontFamily: "'Roboto', 'Inter', sans-serif",
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(224, 224, 224, 0.95)',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                  },
                  backdropFilter: 'blur(8px)',
                }}
              />
            )}

          </Box>

          <Box className="flex items-center pl-20 space-x-1">
            <AccessTimeIcon />
            <Typography>{formattedDate}</Typography>
          </Box>

          <span style={{ flexGrow: 1 }} />

          <Box className="px-4">
            <SwitchLanguage />
          </Box>

          <ThemeButton sx={{ mr: 1 }} />

          <IconButton
            ref={menuAnchorRef}
            sx={{
              marginLeft: (x) => x.spacing(1),
              // backgroundColor: (x) =>
              //   x.palette.mode === "light"
              //     ? x.palette.grey[300]
              //     : x.palette.grey[700],
              width: 40,
              height: 40,
            }}
            children={<Avatar>{profile?.full_name[0]?.toUpperCase()}</Avatar>}
            onClick={openUserMenu}
          />
        </Toolbar>
        {/* Pop-up menus */}

        <UserMenu
          anchorEl={anchorEl.userMenu}
          onClose={closeUserMenu}
          PaperProps={{ sx: { marginTop: "8px" } }}
          profile={profile}
        />
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { xs: drawerWidth }, flexShrink: { xs: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: "block",
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <Box className={`flex flex-col justify-between h-full`}>
            {drawer}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                color: "GrayText",
              }}
            >
              <Typography className={`mb-4`}>{t('placeholder.version')} {version}</Typography>
            </Box>
          </Box>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <React.Suspense>
          <Outlet />
        </React.Suspense>
      </Box>
    </Box>
  );
}

function getFirstName(displayName: string): string {
  return displayName && displayName.split(" ")[0];
}

type AppToolbarProps = Omit<AppBarProps, "children">;
