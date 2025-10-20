import { useState } from "react";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { isValidFileType, isValidFileSize, isValidFilesCount, MAX_FILES_COUNT, MAX_FILE_SIZE } from '@/core/utils/fileValidation';
// Interface 
import { Action, CR_TICKET_STATUS } from "@/core/enum";
import { ICreateCrTicketReq, ICRTicketFileReq, IUpdateCrTicketReq } from "@/core/interface/services";
// Services
import TaskManagementService from "@/services/TaskManagementService";
import { t } from 'i18next';
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";

export const useTaskManagementModal = (reset: () => void, assignList: any) => {
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const [actionType, setActionType] = useState<string>(Action.Add)
    const { getOneTask, createTask, updateTaskById, createFileUpload, deleteFileUpload } = TaskManagementService()
    const [openModalTask, setOpenModalTask] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleCloseModalTask = () => {
        reset();
        handleClearDefaultData()
        setOpenModalTask(false)
    }

    const handleOpenAddModalTask = () => {
        setActionType(Action.Add)
        setStatus(CR_TICKET_STATUS.PENDING)
        setOpenModalTask(true)
    }

    const handleOpenEditTask = async (id: string) => {
        try {
            setActionType(Action.Edit)
            const res = await getOneTask(id)
            setOpenModalTask(true)

            const { _id, subject, description, files, priority, status, due_date, remark, assignees } = res.data
            const assigneeIds = assignees ? assignees.map((item: any) => item.id) : []
            setTaskId(_id)
            setSubject(subject)
            setDetails(description)
            setFileUploadPath(files ? files : [])
            setStatus(status)
            setPriority(priority)
            setTargetDate(due_date)
            setComment(remark)
            setAssignee(assignees ? assignList.filter((item: any) => assigneeIds.includes(item.id)) : [])

        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    }

    const [taskId, setTaskId] = useState('');
    const [subject, setSubject] = useState('');
    const [details, setDetails] = useState('');
    const [fileUploadPath, setFileUploadPath] = useState<ICRTicketFileReq[]>([]);
    const [fileUpload, setFileUpload] = useState<any>([]);
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [comment, setComment] = useState('');
    const [assignee, setAssignee] = useState([]);
    const [triggerAction, setTriggerAction] = useState<boolean>(true)

    const handleSubmitModal = async () => {
        try {
            const payload = {
                subject,
                description: details,
                files: fileUploadPath,
                priority: priority,
                status: status,
                due_date: targetDate,
                remark: comment,
                assignees: assignee.map((item: any) => item.id),
            };

            console.log(`CHECK ${actionType} TASK MANAGEMENT :`, payload);
            const res = actionType == Action.Add ? await createTask(payload as ICreateCrTicketReq) : await updateTaskById(taskId, payload as IUpdateCrTicketReq)
            alertSuccess(TranslateErrorCode(res?.code));
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        } finally {
            setTriggerAction(!triggerAction)
            handleCloseModalTask()
        }
    }

    const handleChangeSubject = (event: React.ChangeEvent<HTMLInputElement>) => setSubject(event.target.value as string);
    const handleChangeDetails = (event: React.ChangeEvent<HTMLTextAreaElement>) => setDetails(event.target.value);
    const handleChangeStatus = (event: SelectChangeEvent) => setStatus(event.target.value);
    const handleChangePriority = (event: SelectChangeEvent) => setPriority(event.target.value);
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (event.target.files) {
                const newFiles = Array.from(event.target.files);

                // Check total files count
                if (!isValidFilesCount(fileUploadPath?.length, newFiles?.length)) {
                    alertError(t('error.too-many-files'), `${t('error.max-files-count')} ${MAX_FILES_COUNT} ${t('error.files')}`);
                    return;
                }

                // Validate file types and sizes
                const invalidTypeFiles = newFiles?.filter(file => !isValidFileType(file));
                const oversizedFiles = newFiles?.filter(file => !isValidFileSize(file));

                if (invalidTypeFiles?.length > 0) {
                    alertError(t('error.invalid-file-type'), `${t('error.allowed-file-types')}`);
                    return;
                }

                if (oversizedFiles?.length > 0) {
                    alertError(t('error.file-too-large'), `${t('error.max-file-size')} ${(MAX_FILE_SIZE / (1024 * 1024))}MB`);
                    return;
                }

                // Create a new FormData object and append the files
                const formData = new FormData();
                newFiles?.forEach(file => {
                    formData.append('file', file);
                });

                if (newFiles?.length == 0) {
                    return
                }

                setIsUploading(true);
                setUploadProgress(0);
                // Integration with API to upload file
                const res: any = await createFileUpload(formData, (progress) => {
                    setUploadProgress(progress);
                });
                setIsUploading(false);
                console.log('RES UPLOAD FILE :', res);

                if (res) {
                    const mappedFiles: ICRTicketFileReq = {
                        full_path: res?.data?.full_path,
                        file_path: res?.data?.file_path,
                        file_name: res?.data?.file_name,
                        file_ext: res?.data?.file_ext,
                        created_at: res?.data?.created_at,
                        updated_at: res?.data?.updated_at,
                        file_name_preview: newFiles[0].name,
                        file_size: newFiles[0].size,
                    }
                    setFileUploadPath(prev => [mappedFiles, ...prev]);
                    setFileUpload((prev: any) => [...newFiles, ...prev]);
                } else {
                    alertError(t('error.upload-failed'), t('error.try-again-later'));
                }
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        }
    };
    const handleRemoveFile = async (file: ICRTicketFileReq, removeIndex: number) => {
        try {
            if (!file?.id) {
                await deleteFileUpload(file.file_name);
            }
            // Integration with API to remove file
            setFileUploadPath(prev => prev.filter((_, index) => index !== removeIndex));
            setFileUpload((prev: any) => prev.filter((f: any) => f.name !== file.file_name_preview));
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        }
    };
    const handleChangeComment = (event: React.ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value);
    const handleChangeTargetDate = (opening_date: any) => {
        if (!opening_date) return;
        const openingDateObject = dayjs(opening_date);

        if (!openingDateObject.isValid()) return;
        setTargetDate(openingDateObject.toISOString())
    };

    const handleChangeAssignee = (assignee: any) => {
        if (assignee) {
            setAssignee(assignee);
        }
    };

    const handleClearDefaultData = async () => {
        setTaskId('')
        setSubject('')
        setDetails('')
        setStatus('')
        setPriority('')
        setTargetDate('')
        setComment('')
        setAssignee([])
        setFileUploadPath([])
        setFileUpload([])
    }

    const handleDropFileUpload = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // ป้องกัน browser เปิดไฟล์โดยตรง
        try {
            const files = event.dataTransfer.files;
            if (!files || files.length === 0) return;

            const newFiles = Array.from(files);

            // Check total files count
            if (!isValidFilesCount(fileUploadPath?.length, newFiles?.length)) {
                alertError(
                    t('error.too-many-files'),
                    `${t('error.max-files-count')} ${MAX_FILES_COUNT} ${t('error.files')}`
                );
                return;
            }

            // Validate file types and sizes
            const invalidTypeFiles = newFiles.filter(file => !isValidFileType(file));
            const oversizedFiles = newFiles.filter(file => !isValidFileSize(file));

            if (invalidTypeFiles.length > 0) {
                alertError(t('error.invalid-file-type'), t('error.allowed-file-types'));
                return;
            }

            if (oversizedFiles.length > 0) {
                alertError(
                    t('error.file-too-large'),
                    `${t('error.max-file-size')} ${(MAX_FILE_SIZE / (1024 * 1024))}MB`
                );
                return;
            }

            if (newFiles.length === 0) return;

            const formData = new FormData();
            newFiles.forEach(file => formData.append('file', file));

            setIsUploading(true);
            setUploadProgress(0);

            const res: any = await createFileUpload(formData, progress => {
                setUploadProgress(progress);
            });

            setIsUploading(false);
            console.log('RES UPLOAD FILE:', res);

            if (res) {
                const mappedFiles: ICRTicketFileReq = {
                    full_path: res?.data?.full_path,
                    file_path: res?.data?.file_path,
                    file_name: res?.data?.file_name,
                    file_ext: res?.data?.file_ext,
                    created_at: res?.data?.created_at,
                    updated_at: res?.data?.updated_at,
                    file_name_preview: newFiles[0].name,
                    file_size: newFiles[0].size,
                };
                setFileUploadPath(prev => [mappedFiles, ...prev]);
                setFileUpload((prev: any) => [...newFiles, ...prev]);
            } else {
                alertError(t('error.upload-failed'), t('error.try-again-later'));
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        }
    };

    return {
        openModalTask,
        triggerAction,
        handleOpenAddModalTask,
        handleSubmitModal,
        handleOpenEditTask,
        handleCloseModalTask,
        subject,
        handleChangeSubject,
        details,
        handleChangeDetails,
        status,
        handleChangeStatus,
        priority,
        handleChangePriority,
        targetDate,
        handleChangeTargetDate,
        assignee,
        handleChangeAssignee,
        handleFileUpload,
        handleRemoveFile,
        comment,
        handleChangeComment,
        actionType,
        fileUploadPath,
        uploadProgress,
        isUploading,
        fileUpload,
        handleDropFileUpload,
    };
};
