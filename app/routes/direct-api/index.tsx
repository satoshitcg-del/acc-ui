import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageEffect } from '@/core/page';
// MUI
import { Backdrop, Box, Button, Chip, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// Component
import Loading from '@/layout/components/loading/Loading';
import EmptyTable from '@/layout/components/table/EmptyTable';
import PaginationMedium from "../pagination/Pagination";
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import DirectApiModal from './components/DirectApiModal';
import PreviewDirectApiModal from './components/PreviewDirectApiModal';
import ChangeStatusDirectApi from './components/ChangeStatusDirectApi';
import BillingInvoiceHistoryModal from '@/layout/components/modal-biiling-note/BillingInvoiceHistoryModal';
import { ModalConfirmDelete, useModalConfirmDelete } from '@/layout/components/modal-confirm-delete';
// Hooks
import { useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useCustomerSearchStore } from '@/core/storerecoil/useCustomerSearchStore';
// Types
import { ColumnDirectApiProps } from './DirectApiProps';
// Utils
import { Action, BILLING_STATUS, BILLING_TYPE } from '@/core/enum';
import { IBillingCategory, } from '@/layout/components/modal-biiling-note/BillingNoteData';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// Services
import DirectApiService from '@/services/DirectApiService';
import { useShowPdf } from '@/layout/components/modal-pdf/hook/useShowPdf';
import DirectApiTableRow from './components/DirectApiTableRow';

const directColumns: readonly ColumnDirectApiProps[] = [
    { columnId: "id", label: "number", minWidth: 50, width: 50, align: "center" },
    { columnId: "ticketNo", label: "ticket-no", minWidth: 100, align: "center", bodyAlign: "center" },
    { columnId: "customerName", label: "customer-name", minWidth: 140, align: "center", bodyAlign: "left" },
    { columnId: "billingCycle", label: "billing-cycle", minWidth: 80, maxWidth: 140, align: "center" },
    { columnId: "totalAmount", label: "total-amount", minWidth: 120, align: "center", bodyAlign: "center" },
    { columnId: "status", label: "status", width: 240, align: "center" },
    { columnId: "history", label: "history", maxWidth: 60, align: "center", bodyAlign: "center" },
    { columnId: "preview", label: "preview", maxWidth: 60, align: "center", bodyAlign: "center" },
    { columnId: "management", label: "action", minWidth: 80, maxWidth: 120, align: "center" },
];

export default function Component() {
    const { t } = useTranslation()
    let title = t("title.direct-api");
    usePageEffect({ title });
    const theme = useTheme();

    const { getDirectApiList, getDirectApiViewById, getOneDirectApi, getDirectApiHistory } = DirectApiService();
    const { openActionModal, setOpenActionModal } = useShowPdf();
    const { trigerDelete, modalDelete, handleCloseModalDelete, handleOpenModalDeleteDirectApi, onSubmitDeleteDerectApi } = useModalConfirmDelete();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();
    const { resetSearchCustomer } = useCustomerSearchStore();
    const [directProducts, setDirectProducts] = useState<any[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [actionType, setActionType] = useState<string>(Action.Add);
    const [filterSearchTable, setFilterSearchTable] = useState({ customerName: '', status: 'ALL', date: '' });
    const [triggerAction, setTriggerAction] = useState(false);
    // Pagination controller
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [page, setPage] = useState(1);
    const [pageAmount, setPageAmount] = useState({ count_data: 0, count_page: 0, row_amount: 0 });
    const [modifiedDirectApi, setModifiedDirectApi] = useState<any>();
    const [openDirectModal, setOpenDirectModal] = useState(false);
    useEffect(() => {
        handleSearch();
    }, [triggerAction, trigerDelete, page, rowsPerPage]);

    const handleSearch = async () => {
        try {
            setDirectProducts([])
            setLoading(true);
            const body = {
                full_name: filterSearchTable.customerName,
                status: filterSearchTable.status === BILLING_STATUS.ALL ? "" : filterSearchTable.status,
                // date: filterSearchTable.date ? dayjs(filterSearchTable.date).format("MM/YYYY") : "",
                month: filterSearchTable.date ? dayjs(filterSearchTable.date).format("MM") : "",
                year: filterSearchTable.date ? dayjs(filterSearchTable.date).format("YYYY") : "",
                page: page,
                limit: rowsPerPage,
            }
            const res = await getDirectApiList(body);
            setDirectProducts(res?.data || []);
            setPageAmount({
                ...pageAmount,
                count_data: res?.pagination?.total,
                count_page: res?.pagination?.total_pages,
                row_amount: res?.data?.length,
            });
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        resetSearchCustomer()
    }, [])

    const handleFilterSearchTable = () => {
        setPage(1);
        handleSearch();
    }

    const handleClearFilterSearchTable = () => {
        setFilterSearchTable({ customerName: '', status: 'ALL', date: '' });
    }

    const handleOpenAddDirectApiModal = () => {
        setActionType(Action.Add);
        setModifiedDirectApi([]);
        setOpenDirectModal(true)
    }

    const handleOpenEditDirectApiModal = async (id: string) => {
        try {
            setOpenActionModal(true)
            const res = await getOneDirectApi(id)
            console.log("Edit Direct PAI Product", res);
            setActionType(Action.Edit);
            setModifiedDirectApi(res?.data || {});
            setOpenDirectModal(true)
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            setOpenActionModal(false)
        }
    }

    const [oepnPreviewDirectApiModal, setOpenPreviewDirectApiModal] = useState(false);
    const [previewDirectApiData, setPreviewDirectApiData] = useState<any>();
    const handleOpenPreviewDirectApiModal = async (id: string) => {
        try {
            setOpenActionModal(true)
            const res = await getDirectApiViewById(id);
            console.log("Preview Direct PAI Product", res);
            setPreviewDirectApiData(res?.data || {});
            setOpenPreviewDirectApiModal(true)
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            setOpenActionModal(false)
        }
    }

    const [openChangeStatus, setOpenChangeStatus] = useState(false);
    const [directApiId, setDirectApiId] = useState<string>();
    const [directApiStatus, setDirectApiStatus] = useState<string>();
    const [oldDirectApiStatus, setOldDirectApiStatus] = useState<string>();
    const handleOpenChangeStatus = (id: string, old_status: string, status: string) => {
        try {
            setDirectApiId(id);
            setDirectApiStatus(status);
            setOldDirectApiStatus(old_status)
            setOpenChangeStatus(true);
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        }
    }

    const [openHistory, setOpenHistory] = useState(false);
    const [directApiHistory, setDirectApiHistory] = useState<any>();
    const handleOpenDirectApiHistory = async (id: string) => {
        try {
            setOpenActionModal(true)
            const res = await getDirectApiHistory(id)
            console.log("History Direct PAI Product", res);
            setDirectApiHistory(res?.data || {});
            setOpenHistory(true);
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            setOpenActionModal(false)
        }
    }

    const handleChangeStatusSearch = (filterName: string) => {
        let filterStatus = categoryStatusDirectApi.filter((e) => e.name === filterName)
        setFilterSearchTable({
            ...filterSearchTable,
            status: filterStatus[0].status,
        });
        setTriggerAction(!triggerAction);
        setPage(1);
    };
    const [openDatePicker, setOpenDatePicker] = useState(false)
    return (
        <Box
            sx={{
                width: '100%',
                minWidth: '1040px',
            }}
        >
            <Box className="flex mb-4 gap-6 justify-between items-center">
                <Typography variant="h4" component={"h1"}>
                    {t('title.direct-api')}
                </Typography>
                <Button
                    data-testid="direct-api-add-button"
                    variant="contained"
                    color="primary"
                    children={`+ ${t("button.add")}`}
                    onClick={handleOpenAddDirectApiModal}
                />
            </Box>

            <Paper className="w-full mt-5 rounded-md">
                {/* Filter Direct API */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 2,
                                justifyContent: 'flex-end',
                                width: '100%',
                            }}
                        >
                            <TextField
                                data-testid="direct-search-customername-text"
                                id="customer-name-input"
                                label={t("placeholder.customer-name")}
                                size="small"
                                fullWidth
                                onChange={(e) => setFilterSearchTable({ ...filterSearchTable, customerName: e.target.value })}
                                value={filterSearchTable.customerName}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    open={openDatePicker}
                                    onClose={() => setOpenDatePicker(false)}
                                    label={t('modal.target-month')}
                                    // maxDate={dayjs()}
                                    // minDate={dayjs().subtract(12, 'month')}
                                    openTo="year"
                                    views={['year', 'month']}
                                    format="MM/YYYY"
                                    sx={{ width: '100%' }}
                                    value={filterSearchTable.date ? dayjs(filterSearchTable.date) : null}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            inputProps: {
                                                'data-testid': "direct-date-datepicker",
                                                readOnly: true,
                                            },
                                            onClick: () => setOpenDatePicker(true)
                                        }
                                    }}
                                    onChange={(date: any) => {
                                        if (!date) return;
                                        const openingDateObject = dayjs(date).date(15);

                                        if (!openingDateObject.isValid()) return;
                                        setFilterSearchTable({ ...filterSearchTable, date: openingDateObject.toISOString() })
                                    }}
                                />
                            </LocalizationProvider>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, }}>
                                <Button
                                    data-testid="employee-search-button"
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{
                                        width: "7%",
                                        height: "40px",
                                        marginRight: "5px",
                                        marginLeft: "5px",
                                    }}
                                    onClick={() => handleFilterSearchTable()}
                                >
                                    {t("button.search")}
                                </Button>
                                <Button
                                    disabled={!filterSearchTable.customerName && !filterSearchTable.status}
                                    data-testid="employee-clear-button"
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        width: "7%",
                                        height: "40px",
                                        marginRight: "5px",
                                        marginLeft: "5px",
                                    }}
                                    onClick={() => handleClearFilterSearchTable()}
                                >
                                    {t("button.clear")}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </form>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', marginX: 1.5, marginBottom: 1 }}>
                    {categoryStatusDirectApi.map((category) => (
                        <Chip
                            data-testid="billingnote-index-categoryname-chip"
                            key={category.name}
                            label={category.status}
                            onClick={() => handleChangeStatusSearch(category.name)}
                            size="small"
                            variant="outlined"
                            style={{
                                backgroundColor: filterSearchTable?.status.includes(category.status)
                                    ? category.activeColor
                                    : '',

                                color: theme.palette.mode === "light" && !filterSearchTable?.status.includes(category.status) ? 'black' : 'white',
                                borderColor: filterSearchTable?.status.includes(category.status) ? category.activeColor : '',
                                cursor: 'pointer',
                                margin: "4px"
                            }}
                            disabled={loading}
                        />
                    ))}
                </Box>
                {/* Direct API Table */}
                <TableContainer className='rounded-md'>
                    <Table aria-label="sticky table">
                        <TableHead sx={(theme) => ({
                            backgroundColor: theme.palette.example.tableHeader,
                            '& .MuiTableCell-root': {
                                color: 'white',
                                border: `1px solid ${theme.palette.example.inherit}`,
                            },
                        })}>
                            <TableRow>
                                {directColumns.map((column) => (
                                    <TableCell
                                        key={column.columnId}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, width: column.width, fontWeight: 'bold', maxWidth: column.maxWidth || 'none' }}
                                        sx={{ p: 1 }}
                                    >
                                        {t(`table.${column.label}`)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {directProducts.map((row, index) => (
                                <DirectApiTableRow
                                    key={row.id}
                                    row={row}
                                    index={index}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    directColumns={directColumns}
                                    categoryList={categoryStatusDirectApi}
                                    handleOpenChangeStatus={handleOpenChangeStatus}
                                    handleOpenDirectApiHistory={handleOpenDirectApiHistory}
                                    handleOpenPreviewDirectApiModal={handleOpenPreviewDirectApiModal}
                                    handleOpenEditDirectApiModal={handleOpenEditDirectApiModal}
                                    handleOpenModalDeleteDirectApi={handleOpenModalDeleteDirectApi}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {directProducts.length > 0 || false ? null : (
                    <Box sx={{ minHeight: 'calc(80vh - 220px)' }}>
                        {loading ?
                            <Box className="flex justify-center h-full">
                                <Box className="flex items-center w-[15rem]">
                                    <Loading />
                                </Box>
                            </Box>
                            : <EmptyTable />}
                    </Box>
                )}
                {directProducts.length > 0 &&
                    <PaginationMedium
                        page={page}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        dataAmount={pageAmount.count_data}
                        pageAmount={pageAmount.count_page}
                        rowAmount={pageAmount.row_amount}
                    />
                }
            </Paper>

            {openActionModal &&
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
                    open={openActionModal}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }

            {openDirectModal &&
                <DirectApiModal
                    open={openDirectModal}
                    setOpen={setOpenDirectModal}
                    actionType={actionType}
                    defaultData={modifiedDirectApi}
                    triggerAction={triggerAction}
                    setTriggerAction={setTriggerAction}
                    setOpenActionModal={setOpenActionModal}
                />
            }

            {oepnPreviewDirectApiModal &&
                <PreviewDirectApiModal
                    open={oepnPreviewDirectApiModal}
                    setOpen={setOpenPreviewDirectApiModal}
                    previewData={previewDirectApiData}
                />
            }

            {modalDelete &&
                <ModalConfirmDelete
                    title={t("modal.title-delete-direct-api")}
                    description={
                        <>
                            {t("placeholder.delete1")}
                            <br />
                            {t("placeholder.delete2")}
                        </>
                    }
                    openModal={modalDelete}
                    closeModal={handleCloseModalDelete}
                    ConfirmDelete={onSubmitDeleteDerectApi}
                />
            }

            {openChangeStatus &&
                <ChangeStatusDirectApi
                    open={openChangeStatus}
                    setOpen={setOpenChangeStatus}
                    id={directApiId || ""}
                    status={directApiStatus}
                    oldStatus={oldDirectApiStatus}
                    triggerAction={triggerAction}
                    setTriggerAction={setTriggerAction}
                />
            }

            {openHistory &&
                <BillingInvoiceHistoryModal
                    openModal={openHistory}
                    closeModal={() => setOpenHistory(false)}
                    data={directApiHistory}
                    type={BILLING_TYPE.DIRECT_API}
                />
            }

        </Box>
    )
}

Component.display = "DirectApi";

export const categoryStatusDirectApi: IBillingCategory[] = [
    {
        name: "All",
        status: "ALL",
        activeColor: "#3956A5",
    },
    {
        name: "Draft",
        status: "DRAFT",
        activeColor: "#F7CD00",
    },
    {
        name: "Approve",
        status: "APPROVE",
        activeColor: "#B8CB49",
    },
    {
        name: "Editrequested",
        status: "EDIT_REQUESTED",
        activeColor: "#DF204C",
    },
]