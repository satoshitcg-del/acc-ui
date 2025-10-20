import { formatNumber } from "@/core/utils";
import Loading from "@/layout/components/loading/Loading";
import ModalCustom from "@/layout/components/modal/Modal";
import { Backdrop, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { t } from "i18next";
import React, { useEffect } from "react";


export default function Component(props: any) {
    const { openModal, setOpenModal, date, currencyRate, formatDate } = props
    const [backDrop, setBackDrop] = React.useState(false);

    useEffect(() => {
        if (openModal) {
            setBackDrop(true)
            const currencyList = ["THB", "VND", "IDR", "PHP", "MYR", "MMK"]
            currencyRate.rate.sort((a: any, b: any) => {
                const indexA = currencyList.indexOf(a.currency_name);
                const indexB = currencyList.indexOf(b.currency_name);

                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return a.currency_name.localeCompare(b.currency_name);
            });
            setTimeout(() => {
                setBackDrop(false)
            }, 200)
        }
    }
        , [openModal, currencyRate])

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    return (
        <ModalCustom
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={backDrop}>
                    <Loading />
                </Backdrop>
                <Box sx={{ maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", mb: "0.5rem" }}>
                        <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>
                            {t("title.exchange-rate")}
                        </Typography>
                        <Typography variant='body1' sx={{ color: "modal.title_color", fontWeight: "500", paddingTop: "5px" }}>
                            {currencyRate?.sync_date}
                        </Typography>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">{t('table.number')}</TableCell>
                                    <TableCell align="right">{t('table.currency')}</TableCell>
                                    <TableCell align="right">{t('table.rate')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currencyRate.rate.map((currency: any, index: number) => (
                                    <TableRow
                                        key={`Currency ${currency.currency_id}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell align="right">{currency.currency_name}</TableCell>
                                        <TableCell align="right">{formatNumber(currency.currency_rate)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", mt: "0.5rem" }}>
                    <Button
                        data-testid="global-exchangerate-close-button"
                        variant="text"
                        children={t("button.close")}
                        onClick={handleCloseModal}
                    />
                </Box>
            </>
        </ModalCustom>
    )
}
Component.displayName = "ExchangeRateModal";