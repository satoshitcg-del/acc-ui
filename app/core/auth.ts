import * as React from "react";
import { atom, useRecoilValueLoadable } from "recoil";
import { useOpenLoginDialog } from "../dialogs/LoginDialog.js";

// Generic user type
export interface User {
  uid: string;
  email?: string | null;
}

let idTokenPromise: Promise<string | null> | undefined;
let idTokenPromiseResolve:
  | ((value: Promise<string> | null) => void)
  | undefined;

/**
 * Returns a JSON Web Token (JWT) used to identify the user. If the user is not
 * authenticated, returns `null`.
 */
export async function getIdToken() {
  if (!idTokenPromise) {
    idTokenPromise = new Promise<string | null>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("getIdToken() timeout"));
      }, 5000);

      idTokenPromiseResolve = (value: PromiseLike<string> | null) => {
        resolve(value);
        clearTimeout(timeout);
        idTokenPromiseResolve = undefined;
      };
    });
  }

  return await idTokenPromise;
}

export type SignInMethod = "google" | "apple" | "anonymous";
export interface SignInOptions {
  method?: SignInMethod;
}

export const SignInMethods: SignInMethod[] = ["google", "apple", "anonymous"];

export const CurrentUser = atom<User | null>({
  key: "CurrentUser",
  default: null,
  dangerouslyAllowMutability: true,
});

/**
 * The currently logged-in (authenticated) user object.
 */
export function useCurrentUser() {
  const value = useRecoilValueLoadable(CurrentUser);
  return value.state === "loading" ? undefined : value.valueOrThrow();
}

export function useSignIn() {
  const openLoginDialog = useOpenLoginDialog();
  return React.useCallback(
    async function (options?: SignInOptions) {
      return await openLoginDialog();
    },
    [openLoginDialog],
  );
}

export function useSignOut() {
  return React.useCallback(() => Promise.resolve(), []);
}

/**
 * Returns a memoized version of the callback that triggers opening a login
 * dialog in case the user is not authenticated.
 */
export function useAuthCallback<T extends AuthCallback>(
  callback: T,
  deps: React.DependencyList = [],
): (...args: AuthCallbackParameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const openLoginDialog = useOpenLoginDialog();
  return React.useCallback(
    async (...args: AuthCallbackParameters<T>) => {
      try {
        // Replace with your auth check logic
        const isAuthenticated = false;
        if (!isAuthenticated) {
          await openLoginDialog();
        }

        if (!isAuthenticated) {
          return Promise.reject(new Error("Not authenticated."));
        }

        // You'll need to implement how to get the current user
        const currentUser = { uid: "dummy" } as User;
        return await callback(currentUser, ...args);
      } catch (err) {
        throw err;
      }
    },
    [openLoginDialog, ...deps],
  );
}

type AuthCallbackParameters<T extends AuthCallback> = Parameters<T> extends [
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  infer _,
  ...infer Tail,
]
  ? Tail
  : never;

type AuthCallback = (user: User, ...args: any) => any;
