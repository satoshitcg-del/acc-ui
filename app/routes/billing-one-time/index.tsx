import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, FormControl, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { usePageEffect } from '@/core/page';
import { BoxShadowButton } from '@/core/constant';

// service
import BillingService from '@/services/BillingService';
import dayjs from 'dayjs';
import OneTimeBillingService from '@/services/OneTimeBillingService';
import { IBillingList, IOneTimeBillingListRequest, IOneTimeItem } from '@/core/interface/services';

// ----- Components -----
import OneTimeInvoiceModal from './components/OneTimeInvoiceModal';
import PaginationMedium from "@/routes/pagination/Pagination";
import PdfViewerModal from '@/layout/components/modal-pdf/ModalPreviewPdf';
import BillingInvoiceHistoryModal from '@/layout/components/modal-biiling-note/BillingInvoiceHistoryModal';
import { ModalConfirmDelete, useModalConfirmDelete } from '@/layout/components/modal-confirm-delete';
import Loading from '@/layout/components/loading/Loading';
import EmptyTable from '@/layout/components/table/EmptyTable';
import OneTimeBillingRow from './components/OneTimeBillingRow';
import OneTimeNoteModal from './components/OneTimeNoteModal';

// ----- Hook -----
import { useTranslateBillingStatus, useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useFetchCustomer } from '@/layout/components/modal-add-product/hooks';
import { useOneTimeChangeStatusModal } from './hooks/useOneTimeChangeStatusModal';
import { useShowPdf } from '@/layout/components/modal-pdf/hook/useShowPdf';
import { useOneTimeInvoiceModal } from './hooks/useOneTimeInvoiceModal';
import { useCalendar } from '../product-management/hooks';

// ----- Interface -----
import { BILLING_TYPE, ONETIME_BILLING_STATUS } from '@/core/enum';
import { IBillingCategory, onetimeStatusCategory } from '@/layout/components/modal-biiling-note/BillingNoteData';
import { useOnetimeCalendar } from './hooks/useOnetimeCalendar';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import { useCustomerSearchStore } from '@/core/storerecoil/useCustomerSearchStore';
import CustomerProfileModal from '@/layout/components/modal-customer-profile/CustomerProfileModal';
import { useCustomerProfile } from '@/layout/components/modal-customer-profile/hook/useCustomerProfile';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandIcon from '@mui/icons-material/Expand';
interface Product {
    id: string;
    product_name: string;
}

export function CreateData(
    id: string,
    customer_name: string,
    invoice_number: string,
    product_name: string,
    prefix: string,
    total_price: number,
    status: string,
    created_date: Date,
    pricing_type: string,
    type: string,
    items: IOneTimeItem[],
    next_status: string[],
    wallet_type: string,
    wallet_no: string,
    customer_id: string,
    index: number,
) {
    return {
        id,
        customer_name,
        invoice_number,
        product_name,
        prefix,
        total_price,
        status,
        created_date,
        pricing_type,
        type,
        items,
        next_status,
        wallet_type,
        wallet_no,
        customer_id,
        index,
    };
}

export default function Component() {
    const { t } = useTranslation()
    let title = t("title.billing-note");
    usePageEffect({ title });
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { getOnetimeDashboard } = OneTimeBillingService();
    const { getOneTimeLists, getSubProductLists } = OneTimeBillingService()
    const { TranslateBillingStatus } = useTranslateBillingStatus()
    const [triggerHandleSearch, setTriggerHandleSearch] = useState<boolean>(true)
    const [loading, setLoading] = useState(true);
    const { customerProfile, profileType, customerProfileModal, setCustomerProfileModal, handleOpenCustomerProfileModalTypeBilling } = useCustomerProfile();

    // Pagination controller
    const [pageAmount, setPageAmount] = useState({ count_data: 0, count_page: 0, row_amount: 0 });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    // Modal invoice one time controller
    const { customersForSelect } = useFetchCustomer();

    // Dashboard controller
    const [dashboard, setDashboard] = useState<IBillingList[]>([])
    const getBillingNoteDashboard = async () => {
        // setLoading(true)
        try {
            const response = await getOnetimeDashboard()
            setDashboard(response.data || [])
        } catch (error) {
            console.error(error)
        }
    }

    const [subProducts, setSubProducts] = useState<any[]>([])
    const getSubProducts = async () => {
        try {
            const response: any = await getSubProductLists()
            setSubProducts(response?.data || [])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getSubProducts()
        getBillingNoteDashboard()
        resetSearchCustomer()
    }, [])

    // For filter
    const { exportPDF } = BillingService();
    const { month, years, selectMonthBillingNote, selectYearBillingNote, handleClearSelect, handleMonthBillingNoteChange, handleYearBillingNoteChange } = useOnetimeCalendar();
    const { register, handleSubmit, reset } = useForm({})
    const [activeFilters, setActiveFilters] = useState<string[]>([ONETIME_BILLING_STATUS.ALL]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [product, setProduct] = useState<Product | null>(null)
    const [prefix, setPrefix] = useState("");
    const [categoryMultipleList, _] = useState<IBillingCategory[]>(onetimeStatusCategory)
    const theme = useTheme();
    const { alertError } = useAlertDialog();
    const { resetSearchCustomer } = useCustomerSearchStore();
    const [rowsInvoiceTable, setRowsInvoiceTable] = useState<any[] | []>([]);
    const handleInvoiceNo = (event: React.ChangeEvent<HTMLInputElement>) => setInvoiceNo(event.target.value as string);
    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => setCustomerName(event.target.value as string);
    const handlePrefix = (event: React.ChangeEvent<HTMLInputElement>) => setPrefix(event.target.value.toLocaleUpperCase() as string);

    const handleClear = () => {
        reset()
        setProduct(null)
        setInvoiceNo('')
        setCustomerName('')
        handleClearSelect()
        setActiveFilters([ONETIME_BILLING_STATUS.ALL]);
        setTriggerHandleSearch(!triggerHandleSearch);
        setPrefix('')
    };

    const handleSearch = async () => {
        try {
            let joinStatus = activeFilters.join(',');
            const body: IOneTimeBillingListRequest = {
                invoice_no: invoiceNo,
                prefix: prefix,
                full_name: customerName,
                status: joinStatus === ONETIME_BILLING_STATUS.ALL ? "" : joinStatus,
                month: selectMonthBillingNote === 0 ? "" : selectMonthBillingNote,
                year: selectYearBillingNote === 0 ? "" : selectYearBillingNote,
                limit: rowsPerPage,
                page: page,
            }
            setLoading(true)
            const res: any = await getOneTimeLists(body)
            const rows = res?.data?.map((item: any, index: number) =>
                CreateData(
                    item?.id,
                    item?.customer_name,
                    item?.invoice_number,
                    item?.product_name,
                    item?.prefix,
                    item?.total_price,
                    item?.status,
                    item?.created_date,
                    item?.pricing_type,
                    item?.type,
                    item?.items,
                    item?.next_status,
                    item?.wallet_type,
                    item?.wallet_no,
                    item?.customer_id,
                    (page - 1) * rowsPerPage + index + 1,
                )
            );
            setRowsInvoiceTable(rows)
            setPageAmount({
                ...pageAmount,
                count_data: res?.pagination?.total,
                count_page: res?.pagination?.total_pages,
                row_amount: res?.data?.length,
            });
        } catch (error: any) {
            console.error(error);
            alertError(TranslateErrorCode(error.response.data.code) || "Error").then((result) => {
                if (result.isConfirmed) {
                    setTriggerHandleSearch(!triggerHandleSearch);
                }
            });
        } finally {
            setLoading(false)
        }
    }

    const toggleFilter = (filterName: string) => {
        let filterStatus = onetimeStatusCategory.filter((e) => e.name === filterName)
        setActiveFilters([filterStatus[0].status]);
        setTriggerHandleSearch(!triggerHandleSearch);
    };

    const onSubmit = () => {
        handleSearch();
    };

    // Hooks
    const {
        handleOpenAddInvoice,
        handleCloseAddInvoice,
        handleCustomerID,
        handleSubmitModal,
        openAddInvoice,
        handleChangePrefix,
        handleOpenEditInvoice,
        customerID,
        handleAddItem,
        handleRemoveItem,
        handleItemChange,
        items,
        prefixInit,
        selectPrefixId,
        actionType,
        // For history modal use
        handleOpenHistory,
        handleCloseHistory,
        openHistory,
        rowModal,
        wallet,
        walletNo,

    } = useOneTimeInvoiceModal(setTriggerHandleSearch, triggerHandleSearch)

    const {
        trigerDelete,
        modalDelete,
        handleOpenModalDeleteOnetimeBilling,
        handleCloseModalDelete,
        onSubmitDeleteOnetimeBlling

    } = useModalConfirmDelete();

    const {
        trigerChangeStatus,
        modalStatusToggle,
        handleCloseModalChangeStatus,
        onSubmitChangeStatusOneTimeBilling,
        walletType,
        walletAddress,
        handleChangeWalletType,
        handleChangeWalletAddress,
        setNote,
        changeStatusReq,
        handleOpenModalChangeStatus,
        currencyList,
        statusType,
        handleChangeStatusType,
        currency,
        handleChangeCurrency,
        paidValue,
        handleChangePaid,
        reason,
        handleChangeReason,
        userCredit,
        totalPrice,
        validatePaidValue,
        validateWalletType,
        validateWalletAddress,

    } = useOneTimeChangeStatusModal();

    const {
        pdfUrl,
        openModalPdf,
        handleOpenPDFPreviewModal,
        ClosePDFPreviewModal

    } = useShowPdf();

    useEffect(() => {
        handleSearch();
        getBillingNoteDashboard();
    }, [triggerHandleSearch, activeFilters, trigerDelete, trigerChangeStatus, rowsPerPage, page]);

    return (
        <Box
            sx={{
                height: rowsInvoiceTable?.length ? 'fit-content' : '450px',
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
            <Box className="flex mb-4 gap-6">
                <Typography variant="h4" component={"h1"}>
                    {t('title.billing-one-time')}
                </Typography>
                <Button
                    data-testid="customer-customertable-addproduct-button"
                    variant="contained"
                    color="primary"
                    children={`+ ${t("button.add-invoice-setup")}`}
                    onClick={handleOpenAddInvoice}
                />
            </Box>
            <Box className="flex flex-row space-x-10">
                {dashboard.map((data) => {
                    if (data.status !== "PAID") {
                        return (
                            <Paper sx={{ width: "100%", my: 3 }} elevation={3} key={data.status}>
                                <Box className="px-6 py-5 space-y-8">
                                    <Typography className='font-normal text-xs text-start'>{TranslateBillingStatus(data.status)}</Typography>
                                    <Typography className='font-medium text-3xl text-center'>{data.quantity}</Typography>
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
                <Box className="w-full pt-4 px-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box className="flex justify-end space-x-4" >
                            <TextField
                                data-testid="billingnote-index-customername-text"
                                id="search-customer"
                                label={t('placeholder.customer-name')}
                                size="small"
                                {...register('customer_name')}
                                value={customerName}
                                onChange={handleUsername}
                                style={{
                                    width: "18%",
                                    height: "32px",
                                }}
                            />
                            <TextField
                                data-testid="billingnote-index-invoicenumber-text"
                                id="search-invoice"
                                label={t('invoice.invoice-number')}
                                size="small"
                                {...register('invoice_no')}
                                value={invoiceNo}
                                onChange={handleInvoiceNo}
                                style={{
                                    width: "18%",
                                    height: "32px",
                                }}
                            />
                            <TextField
                                data-testid="billingnote-index-prefix-text"
                                id="search-prefix"
                                label={t('placeholder.prefix')}
                                size="small"
                                {...register('prefix')}
                                value={prefix}
                                onChange={handlePrefix}
                                style={{
                                    width: "18%",
                                    height: "32px",
                                }}
                            />
                            <FormControl sx={{ width: "13%" }} size="small">
                                <Select
                                    data-testid="billingnote-index-month-select"
                                    labelId="search-month"
                                    id="search-month"
                                    value={String(selectMonthBillingNote)}
                                    disabled={month.length === 0}
                                    {...register('month')}
                                    onChange={handleMonthBillingNoteChange}
                                >
                                    <MenuItem key={`temp_month`} disabled value={0}>{t("placeholder.month")}</MenuItem>
                                    {month.map((month, index) => (
                                        <MenuItem key={`index ${month.month_name}`} value={month.month_number}>{month.month_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ width: "13%" }} size="small">
                                <Select
                                    data-testid="billingnote-index-year-select"
                                    labelId="search-year"
                                    id="search-year"
                                    value={String(selectYearBillingNote)}
                                    {...register('year')}
                                    onChange={handleYearBillingNoteChange}
                                >
                                    <MenuItem key={`temp_year`} disabled value={0}>{t("placeholder.year")}</MenuItem>
                                    {years.map((year, index) => (
                                        <MenuItem key={`${year}`} value={year.year_number}>{year.year_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

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
                                onClick={handleClear}
                                disabled={(!customerName && !invoiceNo && !product && !prefix) && (!selectMonthBillingNote && !selectYearBillingNote)}
                                sx={{
                                    width: "93px",
                                    height: "40px",
                                }}
                            />
                        </Box>
                    </form>
                </Box>
                <Box className="space-x-2 my-2 w-full px-4">
                    {categoryMultipleList.map((category: IBillingCategory) => (
                        <Chip
                            data-testid="billingnote-index-categoryname-chip"
                            key={category.name}
                            label={category.status}
                            onClick={() => toggleFilter(category.name)}
                            size="small"
                            variant="outlined"
                            style={{
                                backgroundColor: activeFilters.includes(category.status)
                                    ? category.activeColor
                                    : '',

                                color: theme.palette.mode === "light" && !activeFilters.includes(category.status) ? 'black' : 'white',
                                borderColor: activeFilters.includes(category.status) ? category.activeColor : '',
                                cursor: 'pointer',
                                margin: "4px"
                            }}
                        />
                    ))}
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
                                <TableCell sx={{ p: 1, minWidth: 30 }} align='center'>
                                    <IconButton
                                        sx={{
                                            padding: 0,
                                            transition: 'transform 0.3s ease',
                                            color: 'white',
                                            pointerEvents: 'none',
                                        }}
                                        aria-label="expand row"
                                        size="small"
                                    >
                                        <ExpandIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 50, width: 50 }} align='center'>{t('table.number')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 100 }} align="center">{t('invoice.invoice-number')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 120 }} align="center">{t('invoice.customer')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 120 }} align="center">{t('invoice.product-name')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 100 }} align="center">{t('invoice.price')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 180 }} align="center">{t('invoice.status')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 60 }} align="center">{t('invoice.pdf')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 60 }} align="center">{t('invoice.export')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 60 }} align="center">{t('billing.history')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 120 }} align="center">{t('invoice.invoice-date')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', p: 1, minWidth: 120 }} align="center">{t('invoice.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={(theme) => ({
                            '& .MuiTableCell-root': {
                                border: `1px solid ${theme.palette.example.inherit}`,
                            },
                            '& .MuiTableRow-root:nth-of-type(odd)': {
                                backgroundColor: (theme) => theme.palette.action.hover,
                            },
                        })}>
                            {rowsInvoiceTable?.map((row, i) => (
                                <OneTimeBillingRow
                                    key={i}
                                    row={row}
                                    trans={t}
                                    handleOpenEditInvoice={handleOpenEditInvoice}
                                    handleOpenModalDeleteOnetimeBilling={handleOpenModalDeleteOnetimeBilling}
                                    handleOpenModalStatusToggle={handleOpenModalChangeStatus}
                                    handleOpenPDFPreviewModal={handleOpenPDFPreviewModal}
                                    handleOpenHistory={handleOpenHistory}
                                    exportPDF={exportPDF}
                                    handleOpenCustomerProfileModalTypeBilling={handleOpenCustomerProfileModalTypeBilling}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {rowsInvoiceTable?.length > 0 || false ? null : (
                    <Box className="min-h-[40dvh]">
                        {loading ?
                            <Box className="flex justify-center h-[55dvh]">
                                <Box className=" flex items-center  w-[15rem]">
                                    <Loading />
                                </Box>
                            </Box>
                            : <EmptyTable />}
                    </Box>
                )}
                {rowsInvoiceTable?.length > 0 &&
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

            {openAddInvoice &&
                <OneTimeInvoiceModal
                    customersForSelect={customersForSelect}
                    customerID={customerID}
                    handleCloseAddInvoice={handleCloseAddInvoice}
                    handleCustomerID={handleCustomerID}
                    handleSubmitModal={handleSubmitModal}
                    openAddInvoice={openAddInvoice}
                    handleChangePrefix={handleChangePrefix}
                    options={subProducts}
                    handleAddItem={handleAddItem}
                    handleRemoveItem={handleRemoveItem}
                    handleItemChange={handleItemChange}
                    items={items}
                    prefixInit={prefixInit}
                    selectPrefixId={selectPrefixId}
                    actionType={actionType}
                />
            }

            {modalDelete &&
                <ModalConfirmDelete
                    title={t("modal.title-delete-customer")}
                    description={
                        <>
                            {t("placeholder.delete1")}
                            <br />
                            {t("placeholder.delete2")}
                        </>
                    }
                    openModal={modalDelete}
                    closeModal={handleCloseModalDelete}
                    ConfirmDelete={onSubmitDeleteOnetimeBlling}
                />
            }

            {modalStatusToggle &&
                <OneTimeNoteModal
                    openModal={modalStatusToggle}
                    closeModal={handleCloseModalChangeStatus}
                    save={onSubmitChangeStatusOneTimeBilling}
                    walletType={walletType}
                    walletAddress={walletAddress}
                    handleChangeWalletType={handleChangeWalletType}
                    handleChangeWalletAddress={handleChangeWalletAddress}
                    setNote={setNote}
                    status={changeStatusReq?.status}
                    currencyList={currencyList}
                    statusType={statusType}
                    handleChangeStatusType={handleChangeStatusType}
                    currency={currency}
                    handleChangeCurrency={handleChangeCurrency}
                    paidValue={paidValue}
                    handleChangePaid={handleChangePaid}
                    reason={reason}
                    handleChangeReason={handleChangeReason}
                    userCredit={userCredit}
                    totalPrice={totalPrice}
                    validatePaidValue={validatePaidValue}
                    validateWalletAddress={validateWalletAddress}
                    validateWalletType={validateWalletType}
                />
            }

            {openModalPdf &&
                <PdfViewerModal
                    openModal={openModalPdf}
                    pdfUrl={pdfUrl}
                    closeModal={ClosePDFPreviewModal}
                />
            }

            {openHistory &&
                <BillingInvoiceHistoryModal
                    openModal={openHistory}
                    closeModal={handleCloseHistory}
                    data={rowModal}
                    type={BILLING_TYPE.ONE_TIME_BILLING}
                    wallet={wallet}
                    walletNo={walletNo}
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

        </Box>
    )
}

Component.display = "BillingOneTime"