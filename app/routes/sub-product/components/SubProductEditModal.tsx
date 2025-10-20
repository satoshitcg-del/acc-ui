import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { SubProductProps } from "../SubProductProps.js";
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { t } from "i18next";
import { BooleanString, ValidateMessage, sweetalert } from "@/core/enum.js";
import { ActiveTypeBoolean, ProductType } from "@/core/constant.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
// service
import ProductService from "@/services/ProductService.js";
import { replaceHttpsLinkNote } from "@/core/utils/index.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";

export default function Component(dataEdit: any) {
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  const { updateSubProduct } = ProductService();
  const {
    openModal,
    setOpenModal,
    modifiedProduct,
    status,
    setStatus,
    require,
    setRequire,
    handleRequireChange,
    refId,
    setEditSubProduct,
    handleStatusChange,
    handleTypeChange,
    type,
    setType,
    typeList
  } = dataEdit;

  const [description, setDescription] = React.useState<string>(replaceHttpsLinkNote(modifiedProduct.description));
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

  const handleCloseEditModal = () => {
    setOpenModal({ ...openModal, editModal: false });
    reset();
    setType('')
    setStatus(true);
    setRequire(false);
  };

  const onChangeDescription = (editorState: string) => {
    setDescription(editorState);
  };

  const onSubmitHandlerEdit = async (data: SubProductProps) => {
    try {
      const dataEditSubProduct = {
        product_name: data.product_name as string,
        product_name_preview: data.product_name_preview as string,
        active: data.active === BooleanString.true,
        ref: refId,
        default_status: require,
        id: modifiedProduct?.id,
        type: data.type
      };
      description
        ? Object.assign(dataEditSubProduct, { description: description })
        : null;
      const res = await updateSubProduct(modifiedProduct?.id, dataEditSubProduct);
      setEditSubProduct(res);
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setOpenModal({ ...openModal, editModal: false });
      reset();
      setType('')
      setStatus(true);
      setRequire(false);
    }
  };

  return (
    <Box>
      <Modal
        open={openModal.editModal}
        onClose={handleCloseEditModal}
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
            p: 4,
          }}
        >
          <form onSubmit={handleSubmit(onSubmitHandlerEdit)}>
            <Typography
              variant="h5"
              sx={{ color: "#3380FF", pb: "0.5rem", px: "0.5rem" }}
            >
              {t("title.edit-sub-product")}
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
                  data-testid="subproduct-editsubproduct-subproductname-text"
                  id="sub-product-name-input"
                  label={t("placeholder.sub-product-name")}
                  size="medium"
                  margin="normal"
                  autoComplete="current-product"
                  defaultValue={modifiedProduct?.product_name}
                  sx={{ width: "50%" }}
                  autoFocus
                  {...register("product_name")}
                  error={errors.product_name ? true : false}
                  helperText={errors.product_name?.message}
                />
                <TextField
                  data-testid="subproduct-editsubproduct-subproductnamepreview-text"
                  id="sub-product-name-preview-input"
                  label={t("placeholder.sub-product-name-preview")}
                  size="medium"
                  margin="normal"
                  autoComplete="current-product"
                  defaultValue={modifiedProduct?.product_name_preview}
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
                    data-testid="subproduct-editsubproduct-status-select"
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
                        value={type.type_value.toString()}
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
                    data-testid="sub-product-editproduct-type-select"
                    labelId="sub-product-editproduct-type-select-label"
                    id="sub-product-editproduct-type-select"
                    value={type}
                    label={t("placeholder.sub-product-type")}
                    {...register("type")}
                    onChange={handleTypeChange}
                    error={!type && errors.type ? true : false}
                  >
                    {typeList.map((type: string, index: number) => (
                      <MenuItem
                        key={`ProductType ${index}`}
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
                      data-testid="subproduct-editsubproduct-require-switch"
                      defaultChecked={modifiedProduct?.default_status}
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
                  data-testid="subproduct-editsubproduct-cancel-button"
                  variant="text"
                  children={t("button.cancel")}
                  onClick={handleCloseEditModal}
                />
                <Button
                  data-testid="subproduct-editsubproduct-save-button"
                  type="submit"
                  variant="text"
                  children={t("button.save")}
                />
              </Box>
            </Box>
          </form>
        </Paper>
      </Modal>
    </Box>
  );
}
Component.displayName = "SubProductEditModal";
