import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Button, Link, Typography, Backdrop, Modal } from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon, NavigateBefore as NavigateBeforeIcon, CheckCircleOutline as CheckCircleOutlineIcon, Discount as DiscountIcon } from '@mui/icons-material'
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridCellParams,
} from '@mui/x-data-grid';
import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
} from '@mui/x-data-grid-generator';
import InvoiceDataService, { GetInvoiceResponse } from '@/services/invoice.service';
import clsx from 'clsx';

import Loading from "@/layout/components/loading/Loading.js";
import InvoiceDetailsDiscountModal from './components/InvoiceDetailsDiscountModal';
import numeral from "numeral";

import { useTranslation } from 'react-i18next';
import { useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';

interface PathObject {
    id: string,
    username: string,
    prefix: string
}

export interface IGetInvoice {
    code: number
    message: string
    data: IGetInvoiceData
}

export interface IGetInvoiceData {
    id: string
    username: string
    product_name: string
    prefix: string
    invoice_no: string
    invoice_date: any
    items: Item[]
    rate: number
    total_payment: number
    active: boolean
    confirm_at: any
    created_at: string
    updated_at: string
}

export interface Item {
    name: string
    unit_price: number
    qty: number
    total_price: number
    discounts: any
}

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { t } = useTranslation()
    const { setRows, setRowModesModel } = props;
    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, name: '', qty: 0, total_price: 0, unit_price: 0, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} disabled>
                {t('invoice.add')}
            </Button>
        </GridToolbarContainer>
    );
}

export function Component() {
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const { state } = useLocation()
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [invoiceDetailData, setInvoiceDetailData] = useState<IGetInvoiceData>({} as IGetInvoiceData)
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [add, setAdd] = useState(false)
    const [loading, setLoading] = useState(false);
    const userObj: PathObject = { id: state.id, username: state.username, prefix: state.prefix }
    console.log('userObj: ', userObj.id, userObj.username)
    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const summaryData = [
        invoiceDetailData.total_payment,
        invoiceDetailData.total_payment,
        invoiceDetailData.rate,
        invoiceDetailData.total_payment / invoiceDetailData.rate
    ]
    // Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [rowModal, setRowModal] = useState<any>([])

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId, row: any) => () => {
        console.log("row:::::", row)
        handleDelete(id, row.id)
    };

    const handleCancelClick = (id: GridRowId) => () => {
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
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        console.log("new row : ", newRow)
        console.log("row mode : ", rowModesModel)

        newRow.qty = newRow.qty || 0
        newRow.unit_price = newRow.unit_price || 0
        newRow.total_price = newRow.total_price || 0
        if (newRow.isNew) {
            handleAdd(userObj.id, newRow)
        } else {
            handleUpdate(userObj.id, newRow.id, newRow)
        }

        return updatedRow;
    };

    const handleAdd = async (id: string, params: GridRowModel) => {
        setLoading(true)
        setAdd(true)
        try {
            const response = await new InvoiceDataService().addInvoiceDetails(id, params)
            return response.data
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setAdd(false)
        }
    }

    const handleModal = (id: GridRowId, row: any) => () => {
        console.log('test id:', id)
        console.log('test row:', row)
        handleOpen()
        setRowModal(row)
    }

    const handleUpdate = async (id: string, no: string, params: GridRowModel) => {
        // setLoading(true)
        try {
            const response = await new InvoiceDataService().updateInvoiceDetails(id, no, params)
            const transformedData = response?.data?.items?.map((item: any, index: number) => ({
                no: index + 1,
                id: randomId(),
                discount_length: item.discounts?.length || 0,
                ...item
            }));
            setRows(transformedData ? transformedData : [])
            setInvoiceDetailData(response.data || {})
            return response.data
        } catch (error) {
            console.error(error)
        } finally {
            // setLoading(false)
        }
    }

    const handleDelete = async (id: GridRowId, no: string) => {
        setLoading(true)
        try {
            const response = await new InvoiceDataService().deleteInvoiceDetails(userObj.id, no)
            setRows(rows.filter((row) => row.id !== id));
            alertSuccess(TranslateErrorCode(response.code));
            setInvoiceDetailData(response.data || {})
            return response.data
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setLoading(false)
        }
    }

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const getDetails = async () => {
        setLoading(true)
        try {
            const response = await new InvoiceDataService().getInvoiceDetails(userObj.id)
            console.log('response details: ', response)
            const transformedData = response?.data?.items?.map((item: any, index: number) => ({
                no: index + 1,
                id: randomId(),
                discount_length: item.discounts?.length || 0,
                ...item
            }));
            console.log('result: ', transformedData)
            setRows(transformedData ? transformedData : [])
            setInvoiceDetailData(response.data || {})
            console.log('invoiceDetailData: ', invoiceDetailData)
        } catch (error: any) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDetails()
        console.log('Recordsss : ', rows)
    }, [add, open])

    const columns: GridColDef[] = [
        {
            field: 'no',
            headerName: t('invoice.no'),
            width: 80,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'name',
            headerName: t('invoice.item'),
            width: 500,
            align: 'left',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'discount_length',
            headerName: t('invoice.discount'),
            width: 150,
            align: 'center',
            headerAlign: 'center',
            type: 'actions',
            getActions: ({ id, row }) => {
                if (row.discount_length) {
                    return [
                        <>
                            <Button variant='outlined' onClick={handleModal(id, row)} startIcon={<DiscountIcon />}>{row.discount_length}</Button>
                        </>
                    ];
                }

                if (row.isNew) {
                    return []
                }

                return [<Button variant='outlined' onClick={handleModal(id, row)}>{row.discount_length || 0}</Button>]
            },
        },
        {
            field: 'qty',
            headerName: t('invoice.qty'),
            width: 100,
            align: 'center',
            headerAlign: 'center',
            type: 'number',
            editable: false
        },
        {
            field: 'unit',
            headerName: t('invoice.unit'),
            width: 100,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'unit_price',
            headerName: t('invoice.unit-price'),
            width: 180,
            align: 'right',
            headerAlign: 'center',
            type: 'number',
            editable: false,
            cellClassName: (params: GridCellParams<any, number>) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('super-app', {
                    negative: params.value < 0,
                    positive: params.value > 0,
                });
            }
        },
        {
            field: 'total_price',
            headerName: t('invoice.amount'),
            width: 180,
            align: 'right',
            headerAlign: 'center',
            type: 'number',
            editable: false,
            cellClassName: (params: GridCellParams<any, number>) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('super-app', {
                    negative: params.value < 0,
                    positive: params.value > 0,
                });
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: t('invoice.actions'),
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        row.confirm_at ? (<>
                            <CheckCircleOutlineIcon color='success' />
                        </>) : (<>
                            <GridActionsCellItem
                                icon={<SaveIcon sx={{ color: '#2E7D32' }} />}
                                label="Save"
                                onClick={handleSaveClick(id)}
                                disabled

                            />
                            <GridActionsCellItem
                                icon={<CancelIcon sx={{ color: '#D32F2F' }} />}
                                label="Cancel"
                                className="textPrimary"
                                onClick={handleCancelClick(id)}
                                disabled
                            />
                        </>)
                    ];
                }

                return [
                    row.confirm_at ? (<>
                        <CheckCircleOutlineIcon color='success' />
                    </>) : (<>
                        <GridActionsCellItem
                            icon={<EditIcon sx={{ color: '#EF6C00' }} />}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(id)}
                            color="inherit"
                            disabled
                        />
                        <GridActionsCellItem
                            icon={<DeleteIcon sx={{ color: '#D32F2F' }} />}
                            label="Delete"
                            onClick={handleDeleteClick(id, row)}
                            color="inherit"
                            disabled
                        />
                    </>)
                ];
            },
        },
    ];

    return (
        <>
            <Box className="flex flex-row items-center mb-4">
                <Link
                    component={RouterLink}
                    to="/invoice"
                    underline="none"
                    color={"GrayText"}
                    className='flex items-center mr-4'
                >
                    <NavigateBeforeIcon />
                </Link>
                <Typography className='font-normal text-3xl' >{`${userObj.username}`} {userObj.prefix ? `(${userObj.prefix})` : ''}</Typography>
            </Box>
            <Box
                sx={{
                    height: rows.length ? 'fit-content' : '300px',
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
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    showCellVerticalBorder
                    localeText={{ noRowsLabel: t('invoice.no-row') }}
                    slots={{
                        toolbar: EditToolbar,
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                        pagination: { labelRowsPerPage: t('invoice.row-per-page') }
                    }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 20, 30]}
                    loading={loading}
                    sx={{ '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': { display: 'none' } }}
                />
                <Box className="flex flex-row mt-4 p-4">
                    {/* <Typography>ลบยี่สิบเอ็ดล้านเก้าแสนหนึ่งหมื่นแปดพันแปดร้อยสามสิบหกบาทหกสิบสี่สตางค์</Typography> */}
                    <div className='grow'></div>
                    <Box className="flex flex-col mr-10 text-right space-y-2">
                        <Typography>{t('invoice.summary-qty')}</Typography>
                        <Typography>{t('invoice.summary-total')}</Typography>
                        <Typography>{t('invoice.summary-rate')}</Typography>
                        <Typography>{t('invoice.summary-usdt-total')}</Typography>
                    </Box>
                    <Box className="flex flex-col text-right space-y-2">
                        {
                            summaryData.map((value, index) => (
                                <Typography key={index}>{formatNumber(value)}</Typography>
                            ))
                        }
                    </Box>
                </Box>
                {open && (<InvoiceDetailsDiscountModal openModal={open} closeModal={handleClose} discountData={rowModal} discountNo={rowModal.id} invoiceId={userObj}></InvoiceDetailsDiscountModal>)}
            </Box>
        </>
    );
}

const formatNumber = (num: number) => {
    const myNum = numeral(Number(num))
    return myNum.format("0, 0.00")
}

Component.display = 'InvoiceDetails'

