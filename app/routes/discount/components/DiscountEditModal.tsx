import React from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Input,
  InputAdornment,
  InputLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

/* Services */
import DiscountService from "@/services/DiscountService.js";

/* interfaces && Enum */
import { type DiscountProps } from "../DiscountProps.js";
import { BooleanString, DISCOUNT_TYPE_ENUM, ValidateMessage, sweetalert } from "@/core/enum.js";

/* State management */
import { useRecoilState } from "recoil";
import { TriggerTableDiscount } from "../storerecoil/index.js";

/* Yup validation */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* Core && Layout*/
import { DiscountType, ActiveTypeBoolean } from "@/core/constant.js";
import ModalCustom from "@/layout/components/modal/Modal.js";
import { IUpdateDiscountReq } from "@/core/interface/services.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { replaceHttpsLinkNote } from "@/core/utils/index.js";
import { NumericFormat } from "react-number-format";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";

export default function Component(dataEdit: any) {
  const { openModal, setOpenModal, inputDiscount, currencyDiscount } = dataEdit;
  const { updateDiscountList } = DiscountService();
  const { alertError, alertSuccess } = useAlertDialog();

  const [triggerTableDiscount, setTriggerTableDiscount] =
    useRecoilState(TriggerTableDiscount);

  const [discountType, setDiscountType] = React.useState<
    string | number | undefined
  >(inputDiscount?.discount_type === DISCOUNT_TYPE_ENUM.STATIC ? 1 : 2);
  const [productID, setProductID] = React.useState("");
  const [discount, setDiscount] = React.useState<number>(inputDiscount?.value);
  const [currency, setCurrency] = React.useState<string>(!inputDiscount?.currency_id ? currencyDiscount[0]?._id : inputDiscount?.currency_id)
  const [active, setActive] = React.useState(true);
  const { t } = useTranslation();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const [description, setDescription] = React.useState<string>(replaceHttpsLinkNote(inputDiscount?.description));

  let Schema: any = {
    discount_name: yup
      .string()
      .required(t('validate.discount-require'))
      .max(50, t('validate.customer-full-name'))
      .typeError(`String ${ValidateMessage.required}`),
    discount_type: yup
      .number()
      .required(t('validate.discount-type-require'))
      .typeError(`Number ${ValidateMessage.required}`),
    description: yup
      .string()
      .max(255, `Discount Description ${ValidateMessage.max255}`)
      .typeError(`String ${ValidateMessage.required}`),
  };

  if (discountType == 1) {
    Schema["discount_amount"] = yup
      .number()
      .typeError(`Number ${ValidateMessage.required}`)
      .positive(t('validate.discount-amount'))
      .required(`Discount Amount ${ValidateMessage.requiredField}`);
  } else {
    Schema["discount_percentage"] = yup
      .number()
      .typeError(`Number ${ValidateMessage.required}`)
      .moreThan(0)
      .lessThan(101, t('validate.discount-percentage-100'))
      .positive(t('validate.discount-percentage'))
      .required(`Discount Percentage ${ValidateMessage.requiredField}`);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(yup.object().shape(Schema)),
  });

  const handleCloseEditModal = () => {
    setOpenModal({ ...openModal, editModal: false });
  };

  const handleDiscountTypeChange = (event: SelectChangeEvent) => {
    setDiscount(0);
    setDiscountType(event.target.value);
  };

  const handleDiscountValuePercentageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    discountType: string
  ) => {
    let numericValue = Number(event.target.value);
    setValue(discountType, numericValue)
    setDiscount(!isNaN(numericValue) ? numericValue : 0);
  };

  const handleDiscountValueAmountChange = (
    values: any,
    discountType: string
  ) => {
    const newValue = values.floatValue ?? 0; // ถ้าเป็น undefined ให้ใช้ 0
    setDiscount(newValue);
    setValue(discountType, newValue); // ใช้กับ react-hook-form
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const status: boolean = event.target.value === BooleanString.true
    setActive(status);
  };

  const onChangeDescription = (editorState: string) => {
    setDescription(editorState);
  };

  const checkActive = (status: boolean) => {
    status ? setActive(true) : setActive(false);
  };

  const onSubmitHandler = async (data: DiscountProps) => {
    try {
      let body: DiscountProps = {
        discount_name: data?.discount_name as string,
        active: active,
        discount_type: discountType === 1 ? DISCOUNT_TYPE_ENUM.STATIC : DISCOUNT_TYPE_ENUM.PERCENT,
        currency_id: discountType == 1 ? currency : undefined,
        value: discountType == 1
          ? data?.discount_amount
          : (data?.discount_percentage as number)
        // currency_id: 
      };

      if (description) body.description = description;

      console.log("Body discount :", body);
      const res = await updateDiscountList(inputDiscount?.id, body as IUpdateDiscountReq);
      setTriggerTableDiscount(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
      reset();
    } catch (error: any) {
      console.log("error", error);
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setOpenModal({ ...openModal, editModal: false });
    }
  };

  const handleChangeCurrency = (event: SelectChangeEvent) => {
    setCurrency(event.target.value)
  }

  React.useEffect(() => {
    // fetchProductList(inputDiscount?.used_product);
    checkActive(inputDiscount?.active);
  }, [inputDiscount]);

  React.useEffect(() => {
    setValue("discount_amount", inputDiscount?.value || "");
  }, []);
  return (
    <>
      <ModalCustom
        open={openModal.editModal}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Typography variant="h5" sx={{ color: "#3380FF", p: "1rem" }}>
            {t("title.edit-discount")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: "1rem",
              gap: "1.5rem",
            }}
          >
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {/* Discount name */}
              <TextField
                data-testid="discount-editdiscount-discountname-text"
                {...register("discount_name")}
                id="discount-name-input"
                label={`${t("placeholder.discount-name")} *`}
                InputLabelProps={{ shrink: true }}
                size="medium"
                autoComplete="current-product"
                sx={{ width: "50%" }}
                autoFocus
                defaultValue={inputDiscount?.discount_name || ""}
                error={errors.discount_name ? true : false}
                helperText={errors.discount_name?.message as string}
              />
              <FormControl sx={{ width: "50%" }}>
                <InputLabel id="active-label">
                  {t("placeholder.active")}
                </InputLabel>
                <Select
                  data-testid="discount-editdiscount-active-select"
                  labelId="active-label"
                  id="active"
                  label={t("placeholder.active")}
                  value={String(active)}
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
            </Box>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <FormControl sx={{ width: "50%" }}>
                <InputLabel id="discount-type-label">{`${t(
                  "placeholder.discount-type",
                )} *`}</InputLabel>
                <Select
                  data-testid="discount-editdiscount-discounttype-select"
                  {...register("discount_type")}
                  label={`${t("placeholder.discount-type")} *`}
                  labelId="discount-type-label"
                  id="discount-type"
                  value={String(discountType)}
                  onChange={handleDiscountTypeChange}
                >
                  {DiscountType.map((type: any) => (
                    <MenuItem key={`active type ${type.id}`} value={type.id}>
                      {type.type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", width: "50%" }}>
                {discountType == 1 ? (
                  <NumericFormat
                    fullWidth
                    {...register("discount_amount")}
                    label={t("placeholder.discount-amount")}
                    data-testid="discount-editdiscount-amount-select"
                    id="amount"
                    value={discount}
                    error={errors.discount_amount ? true : false}
                    helperText={errors.discount_amount?.message as string}
                    inputProps={{ maxLength: 19 }}
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale={true}
                    allowLeadingZeros={true}
                    customInput={TextField}
                    onValueChange={(values: any) => {
                      handleDiscountValueAmountChange(values, "discount_amount")
                    }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    {...register("discount_percentage")}
                    data-testid="discount-adddiscount-percentage-select"
                    label={t("placeholder.discount-persentage")}
                    id="percentage"
                    value={discount !== null ? discount : ""}
                    onChange={(event) => handleDiscountValuePercentageChange(event, "discount_percentage")}
                    error={errors.discount_percentage ? true : false}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                    helperText={errors.discount_percentage?.message as string}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {discountType == 1 &&
                <FormControl sx={{ width: "50%" }}>
                  <InputLabel id="currency-label">{`${t(
                    "placeholder.currency",
                  )}`}</InputLabel>
                  <Select
                    data-testid="discount-editdiscount-currency-select"
                    label={`${t("placeholder.currency")}`}
                    labelId="currency-label"
                    id="currency"
                    value={currency}
                    onChange={handleChangeCurrency}
                  >
                    {currencyDiscount.map((currency: any, index: number) => (
                      <MenuItem key={`currency${index} ${currency._id}`} value={currency._id}>
                        {currency.currency_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
              <Box sx={{ width: "50%" }} />
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
            <Divider />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              data-testid="discount-editdiscount-cancel-button"
              onClick={handleCloseEditModal}
              variant="text"
              children={t("button.cancel")}
            />
            <Button data-testid="discount-editdiscount-static-text" type="submit" variant="text" children={t("button.save")} />
          </Box>
        </form>
      </ModalCustom>
    </>
  );
}
Component.displayName = "DiscountEditModal";
