


import { Button, ButtonProps } from "@mui/material";
import * as React from "react";
import { AuthIcon } from "../../icons/AuthIcon.js";

type SignInMethod = "google.com" | "facebook.com" | "anonymous" | string;

export function LoginButton(props: LoginButtonProps) {
  const { method, onClick, ...other } = props;
  const handleClick = useHandleClick(method, onClick);

  return (
    <Button
      variant="outlined"
      size="large"
      href="/login"
      startIcon={<AuthIcon variant={method} />}
      fullWidth
      {...other}
      onClick={handleClick}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>
        {method === "google.com"
          ? "Continue with Google"
          : method === "facebook.com"
          ? "Continue with Facebook"
          : method === "anonymous"
          ? "Continue as Anonymous"
          : `Continue with ${method}`}
      </span>
    </Button>
  );
}

function useHandleClick(
  method: SignInMethod,
  onClick?: LoginButtonProps["onClick"],
) {
  return React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event, method);
    },
    [method, onClick],
  );
}

export type LoginButtonProps = ButtonProps<
  "a",
  {
    method: SignInMethod;
    onClick?: (
      event: React.MouseEvent<HTMLAnchorElement>,
      method: SignInMethod,
    ) => void;
  }
>;
