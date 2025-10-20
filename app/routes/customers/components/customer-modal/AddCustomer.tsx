import { useEffect, useState } from 'react';
// MUI
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
} from '@mui/material';
import { VpnKeyRounded } from '@mui/icons-material';
import { MuiTelInput } from 'mui-tel-input'
// React hook form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// Customers props
import { customerProps } from '../../CustomerProps.js';
// service
import CustomerService from '@/services/CustomerService.js';
// Layout
import Loading from "@/layout/components/loading/Loading.js";
import { useTranslation } from 'react-i18next';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode.js';
import { Action, CUSTOMER_GROUP, UserTagType } from '@/core/enum.js';
import AutoCompleteMultipleUserTag from '@/layout/components/auto-complete/AutoCompleteMultipleUserTag.js';
import AutoCompleteMultipleSaleOwner from '@/layout/components/auto-complete/AutoCompleteMultipleSaleOwner.js';
import { PatternFormat } from 'react-number-format';
import { getPatternFromPlaceholder, getPlaceholder } from '@/core/utils/index.js';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog.js';

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
}

type TextFieldProps = {
  name: string;
  dataTestId: string;
  label: string;
  placeholder: string;
  register: any
  errors: any
  width?: any
};

export default function Component(props: ComponentProps) {
  const { openModal, setOpenModal, setUpdateCustomer, updateCustomer, setGenPassword, genPassword, generatePassword, setExistingCustomerLists, setDataCustomer, setActionType, tagReferenceList, saleOwnerList } = props;
  const { create, checkTelegramAdd } = CustomerService();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation()
  const { TranslateErrorCode } = useTranslateErrorCode()
  const [selectTagReference, setSelectTagReference] = useState<any | null>();
  const [selectSaleOwner, setSelectSaleOwner] = useState([]);
  const [localTelephone, setLocalTelephone] = useState('+66')
  const [countryCode, setCountryCode] = useState('TH')
  const { alertError, alertSuccess } = useAlertDialog();

  const customerValidateSchema = yup.object().shape({
    username: yup.string().matches(/^[A-Za-z-0-9-_.@]*$/, t('validate.customer-not-special-required')).test('Test detect slash', t('validate.customer-not-special-required'), (value) => !(/\//).test(value as string)).min(1, t('validate.customer-not-special-required')).max(50, t('validate.customer-not-special-required')).required(t('validate.customer-not-special-required')).trim('').transform((value) => (typeof value === "string" ? value.toLowerCase() : value)),
    full_name: yup.string().max(50, t('validate.customer-full-name')).required(t('validate.customer-full-name')).trim(''),
    customer_group: yup.string().required(t('validate.customer-group-require')),
    email: yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('validate.customer-email')).required(t('validate.customer-email')).max(50, t('validate.customer-email')).transform((value) => (typeof value === "string" ? value.toLowerCase() : value)),
    password: yup.string().required(t('validate.customer-password')),
    phone_number: yup.string().matches(/^((\+[1-9]{1,4}[ -]*)|(\([0-9]{2,3}\)[ -]*)|([0-9]{2,4})[ -]*)*?[0-9]{3,4}?[ -]*[0-9]{3,4}$/,
      { message: t('validate.customer-phone-number'), excludeEmptyString: true })
      .max(15, t('validate.customer-phone-number')),
    line_id: yup.string().max(50, t('validate.customer-special-required')),
    telegram: yup.string().max(50, t('validate.customer-special-required')).required(t('validate.customer-special-required')).trim(''),
    what_app: yup.string().max(50, t('validate.customer-special-required')),
    note: yup.string().max(10000, t('validate.customer-note')),
    contact_name: yup.string().max(50, t('validate.customer-special-required')),
    contact_telegram: yup.string().max(50, t('validate.customer-special-required')),
  });

  const onSubmitAddModal = async (data: customerProps) => {
    try {
      setIsLoading(true);
      const res = await checkTelegramAdd(data.telegram);
      const checkDuplicate = res.data.duplicate
      if (checkDuplicate) {
        setIsLoading(false);
        setOpenModal({ ...openModal, confirmTelegramModal: true });
        setExistingCustomerLists(res.data.customers)
        setDataCustomer(data)
        setActionType(Action.Add)
      } else {
        confirmAddCustomer(data)
      }
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const confirmAddCustomer = async (data: customerProps) => {
    try {
      const body = {
        username: data.username,
        full_name: data.full_name || '',
        customer_group: data.customer_group || '',
        email: data.email || '',
        password: data.password || '',
        phone_number: data.phone_number || '',
        line_id: data.line_id || '',
        telegram: data.telegram || '',
        what_app: data.what_app || '',
        note: data.note || '',
        contact_name: data.contact_name || '',
        contact_telegram: data.contact_telegram || '',
        tag_reference: [selectTagReference?.id],
        sale_owner: selectSaleOwner?.map((sale: any) => sale.id),
        dial_code: localTelephone,
      };
      setIsLoading(true);
      const res = await create(body);
      setIsLoading(false);
      setOpenModal({ ...openModal, addModal: false });
      setUpdateCustomer(!updateCustomer)
      alertSuccess(TranslateErrorCode(res?.code));
      reset();
    } catch (error: any) {
      alertError(TranslateErrorCode(error?.response?.data?.code));
    } finally {
      setIsLoading(false);
      // setOpenModal({ ...openModal, addModal: false });
    }
  }

  const handleCloseAddModal = () => {
    reset();
    setOpenModal({ ...openModal, addModal: false });
  };

  const newPassword = () => setGenPassword(generatePassword());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(customerValidateSchema),
  });

  useEffect(() => {
    register("note");
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

  const handleChangeLocalTelephone = (value: any, info: any) => {
    setCountryCode(info?.countryCode)
    if (info?.countryCallingCode) {
      setLocalTelephone(`+${info?.countryCallingCode}`)
    } else {
      setLocalTelephone(value)
    }
  }

  const handleChangeTelephoneNumber = (value: any) => {
    setValue("phone_number", value)
  }

  const [phoneNumberPlaceholder, setPhoneNumberPlaceholder] = useState('');
  const [phoneNumberPattern, setPhoneNumberPattern] = useState('');

  useEffect(() => {
    const placeholder = getPlaceholder(countryCode);
    setPhoneNumberPlaceholder(placeholder);
    const pattern = getPatternFromPlaceholder(placeholder);
    setPhoneNumberPattern(pattern);
  }, [countryCode]);

  return (
    <>
      <Modal
        open={openModal.addModal}
        onClose={handleCloseAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={stylePaperModal}>
          <form onSubmit={handleSubmit(onSubmitAddModal)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}>
              <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>
                {t("title.add-customer")}
              </Typography>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextField({ name: "full_name", dataTestId: "customer-addcustomer-name-text", label: t(`placeholder.customer-name`) + '*', placeholder: t(`placeholder.customer-name`), register, errors, width: "50%" })}
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
                {renderTextField({ name: "username", dataTestId: "customer-addcustomer-username-text", label: t(`placeholder.username`) + '*', placeholder: t(`placeholder.username`), register, errors })}
                {renderTextField({ name: "email", dataTestId: "customer-addcustomer-email-text", label: t(`placeholder.email`) + '*', placeholder: t(`placeholder.email`), register, errors })}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: '1rem' }} >
                <TextField
                  sx={{
                    width: "50%",
                  }}
                  required
                  fullWidth
                  label={t(`placeholder.password`)}
                  placeholder={t(`placeholder.password`)}
                  type={"text"}
                  id="password"
                  data-testid="customer-addcustomer-password-text"
                  autoComplete="current-password"
                  size="medium"
                  value={genPassword}
                  {...register("password")}
                  error={errors.password ? true : false}
                  helperText={errors.password?.message}
                />
                <Button
                  data-testid="customer-addcustomer-suggestedpassword-text"
                  sx={{ width: "50%", maxHeight: "5rem" }}
                  variant="contained"
                  size="large"
                  startIcon={<VpnKeyRounded />}
                  onClick={() => newPassword()}
                >
                  {t("button.suggest-password")}
                </Button>
              </Box>
              <Divider>{t('divider.information-contact')}</Divider>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextField({ name: "what_app", dataTestId: "customer-addcustomer-whatapp-text", label: t(`placeholder.whats-app`), placeholder: t(`placeholder.whats-app`), register, errors, width: "100%" })}
                <Box sx={{ display: "flex", gap: "0.5rem", width: '100%' }} >
                  <MuiTelInput
                    data-testid="customer-addcustomer-dailcode-text"
                    sx={{ width: "30%" }}
                    value={localTelephone}
                    onChange={(value, info: any) => {
                      handleChangeLocalTelephone(value, info)
                    }}
                    slotProps={{
                      input: {
                        // readOnly: true,
                        inputProps: {
                          "data-testid": "customer-addcustomer-dailcode-input",
                        },
                      },
                    }}
                  />
                  <PatternFormat
                    data-testid="customer-addcustomer-telephone-text"
                    disabled={countryCode ? false : true}
                    sx={{ width: "70%" }}
                    customInput={TextField}
                    placeholder={countryCode ? phoneNumberPlaceholder : t('placeholder.incorrect-country-code')}
                    format={phoneNumberPattern}
                    onValueChange={(values) => {
                      handleChangeTelephoneNumber(values.value);
                    }}
                    slotProps={{
                      input: {
                        inputProps: {
                          "data-testid": "customer-addcustomer-telephone-input",
                        },
                      }
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextField({ name: "line_id", dataTestId: "customer-addcustomer-lineid-text", label: t(`placeholder.line-id`), placeholder: t(`placeholder.line-id`), register, errors })}
                {renderTextField({ name: "telegram", dataTestId: "customer-addcustomer-telegram-text", label: t(`placeholder.telegram`) + '*', placeholder: t(`placeholder.telegram`), register, errors })}
              </Box>
              <Divider>{t('divider.information-contact-backup')}</Divider>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                {renderTextField({ name: "contact_name", dataTestId: "customer-addcustomer-lineid-text", label: t(`placeholder.name-contact-backup`), placeholder: t(`placeholder.name-contact-backup`), register, errors })}
                {renderTextField({ name: "contact_telegram", dataTestId: "customer-addcustomer-telegram-backup-text", label: t(`placeholder.telegram-backup`), placeholder: t(`placeholder.telegram-backup`), register, errors })}
              </Box>
              <Box sx={{ display: "flex", gap: "1rem", }}>
                <AutoCompleteMultipleUserTag
                  dataTestId="customer-addcustomer-user-tag"
                  dataLists={tagReferenceList}
                  selected={selectTagReference}
                  handle={handleChangeTagReference}
                  label={t("placeholder.tag-reference")}
                  type={UserTagType.TAG_REFERENCE}
                />
                <AutoCompleteMultipleSaleOwner
                  dataTestId="customer-addcustomer-sale-owner"
                  dataLists={saleOwnerList}
                  selected={selectSaleOwner}
                  handle={handleChangeSaleOwner}
                  label={t("placeholder.sales-account")}
                  type={UserTagType.SALE_OWNER}
                />
              </Box>
              <Box sx={{ minHeight: "10rem" }}>
                <ReactQuill
                  data-testid="customer-addcustomer-note-textarea"
                  style={{ height: "6.5rem" }}
                  theme='snow'
                  value={editorContent}
                  onChange={onEditorStateChange}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingTop: "10px", }}>
                <Button
                  variant="text"
                  data-testid="customer-addcustomer-cancel-button"
                  children={t("button.cancel")}
                  onClick={handleCloseAddModal}
                />
                <Button data-testid="customer-addcustomer-submit-button" variant="text" children={t("button.save")} onClick={handleSubmit(onSubmitAddModal)} />
              </Box>
            </Box>
          </form>
        </Paper>
      </Modal>
      {isLoading &&
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    </>
  );
}

Component.displayName = 'AddCustomer';

export const renderTextField = ({
  name,
  dataTestId,
  label,
  placeholder,
  register,
  errors,
  width,
}: TextFieldProps): JSX.Element => (
  <TextField
    sx={{ width: width ? width : '50%' }}
    id={name}
    data-testid={dataTestId}
    label={label}
    size="medium"
    placeholder={placeholder}
    {...register(name)}
    error={!!errors?.[name]}
    helperText={errors?.[name]?.message}
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