import { Box, Button, CircularProgress, Divider, IconButton, InputAdornment, Modal, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import { t } from "i18next";
import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { formatDate } from "@/core/dateUtils";
import IconTableSvg from "@/assets/svg/TableSvg";
import { NumericFormat } from "react-number-format";
import { StatusCode } from "@/core/enum";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { useTranslateErrorCode } from "../hooks/useErrorCode";
import ProductManagementService from "@/services/ProductManagementService";
import Loading from "@/layout/components/loading/Loading";
import { useTheme } from "@/theme";

export default function Component(props: any) {
    const { open, setOpen, autoPlayProducts, setTriggerTable, triggerTable } = props
    const { alertError, alertSuccess } = useAlertDialog();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { getAutoPlayPrefix, createAutoPlayWinLose, getAutoPlayWinlose } = ProductManagementService();
    const theme = useTheme();

    // Tabs Controller
    const [tab, setTab] = useState(autoPlayProducts?.products[0]?.name);
    const [prefixList, setprefixList] = useState<any>();
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    // Submit Modal
    const onSubmitModal = async () => {
        try {
            const body = {
                records: inputValues,
            }
            const res = await createAutoPlayWinLose(body)
            alertSuccess(TranslateErrorCode(res?.code));
            setOpen(false);
        } catch (error: any) {
            console.log("error fetchingPrefixList :", error);
            alertError(TranslateErrorCode(error?.response?.data?.code));
        } finally {
            setTriggerTable(!triggerTable)
        }
    };

    // Fetching Prfix list
    const [inputValues, setInputValues] = useState<{ prefix: string; winlose: number }[]>([]);
    const [fetchLoading, setFetchLoading] = useState(false)
    const fetchingPrefixList = async () => {
        try {
            setprefixList([]);
            setFetchLoading(true)
            const res = await getAutoPlayPrefix(tab, autoPlayProducts?.month, autoPlayProducts?.year);
            if (res?.code === StatusCode.success) {
                const defaults = res?.data?.map((prefix: any) => ({
                    prefix: prefix.prefix,
                    winlose: prefix.winlose ?? 0,
                    product_type_id: prefix.product_type_id,
                    month: prefix.month,
                    year: prefix.year,
                }));
                setInputValues(defaults);
                setprefixList(res?.data);
            }
        } catch (error: any) {
            console.log("error fetchingPrefixList :", error);
            alertError(TranslateErrorCode(error?.response?.data?.code));
        } finally {
            setFetchLoading(false)
        }
    };

    // Input Winlose
    const handleChangeWinlose = (index: number, winlose: number) => {
        setInputValues((prevValues) => {
            const updated = [...prevValues];
            updated[index] = { ...updated[index], winlose };
            return updated;
        });
    };

    // Get Winlose by Prefix
    const [loadingRows, setLoadingRows] = useState<Record<string, boolean>>({});
    const handleGetAutoPlayWinLoseByPrefix = async (prefix: string) => {
        try {
            console.log("CHECK DATA CONFIRM GET WINLOSE:", prefix, tab);
            setLoadingRows((prev) => ({ ...prev, [prefix]: true }));
            const res = await getAutoPlayWinlose(autoPlayProducts?.month, autoPlayProducts?.year, prefix);
            if (res.code === StatusCode.success) {
                setTimeout(async () => {
                    setLoadingRows((prev) => ({ ...prev, [prefix]: false }));
                }, 1000);
            }
        } catch (error: any) {
            setLoadingRows((prev) => ({ ...prev, [prefix]: false }));
            alertError(TranslateErrorCode(error?.response?.data?.code));
        } finally {
            fetchingPrefixList();
        }
    };

    React.useEffect(() => {
        fetchingPrefixList();
    }, [tab]);

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableScrollLock
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    width: "976px",
                    maxHeight: "100vh",
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography id="modal-title" variant="h6">
                        {t('modal.operation-result')}
                    </Typography>
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Tabs value={tab} onChange={handleChangeTab} sx={{ borderTopRightRadius: 2 }}>
                    {autoPlayProducts?.products.map((product: any, idx: number) => (
                        <Tab
                            key={product?.name}
                            value={product?.name}
                            label={`${product?.name}`}
                            sx={{
                                borderTopLeftRadius: idx === 0 ? 8 : 0,
                                borderTopRightRadius: idx === autoPlayProducts?.products.length - 1 ? 8 : 0,
                                bgcolor: theme.palette.example.inherit,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                },
                            }}
                        />
                    ))}
                </Tabs>
                {(prefixList?.length === 0 || !prefixList) && (
                    fetchLoading ? (
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "calc(80vh - 400px)",
                            width: "100%",
                            textAlign: "center",
                        }} >
                            <Loading />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "calc(80vh - 400px)",
                                width: "100%",
                                textAlign: "center",
                            }}
                        >
                            <IconTableSvg icon="empty" />
                            <Typography variant="h6" sx={{ mt: 3 }}>
                                {t("table.no-information")}
                            </Typography>
                        </Box>

                    )
                )}
                {prefixList?.length > 0 && (
                    <>
                        <Box sx={{
                            maxHeight: "70vh",
                            display: "flex",
                            flexDirection: "column",
                            overflowY: 'auto',
                        }}>

                            {/* <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', color: 'error.main', mb: 1 }}>
                                <ErrorOutlineIcon sx={{ mr: 1 }} />
                                {t('modal.failure')} ({prefixList?.length})
                            </Typography> */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: "80px" }} align="center">{t('table.prefix-name')}</TableCell>
                                        <TableCell sx={{ minWidth: "220px" }} align="center">{t('table.reason')}</TableCell>
                                        <TableCell sx={{ minWidth: "120px" }} align="center">{t('table.time')}</TableCell>
                                        {/* <TableCell sx={{ minWidth: "120px" }} align="center">{prefixList?.some((prefix: any) => prefix?.isSetWinlose) ? t('table.create-by') : t('table.log')}</TableCell> */}
                                        <TableCell sx={{ minWidth: "120px" }} align="center">{(tab == "XO" || tab == "JOKER") ? t('table.create-by') : t('table.log')}</TableCell>
                                        <TableCell sx={{ minWidth: "160px" }} align="center">{t('table.action')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prefixList?.map((prefix: any, index: number) => (
                                        <TableRow
                                            key={`prefix ${prefix.prefix}-$${index}`}
                                            sx={(theme) => ({
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '&:nth-of-type(even)': {
                                                    backgroundColor:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.action.hover
                                                            : '#f5f5f5',
                                                },
                                            })}
                                        >
                                            <TableCell>{prefix?.prefix}</TableCell>
                                            <TableCell>{prefix?.message}</TableCell>
                                            <TableCell align={prefix?.updated_at ? 'right' : 'center'}>{formatDate(prefix?.updated_at)}</TableCell>
                                            <TableCell align={'center'}>{prefixList?.some((prefix: any) => prefix?.is_set_winlose) ? prefix?.created_by : prefix?.system_message}</TableCell>
                                            <TableCell align="center">
                                                {prefix?.is_set_winlose ? (
                                                    <NumericFormat
                                                        key={`${prefix?.product}-${prefix?.prefix}-${index}`}
                                                        label={t("placeholder.amount")}
                                                        data-testid="verify-payment-amount"
                                                        id="amount"
                                                        size='small'
                                                        value={inputValues[index]?.winlose ?? 0}
                                                        inputProps={{
                                                            maxLength: 19,
                                                            sx: { width: "140px" },
                                                        }}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="end">THB</InputAdornment>,
                                                        }}
                                                        thousandSeparator
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                        allowLeadingZeros={true}
                                                        // allowNegative={false}
                                                        customInput={TextField}
                                                        onValueChange={(values) => {
                                                            const { value } = values;
                                                            handleChangeWinlose(index, value ? parseFloat(value) : 0)
                                                        }}
                                                    />
                                                ) : (
                                                    <Button
                                                        onClick={() => handleGetAutoPlayWinLoseByPrefix(prefix?.prefix)}
                                                        variant="contained"
                                                        sx={{ bgcolor: "button.bg.success" }}
                                                    >
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                            {t("button.get-win-lose")}
                                                            {loadingRows[prefix?.prefix] && (
                                                                <CircularProgress size="1rem" color="inherit" sx={{ display: "flex" }} />
                                                            )}
                                                        </Box>
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                        {prefixList?.some((prefix: any) => prefix?.is_set_winlose) &&
                            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", mt: 2 }} >
                                <Button data-testid="customer-addcustomerproducts-cancel-button" onClick={() => setOpen(false)} variant='text'>{t("button.cancel")}</Button>
                                <Button data-testid="customer-addcustomerproducts-save-button" variant='text' type='submit' onClick={() => onSubmitModal()} >{t("button.save")}</Button>
                            </Box>
                        }
                    </>
                )}
            </Box>
        </Modal >
    )
}
Component.displayName = "AutoPlayPrefixModal";