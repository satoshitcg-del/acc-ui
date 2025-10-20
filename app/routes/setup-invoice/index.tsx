import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// MUI
import { Box, Button, Divider, Modal, Typography } from '@mui/material';

// Drag and drop
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

// i18n
import { useTranslation } from 'react-i18next';
// stitches.config.js
import { createStitches } from '@stitches/react'
import Column from './components/Column';
import SetupInvoiceService from '@/services/SetupInvoiceService';
import { useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';


interface Column {
    id: number;
    list: IProduct[];
    company_name?: string; // เพิ่ม company_name
}
export const { styled, css } = createStitches({
    prefix: '',
    utils: {}
})
// For Research Drag and Drop
export interface IProduct {
    id: string;
    product_name: string;
    prefix_name: string;
    customer_product_id?: string;
    currency: string;
    client_name: string;
}

export default function Component() {
    const { t } = useTranslation();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const location = useLocation();
    const useQuery = () => new URLSearchParams(location.search);
    const query = useQuery();
    const cusID = query.get('id');
    const username = query.get('name');
    const navigate = useNavigate();
    const [udpateTime, setUpdateTime] = useState('')
    const { getProductLists, createGroupInvoiceService } = SetupInvoiceService();
    const navigateToCustomers = () => navigate(`/customer/${username}`, { state: { cid: cusID, username } });
    const [isAddButton, setIsAddButton] = useState<boolean>()
    const [openConfirmRemove, setOpenConfirmRemove] = useState(false)
    const [openConfirmSetup, setOpenConfirmSetup] = useState(false)
    const [removeId, setRemoveId] = useState<string>("")
    const [result, setResult] = useState({
        update_time: null,
        setup_invoices: [],
    });
    const [counterProduct, setCounterProduct] = useState<any>()
    const [isSubmit, setIsSubmit] = useState(false);

    const getProductList = async () => {
        try {
            const res: any = await getProductLists(cusID ?? "");
            const newColumns = res?.data?.setup_invoices?.reduce((acc: any, curr: any) => {
                if (curr.id === 0) {
                    acc["0"] = {
                        id: curr.id,
                        list: curr.list,
                        company_name: curr.company_name || ''
                    };
                } else {
                    acc[`${curr.id}`] = {
                        id: curr.id,
                        list: curr.list,
                        company_name: curr.company_name || ''
                    };
                }
                return acc;
            }, {});
            const listCounts = Object.values(newColumns).reduce((total, column: any) => {
                return total + (Array.isArray(column.list) ? column.list.length : 0);
            }, 0);
            setCounterProduct(listCounts)
            setUpdateTime(res.data.update_time)
            setColumns(newColumns);

            if (!isSubmit) {
                const mappedResult = Object.entries(newColumns).map(([key, value]: any) => ({
                    id: value.id,
                    list: value.list.map((item: any) => item.customer_product_id),
                    company_name: value.company_name || ''
                }));
                const InitailResult: any = {
                    update_time: res.data.update_time,
                    setup_invoices: mappedResult
                };
                const intailRes: any = await createGroupInvoiceService(cusID ?? '', InitailResult)
                setUpdateTime(intailRes.data)
            }

        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code) || 'Error');
            console.error(error);
        }
    };

    useEffect(() => {
        getProductList();
    }, []);

    // เปลี่ยน initialColumns ให้ใช้ "default"
    const initialColumns: Record<string, Column> = {
        "default": {
            id: 0,
            list: [],
            company_name: ''
        }
    };

    const [columns, setColumns] = useState<Record<string, Column>>(initialColumns);

    const onDragEnd = ({ source, destination }: DropResult) => {
        // Make sure we have a valid destination
        if (destination === undefined || destination === null) return null;

        // Make sure we're actually moving the item
        if (
            source.droppableId === destination.droppableId &&
            destination.index === source.index
        )
            return null;

        // Set start and end variables
        const start = columns[source.droppableId as keyof typeof columns];
        const end = columns[destination.droppableId as keyof typeof columns];

        // If start is the same as end, we're in the same column
        if (start === end) {
            // Move the item within the list
            // Start by making a new list without the dragged item
            const newList = start.list.filter(
                (_: any, idx: number) => idx !== source.index
            );

            // Then insert the item at the right location
            newList.splice(destination.index, 0, start.list[source.index]);

            // Then create a new copy of the column object
            const newCol = {
                id: start.id,
                list: newList,
                company_name: start.company_name || ''
            };

            // Update the state
            setColumns((state) => ({ ...state, [newCol.id]: newCol }));
            return null;
        } else {
            // If start is different from end, we need to update multiple columns
            // Filter the start list like before
            const newStartList = start.list.filter(
                (_: any, idx: number) => idx !== source.index
            );

            // Create a new start column
            const newStartCol = {
                id: start.id,
                list: newStartList,
                company_name: start.company_name || ''
            };

            // Make a new end list array
            const newEndList = end.list;

            // Insert the item into the end list
            newEndList.splice(destination.index, 0, start.list[source.index]);

            // Create a new end column
            const newEndCol = {
                id: end.id,
                list: newEndList,
                company_name: end.company_name || ''
            };

            // Update the state
            setColumns((state) => ({
                ...state,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol,
            }));
            return null;
        }
    };

    const addColumn = () => {
        const newColumnId = `${Object.keys(columns).length}`; // Generate a unique ID based on timestamp
        setColumns((prevColumns) => ({
            ...prevColumns,
            [newColumnId]: { id: parseInt(newColumnId), list: [], company_name: '' }, // Add new column with an empty list
        }));
    };

    const removeColumnByIndex = (index: string, confirm?: boolean) => {
        setRemoveId(index)
        if (Object.keys(columns).length <= 1) return; // Prevent removing the last column

        const columnKeys = Object.keys(columns);
        const columnToRemoveId = columnKeys[parseInt(index)]; // Get the column id at the provided index
        const columnToRemove = columns[columnToRemoveId]; // Get the column object to be removed

        if (columnToRemove.list.length != 0 && !confirm) {
            setOpenConfirmRemove(true)
            return
        }

        if (!columnToRemove || !columns["0"]) return; // Ensure the column to remove and default column exist

        const defaultColumn = columns["0"];

        // Merge the items from the removed column into the default column
        const updatedDefaultColumn = {
            ...defaultColumn,
            list: [...defaultColumn.list, ...columnToRemove.list], // Merge the lists
        };

        // Create a new columns object, removing the selected column and updating the default column
        setColumns((prevColumns: any) => {
            const newColumns = { ...prevColumns };
            delete newColumns[columnToRemoveId]; // Remove the column by id

            // Update the default column with the new merged list
            const reorderedColumns = {
                ...newColumns,
                "0": updatedDefaultColumn,
            };

            // Reindex the columns to ensure proper sequential order (starting from 1)
            const orderedColumns = Object.keys(reorderedColumns)
                .sort((a, b) => parseInt(a) - parseInt(b)) // Sort by numeric keys
                .reduce((acc: any, key: string, idx: number) => {
                    const newKey = idx.toString(); // Reassign keys to be sequential starting from 0
                    acc[newKey] = { ...reorderedColumns[key], id: idx }; // Update the id as per the new index
                    return acc;
                }, {});

            return orderedColumns;
        });
    };

    const handleCompanyNameChange = (columnId: string, name: string) => {
        setColumns(prev => ({
            ...prev,
            [columnId]: {
                ...prev[columnId],
                company_name: name
            }
        }));
    };

    const handleConfirmSetupInvoice = async () => {
        const mappedResult = Object.entries(columns).map(([key, value]) => ({
            id: value.id,
            list: value.list.map((item: any) => item.customer_product_id),
            company_name: value.company_name || '' // เพิ่ม company_name
        }));

        const emptyLists = mappedResult.filter(item => item.list.length === 0);
        if (emptyLists.length > 0) {
            console.log("IDs with empty lists (excluding id 0):", emptyLists.map(item => item.id));
            alertError(t("login.error"), t("invoice.confirm-error"));
            return
        }

        // set handle submit confirm set-up invoice group.
        const result: any = {
            update_time: udpateTime,
            setup_invoices: mappedResult
        };
        console.log("CHECK DATA SETUP INVOICE :", result);

        setResult(result)
        setOpenConfirmSetup(true)
    };

    const handleSubmitSetupInvoiceGroup = async () => {
        try {
            const res = await createGroupInvoiceService(cusID ?? '', result)
            alertSuccess(TranslateErrorCode(res?.code));
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code) || 'Error');
        } finally {
            setOpenConfirmSetup(false)
            setIsSubmit(true);
            getProductList();
        }
    }

    const handleCloseConfirmRemoveModal = () => {
        setOpenConfirmRemove(false)
    }

    const handleCloseConfirmSetupModfdal = () => {
        setOpenConfirmSetup(false)
    }

    const handleSubmitModal = () => {
        handleCloseConfirmRemoveModal()
        removeColumnByIndex(removeId, true)
    }

    useEffect(() => {
        Object.keys(columns).length < counterProduct ? setIsAddButton(false) : setIsAddButton(true)
    }, [columns]);

    return (
        <Box
            sx={{
                height: 'fit-content',
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <Typography className='py-2' variant="h4" component="h1">
                {t('button.setup-invoice')}
            </Typography>
            <Box className="flex gap-3 my-2">
                <Typography variant="h6" component="h1" alignContent="center">
                    {t('button.invoice-group')}
                </Typography>
                <span className="grow" />
                <Button
                    disabled
                    variant="contained"
                    color="primary"
                    children={t("button.preview-invoice")}
                    sx={{ width: "140px", height: "35" }}
                />
                <Button
                    variant="contained"
                    color="success"
                    children={`+ ${t("button.invoice-group")}`}
                    sx={{ width: "140px", height: "35" }}
                    onClick={addColumn}
                    disabled={isAddButton}
                />
            </Box>
            <Divider />
            <DragDropContext onDragEnd={onDragEnd}>
                <StyledColumns>
                    {Object.values(columns).map((col: any) => (
                        <Column
                            col={col}
                            key={col.id}
                            removeColumn={removeColumnByIndex}
                            onCompanyNameChange={handleCompanyNameChange}
                        />
                    ))}
                </StyledColumns>
            </DragDropContext>
            <Box sx={{
                display: "flex",
                justifyContent: 'flex-end',
                width: "100%",
                gap: 2,
                mb: 5
            }}>

                <Button
                    data-testid="customer-customertable-addproduct-button"
                    variant="contained"
                    color="error"
                    children={t("button.cancel")}
                    onClick={navigateToCustomers}
                />
                <Button
                    data-testid="customer-customertable-addproduct-button"
                    variant="contained"
                    color="primary"
                    children={t("button.confirm")}
                    onClick={handleConfirmSetupInvoice}
                />
            </Box>
            <Modal
                open={openConfirmRemove}
                onClose={handleCloseConfirmRemoveModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box
                    sx={{
                        ...style,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: 700,
                        maxHeight: "calc(100vh - 20px)",
                        overflowY: "auto",
                    }}>
                    <Typography variant="h5" sx={{ fontFamily: "", fontWeight: 500, py: 2, }}>
                        {t("invoice.confirm-delete-title")}
                    </Typography>
                    <Typography sx={{ fontFamily: "", fontWeight: 300, py: 2, }}>
                        {t("invoice.confirm-delete")}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingY: "20px" }}>
                        <Button
                            variant="text"
                            data-testid="customer-addcustomer-cancel-button"
                            children={t("button.cancel")}
                            onClick={handleCloseConfirmRemoveModal}
                        />
                        <Button
                            type="submit"
                            data-testid="customer-addcustomer-submit-button"
                            variant="text"
                            children={t("button.save")}
                            onClick={handleSubmitModal}
                        />
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={openConfirmSetup}
                onClose={handleCloseConfirmSetupModfdal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box
                    sx={{
                        ...style,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: 700,
                        maxHeight: "calc(100vh - 20px)",
                        overflowY: "auto",
                    }}>
                    <Typography variant="h5" sx={{ fontFamily: "", fontWeight: 500, py: 2, }}>
                        {t("invoice.confirm-setup-title")}
                    </Typography>
                    <Typography sx={{ fontFamily: "", fontWeight: 300 }}>
                        {t("invoice.confirm-setup")}
                    </Typography>
                    <Typography sx={{ fontFamily: "", fontWeight: 300 }}>
                        {t("invoice.confirm-setup1")}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingY: "20px" }}>
                        <Button
                            variant="text"
                            data-testid="customer-addcustomer-cancel-button"
                            children={t("button.cancel")}
                            onClick={handleCloseConfirmSetupModfdal}
                        />
                        <Button
                            type="submit"
                            data-testid="customer-addcustomer-submit-button"
                            variant="text"
                            children={t("button.save")}
                            onClick={handleSubmitSetupInvoiceGroup}
                        />
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

Component.display = "SetupInvoice"
// stitches.config.js

const StyledColumns = styled("div", {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    margin: "3vh auto",
    // width: "80%",
    // height: "80vh",
    gap: "16px",
});

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 4,
    pt: 4,
};