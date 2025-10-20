import { useEffect, useState } from 'react';
import { Backdrop, Box, Button, TextField, Typography } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon, CheckCircleOutline as CheckCircleOutlineIcon, LockOutlined as LockOutlinedIcon, LockOpenOutlined as LockOpenOutlinedIcon, Discount as DiscountIcon } from '@mui/icons-material'
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
} from '@mui/x-data-grid';
import InvoiceDataService from '@/services/invoice.service';

import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Loading from '@/layout/components/loading/Loading';
import { handleErrorCode } from '@/core/error';
import { useForm } from 'react-hook-form';
import InvoiceDiscountModal from './components/InvoiceDiscountModal';

import { useTranslation } from 'react-i18next';
import { usePageEffect } from '@/core/page';
import { randomCreatedDate } from '@mui/x-data-grid-generator';
import dayjs from 'dayjs';
import { useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';

interface FilterForm {
    username: string;
    prefix: string;
    invoice_no: string;
}

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
    setLoading: (isLoading: boolean) => void
}

function EditToolbar(props: EditToolbarProps) {
    const { t } = useTranslation()
    const { register, handleSubmit, reset } = useForm({})
    const { setRows, setRowModesModel, setLoading } = props;

    const handleClear = () => {
        reset()
    };

    const handleSearch = async (data: any) => {
        console.log('Search data', data)
        setLoading(true)
        try {
            const response = await new InvoiceDataService().getSearchInvoice(data)
            setRows(response.data ? response.data : [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <GridToolbarContainer>
            <Box className="w-full">
                <form onSubmit={handleSubmit(handleSearch)}>
                    <Box className="flex justify-end mx-4 mt-4  space-x-4" >
                        <TextField
                            id="search-username"
                            label={t('invoice.username')}
                            size="small"
                            {...register('username')}
                            style={{
                                width: "288.67px",
                                height: "32px",
                            }}
                        />
                        <TextField
                            id="search-prefix"
                            label={t('invoice.prefix')}
                            size="small"
                            {...register('prefix')}
                            style={{
                                width: "288.67px",
                                height: "32px",
                            }}
                        />
                        <TextField
                            id="search-invoice"
                            label={t('invoice.invoice-number')}
                            size="small"
                            {...register('invoice_no')}
                            style={{
                                width: "288.67px",
                                height: "32px",
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            children={t('invoice.search')}
                            sx={{
                                width: "93px",
                                height: "42px",
                            }}
                        />
                        <Button
                            variant="contained"
                            color="inherit"
                            children={t('invoice.clear')}
                            onClick={handleClear}
                            sx={{
                                width: "93px",
                                height: "42px",
                            }}
                        />
                    </Box>
                </form>
            </Box>
        </GridToolbarContainer>
    );
}

export function Component() {
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    let title = t("title.invoice");
    usePageEffect({ title });

    const [rows, setRows] = useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [loading, setLoading] = useState(false);
    const [locked, setLocked] = useState(false)
    const [search, setSearch] = useState<GridRowsProp>([])
    // modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [rowModal, setRowModal] = useState<any>([])

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => async () => {
        handleDelete(id)
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

    const handleDownloadPDF = (id: GridRowId) => async () => {
        setLoading(true)
        console.log(`Click download PDF : ${id}`)
        try {
            const response = await new InvoiceDataService().getPDF(`${id}`)
            let file = new Blob([response], { type: 'application/pdf' });
            window.open(URL.createObjectURL(file));
            console.log('Response download : ', response)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleModal = (id: GridRowId, row: any) => () => {
        console.log('test id:', id)
        console.log('test row:', row)
        handleOpen()
        setRowModal(row)
    }

    const navigate = useNavigate();
    const navigateToDetails = (id: GridRowId, username: string, prefix: string) => navigate(`/invoice-details/${username}`, { state: { id, username, prefix } });
    // const navigateToDetails = (id: GridRowId, username: string, prefix: string) => navigate(`${location.pathname}-details/id=${id}/username=${username}/prefix=${prefix}`);

    const handleView = (id: GridRowId, row: any) => async () => {
        console.log(`Click download PDF : ${id}`)
        navigateToDetails(id, row.username, row.prefix)
    }

    const handleLock = (id: GridRowId) => async () => {
        console.log(id)
        setLoading(true)
        setLocked(true)
        try {
            const response = await new InvoiceDataService().confirmInvoice(id)
            return response.data
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setLocked(false)
        }
    }

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        console.log('Row update : ', newRow)
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

        const id = newRow.id
        handleUpdate(id, newRow)

        return updatedRow;
    };

    const handleUpdate = async (id: string, params: GridRowModel) => {
        setLoading(true)
        try {
            const response = await new InvoiceDataService().updateInvoice(id, params)
            // alertSuccess(TranslateErrorCode(response.code));
            return response.data
        } catch (error: any) {
            console.error(error)
            // alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: GridRowId) => {
        setLoading(true)
        try {
            const response = await new InvoiceDataService().deleteInvoice(id)
            setRows(rows.filter((row) => row.id !== id));
            // setRows(response.data);
            alertSuccess(TranslateErrorCode(response.code));
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

    const getInvoice = async () => {
        setLoading(true)
        try {
            const response = await new InvoiceDataService().getInvoice(filterForm)
            console.log('Get invoices: ', response.data)
            const transformedData = response?.data?.map((item: any, index: number) => ({
                discount_length: item.discounts?.length || 0,
                date: item?.invoice_date?.toString(),
                ...item
            }));
            console.log('transformedData', transformedData)
            setRows(transformedData ? transformedData : [])
            // alertSuccess(TranslateErrorCode(response.code));
        } catch (error: any) {
            console.error(error)
            // alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     getInvoice()
    // }, [])

    useEffect(() => {
        getInvoice()
    }, [locked, open])

    const columns: GridColDef[] = [
        {
            field: 'username',
            headerName: t('invoice.username'),
            width: 180,
            align: 'left',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'product_name',
            headerName: t('invoice.product-name'),
            width: 180,
            align: 'left',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'prefix',
            headerName: t('invoice.prefix'),
            width: 180,
            align: 'left',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'company',
            headerName: t('invoice.company'),
            width: 150,
            align: 'left',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'customer_id',
            headerName: t('invoice.customer-id'),
            width: 200,
            align: 'left',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'fax',
            headerName: t('invoice.fax'),
            width: 150,
            align: 'left',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'tel',
            headerName: t('invoice.tel'),
            width: 150,
            align: 'left',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'location',
            headerName: t('invoice.location'),
            width: 250,
            align: 'left',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'invoice_no',
            headerName: t('invoice.invoice-no'),
            width: 250,
            align: 'left',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'discount_length',
            headerName: t('invoice.discount'),
            width: 180,
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
            field: 'rate',
            headerName: t('invoice.rate'),
            width: 100,
            align: 'right',
            headerAlign: 'center',
            type: 'number',
            editable: true,
        },
        {
            field: 'total_payment',
            headerName: t('invoice.total-payment'),
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
                    positive: params.value > 0
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

                            />
                            <GridActionsCellItem
                                icon={<CancelIcon sx={{ color: '#D32F2F' }} />}
                                label="Cancel"
                                className="textPrimary"
                                onClick={handleCancelClick(id)}
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
                        />
                        <GridActionsCellItem
                            icon={<DeleteIcon sx={{ color: '#D32F2F' }} />}
                            label="Delete"
                            onClick={handleDeleteClick(id)}
                            color="inherit"
                        />
                    </>)
                ];
            },
        },
        {
            field: 'PDF',
            type: 'actions',
            headerName: `${t('invoice.pdf')} , ${t('invoice.view')}`,
            width: 200,
            getActions: ({ id, row }) => {
                return [
                    <>
                        <Button variant='outlined' onClick={handleDownloadPDF(id)}>{t('invoice.download')}</Button>
                        <Button variant='outlined' onClick={handleView(id, row)}>{t('invoice.view')}</Button>
                    </>
                ];
            },
        },
        // {
        //     field: 'View',
        //     type: 'actions',
        //     headerName: 'View',
        //     width: 100,
        //     getActions: ({ id, row }) => {
        //         return [
        //             <Button variant='outlined' onClick={handleView(id, row)}>View</Button>
        //         ];
        //     },
        // },
        {
            field: 'confirm_at',
            type: 'actions',
            headerName: t('invoice.confirm'),
            width: 100,
            getActions: ({ id, row }) => {
                if (row.confirm_at) {
                    return [
                        <GridActionsCellItem
                            icon={<LockOutlinedIcon color='disabled' />}
                            label="Lock"
                            disabled={true}
                            // onClick={handleLock(id)}
                            color="inherit"
                        />
                    ]
                }

                return [
                    <GridActionsCellItem
                        icon={<LockOpenOutlinedIcon />}
                        label="Unlock"
                        onClick={handleLock(id)}
                        color="inherit"
                    />
                ];
            },
        },
    ];

    const [filterForm, setFilterForm] = useState<FilterForm>({
        username: '',
        prefix: '',
        invoice_no: '',
    });

    return (
        <>
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
                    '& .super-app-theme--header': {
                        backgroundColor: 'dataGrid.background',
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
                    <Box className={`flex flex-col w-full`} sx={{
                        "& .MuiTextField-root": { m: 1, width: "18ch" },
                    }}>
                        <Typography variant="h4" component={"h1"}>
                            {t('invoice.title')}
                        </Typography>
                    </Box>
                </Box>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    showCellVerticalBorder
                    // showColumnVerticalBorder
                    slots={{
                        toolbar: EditToolbar,
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel, setLoading },
                        pagination: { labelRowsPerPage: t('invoice.row-per-page') }
                    }}
                    isCellEditable={(params) => !params.row.confirm_at}
                    localeText={{ noRowsLabel: t('invoice.no-row') }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 20, 30]}
                    loading={loading}
                    sx={{ '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': { display: 'none' } }}

                />
            </Box>
            {open && (<InvoiceDiscountModal openModal={open} closeModal={handleClose} discountData={rowModal} />)}
        </>
    );
}

Component.display = 'Invoice'

