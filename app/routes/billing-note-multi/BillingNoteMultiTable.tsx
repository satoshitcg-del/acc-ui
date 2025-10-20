import { useEffect, useState } from 'react';
import { Autocomplete, Backdrop, Box, Button, Checkbox, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { usePageEffect } from '@/core/page';
import { BoxShadowButton } from '@/core/constant';
import { IBillingList } from '@/core/interface/services';
import { BILLING_STATUS } from '@/core/enum';

// service
import BillingService from '@/services/BillingService';

// ----- Components -----
import CustomerProfileModal from "@/layout/components/modal-customer-profile/CustomerProfileModal.js";
import EmptyTable from '@/layout/components/table/EmptyTable';
import BillingNoteMultipleChangeStatusModal from '@/layout/components/modal-biiling-note/BillingNoteMultipleChangeStatusModal';
import BillingNoteMultiTableRow from './components/BillingNoteMultiTableRow';
import { FilterSearchBillingNoteMulti } from './components/FilterSearchBillingNoteMulti';
import PaginationMedium from "@/routes/pagination/Pagination";
import BillingNoteModal from '@/layout/components/modal-biiling-note/BillingNoteModal';
import BillingInvoiceHistoryModal from '@/layout/components/modal-biiling-note/BillingInvoiceHistoryModal';
import PdfViewerModal from '@/layout/components/modal-pdf/ModalPreviewPdf.js';
import Loading from '@/layout/components/loading/Loading';

// ----- Hook -----
import { useCustomerProfile } from "@/layout/components/modal-customer-profile/hook/useCustomerProfile.js";
import { useTranslateBillingStatus, useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useShowPdf } from '@/layout/components/modal-pdf/hook/useShowPdf.js';
import UploadSlipHistoryModal from '@/layout/components/slip-history/UploadSlipHistoryModal';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import { useCustomerSearchStore } from '@/core/storerecoil/useCustomerSearchStore';
import { formatThousandSeparator } from '@/core/utils';

export default function Component() {
    const { getNote, getHistory, getDashboard, exportPDF, getNextStatus, viewSlipHistory, getSlipImage, } = BillingService();
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { TranslateBillingStatus } = useTranslateBillingStatus()
    const { alertError } = useAlertDialog();
    const { resetSearchCustomer } = useCustomerSearchStore();
    let title = t("title.billing-note");
    usePageEffect({ title });
    const [triggerHandleSearch, setTriggerHandleSearch] = useState<boolean>(true)
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<any>([]);
    const { pdfUrl, openModalPdf, handleOpenPDFPreviewModal, ClosePDFPreviewModal, openActionModal, setOpenActionModal } = useShowPdf();
    const { customerProfile, profileType, customerProfileModal, setCustomerProfileModal, handleOpenCustomerProfileModalTypeBilling } = useCustomerProfile();
    const [selectStatus, setSelectStatus] = useState("")
    const [currentBillingStatus, setCurrentBillingStatus] = useState("")
    const [rowModal, setRowModal] = useState<any>([])
    const [openNote, setOpenNote] = useState(false);
    const [openHistory, setOpenHistory] = useState(false);

    const [page, setPage] = useState(1)
    const [limitPage, setLimitPage] = useState(50)
    const [pageAmount, setPageAmount] = useState({ count_data: 0, count_page: 0, row_amount: 0 });

    const handleCloseNote = () => setOpenNote(false);
    const handleOpenNote = async (id: string) => {
        try {
            setLoading(true)
            setOpenActionModal(true)
            const response = await getNote(id)
            setRowModal(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setOpenNote(true)
            setOpenActionModal(false)
        }
    };

    const handleCloseHistory = () => setOpenHistory(false);
    const [billingStatus, setBillingStatus] = useState<string>("")
    const handleOpenHistory = async (id: string, status: string) => {
        try {
            setLoading(true)
            setOpenActionModal(true)
            const response = await getHistory(id)
            setBillingStatus(status)
            setRowModal(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setOpenHistory(true)
            setOpenActionModal(false)
        }
    };

    const downloadPDF = async (id: string) => {
        try {
            setOpenActionModal(true)
            const response = await exportPDF(id)
            setOpenActionModal(false)
        } catch (error) {
            console.log(error)
        }
    };

    const [openStatus, setOpenStatus] = useState(false);
    const handleOpenStatus = () => setOpenStatus(true);
    const handleCloseStatus = () => setOpenStatus(false)

    const [dashboard, setDashboard] = useState<IBillingList[]>([])
    const getBillingNoteDashboard = async () => {
        try {
            const response = await getDashboard()
            setDashboard(response.data || [])
        } catch (error) {
            console.error(error)
        }
    }

    const [activeFilters, setActiveFilters] = useState<string>(BILLING_STATUS.DRAFT);
    const [statusForEdit, setStatusForEdit] = useState(['']);
    const [nextStatus, setNextStatus] = useState<any>()
    const getNextStatusBilling = async () => {
        try {
            const response: any = await getNextStatus()
            const data: Record<string, any[]> = response.data;
            const key = activeFilters.toLocaleLowerCase();
            const newMapStatus = data[key] || [];
            setStatusForEdit(newMapStatus);
            setNextStatus(response.data || [])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getBillingNoteDashboard()
        getNextStatusBilling()
        resetSearchCustomer()
    }, [])

    const handleSubmitEditBillingStatus = () => handleOpenStatus()
    const handleSelectedEditStatus = (event: any) => setSelectStatus(event)

    const [rowSelected, setRowSelected] = useState<number[]>([]);
    const handleSelectAllRow = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n: any) => n.id);
            setRowSelected(newSelected);
            return;
        }
        setRowSelected([]);
    };

    const handleSelectRow = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = rowSelected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(rowSelected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(rowSelected.slice(1));
        } else if (selectedIndex === rowSelected.length - 1) {
            newSelected = newSelected.concat(rowSelected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                rowSelected.slice(0, selectedIndex),
                rowSelected.slice(selectedIndex + 1),
            );
        }
        setRowSelected(newSelected);
    };

    const handleChangeToggleChipsFilter = (filterName: string) => {
        setSelectStatus('')
        setActiveFilters(filterName.toLocaleUpperCase());
        const key = filterName.toLocaleLowerCase();
        const newMapStatus = nextStatus[key] || [];
        setStatusForEdit(newMapStatus);
        setPage(1)
        setLimitPage(limitPage)
    };
    const [slipHistory, setSlipHistory] = useState<{ name: string, img_url: string }[]>([]);
    const [openSlipHistory, setOpenSlipHistory] = useState(false);
    const [invoiceSlipUploadData, setInvoiceSlipUploadData] = useState();
    const handleOpenUploadSlipHistory = async (id: string) => {
        try {
            setOpenActionModal(true)
            const response = await viewSlipHistory(id)
            setSlipHistory(response.data.slips)
            setInvoiceSlipUploadData(response.data)
        } catch (error: any) {
            console.log(error)
            alertError(TranslateErrorCode(error.data.code));
        } finally {
            setOpenActionModal(false)
            setOpenSlipHistory(true)
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
                    name: slip.file_name,
                    img_url: href
                };

                updatedSlips.push(imageUrlMapping);
            }
            return updatedSlips;
        } catch (error) {
            console.error("Error fetching slip images:", error);
        }
    };

    const [openUpdateInvoice, setUpdateInvoice] = useState(false);
    const handleOpenUpdateInvoice = () => setUpdateInvoice(true)
    const handleCloseUpdateInvoice = () => setUpdateInvoice(false)
    return (
        <>
            <Box
                sx={{
                    height: rows.length ? 'fit-content' : '450px',
                    width: '100%',
                    minWidth: '1120px',
                    '& .actions': {
                        color: 'text.secondary',
                    },
                    '& .textPrimary': {
                        color: 'text.primary',
                    },
                    '& .super-app.negative': {
                        color: 'red',
                    },
                    '& .super-app.positive': {
                        color: 'dataGrid.text.color',
                    },
                }}
            >
                <Box className="mb-4">
                    <Typography variant="h4" component={"h1"}>
                        {t('title.billing-note-multi')}
                    </Typography>
                </Box>
                <Box className="flex flex-row space-x-10">
                    {dashboard.map((data) => {
                        if (data.status !== BILLING_STATUS.PAID) {
                            return (
                                <Paper sx={{ width: "100%", my: 3 }} elevation={3} key={data.status}>
                                    <Box className="px-6 py-5 space-y-8">
                                        <Typography className='font-normal text-xs text-start'>{TranslateBillingStatus(data.status)}</Typography>
                                        <Typography className='font-medium text-3xl text-center'>{formatThousandSeparator(data.quantity)}</Typography>
                                        <Box className="w-full flex justify-end">
                                            <Button variant="text" className='font-normal text-xs' children="" />
                                        </Box>
                                    </Box>
                                </Paper>
                            );
                        }
                        return null;
                    })}
                </Box>
                <Paper className="w-full mt-5" >
                    <FilterSearchBillingNoteMulti
                        setCurrentBillingStatus={setCurrentBillingStatus}
                        setLimitPage={setLimitPage}
                        limitPage={limitPage}
                        page={page}
                        setPage={setPage}
                        loading={loading}
                        setLoading={setLoading}
                        setRows={setRows}
                        setSelectStatus={setSelectStatus}
                        setTriggerHandleSearch={setTriggerHandleSearch}
                        triggerHandleSearch={triggerHandleSearch}
                        pageAmount={pageAmount}
                        setPageAmount={setPageAmount}
                        setRowSelected={setRowSelected}
                        setActiveFilters={setActiveFilters}
                        activeFilters={activeFilters}
                        handleChangeToggleChipsFilter={handleChangeToggleChipsFilter}

                    />
                    <Box className="px-4 flex gap-4 py-2">
                        <Autocomplete
                            id="combo-box-demo"
                            size="small"
                            value={selectStatus || null}
                            options={statusForEdit}
                            isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField
                                    data-testid="billingnote-index-productrname-autocomplete"
                                    {...params}
                                    label={t("placeholder.status")}
                                    placeholder={t("placeholder.status")}
                                />
                            )}
                            onChange={(event, value) => handleSelectedEditStatus(value)}
                            style={{
                                width: "20%",
                                height: "32px",
                            }}
                            disabled={rowSelected && rowSelected.length != 0 ? false : true}
                        />
                        <Button
                            data-testid="billingnote-index-search-button"
                            variant="contained"
                            color="primary"
                            type="submit"
                            children={t('invoice.submit')}
                            sx={{
                                width: "93px",
                                height: "40px",
                                boxShadow: BoxShadowButton,
                            }}
                            onClick={handleSubmitEditBillingStatus}
                            disabled={rowSelected && rowSelected.length != 0 && selectStatus ? false : true}
                        />
                    </Box>
                    <TableContainer className="rounded-md">
                        <Table aria-label="collapsible table">
                            <TableHead sx={(theme) => ({
                                backgroundColor: theme.palette.example.tableHeader,
                                '& .MuiTableCell-root': {
                                    color: 'white',
                                    border: `1px solid ${theme.palette.example.inherit}`,
                                },
                            })}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', paddingX: 0, minWidth: 50 }} align="center">
                                        <Checkbox
                                            color="primary"
                                            indeterminate={rowSelected.length > 0 && rowSelected.length < rows.length}
                                            checked={rows.length > 0 && rowSelected.length === rows.length}
                                            onChange={handleSelectAllRow}
                                            inputProps={{
                                                'aria-label': 'select all desserts',
                                            }}
                                            sx={{
                                                width: '14px',
                                                height: '14px',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 50, width: 50 }} align="center">{t('table.number')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 120 }} align="center">{t('billing.invoice-no')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 100 }} align="center">{t('billing.bill-cycle')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 180 }} align="center">{t('billing.customer-info')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 160 }} align="center">{t('billing.invoice-group')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 180 }} align="center">{t('billing.product-prefix')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 160 }} align="center">{t('billing.status')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 220 }} align="center">{t('billing.total-price-crypto')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 200 }} align="center">{t('billing.overdue-price-crypto')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 160 }} align="center">{t('billing.closing-date')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 160 }} align="center">{t('billing.payment-due-date')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 160 }} align="center">{t('billing.date')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 160 }} align="center">{t('table.create-at')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 30 }} align="center">{t('invoice.pdf')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 30 }} align="center">{t('billing.export')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 30 }} align="center">{t('billing.history')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 70 }} align="center">{t('billing.pay-slip')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 30 }} align="center">{t('billing.note')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={(theme) => ({
                                '& .MuiTableCell-root': {
                                    border: `1px solid ${theme.palette.example.inherit}`,
                                },
                            })}>
                                {rows?.map((row: any, index: number) => (
                                    <BillingNoteMultiTableRow
                                        row={row}
                                        rowIndex={(page - 1) * limitPage + index + 1}
                                        rowSelected={rowSelected}
                                        handleSelectRow={handleSelectRow}
                                        handleOpenCustomerProfileModalTypeBilling={handleOpenCustomerProfileModalTypeBilling}
                                        handleOpenPDFPreviewModal={handleOpenPDFPreviewModal}
                                        handleOpenHistory={handleOpenHistory}
                                        handleOpenNote={handleOpenNote}
                                        downloadPDF={downloadPDF}
                                        handleOpenPaySlipHistory={handleOpenUploadSlipHistory}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {rows?.length > 0 ? null : (
                        <Box className="min-h-[40dvh]">
                            {loading
                                ?
                                <Box className="flex justify-center h-[55dvh]">
                                    <Box className=" flex items-center  w-[15rem]">
                                        <Loading />
                                    </Box>
                                </Box>
                                :
                                <EmptyTable />}
                        </Box>
                    )}
                    {rows?.length > 0 &&
                        <PaginationMedium
                            page={page}
                            setPage={setPage}
                            rowsPerPage={limitPage}
                            setRowsPerPage={setLimitPage}
                            dataAmount={pageAmount.count_data}
                            pageAmount={pageAmount.count_page}
                            rowAmount={pageAmount.row_amount}
                        />
                    }
                </Paper>
            </Box>

            {openActionModal &&
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={openActionModal}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            {customerProfile && (<CustomerProfileModal openModal={customerProfileModal} setOpenModal={setCustomerProfileModal} customerProfile={customerProfile} profileType={profileType} />)}
            {(openStatus && rowSelected) && (<BillingNoteMultipleChangeStatusModal openModal={openStatus} closeModal={handleCloseStatus} data={rowSelected} triggerHandleSearch={triggerHandleSearch} setTriggerHandleSearch={setTriggerHandleSearch} nextBillingStatus={selectStatus} currentBillingStatus={currentBillingStatus} setSelectStatus={setSelectStatus} />)}
            {openNote && (<BillingNoteModal openModal={openNote} closeModal={handleCloseNote} data={rowModal} />)}
            {openHistory && (<BillingInvoiceHistoryModal openModal={openHistory} closeModal={handleCloseHistory} data={rowModal} status={billingStatus} />)}
            {openSlipHistory && (<UploadSlipHistoryModal openModal={openSlipHistory} setOpenSlipHistory={setOpenSlipHistory} slips={slipHistory} invoiceSlipUploadData={invoiceSlipUploadData} setOpenActionModal={setOpenActionModal} />)}
            {openModalPdf && (<PdfViewerModal openModal={openModalPdf} pdfUrl={pdfUrl} closeModal={ClosePDFPreviewModal} />)}
        </>
    )
}

Component.display = "BillingNoteMultiTable"