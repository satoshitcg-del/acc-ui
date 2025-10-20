import React, { ChangeEvent, DragEvent, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    IconButton,
    Paper,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InvoiceService from '@/services/InvoiceService';
import { IPaymentUploadResponse } from '@/core/interface/services';
import { t } from 'i18next';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { MAX_FILE_SIZE_3MB } from '@/core/utils/fileValidation';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';
import { StatusCode } from '@/core/enum';

const Input = styled('input')({
    display: 'none',
});

interface ImageUploadProps {
    paymentUploadPath: IPaymentUploadResponse[] | [];
    setPaymentUploadPath: React.Dispatch<React.SetStateAction<IPaymentUploadResponse[] | []>>;
    setOpenActionModal: any
}

const PaymentUpload: React.FC<ImageUploadProps> = ({ paymentUploadPath, setPaymentUploadPath, setOpenActionModal }) => {
    const { TranslateErrorCode } = useTranslateErrorCode()
    const [image, setImage] = React.useState<File | null>(null);
    const { createPaymentUpload, deletePaymentUpload } = InvoiceService()
    const { alertError } = useAlertDialog();
    const inputRef = useRef<HTMLInputElement>(null);
    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 1) {
            alertError(t('error.upload-failed'), t('error.allowed-a-file'));
            return;
        }
        const file = event.target.files && event.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (file && allowedTypes.includes(file.type) && file.size <= MAX_FILE_SIZE_3MB) {
            await handleCreateFileUpload(file);
            setImage(file);
        } else {
            // alert('กรุณาเลือกไฟล์รูปภาพ (JPG, JPEG, PNG) ขนาดไม่เกิน 3MB');
            alertError(t('error.upload-failed'), t('error.file-over-size'));
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (event.dataTransfer.files && event.dataTransfer.files.length > 1) {
            alertError(t('error.upload-failed'), t('error.allowed-a-file'));
            return;
        }
        const file = event.dataTransfer.files && event.dataTransfer.files[0];
        if (file && allowedTypes.includes(file.type) && file.size <= MAX_FILE_SIZE_3MB) {
            await handleCreateFileUpload(file);
            setImage(file);
        } else {
            alertError(t('error.upload-failed'), t('error.file-over-size'));
        }
    };

    const handleCreateFileUpload = async (file: File) => {
        try {
            setOpenActionModal(true)
            const formData = new FormData();
            formData.append('file', file);
            const res: any = await createPaymentUpload(formData, (progress) => {
                // setUploadProgress(progress);
            });
            if (res) {
                const mappedFiles: IPaymentUploadResponse = {
                    full_path: res?.data?.full_path,
                    file_path: res?.data?.file_path,
                    file_name: res?.data?.file_name,
                    file_ext: res?.data?.file_ext,
                    created_at: res?.data?.created_at,
                    updated_at: res?.data?.updated_at,
                    file_name_preview: file.name,
                    file_size: file.size,
                }
                setPaymentUploadPath(prev => [mappedFiles, ...prev]);
            } else {
                alertError(t('error.upload-failed'), t('error.try-again-later'));
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        } finally {
            setOpenActionModal(false)
        }
    }

    const handleDelete = async () => {
        try {
            setOpenActionModal(true)
            const res = await deletePaymentUpload(paymentUploadPath[0].file_name)
            if (res?.code === StatusCode.success) {
                setImage(null);
                setPaymentUploadPath(prev => prev.filter((item) => item.file_name !== paymentUploadPath[0].file_name));
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        } finally {
            setOpenActionModal(false)
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <Box sx={{ my: 2 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    border: '2px dashed gray',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: '#1976d2',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                }}
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                {image ? (
                    <Box>
                        <img
                            src={URL.createObjectURL(image)}
                            alt={image.name}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '120px',
                                objectFit: 'contain',
                            }}
                        />
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                color: 'white',
                                background: 'rgba(0, 0, 0, 0.5)',
                            }}
                            aria-label="delete image"
                            onClick={handleDelete}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <Box>
                        <Input
                            accept=".jpg, .jpeg, .png"
                            id="icon-button-file"
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                            ref={inputRef}
                        />
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <CloudUploadIcon fontSize='large' />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary">
                            {/* ลากและวางไฟล์ หรือคลิกเพื่อเลือกไฟล์ */}
                            {t('modal.drag-and-drop-file')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {/* JPG, JPEG, PNG ขนาดไม่เกิน 3MB */}
                            {t('modal.type-file')}
                        </Typography>
                    </Box>
                )}
                {image && (
                    <Typography variant="caption" color="text.secondary" align="center" mt={1}>
                        {t('modal.upload-date')} : {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default PaymentUpload;