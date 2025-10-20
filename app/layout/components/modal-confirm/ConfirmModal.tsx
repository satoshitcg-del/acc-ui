import { Box, Button, Modal, Paper, Typography } from '@mui/material'
import ModalCustom from "@/layout/components/modal/Modal.js";
import { useTranslation } from "react-i18next";

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
export const ConfirmModal = (props: ConfirmModalProps) => {
    const { openModal, closeModal, save } = props
    const { t } = useTranslation();

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
                        {t("modal.confirm-title")}
                    </Typography>
                    <Typography variant='subtitle1'>
                        {t("modal.confirm-description")}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <Button
                            data-testid="globalcomponent-changestatus-close-button"
                            onClick={closeModal}
                            variant='text'>{t("button.cancel")}</Button>
                        <Button variant='contained'
                            data-testid="globalcomponent-changestatus-save-button"
                            onClick={save}
                        >{t("button.confirm")}</Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>

    )
}
