import { Modal, Box, Typography, Button, Backdrop, } from '@mui/material';
import React, { useEffect, useState } from 'react'

import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon, NavigateBefore as NavigateBeforeIcon, CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material'

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
import InvoiceDataService from '@/services/invoice.service';
import Loading from '@/layout/components/loading/Loading';

import clsx from 'clsx';
import { handleErrorCode } from '@/core/error';

import { useTranslation } from 'react-i18next';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';

interface DiscountProps {
    openModal: boolean
    discountData: any
    closeModal: () => void,
    discountNo: string
    invoiceId: any
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
        setRows((oldRows) => [...oldRows, { id, name: '', discount_type: 'VALUE', isNew: true, description: '', value: 0, price: 0 }]);
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

export default function InvoiceDetailsDiscountModal(props: DiscountProps) {
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const { openModal, closeModal, discountData, discountNo, invoiceId } = props
    const [loading, setLoading] = useState(false);

    const transformedData = discountData?.discounts?.map((item: any, index: number) => {
        return { discount_no: index + 1, ...item }
    })

    const [rows, setRows] = useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    console.log('rows', rows)

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

    const handleDeleteClick = (id: GridRowId, row: any) => () => {
        console.log('Delete discount id: ', id)
        // setRows(rows.filter((row) => row.id !== id));
        handleDelete(invoiceId.id, discountNo, row.id)
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
        console.log('ssssss', rows)

        const id = newRow.id
        console.log('id: ', id)
        newRow.value = newRow.value || 0
        if (newRow.isNew) {
            handleAdd(invoiceId.id, discountNo, newRow)
        } else {
            handleUpdate(invoiceId.id, discountNo, newRow.id, newRow)
        }

        console.log('Add row: ', rows)
        return updatedRow;
    };

    const handleAdd = async (id: string, no: string, row: GridRowModel) => {
        setLoading(true)
        try {
            const response = await new InvoiceDataService().addDiscount(id, no, row)
            setRows(response.data ? response.data : [])
            alertSuccess(TranslateErrorCode(response.code));
            return response.data
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (id: string, no: string, discountNo: string, row: GridRowModel) => {
        setLoading(true)
        try {
            const response = await new InvoiceDataService().updateDiscount(id, no, discountNo, row)
            setRows(response.data ? response.data : [])
            alertSuccess(TranslateErrorCode(response.code));
            return response.data
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string, no: string, discountNo: string) => {
        setLoading(true)
        try {
            const response = await new InvoiceDataService().deleteDiscount(id, no, discountNo)
            setRows(response.data ? response.data : [])
            alertSuccess(TranslateErrorCode(response.code));
            return response.data
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setLoading(false)
        }
    }

    const getDiscount = async () => {
        setLoading(true)
        try {
            const response = await new InvoiceDataService().getInvoiceDetailsDiscount(invoiceId.id, discountNo)
            console.log('Response modal : ', response.data)
            setRows(response.data ? response.data : [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDiscount()
    }, [])

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: t('invoice.name'),
            width: 180,
            align: 'left',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'description',
            headerName: t('invoice.description'),
            width: 180,
            align: 'left',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'discount_type',
            headerName: t('invoice.discount-type'),
            width: 180,
            align: 'left',
            headerAlign: 'center',
            type: "singleSelect",
            valueOptions: [
                { value: "VALUE", label: t('invoice.value') },
                { value: "PERCENT", label: t('invoice.percent') },
            ],
            editable: false
        },
        {
            field: 'value',
            headerName: t('invoice.value'),
            type: 'number',
            width: 180,
            align: 'right',
            headerAlign: 'center',
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
            field: 'price',
            headerName: t('invoice.price'),
            type: 'number',
            width: 180,
            align: 'right',
            headerAlign: 'center',
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
            editable: false,
            getActions: ({ id, row }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon sx={{ color: '#2E7D32' }} />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                            disabled
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon sx={{ color: '#D32F2F' }} />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                            disabled
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon sx={{ color: '#EF6C00' }} />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                        disabled
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon sx={{ color: '#D32F2F' }} />}
                        label="Delete"
                        onClick={handleDeleteClick(id, row)}
                        color="inherit"
                        disabled
                    />,
                ];
            },
        },
    ];
    return (
        <Modal
            open={openModal}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {discountData.name}
                    {/* {discountNo}
                    {invoiceId.id} */}
                </Typography>
                <Box
                    sx={{
                        height: rows.length ? '500px' : '300px',
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
                    {/* {
                        loading ? (<Backdrop
                            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                        >
                            <Loading />
                        </Backdrop>) : () */}
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
                        sx={{ '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': { display: 'none' } }}
                        loading={loading}
                    />
                    {/* } */}
                </Box>
            </Box>
        </Modal>
    )
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 'auto',
    width: '1065px',
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4
};
