// MUI
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Modal,
    Typography,
} from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { t } from 'i18next';
import SlipUpload from '@/layout/components/file-upload/SlipUpload';
import React, { Dispatch, SetStateAction } from 'react';
import { IPaymentUploadResponse } from '@/core/interface/services';
import SlipHistoryList from './SlipHistoryList';
import InvoiceService from '@/services/InvoiceService';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import BillingService from '@/services/BillingService';
import { BILLING_STATUS, StatusCode, sweetalert } from '@/core/enum';
import CarouselSlipsModal from './CarouselSlipsModal';
import IconTableSvg from '@/assets/svg/TableSvg';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';
import { ComfirmTwoFactorModal } from '../modal-confirm/ComfirmTwoFactorModal';

interface ComponentProps {
    openModal: boolean;
    setOpenSlipHistory: Dispatch<SetStateAction<boolean>>
    slips: any
    invoiceSlipUploadData: any
    setOpenActionModal: Dispatch<SetStateAction<boolean>>
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
        setOpenSlipHistory,
        slips,
        invoiceSlipUploadData,
        setOpenActionModal,

    } = props;
    const { uploadSlipByAdmin, getSlipImage, viewSlipHistory } = BillingService()
    const { deleteSlipUpload, deleteUploadSlips } = InvoiceService()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const [slipUploadPath, setSlipUploadPath] = React.useState<IPaymentUploadResponse[] | []>([]);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const { alertError, alertSuccess } = useAlertDialog();

    const handleCloseModal = async () => {
        setOpenBackdrop(true);
        if (slipUploadPath.length > 0) {
            for (const slip of slipUploadPath) {
                try {
                    await deleteSlipUpload(slip.file_name);
                } catch (error: any) {
                    alertError(TranslateErrorCode(error?.data?.code));
                }
            }
        }
        setOpenBackdrop(false);
        setOpenSlipHistory(false);
    }

    const handleComfirmSlipUpload = async () => {
        try {
            setOpenBackdrop(true);
            const body = {
                invoice_id: invoiceSlipUploadData.id,
                files: slipUploadPath,
            }
            const response = await uploadSlipByAdmin(body)
            if (response) {
                alertSuccess(TranslateErrorCode(response?.code));
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        } finally {
            setOpenBackdrop(false);
            setOpenSlipHistory(false);
        }
    }

    const [openCarouselSlips, setOpenCarouselSlips] = React.useState(false);
    const [slipImage, setSlipImage] = React.useState<any>([]);

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const handleOpenCarouselModal = async (slips: any, index?: number) => {
        try {
            setCurrentIndex(index || 0)
            setOpenActionModal(true)
            const updatedSlips = await mappingSlipImage(slips);
            setSlipImage(updatedSlips);
            setOpenCarouselSlips(true);
        } catch (error: any) {
            handleGetUploadSlipHistory(invoiceSlipUploadData.id);
            alertError(t('alert.get-img-failed'));
        } finally {
            setOpenActionModal(false)
        }
    }

    const mappingSlipImage = async (slips: any) => {
        try {
            const slipPromises = slips.map(async (slip: any) => {
                const response = await getSlipImage(slip.image_url);
                const blob = new Blob([response.data], { type: `image/${slip.image_url.split('.').pop()}` });
                const href = URL.createObjectURL(blob);

                return {
                    name: slip.file_name_preview,
                    img_url: href
                };
            });

            return await Promise.all(slipPromises);
        } catch (error) {
            console.error("Error fetching slip images:", error);
            throw error;
        }
    };

    // Delete slip history
    const [slipHistory, setSlipHistory] = React.useState<any>(slips);
    const [isDeleteSlip, setIsDeleteSlip] = React.useState(false);
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
        console.log("selectedSlips :", selectedSlips);
        setIsDeleteSlip(true);
        handleOpenCarouselModal(selectedSlips);
    }

    const [oepnConfirmTwoFactorModal, setOpenConfirmTwoFactorModal] = React.useState(false);
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
                disableScrollLock
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
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={openBackdrop}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>{slips.length == 0 ? t(`modal.upload-slip`) : t(`modal.upload-new-slip`)}</Typography>
                    {((invoiceSlipUploadData?.invoice_status === BILLING_STATUS.DELIVERED || invoiceSlipUploadData?.invoice_status === BILLING_STATUS.PARTIALPAID || invoiceSlipUploadData?.invoice_status === BILLING_STATUS.OVERDUE || invoiceSlipUploadData?.invoice_status === BILLING_STATUS.VERIFYPAYMENT) && (slips && slips[slips?.length - 1]?.slips_data?.length !== 20)) && (
                        <SlipUpload slips={slips} slipUploadPath={slipUploadPath} setSlipUploadPath={setSlipUploadPath} setOpenBackdrop={setOpenBackdrop} />
                    )}
                    {slips.length == 0 && (
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                            <IconTableSvg icon='empty' />
                            <Typography className="mt-5  text-center" variant="h6">
                                {t("table.no-information")}
                            </Typography>
                        </Box>
                    )}
                    {slipHistory?.map((slipList: any, index: number) => (
                        <SlipHistoryList key={index} index={index + 1} slips={slipList} handleOpenCarouselModal={handleOpenCarouselModal} handleOpenDeleteSlip={handleOpenDeleteSlip} selectedSlips={selectedSlips} handleSelectSlip={handleSelectSlip} handleOpenConfirmTwoFactorModal={handleOpenConfirmTwoFactorModal} />
                    ))}
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingY: "8px", gap: 1 }}>
                        {((invoiceSlipUploadData?.invoice_status === BILLING_STATUS.DELIVERED || invoiceSlipUploadData?.invoice_status === BILLING_STATUS.PARTIALPAID || invoiceSlipUploadData?.invoice_status === BILLING_STATUS.OVERDUE || invoiceSlipUploadData?.invoice_status === BILLING_STATUS.VERIFYPAYMENT) && (slips && slips[slips?.length - 1]?.slips_data?.length !== 20)) ? (
                            <>
                                <Button data-testid="slip-history-cancel-button" onClick={handleCloseModal} children={t('billing.cancel')} sx={{ fontWeight: 500, letterSpacing: "0.4px" }} />
                                <Button data-testid="slip-history-cofirm-button" onClick={handleComfirmSlipUpload} children={t("button.upload-files")} sx={{ fontWeight: 500, letterSpacing: "0.4px" }} />
                            </>
                        ) : (
                            <Button data-testid="slip-history-cancel-button" onClick={handleCloseModal} children={t('billing.close')} sx={{ fontWeight: 500, letterSpacing: "0.4px" }} />
                        )}
                    </Box>
                </Box>
            </Modal>
            {openCarouselSlips && <CarouselSlipsModal openModal={openCarouselSlips} setOpenCarouselSlips={setOpenCarouselSlips} slips={slipImage} isDelete={isDeleteSlip} setIsDelete={setIsDeleteSlip} handleOpenConfirmTwoFactorModal={handleOpenConfirmTwoFactorModal} index={currentIndex} />}
            {oepnConfirmTwoFactorModal && <ComfirmTwoFactorModal openModal={oepnConfirmTwoFactorModal} closeModal={handleCloseConfirmTwoFactorModal} save={() => handleSubmitDeleteSlip()} />}
        </>
    );
}

Component.displayName = 'UploadSlipHistoryModal';

