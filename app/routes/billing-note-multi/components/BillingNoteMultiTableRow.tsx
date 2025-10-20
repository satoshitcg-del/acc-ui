import { IconMenuSvg } from "@/assets/svg/IconMenuSvg";
import IconTableSvg from "@/assets/svg/TableSvg";
import { BoxShadowButton } from "@/core/constant";
import { formatDateLanguage, getMessageOfPrefixByStatus, getFontColorOfPrefix, formatNumber } from "@/core/utils";
import { categoryList } from "@/layout/components/modal-biiling-note/BillingNoteData";
import { TableRow, TableCell, Box, Button, Typography, Tooltip, IconButton, Checkbox } from "@mui/material";
import dayjs from "dayjs";
import { t } from "i18next";
import { AccountCircle, BorderColor, Repeat as RepeatIcon } from '@mui/icons-material'
import React from "react";
import { formatDate } from "@/core/dateUtils";

interface RowProps {
    row: any
    rowIndex: number;
    rowSelected: any
    handleSelectRow: (event: React.MouseEvent<unknown>, id: number) => void
    handleOpenCustomerProfileModalTypeBilling: (id: string, customer_id: string) => void;
    handleOpenPDFPreviewModal: (id: string) => void;
    downloadPDF: (id: string) => void;
    handleOpenHistory: (id: string, status: string) => void;
    handleOpenNote: (id: string) => void;
    handleOpenPaySlipHistory: (id: string) => void;
}

const BillingNoteMultiTableRow = ({
    row,
    rowIndex,
    rowSelected,
    handleSelectRow,
    handleOpenCustomerProfileModalTypeBilling,
    handleOpenPDFPreviewModal,
    downloadPDF,
    handleOpenHistory,
    handleOpenNote,
    handleOpenPaySlipHistory,

}: RowProps) => {


    return (
        <TableRow
            key={row.id}
            selected={rowSelected.includes(row.id)}
            sx={{
                '&:nth-of-type(odd)': {
                    backgroundColor: (theme) => theme.palette.action.hover,
                },
            }}
        >
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 0 }}>
                <Checkbox
                    color="primary"
                    checked={rowSelected.includes(row.id)}
                    inputProps={{
                        'aria-labelledby': `enhanced-table-checkbox-${rowIndex}`,
                    }}
                    sx={{
                        width: '14px',
                        height: '14px',
                    }}
                    onClick={(event) => handleSelectRow(event, row.id)}
                />
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1 }}>{rowIndex}</TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1 }}>{row?.invoice_no || '-'}</TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1 }}>
                <Box style={{ width: '100%', textAlign: row?.billing_cycle ? 'left' : 'center' }} >
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
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1, textAlign: 'left' }}>
                {`${t('billing.invoice-group')}  ${row?.invoice_group + 1}`}
            </TableCell>
            <TableCell align="left" sx={{ verticalAlign: 'center', p: 1, textAlign: 'left' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    width: "100%",
                }}>
                    {row?.product_wl?.map((value: any, index: number) => ( //params.row.prefix
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
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1 }}>
                <Button
                    data-testid={`billingnote-index-categorylist-button-${row?.invoice_status.toLowerCase()}`}
                    sx={{
                        width: "100%",
                        backgroundColor: categoryList.find(category => category.status === row?.invoice_status)?.activeColor,
                        boxShadow: BoxShadowButton,
                        cursor: "default",
                        pointerEvents: "none",
                    }}
                    children={categoryList.find(category => category.status === row?.invoice_status)?.status}
                    size="small"
                    variant="contained"
                    endIcon={<RepeatIcon />}
                />
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1, textAlign: 'right' }}>
                {`${formatNumber(row?.total_payment_crypto)} USDT`}
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 1, textAlign: 'right' }}>
                {`${formatNumber(row?.overdue_price_crypto)} USDT`}
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
                >
                    <IconMenuSvg icon={"pdf"} color={"primary"} />
                </IconButton>
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'center', p: 0 }}>
                <IconButton
                    disabled={row.invoice_status === 'DRAFT'}
                    data-testid="customer-customertable-delete-button"
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
                >
                    <IconTableSvg icon="history" />
                </IconButton>
            </TableCell>

            <TableCell align="center" sx={{ verticalAlign: 'center', p: 0 }}>
                <IconButton
                    data-testid="customer-customertable-delete-button"
                    onClick={() => {
                        handleOpenPaySlipHistory(row?.id)
                    }}
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
                >
                    <BorderColor sx={{ color: '#9C27B0' }} />
                </IconButton>
            </TableCell>
        </TableRow >
    );
};

export default BillingNoteMultiTableRow;
