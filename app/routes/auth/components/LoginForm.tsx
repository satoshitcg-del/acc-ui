import * as React from "react";
import {
  Backdrop,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  createTheme,
  CardMedia,
  InputAdornment,
  Alert,
  AlertTitle,
  IconButton,
  Card
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie"
import {
  useHandleChange,
  useHandleSignIn,
  useHandleSubmit,
  useState,
  useSwitchSAML,
} from "../Login.hooks.js";
import logoLogin from "../../assets/login/logo-login.svg";
import userIcons from "../../../assets/login/user.svg";
import lockIcons from "../../../assets/login/lock.svg";
import bgLogin from "../../../assets/login/login-bg.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// service
import UserService from "@/services/UserSevice.js";
import { config } from "@/core/config.js";
import { AuthenticationPage, TokenType } from "@/core/enum.js";
import { Notice } from "../Notice.js";
import Loading from "@/layout/components/loading/Loading.js";
import AlertMedium from "@/routes/alert/AlertMedium.js";
import { handleErrorCode } from "@/core/error.js";

import { useTranslation } from 'react-i18next';
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";
import { getEnvironment } from "@/core/utils/index.js";

interface ChildProps {
  callback: (navigate: AuthenticationPage) => void;
}


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
type userProps = {
  username: string;
  password: string;
};
const LoginForm: React.FC<ChildProps> = ({ callback }) => {
  const { t } = useTranslation()
  const { signIn, verifyUser } = UserService();
  const [environment, _] = React.useState(getEnvironment());
  const [state, setState] = useState();
  const [verified, setVerified] = React.useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>("");
  const [loading, setLoading] = React.useState(false);
  const [signInStatus, setSignInStatus] = React.useState({
    status: false,
    message: "",
  });
  const navigate = useNavigate();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  // A case study for customer hook
  // const input = useinput(setState);
  // const handleSignIn = useHandleSignIn(setState);
  // const switchSAML = useSwitchSAML(setState);
  // const [handleSubmit, submitInFlight] = useHandleSubmit(state);
  // const { pathname, search } = useLocation();

  const schema = yup.object().shape({
    // username: yup.string().email().required(),
    username: yup.string().min(8).max(50, t('validate.username-login')).required(),
    password: yup.string().min(8).max(32, t('validate.password-login')).required(),
  });

  const handleCaptchaChange = (value: string | null) => {
    // This function will be called when the user solves the CAPTCHA.
    setVerified(true);
    setCaptchaToken(value);
    console.log("Captcha Token : ", value); // You can verify the value with your server.
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = async (data: userProps) => {
    try {
      const response = await signIn({
        email: data.username,
        password: data.password,
      });

      if (response.code == 1001 && response.data) {
        callback(AuthenticationPage.InputTwoFactorForm)
      }

      Cookies.set(TokenType.TempToken, response.data.token);
      alertSuccess(TranslateErrorCode(response.code));
    } catch (error: any) {
      console.error(error)
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      reset();
      setLoading(false);
    }
  };
  const onSubmitVerifyUser = async (data: userProps) => {
    setLoading(true);
    try {
      const body = {
        email: data.username,
        password: data.password,
        captcha: captchaToken,
      };
      console.log('Body recaptcha : ', body)

      const response = await verifyUser(body);
      console.log('response : ', response)
      if (response.code == 1001 && response.data) {
        const { is_set_password, otpEnabled } = response.data;
        Cookies.set(TokenType.TempToken, response.data.token);
        if (!is_set_password) {
          callback(AuthenticationPage.SetPasswordForm);
          setLoading(false);
          alertSuccess(TranslateErrorCode(response.code));
        } else if (!otpEnabled) {
          callback(AuthenticationPage.SetTwoFactorForm);
          setLoading(false);
          alertSuccess(TranslateErrorCode(response.code));
        } else {
          onSubmitHandler(data);
        }
      }

    } catch (error: any) {
      console.error(error)
      setLoading(false);
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      // window.grecaptcha.reset()
      handleResetClick()
    }
  };

  const recaptchaRef = React.useRef<ReCAPTCHA>(null);
  const handleResetClick = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };


  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  React.useEffect(() => {
    if (environment) {
      setVerified(true);
      setCaptchaToken("1234")
    }
  }, [])

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Loading />
      </Backdrop>
      <Box
        className="flex items-center justify-center h-screen"
      >
        <Card className="p-8">
          <Box
            sx={{
              display: "flex",
              flex: 2,
            }}
          />

          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "552px",
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  width: "100%",
                }}
              >
                <Typography
                  component={"h1"}
                  variant="h1"
                  fontSize={"24px"}
                  fontWeight={700}
                // fontFamily={"Roboto"}
                >
                  {t('login.header')}
                </Typography>
                <Typography
                  fontSize={"15px"}
                  // fontFamily={"Roboto"}
                  fontWeight={400}
                  sx={{ mt: 2 }}
                >
                  {t('login.description')}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "552px",
                }}
              >
                {signInStatus.status && (
                  <Alert severity="error" sx={{ my: 1 }}>
                    <AlertTitle>{signInStatus.message}</AlertTitle>
                    <Typography
                      fontSize={"14px"}
                      fontWeight={400}
                    // fontFamily={"Roboto"}
                    >
                      {t('login.error-invalid')}
                    </Typography>
                  </Alert>
                )}
                <form onSubmit={handleSubmit(onSubmitVerifyUser)}>
                  <TextField
                    data-testid="login-loginform-username-text"
                    sx={{
                      maxWidth: "552px",
                    }}
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label={t('login.username')}
                    size="medium"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={userIcons} />
                        </InputAdornment>
                      ),
                    }}
                    {...register("username")}
                    error={errors.username ? true : false}
                    helperText={errors.username?.message}
                  />
                  <TextField
                    data-testid="login-loginform-password-text"
                    sx={{
                      maxWidth: "552px",
                    }}
                    margin="normal"
                    required
                    fullWidth
                    label={t('placeholder.password')}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={lockIcons} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end" sx={{ mx: 1 }}>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {!showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...register("password")}
                    error={errors.password ? true : false}
                    helperText={errors.password?.message}
                  />
                  {environment ? (
                    <div className="flex justify-center">
                      <Typography
                        fontSize={"18px"}
                        fontWeight={700}
                        paddingTop={"12px"}
                        color="red"
                      // fontFamily={"Roboto"}
                      >
                        {t('login.testing-message')}
                      </Typography>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        sitekey={config.app.sitekey}
                        ref={recaptchaRef}
                        onChange={handleCaptchaChange}
                        size="normal"
                        theme="light"
                        type="image"
                      />
                    </div>
                  )}
                  <Button
                    data-testid="login-loginform-submit-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    children={t('login.button')}
                    size="large"
                    disabled={!verified}
                    sx={{ mt: 3, maxWidth: "552px" }}
                  />
                </form>
              </Box>
            </Box>
          </Box>
        </Card >
      </Box >
    </>
  );
}

export default LoginForm
