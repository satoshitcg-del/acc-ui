import { Box, Container, Toolbar } from "@mui/material";
import * as React from "react";
import { AppToolbar } from "./components/AppToolbar.js";

/**
 * The primary application layout.
 */
export function AppLayout() {
  return (
    <React.Fragment>
      <AppToolbar />
      {/* <Toolbar /> */}
    </React.Fragment>
  );
}
