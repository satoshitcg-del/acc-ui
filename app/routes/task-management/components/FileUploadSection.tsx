import { ICRTicketFileReq } from "@/core/interface/services";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import TaskManagementService from "@/services/TaskManagementService";
import { Box, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import { t } from "i18next";
import { getFileIcon } from "./FileIcons";
import {
    Visibility as VisibilityIcon,
    Download as DownloadIcon,
    FileUploadOutlined,
    Close as CloseIcon
} from "@mui/icons-material";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { Action } from "@/core/enum";
import React from "react";

export const FileUploadSection = ({ handleFileUpload, handleRemoveFile, fileUploadPath, isUploading, uploadProgress, fileUpload, actionType, handleDropFileUpload }: {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDropFileUpload: (event: React.DragEvent<HTMLDivElement>) => void;
    handleRemoveFile: (file: any, removeIndex: number) => void;
    fileUploadPath: ICRTicketFileReq[];
    isUploading: boolean;
    uploadProgress: any;
    fileUpload?: any;
    actionType: string;
}) => {
    const { exportFileUpload, previewFileUpload } = TaskManagementService()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handlePreviewAdd = async (file_name_preview: any) => {
        try {
            const targetFile = fileUpload.find((file: File) => file.name === file_name_preview);
            if (!targetFile) {
                alertError(t('error.file-not-found'));
                return;
            }

            const href = URL.createObjectURL(targetFile);
            window.open(href, '_blank');
            setTimeout(() => {
                URL.revokeObjectURL(href);
            }, 1000);
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    };

    const handlePreviewEdit = async (file_path: any, file_ext: string) => {
        try {
            const response = await previewFileUpload(file_path, file_ext);
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    };

    const handleDownloadAdd = async (file_path: string) => {
        try {
            const href = URL.createObjectURL(fileUpload[0]);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', file_path);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    };

    const handleDownloadEdit = async (file_path: string) => { // ยังไม่สามารถดาวน์โหลดไฟล์ได้
        try {
            const response = await exportFileUpload(file_path);
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
            }}>
                <Typography variant="subtitle1" fontWeight="500">
                    {t('modal.attachment')}
                </Typography>
                {fileUploadPath?.length > 0 && (
                    <Typography variant="caption" color="textSecondary">
                        {fileUploadPath.length} {t('modal.files-selected')}
                    </Typography>
                )}
            </Box>
            <Box sx={{
                width: '100%',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                p: 3,
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#fafafa',
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.lighter',
                }
            }}
                onClick={() => inputRef.current?.click()}
            // onDrop={handleDropFileUpload}
            // onDragOver={(e) => e.preventDefault()}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={!isUploading && <FileUploadOutlined />}
                        disabled={isUploading} // ปิดปุ่มระหว่างอัปโหลด
                        sx={{
                            mb: 1,
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
                            '&:hover': {
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f5f5',
                            },
                            position: 'relative', // สำหรับ CircularProgress
                        }}
                    >
                        {isUploading ? `${t('button.uploading')} ${uploadProgress}%` : t('button.upload-files')}
                        <input
                            type="file"
                            hidden
                            ref={inputRef}
                            style={{ display: "none" }}
                            onChange={handleFileUpload}
                            accept=".jpg,.jpeg,.gif,.png,.bmp,.doc,.docm,.docx,.pdf,.txt,.ppt,.pptm,.pptx,.csv,.xls,.xlsm"
                        />
                        {isUploading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'primary.main',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Button>
                </Box>

                {fileUploadPath?.length > 0 && (
                    <Box sx={{
                        mt: 2,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        pr: 1,
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#555' : '#bdbdbd',
                            borderRadius: '3px',
                        }
                    }}>
                        {fileUploadPath?.map((file, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1.5,
                                    mb: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#ffffff',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : '#f8f8f8',
                                        borderColor: 'primary.main',
                                        transform: 'translateX(4px)'
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Box sx={{ mr: 2 }}>
                                    {getFileIcon(file?.file_ext)}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography noWrap
                                        sx={{
                                            fontWeight: 500,
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            maxWidth: 380
                                        }}>
                                        {file?.file_name_preview}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Typography variant="caption" color="textSecondary">
                                            {(file?.file_size / 1024 / 1024).toFixed(2)} MB
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            •
                                        </Typography>
                                        <Typography variant="caption" color="primary">
                                            {file?.file_ext?.split('.')[1].toUpperCase()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            actionType == Action.Add ? handlePreviewAdd(file?.file_name_preview) : handlePreviewEdit(file?.file_name, file?.file_ext)
                                        }}
                                        sx={{
                                            '&:hover': {
                                                color: 'primary.main',
                                                backgroundColor: 'primary.lighter'
                                            }
                                        }}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            actionType == Action.Add ? handleDownloadAdd(file?.file_name_preview) : handleDownloadEdit(file?.file_name)
                                        }}
                                        sx={{
                                            '&:hover': {
                                                color: 'success.main',
                                                backgroundColor: 'success.lighter'
                                            }
                                        }}
                                    >
                                        <DownloadIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFile(file, index)
                                        }}
                                        sx={{
                                            '&:hover': {
                                                color: 'error.main',
                                                backgroundColor: 'error.lighter'
                                            }
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};