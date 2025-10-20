import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
  TextareaAutosize as Textarea,
  FormHelperText,
  CircularProgress
} from "@mui/material";
import { productProps } from "../ProductProps.js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { t } from "i18next";
import { BooleanString, ProductMasterType, ValidateMessage, sweetalert } from "@/core/enum.js";
import { ActiveTypeBoolean, ProductType } from "@/core/constant.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
// service
import ProductService from "@/services/ProductService.js";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { green } from "@mui/material/colors";
import { ValidJSON, replaceHttpsLinkNote } from "@/core/utils/index.js";
import { useProfileStore } from "@/core/storerecoil/useProfileStore.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";

export default function Component(dataEdit: any) {
  const {
    openModal,
    setOpenModal,
    modifiedProduct,
    handleStatusChange,
    handleProductTypeChange,
    status,
    setStatus,
    setEditProduct,
    winLoseSnapshot,
    setWinLoseSnapshot,
    productType,
    setProductType,
    typeList
  } = dataEdit;
  const { profile, setProfile } = useProfileStore();
  const [winLoseSnapshotEdit, setWinLoseSnapshotEdit] = useState<any>(modifiedProduct.winLoseSnapshot)
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  const { updateProduct } = ProductService();
  const dataObject = yup.object().shape({
    product_name: yup
      .string()
      .max(50, t('validate.product-name-max-50'))
      .required(t('validate.product-name-require'))
      .typeError(`String ${ValidateMessage.required}`),
    product_name_preview: yup
      .string()
      .max(50, t('validate.product-preview-max-50'))
      .required(t('validate.product-preview-require'))
      .typeError(`String ${ValidateMessage.required}`),
    description: yup.string().max(255, t('validate.discount-desc')),
    active: yup.string().required(),
    type: yup.string().required(t('validate.product-type-require')),
  });
  const [description, setDescription] = React.useState<string>(replaceHttpsLinkNote(modifiedProduct.description));

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
    setWinLoseSnapshot('');
    reset();
    setProductType('');
    setStatus(true);
  };

  const handleFormatWinLoseJSON = () => {
    if (!loading) {
      setLoading(true);
      timer.current = setTimeout(() => {
        setLoading(false);
      }, 600);
    }
    if (ValidJSON(winLoseSnapshotEdit)) {
      setSuccess(true);

      const parsed = JSON.parse(winLoseSnapshotEdit)
      setWinLoseSnapshotEdit(JSON.stringify(parsed, null, 2))
    } else {
      setSuccess(false);
      console.error("Invalid JSON format.");
      alertError(t('error.json'));
    }
  }

  const onSubmitHandlerEdit = async (data: productProps) => {
    try {
      const dataEditProduct = {
        product_name: data.product_name as string,
        product_name_preview: data.product_name_preview as string,
        active: data.active === BooleanString.true,
        wlsnapshot_data: winLoseSnapshotEdit !== '' ? JSON.parse(winLoseSnapshotEdit) : JSON.parse('{}'),
        type: data.type as string
      };
      description
        ? Object.assign(dataEditProduct, { description: description })
        : null;
      const res = await updateProduct(modifiedProduct?.id, dataEditProduct);
      setEditProduct(res);
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      console.log("error", error);
      alertError(TranslateErrorCode(error?.response?.data?.code));
    } finally {
      setOpenModal({ ...openModal, editModal: false });
      setProductType('')
      setStatus(true);
      setWinLoseSnapshot('');
      reset();
    }
  };

  const onChangeDescription = (editorState: string) => {
    setDescription(editorState);
  };

  useEffect(() => {
    setWinLoseSnapshotEdit(JSON.stringify(modifiedProduct.wlsnapshot_data, null, 2))
  }, [])

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }
    ),
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
            p: 2,
          }}
        >
          <form onSubmit={handleSubmit(onSubmitHandlerEdit)}>
            <Typography variant="h5" sx={{ color: "#3380FF", p: "1rem" }}>
              {t("title.edit-product")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                p: "1rem",
                gap: "1.5rem", maxHeight: "67vh", overflow: "auto"
              }}>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <TextField
                    data-testid="product-editproduct-productname-text"
                    id="product-name-input"
                    label={t("placeholder.product-name")}
                    size="medium"
                    autoComplete="current-product"
                    sx={{ width: "50%" }}
                    autoFocus
                    defaultValue={modifiedProduct?.product_name}
                    {...register("product_name")}
                    error={errors.product_name ? true : false}
                    helperText={errors.product_name?.message}
                  />
                  <TextField
                    data-testid="product-editproduct-productnamepreview-text"
                    id="product-name-preview-input"
                    label={t("placeholder.product-name-preview")}
                    size="medium"
                    autoComplete="current-product"
                    sx={{ width: "50%" }}
                    defaultValue={modifiedProduct?.product_name_preview}
                    {...register("product_name_preview")}
                    error={errors.product_name_preview ? true : false}
                    helperText={errors.product_name_preview?.message}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <FormControl sx={{ width: "48.7%" }}>
                    <InputLabel id="status-label">
                      {t("placeholder.status")}
                    </InputLabel>
                    <Select
                      data-testid="product-editproduct-status-select"
                      labelId="status-label"
                      id="status"
                      value={status ? BooleanString.true : BooleanString.false}
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
                    <InputLabel id="demo-simple-select-label" color={!productType && errors.type ? "error" : "primary"}>
                      {t("placeholder.product-type")}
                    </InputLabel>
                    <Select
                      data-testid="product-editproduct-type-select"
                      labelId="product-editproduct-type-select-label"
                      id="product-editproduct-type-select"
                      value={productType}
                      label={t("placeholder.product-type")}
                      {...register("type")}
                      onChange={handleProductTypeChange}
                      error={!productType && errors.type ? true : false}
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
                    {!productType && <FormHelperText sx={{ color: "error.main" }}>{errors.type?.message}</FormHelperText>}
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <InputLabel
                    htmlFor="json-input"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {t('placeholder.note')}
                  </InputLabel>
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
                </Box>
                {profile?.username == "superadmin" && productType != ProductMasterType.OTHER &&
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <InputLabel
                      htmlFor="json-input"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {t('placeholder.input-json')}
                    </InputLabel>
                    <Textarea data-testid="product-editproduct-jsonw/lsnapshot-textarea" style={{ width: "100%" }} minRows={7} aria-label="minimum height" placeholder="Enter JSON format" value={winLoseSnapshotEdit} onChange={(event) => setWinLoseSnapshotEdit(event.target.value)} />
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
                      <Button startIcon={
                        loading && (
                          <CircularProgress
                            size={24}
                            sx={{
                              color: green[50],
                            }}
                          />
                        )}
                        data-testid="product-editproduct-process-button"
                        variant="contained"
                        children={t("button.process-json")}
                        sx={buttonSx}
                        onClick={handleFormatWinLoseJSON}
                      />
                    </Box>

                  </Box>
                }
              </Box>
              <Divider sx={{ marginTop: "1rem" }} />
              <Box
                sx={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  data-testid="product-editproduct-cancel-button"
                  variant="text"
                  children={t("button.cancel")}
                  onClick={handleCloseEditModal}
                />
                <Button
                  data-testid="product-editproduct-save-button"
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
Component.displayName = "ProductEditModal";
