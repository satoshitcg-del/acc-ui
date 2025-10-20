import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SubProductProps } from "../SubProductProps.js";
import { t } from "i18next";
import { BooleanString, ValidateMessage, sweetalert } from "@/core/enum.js";
import { ActiveTypeBoolean } from "@/core/constant.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
// service
import ProductService from "@/services/ProductService.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: "background.paper",
  p: 4,
};

export default function Component(dataAdd: any) {
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  const { createSubProduct } = ProductService();
  const {
    openModal,
    setOpenModal,
    handleStatusChange,
    handleTypeChange,
    status,
    setStatus,
    require,
    setRequire,
    handleRequireChange,
    setAddSubProduct,
    refId,
    type,
    setType,
    typeList
  } = dataAdd;
  const [description, setDescription] = React.useState<string>("");

  const dataObject = yup.object().shape({
    product_name: yup
      .string()
      .max(50, t('validate.sub-product-name-max-50'))
      .required(t('validate.sub-product-name-require'))
      .typeError(`String ${ValidateMessage.required}`),
    product_name_preview: yup
      .string()
      .max(50, t('validate.sub-product-preview-max-50'))
      .required(t('validate.sub-product-preview-require')),
    description: yup.string().max(255, t('validate.discount-desc')),
    active: yup.string().required(),
    type: yup.string().required(t('validate.sub-product-type-require')),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(dataObject),
  });

  const handleCloseAddModal = () => {
    setOpenModal({ ...openModal, addModal: false });
    setType('')
    setStatus(true);
    setRequire(false);
  };

  const onChangeDescription = (editorState: string) => {
    setDescription(editorState);
  };

  const onSubmitHandler = async (data: SubProductProps) => {
    try {
      const dataAddSubProduct = {
        active: data.active === BooleanString.true,
        default_status: require,
        product_name: data.product_name as string,
        product_name_preview: data.product_name_preview as string,
        ref: refId,
        type: data.type
      };
      description
        ? Object.assign(dataAddSubProduct, { description: description })
        : null;
      const res = await createSubProduct(
        dataAddSubProduct,
      );
      setAddSubProduct(res);
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setOpenModal({ ...openModal, addModal: false });
      setType('')
      setStatus(true);
      setRequire(false);
      reset();
    }
  };

  return (
    <div>
      <Modal
        open={openModal.addModal}
        onClose={handleCloseAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Typography variant="h5" sx={{ color: "#3380FF", pb: "1rem", px: "0.5rem" }}>
              {t("title.add-sub-product")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 0.5,
                gap: "1rem",
              }}
            >
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <TextField
                  data-testid="subproduct-addsubproduct-subproductname-text"
                  id="sub-product-name-input"
                  label={t("placeholder.sub-product-name")}
                  size="medium"
                  autoComplete="current-product"
                  sx={{ width: "50%" }}
                  autoFocus
                  {...register("product_name")}
                  error={errors.product_name ? true : false}
                  helperText={errors.product_name?.message}
                />
                <TextField
                  data-testid="subproduct-addsubproduct-subproductnamepreview-text"
                  id="sub-product-name-preview-input"
                  label={t("placeholder.sub-product-name-preview")}
                  size="medium"
                  autoComplete="current-product"
                  sx={{ width: "50%" }}
                  {...register("product_name_preview")}
                  error={errors.product_name_preview ? true : false}
                  helperText={errors.product_name_preview?.message}
                />
              </Box>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <FormControl sx={{ width: "50%" }}>
                  <InputLabel id="status-label">
                    {t("placeholder.status")}
                  </InputLabel>
                  <Select
                    data-testid="subproduct-addsubproduct-status-select"
                    labelId="status-label"
                    id="status"
                    value={status}
                    label={t("placeholder.status")}
                    {...register("active")}
                    onChange={handleStatusChange}
                  >
                    {ActiveTypeBoolean.map((type: any) => (
                      <MenuItem
                        key={`StatusType ${type.id}`}
                        value={type.type_value}
                      >
                        {t(`select.${type.type_name}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "48.7%" }}>
                  <InputLabel id="demo-simple-select-label" color={!type && errors.type ? "error" : "primary"}>
                    {t("placeholder.sub-product-type")}
                  </InputLabel>
                  <Select
                    data-testid="sub-product-addproduct-product_type-select"
                    labelId="sub-product-addproduct-product_type-select-label"
                    id="sub-product-addproduct-product_type-select"
                    value={type}
                    label={t("placeholder.sub-product-type")}
                    {...register("type")}
                    onChange={handleTypeChange}
                    error={!type && errors.type ? true : false}
                  >
                    {typeList.map((type: string, index: number) => (
                      <MenuItem
                        key={`Type ${index}`}
                        value={type}
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {!type && <FormHelperText sx={{ color: "error.main" }}>{errors.type?.message}</FormHelperText>}
                </FormControl>
              </Box>
              <Box sx={{ minHeight: "10rem" }}>
                {/* Discount description */}
                <ReactQuill
                  data-testid="customer-addcustomer-note-textarea"
                  style={{ height: "6.5rem" }}
                  theme='snow'
                  value={description}
                  onChange={onChangeDescription}
                />
              </Box>
              {/* <Box sx={{ display: "flex", gap: "1rem" }}>
                <p style={{ marginRight: "1rem" }}>
                  {t("placeholder.require")}
                </p>
                <FormControlLabel
                  control={
                    <Switch
                      data-testid="subproduct-addsubproduct-require-switch"
                      checked={require}
                      onChange={handleRequireChange}
                      name="antoine"
                    />
                  }
                  label=""
                />
              </Box> */}
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  data-testid="subproduct-addsubproduct-cancel-button"
                  variant="text"
                  children={t("button.cancel")}
                  onClick={handleCloseAddModal}
                />
                <Button
                  data-testid="subproduct-addsubproduct-save-button"
                  type="submit"
                  variant="text"
                  children={t("button.save")}
                />
              </Box>
            </Box>
          </form>
        </Paper>
      </Modal>
    </div>
  );
}
Component.displayName = "SubProductAddModal";
