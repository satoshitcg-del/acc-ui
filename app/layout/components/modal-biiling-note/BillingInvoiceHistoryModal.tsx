import { ExpandableTableRow } from '@/routes/product-management/components/ExpandableTableRow'
import { TableRowNotLine } from '@/routes/product-management/style/stylemui'
import { Modal, Box, Typography, Button, Alert, Table, TableBody, TableCell, TableContainer, Chip, Tooltip, Stack, IconButton, Paper, styled } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { chipCategoryForHistory } from './BillingNoteData'
import dayjs from 'dayjs'

import { useTranslation } from 'react-i18next';
import parse from "html-react-parser";
import numeral from 'numeral'
import IconTableSvg from '@/assets/svg/TableSvg'
import { replaceHttpsLinkNote, truncateText } from '@/core/utils'
import { BILLING_STATUS, BILLING_TYPE, StatusCode } from '@/core/enum'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { MAX_FILE_SIZE_3MB } from '@/core/utils/fileValidation'
import { IPaymentUploadResponse } from '@/core/interface/services'
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode'
import InvoiceService from '@/services/InvoiceService'
import { useAlertDialog } from '../alert-dialog/useAlertDialog'
import BillingService from '@/services/BillingService'

const Input = styled('input')({
    display: 'none',
});
interface ModalProps {
    openModal: boolean
    closeModal: () => void
    data: any
    type?: string
    wallet?: string
    walletNo?: string
    status?: string
    imagePayment?: any
}

export default function BillingInvoiceHistoryModal(props: ModalProps) {
    const { t } = useTranslation()
    const { getPaymentImageUpload } = BillingService();
    const { updateQrPayment, createPaymentUpload, deletePaymentUpload } = InvoiceService()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();
    const { openModal, closeModal, data, type, wallet, walletNo, status, imagePayment } = props
    const [fileName, setFileName] = useState<string>("")
    const [paymentImage, setPaymentImage] = useState<string>(imagePayment || "")
    const handleDeletePaymentImage = async () => {
        try {
            const file = data?.file_name ? data?.file_name : fileName
            const res = await deletePaymentUpload(file)
            if (res) {
                setPaymentImage("")
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        }
    }
    const handlePaymentImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            if (event.target.files && event.target.files.length > 1) {
                alertError(t('error.upload-failed'), t('error.allowed-a-file'));
                return;
            }
            const file = event.target.files && event.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (file && allowedTypes.includes(file.type) && file.size <= MAX_FILE_SIZE_3MB) {
                const fileCreate = await handleCreateFileUpload(file);
                if (fileCreate) {
                    const res: any = await updateQrPayment(fileCreate, data?.invoice_id);
                    if (res?.code === StatusCode.success) {
                        const response = await getPaymentImageUpload(res?.data?.file_name)
                        setFileName(res?.data?.file_name)
                        setPaymentImage(response || "")
                    }
                } else {
                    alertError(t('error.upload-failed'), t('error.try-again-later'));
                }

            } else {
                alertError(t('error.upload-failed'), t('error.file-over-size'));
            }

        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        }

    };

    const handleCreateFileUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res: any = await createPaymentUpload(formData, (progress) => {
                // setUploadProgress(progress);
            });
            if (res) {
                const mappedFiles: IPaymentUploadResponse = {
                    full_path: res?.data?.full_path,
                    file_path: res?.data?.file_path,
                    file_name: res?.data?.file_name,
                    file_ext: res?.data?.file_ext,
                    created_at: res?.data?.created_at,
                    updated_at: res?.data?.updated_at,
                    file_name_preview: file.name,
                    file_size: file.size,
                }
                return mappedFiles;
            } else {
                alertError(t('error.upload-failed'), t('error.try-again-later'));
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        }
    }

    return (
        <Modal
            open={openModal}
            onClose={closeModal}
            disableScrollLock
        >
            <Box sx={style}>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ py: 2 }}>{t('billing.header-history')}</Typography>
                </Box>
                <Box sx={{ px: 3, pb: 2 }}>
                    <Alert icon={false} severity="warning" sx={{ p: 2, width: '100%', position: 'relative' }}>
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body1">{t("billing.invoice-no")}</Typography>
                                <Typography variant="body1" color="primary">
                                    {data.invoice_no || "-"}
                                </Typography>
                                <Typography variant="body1">
                                    {`${t("billing.for")} ${data.username}`}
                                </Typography>
                            </Stack>
                            {type !== BILLING_TYPE.DIRECT_API &&
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body1">{t("modal.payment")}</Typography>
                                    {type === BILLING_TYPE.ONE_TIME_BILLING
                                        ? <Typography color="#2196F3">{wallet && walletNo ? `${wallet} : ${walletNo}` : "-"}</Typography>
                                        : <Typography color="#2196F3">{`${data.network || '-'} : ${data.crypto_address || '-'}`}</Typography>
                                    }
                                </Stack>
                            }
                            {type !== BILLING_TYPE.DIRECT_API && type !== BILLING_TYPE.ONE_TIME_BILLING &&
                                <>
                                    {paymentImage ? (
                                        <Box sx={{ position: "absolute", top: -2, right: 8 }}>
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    width: "76px",
                                                    '&:hover .delete-icon': {
                                                        opacity: 1,
                                                    },
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={paymentImage}
                                                    sx={{
                                                        width: "76px",
                                                        height: "82px",
                                                        borderRadius: 2,
                                                        display: 'content',
                                                        objectFit: 'contain',
                                                        border: '2px solid gray',
                                                    }}
                                                    alt="QR Code"
                                                />

                                                <IconButton
                                                    className="delete-icon"
                                                    disabled={!(status === BILLING_STATUS.DELIVERED || status === BILLING_STATUS.OVERDUE)}
                                                    onClick={() => handleDeletePaymentImage()}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 25,
                                                        right: 20,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s',
                                                        zIndex: 1,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                        },
                                                    }}
                                                    size="small"
                                                >
                                                    <DeleteIcon fontSize="small" sx={{ color: 'black' }} />
                                                </IconButton>
                                            </Box>

                                            <Typography align='center' sx={{ maxWidth: "76px", fontSize: '10px', paddingBottom: 3 }} >
                                                QR Code
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box sx={{ position: "absolute", top: -2, right: 8 }}>

                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    width: "76px",
                                                }}
                                            >
                                                <Paper
                                                    elevation={3}
                                                    sx={{
                                                        width: "76px",
                                                        height: "82px",
                                                        p: 1,
                                                        border: '2px dashed gray',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: 2,
                                                    }}
                                                    onDragOver={(e) => e.preventDefault()}
                                                >
                                                    <label htmlFor="icon-button-file">
                                                        <Input
                                                            accept=".jpg, .jpeg, .png"
                                                            id="icon-button-file"
                                                            type="file"
                                                            onChange={handlePaymentImageChange}
                                                            disabled={!(status === BILLING_STATUS.DELIVERED || status === BILLING_STATUS.OVERDUE)}

                                                        />
                                                        <IconButton color="primary" aria-label="upload picture" component="span" disabled={!(status === BILLING_STATUS.DELIVERED || status === BILLING_STATUS.OVERDUE)}>
                                                            <AddIcon fontSize='small' />
                                                        </IconButton>
                                                    </label>
                                                    <Typography variant="body2" align="center" sx={{ fontSize: '10px' }} color="text.secondary">
                                                        {t('modal.upload')}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                            <Typography align='center' sx={{ maxWidth: "76px", fontSize: '10px', paddingY: 0.65 }} >
                                                QR Code
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            }

                        </Stack>
                    </Alert>
                </Box>
                {type !== BILLING_TYPE.DIRECT_API &&
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', mx: 3, gap: 1 }}>
                        <Typography variant="body1">{t('billing.billing-credit')} :</Typography>
                        <Typography variant="body1">{data?.received_credit}</Typography>
                        <Typography variant="body1">USDT</Typography>
                    </Box>
                }
                <Box sx={{ p: 3 }}>
                    {
                        data?.history?.length == 0 ?
                            (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", color: 'content.text.disabled' }}>
                                    <IconTableSvg sx={{ width: "7rem", height: "auto" }} icon='empty' />
                                    <Typography sx={{ marginTop: 1 }} variant="h6">
                                        {t("table.empty-table")}
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer sx={{ overflow: "auto", maxHeight: "55dvh" }} >
                                    <Table size="small">
                                        <TableBody>
                                            {
                                                data?.history?.map((row: any, index: number) => {
                                                    return (
                                                        <ExpandableTableRow key={`ExpandableTable ${index}`}
                                                            firstTableCell={row.date ? dayjs(row.date).format('DD MMM YYYY') : ""}
                                                            expandComponent={
                                                                row.invoice_status_logs?.map((list: any, index: number) => {
                                                                    return (
                                                                        <TableRowNotLine key={`rowProduct-${index}`} sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }} >
                                                                            <TableCell align="left" sx={{ verticalAlign: "top", paddingTop: "10px", minWidth: "150px" }} >
                                                                                <Chip key={`status-${list.status}`} label={chipCategoryForHistory.find((item) => item.status === list.status)?.status} size="small" color="primary" style={{ backgroundColor: chipCategoryForHistory.filter((item) => item.status === list.status)[0]?.activeColor }} className="text-xs font-normal" />
                                                                            </TableCell>
                                                                            <TableCell sx={{ opacity: 0.6, verticalAlign: "top", paddingTop: "10px" }}>{list.created_at ? dayjs(list.created_at).format('HH:mm') : "-"}</TableCell>
                                                                            <TableCell sx={{ opacity: 0.6, textAlign: "center", verticalAlign: "top", paddingTop: "10px" }}>{`${list.payment_type}` || "-"}</TableCell>
                                                                            <TableCell sx={{ opacity: 0.6, textAlign: "end", verticalAlign: "top", paddingTop: "10px", minWidth: "100px" }}>{formatNumber(list.amount) || "-"}</TableCell>
                                                                            <TableCell sx={{ opacity: 0.6, textAlign: "center", verticalAlign: "top", paddingTop: "10px", minWidth: "75px" }}>{list.currency_name || "-"}</TableCell>
                                                                            <TableCell sx={{ opacity: 0.6, textAlign: "center", verticalAlign: "top", paddingTop: "10px" }}>{list.cause ? t(`billing.${list.cause}`) : "-"}</TableCell>
                                                                            <TableCell align="left" sx={{ maxWidth: "150px", wordWrap: "break-word", whiteSpace: "normal", paddingTop: "0px" }}>
                                                                                <Typography variant="body2" sx={{ wordWrap: "break-word", whiteSpace: "normal" }}>
                                                                                    {parse(replaceHttpsLinkNote(list.note))}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell sx={{ opacity: 0.6, verticalAlign: "top", paddingTop: "10px", minWidth: "120px" }} align="left">{list.operated_by}</TableCell>
                                                                        </TableRowNotLine>
                                                                    )
                                                                })
                                                            }
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {t('billing.time')}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ textAlign: "center" }}>
                                                                {t('billing.type')}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ textAlign: "center" }}>
                                                                {t('billing.amount')}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ textAlign: "center" }}>
                                                                {t('billing.currency')}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ textAlign: "center" }}>
                                                                {t('billing.cause')}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" sx={{ textAlign: "center" }}>
                                                                {t('billing.description')}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {t('billing.operate')}
                                                            </TableCell>
                                                        </ExpandableTableRow>

                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )
                    }
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", my: 1 }}>
                    <Box>
                        <Button data-testid="billingnote-billinginvoicehistorymodal-close-button" onClick={closeModal} sx={{ fontWeight: 500, letterSpacing: "0.4px" }}>{t('billing.close')}</Button>
                    </Box>
                </Box>
            </Box>
        </Modal >
    )
}

const formatNumber = (num: number | string) => {
    const myNum = numeral(Number(num))
    return myNum.format("0, 0.00")
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 903,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 3,
};
