import { Box, Button, Typography } from '@mui/material'
import ModalCustom from "@/layout/components/modal/Modal.js";
import { useTranslation } from "react-i18next";

/** ------- Example -------
 * 
 * import { ConfirmChangeStatusToggle, useModalStatusToggle } from "@/layout/components/modalConfirm/index.js"; 
 * 
 * const { trigerChangeStatus, modalStatusToggle, handleOpenModalStatusToggle, handleCloseModalStatusToggle, handleSaveModalStatusToggle } = useModalStatusToggle(); 
 * 
 * <ConfirmChangeStatusToggle 
 *  openModal={ modalStatusToggle }
 *  closeModal={ handleCloseModalStatusToggle }
 *  save={handleSaveModalStatusToggle} 
 * />
 * 
*/

interface ConfirmChangeStatusProps {
  openModal: boolean,
  closeModal: () => void,
  save: () => void
}

export const ConfirmChangeStatusToggle = (props: ConfirmChangeStatusProps) => {
  const { openModal, closeModal, save } = props
  const { t } = useTranslation();

  return (
    <ModalCustom
      open={openModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Typography variant='h6'>
          {t("modal.confirm-change-status-title")}
        </Typography>
        <Typography variant='subtitle1'>
          {t("modal.confirm-change-status-descript")}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button
            data-testid="globalcomponent-changestatus-close-button"
            onClick={closeModal}
            variant='text'>{t("modal.confirm-change-status-no")}</Button>
          <Button variant='contained'
            data-testid="globalcomponent-changestatus-save-button"
            onClick={save}
          >{t("modal.confirm-change-status-yes")}</Button>
        </Box>
      </Box>
    </ModalCustom>

  )
}
