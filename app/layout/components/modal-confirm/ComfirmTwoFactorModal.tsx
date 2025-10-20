import { Box, Button, InputAdornment, Modal, Paper, TextField, Typography } from '@mui/material'
import { useTranslation } from "react-i18next";
import { VpnKey } from '@mui/icons-material';
import { useState } from 'react';
import ProductManagementService from '@/services/ProductManagementService';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';
import { StatusCode } from '@/core/enum';

interface ConfirmModalProps {
    openModal: boolean,
    closeModal: () => void,
    save: () => void
}
const stylePaperModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "28rem",
    height: "auto",
    p: "1.5rem"
};
export const ComfirmTwoFactorModal = (props: ConfirmModalProps) => {
    const { openModal, closeModal, save } = props
    const { t } = useTranslation();
    const [code, setCode] = useState('');
    const { sendTwoFactor } = ProductManagementService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const handleSubmit = async () => {
        try {
            const response = await sendTwoFactor(code)
            console.log("Login", response)
            if (response.code === StatusCode.success) {
                save();
            }
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setCode('')
        }
    }
    const handleChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 6) {
            const regex = /^[0-9\b]+$/;
            if (event.target.value === "" || regex.test(event.target.value)) {
                setCode(event.target.value);
            }
        }

    };
    return (
        <Modal
            open={openModal}
            onClose={closeModal}
            aria-labelledby="confirm-modal-title"
            aria-describedby="conirm-modal-description"
        >
            <Paper sx={stylePaperModal}>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Typography variant='h6'>
                        {t("alert.twofactor-code-input")}
                    </Typography>
                    <TextField
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
                        onChange={handleChangeCode}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKey sx={{ opacity: "38%" }}></VpnKey>
                                </InputAdornment>
                            ),
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && code.length === 6) {
                                handleSubmit();
                            }
                        }}
                    >
                    </TextField>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Button
                            data-testid="globalcomponent-changestatus-close-button"
                            onClick={closeModal}
                            variant='outlined'>{t("button.cancel")}</Button>
                        <Button variant='contained'
                            disabled={code.length !== 6}
                            data-testid="globalcomponent-changestatus-save-button"
                            onClick={handleSubmit}
                        >{t("button.confirm")}</Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>

    )
}
