import React, { useState } from 'react'
import { Backdrop, Box, Button, Card, Container, InputAdornment, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import Loading from '@/layout/components/loading/Loading'
import TwoFactorLottie from '@/icons/TwoFactorLottie'
import { VpnKey } from '@mui/icons-material'
import { handleErrorCode } from '@/core/error'

import ProductManagementService from '@/services/ProductManagementService'
import { useTranslateErrorCode } from '../hooks/useErrorCode'
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog'

interface AuthProps {
    setAuth: (isAuth: boolean) => void;
}

export const AuthProductManagement = (props: AuthProps) => {
    const { t } = useTranslation()
    const { sendTwoFactor } = ProductManagementService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const { setAuth } = props
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await sendTwoFactor(code)
            console.log("Login", response)
            alertSuccess(TranslateErrorCode(response.code));
            setAuth(true)
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setCode('')
            setLoading(false);
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 6) {
            const regex = /^[0-9\b]+$/;
            if (event.target.value === "" || regex.test(event.target.value)) {
                setCode(event.target.value);
            }
        }

    };

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <Loading />
            </Backdrop>
            <Container className="flex flex-col items-center justify-center">
                {/* <Card className='p-8'> */}
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
                                data-testid="product-management-authproductmanagement-verify-text"
                                margin="normal"
                                fullWidth
                                required
                                label={t('setup.verify')}
                                placeholder={t('setup.enter')}
                                type="text"
                                id="code"
                                autoComplete="current-password"
                                size="medium"
                                value={code}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKey sx={{ opacity: "38%" }}></VpnKey>
                                        </InputAdornment>
                                    ),
                                }}
                            >
                            </TextField>
                            <Button
                                data-testid="product-management-authproductmanagement-confirm-button"
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

                {/* </Card> */}
            </Container>
        </>
    )
}
