import ModalCustom from "@/layout/components/modal/Modal.js";
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
import { PricingType, ProductMasterType, SubProductMasterType, ValidateMessage, sweetalert } from "@/core/enum";
import Loading from "@/layout/components/loading/Loading";
import { ActiveTypeBoolean } from "@/core/constant";
import { IAddCustomerSubProductReq } from "@/core/interface/services";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
// service
import CustomerService from "@/services/CustomerService";
import { NumericFormat } from "react-number-format";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import PricingGroupService from "@/services/PricingGroupService";
import { useFetchDiscountAndPricingGroupbyFiatId } from "./hooks/useFetchDiscountAndPricingGroupbyFiatId";

interface ComponentProps {
  openModal: any;
  setOpenModal: any;
  subProductsList: any;
  product: any;
  customer: any;
  setSignInAlert?: any;
  setTriggerSubProduct: any;
  triggerSubProduct: boolean;
  fiatCurrency: any[];
  cryptoCurrency: any[];
  productType?: string;
}

export interface ISubProducts {
  subProductId: string;
  prefix?: any[];
  quantity?: number;
  clientName?: string;
  detail?: string;
  discounts?: string[];
  note?: string;
  fiat_currency_id?: string;
  cryptocurrency_id?: string;
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
  const { addSubProductToCustomer } = CustomerService();
  const { getPricingGroupSelect } = PricingGroupService();
  const {
    openModal,
    setOpenModal,
    subProductsList,
    product,
    customer,
    setTriggerSubProduct,
    triggerSubProduct,
    fiatCurrency,
    cryptoCurrency,
    productType,
  } = props;
  const [dataAddSubProducts, setDataAddSubProducts] = useState<ISubProducts[]>([
    {
      subProductId: "",
      prefix: [],
      quantity: 1,
      clientName: "",
      detail: "",
      discounts: [],
      note: "",
    },
  ]);

  const defaultFiat = fiatCurrency ? fiatCurrency.find((item: any) => item.currency_name.includes("THB"))?._id || '' : "";
  const defaultCrypto = cryptoCurrency ? cryptoCurrency.find((item: any) => item.currency_name.includes("USDT"))?._id || '' : "";
  const [pricingSelect, setPricingSelect] = useState<string>("")
  const [subProductListSelect, setSubProductListSelect] = useState("");
  // const [prefixId, setPrefixId] = useState<string[]>([]);
  // const [quantityActive, setQuantityActive] = useState<boolean>(false)
  const [quantity, setQuantity] = useState<number>(1);
  const [selectDiscounts, setSelectDiscounts] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<boolean>(true);
  const [prefix, setPrefix] = useState<string[]>([]);
  const [backDrop, setBackDrop] = useState(false);
  const [pricingType, setPricingType] = useState<string>(PricingType.DEFAULT)
  const [price, setPrice] = useState('')
  const [subproductType, setSubproductType] = useState('')
  const [inputPrefixValue, setInputPrefixValue] = useState<string>("");
  const [fiatCurrencyId, setFiatCurrencyId] = useState<string>(defaultFiat);
  const [cryptoCurrencyId, setCryptoCurrencyId] = useState<string>(defaultCrypto);
  const handleCloseAddModal = () => {
    clearData();
    setOpenModal({ ...openModal, addModal: false });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });

  const onHandleSubmitAddSubProduct = async () => {
    try {
      setBackDrop(true);
      const bodyReq: IAddCustomerSubProductReq = {
        active: status,
        customer_id: customer.customerId,
        customer_product_id: customer.customerProductId,
        sub_product_id: dataAddSubProducts[0].subProductId,
        product_links: prefix,
        quantity: Number(quantity),
        price: Number(price),
        pricing_type: pricingType,
        pricing_group_id: pricingType === PricingType.DEFAULT ? pricingSelect : '',
        discounts: dataAddSubProducts[0].discounts,
        fiat_id: fiatCurrencyId,
        crypto_id: cryptoCurrencyId,
      };

      if (dataAddSubProducts[0].detail !== "") {
        bodyReq.detail = dataAddSubProducts[0].detail;
      }
      if (dataAddSubProducts[0].note !== "") {
        bodyReq.note = dataAddSubProducts[0].note;
      }

      const res = await addSubProductToCustomer(bodyReq);
      setBackDrop(false);
      alertSuccess(TranslateErrorCode(res?.code));
      setTriggerSubProduct(!triggerSubProduct);
    } catch (error: any) {
      setBackDrop(false);
      alertError(TranslateErrorCode(error?.response?.data?.code));
    } finally {
      setBackDrop(false);
      clearData();
      setOpenModal({ ...openModal, addModal: false });
    }
  };

  const handleChangeSubProductList = (index: number, event: any) => {
    setSubproductType(subProductsList.find((sproduct: any) => sproduct.id === event.target.value)?.type);
    console.log("subproductType :", subProductsList.find((sproduct: any) => sproduct.id === event.target.value).type);

    setSubProductListSelect(event.target.value);
    dataAddSubProducts[index] = {
      ...dataAddSubProducts[index],
      subProductId: event.target.value,
    };
    setPricingSelect('')
    setPrice('')
    setDataAddSubProducts(dataAddSubProducts);
  };


  const handleChangeNote = (index: number, event: any) => {
    dataAddSubProducts[index] = {
      ...dataAddSubProducts[index],
      note: event,
    };
    setDataAddSubProducts(dataAddSubProducts);
    setNote(event as string);
  };

  const handleStatusChange = (index: number, event: any) => {
    setStatus(event.target.value);
  };

  const handlePricingGroupChange = (event: any) => {
    const selectedId = event.target.value;
    const selectedPricing = pricingGroup.find((pricing: any) => pricing.id === selectedId);
    setPrice(selectedPricing ? selectedPricing.price : "")
    setValue("price", selectedPricing ? selectedPricing.price : "");
    defaultPriceFromGroupPrice(event.target.value)
    setPricingSelect(event.target.value);
  };

  const handleChangeDiscount = (
    index: number,
    event: SelectChangeEvent<string[]>,
  ) => {

    let checkDiscount = event.target.value as unknown as string[]
    checkDiscount = checkDiscount.filter(e => e !== undefined)
    dataAddSubProducts[index] = {
      ...dataAddSubProducts[index],
      discounts: [...checkDiscount],
    };
    setDataAddSubProducts([...dataAddSubProducts]);
    const {
      target: { value },
    } = event;
    setSelectDiscounts(typeof value === "string" ? value.split(",") : checkDiscount);
  };

  const clearData = () => {
    reset();
    setSubProductListSelect("");
    setQuantity(1);
    setSelectDiscounts([]);
    setStatus(true);
    setNote("");
    setDataAddSubProducts([
      {
        subProductId: "",
        prefix: [],
        quantity: 1,
        detail: "",
        discounts: [],
        note: "",
      },
    ]);
  };

  const handleChangePricingType = (type: string) => {
    setPricingSelect('')
    setPrice('')
    setPricingType(type)
  }

  const defaultPriceFromGroupPrice = (pricing_id: string) => {
    const initPrice = pricingGroup.filter((item: any) => item.id == pricing_id)
    setPrice(initPrice[0]?.price.toString())

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
    dataAddSubProducts[0] = {
      ...dataAddSubProducts[0],
      fiat_currency_id: event.target.value,
      discounts: [],
    };
    setDataAddSubProducts(dataAddSubProducts);
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
      open={openModal.addModal}
      onClose={handleCloseAddModal}
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
        <form onSubmit={handleSubmit(onHandleSubmitAddSubProduct)}>
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
              {`${t("title.add-sub-product-to-customer")} ${product.productName}`}
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
                  labelId="sub-product-name-select-label"
                  data-testid="customer-addsubproduct-subproductname-select"
                  id="sub-product-name-select"
                  value={subProductListSelect}
                  label={t("placeholder.sub-product-name")}
                  {...register("subProductName", {
                    required: {
                      value: true,
                      message: t('validate.sub-product-name-require'),
                    },
                  })}
                  error={Boolean(errors?.["subProductName"])}
                  onChange={(event: SelectChangeEvent<string>) => {
                    handleChangeSubProductList(0, event);
                  }}
                >
                  {subProductsList && subProductsList.length > 0 ? (
                    subProductsList.map((subProductList: any, index: number) => (
                      <MenuItem
                        key={`menu-${index}`}
                        value={subProductList.id || ""}
                      >
                        {subProductList.product_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      {t('placeholder.no-options')}
                    </MenuItem>
                  )}
                </Select>
                <FormHelperText
                  id="sub-product_name-text"
                  sx={{ color: "red" }}
                >
                  {errors?.["subProductName"]?.message as string}
                </FormHelperText>
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <InputLabel id="demo-simple-select-label">
                  {t("placeholder.status")}
                </InputLabel>
                <Select
                  data-testid="customer-addsubproduct-status-select"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={String(status)}
                  label={t("placeholder.status")}
                  onChange={(event: SelectChangeEvent<string>) => {
                    handleStatusChange(0, event);
                  }}
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
              <TextField
                inputProps={{ readOnly: true }}
                // disabled={prefix.length > 0 ? true : false}
                data-testid="customer-addsubproduct-quantity-text"
                label={t("placeholder.quantity")}
                type="number"
                id={t("placeholder.quantity")}
                autoComplete="current-quantity"
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
                sx={{ width: "48%" }}
                disableClearable
                options={[]} // No dropdown options
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
                        dataAddSubProducts[0] = {
                          ...dataAddSubProducts[0],
                          cryptocurrency_id: event.target.value,
                        };
                        setDataAddSubProducts(dataAddSubProducts);
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
                        //   message: t('validate.pricing-name-require')
                        // }
                      })}
                      error={Boolean(errors?.["pricingGroupName"])}
                      onChange={(event: SelectChangeEvent<string>) => {
                        handlePricingGroupChange(event);
                      }}
                    >
                      {pricingGroup?.length == 0 && (
                        <MenuItem>
                          {t('placeholder.no-pricing')}
                        </MenuItem>
                      )}
                      {pricingGroup?.map((pricing: any, index: number) => (
                        <MenuItem
                          key={`PricingGroup[${index}]${pricing.id}`}
                          value={pricing.id}
                        >
                          {pricing.pricing_name} ({pricing.price})
                        </MenuItem>
                      ))}
                    </Select>
                    {pricingType === PricingType.DEFAULT && <FormHelperText id="customer-name-text" sx={{ color: "red" }}>{errors?.["pricingGroupName"]?.message as string}</FormHelperText>}
                  </FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={pricingType}
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
                    <FormControlLabel disabled={subproductType == SubProductMasterType.WINLOSE} sx={{ marginY: "8px", marginLeft: "0px" }} value={PricingType.DEFAULT} control={<Radio />} label={t('modal.group-price')}
                      onClick={(event) => handleChangePricingType((event.target as HTMLInputElement).value)} />
                    <FormControlLabel disabled={subproductType == SubProductMasterType.WINLOSE} sx={{ marginY: "8px", marginLeft: "0px" }} value={PricingType.CUSTOM} control={<Radio />} label={t('modal.custom-price')}
                      onClick={(event) => handleChangePricingType((event.target as HTMLInputElement).value)} />
                  </RadioGroup>
                  <NumericFormat
                    data-testid="add-customer-subproduct-price"
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
                  data-testid="customer-addsubproduct-discount-select"
                  labelId="discount-checkbox-label"
                  id="discount-checkbox"
                  multiple
                  value={selectDiscounts}
                  onChange={(event: SelectChangeEvent<string[]>) =>
                    handleChangeDiscount(0, event)
                  }
                  input={<OutlinedInput label="Discount" />}
                  renderValue={(selected) => {
                    const selectedNames = selected.map((id) => {
                      const selectedDiscount: any = discounts.find(
                        (discount: any) => discount.id === id,
                      );
                      return selectedDiscount
                        ? selectedDiscount?.discount_name
                        : "";
                    });
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
                  handleChangeNote(0, event);
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
                data-testid="customer-addsubproduct-cancel-button"
                variant="text"
                children={t("button.cancel")}
                onClick={handleCloseAddModal}
              />
              <Button
                data-testid="customer-addsubproduct-submit-button"
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
Component.displayName = "AddSubProductIntoCustomer";
