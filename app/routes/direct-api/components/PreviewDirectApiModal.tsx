// MUI
import {
    Box,
    Button,
    Divider,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatDateLanguage, formatNumber } from '@/core/utils';
import dayjs from 'dayjs';
import { ColumnPreviewDirectApiProps } from '../DirectApiProps';

const directColumns: readonly ColumnPreviewDirectApiProps[] = [
    { columnId: "id", label: "number", minWidth: 50, align: "center" },
    { columnId: "subProductName", label: "sub-product-name", minWidth: 100, align: "center", bodyAlign: "center" },
    { columnId: "currency", label: "currency", minWidth: 60, align: "center", bodyAlign: "left" },
    { columnId: "product", label: "product", minWidth: 100, align: "center", bodyAlign: "left" },
    { columnId: "wlFiatAmount", label: "wl-fiat-amount", minWidth: 100, maxWidth: 140, align: "center" },
    { columnId: "percent", label: "percent", minWidth: 60, maxWidth: 140, align: "center" },
    { columnId: "fiatAmount", label: "fiat-amount", minWidth: 100, maxWidth: 140, align: "center" },
    { columnId: "totalAmount", label: "total-amount", minWidth: 100, align: "center", bodyAlign: "center" },
];

interface ComponentProps {
    open: any;
    setOpen: any;
    previewData: any;
}

export default function Component(props: ComponentProps) {
    const { open, setOpen, previewData } = props;
    const { t } = useTranslation()
    const theme = useTheme();

    const handleCloseAddModal = () => {
        setOpen(false);
    };

    function createTableRows(data: any, index: number) {
        return {
            id: <Typography align={'center'} variant="body2">{index}</Typography>,
            subProductName: <Typography align={data?.sub_product_name ? 'left' : 'center'} variant="body2">{data?.sub_product_name || '-'}</Typography>,
            currency: <Typography align={data?.currency ? 'left' : 'center'} variant="body2">{data?.currency || '-'}</Typography>,
            product: <Typography align={data?.product_name ? 'left' : 'center'} variant="body2">{data?.product_name || '-'}</Typography>,
            wlFiatAmount: <Typography align={data?.total_amount ? 'right' : 'center'} color={data?.total_amount < 0 ? theme.palette.error.main : ''} variant="body2">{formatNumber(data?.total_amount) || '-'}</Typography>,
            percent: <Typography align={data?.percent ? 'right' : 'center'} variant="body2">{`${data?.percent}%` || '-'}</Typography>,
            fiatAmount: <Typography align={data?.amount ? 'right' : 'center'} color={data?.amount < 0 ? theme.palette.error.main : ''} variant="body2">{formatNumber(data?.amount) || '-'}</Typography>,
            totalAmount: <Typography align={data?.total_amount_usdt ? 'right' : 'center'} color={data?.total_amount_usdt < 0 ? theme.palette.error.main : ''} variant="body2">{formatNumber(data?.total_amount_usdt) || '-'}</Typography>,
        };
    }

    const convertRateDate = (date: string) => {
        if (!date) return '-';
        const slipDate = date.split("-");
        const year = slipDate[0];
        const month = parseInt(slipDate[1]);
        const day = parseInt(slipDate[2]);
        return `${day} ${formatDateLanguage(`${month}/${year}`)}`;
    };

    return (
        <Modal
            open={open}
            onClose={handleCloseAddModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                <Paper sx={stylePaperModal}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "1rem",
                        paddingBottom: "1rem",
                    }}>
                        <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>{t(`modal.details`)}</Typography>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.5rem",
                            paddingTop: "1rem",
                        }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontWeight: "700" }}>{`${t('modal.invoice-id')} : ${previewData?.invoice_no || '-'}`}</Typography>
                            <Typography>{`${t('modal.billing-cycle')} : ${formatDateLanguage(previewData?.billing_cycle)}`}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography>{`${t('modal.customer-name')} : ${previewData?.customer_name}`}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Paper sx={{ width: "45%", borderRadius: '6px' }} elevation={2} >
                                <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
                                    <Typography>{t('modal.total_amount')}</Typography>
                                    <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", width: "100%", justifyContent: "flex-end" }}>
                                        <Typography sx={{ fontWeight: "600", fontSize: "24px", color: previewData?.total_amount < 0 ? theme.palette.error.main : '' }}>{`${formatNumber(previewData?.total_amount)}`}</Typography>
                                        <Typography sx={{ alignContent: "center", fontWeight: "700", fontSize: "14px" }}>{`USDT`}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                        <TableContainer sx={{ borderRadius: '6px' }}>
                            <Table aria-label="sticky table">
                                <TableHead sx={(theme) => ({
                                    backgroundColor: theme.palette.example.tableHeader,
                                    '& .MuiTableCell-root': {
                                        color: 'white',
                                        border: `1px solid ${theme.palette.example.inherit}`,
                                    },
                                })}>
                                    <TableRow>
                                        {directColumns.map((column) => (
                                            <TableCell
                                                key={column.columnId}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, width: column.width, fontWeight: 'bold', maxWidth: column.maxWidth || 'none' }}
                                                sx={{ p: 1 }}
                                            >
                                                {t(`table.${column.label}`)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={(theme) => ({
                                    '& .MuiTableCell-root': {
                                        border: `1px solid ${theme.palette.example.inherit}`,
                                    },
                                })}>
                                    {previewData?.items?.map((row: any, index: number) => {
                                        const directRow = createTableRows(row, index + 1);
                                        return (
                                            <TableRow key={`${row.id}_${index}`} hover sx={{
                                                '&:nth-of-type(odd)': {
                                                    backgroundColor: (theme) => theme.palette.action.hover,
                                                },
                                            }}>
                                                {directColumns.map((column) => (
                                                    <TableCell key={column.columnId} align={column.bodyAlign} sx={{ p: 1, px: 1 }}>
                                                        {directRow[column.columnId] || '-'}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {previewData?.currencies_rate &&
                            <Box sx={{ display: "flex", flexDirection: "column", width: "45%", gap: "0.2rem" }}>
                                <Typography>{`${t('modal.exchange-rate-date')} ${convertRateDate(previewData?.currencies_rate?.rate_date)}`}</Typography>
                                <TableContainer sx={{ borderRadius: '6px' }}>
                                    <Table aria-label="sticky table">
                                        <TableHead sx={(theme) => ({
                                            backgroundColor: theme.palette.example.tableHeader,
                                            '& .MuiTableCell-root': {
                                                color: 'white',
                                                border: `1px solid ${theme.palette.example.inherit}`,
                                            },
                                        })}>
                                            <TableRow>
                                                <TableCell align='center' sx={{ p: 1, minWidth: 100, fontWeight: 'bold' }}>{t('table.currency')}</TableCell>
                                                <TableCell align='center' sx={{ p: 1, minWidth: 100, fontWeight: 'bold' }}>{`${t('table.rate')} / 1 USDT`}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody sx={(theme) => ({
                                            '& .MuiTableCell-root': {
                                                border: `1px solid ${theme.palette.example.inherit}`,
                                            },
                                        })}>
                                            {previewData?.currencies_rate?.currencies?.map((row: any, index: number) => {
                                                return (
                                                    <TableRow key={`${row.id}_${index}`} hover sx={{
                                                        '&:nth-of-type(odd)': {
                                                            backgroundColor: (theme) => theme.palette.action.hover,
                                                        },
                                                    }}>

                                                        <TableCell align='center' sx={{ p: 1, px: 1 }}>{row?.fiat_name}</TableCell>
                                                        <TableCell align='right' sx={{ p: 1, px: 1 }}>{formatNumber(row?.usdt_rate)}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        }
                        <Divider />
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "1rem" }}>
                            <Button
                                variant="outlined"
                                data-testid="close-button"
                                children={t("button.close")}
                                onClick={handleCloseAddModal}
                            />
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Modal>
    );
}

Component.displayName = 'PreviewDirectApiModal';

const stylePaperModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "838px",
    height: "auto",
    maxHeight: "calc(100vh - 20px)",
    overflowY: "auto",
    p: "1.5rem"
};