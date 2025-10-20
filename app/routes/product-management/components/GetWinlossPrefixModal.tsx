import { Box, Button, CircularProgress, Divider, IconButton, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import { t } from "i18next";
import IconTableSvg from "@/assets/svg/TableSvg";
import dayjs from "dayjs";
import { formatDate } from "@/core/dateUtils";
import { useState } from "react";
import ProductManagementService from "@/services/ProductManagementService";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { useTranslateErrorCode } from "../hooks/useErrorCode";
import { StatusCode } from "@/core/enum";
import { IProductManagementListReq } from "@/core/interface/services";

export default function Component(props: any) {
    const { openGetWinloss, setOpenGetWinloss, products, wlDate, setTriggerTable, triggerTable } = props;
    const { confirmWinLose, getProductManagementList } = ProductManagementService();
    const { alertError, alertSuccess } = useAlertDialog();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const [prefixes, setPrefixes] = useState(products?.diffPrefixName)

    const handleCloseModal = () => {
        setOpenGetWinloss(false);
    };

    const [loadingRows, setLoadingRows] = useState<Record<string, boolean>>({});
    const handleGetWinLoseByPrefix = async (prefix: string) => {
        try {
            setLoadingRows((prev) => ({ ...prev, [prefix]: true }));
            const body = {
                product_id: products?.product_id,
                month: wlDate?.month,
                year: wlDate?.year,
                prefix: prefix,
            }
            const res = await confirmWinLose(body);
            if (res?.code === StatusCode.success) {
                setTimeout(async () => {
                    const response = await fetchProductManagement({
                        productName: "",
                        month: wlDate?.month,
                        year: wlDate?.year,
                    });

                    setPrefixes(response?.product?.find((pd: any) => pd.product_id == products?.product_id)?.diffPrefixName)
                    setTriggerTable(!triggerTable)
                    setLoadingRows((prev) => ({ ...prev, [prefix]: false }));
                }, 1000);
            }
        } catch (error: any) {
            setLoadingRows((prev) => ({ ...prev, [prefix]: false }));
            alertError(TranslateErrorCode(error?.response?.data?.code));
        }
    };

    const fetchProductManagement = async ({ productName, month, year, start = 0, end = 7 }: IProductManagementListReq) => {
        try {
            const res: any = await getProductManagementList({ productName, month, year, start, end });
            return res?.data[0]
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    }
    return (
        <Modal
            open={openGetWinloss}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
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
                    width: "876px",
                    minHeight: "400px",
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography id="modal-title" variant="h6">
                        {t('modal.operation-result')}
                    </Typography>
                    <IconButton onClick={handleCloseModal} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ my: 2 }} />
                {(prefixes?.length === 0 || !prefixes) && (
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
                )}
                {prefixes?.length > 0 && (
                    <Box sx={{
                        maxHeight: "80vh",
                        display: "flex",
                        flexDirection: "column",
                        overflowY: 'auto',
                    }}>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', color: 'error.main', mb: 1 }}>
                            <ErrorOutlineIcon sx={{ mr: 1 }} />
                            {t('modal.failure')} ({prefixes?.length})
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ minWidth: "80px" }} align="center">{t('table.prefix-name')}</TableCell>
                                    <TableCell sx={{ minWidth: "220px" }} align="center">{t('table.reason')}</TableCell>
                                    <TableCell sx={{ minWidth: "120px" }} align="center">{t('table.time')}</TableCell>
                                    <TableCell sx={{ minWidth: "220px" }} align="center">{t('table.log')}</TableCell>
                                    <TableCell sx={{ minWidth: "160px" }} align="center">{t('table.action')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prefixes?.map((prefix: any, index: number) => (
                                    <TableRow
                                        key={`prefix ${prefix.prefix_name}`}
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
                                        <TableCell>{prefix?.prefix_name}</TableCell>
                                        <TableCell>{prefix?.message}</TableCell>
                                        <TableCell align={prefix?.latest_date ? 'right' : 'center'}>{formatDate(prefix?.latest_date)}</TableCell>
                                        <TableCell>{prefix?.system_message}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                onClick={() => handleGetWinLoseByPrefix(prefix?.prefix_name)}
                                                variant="contained"
                                                sx={{ bgcolor: "button.bg.success" }}
                                            >
                                                <Box className="flex justify-center items-center gap-2">
                                                    {t("button.get-win-lose")}
                                                    {loadingRows[prefix?.prefix_name] && (
                                                        <CircularProgress size={"1rem"} color="inherit" />
                                                    )}
                                                </Box>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}
Component.displayName = "GetWinlossPrefixModal";
