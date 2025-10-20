import ModalCustom from "@/layout/components/modal/Modal";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { PricingType, ValidateMessage, BooleanString, sweetalert, SubProductMasterType, ProductMasterType } from "@/core/enum";
import Loading from "@/layout/components/loading/Loading";
import { IUpdateCustomerSubProductReq } from "@/core/interface/services";
import { ActiveTypeBoolean } from "@/core/constant";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
// service
import CustomerService from "@/services/CustomerService";
import { replaceHttpsLinkNote } from "@/core/utils";
import { NumericFormat } from "react-number-format";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { useFetchDiscountAndPricingGroupbyFiatId } from "./hooks/useFetchDiscountAndPricingGroupbyFiatId";

interface ComponentProps {
  openModal: any;
  setOpenModal: any;
  subProductsList: any;
  product: any;
  customer: any;
  setSignInAlert?: any;
  subProductDefaultData: any;
  setTriggerSubProduct: any;
  triggerSubProduct: boolean;
  fiatCurrency: any[];
  cryptoCurrency: any[];
  productType?: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Component(props: ComponentProps) {
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  const { updateSubProductToCustomer } = CustomerService();
  const {
    openModal,
    setOpenModal,
    subProductsList,
    product,
    customer,
    subProductDefaultData,
    setTriggerSubProduct,
    triggerSubProduct,
    fiatCurrency,
    cryptoCurrency,
    productType,
  } = props;

  const [prefix, setPrefix] = useState<string[]>(subProductDefaultData?.product_links);
  const [subProductListSelect, _] = useState(subProductDefaultData?.sub_product_id);
  const [selectDiscounts, setSelectDiscounts] = useState(subProductDefaultData?.discounts);
  const [note, setNote] = useState(replaceHttpsLinkNote(subProductDefaultData?.note));
  const [pricingSelect, setPricingSelect] = useState<string>(subProductDefaultData?.pricing_group_id)
  const [pricingType, setPricingType] = useState<string>(subProductDefaultData?.pricing_type ? subProductDefaultData?.pricing_type : PricingType.DEFAULT)
  const [price, setPrice] = useState(subProductDefaultData?.price)
  const [status, setStatus] = useState<boolean>(subProductDefaultData?.active);
  const [backDrop, setBackDrop] = useState(false);
  const [subproductType, setSubproductType] = useState(subProductDefaultData?.sub_product_type);
  const [inputPrefixValue, setInputPrefixValue] = useState<string>("");
  const [fiatCurrencyId, setFiatCurrencyId] = useState<string>(subProductDefaultData?.fiat_id || fiatCurrency.find((item: any) => item.currency_name.includes("THB"))?._id); // subProductDefaultData?.fiat_currency_id
  const [cryptoCurrencyId, setCryptoCurrencyId] = useState<string>(subProductDefaultData?.crypto_id || cryptoCurrency.find((item: any) => item.currency_name.includes("USDT"))?._id); // subProductDefaultData?.cryptocurrency_id

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [quantity, setQuantity] = useState<number>(
    subProductDefaultData?.quantity,
  );

  const onHandleSubmitEditSubProduct = async () => {
    try {
      setBackDrop(true);
      const bodyReq: IUpdateCustomerSubProductReq = {
        active: status,
        customer_id: customer.customerId,
        customer_product_id: customer.customerProductId,
        customer_sub_product_id: subProductDefaultData.customer_sub_product_id,
        discounts: selectDiscounts,
        note: note,
        quantity: Number(quantity),
        product_links: prefix,
        price: Number(price),
        pricing_type: pricingType ? pricingType : PricingType.DEFAULT,
        pricing_group_id: pricingSelect,
        fiat_id: fiatCurrencyId,
        crypto_id: cryptoCurrencyId,
      };
      const res = await updateSubProductToCustomer(
        bodyReq,
      );
      setBackDrop(false);
      alertSuccess(TranslateErrorCode(res?.code));
      setTriggerSubProduct(!triggerSubProduct);
    } catch (error: any) {
      setBackDrop(false);
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setBackDrop(false);
      setOpenModal({ ...openModal, editModal: false });
    }
  };

  const handleCloseEditModal = () => setOpenModal({ ...openModal, editModal: false });

  const handleChangeNote = (event: any) => setNote(event);

  const handleStatusChange = (event: any) => {
    const status: boolean = event.target.value === BooleanString.true
    setStatus(status);
  };

  const handleChangeDiscount = (event: SelectChangeEvent<typeof discounts>) => {
    let checkDiscount = event.target.value as unknown as string[]
    checkDiscount = checkDiscount.filter(e => e !== undefined)
    const { target: { value } } = event;
    setSelectDiscounts(typeof value === "string" ? value.split(",") : checkDiscount);
  };

  const handlePricingGroupChange = (event: any) => {
    defaultPriceFromGroupPrice(event.target.value)
    setPricingSelect(event.target.value);
  };

  const handleChangePricingType = (type: string) => {
    if (subProductDefaultData?.pricing_group_id) {
      const selectedPricing = pricingGroup.find((price: any) => price.id === subProductDefaultData.pricing_group_id);
      if (selectedPricing && pricingType !== PricingType.DEFAULT) {
        setPricingSelect(selectedPricing.id);
        setPrice(selectedPricing.price);
      } else {
        setPricingSelect('')
        setPrice('')
      }
    }
    setPricingType(type)
  }

  const defaultPriceFromGroupPrice = (pricing_id: string) => {
    const initPrice = pricingGroup.filter((item: any) => item.id == pricing_id)
    setPrice(initPrice[0].price.toString())

  }

  const handlePriceChange = (values: any) => {
    setPrice(values.floatValue);
  };

  const handleChangeQuantity = (event: any) => {
    setQuantity(event.target.value)
  }

  // Get Disacount and Pricing-Group by fiat of user-sub-product
  const {
    discounts,
    getDiscountsList,
    pricingGroup,
    getPricingGroup,
  } = useFetchDiscountAndPricingGroupbyFiatId(productType, fiatCurrencyId)

  const handleSelectFiatId = (event: SelectChangeEvent<string>) => {
    setFiatCurrencyId(event.target.value);
    setSelectDiscounts([])
    setPricingSelect('')
    setPrice('')
    getPricingGroup(event.target.value)
    getDiscountsList(event.target.value)
  }

  useEffect(() => {
    getPricingGroup()
    getDiscountsList()
  }, [])

  return (
    <ModalCustom
      open={openModal.editModal}
      onClose={handleCloseEditModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backDrop}
        >
          <Loading />
        </Backdrop>
        <form onSubmit={handleSubmit(onHandleSubmitEditSubProduct)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: "1rem",
              gap: "1.5rem",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "modal.title_color", fontWeight: "500" }}
            >
              {t("title.edit-sub-product-to-customer")} {product.productName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                py: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <FormControl sx={{ width: "48%" }}>
                <InputLabel id="sub-product-name-select-label">
                  {t("placeholder.sub-product-name")}
                </InputLabel>
                <Select
                  data-testid="customer-editsubproduct-subproductname-select"
                  disabled
                  labelId="sub-product-name-select-label"
                  id="sub-product-name-select"
                  value={subProductListSelect}
                  label={t("placeholder.sub-product-name")}
                >
                  {subProductsList?.map(
                    (subProductList: any, index: number) => (
                      <MenuItem
                        key={`menu-${index}`}
                        value={subProductList.id || ""}
                      >
                        {subProductList.product_name}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <InputLabel id="demo-simple-select-label">
                  {t("placeholder.status")}
                </InputLabel>
                <Select
                  data-testid="customer-editsubproduct-status-select"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={String(status)}
                  label={t("placeholder.status")}
                  onChange={(event: SelectChangeEvent<string>) => {
                    handleStatusChange(event);
                  }}
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
              <TextField
                slotProps={{ input: { readOnly: true } }}
                // disabled={prefix.length > 0 ? true : false}
                data-testid="customer-editsubproduct-quantity-text"
                fullWidth
                label={t("placeholder.quantity")}
                type={"number"}
                id="quantity"
                autoComplete="current-quantity"
                size="medium"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: "48%" }}
                value={quantity}
                {...register("Quantity", {
                  min: {
                    value: 1,
                    message: `Quantity ${ValidateMessage.moreThan0}`,
                  },
                })}
                onChange={handleChangeQuantity}
                error={errors.Quantity ? true : false}
                helperText={errors.Quantity?.message as string}
              />
              <Autocomplete
                multiple
                freeSolo
                disableClearable
                options={[]} // No dropdown options
                sx={{ width: "48%" }}
                value={prefix}
                inputValue={inputPrefixValue}
                onInputChange={(event, newInputValue) => {
                  setInputPrefixValue(newInputValue.toUpperCase());
                }}
                onChange={(event, newValue) => {
                  setPrefix(newValue as string[]);
                  newValue.length > 0 ? setQuantity(newValue.length) : setQuantity(1)
                }}
                renderTags={(value: string[], getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={t("placeholder.prefix")}
                    placeholder={t('placeholder.type-and-enter')}
                  />
                )}
              />
              {(productType === ProductMasterType.DIRECT_API || productType === ProductMasterType.SPORT_BOOK_V2) &&
                <>
                  <FormControl sx={{ width: "45.3%" }}>
                    <InputLabel id="demo-simple-select-label">
                      {t("placeholder.currency")}
                    </InputLabel>
                    <Select
                      data-testid="customer-formaddproductcustomer-currency-select"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={fiatCurrencyId || ""}
                      label={t("placeholder.currency")}
                      onChange={(event: SelectChangeEvent<string>) => {
                        handleSelectFiatId(event)
                      }}
                    >
                      {fiatCurrency.map((currency: any) => (
                        <MenuItem
                          key={`Currency ${currency._id}`}
                          value={currency._id}
                        >
                          {currency.currency_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>To</Typography>
                  <FormControl sx={{ width: "45.3%" }}>
                    <InputLabel id="demo-simple-select-label">
                      {t("placeholder.crypto")}
                    </InputLabel>
                    <Select
                      data-testid="customer-formaddproductcustomer-crypto-select"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={cryptoCurrencyId || ""}
                      label={t("placeholder.crypto")}
                      onChange={(event: SelectChangeEvent<string>) => {
                        setCryptoCurrencyId(event.target.value);
                      }}
                    >
                      {cryptoCurrency.map((crypto: any) => (
                        <MenuItem
                          key={`Cypto ${crypto._id}`}
                          value={crypto._id}
                        >
                          {crypto.currency_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              }
              {(subproductType !== SubProductMasterType.WINLOSE && subproductType !== SubProductMasterType.WINLOSE_API) &&
                <>
                  <FormControl sx={{ width: "48%" }}>
                    <InputLabel id="demo-simple-select-label">
                      {t("placeholder.pricing-group-name")}
                    </InputLabel>
                    <Select
                      disabled={subproductType != SubProductMasterType.WINLOSE && pricingType === PricingType.DEFAULT ? false : true}
                      data-testid="customer-addsubproduct-pricing-group-select"
                      labelId="demo-simple-pricing-group-label"
                      id="demo-simple-pricing-group"
                      value={pricingSelect}
                      label={t("placeholder.pricing-group-name")}
                      {...register("pricingGroupName", {
                        // required: {
                        //   value: pricingType === PricingType.DEFAULT ? true : false,
                        //   message: `Pricing group ${ValidateMessage.requiredField}`
                        // }
                      })}
                      error={Boolean(errors?.["pricingGroupName"])}
                      onChange={(event: SelectChangeEvent<string>) => {
                        handlePricingGroupChange(event);
                      }}
                    >
                      {pricingGroup.length == 0 && (
                        <MenuItem>
                          {t('placeholder.no-pricing')}
                        </MenuItem>
                      )}
                      {pricingGroup.map((pricing: any, index: number) => (
                        <MenuItem
                          key={`PricingGroup[${index}]${pricing.id}`}
                          value={pricing.id}
                        >
                          {pricing.pricing_name} ({pricing.price})
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText id="customer-name-text" sx={{ color: "red" }}>{errors?.["pricingGroupName"]?.message as string}</FormHelperText>
                  </FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={pricingType}
                    defaultValue={pricingType}
                    name="radio-buttons-group"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "48%",
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.8rem',
                      },
                      '& .MuiRadio-root': {
                        transform: 'scale(0.9)',
                      }
                    }}
                  >
                    <FormControlLabel disabled={subproductType == SubProductMasterType.WINLOSE} sx={{ marginY: "9px", marginLeft: "0px" }} value={PricingType.DEFAULT} control={<Radio />} label={t('modal.group-price')}
                      onClick={(event) => handleChangePricingType((event.target as HTMLInputElement).value)} />
                    <FormControlLabel disabled={subproductType == SubProductMasterType.WINLOSE} sx={{ marginY: "9px", marginLeft: "0px" }} value={PricingType.CUSTOM} control={<Radio />} label={t('modal.custom-price')}
                      onClick={(event) => handleChangePricingType((event.target as HTMLInputElement).value)} />
                  </RadioGroup>
                  <NumericFormat
                    data-testid="edit-customer-subproduct-price"
                    label={t("placeholder.prices")}
                    autoComplete="price-product"
                    sx={{ width: "48%" }}
                    value={price}
                    {...register("price", {})}
                    error={errors.price ? true : false}
                    helperText={errors.price?.message as string}
                    disabled={subproductType == SubProductMasterType.WINLOSE || pricingType === PricingType.DEFAULT ? true : false}
                    inputProps={{ maxLength: 19 }}
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale={true}
                    allowLeadingZeros={true}
                    customInput={TextField}
                    onValueChange={(values: any) => {
                      handlePriceChange(values)
                    }}
                  />
                </>
              }

              <FormControl sx={{ width: "48%" }}>
                <InputLabel id="discount-checkbox-label">
                  {t("placeholder.discount")}
                </InputLabel>
                <Select
                  data-testid="customer-editsubproduct-discount-select"
                  labelId="discount-checkbox-label"
                  id="discount-checkbox"
                  multiple
                  value={selectDiscounts}
                  onChange={handleChangeDiscount}
                  input={<OutlinedInput label="Discount" />}
                  renderValue={(selected) => {
                    const selectedNames = selected
                      .map((id: any) => {
                        const selectedDiscount: any = discounts.find(
                          (discount: any) => discount.id === id
                        );
                        return selectedDiscount ? selectedDiscount.discount_name : null;
                      })
                      .filter((name: string | null) => name !== null);

                    return selectedNames.join(", ");
                  }}
                  MenuProps={MenuProps}
                >
                  {discounts.length == 0 && (
                    <MenuItem>
                      {t('placeholder.no-discount')}
                    </MenuItem>
                  )}
                  {discounts?.map((discount: any) => (
                    <MenuItem key={discount.id} value={discount.id}>
                      <Checkbox
                        checked={selectDiscounts?.indexOf(discount.id) > -1}
                      />
                      <ListItemText primary={discount.discount_name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minHeight: "9rem", width: "99%" }}>
              <ReactQuill
                data-testid="customer-addcustomer-note-textarea"
                style={{ height: "6.5rem" }}
                theme='snow'
                value={note}
                onChange={(event) => {
                  handleChangeNote(event);
                }}
              />
            </Box>
            <Divider sx={{ marginTop: "1rem" }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              <Button
                data-testid="customer-editsubproduct-cancel-button"
                variant="text"
                children={t("button.cancel")}
                onClick={handleCloseEditModal}
              />
              <Button
                data-testid="customer-editsubproduct-submit-button"
                type="submit"
                variant="text"
                children={t("button.save")}
              />
            </Box>
          </Box>
        </form>
      </>
    </ModalCustom>
  );
}
Component.displayName = "EditSubProductIntoCustomer";
