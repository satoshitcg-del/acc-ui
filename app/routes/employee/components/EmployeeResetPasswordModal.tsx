import { Box, Button, IconButton, Modal, Paper, Typography, Tooltip } from '@mui/material';
import { useTranslation } from "react-i18next";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useState } from 'react';

interface ConfirmModalProps {
    openModal: boolean;
    closeModal: () => void;
    username: string;
    newPassword: string;
}

const stylePaperModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "22rem",
    p: "2rem",
    borderRadius: "0.75rem",
};

export const EmployeeResetPasswordModal = (props: ConfirmModalProps) => {
    const { openModal, closeModal, username, newPassword } = props;
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(newPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Modal
            open={openModal}
            onClose={closeModal}
            aria-labelledby="reset-password-modal"
        >
            <Paper sx={stylePaperModal}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircleOutlineIcon color="success" />
                        <Typography variant="h6">{t("modal.reset-password-success")}</Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        {t("modal.reset-password-description")}
                    </Typography>


                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", }}>
                        <Typography variant="subtitle2">{t("modal.username")} : </Typography>
                        <Typography variant="body1">{username}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center", }}>
                        <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>{t("modal.new-password")} : </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                                alignItems: "center",
                                gap: 2,
                                borderRadius: 1,
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    whiteSpace: "nowrap",
                                    color: "success.main",
                                }}
                            >
                                {newPassword}
                            </Typography>
                            <Tooltip title={copied ? t("alert.copied") : t("alert.copy")}>
                                <IconButton size="small" onClick={handleCopyPassword}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                        <Button
                            data-testid="employee-resetpasswordmodal-close-button"
                            onClick={closeModal}
                            variant="text"
                        >
                            {t("button.close", "Close")}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
};
