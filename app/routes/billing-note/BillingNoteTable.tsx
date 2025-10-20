import { useEffect, useState } from 'react';
import { Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Loading from '@/layout/components/loading/Loading';

import { useTranslation } from 'react-i18next';
import { usePageEffect } from '@/core/page';
import BillingNoteModal from '@/layout/components/modal-biiling-note/BillingNoteModal';
import BillingInvoiceHistoryModal from '@/layout/components/modal-biiling-note/BillingInvoiceHistoryModal';
import PdfViewerModal from '@/layout/components/modal-pdf/ModalPreviewPdf.js';
// service
import BillingService from '@/services/BillingService';
import numeral from 'numeral';

// ----- Components -----
import CustomerProfileModal from "@/layout/components/modal-customer-profile/CustomerProfileModal.js";
import EmptyTable from '@/layout/components/table/EmptyTable';
import PaginationMedium from "@/routes/pagination/Pagination";
import BillingNoteTableRow from './components/BillingNoteTableRow';
import BillingNoteChangeStatusModal from '@/layout/components/modal-biiling-note/BillingNoteChangeStatusModal';
import CreateDraftModal from './components/CreateDraftModal';

// ----- Hook -----
import { useCustomerProfile } from "@/layout/components/modal-customer-profile/hook/useCustomerProfile.js";
import { useTranslateBillingStatus, useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useShowPdf } from '@/layout/components/modal-pdf/hook/useShowPdf.js';
import { IBillingList } from '@/core/interface/services';
import { ModalConfirmDelete, useModalConfirmDelete } from '@/layout/components/modal-confirm-delete';
import { FilterSearchBillingNote } from './components/FilterSearchBillingNote';
import UploadSlipHistoryModal from '../../layout/components/slip-history/UploadSlipHistoryModal';
import UpdateInvoiceModal from './components/UpdateInvoiceModal';
import VerifyPaymentModal from './components/VerifyPaymentModal';
import { BILLING_STATUS } from '@/core/enum';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import { useCustomerSearchStore } from '@/core/storerecoil/useCustomerSearchStore';
import { formatThousandSeparator } from '@/core/utils';

export default function Component() {
    const { getNote, getHistory, getDashboard, getBillingNote, exportPDF, viewSlipHistory, getSlipImage, getVerifyPayment, getAccountVerifyPayment, getPaymentImageUpload } = BillingService();
    const { trigerDelete, modalDelete, handleOpenModalDeleteDraftInvoice, handleCloseModalDelete, onSubmitDeleteDraftInvoice } = useModalConfirmDelete();
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { TranslateBillingStatus } = useTranslateBillingStatus()
    let title = t("title.billing-note");
    usePageEffect({ title });
    const [triggerHandleSearch, setTriggerHandleSearch] = useState<boolean>(true)
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<any>([]);
    const [pageAmount, setPageAmount] = useState({ count_data: 0, count_page: 0, row_amount: 0 });
    const [page, setPage] = useState(1)
    const [limitPage, setLimitPage] = useState(50)
    const { pdfUrl, openModalPdf, handleOpenPDFPreviewModal, ClosePDFPreviewModal, openActionModal, setOpenActionModal } = useShowPdf();
    const { customerProfile, profileType, customerProfileModal, setCustomerProfileModal, handleOpenCustomerProfileModalTypeBilling } = useCustomerProfile();

    const [rowModal, setRowModal] = useState<any>([])
    const [openNote, setOpenNote] = useState(false);
    const { alertError } = useAlertDialog();
    const { resetSearchCustomer } = useCustomerSearchStore();

    const handleOpenNote = async (id: string) => {
        try {
            setLoading(true)
            setOpenActionModal(true)
            const response = await getNote(id)
            setRowModal(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setOpenActionModal(false)
            setLoading(false)
            setOpenNote(true)
        }
    };

    const handleCloseNote = () => setOpenNote(false);
    const [paymentImage, setPaymentImage] = useState<string>("");
    const [openHistory, setOpenHistory] = useState(false);
    const [billingStatus, setBillingStatus] = useState<string>("")
    const handleOpenHistory = async (id: string, status: string) => {
        try {
            setLoading(true)
            setOpenActionModal(true)
            const response = await getHistory(id)
            if (response && response.data?.file_name) {
                const res = await getPaymentImageUpload(response.data?.file_name);
                setPaymentImage(res || "");
            } else {
                setPaymentImage("");
            }
            setRowModal(response.data)
            setBillingStatus(status)
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        } finally {
            setOpenActionModal(false)
            setLoading(false)
            setOpenHistory(true)
        }
    };

    const handleCloseHistory = () => setOpenHistory(false);

    const downloadPDF = async (id: string) => {
        try {
            setOpenActionModal(true)
            const response = await exportPDF(id)
            setOpenActionModal(false)
        } catch (error) {
            console.log(error)
        } finally {
            setOpenActionModal(false)
        }
    };

    const [openStatus, setOpenStatus] = useState(false);
    const handleOpenStatus = () => setOpenStatus(true);
    const handleCloseStatus = () => {
        setTempStatus({})
        setOpenStatus(false)
    };

    const [dashboard, setDashboard] = useState<IBillingList[]>([])

    const [tempStatus, setTempStatus] = useState<any>({})

    const getBillingNoteDashboard = async () => {
        try {
            const response = await getDashboard()
            setDashboard(response.data || [])
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        }
    }
    const handleStatusModal = async (tempStatus: any, row: any) => {
        setTempStatus({
            props: {
                value: tempStatus
            }
        })
        if (tempStatus === BILLING_STATUS.VERIFYPAYMENT) {
            try {
                setLoading(true)
                setOpenActionModal(true)
                const response = await getVerifyPayment(row?.id)
                setRowModal(response.data)
            } catch (error: any) {
                alertError(TranslateErrorCode(error.data.code));
            } finally {
                setOpenActionModal(false)
                setLoading(false)
            }
        } else {
            setRowModal(row)
        }
        handleOpenStatus()
    }

    useEffect(() => {
        resetSearchCustomer();
    }, [])

    useEffect(() => {
        getBillingNoteDashboard()
    }, [triggerHandleSearch, trigerDelete])

    const [slipHistory, setSlipHistory] = useState<{ name: string, img_url: string }[]>([]);
    const [openSlipHistory, setOpenSlipHistory] = useState(false);
    const [invoiceSlipUploadData, setInvoiceSlipUploadData] = useState();
    const handleOpenUploadSlipHistory = async (id: string) => {
        try {
            setOpenActionModal(true)
            const response = await viewSlipHistory(id)
            setSlipHistory(response.data.slips || [])
            setInvoiceSlipUploadData(response.data)
        } catch (error: any) {
            console.log(error)
            alertError(TranslateErrorCode(error.data.code));
        } finally {
            setOpenActionModal(false)
            setOpenSlipHistory(true)
        }
    }

    const [openUpdateInvoice, setUpdateInvoice] = useState(false);
    const handleOpenUpdateInvoice = () => setUpdateInvoice(true)
    const handleCloseUpdateInvoice = () => setUpdateInvoice(false)

    const [openVerifyPayment, setOpenVerifyPayment] = useState(false);
    const handleOpenVerifyPayment = async (id: string) => {
        try {
            setLoading(true)
            setOpenActionModal(true)
            const response = await getAccountVerifyPayment(id)
            console.log("CHECK VERIFY PAYMENT API", response);
            setRowModal(response.data)
        } catch (error: any) {
            console.log(error)
            alertError(TranslateErrorCode(error.data.code));
        } finally {
            setOpenActionModal(false)
            setLoading(false)
            setOpenVerifyPayment(true)
        }
    }
    const handleCloseVerifyPayment = () => setOpenVerifyPayment(false)
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
                <Box className="flex justify-between mb-4 gap-6">
                    <Typography variant="h4" component={"h1"}>
                        {t('title.billing-note')}
                    </Typography>
                    <Box className="flex gap-4">
                        <Button
                            data-testid="button-update-invoice"
                            variant="contained"
                            color="warning"
                            children={t("button.create-update-invoice")}
                            onClick={handleOpenUpdateInvoice}
                        />
                    </Box>
                </Box>

                <Box className="flex flex-row space-x-10">
                    {dashboard.map((data) => {
                        if (data.status !== "PENDING") {
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
                    <FilterSearchBillingNote
                        setRows={setRows}
                        loading={loading}
                        setLoading={setLoading}
                        triggerHandleSearch={triggerHandleSearch}
                        setTriggerHandleSearch={setTriggerHandleSearch}
                        trigerDelete={trigerDelete}
                        page={page}
                        setPage={setPage}
                        limitPage={limitPage}
                        setLimitPage={setLimitPage}
                        pageAmount={pageAmount}
                        setPageAmount={setPageAmount}
                    />
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
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 50, width: 50 }} align="center">{t('table.number')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 120 }} align="center">{t('billing.invoice-no')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 100 }} align="center">{t('billing.bill-cycle')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 180 }} align="center">{t('billing.customer-info')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 160 }} align="center">{t('billing.invoice-group')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 180 }} align="center">{t('billing.product-prefix')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 210 }} align="center">{t('billing.status')}</TableCell>
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
                                    <BillingNoteTableRow
                                        row={row}
                                        handleOpenCustomerProfileModalTypeBilling={handleOpenCustomerProfileModalTypeBilling}
                                        handleOpenModalDeleteDraftInvoice={handleOpenModalDeleteDraftInvoice}
                                        handleOpenPDFPreviewModal={handleOpenPDFPreviewModal}
                                        downloadPDF={downloadPDF}
                                        handleOpenHistory={handleOpenHistory}
                                        handleOpenNote={handleOpenNote}
                                        rowIndex={(page - 1) * limitPage + index + 1}
                                        handleStatusModal={handleStatusModal}
                                        handleOpenPaySlipHistory={handleOpenUploadSlipHistory}
                                        handleOpenVerifyPayment={handleOpenVerifyPayment}
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
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
                    open={openActionModal}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            {modalDelete &&
                <ModalConfirmDelete
                    title={t("modal.title-delete-invoice")}
                    description={
                        <>
                            {t("placeholder.delete1")}
                            <br />
                            {t("placeholder.delete2")}
                        </>
                    }
                    openModal={modalDelete}
                    closeModal={handleCloseModalDelete}
                    ConfirmDelete={onSubmitDeleteDraftInvoice}
                />
            }
            {customerProfile && (
                <CustomerProfileModal
                    openModal={customerProfileModal}
                    setOpenModal={setCustomerProfileModal}
                    customerProfile={customerProfile}
                    profileType={profileType}
                />
            )}
            {openStatus && (<BillingNoteChangeStatusModal openModal={openStatus} closeModal={handleCloseStatus} data={rowModal} tempStatus={tempStatus} triggerHandleSearch={triggerHandleSearch} setTriggerHandleSearch={setTriggerHandleSearch} setOpenActionModal={setOpenActionModal} />)}
            {openNote && (<BillingNoteModal openModal={openNote} closeModal={handleCloseNote} data={rowModal} />)}
            {openHistory && (<BillingInvoiceHistoryModal openModal={openHistory} closeModal={handleCloseHistory} data={rowModal} status={billingStatus} imagePayment={paymentImage} />)}
            {openModalPdf && (<PdfViewerModal openModal={openModalPdf} pdfUrl={pdfUrl} closeModal={ClosePDFPreviewModal} />)}
            {openSlipHistory && (<UploadSlipHistoryModal openModal={openSlipHistory} setOpenSlipHistory={setOpenSlipHistory} slips={slipHistory} invoiceSlipUploadData={invoiceSlipUploadData} setOpenActionModal={setOpenActionModal} />)}
            {openUpdateInvoice && (<UpdateInvoiceModal openModal={openUpdateInvoice} handleCloseModal={handleCloseUpdateInvoice} setTriggerHandleSearch={setTriggerHandleSearch} triggerHandleSearch={triggerHandleSearch} />)}
            {openVerifyPayment && (<VerifyPaymentModal openModal={openVerifyPayment} handleCloseModal={handleCloseVerifyPayment} setTriggerHandleSearch={setTriggerHandleSearch} triggerHandleSearch={triggerHandleSearch} setOpenActionModal={setOpenActionModal} handleOpenPDFPreviewModal={handleOpenPDFPreviewModal} data={rowModal} />)}
        </>
    )
}


Component.display = "BillingNoteTable"