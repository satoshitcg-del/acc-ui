import { IconMenuSvg } from "@/assets/svg/IconMenuSvg";
import IconTableSvg from "@/assets/svg/TableSvg";
import { BoxShadowButton } from "@/core/constant";
import { formatDateLanguage, getMessageOfPrefixByStatus, getFontColorOfPrefix, formatNumber } from "@/core/utils";
import { categoryList } from "@/layout/components/modal-biiling-note/BillingNoteData";
import { TableRow, TableCell, Box, Button, Typography, Tooltip, IconButton, FormControl, Select, MenuItem, SelectChangeEvent, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { t } from "i18next";
import { Edit as EditIcon, Delete as DeleteIcon, AccountCircle, BorderColor, Repeat as RepeatIcon } from '@mui/icons-material'
import React, { useEffect, useState } from "react";
import { BILLING_STATUS } from "@/core/enum";
import { formatDate } from "@/core/dateUtils";
import { useTheme } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
interface RowProps {
    row: any
    handleOpenCustomerProfileModalTypeBilling: (id: string, customer_id: string) => void;
    handleOpenModalDeleteDraftInvoice: (id: string) => void;
    handleOpenPDFPreviewModal: (id: string) => void;
    downloadPDF: (id: string) => void;
    handleOpenHistory: (id: string, status: string) => void;
    handleOpenNote: (id: string) => void;
    rowIndex: number;
    handleStatusModal: any
    handleOpenPaySlipHistory: (id: string) => void;
    handleOpenVerifyPayment: (id: string) => void;
}

const BillingNoteTableRow = ({
    row,
    handleOpenCustomerProfileModalTypeBilling,
    handleOpenModalDeleteDraftInvoice,
    handleOpenPDFPreviewModal,
    downloadPDF,
    handleOpenHistory,
    handleOpenNote,
    rowIndex,
    handleStatusModal,
    handleOpenPaySlipHistory,
    handleOpenVerifyPayment,

}: RowProps) => {
    const theme = useTheme();
    const [nextInvoiceStatus, setNextInvoiceStatus] = useState(['']);
    const [isEditStatus, setIsEditStatus] = useState(false);
    const [invoiceStatus, setInvoiceStatus] = React.useState("");
    const [btnLoading, setBtnLoading] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const handleChangeInvoiceStatus = (event: SelectChangeEvent) => setInvoiceStatus(event.target.value as string);
    const handleEditInvoiceStatus = (id: string, status: string, nextStatus: string[]) => {
        if (!status || !nextStatus || nextStatus.length == 0) {
            return;
        }
        setNextInvoiceStatus([...nextStatus, status])
        setInvoiceStatus(status);
        if (!btnLoading && status !== BILLING_STATUS.VERIFYPAYMENT) {
            setBtnLoading(true);
            timer.current = setTimeout(() => {
                setBtnLoading(false);
                setIsEditStatus(true);
            }, 300);
        } else if (status === BILLING_STATUS.VERIFYPAYMENT) {
            console.log("STATUS VERIFY:", status);
            handleOpenVerifyPayment(id)
        }
    };
    const handleCancelInvoiceStatus = () => setIsEditStatus(false);

    return (
        <TableRow sx={{
            '&:nth-of-type(odd)': {
                backgroundColor: (theme) => theme.palette.action.hover,
            },
        }}>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1 }}>{rowIndex}</TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1 }}>{row?.invoice_no || '-'}</TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1 }}>
                <Box style={{ width: '100%', textAlign: row?.billing_cycle ? 'left' : 'center' }}>
                    {row?.billing_cycle ? formatDateLanguage(row?.billing_cycle) : "-"}
                </Box>
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1 }}>
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
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1, textAlign: row?.billing_cycle ? 'left' : 'center' }}>
                {`${t('billing.invoice-group')}  ${row?.invoice_group + 1}`}
            </TableCell>
            <TableCell align="left" sx={{ verticalAlign: 'center', p: 1, }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    width: "100%",
                }}>
                    {row?.product_wl?.length === 0 ? (

                        <Typography
                            sx={{
                                fontSize: "13px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "inline-flex",        // ทำให้ icon กับ text อยู่ใน flex row
                                alignItems: "center",
                            }}
                            color={theme.palette.warning.main}
                        >
                            <ErrorOutlineIcon sx={{ mr: 0.5, color: theme.palette.warning.main, }} />
                            {t('billing.product-not-available')}
                        </Typography>
                    ) : (
                        row?.product_wl?.map((value: any, index: number) => ( //params.row.prefix
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
                                    {`${value?.product_name} ${value?.prefix_name ? `(${value?.prefix_name})` : ''}`}
                                </Typography>
                            </Tooltip>
                        ))

                    )}
                </Box>
            </TableCell>
            <TableCell sx={{ verticalAlign: 'center', p: 1, pl: 3, textAlign: 'center' }}>
                {isEditStatus ? (
                    <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
                        <FormControl variant="standard" sx={{ minWidth: "50%", mx: 0.6, mt: 0.6 }} size="small">
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{ fontSize: "12px" }}
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
                        <IconButton
                            data-testid="customer-customertable-edit-button"
                            onClick={() => {
                                setIsEditStatus(false)
                                handleStatusModal(invoiceStatus, row)
                            }}
                            disabled={row?.invoice_status == invoiceStatus ? true : false}
                        >
                            <IconMenuSvg icon={"save"} color={row?.invoice_status != invoiceStatus ? "primary" : "inherit"} />
                        </IconButton>
                        <IconButton
                            data-testid="customer-customertable-edit-button"
                            onClick={handleCancelInvoiceStatus}
                        >
                            <IconMenuSvg icon={"cancel"} color={"action"} />
                        </IconButton>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
                        <Button
                            data-testid={`billingnote-index-categorylist-button-${row?.invoice_status.toLowerCase()}`}
                            sx={{
                                width: "140px",
                                backgroundColor: categoryList.find(category => category.status === row?.invoice_status)?.activeColor,
                                boxShadow: BoxShadowButton,
                                // mt: -0.8,
                                px: 2,
                                cursor: row?.next_status.length == 0 ? "default" : "allowed",
                                pointerEvents: row?.next_status.length == 0 ? "none" : "auto"
                            }}
                            children={categoryList.find(category => category.status === row?.invoice_status)?.status}
                            size="small"
                            variant="contained"
                            endIcon={btnLoading ? <CircularProgress color="inherit" size={18} /> : <RepeatIcon />}
                            onClick={() => handleEditInvoiceStatus(row?.id, row?.invoice_status, row?.next_status)}
                            disabled={row?.product_wl?.length === 0}
                        />
                        {row?.invoice_status === "DRAFT" && row?.product_wl?.length !== 0 &&
                            <IconButton
                                data-testid="customer-customertable-edit-button"
                                onClick={() => handleOpenModalDeleteDraftInvoice(row?.id)}
                                sx={{
                                    p: 0,
                                    mx: 2,
                                    overflow: "hidden", // ป้องกัน ripple ออกนอกขอบ
                                    minWidth: "28px", // ขยายพื้นที่ ripple
                                    minHeight: "28px",
                                }}

                            >
                                <DeleteIcon sx={{ fontSize: '22px' }} />
                            </IconButton>
                        }
                    </Box>
                )}
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1, textAlign: 'right' }}>
                <Typography sx={{ fontSize: "13px" }} color={row?.total_payment_crypto < 0 ? theme.palette.error.main : ""}>
                    {`${formatNumber(row?.total_payment_crypto)} USDT`}
                </Typography>
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1, textAlign: 'right' }} color={row?.overdue_price_crypto < 0 ? theme.palette.error.main : ""}>
                <Typography sx={{ fontSize: "13px" }} color={row?.total_payment_crypto < 0 ? theme.palette.error.main : ""}>
                    {`${formatNumber(row?.total_payment_crypto)} USDT`}
                </Typography>
            </TableCell>
            <TableCell align={row?.closing_date ? "right" : "center"} sx={{ verticalAlign: 'center', p: 1 }}>
                {formatDate(row?.closing_date)}
            </TableCell>
            <TableCell align={row?.payment_due_date ? "right" : "center"} sx={{ verticalAlign: 'center', p: 1 }}>
                {formatDate(row?.payment_due_date)}
            </TableCell>
            <TableCell align={row?.updated_at ? "right" : "center"} sx={{ verticalAlign: 'center', p: 1 }}>
                {formatDate(row?.updated_at)}
            </TableCell>
            <TableCell align={row?.created_at ? "right" : "center"} sx={{ verticalAlign: 'center', p: 1 }}>
                {formatDate(row?.created_at)}
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 0 }}>
                <IconButton
                    data-testid="customer-customertable-delete-button"
                    onClick={() => {
                        handleOpenPDFPreviewModal(row?.id)
                    }}
                    disabled={row?.product_wl?.length === 0}
                >
                    <IconMenuSvg icon={"pdf"} color={row?.product_wl?.length === 0 ? "inherit" : "primary"} />
                </IconButton>
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 0 }}>
                <IconButton
                    data-testid="customer-customertable-delete-button"
                    disabled={row.invoice_status == 'DRAFT'}
                    onClick={() => {
                        downloadPDF(row?.id)
                    }}
                >
                    <IconTableSvg icon="export" active={row.invoice_status !== 'DRAFT'} />
                </IconButton>
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 0 }}>
                <IconButton
                    data-testid="customer-customertable-delete-button"
                    onClick={() => {
                        handleOpenHistory(row?.id, row?.invoice_status)
                    }}
                    disabled={row?.product_wl?.length === 0}
                >
                    <IconTableSvg icon="history" active={row?.product_wl?.length === 0} />
                </IconButton>
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 0 }}>
                <IconButton
                    data-testid="customer-customertable-delete-button"
                    onClick={() => {
                        handleOpenPaySlipHistory(row?.id)
                    }}
                    disabled={row?.product_wl?.length === 0}
                >
                    <IconMenuSvg icon="invoice" color="inherit" />
                </IconButton>
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 0 }}>
                <IconButton
                    data-testid="customer-customertable-delete-button"
                    onClick={() => {
                        handleOpenNote(row?.id)
                    }}
                    disabled={row?.product_wl?.length === 0}
                >
                    <BorderColor sx={{ color: row?.product_wl?.length === 0 ? 'inherit' : '#9C27B0' }} />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default BillingNoteTableRow;
