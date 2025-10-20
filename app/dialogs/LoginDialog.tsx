import { Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  Typography,
} from "@mui/material";
import * as React from "react";
import { atom, useRecoilCallback, useRecoilValue } from "recoil";
import { LoginButton, LoginButtonProps } from "../layout/components/LoginButton.js";

// Define available sign-in methods
export const SignInMethods = ["google", "facebook", "email"] as const;
export type SignInMethod = typeof SignInMethods[number];

export const LoginDialogState = atom<LoginDialogAtom>({
  key: "LoginDialogState",
  default: { open: false },
});

export function LoginDialog(props: LoginDialogProps) {
  const { error, signIn, ...state } = useRecoilValue(LoginDialogState);

  return (
  <Dialog scroll="body" maxWidth="xs" fullWidth {...props} {...state}>
    <DialogContent
    sx={{
      py: 4,
      px: 4,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
    >
    <IconButton
      sx={{ position: "absolute", top: 8, right: 8 }}
      onClick={(event) => state.onClose?.(event, "backdropClick")}
      children={<Close />}
    />

    <Typography
      sx={{ mb: 3 }}
      variant="h3"
      align="center"
      children="Log in / Register"
    />

    {error && (
      <Alert
      sx={{ marginBottom: "1rem", width: "100%" }}
      severity="error"
      >
      {error.message}
      </Alert>
    )}

    <Box
      sx={{
      display: "flex",
      flexDirection: "column",
      gridGap: "1rem",
      width: "100%",
      }}
    >
      {SignInMethods.map((method) => (
      <LoginButton
        key={method}
        method={method}
        onClick={signIn}
        fullWidth
      />
      ))}
    </Box>
    </DialogContent>
  </Dialog>
  );
}

export function useOpenLoginDialog() {
  return useRecoilCallback(
  (ctx) => (params?: LoginDialogProps) => {
    return new Promise<void>((resolve) => {
    ctx.set(LoginDialogState, {
      ...params,
      open: true,
      error: params?.error,
      onClose(event: React.MouseEvent, reason) {
      params?.onClose?.(event, reason);
      if (!event.isDefaultPrevented()) {
        ctx.set(LoginDialogState, (prev) => ({ ...prev, open: false }));
        throw new Error("Login canceled.");
      }
      },
      async signIn(event, method) {
      event.preventDefault();
      try {
        // Implement your custom authentication logic here
        ctx.set(LoginDialogState, (prev) => ({
        ...prev,
        open: false,
        error: undefined,
        }));
        resolve();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Login failed");
        ctx.set(LoginDialogState, (prev) => ({ ...prev, error }));
      }
      },
    });
    });
  },
  [],
  );
}

// #region TypeScript declarations

export interface LoginDialogProps extends Omit<DialogProps, "open" | "children"> {
  error?: Error;
}

export interface LoginDialogAtom extends LoginDialogProps {
  open: boolean;
  signIn?: LoginButtonProps["onClick"];
}

// #endregion
