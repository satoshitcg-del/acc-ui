import React, { useState } from "react";
import {
    TableRow,
    TableCell,
    Typography,
    Box,
    Button,
    IconButton,
    CircularProgress,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    useTheme,
} from "@mui/material";
import RepeatIcon from "@mui/icons-material/Repeat";
import { formatDateLanguage, formatNumber } from "@/core/utils";
import { BoxShadowButton } from "@/core/constant";
import IconTableSvg from "@/assets/svg/TableSvg";
import { IconMenuSvg } from "@/assets/svg/IconMenuSvg";
import { ColumnDirectApiProps } from "../DirectApiProps";
import { BILLING_STATUS, DIRECT_API_STATUS } from "@/core/enum";

interface DirectApiTableRowProps {
    key: any;
    row: any;
    index: number;
    page: number;
    rowsPerPage: number;
    directColumns: readonly ColumnDirectApiProps[];
    categoryList: { status: string; activeColor: string }[];
    handleOpenChangeStatus: (id: string, old_status: string, status: string) => void;
    handleOpenDirectApiHistory: (id: string) => void;
    handleOpenPreviewDirectApiModal: (id: string) => void;
    handleOpenEditDirectApiModal: (id: string) => void;
    handleOpenModalDeleteDirectApi: (id: string) => void;
}

const DirectApiTableRow: React.FC<DirectApiTableRowProps> = ({
    key,
    row,
    index,
    page,
    rowsPerPage,
    directColumns,
    categoryList,
    handleOpenChangeStatus,
    handleOpenDirectApiHistory,
    handleOpenPreviewDirectApiModal,
    handleOpenEditDirectApiModal,
    handleOpenModalDeleteDirectApi,
}) => {
    const theme = useTheme();
    const [btnLoading, setBtnLoading] = useState(false);
    const [nextInvoiceStatus, setNextInvoiceStatus] = useState(['']);
    const [isEditStatus, setIsEditStatus] = useState(false);
    const [invoiceStatus, setInvoiceStatus] = React.useState("");
    const handleChangeInvoiceStatus = (event: SelectChangeEvent) => setInvoiceStatus(event.target.value as string);
    const handleEditInvoiceStatus = (status: string, nextStatus: string[]) => {
        if (!status || !nextStatus || nextStatus.length == 0) {
            return;
        }
        setIsEditStatus(true)
        setNextInvoiceStatus([...nextStatus, status])
        setInvoiceStatus(status);
    };
    const handleCancelInvoiceStatus = () => setIsEditStatus(false);

    const createTableRows = (data: any, index: number) => {
        return {
            id: <Typography align="center" variant="body2">{index}</Typography>,
            ticketNo: <Typography variant="body2">{data?.direct_api_no || "-"}</Typography>,
            customerName: <Typography align={data?.name ? "left" : "center"} variant="body2">{data?.name || "-"}</Typography>,
            billingCycle: <Typography align={data?.month && data?.year ? "left" : "center"} variant="body2">{data?.month && data?.year ? formatDateLanguage(`${data?.month}/${data?.year}`) : "-"}</Typography>,
            totalAmount: <Typography align="right" variant="body2" color={data?.total_winlose < 0 ? theme.palette.error.main : ""}>{formatNumber(data?.total_winlose) || "-"}</Typography>,
            status: (
                <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", gap: 1 }}>
                    {isEditStatus ? (
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <FormControl variant="standard" size="small">
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    size="small"
                                    sx={{ fontSize: "12px" }}
                                    value={invoiceStatus || ''}
                                    onChange={handleChangeInvoiceStatus}
                                    renderValue={(selected) => selected ? selected as string : <em>Nothing</em>}
                                    MenuProps={{
                                        disableScrollLock: true,
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        },
                                        transformOrigin: {
                                            vertical: 'top',
                                            horizontal: 'left',
                                        },
                                    }}
                                >
                                    {nextInvoiceStatus.map((status: string) => status != invoiceStatus ? <MenuItem key={status} value={status}>{status}</MenuItem> : null)}
                                </Select>
                            </FormControl>
                            <IconButton
                                data-testid="customer-customertable-edit-button"
                                onClick={() => {
                                    handleOpenChangeStatus(data?._id, data?.status, invoiceStatus)
                                    setIsEditStatus(false)
                                }}
                                disabled={data?.status == invoiceStatus ? true : false}
                            >
                                <IconMenuSvg icon={"save"} color={data?.status != invoiceStatus ? "primary" : "inherit"} />
                            </IconButton>
                            <IconButton
                                data-testid="customer-customertable-edit-button"
                                onClick={() => handleCancelInvoiceStatus()}
                            >
                                <IconMenuSvg icon={"cancel"} color={"action"} />
                            </IconButton>
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", width: "100%" }}>
                            <Button
                                data-testid={`billingnote-index-categorylist-button-${data?.status?.toLowerCase()}`}
                                sx={{
                                    width: "140px",
                                    backgroundColor: categoryList.find(category => category.status === data?.status)?.activeColor,
                                    boxShadow: BoxShadowButton,
                                    px: 2,
                                }}
                                children={categoryList.find(category => category.status === data?.status)?.status}
                                size="small"
                                variant="contained"
                                endIcon={btnLoading ? <CircularProgress color="inherit" size={18} /> : <RepeatIcon />}
                                onClick={() => handleEditInvoiceStatus(data?.status, data?.next_status)}
                            />
                        </Box>
                    )}
                </Box>
            ),
            history: (
                <IconButton data-testid="employee-edit-button" onClick={() => handleOpenDirectApiHistory(data?._id)} sx={{ p: 0.5 }}>
                    <IconTableSvg icon="history" />
                </IconButton>
            ),
            preview: (
                <IconButton data-testid="employee-edit-button" onClick={() => handleOpenPreviewDirectApiModal(data?._id)} sx={{ p: 0.5 }}>
                    <IconMenuSvg icon="preview-eye" color="primary" />
                </IconButton>
            ),
            management: (
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                    <IconButton
                        data-testid="employee-edit-button"
                        onClick={() => handleOpenEditDirectApiModal(data?._id)}
                        disabled={data?.status === DIRECT_API_STATUS.APPROVED ? true : false}>
                        <IconTableSvg icon="edit" active={data?.status === DIRECT_API_STATUS.APPROVED ? true : false} />
                    </IconButton>
                    <IconButton
                        data-testid="employee-delete-button"
                        onClick={() => handleOpenModalDeleteDirectApi(data?._id)}
                        disabled={data?.status === DIRECT_API_STATUS.APPROVED || data?.status === DIRECT_API_STATUS.EDIT_REQUESTED ? true : false}>
                        <IconTableSvg icon="delete" active={data?.status === DIRECT_API_STATUS.APPROVED || data?.status === DIRECT_API_STATUS.EDIT_REQUESTED ? true : false} />
                    </IconButton>
                </Box>
            ),
        };
    };

    const directRow = createTableRows(row, (page - 1) * rowsPerPage + index + 1);

    return (
        <TableRow
            key={key}
            hover
            sx={{
                "&:nth-of-type(odd)": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                },
            }}
        >
            {directColumns.map((column) => (
                <TableCell key={column.columnId} align={column.bodyAlign} sx={{ p: 0, px: 1 }}>
                    {directRow[column.columnId] || "-"}
                </TableCell>
            ))}
        </TableRow>
    );
};

export default DirectApiTableRow;
