import { Action } from "@/core/enum";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import Loading from "@/layout/components/loading/Loading";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import CustomerService from "@/services/CustomerService";
import { Backdrop, Box, Button, Modal, Paper, Typography } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";

export default function Component({
    openModal,
    setOpenModal,
    dataCustomer,
    setUpdateCustomer,
    updateCustomer,
    setDataCustomer,
    actionType,
    modifiedCustomer,
    setActionType,
}: any) {
    const { create, update } = CustomerService();
    const { TranslateErrorCode } = useTranslateErrorCode();
    const { alertError, alertSuccess } = useAlertDialog();
    const stylePaperModal = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "30rem",
        height: "auto",
        p: "1.5rem",
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleCloseConfirmTelegramModal = () => {
        setOpenModal({ ...openModal, confirmTelegramModal: false });
    };

    const handleOpenExistingCustomerListsModal = () => {
        setOpenModal({
            ...openModal,
            existingCustomerListModal: true,
            confirmTelegramModal: false,
        });
    };

    const confirmCustomer = async () => {
        try {
            const body: any = {
                username: dataCustomer.username,
                full_name: dataCustomer.full_name,
                email: dataCustomer.email,
                phone_number: dataCustomer.phone_number,
                line_id: dataCustomer.line_id,
                telegram: dataCustomer.telegram,
                what_app: dataCustomer.what_app,
                note: dataCustomer.note,
            };
            if (actionType === Action.Edit) body.id = modifiedCustomer.id;
            if (actionType === Action.Add) body.password = dataCustomer.password;

            setIsLoading(true);
            const res = actionType === Action.Add ? await create(body) : await update(body);
            setIsLoading(false);

            setUpdateCustomer(!updateCustomer);
            setOpenModal({
                ...openModal,
                confirmTelegramModal: false,
                [actionType === Action.Add ? 'addModal' : 'editModal']: false,
            });
            alertSuccess(TranslateErrorCode(res?.code));
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code || "UNKNOWN_ERROR"));
        } finally {
            setIsLoading(false);
            setDataCustomer({});
            setActionType('');
        }
    };

    return (
        <Modal
            open={openModal.confirmTelegramModal}
            onClose={handleCloseConfirmTelegramModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Paper sx={stylePaperModal}>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <Loading />
                </Backdrop>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: "1rem", gap: "1.5rem" }}>
                    <Typography align="center">
                        {t("title.confirm-telegram-desc1")} <br />
                        {t("title.confirm-telegram-desc2")}
                    </Typography>
                </Box>
                {actionType === Action.Add ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: "1rem", gap: "1.5rem" }}>
                        <Button
                            data-testid="customer-confirmtelegram-existingaccount-button"
                            sx={{ width: '70%' }}
                            variant="contained"
                            color="primary"
                            onClick={handleOpenExistingCustomerListsModal}
                        >
                            {t("button.existing-account")}
                        </Button>
                        <Button
                            data-testid="customer-confirmtelegram-existingaccountbmit-button"
                            sx={{ width: '70%' }}
                            variant="contained"
                            color="success"
                            onClick={confirmCustomer}
                        >
                            {t("button.create-new")}
                        </Button>
                        <Button
                            data-testid="customer-confirmtelegram-editdata-button"
                            sx={{ width: '70%' }}
                            variant="contained"
                            color="error"
                            onClick={handleCloseConfirmTelegramModal}
                        >
                            {t("button.edit-data")}
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", p: "1rem", gap: "3rem", justifyContent: "center" }}>
                        <Button
                            sx={{ width: '35%' }}
                            data-testid="button-cancel-button"
                            variant="text"
                            onClick={handleCloseConfirmTelegramModal}
                        >
                            {t("button.cancel")}
                        </Button>
                        <Button
                            sx={{ width: '35%' }}
                            data-testid="button-save-button"
                            variant="text"
                            onClick={confirmCustomer}
                        >
                            {t("button.save")}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Modal>
    );
}

Component.displayName = "ConfirmTelegram";
