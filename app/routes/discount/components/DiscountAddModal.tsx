import React from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

/* interfaces && Enum */
import { type DiscountProps } from "../DiscountProps.js";
import { ValidateMessage, sweetalert, DISCOUNT_TYPE_ENUM } from "@/core/enum.js";

/* Services */
import DiscountService from "@/services/DiscountService.js";

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
import { ICreateDiscountReq } from "@/core/interface/services.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { NumericFormat } from "react-number-format";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";

export default function Component(props: any) {
  const { openModal, setOpenModal, currencyDiscount } = props;
  const { createDiscount } = DiscountService();
  const [triggerTableDiscount, setTriggerTableDiscount] =
    useRecoilState(TriggerTableDiscount);

  const [discountType, setDiscountType] = React.useState<
    string | number | undefined
  >(1);
  const [discount, setDiscount] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>("");
  const [selectCurrency, setSelectCurrency] = React.useState<string>("")
  const [active, setActive] = React.useState(true);
  const { t } = useTranslation();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();

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

  const handleCloseAddModal = () => {
    setOpenModal({ ...openModal, addModal: false });
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
    setActive(event.target.value === "true");
  };

  const handleChangeCurrency = (event: SelectChangeEvent) => {
    setSelectCurrency(event.target.value);
  };

  const onChangeDescription = (editorState: string) => {
    setDescription(editorState);
  };
  // Fetch Response

  const onSubmitHandler = async (data: DiscountProps) => {
    try {
      const body: DiscountProps = {
        discount_name: data?.discount_name as string,
        active: active,
        discount_type: discountType == 1 ? DISCOUNT_TYPE_ENUM.STATIC : DISCOUNT_TYPE_ENUM.PERCENT,
        currency_id: discountType == 1 ? (selectCurrency ? selectCurrency : defaultCurrency as string) : undefined,
        value: discountType == 1
          ? data?.discount_amount
          : (data?.discount_percentage as number)
      };

      if (description) body.description = description as string;
      const res = await createDiscount(
        body as ICreateDiscountReq,
      );
      setTriggerTableDiscount(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
      reset();
    } catch (error: any) {
      console.log("error", error);
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setOpenModal({ ...openModal, addModal: false });
    }
  };

  const defaultCurrency = currencyDiscount ? currencyDiscount.find((item: any) => item.currency_name.includes("THB"))?._id || '' : "";

  return (
    <>
      <ModalCustom
        open={openModal.addModal}
        onClose={handleCloseAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Typography variant="h5" sx={{ color: "#3380FF", p: "1rem" }}>
            {t("title.add-discount")}
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
                {...register("discount_name")}
                data-testid="discount-adddiscount-discountname-text"
                id="discount-name-input"
                label={`${t("placeholder.discount-name")} *`}
                size="medium"
                autoComplete="current-product"
                sx={{ width: "50%" }}
                autoFocus
                error={errors.discount_name ? true : false}
                helperText={errors.discount_name?.message as string}
              />
              {/* discount Active */}
              <FormControl sx={{ width: "50%" }}>
                <InputLabel id="active-label">
                  {t("placeholder.active")}
                </InputLabel>
                <Select
                  data-testid="discount-adddiscount-active-select"
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
              {/* discount type */}
              <FormControl sx={{ width: "50%" }}>
                <InputLabel id="discount-type-label">{`${t(
                  "placeholder.discount-type",
                )} *`}</InputLabel>
                <Select
                  {...register("discount_type")}
                  data-testid="discount-adddiscount-discounttype-select"
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
                {/* discount input type */}
                {discountType == 1 ? (
                  <NumericFormat
                    fullWidth
                    {...register("discount_amount")}
                    label={t("placeholder.discount-amount")}
                    data-testid="discount-adddiscount-amount-select"
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
              {/* discount currency */}
              {discountType == 1 &&
                <FormControl sx={{ width: "50%" }}>
                  <InputLabel id="currency-label">{`${t(
                    "placeholder.currency",
                  )}`}</InputLabel>
                  <Select
                    data-testid="discount-adddiscount-currency-select"
                    label={`${t("placeholder.currency")}`}
                    labelId="currency-label"
                    id="currency"
                    value={selectCurrency ? selectCurrency : defaultCurrency}
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
              {/* Discount description */}
              {/* <TextField
                {...register("description")}
                data-testid="discount-adddiscount-description-text"
                id="description-input"
                label={t("placeholder.description")}
                size="medium"
                autoComplete="current-product"
                sx={{ width: "50%" }}
                error={errors.description ? true : false}
                helperText={errors.description?.message as string}
              /> */}
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
              data-testid="discount-adddiscount-cancel-button"
              onClick={handleCloseAddModal}
              variant="text"
              children={t("button.cancel")}
            />
            <Button data-testid="discount-adddiscount-save-button" type="submit" variant="text" children={t("button.save")} />
          </Box>
        </form>
      </ModalCustom>
    </>
  );
}
Component.displayName = "DiscountAddModal";
