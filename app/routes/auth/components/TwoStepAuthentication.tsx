import React, { useState } from 'react'
import Cookies from "js-cookie"

import TwoFactorLottie from '@/icons/TwoFactorLottie'

import { Box, Button, Container, InputAdornment, TextField, Typography, Card, Backdrop } from '@mui/material'
import { VpnKey } from "@mui/icons-material";
import { AuthenticationPage, TokenType } from '@/core/enum';
import UserService from '@/services/UserSevice';
import { useNavigate } from 'react-router-dom';
import Loading from '@/layout/components/loading/Loading';
import AlertMedium from '@/routes/alert/AlertMedium';
import { handleErrorCode } from '@/core/error';

import { useTranslation } from 'react-i18next';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { ParseJwt } from '@/core/utils';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';

interface ChildProps {
    callback: (navigate: AuthenticationPage) => void;
}
export const TwoStepAuthentication: React.FC<ChildProps> = ({ callback }) => {
    const { t } = useTranslation()
    const { sendTwoFactorUser } = UserService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [signInAlert, setSignInAlert] = React.useState({
        status: false,
        success: "",
        message: "",
    });

    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 6) {
            const regex = /^[0-9\b]+$/;
            if (event.target.value === "" || regex.test(event.target.value)) {
                setCode(event.target.value);
            }
        }

    };

    const handleSubmit = async () => {
        console.log('Code : ', code)
        setLoading(true);
        try {
            // removeCookie("Token")
            const response = await sendTwoFactorUser(code, false)
            console.log("Login", response)
            Cookies.set(TokenType.AuthToken, response.data.token);
            alertSuccess(TranslateErrorCode(response.code));
            Cookies.remove(TokenType.TempToken);
            navigate("/customer");
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setCode('')
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
                <Card className='p-8'>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <Box sx={{ width: "552px" }}>
                            <Box className="space-y-2 flex flex-col items-center">
                                <TwoFactorLottie />
                                <Typography className='text-2xl font-bold'>{t('setup.header')}</Typography>
                                <Typography className='text-base font-normal'>{t('setup.description')}</Typography>
                            </Box>
                            <Box>
                                <TextField sx={{
                                    maxWidth: "552px",
                                    mt: 5, mb: 2
                                }}
                                    data-testid="authentication-twostepauthentication-verify-text"
                                    margin="normal"
                                    fullWidth
                                    required
                                    label={t('setup.verify')}
                                    placeholder={t('setup.enter')}
                                    type="text"
                                    id="code"
                                    autoComplete="new-password"
                                    size="medium"
                                    value={code}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKey sx={{ opacity: "38%" }}></VpnKey>
                                            </InputAdornment>
                                        ),
                                        autoComplete: "off",
                                    }}
                                >
                                </TextField>
                                <Button
                                    ata-testid="authentication-twostepauthentication-submit-button"
                                    fullWidth
                                    variant="contained"
                                    type='submit'
                                    children={t('setup.confirm')}
                                    size="large"
                                    disabled={code.length !== 6}
                                    sx={{ mt: 3, maxWidth: "552px" }}
                                    color="primary"
                                    onClick={handleSubmit}
                                />
                            </Box>
                        </Box>
                    </form>
                </Card>
            </Container>
        </>
    )
}
