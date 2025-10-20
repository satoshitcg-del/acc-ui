import { Modal, Box, Typography, Divider, Button, IconButton, List, ListItem, Paper, InputBase } from '@mui/material'
import { IconMenuSvg } from '@/assets/svg/IconMenuSvg'
import { t } from 'i18next'

interface ModalProps {
    openModal: boolean
    closeModal: () => void
    productName: string
    prefix: string
    formLink: string
}

export default function FormLinkModal(props: ModalProps) {
    const { openModal, closeModal, productName, prefix, formLink } = props

    const handleCopyClipboard = (text: string) => { navigator.clipboard.writeText(text) };

    return (
        <Modal
          open={openModal}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
              <Typography sx={{ fontWeight: "bold" }} variant="h5" >{t('modal.link-header-modal')}</Typography>
              <Typography>{t('modal.link-label-modal')}</Typography>
              <List sx={{ display: "flex", flexDirection: "column", bgcolor: 'background.paper', alignContent: "center" }}>
                  <ListItem key="data" sx={{ border: 1.5, borderRadius: 1.5, borderColor: "gray"}}>
                    <Box sx={{ display: "flex", flexDirection: "column", my: 1, width: '100%', gap: 1 }}>
                      <Box sx={{ display: "flex", flexDirection: "row", gap: 1}}>
                        <Typography>{t('title.product')} : </Typography>
                        <Typography>{productName}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "row", gap: 1}}>
                        <Typography>{t('modal.prefix-company')} : </Typography>
                        <Typography>{prefix}</Typography>
                      </Box>
                      <Paper
                        component="form"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <InputBase
                          readOnly
                          sx={{ ml: 1, flex: 1}}
                          placeholder={formLink}
                          inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton color="primary" aria-label="directions" onClick={() => handleCopyClipboard(formLink)}>
                          <IconMenuSvg icon="copy-clipsboard" color="action"/>
                        </IconButton>
                      </Paper>
                    </Box>
                  </ListItem>
              </List>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", my: 1 }}>
                  <Button data-testid="globalcomponent-customerprofile-close-button" onClick={closeModal}>{t('button.close')}</Button>
              </Box>
          </Box>
        </Modal>
    )
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 600,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 4,
    pt: 4, 
};
