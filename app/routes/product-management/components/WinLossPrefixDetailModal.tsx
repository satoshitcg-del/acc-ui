import ModalCustom from "@/layout/components/modal/Modal";
import theme from "@/routes/customers/components/sub-product-into-customer/theme";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";

export default function Component(props: any) {
    const { openPrefixDetail, setOpenPrefixDetail, prefixDetail, prefixSuccessDetail } = props

    const handleCloseModal = () => {
        setOpenPrefixDetail(false)
    }

    const [openLog, setOpenLog] = useState(false)
    const [viewLogValue, setViewLogValue] = useState('')
    const handleOpenViewLog = (prefix: string) => {
        setOpenLog(true)
        setViewLogValue(prefix)

    }
    const handleCloseViewLog = (prefix: string) => {
        setOpenLog(false)
        setViewLogValue('')

    }
    return (
        <Modal
            open={openPrefixDetail}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableScrollLock
        >
            <Box sx={style}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", mb: "1rem" }}>
                    <span />
                    <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>
                        {t("title.exchange-rate")}
                    </Typography>
                    <Typography variant='body1' sx={{ color: "modal.title_color", fontWeight: "500", paddingTop: "5px" }}>
                        {`${prefixSuccessDetail.length}/${prefixDetail.length}`}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", mb: "1rem" }}>
                    <Button
                        data-testid="export-button"
                        variant="contained"
                        color="primary"
                        children={t("button.export")}
                    />
                </Box>
                <TableContainer
                    component={Paper}
                    sx={{
                        maxHeight: "60vh", // ตั้งค่าความสูงของ TableContainer
                        overflowY: "auto", // ให้มี scrollbar ถ้าตารางเกินความสูงที่กำหนด
                    }}
                >
                    <Table sx={{ minWidth: 500 }} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                                <TableCell align="center">{t('table.status')}</TableCell>
                                <TableCell align="right">{t('table.product-name')}</TableCell>
                                <TableCell align="right">{t('table.prefix-name')}</TableCell>
                                <TableCell align="right">{t('table.agent-id')}</TableCell>
                                <TableCell align="right">{t('table.client-name')}</TableCell>
                                <TableCell align="right">{t('table.error-description')}</TableCell>
                                <TableCell align="right">{t('table.log')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {prefixDetail.map((prefix: any, index: number) => (
                                <TableRow
                                    key={`prefix ${prefix}`}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:nth-of-type(even)': { backgroundColor: "#f5f5f5" }, // ทำให้แถวสลับสี
                                    }}
                                >
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="right">{prefix}</TableCell>
                                    <TableCell align="right">{prefix}</TableCell>
                                    <TableCell align="right">{prefix}</TableCell>
                                    <TableCell align="right">{prefix}</TableCell>
                                    <TableCell align="right">{prefix}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            children={t('button.view-log')}
                                            onClick={() => handleOpenViewLog(prefix)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", mt: "1rem" }}>
                    <Button
                        data-testid="global-exchangerate-close-button"
                        variant="text"
                        children={t("button.close")}
                        onClick={handleCloseModal}
                        sx={{ color: "modal.close_button_color" }} // ปรับสีของปุ่ม
                    />
                </Box>
                <Modal
                    open={openLog}
                    onClose={handleCloseViewLog}
                    aria-labelledby="modal-view-title"
                    aria-describedby="modal-view-description"
                >
                    <Box
                        sx={{
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            borderRadius: '8px',
                            boxShadow: 24,
                            maxHeight: "80vh",
                            width: "40rem",
                            height: "auto",
                            p: "1.5rem",
                            pt: "2.5rem"
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "row", mb: "1rem" }}>
                            <span />
                            <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>
                                {t("title.log-detail")}
                            </Typography>
                        </Box>
                        {viewLogValue}
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", mt: "1rem" }}>
                            <Button
                                data-testid="global-exchangerate-close-button"
                                variant="text"
                                children={t("button.close")}
                                onClick={handleCloseModal}
                                sx={{ color: "modal.close_button_color" }} // ปรับสีของปุ่ม
                            />
                        </Box>
                    </Box>
                </Modal >
            </Box>
        </Modal >
    )
}
Component.displayName = "WinLossPrefixDetailModal";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    width: "80rem",
    // minWidth: "37.5rem",
    // maxWidth: "60dvw",
    height: "auto",
    // overFlow: "auto",
    p: "1.5rem",
    pt: "2.5rem"
};