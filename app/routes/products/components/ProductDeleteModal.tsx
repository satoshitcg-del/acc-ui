import { sweetalert } from "@/core/enum";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { t, use } from "i18next";
// service
import ProductService from "@/services/ProductService";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";

export default function Component(dataDelete: any) {
  const { openModal, setOpenModal, deleteProductId, setCheckDelete } = dataDelete;
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  const { deleteProduct } = ProductService();
  const handleCloseDeleteModal = () =>
    setOpenModal({ ...openModal, deleteModal: false });
  const onSubmitHandlerDelete = async () => {
    try {
      const body = {
        id: deleteProductId,
      };
      const res = await deleteProduct(body);
      setCheckDelete(res);
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      console.log("error", error);
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
              // fontFamily: "Roboto",
              fontWeight: 500,
              fontSize: "20px",
              marginBottom: "1rem",
            }}
          >
            {t("title.delete")}
          </Typography>
          <Typography
            sx={{
              // fontFamily: "Roboto",
              fontWeight: 400,
              fontSize: "12px",
            }}
          >
            {t("placeholder.delete1")}
          </Typography>
          <Typography
            sx={{
              // fontFamily: "Roboto",
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
              data-testid="product-deleteproduct-cancel-button"
              variant="text"
              children={t("button.cancel")}
              onClick={handleCloseDeleteModal}
            />
            <Button
              data-testid="product-deleteproduct-agree-button"
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
Component.displayName = "ProductDeleteModal";
