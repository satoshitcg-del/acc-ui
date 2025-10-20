import ModalCustom from "@/layout/components/modal/Modal.js";
import { Box, Button, Typography, Fade, IconButton, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ConfirmDeleteProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  openModal: boolean,
  closeModal: () => void,
  ConfirmDelete: () => void
}

export const ModalConfirmDelete = (props: ConfirmDeleteProps) => {
  const { title, description, openModal, closeModal, ConfirmDelete } = props
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ModalCustom
      open={openModal}
      onClose={closeModal}
      aria-labelledby={String(title)}
      aria-describedby={String(description)}
      disableScrollLock
    >
      <Box sx={{
        position: 'relative',
        borderRadius: 2,
        minWidth: 400,
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 600,
          mb: 2,
          color: theme.palette.error.main
        }}>
          {title}
        </Typography>

        <Typography variant="body1" sx={{
          mb: 3,
          color: theme.palette.text.secondary
        }}>
          {description}
        </Typography>

        <Box sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
        }}>
          <Button
            data-testid="globalcomponent-confirmdelete-cancel-button"
            variant="outlined"
            onClick={closeModal}
          >
            {t("button.cancel")}
          </Button>
          <Button
            data-testid="globalcomponent-confirmdelete-save-button"
            variant="contained"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={ConfirmDelete}
          >
            {t("button.delete")}
          </Button>
        </Box>
      </Box>
    </ModalCustom>
  )
}