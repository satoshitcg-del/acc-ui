import { Line } from '@/assets/svg/Line'
import { Phone } from '@/assets/svg/Phone'
import { Telegram } from '@/assets/svg/Telegram'
import { Modal, Box, Typography, Avatar, Divider, Button, IconButton, Tab, Tabs, useTheme, AppBar, SnackbarCloseReason, Snackbar, Alert } from '@mui/material'
import parse from "html-react-parser";
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { IconMenuSvg } from '@/assets/svg/IconMenuSvg'
import { replaceHttpsLinkNote } from '@/core/utils'
import { alpha } from "@mui/system";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { ContentCopy } from '@mui/icons-material';
import { useCopyToClipboard } from 'usehooks-ts';
interface ModalProps {
    openModal: boolean
    setOpenModal: any
    customerProfile: any
    profileType: string
}


export default function CustomerProfileModal(props: ModalProps) {
    const { t } = useTranslation();
    const { openModal, setOpenModal, customerProfile, profileType } = props
    const theme = useTheme();
    const [isShowPassWord, setIsShowPassWord] = useState<boolean>(false)
    const [tabs, setTabs] = useState(0);

    const firstLetter: string = customerProfile.username.charAt(0).toUpperCase();

    const handleCloseCustomer = () => setOpenModal(false);

    const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => setTabs(newValue);

    const [value, copy] = useCopyToClipboard()
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClickCopy = (str: string) => {
        copy(str)
        setOpenSnackbar(true);
    };

    const handleCloseCopy = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Modal
            open={openModal}
            onClose={handleCloseCustomer}
        >
            <Box sx={style}>
                <Box sx={{ display: "flex", backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.9), pt: 4, borderTopRightRadius: "18px", borderTopLeftRadius: "18px" }}>
                    <Box sx={{ width: "40%", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, py: 3 }}>
                        <Avatar sx={{ width: "99px", height: "99px", backgroundColor: "lightskyblue", color: "#2196F3", }}>
                            <Typography component="h2" sx={{ lineHeight: 'normal', fontSize: '3.5rem' }}>
                                {firstLetter}
                            </Typography>
                        </Avatar>
                        {customerProfile?.customer_product_list?.length > 0 ? (
                            <Typography variant="h6" component="h2">
                                {`${customerProfile?.customer_product_list?.length || ''} ${t('modal.product')}`}
                            </Typography>
                        ) : (
                            <Typography variant="h6" component="h2">
                                {t('modal.no-product')}
                            </Typography>
                        )
                        }
                    </Box>
                    <Box sx={{ width: "60%", display: "flex", flexDirection: "column", gap: 2, py: 2, pl: 1 }}>
                        <Typography variant="h6" component="h2"
                            sx={{
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                                paddingRight: "32px",
                                cursor: "pointer"
                            }}
                            onClick={() => handleClickCopy(customerProfile?.full_name)}
                        >
                            {customerProfile?.full_name}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <IconMenuSvg icon="login" />
                            <Typography variant="body1" sx={{ marginLeft: 2, cursor: "pointer" }} onClick={() => handleClickCopy(customerProfile?.username)}>{customerProfile?.username}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <IconMenuSvg icon="mail" />
                            <Typography variant="body1" sx={{
                                marginLeft: 2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                                paddingRight: "32px",
                                cursor: "pointer"
                            }}
                                onClick={() => handleClickCopy(customerProfile?.email)}
                            >
                                {customerProfile?.email}
                            </Typography>
                        </Box>
                        {customerProfile?.password &&
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", height: "24px" }}>
                                <IconMenuSvg icon="key" />
                                {isShowPassWord ? (
                                    <Typography variant="body1" sx={{ marginLeft: 2, minWidth: "100px", height: "24px", cursor: "pointer" }} onClick={() => handleClickCopy(customerProfile?.password)}>{isShowPassWord ? customerProfile.password : "*".repeat(customerProfile.password.length)}</Typography>
                                ) : (
                                    <Typography variant="body1" sx={{ height: "24px", marginLeft: 2, minWidth: "100px", fontSize: 22 }}>{"*".repeat(customerProfile?.password?.length)}</Typography>
                                )}
                                {!customerProfile?.is_set_password &&
                                    <IconButton color="primary" aria-label="directions" onClick={() => setIsShowPassWord(!isShowPassWord)}>
                                        <IconMenuSvg icon={isShowPassWord ? "visibility-off" : "visibility"} color="warning" />
                                    </IconButton>
                                }
                            </Box>
                        }
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <AccountBalanceIcon sx={{ color: "white" }} />
                                <Typography
                                    data-testid={`customerprofile-credit`}
                                    variant="body1"
                                    sx={{
                                        marginLeft: 2,
                                        maxWidth: "200px",
                                        height: "24px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}
                                >
                                    {formatNumber(customerProfile?.total_credit_usdt)}
                                </Typography>
                                <Typography
                                    data-testid="customerprofile-unit"
                                    variant='body2'
                                    align='center'
                                    sx={{
                                        marginLeft: 1,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        textAlign: "center",
                                        verticalAlign: "center",
                                    }}
                                >
                                    USDT
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ marginLeft: 5 }}>{t('modal.total-credit')}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    bgcolor: 'background.paper',
                    width: "100%",
                    height: "40vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}>
                    <AppBar position="static">
                        <Tabs
                            value={tabs}
                            onChange={handleChangeTabs}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label={t("modal.contact-tab")} {...a11yProps(0)} />
                            <Tab label={t("modal.product-tab")} {...a11yProps(1)} />
                            <Tab label={t("modal.administrator-tab")} {...a11yProps(2)} />
                            <Tab label={t("modal.note-tab")} {...a11yProps(3)} />
                        </Tabs>
                    </AppBar>
                    <Box sx={{
                        maxHeight: "calc(38vh)",
                        overflowY: "auto",
                    }}>
                        <TabPanel value={tabs} index={0} dir={theme.direction}>
                            <Divider sx={{ width: "100%", py: "1ch", mb: 1 }} textAlign="left">
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "left" }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{t('divider.information-contact')}</Typography>
                                </Box>
                            </Divider>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ml: 4 }}>
                                {customerProfile.phone_number &&
                                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                                        <Phone status={!!customerProfile.phone_number} />
                                        <Typography variant="body1" sx={{ color: "GrayText" }}>
                                            {`${customerProfile.dial_code || ""}${customerProfile.phone_number}`}
                                        </Typography>
                                        <IconButton sx={{ pl: 1 }} data-testid="globalcomponent-customerprofile-copypassword-button" onClick={() => handleClickCopy(`${customerProfile.dial_code}${customerProfile.phone_number}`)}>
                                            <ContentCopy color='primary' sx={{ width: "18px", height: "18px" }} />
                                        </IconButton>
                                    </Box>
                                }
                                {customerProfile.line_id &&
                                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                                        <Line status={!!customerProfile.line_id} />
                                        <Typography variant="body1" sx={{ color: "GrayText" }}>
                                            {customerProfile.line_id}
                                        </Typography>
                                        <IconButton sx={{ pl: 1 }} data-testid="globalcomponent-customerprofile-copypassword-button" onClick={() => handleClickCopy(customerProfile.line_id)}>
                                            <ContentCopy color='primary' sx={{ width: "18px", height: "18px" }} />
                                        </IconButton>
                                    </Box>
                                }
                                {customerProfile.telegram &&
                                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                                        <Telegram status={!!customerProfile.telegram} />
                                        <Typography variant="body1" sx={{ color: "GrayText" }}>
                                            {customerProfile.telegram}
                                        </Typography>
                                        <IconButton sx={{ pl: 1 }} data-testid="globalcomponent-customerprofile-copypassword-button" onClick={() => handleClickCopy(customerProfile.telegram)}>
                                            <ContentCopy color='primary' sx={{ width: "18px", height: "18px" }} />
                                        </IconButton>
                                    </Box>
                                }
                            </Box>
                            <Divider sx={{ width: "100%", py: "1ch", my: 1 }} textAlign="left">
                                <Typography sx={{ fontWeight: "bold" }}>{t('divider.information-contact')}</Typography>
                            </Divider>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ml: 4 }}>
                                {customerProfile.contact_name &&
                                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                                        <IconMenuSvg icon="account-circle" />
                                        <Typography variant="body1" sx={{ color: "GrayText" }}>
                                            {customerProfile.contact_name}
                                        </Typography>
                                        <IconButton sx={{ pl: 1 }} data-testid="globalcomponent-customerprofile-copypassword-button" onClick={() => handleClickCopy(customerProfile.contact_name)}>
                                            <ContentCopy color='primary' sx={{ width: "18px", height: "18px" }} />
                                        </IconButton>
                                    </Box>
                                }
                                {customerProfile.contact_telegram &&
                                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                                        <Telegram status={!!customerProfile.contact_telegram} />
                                        <Typography variant="body1" sx={{ color: "GrayText" }}>
                                            {customerProfile.contact_telegram}
                                        </Typography>
                                        <IconButton sx={{ pl: 1 }} data-testid="globalcomponent-customerprofile-copypassword-button" onClick={() => handleClickCopy(customerProfile.contact_telegram)}>
                                            <ContentCopy color='primary' sx={{ width: "18px", height: "18px" }} />
                                        </IconButton>
                                    </Box>
                                }
                            </Box>
                        </TabPanel>
                        <TabPanel value={tabs} index={1} dir={theme.direction}>
                            <Divider sx={{ width: "100%", py: "1ch" }} textAlign="left">
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "left" }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{t('modal.product-tab')}</Typography>
                                </Box>
                            </Divider>
                            <Box sx={{
                                paddingLeft: "1.5rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                maxHeight: "40vh",
                                overflowY: "auto"
                            }}>
                                {customerProfile?.customer_product_list?.map((product: any, index: number) => {
                                    return (
                                        <Box key={`${product}-${index}`} sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                                            <Typography variant="body1" sx={{ color: "GrayText" }}>
                                                {index + 1}. {product.product_name} / {product.prefix_name || '-'}
                                            </Typography>
                                        </Box>
                                    )
                                })
                                }
                            </Box>
                        </TabPanel>
                        <TabPanel value={tabs} index={2} dir={theme.direction}>
                            <Divider sx={{ width: "100%", py: "1ch" }} textAlign="left">
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "left" }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{t('modal.administrator-tab')}</Typography>
                                </Box>
                            </Divider>
                            <Box sx={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: 1 }}>
                                {customerProfile?.sale_owner?.map((sale: any, index: number) => {
                                    return (
                                        <Box key={`${sale}-${index}`} sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                                            <Typography variant="body1" sx={{ color: "GrayText" }}>
                                                {index + 1}. {sale.name}
                                            </Typography>
                                            <IconButton data-testid="globalcomponent-customerprofile-copypassword-button" onClick={() => handleClickCopy(sale.name)}>
                                                <ContentCopy color='primary' sx={{ width: "18px", height: "18px" }} />
                                            </IconButton>
                                        </Box>
                                    )
                                })
                                }
                            </Box>
                        </TabPanel>
                        <TabPanel value={tabs} index={3} dir={theme.direction}>
                            <Divider sx={{ width: "100%", py: "1ch" }} textAlign="left">
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "left" }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{t("modal.note-tab")}</Typography>
                                </Box>
                            </Divider>
                            <Box sx={{ paddingLeft: "1.5rem", mt: "-1rem" }}>
                                {parse(replaceHttpsLinkNote(customerProfile.note))}
                            </Box>
                        </TabPanel>
                    </Box>
                </Box>
                <Divider orientation="horizontal" variant="fullWidth" />
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 1 }}>
                    <Button data-testid="globalcomponent-customerprofile-close-button" onClick={handleCloseCustomer}>{t('billing.close')}</Button>
                </Box>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={1000}
                    onClose={handleCloseCopy}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        severity="success"
                        sx={{ width: '100%', textAlign: 'center' }}
                    >
                        {t('alert.copied')}
                    </Alert>
                </Snackbar>
            </Box>
        </Modal >
    )
}

const formatNumber = (num: number) => {
    const myNum = numeral(Number(num))
    return myNum.format("0, 0.00")
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '18px',
    boxShadow: 24,
    minWidth: 500,
    maxWidth: 800,
};

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}

        >
            {value === index && (
                <Box sx={{ p: 4 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </Box>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}