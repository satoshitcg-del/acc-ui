import { sweetalert } from "@/core/enum";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { t } from "i18next";
// service
import ProductService from "@/services/ProductService";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";

export default function Component(dataDelete: any) {
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  const { deleteSubProduct } = ProductService();
  const { openModal, setOpenModal, deleteSubProductId, setCheckDelete } =
    dataDelete;

  const handleCloseDeleteModal = () => {
    setOpenModal({ ...openModal, deleteModal: false });
  };

  const onSubmitHandlerDelete = async () => {
    try {
      const res = await deleteSubProduct({
        id: deleteSubProductId,
      });
      setCheckDelete(res);
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setOpenModal({ ...openModal, deleteModal: false });
    }
  };

  return (
    <Box>
      <Modal
        open={openModal.deleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "20px",
              marginBottom: "1rem",
            }}
          >
            {t("title.delete")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "12px",
            }}
          >
            {t("placeholder.delete1")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "12px",
            }}
          >
            {t("placeholder.delete2")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              paddingTop: "10px",
            }}
          >
            <Button
              data-testid="subproduct-deletesubproduct-cancel-button"
              variant="text"
              children={t("button.cancel")}
              onClick={handleCloseDeleteModal}
            />
            <Button
              data-testid="subproduct-deletesubproduct-agree-button"
              variant="text"
              children={t("button.agree")}
              onClick={() => {
                onSubmitHandlerDelete();
              }}
            />
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}
Component.displayName = "SubProductDeleteModal";
