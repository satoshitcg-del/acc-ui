import React, { useState } from "react";
import {
    TableRow,
    TableCell,
    IconButton,
    Button,
    Box,
    Collapse,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    CircularProgress,
    Table,
    TableBody,
    TableHead,
    Typography,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RepeatIcon from "@mui/icons-material/Repeat";
import { TFunction } from "i18next";
import { CreateData } from "..";
import { IconMenuSvg } from "@/assets/svg/IconMenuSvg";
import IconTableSvg from "@/assets/svg/TableSvg";
import { formatDate } from "@/core/dateUtils";
import { ONETIME_BILLING_STATUS } from "@/core/enum";
import { formatNumber } from "@/core/utils";
import { onetimeStatusCategory } from "@/layout/components/modal-biiling-note/BillingNoteData";
import { AccountCircle } from "@mui/icons-material";
// Define your IUpdateOneTimeStatusReq interface here
interface IUpdateOneTimeStatusReq {
    id: string;
    status: string;
}

interface RowProps {
    row: ReturnType<typeof CreateData>;
    trans: TFunction<"translation", undefined>;
    handleOpenEditInvoice: (id: string) => void;
    handleOpenModalDeleteOnetimeBilling: (id: string) => void;
    handleOpenModalStatusToggle: (req: IUpdateOneTimeStatusReq) => void;
    handleOpenPDFPreviewModal: (id: string) => void;
    handleOpenHistory: (id: string, wallet_type: string, wallet_no: string) => Promise<void>;
    exportPDF: any;
    handleOpenCustomerProfileModalTypeBilling: any
}

const OneTimeBillingRow = ({
    row,
    trans,
    handleOpenEditInvoice,
    handleOpenModalDeleteOnetimeBilling,
    handleOpenModalStatusToggle,
    handleOpenPDFPreviewModal,
    handleOpenHistory,
    exportPDF,
    handleOpenCustomerProfileModalTypeBilling
}: RowProps) => {
    const theme = useTheme();
    const [openCollapse, setOpenCollapse] = React.useState(false);
    const [isEditStatus, setIsEditStatus] = useState(false);
    const [invoiceStatus, setInvoiceStatus] = React.useState("");
    const [nextInvoiceStatus, setNextInvoiceStatus] = React.useState(['']);
    const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [btnLoading, setBtnLoading] = React.useState(false);

    const handleEditInvoiceStatus = (id: string, status: string, nextStatus: string[]) => {
        if (!status || !nextStatus) {
            return;
        }
        setNextInvoiceStatus([...nextStatus, status])
        setInvoiceStatus(status);
        if (!btnLoading) {
            setBtnLoading(true);
            timer.current = setTimeout(() => {
                setBtnLoading(false);
                setIsEditStatus(true);
            }, 200);
        }
    };

    const handleCancelInvoiceStatus = () => setIsEditStatus(false);

    const handleChangeInvoiceStatus = (event: SelectChangeEvent) => setInvoiceStatus(event.target.value as string);

    const handleSaveInvoiceStatus = async (id: string, customer_id: string, total_paid: any) => {
        try {
            const body = {
                id,
                status: invoiceStatus,
                customer_id,
                total_paid
            }
            handleOpenModalStatusToggle(body);
        } catch (error) {
            console.log("Error :", error);
        } finally {
            setIsEditStatus(false);
        }
    };

    const downloadPDF = async (id: string) => {
        try {
            const response = await exportPDF(id)
        } catch (error) {
            console.log(error)
        }
    };

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const isCheckExportAction = row?.status === ONETIME_BILLING_STATUS.DRAFT || row?.status === ONETIME_BILLING_STATUS.PENDING_APPROVED || row?.status === ONETIME_BILLING_STATUS.VOID ? false : true;
    const isLastInvoiceStatus = row?.status === ONETIME_BILLING_STATUS.VOID || row?.status === ONETIME_BILLING_STATUS.REFUNDED ? true : false;

    return (
        <React.Fragment>
            <TableRow
                sx={{
                    padding: 0,
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.04)',
                    },
                }}
            >
                <TableCell sx={{ p: 0 }} align="center">
                    <IconButton
                        sx={{
                            padding: 0,
                            transition: 'transform 0.3s ease',
                            transform: openCollapse ? 'rotate(-180deg)' : 'rotate(0)',
                        }}
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenCollapse(!openCollapse)}
                    >
                        <KeyboardArrowDownIcon />
                    </IconButton>
                </TableCell>
                <TableCell sx={{ padding: 0 }} align="center">
                    {row?.index || '-'}
                </TableCell>
                <TableCell sx={{ padding: 1 }} align={row?.invoice_number ? "left" : "center"}>
                    {row?.invoice_number || '-'}
                </TableCell>
                <TableCell sx={{ padding: 0, px: 1 }} component="th" scope="row" align="center">
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
                        <Typography className="truncate">{row?.customer_name || '-'}</Typography>
                    </Button>
                </TableCell>
                <TableCell sx={{ padding: 1 }} align="left">
                    {(row?.prefix ? `${row?.product_name}(${row?.prefix})` : `${row?.product_name}`) || '-'}
                </TableCell>
                <TableCell sx={{ padding: 1 }} align="right">
                    <Typography sx={{ fontSize: "13px", whiteSpace: "nowrap" }} color={row?.total_price < 0 ? theme.palette.error.main : ""}>
                        {`${formatNumber(row?.total_price)} USDT`}
                    </Typography>
                </TableCell>
                <TableCell sx={{ padding: 0 }} align="center">
                    {isEditStatus ? (
                        <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <FormControl variant="standard" sx={{ minWidth: "50%", ml: 1 }} size="small">
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    sx={{ fontSize: "12px", maxWidth: "85px" }}
                                    value={invoiceStatus}
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
                                    {nextInvoiceStatus.map((status) => status != invoiceStatus ? <MenuItem key={status} value={status}>{status}</MenuItem> : null)}
                                </Select>
                            </FormControl>
                            <IconButton data-testid="customer-customertable-edit-button" onClick={() => handleSaveInvoiceStatus(row?.id, row?.customer_id, row?.total_price)} disabled={row?.status == invoiceStatus ? true : false}>
                                <IconMenuSvg icon={"save"} color={row?.status != invoiceStatus ? "primary" : "inherit"} />
                            </IconButton>
                            <IconButton data-testid="customer-customertable-edit-button" onClick={handleCancelInvoiceStatus}>
                                <IconMenuSvg icon={"cancel"} color={"action"} />
                            </IconButton>
                        </Box>
                    ) : (
                        <Button
                            data-testid={`billingnote-index-categorylist-button-${row?.status?.toLowerCase()}`}
                            sx={{
                                minWidth: "120px",
                                backgroundColor: onetimeStatusCategory.find(category => category.status === row?.status)?.activeColor,
                                boxShadow: 2,
                                cursor: isLastInvoiceStatus ? "default" : "allowed",
                                pointerEvents: isLastInvoiceStatus ? "none" : "auto"
                            }}
                            onClick={() => handleEditInvoiceStatus(row?.id, row?.status, row?.next_status)}
                            size="small"
                            variant="contained"
                            endIcon={btnLoading ? <CircularProgress color="inherit" size={18} /> : <RepeatIcon />}
                        >
                            {row?.status}
                        </Button>
                    )}
                </TableCell>
                <TableCell sx={{ padding: 0 }} align="center">
                    <IconButton sx={{ padding: 0 }} data-testid="one-time-pdf-icon" onClick={() => handleOpenPDFPreviewModal(row?.id)}>
                        <IconMenuSvg icon={"pdf"} color={"primary"} />
                    </IconButton>
                </TableCell>
                <TableCell sx={{ padding: 0 }} align="center">
                    <IconButton sx={{ mx: -1, padding: 0 }} data-testid="one-time-export-icon" onClick={() => downloadPDF(row?.id)} disabled={!isCheckExportAction}>
                        <IconTableSvg icon="export" active={isCheckExportAction} />
                    </IconButton>
                </TableCell>
                <TableCell sx={{ padding: 0 }} align="center">
                    <IconButton sx={{ mx: -1, padding: 0 }} data-testid="one-time-history-icon" onClick={() => handleOpenHistory(row?.id, row?.wallet_type, row?.wallet_no)}>
                        <IconTableSvg icon="history" />
                    </IconButton>
                </TableCell>
                <TableCell sx={{ padding: 1 }} align="right">
                    {formatDate(row?.created_date) || '-'}
                </TableCell>
                <TableCell sx={{ padding: 0, gap: 2 }} align="center">
                    <IconButton
                        data-testid="customer-customertable-edit-button"
                        sx={{ mx: 1 }}
                        onClick={() => handleOpenEditInvoice(row?.id)}
                        disabled={row?.status !== ONETIME_BILLING_STATUS.DRAFT ? true : false}
                    >
                        <IconTableSvg icon="edit" active={row?.status !== ONETIME_BILLING_STATUS.DRAFT ? true : false} />
                    </IconButton>
                    <IconButton
                        data-testid="customer-customertable-delete-button"
                        sx={{ mx: 1 }}
                        onClick={() => handleOpenModalDeleteOnetimeBilling(row?.id)}
                        disabled={row?.status !== ONETIME_BILLING_STATUS.DRAFT ? true : false}
                    >
                        <IconTableSvg icon="delete" active={row?.status !== ONETIME_BILLING_STATUS.DRAFT ? true : false} />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow component="div">
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={openCollapse} timeout={300}>
                        <Box sx={{
                            margin: 2,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: 1,
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 0 0 1px rgba(255, 255, 255, 0.1)'
                                : '0 0 0 1px rgba(0, 0, 0, 0.05)',
                        }}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.05)'
                                                : 'rgba(0, 0, 0, 0.03)',
                                            '& th': {
                                                borderBottom: theme.palette.mode === 'dark'
                                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                                    : '1px solid rgba(0, 0, 0, 0.1)',
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ width: 80 }} align="center">
                                            <Typography variant="body2" fontWeight="bold">
                                                {trans('table.number')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left" sx={{ minWidth: 200 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {trans('table.product')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ minWidth: 100 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {trans('table.quantity')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" sx={{ minWidth: 120 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {trans('table.prices')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" sx={{ minWidth: 120 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {trans('billing.total-price')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row?.items?.map((pd: any, index: number) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                // '&:last-child td': { border: 0 },
                                                transition: 'background-color 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: theme.palette.mode === 'dark'
                                                        ? 'rgba(255, 255, 255, 0.08)'
                                                        : 'rgba(0, 0, 0, 0.02)',
                                                },
                                            }}
                                        >
                                            <TableCell align="center" sx={{ border: "none" }}>
                                                {index + 1}
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                sx={{
                                                    border: "none",
                                                    color: 'text.primary',
                                                }}
                                            >
                                                {pd.name}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{ border: "none" }}
                                            >
                                                {pd.quantity || 1}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    border: "none",
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                <Typography sx={{ fontSize: "13px" }} color={pd.price < 0 ? theme.palette.error.main : ""}>
                                                    {`${formatNumber(pd.price)} USDT`}
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    border: "none",
                                                    fontWeight: 'medium',
                                                }}
                                            >
                                                <Typography sx={{ fontSize: "13px" }} color={pd.price * (pd.quantity || 1) < 0 ? theme.palette.error.main : ""}>
                                                    {`${formatNumber(pd.price * (pd.quantity || 1))} USDT`}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box
                                sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, }}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 2 }}>
                                    {trans('billing.total-price')}:
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: row?.total_price < 0 ? theme.palette.error.main : theme.palette.primary.main }}>
                                    {`${formatNumber(row?.total_price)} USDT`}
                                </Typography>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default OneTimeBillingRow;
