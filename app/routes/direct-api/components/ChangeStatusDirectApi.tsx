// MUI
import {
    Box,
    Button,
    Divider,
    Modal,
    Paper,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import { useState } from 'react';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import DirectApiService from '@/services/DirectApiService';

interface ComponentProps {
    open: any;
    setOpen: any;
    id: string;
    status?: string;
    oldStatus?: string;
    triggerAction: boolean;
    setTriggerAction: any;
}

export default function Component(props: ComponentProps) {
    const { open, setOpen, id, status, oldStatus, triggerAction, setTriggerAction } = props;
    const { t } = useTranslation()
    const { alertError, alertSuccess } = useAlertDialog();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const [editorNote, setEditorNote] = useState('');
    const { updateStatusDirectApi } = DirectApiService();
    const handleCloseAddModal = () => {
        setOpen(false);
    };

    const onEditorStateChange = (editorState: string) => {
        setEditorNote(editorState)
    };

    const handleSubmitChangeStatus = async () => {
        try {
            const body = {
                direct_id: id,
                status: status,
                old_status: oldStatus,
                note: editorNote,
            }
            const res = await updateStatusDirectApi(body);
            console.log("Change status response", res);
            handleCloseAddModal();
            alertSuccess(TranslateErrorCode(res?.data?.code))
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            setTriggerAction(!triggerAction);
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseAddModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                <Paper sx={stylePaperModal}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                        paddingBottom: "1rem",
                    }}>
                        <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>{t('modal.confirm-change-status-title')}</Typography>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            paddingTop: "1rem",
                        }}>
                        <Typography variant="body1" component="h2">{t('modal.confirm-change-status-descript')}</Typography>
                        <Box sx={{ minHeight: "10rem" }}>
                            <ReactQuill
                                data-testid="billingnote-billingchangestatus-status-reactquill"
                                style={{ height: "6.5rem" }}
                                theme='snow'
                                value={editorNote}
                                onChange={onEditorStateChange}
                            />
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "1rem" }}>
                            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "1rem" }}>
                                <Button
                                    variant="outlined"
                                    data-testid="cancel-button"
                                    children={t("button.cancel")}
                                    onClick={handleCloseAddModal}
                                />
                                <Button
                                    variant="contained"
                                    data-testid="submit-button"
                                    children={t("button.save")}
                                    onClick={handleSubmitChangeStatus}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    );
}

Component.displayName = 'ChangeStatusDirectApi';

const stylePaperModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "438px",
    height: "auto",
    maxHeight: "calc(100vh - 20px)",
    overflowY: "auto",
    p: "1.5rem"
};