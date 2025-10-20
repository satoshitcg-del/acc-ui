import React, { ChangeEvent, useEffect, useState } from 'react'

import { Box, Button, Container, Divider, Grid, InputAdornment, TextField, Typography, Card, Backdrop, Link } from '@mui/material'
import { VpnKey, Refresh } from "@mui/icons-material";

import { decode } from "js-base64";
import QRCode from 'qrcode'
import QrIOS from '@/icons/ios-qr.svg'
import QrAndroid from '@/icons/android-qr.svg'
import { AuthenticationPage, TokenType } from '@/core/enum';
// service
import UserService from '@/services/UserSevice';
import Cookies from "js-cookie"
import AlertMedium from '@/routes/alert/AlertMedium';
import Loading from "@/layout/components/loading/Loading.js";
import { handleErrorCode } from '@/core/error';

import { useTranslation } from 'react-i18next';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';

interface ChildProps {
    callback: (navigate: AuthenticationPage) => void;
}


export const SetUpAuthentication: React.FC<ChildProps> = ({ callback }) => {
    const { t } = useTranslation()
    const { checkTwoFactor, sendTwoFactorUser } = UserService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const [text, setText] = useState('');
    const [qrCode, setQrCode] = useState('');
    // const [backDrop, setBackDrop] = useState(false);
    const [loading, setLoading] = useState(false);
    const [signInAlert, setSignInAlert] = useState({
        status: false,
        success: "",
        message: "",
    });

    const description: Array<string> = [t('setup.step-1'), t('setup.step-2'), t('setup.step-3'), t('setup.step-4'), t('setup.step-5')]

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 6) {
            const regex = /^[0-9\b]+$/;
            if (event.target.value === "" || regex.test(event.target.value)) {
                setText(event.target.value);
            }
        }

    };

    useEffect(() => {
        handleQrCode()
        handleGenerateQrCodeAndroid()
        handleGenerateQrCodeIos()
    }, [])

    const handleQrCode = async () => {
        try {
            const response = await checkTwoFactor()
            const data = decode(response?.data?.base64_qr)
            const base64 = await QRCode.toDataURL(data)
            setQrCode(base64)
        } catch (error) {
            console.error(error)
        }
    }

    const [qrAndroid, setQrAndroid] = useState("")
    const handleGenerateQrCodeAndroid = async () => {
        QRCode.toDataURL("https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pli=1")
            .then((url) => {
                setQrAndroid(url);
            })
            .catch((err) => {
                console.error('Failed to generate QR Code', err);
            });
    }

    const [qrIOS, setQrIOS] = useState("")
    const handleGenerateQrCodeIos = async () => {
        QRCode.toDataURL("https://apps.apple.com/us/app/google-authenticator/id388497605")
            .then((url) => {
                setQrIOS(url);
            })
            .catch((err) => {
                console.error('Failed to generate QR Code', err);
            });
    }
    const handleSubmit = async () => {
        console.log('Set up authen value : ', text)
        setLoading(true)
        try {
            const response = await sendTwoFactorUser(text, false)
            console.log("Set up authen response : ", response)
            if (response.code == 1001) {
                callback(AuthenticationPage.LoginForm)
                Cookies.remove(TokenType.TempToken)
            }
            alertSuccess(TranslateErrorCode(response.code));
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code));
            setText('')
        } finally {
            setLoading(false)
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
            <Container className='flex flex-col items-center justify-center'>
                <Card className='p-8'>
                    <Grid container
                        direction="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        gap={4}
                    >
                        <Grid item xs className='flex items-center justify-center pr-10'>
                            <Box className="flex flex-col">
                                <Typography className='text-2xl font-semibold'>{t('setup.header')}</Typography>
                                <Typography className='text-base font-normal'>{t('setup.description')}</Typography>

                                <Box className="flex flex-row items-center justify-center space-x-20 my-10">
                                    <Box className="text-center">
                                        <img
                                            src={qrAndroid}
                                            alt="qrAndroid"
                                            className="w-28 h-28 "
                                        />
                                        <Link
                                            variant="body2"
                                            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pli=1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Typography>{t('setup.download')}</Typography>
                                        </Link>
                                        <Typography>{t('setup.android')}</Typography>
                                    </Box>
                                    <Box className="text-center">
                                        <img
                                            src={qrIOS}
                                            alt="qrIOS"
                                            className="w-28 h-28 "
                                        />
                                        <Link
                                            variant="body2"
                                            href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Typography>{t('setup.download')}</Typography>
                                        </Link>
                                        <Typography>{t('setup.ios')}</Typography>
                                    </Box>
                                </Box>
                                <Box className="flex flex-col space-y-1">
                                    {description.map(text => <Typography className='text-sm font-normal' key={`label-id:${text}`}>{text}</Typography>)}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs className='flex items-center justify-center'>
                            <Box className="flex flex-col" sx={{ width: "400px" }}>
                                <Box className="flex justify-center items-center">
                                    {qrCode !== "" ? (
                                        <Box className="w-44 h-44">
                                            <img src={qrCode} alt="QR Code" style={{ width: '100%', height: '100%' }} />
                                        </Box>) : (
                                        <Box className="w-44 h-44">
                                            <Button onClick={handleQrCode} variant="outlined" sx={{ width: "100%", height: "100%", borderRadius: "4px" }}>
                                                <Refresh className='w-11 h-11' />
                                            </Button>
                                        </Box>
                                    )}

                                </Box>
                                <TextField sx={{
                                    mt: 5, mb: 2
                                }}
                                    data-testid="login-setupauthentication-verify-text"
                                    margin="normal"
                                    fullWidth
                                    required
                                    label={t('setup.verify')}
                                    placeholder={t('setup.enter')}
                                    type="text"
                                    id="code"
                                    autoComplete="current-password"
                                    size="medium"
                                    value={text}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKey sx={{ opacity: "38%" }}></VpnKey>
                                            </InputAdornment>
                                        ),
                                    }}
                                    inputProps={{
                                        maxLength: 6
                                    }}
                                >
                                </TextField>
                                <Button
                                    // type="submit"
                                    data-testid="login-setupauthentication-submit-button"
                                    fullWidth
                                    variant="contained"
                                    children={t('setup.confirm')}
                                    size="large"
                                    disabled={text.length !== 6}
                                    sx={{ mt: 3, maxWidth: "552px" }}
                                    color="primary"
                                    onClick={handleSubmit}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </Container >
        </>
    )
}