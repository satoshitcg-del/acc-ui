import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageEffect } from '@/core/page';
// MUI
import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
// Component
import Loading from '@/layout/components/loading/Loading';
import EmptyTable from '@/layout/components/table/EmptyTable';
import PaginationMedium from "@/routes/pagination/Pagination";
import TaskManagementModal from './components/TaskManagementModal';
import TaskManagementService from '@/services/TaskManagementService';
import TaskManagementRow from './components/TaskManagementRow';
import { ModalConfirmDelete, useModalConfirmDelete } from '@/layout/components/modal-confirm-delete';
// Hooks
import { useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useTaskManagementModal } from './hooks/useTaskManagementModal';
// Servives
import UserTagService from '@/services/UserTagService';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { CR_TICKET_STATUS, CR_TICKET_PRIORITY } from '@/core/enum';
import { BoxShadowButton } from '@/core/constant';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import { useCustomerSearchStore } from '@/core/storerecoil/useCustomerSearchStore';

interface Assignee {
    id: string;
    full_name: string;
}

export function CreateData(
    _id: string,
    cr_no: string,
    priority: string,
    status: string,
    subject: string,
    created_by: string,
    due_data: Date,
    created_at: Date,
    assignee: Assignee[],
    updated_by: string,
    description: string,
    comment: string,
    table_number: number
) {
    return {
        _id,
        cr_no,
        priority,
        status,
        subject,
        created_by,
        due_data,
        created_at,
        assignee,
        updated_by,
        description,
        comment,
        table_number
    };
}

export default function Component() {
    const { t } = useTranslation()
    let title = t("title.task-management");
    usePageEffect({ title });

    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();
    const { resetSearchCustomer } = useCustomerSearchStore();
    const [taskTableRows, setTaskTableRows] = useState<any[] | []>([]);
    const [loading, setLoading] = useState(true);
    const { handleSubmit, reset } = useForm({})
    const [searchCrNo, setSearchCrNo] = useState('');
    const [searchStartDate, setSearchStartDate] = useState('');
    const [searchEndDate, setSearchEndDate] = useState('');
    const [searchStatus, setSearchStatus] = useState<string>(CR_TICKET_STATUS.ALL);  // Default empty string means "all"
    const [searchPriority, setSearchPriority] = useState<string>(CR_TICKET_PRIORITY.ALL);  // Default empty string means "all"
    const [searchAssignee, setSearchAssignee] = useState<any>(); // { id: '0', full_name: t('select.all') }

    const { getSaleOwnerList } = UserTagService()
    const { getTaskLists } = TaskManagementService()

    const [pageAmount, setPageAmount] = useState({ count_data: 0, count_page: 0, row_amount: 0 });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const statusListForFilter = [
        {
            id: CR_TICKET_STATUS.ALL,
            name: t('select.all'),
        },
        {
            id: CR_TICKET_STATUS.PENDING,
            name: t('task.status-pending'),
        },
        {
            id: CR_TICKET_STATUS.PROCESS,
            name: t('task.status-process'),
        },
        {
            id: CR_TICKET_STATUS.DONE,
            name: t('task.status-done'),
        },
        {
            id: CR_TICKET_STATUS.CANCEL,
            name: t('task.status-cancel'),
        }
    ]

    const priorityListForFilter = [
        {
            id: CR_TICKET_PRIORITY.ALL,
            name: t('select.all'),
        },
        {
            id: CR_TICKET_PRIORITY.HIGH,
            name: t('task.priority-high'),
        },
        {
            id: CR_TICKET_PRIORITY.MEDIUM,
            name: t('task.priority-medium'),
        },
        {
            id: CR_TICKET_PRIORITY.LOW,
            name: t('task.priority-low'),
        }
    ]
    const statusList = [
        {
            id: CR_TICKET_STATUS.PENDING,
            name: t('task.status-pending'),
            color: 'text.secondary'
        },
        {
            id: CR_TICKET_STATUS.PROCESS,
            name: t('task.status-process'),
            color: 'primary.main'
        },
        {
            id: CR_TICKET_STATUS.DONE,
            name: t('task.status-done'),
            color: 'success.main'
        },
        {
            id: CR_TICKET_STATUS.CANCEL,
            name: t('task.status-cancel'),
            color: 'error.main'
        }
    ]

    const priorityList = [
        {
            id: CR_TICKET_PRIORITY.HIGH,
            name: t('task.priority-high'),
            color: 'error.main'
        },
        {
            id: CR_TICKET_PRIORITY.MEDIUM,
            name: t('task.priority-medium'),
            color: 'warning.main'
        },
        {
            id: CR_TICKET_PRIORITY.LOW,
            name: t('task.priority-low'),
            color: 'primary.main'
        }
    ]

    const handleSearch = async () => {
        try {
            const body = {
                cr_no: searchCrNo,
                priority: searchPriority === CR_TICKET_PRIORITY.ALL ? '' : searchPriority,
                status: searchStatus === CR_TICKET_STATUS.ALL ? '' : searchStatus,
                start_date: searchStartDate,
                end_date: searchEndDate,
                assignees: searchAssignee?.id || '',
                page: page,
                limit: rowsPerPage,
            }
            console.log("search body req", body);

            const res = await getTaskLists(body)
            const products = res?.data?.products || []
            setLoading(true)
            const rows = products.map((item: any, index: number) =>
                CreateData(
                    item?._id,
                    item?.cr_no,
                    item?.priority,
                    item?.status,
                    item?.subject,
                    item?.created_by.full_name,
                    item?.due_date,
                    item?.created_at,
                    item?.assignees.map((item: any) => item.full_name),
                    item?.updated_by.full_name,
                    item?.description,
                    item?.comment,
                    (page - 1) * rowsPerPage + index + 1
                )
            );
            setTaskTableRows(rows)
            setPageAmount({
                count_data: rows.length,
                count_page: res?.pagination?.total_pages,
                row_amount: res?.data?.products?.length,
            });
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = () => {
        setPage(1)
        handleSearch();
    };

    const handleChangeSearchStartDate = (start_date: any) => {
        if (!start_date) return;
        const openingDateObject = dayjs(start_date);

        if (!openingDateObject.isValid()) return;
        setSearchStartDate(openingDateObject.toISOString())
    };
    const handleChangeSearchEndDate = (end_date: any) => {
        if (!end_date) return;
        const openingDateObject = dayjs(end_date);

        if (!openingDateObject.isValid()) return;
        setSearchEndDate(openingDateObject.toISOString())
    };
    const handleChangeSearchPriority = (event: SelectChangeEvent) => setSearchPriority(event.target.value);
    const handleChangeSearchStatus = (event: SelectChangeEvent) => setSearchStatus(event.target.value);
    const handleChangeSearchAssignee = (assignee: any) => assignee ? setSearchAssignee(assignee) : setSearchAssignee(null)
    const handleClearSearch = () => {
        setSearchCrNo('')
        setSearchPriority(CR_TICKET_PRIORITY.ALL)
        setSearchStatus(CR_TICKET_STATUS.ALL)
        setSearchStartDate('')
        setSearchEndDate('')
        setSearchAssignee(null)
    };
    // Get list of assignees
    const [saleOwnerList, setSaleOwnerList] = useState([]);
    const handleGetSaleOwnerList = async () => {
        try {
            const res: any = await getSaleOwnerList();
            const checkPrefixListsNull = res?.data || [];
            // const saleOwnerListWithAll: any = [
            //     {
            //         id: '0',
            //         full_name: t('select.all')
            //     },
            //     ...checkPrefixListsNull
            // ];
            // console.log("checkPrefixListsNull", saleOwnerListWithAll);
            setSaleOwnerList(checkPrefixListsNull);
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    };

    useEffect(() => {
        handleGetSaleOwnerList()
        resetSearchCustomer()
    }, []);

    const {
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
        comment,
        handleChangeComment,
        actionType,
        handleRemoveFile,
        fileUploadPath,
        uploadProgress,
        isUploading,
        fileUpload,
        handleDropFileUpload,

    } = useTaskManagementModal(reset, saleOwnerList)

    const {
        trigerDelete,
        modalDelete,
        handleOpenModalDeleteCrticket,
        handleCloseModalDelete,
        onSubmitDeleteCrTicket,

    } = useModalConfirmDelete();

    useEffect(() => {
        handleSearch();
    }, [trigerDelete, triggerAction, page, rowsPerPage]);


    return (
        <React.Fragment>
            <Box className="flex justify-between mb-4 gap-6 ">
                <Typography variant="h4" component={"h1"}>
                    {t('title.task-management')}
                </Typography>
                <Button
                    data-testid="customer-customertable-addproduct-button"
                    variant="contained"
                    color="primary"
                    children={`+ ${t("button.add-task")}`}
                    onClick={handleOpenAddModalTask}
                />
            </Box>
            <Paper className="w-full mt-5" >
                <Box className="w-full p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box className="flex justify-start space-x-3" >
                            <TextField
                                data-testid="billingnote-index-invoicenumber-text"
                                id="search-invoice"
                                label={t('table.id')}
                                placeholder={t('table.id')}
                                size="small"
                                value={searchCrNo}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchCrNo(event.target.value as string)}
                                fullWidth
                            // sx={{ minWidth: '150px' }}
                            />
                            <FormControl
                                size="small"
                                fullWidth
                            // sx={{ minWidth: '160px' }}
                            >
                                <InputLabel id="task-priority-label">{t('modal.priority')}</InputLabel>
                                <Select
                                    labelId="task-priority-label"
                                    id="task-priority"
                                    value={searchPriority || ''}
                                    label={t('modal.priority')}
                                    onChange={(event) => {
                                        handleChangeSearchPriority(event)
                                    }}
                                >
                                    {priorityListForFilter.map((priority: any) => (
                                        <MenuItem
                                            key={`Priority ${priority.id}`}
                                            value={priority.id}
                                        >
                                            {priority.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl
                                size="small"
                                fullWidth
                            // sx={{ minWidth: '160px' }}
                            >
                                <InputLabel id="task-status-label">{t('modal.status')}</InputLabel>
                                <Select
                                    labelId="task-status-label"
                                    id="task-status"
                                    value={searchStatus || ''}
                                    label={t('modal.status')}
                                    onChange={(event) => {
                                        handleChangeSearchStatus(event);
                                    }}
                                >
                                    {statusListForFilter.map((status: any) => (
                                        <MenuItem
                                            key={`Status ${status.id}`}
                                            value={status.id}
                                        >
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Autocomplete
                                fullWidth
                                // sx={{ minWidth: '180px' }}
                                size='small'
                                id="tags-outlined"
                                options={saleOwnerList}
                                getOptionLabel={(option: any) => option.full_name || ""}
                                value={searchAssignee || null}
                                onChange={(event, newValue: any) => {
                                    handleChangeSearchAssignee(newValue);
                                }}
                                // filterSelectedOptions
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
                                    />
                                )}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={['year', 'month', 'day']}
                                    label={t('placeholder.start-date')}
                                    sx={{ width: "100%" }}
                                    // sx={{ minWidth: '200px' }}
                                    value={searchStartDate ? dayjs(searchStartDate) : null}
                                    onChange={(date: any) => {
                                        handleChangeSearchStartDate(date);
                                    }}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            inputProps: {
                                                'data-testid': "customer-formaddproductcustomer-openingdate-datepicker"
                                            },
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={['year', 'month', 'day']}
                                    label={t('placeholder.end-date')}
                                    sx={{ width: "100%" }}
                                    // sx={{ minWidth: '200px' }}
                                    value={searchEndDate ? dayjs(searchEndDate) : null}
                                    onChange={(date: any) => {
                                        handleChangeSearchEndDate(date);
                                    }}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            inputProps: {
                                                'data-testid': "customer-formaddproductcustomer-openingdate-datepicker"
                                            },
                                            // error: Boolean(false),
                                            // helperText: false ? 'errors.due_date.message' : '',
                                        }
                                    }}
                                />
                            </LocalizationProvider>

                            <Button
                                data-testid="billingnote-index-search-button"
                                variant="contained"
                                color="primary"
                                type="submit"
                                children={t('invoice.search')}
                                sx={{
                                    width: "93px",
                                    height: "40px",
                                    boxShadow: BoxShadowButton,
                                }}
                            />
                            <Button
                                data-testid="billingnote-index-clear-button"
                                variant="contained"
                                color="secondary"
                                children={t('invoice.clear')}
                                onClick={handleClearSearch}
                                sx={{
                                    width: "93px",
                                    height: "40px",
                                }}
                            />
                        </Box>
                    </form>
                </Box>
                <TableContainer className='rounded-md'>
                    <Table aria-label="collapsible table">
                        <TableHead sx={(theme) => ({
                            backgroundColor: theme.palette.example.tableHeader,
                            '& .MuiTableCell-root': {
                                color: 'white',
                                border: `1px solid ${theme.palette.example.inherit}`,
                            },
                        })}>
                            <TableRow>
                                <TableCell sx={{ minWidth: 50, width: 50, fontWeight: 'bold', p: 1 }} align="center">{t('table.number')}</TableCell>
                                <TableCell sx={{ minWidth: "100px", fontWeight: 'bold', p: 1 }} align="center">{t('table.id')}</TableCell>
                                <TableCell sx={{ minWidth: "60px", fontWeight: 'bold', p: 1 }} align="center">{t('table.priority')}</TableCell>
                                <TableCell sx={{ minWidth: "60px", fontWeight: 'bold', p: 1 }} align="center">{t('table.status')}</TableCell>
                                <TableCell sx={{ minWidth: "120px", fontWeight: 'bold', p: 1 }} align="center">{t('table.list')}</TableCell>
                                <TableCell sx={{ minWidth: "40px", fontWeight: 'bold', p: 1 }} align="center">{t('table.create-by')}</TableCell>
                                <TableCell sx={{ minWidth: "40px", fontWeight: 'bold', p: 1 }} align="center">{t('table.create-at')}</TableCell>
                                <TableCell sx={{ minWidth: "150px", fontWeight: 'bold', p: 1 }} align="center">{t('table.due-date')}</TableCell>
                                <TableCell sx={{ minWidth: "50px", fontWeight: 'bold', p: 1 }} align="center">{t('table.assignee')}</TableCell>
                                <TableCell sx={{ minWidth: "40px", fontWeight: 'bold', p: 1 }} align="center">{t('table.updated-by')}</TableCell>
                                <TableCell sx={{ minWidth: "120px", fontWeight: 'bold', p: 1 }} align="center">{t('table.action')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={(theme) => ({
                            '& .MuiTableCell-root': {
                                border: `1px solid ${theme.palette.example.inherit}`,
                            },
                        })}>
                            {taskTableRows.map((row, i) => (
                                <TaskManagementRow
                                    key={row._id}
                                    row={row}
                                    handleOpenModalDeleteCrticket={handleOpenModalDeleteCrticket}
                                    handleOpenEditTask={handleOpenEditTask}
                                    statusList={statusList}
                                    priorityList={priorityList}
                                />
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
                {taskTableRows.length > 0 && (
                    <PaginationMedium
                        page={page}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        dataAmount={pageAmount.count_data}
                        pageAmount={pageAmount.count_page}
                        rowAmount={pageAmount.row_amount}
                    />
                )}
                {taskTableRows.length > 0 || false ? null : (
                    <Box sx={{ minHeight: 'calc(100vh - 250px)' }}>
                        {loading ?
                            <Box className="flex justify-center h-full">
                                <Box className="flex items-center w-[15rem]">
                                    <Loading />
                                </Box>
                            </Box>
                            : <EmptyTable />}
                    </Box>
                )}
            </Paper>


            {openModalTask &&
                <TaskManagementModal
                    openModalTask={openModalTask}
                    handleCloseModalTask={handleCloseModalTask}
                    assignList={saleOwnerList}
                    handleSubmitModal={handleSubmitModal}
                    subject={subject}
                    handleChangeSubject={handleChangeSubject}
                    details={details}
                    handleChangeDetails={handleChangeDetails}
                    status={status}
                    handleChangeStatus={handleChangeStatus}
                    priority={priority}
                    handleChangePriority={handleChangePriority}
                    targetDate={targetDate}
                    handleChangeTargetDate={handleChangeTargetDate}
                    assignee={assignee}
                    handleChangeAssignee={handleChangeAssignee}
                    handleFileUpload={handleFileUpload}
                    comment={comment}
                    handleChangeComment={handleChangeComment}
                    actionType={actionType}
                    handleRemoveFile={handleRemoveFile}
                    fileUploadPath={fileUploadPath}
                    priorityList={priorityList}
                    statusList={statusList}
                    uploadProgress={uploadProgress}
                    isUploading={isUploading}
                    fileUpload={fileUpload}
                    handleDropFileUpload={handleDropFileUpload}
                />
            }

            {modalDelete &&
                <ModalConfirmDelete
                    title={t("modal.title-delete-cr-ticket")}
                    description={
                        <>
                            {t("placeholder.delete1")}
                            <br />
                            {t("placeholder.delete2")}
                        </>
                    }
                    openModal={modalDelete}
                    closeModal={handleCloseModalDelete}
                    ConfirmDelete={onSubmitDeleteCrTicket}
                />
            }
        </React.Fragment>
    )
}

Component.display = "TaskManagement"