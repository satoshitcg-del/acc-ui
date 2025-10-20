import { ExpandableTableRow } from '@/routes/product-management/components/ExpandableTableRow'
import { TableRowNotLine } from '@/routes/product-management/style/stylemui'
import { Modal, Box, Typography, Button, TableBody, TableCell, Table, Tooltip, TableContainer, Divider, withStyles } from '@mui/material'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'

import dayjs from 'dayjs'
// service
import BillingService from '@/services/BillingService'
import { useTranslation } from 'react-i18next'
import parse from "html-react-parser";
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode'
import { BoxShadowButton } from '@/core/constant'
import IconTableSvg from '@/assets/svg/TableSvg'
import { replaceHttpsLinkNote, truncateText } from '@/core/utils'
import { useAlertDialog } from '../alert-dialog/useAlertDialog'

interface ModalProps {
    openModal: boolean
    closeModal: () => void
    data: any
}

export default function BillingNoteModal(props: ModalProps) {
    const { updateNote } = BillingService();
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const { openModal, closeModal, data } = props

    const [loading, setLoading] = useState(false);

    const handleSave = async (obj: any) => {
        try {
            setLoading(true)
            const body = {
                invoice_id: data.invoice_id,
                note: obj.note || ""
            }
            const response = await updateNote(body)
            alertSuccess(TranslateErrorCode(response.code));
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setLoading(false)
            closeModal()
        }
    }

    const { register, handleSubmit, watch, setValue, } = useForm({})
    const editorContent = watch("note");

    useEffect(() => {
        register("note");
    }, [register])

    const onEditorStateChange = (editorState: string) => {
        setValue("note", editorState);
    };

    return (
        <Modal
            open={openModal}
            onClose={closeModal}
            disableScrollLock
        >
            <Box sx={style}>
                <form onSubmit={handleSubmit(handleSave)}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" component="h2" sx={{ py: 2 }}>{t('billing.header-note')}</Typography>
                        <Box sx={{ minHeight: "10rem" }}>
                            <ReactQuill
                                data-testid="billingnote-billingnotemodal-notes-reactquill"
                                style={{ height: "6.5rem" }}
                                theme='snow'
                                value={editorContent}
                                onChange={onEditorStateChange}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body1" component="h2" sx={{ pt: 2, pb: 1, pl: 2 }}>{t('billing.note-history')}</Typography>
                        </Box>
                        {
                            data?.history?.length == 0 ? (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", color: 'content.text.disabled', marginTop: 3 }}>
                                    <IconTableSvg sx={{ width: "7rem", height: "auto" }} icon='empty' />
                                    <Typography sx={{ marginTop: 1 }} variant="h6">
                                        {t("table.empty-table")}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <Divider orientation="horizontal" variant="fullWidth" />
                                    <TableContainer sx={{ overflow: "auto", maxHeight: "45dvh" }} >
                                        <Table size="small">
                                            <TableBody>
                                                {data?.history.map((row: any, index: number) => {
                                                    return (
                                                        <ExpandableTableRow key={`ExpandableTable ${index}`}
                                                            firstTableCell={row.date ? dayjs(row.date).format('DD MMM YYYY') : ""}
                                                            expandComponent={
                                                                row.invoice_notes?.map((list: any, index: number) => {
                                                                    return (
                                                                        <TableRowNotLine key={`rowProduct-${index}`} sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
                                                                            <TableCell align="left">
                                                                                {""}
                                                                            </TableCell>
                                                                            <TableCell sx={{ opacity: 0.6, verticalAlign: "top", paddingTop: "10px" }}>{list.created_at ? dayjs(list.created_at).format('HH:mm') : "-"}</TableCell>
                                                                            <TableCell align="left" sx={{ maxWidth: "300px", wordWrap: "break-word", whiteSpace: "normal", paddingTop: "0px" }}>
                                                                                <Typography variant="body2" sx={{ wordWrap: "break-word", whiteSpace: "normal" }}>
                                                                                    {parse(replaceHttpsLinkNote(list.note))}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell sx={{ opacity: 0.6, verticalAlign: "top", paddingTop: "10px" }} align="left">{list.operated_by}</TableCell>
                                                                        </TableRowNotLine>
                                                                    )
                                                                })
                                                            }
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {t('billing.time')}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" align="center" >
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
                                </Box>
                            )
                        }

                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", mb: 2 }}>
                        <Box>
                            <Button data-testid="billingnote-billingnotemodal-cancel-button" onClick={closeModal} children={t('billing.cancel')} sx={{ fontWeight: 500, letterSpacing: "0.4px" }} />
                            <Button data-testid="billingnote-billingnotemodal-save-button" disabled={loading} type='submit' children={t('billing.save')} sx={{ fontWeight: 500, letterSpacing: "0.4px" }} />
                        </Box>
                    </Box>
                </form >
            </Box >
        </Modal >
    )
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 883,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 3,
};
