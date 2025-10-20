import React, { useState, ChangeEvent, DragEvent } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Typography,
    ImageList,
    ImageListItem,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { t } from 'i18next';
import { IPaymentUploadResponse } from '@/core/interface/services';
import InvoiceService from '@/services/InvoiceService';
import { MAX_FILE_SIZE_3MB, MAX_FILES } from '@/core/utils/fileValidation';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';
import dayjs from 'dayjs';

const Input = styled('input')({
    display: 'none',
});

interface ImageUploadProps {
    slips?: any;
    slipUploadPath: IPaymentUploadResponse[] | [];
    setSlipUploadPath: React.Dispatch<React.SetStateAction<IPaymentUploadResponse[] | []>>;
    setOpenBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
}

const SlipUpload: React.FC<ImageUploadProps> = ({ slips, slipUploadPath, setSlipUploadPath, setOpenBackdrop }) => {
    const [images, setImages] = React.useState<File[] | []>([]);
    const { createSlipUpload, deleteSlipUpload } = InvoiceService()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();
    const inputRef = React.useRef<HTMLInputElement>(null);
    function getCurrentSlipLength(slips: any) {
        const currentMonthYear = dayjs().format('MM/YYYY');
        const currentSlip: any = slips?.find((slip: any) => slip?.date === currentMonthYear);
        return currentSlip?.slips_data?.length ?? 0;
    }

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (files && files.length > 0) {
            const invalidFiles = Array.from(files).filter(
                (file) => !allowedTypes.includes(file.type)
            );
            if (invalidFiles.length > 0) {
                alertError(t('error.invalid-file-type'), t('error.allowed-file-types'));
                return;
            }

            const newImages = Array.from(files).filter(
                (file) => allowedTypes.includes(file.type) && file.size <= MAX_FILE_SIZE_3MB
            );
            if (newImages.length === 0) {
                alertError(t('error.upload-failed'), t('error.file-over-size'));
                return;
            }

            if (slips && images.length + newImages.length + getCurrentSlipLength(slips || []) > MAX_FILES) {
                alertError(t('error.too-many-files'), `${t('error.max-files-count')} ${MAX_FILES} ${t('error.files')}`);
                return;
            }

            if (images.length + newImages.length > MAX_FILES) {
                alertError(t('error.too-many-files'), `${t('error.max-files-count')} ${MAX_FILES} ${t('error.files')}`);
                return;
            }

            setOpenBackdrop(true);
            try {
                await Promise.all(newImages.map(file => handleCreateSlipVerifyUpload(file)));
            } finally {
                setOpenBackdrop(false);
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
            }
        }
    };

    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const allowedTypes = ['image/jpeg', 'image/png'];
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            const invalidFiles = Array.from(files).filter(
                (file) => !allowedTypes.includes(file.type)
            );
            if (invalidFiles.length > 0) {
                alertError(t('error.invalid-file-type'), t('error.allowed-file-types'));
                return;
            }

            const newImages = Array.from(files).filter(
                (file) => allowedTypes.includes(file.type) && file.size <= MAX_FILE_SIZE_3MB
            );
            if (newImages.length === 0) {
                alertError(t('error.upload-failed'), t('error.file-over-size'));
                return;
            }

            if (slips && images.length + newImages.length + slips[slips.length - 1]?.slips_data?.length > MAX_FILES) {
                alertError(t('error.too-many-files'), `${t('error.max-files-count')} ${MAX_FILES} ${t('error.files')}`);
                return;
            }

            if (images.length + newImages.length > MAX_FILES) {
                alertError(t('error.too-many-files'), `${t('error.max-files-count')} ${MAX_FILES} ${t('error.files')}`);
                return;
            }

            setOpenBackdrop(true);
            try {
                await Promise.all(newImages.map(file => handleCreateSlipVerifyUpload(file)));
            } finally {
                setOpenBackdrop(false);
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
            }
        }
    };

    const handleCreateSlipVerifyUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res: any = await createSlipUpload(formData, (progress) => {
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
                setImages((prev) => [...prev, file]);
                setSlipUploadPath((prev) => [...prev, mappedFiles]);
            } else {
                alertError(t('error.upload-failed'), t('error.try-again-later'));
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        }
    }

    const handleDelete = async (index: number) => {
        const newImages = [...images];
        const newImagesPath = [...slipUploadPath];
        try {
            setOpenBackdrop(true)
            const res = await deleteSlipUpload(slipUploadPath[index].file_name)
            if (res) {
                newImages.splice(index, 1);
                setImages(newImages);
                newImagesPath.splice(index, 1);
                setSlipUploadPath(newImagesPath);
            }
            setOpenBackdrop(false)
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    border: '2px dashed gray',
                    textAlign: 'center',
                    cursor: 'pointer',
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
                <Input
                    accept=".jpg, .jpeg, .png"
                    id="icon-button-file"
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    ref={inputRef}
                />
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <CloudUploadIcon fontSize="large" />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                    {t('modal.drag-and-drop-file')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {t('modal.type-file')}
                </Typography>
            </Paper>
            {images.length > 0 && (
                <Box mt={2}>
                    <Typography variant="subtitle2">
                        {t('modal.slip')} ({images.length}/{MAX_FILES - getCurrentSlipLength(slips)})
                    </Typography >
                    <ImageList
                        sx={{
                            gap: '4px !important',
                            marginTop: 0.5
                        }}
                        cols={5}
                    >
                        {images.map((image, index) => (
                            <ImageListItem
                                key={index}
                                sx={{
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    position: 'relative',
                                    '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    }
                                }}
                            >
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={image.name}
                                    loading="lazy"
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        padding: '4px',
                                        // backgroundColor: 'rgba(255,255,255,0.8)',
                                        // '&:hover': {
                                        //     backgroundColor: 'rgba(255,255,255,0.9)',
                                        // }
                                    }}
                                    size="small"
                                    onClick={() => handleDelete(index)}
                                >
                                    <RemoveCircleOutlineIcon fontSize="small" />
                                </IconButton>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box >
            )}
        </Box >
    );
};

export default SlipUpload;