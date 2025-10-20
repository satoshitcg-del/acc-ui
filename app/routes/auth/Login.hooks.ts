import * as React from "react";
import { useNavigate } from "react-router-dom";
import { TokenType } from "@/core/enum.js";

/**
 * Handles login / signup via Email
 */
export function useHandleSubmit(
  state: State,
): [submit: React.FormEventHandler, inFlight: boolean] {
  const [inFlight, setInFlight] = React.useState(false);

  return [
    React.useCallback(
      async (event) => {
        event.preventDefault();
        try {
          setInFlight(true);
          console.log('User name :',state.email);
          console.log('Password :',state.password);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          throw new Error("Not implemented");
        } finally {
          setInFlight(false);
        }
      },
      [state.email],
    ),
    inFlight,
  ];
}

/**
 * The initial state of the Login component
 */
export function useState() {
  return React.useState({
    email: "",
    password: "",
    code: "",
    saml: false,
    otpSent: undefined as boolean | null | undefined,
    error: undefined as string | null | undefined,
  });
}

export function useHandleChange(setState: SetState) {
  return React.useCallback(
    function (event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target as Input;
      console.log(name, value);
      
      setState((prev) =>
        prev[name] == value ? prev : { ...prev, [name]: value },
      );
    },
    [setState],
  );
}

export function useSwitchSAML(setState: SetState) {
  return React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setState((prev) => ({
        ...prev,
        saml: !prev.saml,
        otpSent: false,
        code: "",
      }));
    },
    [setState],
  );
}

export function useHandleSignIn(setState: SetState) {
  const navigate = useNavigate();
  return React.useCallback(
    async function (event: React.MouseEvent<HTMLElement>) {
      try {
        const method = event.currentTarget.dataset.method;
        // Implement your own authentication logic here
        const isAuthenticated = false; // Replace with actual auth check
        
        if (isAuthenticated) {
          setState((prev) => (prev.error ? { ...prev, error: null } : prev));
          document.cookie = `${TokenType.AuthToken} = FakeToken;secure`;
          navigate("/customer");
        }
      } catch (err) {
        const error = (err as Error)?.message ?? "Login failed.";
        setState((prev) => ({ ...prev, error }));
      }
    },
    [navigate, setState],
  );
}

export type Mode = "login" | "signup";
export type State = ReturnType<typeof useState>[0];
export type SetState = ReturnType<typeof useState>[1];
export type Input = { name: keyof State; value: string };
