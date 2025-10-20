import { Line } from '@/assets/svg/Line'
import { Phone } from '@/assets/svg/Phone'
import { Telegram } from '@/assets/svg/Telegram'
import { MailOutline } from '@mui/icons-material'
import { Modal, Box, Typography, Avatar, Divider, Button, Alert, IconButton, Tooltip } from '@mui/material'
import { useCopyToClipboard } from 'usehooks-ts'
import React from 'react'



interface ModalProps {
    openModal: boolean
    closeModal: () => void
    data: any
}

const MOCK_DATA = {
    phone: "1",
    line: "r",
    telegram: "",
}

export default function BillingCustomerModal(props: ModalProps) {
    const { openModal, closeModal, data } = props

    const [copyMessage, setCopyMessage] = React.useState<string>("copy")

    const [value, copy] = useCopyToClipboard()

    const firstLetter: string = data.username.charAt(0).toUpperCase();

    const testMouse = () => {
        setCopyMessage("")
    }

    return (
        <Modal
            open={openModal}
            onClose={closeModal}
        >
            <Box sx={style}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar sx={{ width: "77px", height: "77px" }}>{firstLetter}</Avatar>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
                        <Typography variant="h6" component="h2">
                            {data.name}
                        </Typography>
                        <Typography>
                            {data.name}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <MailOutline />
                            <Typography sx={{ marginLeft: 1 }}>{data.username}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", my: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mx: 1 }}>
                            <Typography>{100.00}</Typography>
                            <Typography className="text-xs font-normal">Total credit (USDT)</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mx: 1 }}>
                            <Typography>{10000.00}</Typography>
                            <Typography className="text-xs font-normal">Total credit (THB)</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mx: 1 }}>
                            <Typography>{100.00}</Typography>
                            <Typography className="text-xs font-normal">Deposit (THB)</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", mb: 3 }}>
                        <Tooltip title={`${MOCK_DATA.phone} ${copyMessage}`} onMouseLeave={testMouse}>
                            <IconButton disabled={!MOCK_DATA.phone} onClick={() => copy(MOCK_DATA.phone)}>
                                <Phone status={!!MOCK_DATA.phone} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={MOCK_DATA.line}>
                            <IconButton disabled={!MOCK_DATA.line}>
                                <Line status={!!MOCK_DATA.line} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={MOCK_DATA.telegram}>
                            <IconButton disabled={!MOCK_DATA.telegram}>
                                <Telegram status={!!MOCK_DATA.telegram} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Alert severity="info" sx={{ width: "100%" }}>This is an info alert — check it out!</Alert>
                </Box>
                <Divider orientation="horizontal" variant="fullWidth" />
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", my: 1 }}>
                    <Button onClick={closeModal}>Close</Button>
                </Box>
            </Box>
        </Modal >
    )
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 4,
    pt: 4,
};
