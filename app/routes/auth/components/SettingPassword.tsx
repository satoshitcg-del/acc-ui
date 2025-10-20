import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography, Card, Backdrop } from "@mui/material";

import PasswordCheckList from "./PasswordCheckList";

import bgLogin from "@/assets/login/login-bg.svg";
import lockIcons from "@/assets/login/lock.svg";
import { Visibility, VisibilityOff, Https, CheckCircle } from "@mui/icons-material";
import SuccessIcon from "./SuccessIcon";
import ErrorIcon from "./ErrorIcon";
import DefaultIcon from "./DefaultIcon";
import { AuthenticationPage } from "@/core/enum";
// service
import UserService from "@/services/UserSevice";
import AlertMedium from "@/routes/alert/AlertMedium";
import Loading from "@/layout/components/loading/Loading";
import { handleErrorCode } from "@/core/error";

import { useTranslation } from 'react-i18next';
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";

interface ChildProps {
    callback: (navigate: AuthenticationPage) => void;
}

export const SettingPassword: React.FC<ChildProps> = ({ callback }) => {
    const { t } = useTranslation()
    const { setPassword } = UserService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isAllRulesPass, setIsAllRulesPass] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [signInAlert, setSignInAlert] = useState({
        status: false,
        success: "",
        message: "",
    });
    const { alertError, alertSuccess } = useAlertDialog();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConformPassword = () => setShowConfirmPassword((show) => !show);

    const [value, setValue] = useState({
        password: "",
        passwordConfirm: ""
    });

    const callBackFromIPasswordCheckList = (res: { isAllRulesTrue: boolean }) => {
        res.isAllRulesTrue ? setIsAllRulesPass(true) : setIsAllRulesPass(false);
    };

    const onChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        inputType: string
    ) =>
        setValue((prevState) => ({
            ...prevState,
            [inputType]: e.target.value
        }));

    const handleSubmit = async () => {
        console.log('Set password value : ', value)
        setLoading(true);
        try {
            const response = await setPassword(value.password)

            console.log("Set password response : ", response)
            if (response.code == 1001 && response.data) {
                const { is_set_password, otpEnabled } = response.data;
                if (!is_set_password) {
                    callback(AuthenticationPage.SetPasswordForm);
                } else if (!otpEnabled) {
                    callback(AuthenticationPage.SetTwoFactorForm);
                } else {
                    callback(AuthenticationPage.LoginForm);
                }
            }
            alertSuccess(TranslateErrorCode(response.code));
        } catch (error: any) {
            setValue((prevState) => ({
                ...prevState,
                password: '',
                passwordConfirm: ''
            }));
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <Loading />
            </Backdrop>
            <Container className="flex flex-col items-center justify-center">
                <Card className="p-8">
                    <Box sx={{ maxWidth: "552px" }} className="space-y-4">
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="space-y-2">
                            <Https className="w-20 h-20" color="primary" />
                            <Typography className="text-2xl font-bold">{t('setting.change-password')}</Typography>
                            <Typography className="text-base font-normal opacity-70">{t('setting.please-enter-password')}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", rowGap: "6px" }}>
                            <Typography className="text-sm font-light opacity-70">{t('setting.secure')}</Typography>
                            <PasswordCheckList
                                password={value.password}
                                passwordConfirm={value.passwordConfirm}
                                icons={{
                                    success: SuccessIcon,
                                    error: ErrorIcon,
                                    default: DefaultIcon,
                                }}
                                options={{
                                    length: {
                                        condition: 8,
                                        msg: t('setting.longer-password')
                                    },
                                    uppercase: {
                                        msg: t('setting.case-password')
                                    },
                                    number: {
                                        msg: t('setting.number-password')
                                    },
                                    specialChar: {
                                        msg: t('setting.special-password')
                                    },
                                    match: {
                                        msg: t('setting.match-password')
                                    },
                                }}
                                callBackFromIPasswordCheckList={callBackFromIPasswordCheckList}
                            />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} key={'authen-password'}>
                            <div>
                                <TextField
                                    data-testid="login-settingpassword-changepassword-text"
                                    sx={{
                                        maxWidth: "552px",
                                    }}
                                    margin="normal"
                                    fullWidth
                                    required
                                    label={t('setting.new-password')}
                                    placeholder={t('setting.new-password')}
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete="current-password"
                                    size="medium"
                                    // value={password}
                                    onChange={(e) => onChange(e, "password")}
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
                                                    edge="end"
                                                >
                                                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    data-testid="login-settingpassword-confirmpassword-text"
                                    sx={{
                                        maxWidth: "552px",
                                    }}
                                    margin="normal"
                                    fullWidth
                                    required
                                    label={t('setting.confirm-password')}
                                    placeholder={t('setting.confirm-password')}
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    autoComplete="current-password"
                                    size="medium"
                                    onChange={(e) => onChange(e, "passwordConfirm")}
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
                                                    onClick={handleClickShowConformPassword}
                                                    edge="end"
                                                >
                                                    {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    data-testid="login-settingpassword-submit-button"
                                    fullWidth
                                    variant="contained"
                                    children={t('setting.button')}
                                    size="large"
                                    disabled={!isAllRulesPass}
                                    sx={{ mt: 3, maxWidth: "552px" }}
                                    color="primary"
                                    onClick={handleSubmit}
                                />
                            </div>
                        </Box>
                    </Box >
                </Card>
                {/* <div className="w-full h-full">
                <img src={bgLogin} alt="" width={"100%"} />
            </div> */}
                {/* <Box sx={{ width: "100%", height: "100%", mt: 4 }}>
            </Box> */}
            </Container>
        </>
    );
}
