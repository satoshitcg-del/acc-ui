import "./core/i18n/config.js";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { router } from "./routes/index.js";
import { ThemeProvider } from "./theme/index.js";

import '@/assets/fonts/regular/tiamut-regular-webfont.ttf';
import '@/assets/fonts/bold/tiamut-bold-webfont.ttf';

import "./index.css";
const container = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(container);

// Render the top-level React component
root.render(
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <SnackbarProvider>
            <CssBaseline />
            <RouterProvider router={router} />
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </RecoilRoot>
);
