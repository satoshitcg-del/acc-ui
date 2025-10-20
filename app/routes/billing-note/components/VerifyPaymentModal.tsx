// MUI
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    IconButton,
    Modal,
    TextField,
    Typography,
} from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useState } from 'react';
import BillingService from '@/services/BillingService';
import SlipHistoryList from '@/layout/components/slip-history/SlipHistoryList';
import CarouselSlipsModal from '@/layout/components/slip-history/CarouselSlipsModal';
import React from 'react';
import ReactQuill from 'react-quill';
import IconTableSvg from '@/assets/svg/TableSvg';
import { IconMenuSvg } from '@/assets/svg/IconMenuSvg';
import { formatDateLanguage, formatNumber } from '@/core/utils';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { StatusCode } from '@/core/enum';
import { ConfirmModal } from '@/layout/components/modal-confirm/ConfirmModal';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import { ComfirmTwoFactorModal } from '@/layout/components/modal-confirm/ComfirmTwoFactorModal';
import InvoiceService from '@/services/InvoiceService';

interface ComponentProps {
    openModal: boolean;
    handleCloseModal: () => void;
    setTriggerHandleSearch: any;
    triggerHandleSearch: boolean;
    setOpenActionModal: Dispatch<SetStateAction<boolean>>;
    handleOpenPDFPreviewModal: (id: string) => void;
    data: any;

}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 4,
    pt: 4,
};

export default function Component(props: ComponentProps) {
    const {
        openModal,
        handleCloseModal,
        setTriggerHandleSearch,
        triggerHandleSearch,
        setOpenActionModal,
        handleOpenPDFPreviewModal,
        data,

    } = props;
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { deleteUploadSlips } = InvoiceService();
    const [openCarouselSlips, setOpenCarouselSlips] = React.useState(false);
    const [slipImage, setSlipImage] = React.useState<any>([]);
    const { getSlipImage, updateVerifyPayment, viewSlipHistory } = BillingService()
    const [editorContent, setEditorContent] = useState<string>('');
    const { alertError, alertSuccess } = useAlertDialog();
    const onEditorStateChange = (editorState: string) => {
        setEditorContent(editorState);
    };
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleOpenCarouselModal = async (slips: any, index?: number) => {
        try {
            setCurrentIndex(index || 0)
            setOpenActionModal(true)
            const updatedSlips = await mappingSlipImage(slips);
            setSlipImage(updatedSlips || []);
            setOpenCarouselSlips(true);
        } catch (error: any) {
            handleGetUploadSlipHistory(data?.id);
            alertError(t('alert.get-img-failed'));
            console.error("Error opening carousel modal:", error);
        } finally {
            setOpenActionModal(false)
        }
    }

    const mappingSlipImage = async (slips: any) => {
        try {
            const updatedSlips: any = [];
            for (const slip of slips) {
                const response = await getSlipImage(slip.image_url);
                const blob = new Blob([response.data], { type: `image/${slip.image_url.split('.').pop()}` });
                const href = URL.createObjectURL(blob);

                const imageUrlMapping = {
                    name: slip.file_name_preview,
                    img_url: href
                };

                updatedSlips.push(imageUrlMapping);
            }
            return updatedSlips;
        } catch (error) {
            console.error("Error fetching slip images:", error);
            throw error;
        }
    };

    const handleSubmitVerifyPayment = async (status: string) => {
        try {
            console.log("Approve payment");
            const response = await updateVerifyPayment(data?.id, status, editorContent)
            if (response && response.code === StatusCode.success) {
                alertSuccess(TranslateErrorCode(response.code));
            }
        } catch (error: any) {
            console.log(error)
            alertError(TranslateErrorCode(error.data.code));
        } finally {
            setTriggerHandleSearch(!triggerHandleSearch)
            handleCloseModal()
        }
    }
    const [oepnConfirmModal, setOpenConfirmModal] = useState(false);
    const [confirmType, setConfirmType] = useState("");
    const handleOpenConfirmModal = (status: string) => {
        setConfirmType(status);
        setOpenConfirmModal(true);
    };
    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
    };

    // Delete slip history
    const [slipHistory, setSlipHistory] = useState<any>(data?.slips);
    const [isDeleteSlip, setIsDeleteSlip] = useState(false);
    const [selectedSlips, setSelectedSlips] = React.useState<any[]>([]);
    const handleSelectSlip = (slip: any) => {
        setSelectedSlips(prev => {
            const isAlreadySelected = prev.some((s) => s.file_name === slip.file_name);
            if (isAlreadySelected) {
                return prev.filter((s) => s.file_name !== slip.file_name);
            } else {
                return [...prev, slip];
            }
        });
    };

    const handleOpenDeleteSlip = () => {
        setIsDeleteSlip(true);
        handleOpenCarouselModal(selectedSlips);
    }

    const [oepnConfirmTwoFactorModal, setOpenConfirmTwoFactorModal] = useState(false);
    const handleOpenConfirmTwoFactorModal = () => {
        setOpenConfirmTwoFactorModal(true);
    };
    const handleCloseConfirmTwoFactorModal = () => {
        setOpenConfirmTwoFactorModal(false);
    };

    const handleSubmitDeleteSlip = async () => {
        try {
            const body = selectedSlips.map((slip: any) => slip.file_name);
            const response = await deleteUploadSlips(body);
            if (response?.code === StatusCode.success) {
                alertSuccess(TranslateErrorCode(response?.code));
                const updatedSlipHistory = slipHistory.map((group: any) => ({
                    ...group,
                    slips_data: group.slips_data.filter(
                        (slip: any) =>
                            !selectedSlips.some(
                                (selected) => selected.file_name === slip.file_name
                            )
                    ),
                }));
                handleCloseConfirmTwoFactorModal();
                setOpenCarouselSlips(false);
                setSlipHistory(updatedSlipHistory);
                setSelectedSlips([]);
            }
        } catch (error: any) {
            console.log(error);
            alertError(TranslateErrorCode(error.data.code));
        }
    };

    const handleGetUploadSlipHistory = async (id: string) => {
        try {
            setOpenActionModal(true)
            const response = await viewSlipHistory(id)
            setSlipHistory(response.data.slips || [])
            setSelectedSlips([]);
        } catch (error: any) {
            console.log(error)
            alertError(TranslateErrorCode(error.data.code));
        } finally {
            setOpenActionModal(false)
        }
    }

    return (
        <>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >

                <Box
                    sx={{
                        ...style,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: 700,
                        maxHeight: "calc(100vh - 20px)",
                        overflowY: "auto",
                    }}>
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            py: "0.5rem",
                            pr: "0.5rem"
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box
                        sx={{
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
                            {data?.invoice_status}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Box>
                                <Box display="flex" alignItems="center">
                                    <Typography fontSize="20px" fontWeight="bold">{data?.invoice_no}</Typography>
                                    <IconButton
                                        data-testid="customer-customertable-delete-button"
                                        onClick={() => {
                                            handleOpenPDFPreviewModal(data?.id)
                                        }}
                                    >
                                        <IconMenuSvg icon={"pdf"} color="primary" />
                                    </IconButton>
                                </Box>
                                <Typography>{formatDateLanguage(`${data?.month}/${data?.year}`)}</Typography>
                            </Box>

                            <Box textAlign="right">
                                <Box display="flex" justifyContent="flex-end" mb={1} gap={1}>
                                    <Typography color="text.secondary" sx={{ minWidth: '80px', textAlign: 'right', mr: 1 }}>
                                        {t("billing.amount-due")} :
                                    </Typography>
                                    <Typography fontWeight="bold" color={data?.total_payment < 0 ? "error" : ""}>
                                        {formatNumber(data?.total_payment)}
                                    </Typography>
                                    <Typography>
                                        {data?.currency}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="flex-end" mb={1} gap={1}>
                                    <Typography color="text.secondary" sx={{ minWidth: '80px', textAlign: 'right', mr: 1 }}>
                                        {t('modal.credit-discount')} :
                                    </Typography>
                                    <Typography fontWeight="bold" >
                                        {formatNumber(data?.user_credit)}
                                    </Typography>
                                    <Typography>
                                        {data?.currency}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="flex-end" gap={1}>
                                    <Typography color="text.secondary" sx={{ minWidth: '80px', textAlign: 'right', mr: 1 }}>
                                        {t('billing.net-amount')} :
                                    </Typography>

                                    <Typography fontWeight="bold" color={data?.net_amount < 0 ? "error" : ""}>
                                        {formatNumber(data?.net_amount)}
                                    </Typography>
                                    <Typography>
                                        {data?.currency}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            sx={(theme) => ({
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 224, 130, 0.15)' : '#ffe082',
                                borderLeft: `6px solid ${theme.palette.mode === 'dark' ? '#ffd54f' : '#ffb300'}`,
                                padding: 2,
                                borderRadius: 1,
                                mt: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            })}
                        >
                            <Typography fontWeight="bold">
                                {t('title.confirm-payment')}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, width: '100%' }}>
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'text.secondary' }}
                                    fontWeight="bold"
                                >
                                    {formatNumber(data?.noti_amount)} {data?.currency}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="caption" color="text.secondary" mt={1}>
                                    *1 {data?.currency} = {data?.rate} THB
                                </Typography>
                                <Typography variant="caption" color="text.secondary" mt={1}>
                                    {t('title.credit-receive')} = {formatNumber(data?.noti_credit)} {data?.currency}
                                </Typography>
                            </Box>

                        </Box>
                        <Box display="flex" justifyContent="flex-end" mt={1} gap={1}>
                            <Typography color="text.secondary" sx={{ minWidth: '80px', textAlign: 'right', mr: 1 }}>
                                {t('title.outstanding-balance')} :
                            </Typography>

                            <Typography fontWeight="bold" color={data?.outstanding_balance < 0 ? "error" : ""}>
                                {formatNumber(data?.outstanding_balance)}
                            </Typography>
                            <Typography>
                                {data?.currency}
                            </Typography>
                        </Box>
                    </Box>

                    {slipHistory?.map((slipList: any, index: number) => (
                        <SlipHistoryList key={index} index={index + 1} slips={slipList} handleOpenCarouselModal={handleOpenCarouselModal} handleOpenDeleteSlip={handleOpenDeleteSlip} selectedSlips={selectedSlips} handleSelectSlip={handleSelectSlip} handleOpenConfirmTwoFactorModal={handleOpenConfirmTwoFactorModal} />
                    ))}
                    <Box sx={{ minHeight: "10rem" }}>
                        <ReactQuill
                            data-testid="billingnote-billingchangestatus-status-reactquill"
                            style={{ height: "6.5rem" }}
                            theme='snow'
                            value={editorContent}
                            onChange={onEditorStateChange}
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingY: "20px", gap: 1 }}>
                        <Button
                            // disabled={loading}
                            data-testid="reject-button"
                            variant="contained"
                            color="error"
                            children={t("billing.reject")}
                            onClick={() => handleOpenConfirmModal("REJECT")}
                        />
                        <Button
                            // disabled={loading}
                            type="submit"
                            data-testid="approve-button"
                            variant="contained"
                            color="success"
                            children={t("billing.approve")}
                            onClick={() => handleOpenConfirmModal("APPROVE")}
                        />
                    </Box>
                </Box>
            </Modal >
            {openCarouselSlips && <CarouselSlipsModal openModal={openCarouselSlips} setOpenCarouselSlips={setOpenCarouselSlips} slips={slipImage} isDelete={isDeleteSlip} setIsDelete={setIsDeleteSlip} handleOpenConfirmTwoFactorModal={handleOpenConfirmTwoFactorModal} index={currentIndex} />}
            {oepnConfirmModal && <ConfirmModal openModal={oepnConfirmModal} closeModal={handleCloseConfirmModal} save={() => handleSubmitVerifyPayment(confirmType)} />}
            {oepnConfirmTwoFactorModal && <ComfirmTwoFactorModal openModal={oepnConfirmTwoFactorModal} closeModal={handleCloseConfirmTwoFactorModal} save={() => handleSubmitDeleteSlip()} />}
        </>
    );
}

Component.displayName = 'VerifyPaymentModal';

