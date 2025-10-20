import { useEffect, useState } from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { GridRowModes, GridRowModesModel } from '@mui/x-data-grid';
import { BoxShadowButton } from '@/core/constant';

// service
import BillingService from '@/services/BillingService';
import { useTranslation } from 'react-i18next';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';

interface ModalProps {
    openModal: boolean
    closeModal: () => void
    data: any
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void
    rowModesModel: any
    tempStatus: any
    triggerHandleSearch: boolean
    setTriggerHandleSearch: any
    nextBillingStatus: any
    currentBillingStatus: any
    setSelectStatus: any
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 444,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 3,
};

export default function BillingMultipleChangeStatusModal(props: ModalProps) {
    const { t } = useTranslation()
    const { updateMultipleStatus } = BillingService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const { openModal, closeModal, data, setRowModesModel, rowModesModel, tempStatus, triggerHandleSearch, setTriggerHandleSearch, nextBillingStatus, currentBillingStatus, setSelectStatus } = props

    const [loading, setLoading] = useState(false);

    const handleChangeStatus = async (obj: any) => {
        try {
            setLoading(true)
            const body = {
                current_status: currentBillingStatus,
                next_status: nextBillingStatus,
                invoice_ids: data,
                note: obj.note || '',
            }

            const response = await updateMultipleStatus(body)
            const updateSuccess = response?.data?.success
            const updateFailed = response?.data?.failed
            const successLabel = t('alert.update-success');
            const failedLabel = t('alert.update-fail');
            const unitItem = t('alert.item');
            setSelectStatus('')
            alertSuccess(TranslateErrorCode(response.code), '', `
                    <p style="color: green;">${successLabel} ${updateSuccess} ${unitItem}</p>
                    <p style="color: red;">${failedLabel} ${updateFailed} ${unitItem}</p>
                `).then((result) => {
                if (result.isConfirmed) {
                    setTriggerHandleSearch(!triggerHandleSearch);
                }
            });
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code)).then((result) => {
                if (result.isConfirmed) {
                    setTriggerHandleSearch(!triggerHandleSearch);
                }
            });
        } finally {
            setRowModesModel({
                ...rowModesModel, [data.id]: { mode: GridRowModes.View }
            });
            closeModal()
            setLoading(false)
        }
    }

    const handleClose = () => {
        setRowModesModel({
            ...rowModesModel,
            [data.id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
        closeModal()
    }

    const { register, handleSubmit, watch, setValue, getValues, formState: { errors }, } = useForm({
        mode: "onSubmit", reValidateMode: "onChange",
        defaultValues: {
            note: "",
            currency: "",
            reason: "",
            otherValue: "",
            paidValue: "",
        }
    })
    const editorContent = watch("note");

    useEffect(() => {
        register("note");
    }, [register])

    const onEditorStateChange = (editorState: string) => {
        setValue("note", editorState);
    };

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography variant="h6" component="h2" sx={{ py: 2 }}>{t('modal.confirm-change-status-title')}</Typography>
                <Typography variant="body1" component="h2" sx={{ pb: 2 }}>{t('modal.confirm-change-status-descript')}</Typography>
                <form onSubmit={handleSubmit(handleChangeStatus)}>
                    <Box sx={{ minHeight: "10rem" }}>
                        <ReactQuill
                            data-testid="billingnote-multi-status-reactquill"
                            style={{ height: "6.5rem" }}
                            theme='snow'
                            value={editorContent}
                            onChange={onEditorStateChange}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", my: 1 }}>
                        <Box>
                            <Button data-testid="billingnote-billingchangestatus-no-button" onClick={handleClose}>{t('modal.confirm-change-status-no')}</Button>
                            <Button data-testid="billingnote-billingchangestatus-yes-button" disabled={loading} sx={{ boxShadow: BoxShadowButton }} type='submit' variant="contained">{t('modal.confirm-change-status-yes')}</Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Modal >
    )
}

