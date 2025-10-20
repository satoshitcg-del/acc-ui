import { ContentCopy } from "@mui/icons-material";
import { Modal, Box, Avatar, Typography, Divider, Button, IconButton, Theme } from "@mui/material";
import { t } from "i18next";
import { useCopyToClipboard } from "usehooks-ts";


interface ComponentProps {
    openModal: any;
    setOpenModal: any;
    setUpdateCustomer: any;
    updateCustomer: boolean;
    setGenPassword: any;
    genPassword: string;
    generatePassword: any;
    setExistingCustomerLists: any;
    setDataCustomer: any;
    setActionType: any;
    tagReferenceList?: any;
    saleOwnerList?: any;
    handleGetTagReferenceList?: any;
    handleGetSaleOwnerList?: any;
}

export default function Component(props: any) {
    const { openModal, contactData, handleCloseSaleOwnerModal, label, name } = props;
    const [value, copy] = useCopyToClipboard()


    return (
        <Modal
            open={openModal.saleOwnerModal}
            onClose={handleCloseSaleOwnerModal}
            sx={{
                backdropFilter: 'blur(5px)',
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }
            }}
        >
            <Box sx={{
                ...style,
                bgcolor: 'background.paper',
                transform: 'translate(-50%, -50%) scale(1)',
                transition: 'transform 0.3s ease-out',
                '&:hover': {
                    boxShadow: (theme) => `0 8px 32px ${theme.palette.mode === 'dark'
                        ? 'rgba(0, 0, 0, 0.5)'
                        : 'rgba(0, 0, 0, 0.1)'}`,
                }
            }}>
                <Box sx={{ maxHeight: "86vh", overflow: "auto", width: "445px" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: "100%" }}>
                        <Avatar sx={{
                            width: "85px",
                            height: "85px",
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'linear-gradient(45deg, #1565C0 30%, #0D47A1 90%)'
                                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            boxShadow: (theme) => `0 3px 10px ${theme.palette.mode === 'dark'
                                ? 'rgba(33, 150, 243, 0.2)'
                                : 'rgba(33, 150, 243, 0.3)'}`,
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            }
                        }}>
                            <Typography component="h2" sx={{
                                lineHeight: 'normal',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'common.white'
                            }}>
                                {name ? name[0] : ""}
                            </Typography>
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'text.primary' }}>{label}</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                            {contactData?.map((contact: any, index: number) => (
                                <Box key={index} sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 2,
                                    borderRadius: 1,
                                    border: (theme) => `1px solid ${theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.08)'}`,
                                    bgcolor: (theme) => theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(0, 0, 0, 0.02)',
                                    '&:hover': {
                                        bgcolor: (theme) => theme.palette.mode === 'dark'
                                            ? 'rgba(33, 150, 243, 0.15)'
                                            : 'rgba(33, 150, 243, 0.05)',
                                        borderColor: (theme) => theme.palette.primary.main,
                                    }
                                }}>
                                    <Typography color="text.primary">{contact.name}</Typography>
                                    <IconButton
                                        sx={{
                                            '&:hover': {
                                                bgcolor: (theme) => theme.palette.mode === 'dark'
                                                    ? 'rgba(33, 150, 243, 0.2)'
                                                    : 'rgba(33, 150, 243, 0.1)',
                                            }
                                        }}
                                        data-testid="globalcomponent-customerprofile-copypassword-button"
                                        onClick={() => copy(contact.name)}
                                    >
                                        <ContentCopy color='primary' sx={{ width: "18px", height: "18px" }} />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
                <Divider orientation="horizontal" variant="fullWidth" sx={{ my: 3 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        data-testid="globalcomponent-customerprofile-close-button"
                        onClick={handleCloseSaleOwnerModal}
                        sx={{
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            }
                        }}
                    >
                        {t('button.close')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

Component.displayName = 'ContactModal';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    boxShadow: 24,
    px: 4,
    pt: 4,
    pb: 2
};