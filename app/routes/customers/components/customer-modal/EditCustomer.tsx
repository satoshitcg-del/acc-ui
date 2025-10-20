import React, { useEffect } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
// React hook form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Customer props
import { customerProps } from "../../CustomerProps.js";
// Services
import CustomerService from "@/services/CustomerService.js";
// Layout
import Loading from "@/layout/components/loading/Loading.js";
// i18n
import { useTranslation } from "react-i18next";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import { Action, CUSTOMER_GROUP, UserTagType } from "@/core/enum.js";
import AutoCompleteMultipleUserTag from "@/layout/components/auto-complete/AutoCompleteMultipleUserTag.js";
import AutoCompleteMultipleSaleOwner from "@/layout/components/auto-complete/AutoCompleteMultipleSaleOwner.js";
import { getCountryByDialCode, getPatternFromPlaceholder, getPlaceholder, replaceHttpsLinkNote } from "@/core/utils/index.js";
import { MuiTelInput } from "mui-tel-input";
import { PatternFormat } from "react-number-format";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";
import { useProfileStore } from "@/core/storerecoil/useProfileStore.js";

interface EditCustomerProps {
  openModal: any;
  setOpenModal: React.Dispatch<any>;
  modifiedCustomer: any;
  setUpdateCustomer: React.Dispatch<React.SetStateAction<boolean>>;
  updateCustomer: boolean;
  setExistingCustomerLists: any;
  setDataCustomer: any;
  setActionType: any;
  tagReferenceList?: any;
  saleOwnerList?: any;
}

type TextFieldProps = {
  name: string;
  dataTestId: string;
  label: string;
  register: any
  errors: any
  width?: any
  disable?: boolean
  readonly?: boolean
};

export default function Component(props: EditCustomerProps) {
  const { openModal, setOpenModal, modifiedCustomer, setUpdateCustomer, updateCustomer, setExistingCustomerLists, setDataCustomer, setActionType, tagReferenceList, saleOwnerList } = props;
  const { update, checkTelegramEdit } = CustomerService();
  const [backDrop, setBackDrop] = React.useState(false);
  const { t } = useTranslation()
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  const { profile } = useProfileStore();
  const [selectSaleOwner, setSelectSaleOwner] = React.useState<any>(
    modifiedCustomer?.sale_owner ? saleOwnerList?.filter((item: any) => modifiedCustomer?.sale_owner?.some((owner: any) => owner.id === item.id)) : []
  );
  const [selectTagReference, setSelectTagReference] = React.useState<any>(
    modifiedCustomer?.tag_reference ? tagReferenceList?.find((item: any) => item.id === modifiedCustomer?.tag_reference[0]?.id) : ''
  );
  const [localTelephone, setLocalTelephone] = React.useState(modifiedCustomer?.dial_code || '+66')
  const [countryCode, setCountryCode] = React.useState(getCountryByDialCode(modifiedCustomer?.dial_code || '+66'))

  const schema = yup.object().shape({
    username: yup.string().test('Test detect slash', t('validate.customer-not-special-required'), (value) => !(/\//).test(value as string)).min(1, t('validate.customer-not-special-required')).max(50, t('validate.customer-not-special-required')).required(t('validate.customer-not-special-required')).transform((value) => (typeof value === "string" ? value.toLowerCase() : value)),
    full_name: yup.string().max(50, t('validate.customer-full-name')).required(t('validate.customer-full-name')),
    customer_group: yup.string().required(t('validate.customer-group-require')),
    email: yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('validate.customer-email')).required(t('validate.customer-email')).transform((value) => (typeof value === "string" ? value.toLowerCase() : value)),
    phone_number: yup.string().matches(/^((\+[1-9]{1,4}[ -]*)|(\([0-9]{2,3}\)[ -]*)|([0-9]{2,4})[ -]*)*?[0-9]{3,4}?[ -]*[0-9]{3,4}$/,
      { message: t('validate.customer-phone-number'), excludeEmptyString: true })
      .max(15, t('validate.customer-phone-number')),
    line_id: yup.string().max(50, t('validate.customer-special-required')),
    telegram: yup.string().max(50, t('validate.customer-special-required')).required(t('validate.customer-special-required')),
    what_app: yup.string().max(50, t('validate.customer-special-required')),
    note: yup.string().max(10000, t('validate.customer-note')),
    contact_name: yup.string().max(50, t('validate.customer-special-required')),
    contact_telegram: yup.string().max(50, t('validate.customer-special-required')),
    password: yup.string().required(t('validate.customer-password')),
  });

  const onSubmitEditModal = async (data: customerProps) => {
    try {
      setBackDrop(true);
      const res = await checkTelegramEdit(data?.telegram, modifiedCustomer?.id);
      setBackDrop(false);
      const checkDuplicate = res.data.duplicate
      if (checkDuplicate && data?.telegram != modifiedCustomer?.telegram) {
        setOpenModal({ ...openModal, confirmTelegramModal: true });
        setExistingCustomerLists(res.data.customers)
        setDataCustomer(data)
        setActionType(Action.Edit)
      } else {
        confirmEditCustomer(data)
      }
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const confirmEditCustomer = async (data: customerProps) => {
    try {
      const body = {
        id: modifiedCustomer?.id,
        username: data.username,
        full_name: data.full_name,
        customer_group: data.customer_group,
        email: data.email,
        phone_number: data.phone_number,
        line_id: data.line_id,
        telegram: data.telegram,
        what_app: data.what_app,
        note: data.note,
        contact_name: data.contact_name,
        contact_telegram: data.contact_telegram,
        tag_reference: [selectTagReference?.id],
        sale_owner: selectSaleOwner?.map((sale: any) => sale.id),
        dial_code: localTelephone,
      };
      setBackDrop(true)
      const res = await update(body);
      setBackDrop(false)
      setUpdateCustomer(!updateCustomer)
      setOpenModal({ ...openModal, editModal: false });
      alertSuccess(TranslateErrorCode(res?.code));
      reset();

    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setBackDrop(false)
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: modifiedCustomer?.username || "",
      full_name: modifiedCustomer?.full_name || "",
      customer_group: modifiedCustomer?.customer_group || "",
      email: modifiedCustomer?.email || "",
      phone_number: modifiedCustomer?.phone_number || "",
      line_id: modifiedCustomer?.line_id || "",
      telegram: modifiedCustomer?.telegram || "",
      what_app: modifiedCustomer?.what_app || "",
      contact_name: modifiedCustomer?.contact_name || "",
      contact_telegram: modifiedCustomer?.contact_telegram || "",
      password: modifiedCustomer?.password || "",
    }
  });

  useEffect(() => {
    register("note");
    setValue("note", replaceHttpsLinkNote(modifiedCustomer.note));
  }, [register])

  const onEditorStateChange = (editorState: string) => {
    setValue("note", editorState);
  };

  const editorContent = watch("note");
  const handleChangeTagReference = (tagRef: any) => {
    setSelectTagReference(tagRef);
  };

  const handleChangeSaleOwner = (saleOwner: any) => {
    if (saleOwner) {
      setSelectSaleOwner(saleOwner);
    }
  };

  const handleCloseEditModal = () => {
    setOpenModal({ ...openModal, editModal: false });
    reset();
  };

  const handleChangeLocalTelephone = (newValue: any, info: any) => {
    setCountryCode(info?.countryCode)
    if (info?.countryCallingCode) {
      setLocalTelephone(`+${info?.countryCallingCode}`)
    } else {
      setLocalTelephone(newValue)
    }
  }

  const handleChangeTelephoneNumber = (value: any) => {
    setValue("phone_number", value)
  }

  const [phoneNumberPlaceholder, setPhoneNumberPlaceholder] = React.useState('');
  const [phoneNumberPattern, setPhoneNumberPattern] = React.useState('');

  useEffect(() => {
    const placeholder = getPlaceholder(countryCode);
    setPhoneNumberPlaceholder(placeholder);
    const pattern = getPatternFromPlaceholder(placeholder);
    setPhoneNumberPattern(pattern);
  }, [countryCode]);

  return (
    <>
      <Modal
        open={openModal.editModal}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={stylePaperModal}>
          <form onSubmit={handleSubmit(onSubmitEditModal)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}>
              <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>
                {t("title.edit-customer")}
              </Typography>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextFieldDefaultValue({ name: "full_name", dataTestId: "customer-editcustomer-name-text", label: t(`placeholder.customer-name`), register, errors, width: "50%" })}
                <FormControl sx={{ width: "50%" }}>
                  <InputLabel id="demo-simple-select-label">
                    {t("placeholder.customer-group")}
                  </InputLabel>
                  <Select
                    data-testid="customer-formaddproductcustomer-customer-group-select"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={t("placeholder.customer-group")}
                    {...register("customer_group")}
                    value={watch("customer_group") || ""}
                    onChange={(e) => setValue("customer_group", e.target.value, { shouldValidate: true })}
                    error={errors.customer_group ? true : false}
                  >
                    <MenuItem key={CUSTOMER_GROUP.INTERNAL} value={CUSTOMER_GROUP.INTERNAL}> {t("select.internal-customer")}</MenuItem>
                    <MenuItem key={CUSTOMER_GROUP.EXTERNAL} value={CUSTOMER_GROUP.EXTERNAL}> {t("select.external-customer")}</MenuItem>
                  </Select>

                  <FormHelperText
                    id="currency"
                    sx={{ color: "red" }}
                  >
                    {errors.customer_group?.message as string}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Divider>{t('divider.information-system')}</Divider>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextFieldDefaultValue({ name: "username", dataTestId: "customer-editcustomer-username-text", label: t(`placeholder.username`), register, errors, readonly: profile?.username !== 'superadmin' })}
                {renderTextFieldDefaultValue({ name: "email", dataTestId: "customer-editcustomer-email-text", label: t(`placeholder.email`), register, errors })}
              </Box>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextFieldDefaultValue({ name: "password", dataTestId: "customer-editcustomer-password-text", label: t(`placeholder.password`), register, errors, disable: true })}
                <Box width='50%' />
              </Box>
              <Divider>{t('divider.information-contact')}</Divider>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextFieldDefaultValue({ name: "what_app", dataTestId: "customer-editcustomer-whatapp-text", label: t("placeholder.whats-app"), register, errors, width: "100%" })}
                <Box sx={{ display: "flex", gap: "0.5rem", width: '100%' }} >
                  <MuiTelInput
                    data-testid="customer-editcustomer-dailcode-text"
                    sx={{ width: "30%" }}
                    value={localTelephone}
                    onChange={handleChangeLocalTelephone}
                    slotProps={{
                      input: {
                        // readOnly: true,
                        inputProps: {
                          "data-testid": "customer-editcustomer-dailcode-input",
                        },
                      }
                    }}
                  />
                  <PatternFormat
                    data-testid="customer-editcustomer-telephone-text"
                    disabled={countryCode ? false : true}
                    sx={{ width: "70%" }}
                    customInput={TextField}
                    value={modifiedCustomer?.phone_number}
                    placeholder={countryCode ? phoneNumberPlaceholder : t('placeholder.incorrect-country-code')}
                    format={phoneNumberPattern}
                    onValueChange={(values) => {
                      handleChangeTelephoneNumber(values.value);
                    }}
                    slotProps={{
                      input: {
                        inputProps: {
                          "data-testid": "customer-editcustomer-telephone-input",
                        },
                      }
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextFieldDefaultValue({ name: "line_id", dataTestId: "customer-editcustomer-lineid-text", label: t(`placeholder.line-id`), register, errors })}
                {renderTextFieldDefaultValue({ name: "telegram", dataTestId: "customer-editcustomer-telegram-text", label: t("placeholder.telegram"), register, errors })}
              </Box>
              <Divider>{t('divider.information-contact-backup')}</Divider>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextFieldDefaultValue({ name: "contact_name", dataTestId: "customer-editcustomer-lineid-text", label: t(`placeholder.name-contact-backup`), register, errors })}
                {renderTextFieldDefaultValue({ name: "contact_telegram", dataTestId: "customer-editcustomer-telegram-backup-text", label: t(`placeholder.telegram-backup`), register, errors })}
              </Box>
              <Box sx={{ display: "flex", gap: "1rem", }}>
                <AutoCompleteMultipleUserTag
                  dataTestId="customer-editcustomer-user-tag"
                  dataLists={tagReferenceList}
                  selected={selectTagReference}
                  handle={handleChangeTagReference}
                  label={t("placeholder.tag-reference")}
                  type={UserTagType.TAG_REFERENCE}
                />
                <AutoCompleteMultipleSaleOwner
                  dataTestId="customer-editcustomer-sale-owner"
                  dataLists={saleOwnerList}
                  selected={selectSaleOwner}
                  handle={handleChangeSaleOwner}
                  label={t("placeholder.sales-owner")}
                  type={UserTagType.SALE_OWNER}
                />
              </Box>
              <Box sx={{ minHeight: "10rem" }}>
                <ReactQuill
                  style={{ height: "6.5rem" }}
                  data-testid="customer-editcustomer-note-textarea"
                  theme='snow'
                  value={editorContent}
                  onChange={onEditorStateChange}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "end",
                  paddingTop: "10px",
                }}
              >
                <Button
                  data-testid="customer-editcustomer-cancel-button"
                  variant="text"
                  children={t("button.cancel")}
                  onClick={handleCloseEditModal}
                />
                <Button data-testid="customer-editcustomer-submit-button" type="submit" variant="text" children={t("button.save")} />
              </Box>
            </Box>
          </form>
        </Paper>
      </Modal>
      {backDrop &&
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
          open={backDrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    </>
  );
}
Component.displayName = "EditCustomer";

export const renderTextFieldDefaultValue = ({
  name,
  dataTestId,
  label,
  register,
  errors,
  width,
  disable,
  readonly,
}: TextFieldProps): JSX.Element => (
  <TextField
    sx={{ width: width ? width : '50%' }}
    id={name}
    data-testid={dataTestId}
    label={label}
    size="medium"
    {...register(name)}
    InputProps={{
      readOnly: readonly ? true : false,
    }}
    error={!!errors?.[name]}
    helperText={errors?.[name]?.message}
    disabled={disable ? true : false}
  />
);


const stylePaperModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "55rem",
  height: "auto",
  maxHeight: "calc(100vh - 20px)",
  overflowY: "auto",
  p: "1.5rem"
};