


import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function Component() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}

Component.displayName = "SettingsLayout";
