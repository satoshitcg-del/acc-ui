import React from "react";
import { SvgIcon } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  Groups as CustomerIcon,
  Inventory2 as ProductIcon,
  Discount,
  Receipt as ReceiptIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  InsertDriveFile,
  Category as CategoryIcon,
  ContactPage as ContactPageIcon,
  DynamicFeed as DynamicFeedIcon,
  ReplayCircleFilled as ReplayCircleFilledIcon,
  RestorePage as RestorePageIcon,
  ContentCopy as ContentCopyIcon,
  AccountCircle as AccountCircleIcon,
  LocalOffer as LocalOfferIcon,
  NoteAdd as NoteAddIcon,
  Preview as PreviewIcon,
  AddLink as AddLinkIcon,
  Visibility as VisibilityIcon,
  FindInPage as FindInPageIcon,
  CheckCircle as CheckCircleIcon,
  ReceiptLong as ReceiptLongIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMore,
  Key as KeyIcon,
  Login as LoginIcon,
  Mail as MailIcon,
  AccountBalance as AccountBalanceIcon,
  VisibilityOff as VisibilityOffIcon,
  Assignment as AssignmentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  LockReset as LockResetIcon,
  ContentPasteSearch as ContentPasteSearchIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  RemoveRedEye as RemoveRedEyeIcon,
} from "@mui/icons-material";
interface IconMenuSvgProps {
  icon?: string;
  className?: string;
  active?: boolean;
  color?: "primary" | "secondary" | "info" | "action" | "success" | "inherit" | "warning";
}

export const IconMenuSvg: React.FC<IconMenuSvgProps> = (props) => {
  const { icon, active, color, ...other } = props;
  const theme = useTheme();

  switch (icon) {
    case 'customer':
      return (<CustomerIcon />);
    case 'product':
      return (<ProductIcon />);
    case 'product-cate':
      return (<CategoryIcon />);
    case 'discount':
      return (<Discount />);
    case 'invoice':
      return (<ReceiptIcon color={color} />);
    case 'product-management':
      return (<InsertDriveFile />);
    case 'billing-note':
      return (<ContactPageIcon />);
    case 'billing-note-multi':
      return (<DynamicFeedIcon />);
    case 'replay-circle':
      return (<ReplayCircleFilledIcon color={color} sx={{ fontSize: 28 }} />);
    case 'restore-page':
      return (<RestorePageIcon color={color} sx={{ fontSize: 28 }} />);
    case 'copy-clipsboard':
      return (<ContentCopyIcon color={color} sx={{ fontSize: 28 }} />);
    case 'account-circle':
      return (<AccountCircleIcon color={color} sx={{ fontSize: 28 }} />);
    case 'local-offer':
      return (<LocalOfferIcon color={color} sx={{ fontSize: 26 }} />);
    case 'note-add':
      return (<NoteAddIcon color={color} sx={{ fontSize: 28 }} />);
    case 'preview':
      return (<PreviewIcon color={color} sx={{ fontSize: 28 }} />);
    case 'add-link':
      return (<AddLinkIcon color={color} sx={{ fontSize: 28 }} />);
    case 'visibility':
      return (<VisibilityIcon color={color} sx={{ fontSize: 28 }} />);
    case 'visibility-off':
      return (<VisibilityOffIcon color={color} sx={{ fontSize: 28 }} />);
    case 'find-in-page':
      return (<FindInPageIcon color={color} sx={{ fontSize: 28 }} />);
    case 'check-circle':
      return (<CheckCircleIcon color={color} sx={{ fontSize: 28 }} />);
    case 'receipt-long':
      return (<ReceiptLongIcon color={color} sx={{ fontSize: 28 }} />);
    case 'pdf':
      return (<PictureAsPdfIcon color={color} sx={{ fontSize: 28 }} />);
    case 'save':
      return (<SaveIcon color={color} sx={{ fontSize: 22 }} />);
    case 'cancel':
      return (<CancelIcon color={color} sx={{ fontSize: 22 }} />);
    case 'more-vert':
      return (<MoreVertIcon color={color} />);
    case 'favorite':
      return (<FavoriteIcon color={color} />);
    case 'share':
      return (<ShareIcon color={color} />);
    case 'expand-more':
      return (<ExpandMore color={color} />);
    case 'key':
      return (<KeyIcon sx={{ color: "white" }} />);
    case 'login':
      return (<LoginIcon sx={{ color: "white" }} />);
    case 'mail':
      return (<MailIcon sx={{ color: "white" }} />);
    case 'acc-balance':
      return (<AccountBalanceIcon sx={{ color: "white" }} />);
    case 'task-management':
      return (<AssignmentIcon />);
    case 'employee':
      return (<AdminPanelSettingsIcon />);
    case 'reset-password':
      return (<LockResetIcon color={color} sx={{ fontSize: 28 }} />);
    case 'activity-log':
      return (<ContentPasteSearchIcon />);
    case 'playlist-add-check':
      return (<PlaylistAddCheckIcon color={color} sx={{ fontSize: 34 }} />);
    case 'preview-eye':
      return (<RemoveRedEyeIcon color={color} />);
    default:
      break;
  }
};

