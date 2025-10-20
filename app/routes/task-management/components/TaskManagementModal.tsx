import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextField,
    TextareaAutosize,
    Typography,
} from '@mui/material';
import { t } from 'i18next';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { FileUploadSection } from './FileUploadSection';

interface ComponentProps {
    openModalTask: boolean;
    handleCloseModalTask: () => void;
    assignList: any;
    handleSubmitModal: (data: any) => void;
    subject: string;
    handleChangeSubject: (event: React.ChangeEvent<HTMLInputElement>) => void;
    details: string;
    handleChangeDetails: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    status: string;
    handleChangeStatus: (event: SelectChangeEvent) => void;
    priority: string;
    handleChangePriority: (event: SelectChangeEvent) => void;
    targetDate: string;
    handleChangeTargetDate: (opening_date: any) => void;
    assignee: any;
    handleChangeAssignee: (assignee: any) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDropFileUpload: (event: React.DragEvent<HTMLDivElement>) => void;
    handleRemoveFile: (file: any, removeIndex: number) => void;
    comment: string;
    handleChangeComment: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    actionType: string;
    fileUploadPath: any[]
    priorityList: any[]
    statusList: any[]
    uploadProgress: any
    isUploading: boolean
    fileUpload?: any
}

export default function Component(props: ComponentProps) {
    const theme = useTheme();
    const {
        openModalTask,
        handleCloseModalTask,
        assignList,
        handleSubmitModal,
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
        priorityList,
        statusList,
        uploadProgress,
        isUploading,
        fileUpload,
        handleDropFileUpload,

    } = props;

    const ValidateSchema = yup.object().shape({
        subject: yup.string().required(t('validate.task-subject-require')),
        details: yup.string().required(t('validate.task-details-require')),
        status: yup.string().required(t('validate.task-status-require')),
        priority: yup.string().required(t('validate.task-priority-require')),
        assignee: yup.array().min(1, t('validate.task-assignee-require')).required(t('validate.task-assignee-require')),
        due_date: yup.string().required(t('validate.task-due-date-require')).typeError(t('validate.task-due-date-require')),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({
        resolver: yupResolver(ValidateSchema),
    });

    useEffect(() => {
        console.log("CHECKING EDIT VALUE :", subject, details, status, priority, targetDate, assignee);
        setValue('subject', subject);
        setValue('details', details);
        setValue('status', status);
        setValue('priority', priority);
        setValue('due_date', targetDate);
        setValue('assignee', assignee);
    }, []);

    const onSubmit = (data: any) => {
        handleSubmitModal(data);
    };

    const getTextAreaStyle = (hasError = false) => ({
        width: '100%',
        padding: '8px',
        resize: 'vertical',
        border: hasError ? '1px solid #d32f2f' : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'}`,
        borderRadius: '4px',
        fontFamily: 'inherit',
        fontSize: '16px',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
        color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit',
        outline: 'none',
        transition: 'border-color 0.2s',
    }) as React.CSSProperties;

    return (
        <Modal
            open={openModalTask}
            onClose={handleCloseModalTask}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box
                sx={{
                    ...style,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: 700,
                    maxHeight: "calc(100vh - 20px)",
                    overflowY: "auto",
                }}>
                <Typography variant='h6' sx={{ color: "modal.title_color", fontWeight: "bold" }}>
                    {t(`title.${actionType}-task`)}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, alignItems: "start", width: "100%" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }}>
                            <Typography>{t('modal.subject')}</Typography>
                            <TextField
                                fullWidth
                                id="task-subject"
                                placeholder={t('placeholder.subject')}
                                label={t('modal.subject')}
                                variant="outlined"
                                size='small'
                                {...register('subject', {
                                    required: {
                                        value: true,
                                        message: 'error',
                                    },
                                })}
                                value={subject}
                                onChange={handleChangeSubject}
                                error={errors.subject ? true : false}
                                helperText={errors.subject?.message as string}
                            />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }}>
                            <Typography>{t('modal.details')}</Typography>
                            <Box sx={{
                                width: '100%',
                                '& textarea:focus': {
                                    borderColor: theme.palette.primary.main + '!important',
                                }
                            }}>
                                <TextareaAutosize
                                    placeholder={t('placeholder.details')}
                                    minRows={4}
                                    style={getTextAreaStyle(Boolean(errors.details))}
                                    {...register('details', {
                                        required: {
                                            value: true,
                                            message: 'error',
                                        },
                                    })}
                                    value={details}
                                    onChange={handleChangeDetails}
                                />
                            </Box>
                            {errors.details && (
                                <FormHelperText sx={{ pl: 2, mt: -0.2 }} error>
                                    {errors.details.message as string}
                                </FormHelperText>
                            )}
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "start", width: "100%" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }} >
                                <Typography>{t('modal.status')}</Typography>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    error={Boolean(errors.status)}
                                >
                                    <InputLabel id="task-status-label">{t('modal.status')}</InputLabel>
                                    <Select
                                        labelId="task-status-label"
                                        id="task-status"
                                        value={status || ''}
                                        label={t('modal.status')}
                                        onChange={(event) => {
                                            setValue('status', event.target.value);
                                            handleChangeStatus(event);
                                        }}
                                    >
                                        {statusList.map((status: any) => (
                                            <MenuItem
                                                key={`Status ${status.id}`}
                                                value={status.id}
                                            >
                                                {status.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.status && (
                                        <FormHelperText>{errors.status.message as string}</FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }}>
                                <Typography>{t('modal.priority')}</Typography>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    error={Boolean(errors.priority)}
                                >
                                    <InputLabel id="task-priority-label">{t('modal.priority')}</InputLabel>
                                    <Select
                                        labelId="task-priority-label"
                                        id="task-priority"
                                        value={priority || ''}
                                        label={t('modal.priority')}
                                        onChange={(event) => {
                                            setValue('priority', event.target.value);
                                            handleChangePriority(event)
                                        }}
                                    >
                                        {priorityList.map((priority: any) => (
                                            <MenuItem
                                                key={`Priority ${priority.id}`}
                                                value={priority.id}
                                            >
                                                {priority.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.priority && (
                                        <FormHelperText>{errors.priority.message as string}</FormHelperText>
                                    )}
                                </FormControl>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }}>
                            <Typography>{t('modal.target-date')}</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={['year', 'month', 'day']}
                                    sx={{ width: "100%" }}
                                    value={targetDate ? dayjs(targetDate) : null}
                                    onChange={(date: any) => {
                                        setValue('due_date', date);
                                        handleChangeTargetDate(date);
                                    }}
                                    format="DD/MM/YYYY"
                                    label={t('modal.target-date')}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            inputProps: {
                                                'data-testid': "customer-formaddproductcustomer-openingdate-datepicker"
                                            },
                                            error: Boolean(errors.due_date),
                                            helperText: errors.due_date ? errors.due_date.message : '',
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }}>
                            <Typography>{t('modal.assignee')}</Typography>
                            <Autocomplete
                                fullWidth
                                multiple
                                size='small'
                                id="tags-outlined"
                                options={assignList}
                                noOptionsText={t('placeholder.no-options')}
                                getOptionLabel={(option: any) => option.full_name || ""}
                                value={assignee}
                                onChange={(event, newValue: any) => {
                                    setValue('assignee', newValue);
                                    handleChangeAssignee(newValue);
                                }}
                                filterSelectedOptions
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderOption={(props, option) => {
                                    const { key, ...rest } = props;
                                    return (
                                        <li key={key} {...rest}>
                                            {option.full_name}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('modal.assignee')}
                                        placeholder={t('placeholder.assignee')}
                                        error={errors.assignee ? true : false}
                                        helperText={errors.assignee?.message as string}
                                    />
                                )}
                            />

                        </Box>

                        <FileUploadSection
                            handleFileUpload={handleFileUpload}
                            handleRemoveFile={handleRemoveFile}
                            fileUploadPath={fileUploadPath}
                            uploadProgress={uploadProgress}
                            isUploading={isUploading}
                            fileUpload={fileUpload}
                            actionType={actionType}
                            handleDropFileUpload={handleDropFileUpload}
                        />

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }}>
                            <Typography>{t('modal.comment')}</Typography>
                            <Box sx={{
                                width: '100%',
                                '& textarea:focus': {
                                    borderColor: theme.palette.primary.main + '!important',
                                }
                            }}>
                                <TextareaAutosize
                                    placeholder={t('placeholder.comment')}
                                    minRows={4}
                                    style={getTextAreaStyle()}
                                    value={comment}
                                    onChange={handleChangeComment}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingY: "20px" }}>
                        <Button
                            variant="text"
                            data-testid="customer-addcustomer-cancel-button"
                            children={t("button.cancel")}
                            onClick={handleCloseModalTask}
                        />
                        <Button
                            type="submit"
                            data-testid="customer-addcustomer-submit-button"
                            variant="text"
                            children={t("button.save")}
                        />
                    </Box>
                </form>
            </Box>
        </Modal>
    );
}

Component.displayName = 'TaskManagementModal';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: (theme: any) => theme.palette.mode === 'dark' ? '0px 4px 20px rgba(0, 0, 0, 0.5)' : 24,
    px: 4,
    pt: 2,
};