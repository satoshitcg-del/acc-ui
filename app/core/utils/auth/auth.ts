import { redirect } from "react-router-dom";
import Cookies from "js-cookie"
import { TokenType } from "@/core/enum.js";
import { useNavigate } from "react-router-dom";

function auth() {
  const navigate = useNavigate()
  const redirectToLogin = async() => {
    Cookies.remove(TokenType.AuthToken);
    Cookies.remove(TokenType.TempToken);

    Cookies.remove(TokenType.AuthToken, {path: window.location.pathname});
    Cookies.remove(TokenType.TempToken, {path: window.location.pathname});

    console.log('------[removeAllUsedAuthToken]---------')
    if (!Cookies.get(TokenType.AuthToken)) {
      navigate("/login")
    }
    // await new Promise<void>((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve()
    //   }, 1000);
    // })
    // redirect("/")
  }
  
  const logout = () => {
    redirectToLogin()
    // return redirect("/")
  }

  return {
    redirectToLogin,
    logout
  }
}
export default auth

export const setAuthToken = (token: string, tokenType: string) => {
  const cookieName = tokenType
  Cookies.set(cookieName, token, { secure: true, sameSite: 'strict' });
};

export function getAuthToken(tokenType: string) {
  if (tokenType === TokenType.NoneToken) return null;
  if (typeof window === 'undefined') return null;
  const cookieName = tokenType
  return Cookies.get(cookieName);

}

