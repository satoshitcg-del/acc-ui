import { useCallback, useEffect, useState, SetStateAction, Dispatch, useMemo } from 'react';
import { Autocomplete, Box, Button, Chip, FormControl, IconButton, MenuItem, Paper, Select, TextField, Tooltip, Typography, styled } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon, AccountCircle, BorderColor, Repeat as RepeatIcon } from '@mui/icons-material'
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridCellParams,
    GridToolbarContainer,
    GridRenderEditCellParams,
    GridColumnHeaderParams,
    gridClasses,
} from '@mui/x-data-grid';
import { useTheme } from "@mui/material/styles";
import clsx from 'clsx';
import Loading from '@/layout/components/loading/Loading';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { usePageEffect } from '@/core/page';
import { StatusEnum, categoryList } from '@/layout/components/modal-biiling-note/BillingNoteData';
import { useCalendar, useTranslate } from '../product-management/hooks';

import BillingChangeStatusModal from '@/layout/components/modal-biiling-note/BillingChangeStatusModal';
import BillingNoteModal from '@/layout/components/modal-biiling-note/BillingNoteModal';
import BillingInvoiceHistoryModal from '@/layout/components/modal-biiling-note/BillingInvoiceHistoryModal';
import { BoxShadowButton } from '@/core/constant';
import PdfViewerModal from '@/layout/components/modal-pdf/ModalPreviewPdf.js';
// service
import BillingService from '@/services/BillingService';
import ProductService from '@/services/ProductService';
import dayjs from 'dayjs';
import numeral from 'numeral';

// ----- Components -----
import CustomerProfileModal from "@/layout/components/modal-customer-profile/CustomerProfileModal.js";

// ----- Hook -----
import { useCustomerProfile } from "@/layout/components/modal-customer-profile/hook/useCustomerProfile.js";
import { useTranslateBillingStatus, useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useShowPdf } from '@/layout/components/modal-pdf/hook/useShowPdf.js';
import IconTableSvg from '@/assets/svg/TableSvg';
import { IBillingListResponseBase, IBillingSearchReq, IBillingList } from '@/core/interface/services';
import Cookies from 'js-cookie';
import { ModalConfirmDelete, useModalConfirmDelete } from '@/layout/components/modal-confirm-delete';
import CreateDraftModal from './components/CreateDraftModal';
import { formatDateLanguage, getFontColorOfPrefix, getMessageOfPrefixByStatus } from '@/core/utils';
import theme from '../customers/components/sub-product-into-customer/theme';
import { IconMenuSvg } from '@/assets/svg/IconMenuSvg';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
    setLoading: (isLoading: boolean) => void,
    setRowCount: Dispatch<SetStateAction<number>>,
    pagination: { page: number, limit: number },
    setPagination: Dispatch<SetStateAction<{ page: number, limit: number }>>,
    openStatus: any
    triggerHandleSearch: boolean
    setTriggerHandleSearch: any
    trigerDelete: boolean
    rowModesModel: any
    rowModal: any
}

interface BillingNoteSearch {
    month: number;
    year: number;
    status: string;
}

interface Product {
    id: string;
    product_name: string;
}


const getPreviousMonth = (currentMonth: number, currentYear: number) => {
    if (currentMonth === 1) {
        currentYear--;
        currentMonth = 12;
    } else {
        currentMonth--;
    }

    return [currentMonth, currentYear];
}


function EditToolbar(props: EditToolbarProps) {
    const { search } = BillingService();
    const { getProductListSelect } = ProductService();
    const { t } = useTranslation()
    const { TranslateMonth } = useTranslate();
    const { month, years, selectMonthBillingNote, selectYearBillingNote, handleClearSelect, handleMonthBillingNoteChange, handleYearBillingNoteChange } = useCalendar();
    const { setRows, setRowModesModel, setLoading, openStatus, setRowCount, pagination, setPagination, triggerHandleSearch, setTriggerHandleSearch, trigerDelete, rowModesModel, rowModal } = props;
    const { register, handleSubmit, reset } = useForm({})
    const [activeFilters, setActiveFilters] = useState(['ALL']);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [username, setUsername] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [bill, setBill] = useState<any | undefined>()
    const [productList, setProductList] = useState<Product[]>([])
    const [product, setProduct] = useState<Product | null>(null)
    const [prefix, setPrefix] = useState("");
    const [telegramId, setTelegramId] = useState("");
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();

    const theme = useTheme();

    const handleInvoiceNo = (event: React.ChangeEvent<HTMLInputElement>) => setInvoiceNo(event.target.value as string);
    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value as string);
    const handleCustomer = (event: React.ChangeEvent<HTMLInputElement>) => setCustomerName(event.target.value as string);
    const handlePrefix = (event: React.ChangeEvent<HTMLInputElement>) => setPrefix(event.target.value.toLocaleUpperCase() as string);
    const handleTelegramId = (event: React.ChangeEvent<HTMLInputElement>) => setTelegramId(event.target.value as string);

    const handleClear = () => {
        reset()
        setProduct(null)
        setInvoiceNo('')
        setUsername('')
        setCustomerName('')
        handleClearSelect()
        setActiveFilters(["ALL"]);
        setPagination({ page: 1, limit: 50 });
        setTriggerHandleSearch(!triggerHandleSearch);
        setPrefix('')
        setTelegramId('')
    };

    const fetchProductList = async () => {
        try {
            const response = await getProductListSelect();
            const products: Product[] = response.data.map((item: any) => ({
                id: item.id,
                product_name: item.product_name,
            }));
            setProductList(products);
        } catch (error) {
            console.log("Error fetching product list:", error);
        }
    };

    const handleChangeProduct = (selectedProduct: Product | null) => {
        setProduct(selectedProduct)
    };


    useEffect(() => {
        fetchProductList()
    }, [])

    const handleSearch = async () => {
        let joinStatus = activeFilters.join(',');
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();
        const [month, year] = getPreviousMonth(currentMonth, currentYear);

        const body: IBillingSearchReq = {
            full_name: customerName,
            username: username,
            invoice_no: invoiceNo,
            product_id: product ? product.id.toString() : '',
            month: selectMonthBillingNote === 0 ? "" : selectMonthBillingNote,
            year: selectYearBillingNote === 0 ? "" : selectYearBillingNote,
            status: joinStatus === "ALL" ? "" : joinStatus,
            limit: String(pagination.limit),
            page: String(pagination.page),
            prefix: prefix,
            telegram: telegramId
        }

        setLoading(true)
        try {
            const response = await search(body)
            const transformedData: IBillingListResponseBase[] = response?.data?.map((item: any, index: number) => ({
                next_status_options: item.next_status.length > 0 ? item.invoice_status != "PARTIALPAID" ? [item.invoice_status, ...item.next_status] : item.next_status : item.next_status,
                ...item
            }));
            setRowCount(response.pagination.total)
            setRows(() => transformedData || [])
            setBill(transformedData)
        } catch (error: any) {
            console.error(error);
            alertError(TranslateErrorCode(error.response.data.code) || "Error").then((result) => {
                if (result.isConfirmed) {
                    setTriggerHandleSearch(!triggerHandleSearch);
                }
            });
        } finally {
            setRowModesModel({
                ...rowModesModel, [rowModal.id]: { mode: GridRowModes.View }
            });
            setLoading(false)
        }
    }


    const toggleFilter = (filterName: string) => {
        let filterStatus = categoryList.filter((e) => e.name === filterName)

        if (filterName === "All") {
            setActiveFilters(["ALL"]);
            setPagination({ page: 1, limit: pagination.limit });
            setTriggerHandleSearch(!triggerHandleSearch);
        } else if (activeFilters.includes("ALL")) {
            setActiveFilters([filterStatus[0].status]);
            setPagination({ page: 1, limit: pagination.limit });
            setTriggerHandleSearch(!triggerHandleSearch);
        } else if (activeFilters.includes(filterStatus[0].status)) {
            setActiveFilters(activeFilters.filter((filter) => filter !== filterStatus[0].status));
            setPagination({ page: 1, limit: pagination.limit });
            setTriggerHandleSearch(!triggerHandleSearch);
        } else {
            setActiveFilters([...activeFilters, filterStatus[0].status]);
            setPagination({ page: 1, limit: pagination.limit });
            setTriggerHandleSearch(!triggerHandleSearch);
        }
    }

    const onSubmit = () => {
        setPagination({ page: 1, limit: pagination.limit });
        handleSearch();
    };


    useMemo(() => {
        handleSearch();
    }, [triggerHandleSearch, trigerDelete]);

    return (
        <GridToolbarContainer>
            <Box className="w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box className="flex justify-end mx-4 mt-4 space-x-4" >
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
                            data-testid="billingnote-index-customername-text"
                            id="search-customer"
                            label={t('invoice.username')}
                            size="small"
                            {...register('username')}
                            value={username}
                            onChange={handleUsername}
                            style={{
                                width: "18%",
                                height: "32px",
                            }}
                        />
                        <TextField
                            data-testid="billingnote-index-customername-text"
                            id="search-customer"
                            label={t('invoice.customer')}
                            size="small"
                            {...register('customer_name')}
                            value={customerName}
                            onChange={handleCustomer}
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
                        <TextField
                            data-testid="billingnote-index-telegram-text"
                            id="search-telegram"
                            label={t('placeholder.telegram')}
                            size="small"
                            {...register('telegram')}
                            value={telegramId}
                            onChange={handleTelegramId}
                            style={{
                                width: "18%",
                                height: "32px",
                            }}
                        />
                        <Autocomplete
                            id="combo-box-demo"
                            size="small"
                            value={product}
                            options={productList}
                            getOptionLabel={(option) => option.product_name}
                            renderInput={(params) => (
                                <TextField
                                    data-testid="billingnote-index-productrname-autocomplete"
                                    {...params}
                                    label={t("placeholder.product-name")}
                                    placeholder={t("placeholder.product-name")}
                                />
                            )}
                            onChange={(event, value) => handleChangeProduct(value)}
                            style={{
                                width: "20%",
                                height: "32px",
                                minWidth: "10%"
                            }}
                        />
                        <FormControl sx={{ width: "13%", minWidth: "10%" }} size="small">
                            <Select
                                data-testid="billingnote-index-month-select"
                                labelId="search-month"
                                id="search-month"
                                value={String(selectMonthBillingNote)}
                                disabled={month.length === 0}
                                {...register('month')}
                                onChange={handleMonthBillingNoteChange}
                                sx={{ minWidth: "10%" }}
                            >
                                <MenuItem key={`temp_month`} disabled value={0}>{t("placeholder.month")}</MenuItem>
                                {month.map((month, index) => (
                                    <MenuItem key={`index ${month.month_name}`} value={month.month_number}>{month.month_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: "13%", minWidth: "10%" }} size="small">
                            <Select
                                data-testid="billingnote-index-year-select"
                                labelId="search-year"
                                id="search-year"
                                value={String(selectYearBillingNote)}
                                {...register('year')}
                                onChange={handleYearBillingNoteChange}
                                sx={{ minWidth: "10%" }}
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
                            // disabled={(!username && !invoiceNo) && (!selectMonthBillingNote || !selectYearBillingNote)}
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
                            disabled={(!username && !invoiceNo && !product && !prefix && !telegramId) && (!selectMonthBillingNote && !selectYearBillingNote)}
                            children={t('invoice.clear')}
                            onClick={handleClear}
                            sx={{
                                width: "93px",
                                height: "40px",
                            }}
                        />
                    </Box>
                </form>
            </Box>
            <Box className="space-x-2 mx-3 w-full">
                {categoryList.filter((category) => category.name !== StatusEnum.APPROVE).map((category) => (
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
            <Box className="px-4 flex flex-row space-x-1">
                <Typography>{t('billing.billing-of')}</Typography>
                <Typography color="#2196F3">{`${TranslateMonth(Number(selectMonthBillingNote))}`}</Typography>
            </Box>
        </GridToolbarContainer>
    );
}

export function Component() {
    const { getNote, getHistory, getDashboard, getBillingNote, exportPDF } = BillingService();
    const { trigerDelete, modalDelete, handleOpenModalDeleteDraftInvoice, handleCloseModalDelete, onSubmitDeleteDraftInvoice } = useModalConfirmDelete();
    const { t } = useTranslation()
    const { TranslateBillingStatus } = useTranslateBillingStatus()
    let title = t("title.billing-note");
    usePageEffect({ title });
    const [triggerHandleSearch, setTriggerHandleSearch] = useState<boolean>(true)
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [pagination, setPagination] = useState<{ page: number, limit: number }>({ page: 1, limit: 50 })
    const [rowCount, setRowCount] = useState<number | null>(null)

    const { pdfUrl, openModalPdf, handleOpenPDFPreviewModal, ClosePDFPreviewModal } = useShowPdf();
    const { customerProfile, profileType, customerProfileModal, setCustomerProfileModal, handleOpenCustomerProfileModalTypeBilling } = useCustomerProfile();

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    // const handleSaveClick = (id: GridRowId) => () => {
    //     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    // };

    const handleDeleteClick = (id: GridRowId, invoice_id: string) => () => {
        handleOpenModalDeleteDraftInvoice(invoice_id)
        // setRows(rows.filter((row) => row.id !== id));
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };


    const handleCancelClick = (id: GridRowId) => () => {
        setTempStatus({})
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        // console.log('rowUpdate:', rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const [openCustomer, setOpenCustomer] = useState(false);
    const handleOpenCustomer = () => setOpenCustomer(true);
    const handleCloseCustomer = () => setOpenCustomer(false);
    const [rowModal, setRowModal] = useState<any>([])

    const handleCustomerModal = (id: GridRowId, row: any) => () => {
        setRowModal(row)
        handleOpenCustomer()
    }

    const [openNote, setOpenNote] = useState(false);
    const handleOpenNote = async (id: GridRowId) => {
        setLoading(true)
        try {
            const response = await getNote(id)
            setRowModal(response.data)
            console.log('Note response : ', response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setOpenNote(true)
        }
    };

    const handleCloseNote = () => setOpenNote(false);

    const handleNoteModal = (id: GridRowId, row: any) => () => {
        console.log('Open note modal')
        // setRowModal(row)
        handleOpenNote(id)
    }

    const [openHistory, setOpenHistory] = useState(false);
    const handleOpenHistory = async (id: GridRowId) => {
        setLoading(true)
        try {
            const response = await getHistory(id)
            setRowModal(response.data)
            console.log('History response : ', response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setOpenHistory(true)
        }
    };

    const handleCloseHistory = () => setOpenHistory(false);

    const handleHistoryModal = (id: GridRowId, row: any) => () => {
        handleOpenHistory(id)
    }

    const handleExportPDF = (id: GridRowId) => () => {
        downloadPDF(id)
    }

    const downloadPDF = async (id: GridRowId) => {
        try {
            const response = await exportPDF(id)
        } catch (error) {
            console.log(error)
        }
    };

    const [openStatus, setOpenStatus] = useState(false);
    const handleOpenStatus = () => setOpenStatus(true);
    const handleCloseStatus = () => {
        setTempStatus({})
        setOpenStatus(false)
    };

    const handleStatusModal = (id: GridRowId, row: any) => () => {
        // console.log('row', row)
        const data = tempStatus?.props?.value

        if (!data && row.invoice_status != "PARTIALPAID") {
            setRowModesModel({
                ...rowModesModel, [id]: { mode: GridRowModes.View }
            });
        } else {
            handleOpenStatus()
            setRowModal(row)
        }
    }

    const [dashboard, setDashboard] = useState<IBillingList[]>([])

    const [tempStatus, setTempStatus] = useState<any>({})

    const getBillingNoteDashboard = async () => {
        try {
            const response = await getDashboard()
            setDashboard(response.data || [])
        } catch (error) {
            console.error(error)
        } finally {
        }
    }

    const getInitialBillingNoteList = async () => {
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();
        const [month, year] = getPreviousMonth(currentMonth, currentYear);
        const body: IBillingSearchReq = {
            full_name: '',
            username: '',
            invoice_no: '',
            product_id: '',
            month: month,
            year: year,
            status: '',
            page: '1',
            limit: '50',
            prefix: '',
            telegram: ''
        }
        try {
            const response = await getBillingNote(body)
            setRowCount(response.pagination.total)
        } catch (error) {
            console.error('ERROR getInitialBillingNoteList :', error)
        }

    }


    useEffect(() => {
        getBillingNoteDashboard()
    }, [openStatus, triggerHandleSearch, trigerDelete])

    useEffect(() => {
        getInitialBillingNoteList()
    }, [])

    const handlePagination = useCallback(
        (e: { pageSize: number, page: number }) => {
            console.log('useCallback handlePagination: ', e);
            setPagination((prev) => ({
                page: e.page + 1 === pagination.page ? prev.page : e.page + 1,
                limit: e.pageSize === pagination.limit ? prev.limit : e.pageSize
            }))
            setTriggerHandleSearch(!triggerHandleSearch);
        },
        [pagination]
    );

    const CustomNoRowsOverlay = (loading: boolean) => {
        const { t } = useTranslation()
        return (
            loading ? <div></div> :
                <Box className="flex flex-col justify-center items-center pt-8" sx={{ color: 'content.text.disabled' }}>
                    <IconTableSvg className='w-[7rem] h-auto' icon='empty' />
                    <Typography className="mt-5  text-center" variant="h6">
                        {t("table.empty-table")}
                        <br /><span>{t("table.please-search")}</span>
                    </Typography>
                </Box>
        );
    }

    const columns: GridColDef[] = [
        {
            field: 'index',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('table.number')}</Typography>),
            headerAlign: 'center',
            width: 70,
            align: 'center',
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const index = params.api.getAllRowIds().indexOf(params.id);
                return (pagination.page - 1) * pagination.limit + index + 1;
            }
        },
        {
            field: 'invoice_no',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.invoice-no')}</Typography>),
            width: 120,
            editable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ width: '100%', textAlign: params.value ? 'left' : 'center' }}>
                    {params.value || '-'}
                </div>
            ),

        },
        {
            field: 'bill_cycle',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.bill-cycle')}</Typography>),
            headerAlign: 'center',
            width: 100,
            editable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <div style={{ width: '100%', textAlign: params?.value ? 'left' : 'center' }}>
                        {params?.row?.billing_cycle ? formatDateLanguage(params?.row?.billing_cycle) : "-"}
                    </div>
                );
            },

        },
        {
            field: 'username',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.customer-info')}</Typography>),
            headerAlign: 'center',
            width: 180,
            type: 'actions',
            sortable: false,
            disableColumnMenu: true,
            getActions: ({ id, row }) => {
                return [
                    <>
                        <Button
                            size='small'
                            data-testid="billingnote-index-username-button"
                            variant='outlined'
                            startIcon={<AccountCircle />}
                            sx={{ width: "150px" }}
                            onClick={() => {
                                handleOpenCustomerProfileModalTypeBilling(row.id, row.customer_id)
                            }}
                        >
                            <Typography className="truncate">{row.username || '-'}</Typography>
                        </Button>
                    </>
                ];
            },
        },
        {
            field: 'invoice-group',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.invoice-group')}</Typography>),
            width: 160,
            editable: false,
            sortable: false,
            disableColumnMenu: true,
            type: 'string',
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                return `${t('billing.invoice-group')}  ${params.row.invoice_group + 1}`
            },
        },
        {
            field: 'prefix',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.product-prefix')}</Typography>),
            width: 180,
            editable: false,
            sortable: false,
            disableColumnMenu: true,
            type: 'string',
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                return (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        width: "100%",
                        // maxHeight: 150,
                        // overflowY: 'auto',
                    }}>
                        {params?.row?.product_wl?.map((value: any, index: number) => ( //params.row.prefix
                            <Tooltip key={index} title={getMessageOfPrefixByStatus(value?.wl_status)}>
                                <Typography
                                    sx={{
                                        fontSize: "13px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    color={getFontColorOfPrefix(value?.wl_status)}
                                >
                                    {`${value?.product_name} (${value?.prefix_name || '-'})`}
                                </Typography>
                            </Tooltip>
                        ))}
                    </Box>
                    // params?.row?.prefix
                );
            },
        },
        {
            field: 'invoice_status',
            headerAlign: 'center',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.status')}</Typography>),
            width: 140,
            type: 'singleSelect',
            editable: true,
            sortable: false,
            disableColumnMenu: true,
            valueOptions({ row }) {
                return row.next_status_options
            },
            preProcessEditCellProps: (params) => {
                setTempStatus(params)

                const hasError = !params.props.value;
                return { ...params.props, error: hasError };
            },
            renderCell: (params: GridRenderEditCellParams) => {
                return (
                    <Button
                        data-testid={`billingnote-index-categorylist-button-${params.value.toLowerCase()}`}
                        sx={{
                            width: "100%",
                            backgroundColor: categoryList.find(category => category.status === params.value)?.activeColor,
                            boxShadow: BoxShadowButton,
                        }}
                        children={categoryList.find(category => category.status === params.value)?.status}
                        size="small"
                        variant="contained"
                        endIcon={<RepeatIcon />}
                    />
                )
            },
        },
        {
            field: 'actions',
            type: 'actions',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.edit')}</Typography>),
            width: 100,
            cellClassName: 'actions',
            sortable: false,
            disableColumnMenu: true,
            getActions: ({ id, row }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (row.next_status.length == 0) {
                    return []
                }

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            data-testid="billingnote-index-save-button"
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleStatusModal(id, row)}
                        />,
                        <GridActionsCellItem
                            data-testid="billingnote-index-cancel-button"
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        data-testid="billingnote-index-edit-button"
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <>
                        {row.invoice_status === "DRAFT" &&
                            <GridActionsCellItem
                                icon={<DeleteIcon />}
                                label="Delete"
                                onClick={handleDeleteClick(id, row.id)}
                                color="inherit"
                                disabled={row.invoice_status === "DRAFT" ? false : true}
                            />
                        }
                    </>
                ];
            },
        },
        {
            field: 'total_payment_crypto',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.total-price-crypto')}</Typography>),
            width: 220,
            editable: false,
            sortable: false,
            disableColumnMenu: true,
            type: 'number',
            cellClassName: (params: GridCellParams<any, number>) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('super-app', {
                    negative: params.value < 0,
                    positive: params.value > 0
                });
            },
            renderCell: (params) => {
                return `${formatNumber(params.row.total_payment_crypto)} USDT`
            },
        },
        {
            field: 'overdue_price_crypto',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.overdue-price-crypto')}</Typography>),
            headerAlign: 'right',
            width: 200,
            type: 'number',
            editable: false,
            sortable: false,
            disableColumnMenu: true,
            cellClassName: (params: GridCellParams<any, number>) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('super-app', {
                    negative: (params.value) < 0,
                    positive: params.value > 0
                });
            },
            renderCell: (params) => {
                return `${formatNumber(params.row.overdue_price_crypto)} USDT`
            },
        },
        {
            field: 'closing_date',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.closing-date')}</Typography>),
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableColumnMenu: true,
            width: 160,
            valueFormatter: params => params.value ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : "-",
        },
        {
            field: 'payment_due_date',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.payment-due-date')}</Typography>),
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableColumnMenu: true,
            width: 160,
            valueFormatter: params => params.value ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : "-",
        },
        {
            field: 'updated_at',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.date')}</Typography>),
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableColumnMenu: true,
            width: 160,
            valueFormatter: params => params.value ? dayjs(params.value).format('DD/MM/YYYY HH:mm') : "-",
        },
        {
            field: 'View',
            type: 'actions',
            sortable: false,
            disableColumnMenu: true,
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('invoice.pdf')}</Typography>),
            width: 70,
            getActions: ({ id, row }) => {
                return [
                    <GridActionsCellItem
                        data-testid="billingnote-index-pdf-button"
                        icon={<IconMenuSvg icon={"pdf"} color={"primary"} />}
                        label="PDF"
                        className="textPrimary"
                        onClick={() => handleOpenPDFPreviewModal(row?.id)}
                    />
                ];
            },
        },
        {
            field: 'export',
            type: 'actions',
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.export')}</Typography>),
            width: 70,
            cellClassName: 'actions',
            sortable: false,
            disableColumnMenu: true,
            getActions: ({ id, row }) => {
                return [
                    <GridActionsCellItem
                        data-testid="billingnote-index-exportpdf-button"
                        icon={<IconTableSvg icon="export" active={row.invoice_status !== 'DRAFT'} />}
                        label="History"
                        className="textPrimary"
                        disabled={row.invoice_status === 'DRAFT'}
                        onClick={handleExportPDF(id)}
                    />
                ];
            },
        },
        {
            field: 'history',
            type: 'actions',
            sortable: false,
            disableColumnMenu: true,
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.history')}</Typography>),
            width: 70,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                return [
                    <GridActionsCellItem
                        data-testid="billingnote-index-history-button"
                        icon={<IconTableSvg icon="history" />}
                        label="History"
                        className="textPrimary"
                        onClick={handleHistoryModal(id, row)}
                    />
                ];
            },
        },
        {
            field: 'note',
            type: 'actions',
            sortable: false,
            disableColumnMenu: true,
            renderHeader: (params: GridColumnHeaderParams) => (<Typography className=' text-sm font-semibold'> {t('billing.note')}</Typography>),
            width: 70,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                return [
                    <GridActionsCellItem
                        data-testid="billingnote-index-note-button"
                        icon={<BorderColor sx={{ color: '#9C27B0' }} />}
                        label="Note"
                        className="textPrimary"
                        onClick={handleNoteModal(id, row)}
                    />
                ];
            },
        },
    ];

    const [openCreateDraft, setCreateDraft] = useState(false);
    const handleOpenCreateDraft = () => setCreateDraft(true)
    const handleCloseCreateDraft = () => setCreateDraft(false)


    return (
        <>
            <Box
                sx={{
                    height: rows.length ? 'fit-content' : '450px',
                    width: '100%',
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
                    <Button
                        data-testid="button-create-draft-invoice"
                        variant="contained"
                        color="primary"
                        children={`+ ${t("button.create-draft")}`}
                        onClick={handleOpenCreateDraft}
                    />
                </Box>

                <Box className="flex flex-row space-x-10">
                    {dashboard.map((data) => {
                        if (data.status !== "PENDING") {
                            return (
                                <Paper sx={{ width: "349px", my: 3 }} elevation={3} key={data.status}>
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
                {rowCount !== null && rowCount >= 0 ?
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        paginationMode="server"
                        isCellEditable={(params) => params.row.next_status.length > 0}
                        rowCount={rowCount}
                        loading={loading}
                        onPaginationModelChange={(paginationModel) => (handlePagination(paginationModel))}
                        paginationModel={{ page: pagination.page - 1, pageSize: pagination.limit }}
                        // onPaginationModelChange={(paginationModel) => (setPagination({ page: paginationModel.page + 1, limit: paginationModel.pageSize }))}
                        slots={{
                            toolbar: EditToolbar,
                            noRowsOverlay: () => CustomNoRowsOverlay(loading),
                        }}
                        slotProps={{
                            toolbar: { setRows, setRowModesModel, setLoading, openStatus, rows, setRowCount, pagination, setPagination, triggerHandleSearch, setTriggerHandleSearch, trigerDelete, rowModesModel, rowModal },
                            pagination: { labelRowsPerPage: t('invoice.row-per-page') }
                        }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 50 } },
                        }}
                        pageSizeOptions={[50, 100]}
                        sx={{
                            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': { display: 'none' },
                            [`& .${gridClasses.cell}`]: {
                                py: 1,
                                display: 'flex',
                                alignItems: 'flex-start', // จัดให้เนื้อหาชิดบน
                            },
                        }}
                        getRowHeight={() => 'auto'}
                    />
                    :
                    <Box className="flex justify-center h-[55dvh]">
                        <Box className=" flex items-center  w-[15rem]">
                            <Loading />
                        </Box>
                    </Box>}
            </Box>

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
            {openStatus && (<BillingChangeStatusModal openModal={openStatus} closeModal={handleCloseStatus} data={rowModal} setRowModesModel={setRowModesModel} rowModesModel={rowModesModel} tempStatus={tempStatus} triggerHandleSearch={triggerHandleSearch} setTriggerHandleSearch={setTriggerHandleSearch} />)}
            {openNote && (<BillingNoteModal openModal={openNote} closeModal={handleCloseNote} data={rowModal} />)}
            {openHistory && (<BillingInvoiceHistoryModal openModal={openHistory} closeModal={handleCloseHistory} data={rowModal} />)}
            {openModalPdf && (<PdfViewerModal openModal={openModalPdf} pdfUrl={pdfUrl} closeModal={ClosePDFPreviewModal} />)}
            {openCreateDraft && (<CreateDraftModal openModal={openCreateDraft} handleCloseModal={handleCloseCreateDraft} setTriggerHandleSearch={setTriggerHandleSearch} triggerHandleSearch={triggerHandleSearch} />)}
        </>
    )
}

const formatNumber = (num: number | string) => {
    const myNum = numeral(Number(num))
    return myNum.format("0, 0.00")
}


Component.display = "BillingNote"