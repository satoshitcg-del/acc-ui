import React, { useEffect } from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Fab,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import { useForm } from "react-hook-form";
// i18n
import { useTranslation } from "react-i18next";
// Layout
import Loading from "@/layout/components/loading/Loading.js";
import ModalCustom from '@/layout/components/modal/Modal.js';
import { ProductMasterType, ValidateMessage } from "@/core/enum.js";
import { IDiscountResponseBase, IUpdateCustomerProductReq } from "@/core/interface/services";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
// service
import DiscountService from "@/services/DiscountService";
import CustomerService from "@/services/CustomerService";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { replaceHttpsLinkNote } from "@/core/utils";
import { NumericFormat } from "react-number-format";
import { green, red } from "@mui/material/colors";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PrefixService from "@/services/PrefixService";
import { useFetchClientNameList } from "@/core/hooks/useFetchClientNameList";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";

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

export interface IProducts {
  customerName?: string;
  productName?: string;
  discounts: string[];
  prefix?: string;
  deposit?: number;
}

export default function Component(props: any) {
  const {
    openModal,
    setOpenModal,
    editCustomer,
    setEditCustomer,
    customer_id,
    setUpdateProduct,
    updateProduct,
    fiatCurrency,
    cryptoCurrency,

  } = props;
  const { clientList } = useFetchClientNameList();
  const { getInfoByPrefix } = PrefixService()
  const { getDiscountsForCustomer } = DiscountService();
  const { updateCustomerProduct, getPrefixAutoPlayList } = CustomerService();
  const [discounts, setDiscounts] = React.useState<IDiscountResponseBase[] | []>([]);
  const { t } = useTranslation();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  const [backDrop, setBackDrop] = React.useState(false);
  const [prefix, setPrefix] = React.useState<string>(editCustomer?.data?.prefix_name)
  const [deposit, setDeposit] = React.useState<number>(editCustomer?.data?.deposit)
  const [clientName, setClientName] = React.useState<string>(editCustomer?.data?.client_name)
  const [autoProduct, setAutoProduct] = React.useState<string>(editCustomer?.data?.auto_product)
  const [agentId, setAgentId] = React.useState<string>(editCustomer?.data?.agent_id)
  const [selectDiscount, setSelectDiscount] = React.useState(editCustomer?.data?.discounts?.map((discount: any) => discount?.discount_id))
  const [openingDate, setOpeningDate] = React.useState(editCustomer?.data?.opening_date)
  const [closingDate, setClosingDate] = React.useState(editCustomer?.data?.closing_date)
  const [selectCryptoCurrency, setSelectCryptoCurrency] = React.useState(editCustomer?.data?.cryptocurrency_id)
  const [selectFiatCurrency, setSelectFiatCurrency] = React.useState(editCustomer?.data?.fiat_currency_id)
  const [description, setDescription] = React.useState<string>(replaceHttpsLinkNote(editCustomer?.data?.note));
  const [depositCurrency, setDepositCurrency] = React.useState(editCustomer?.data?.deposit_currency || "USDT")

  React.useEffect(() => {
    fetchDiscountValue()
  }, [selectFiatCurrency]);

  const fetchDiscountValue = async () => {
    try {
      const res = await getDiscountsForCustomer(editCustomer?.data?.product_type === ProductMasterType.SPORT_BOOK_V2 ? selectCryptoCurrency : selectFiatCurrency);
      const discountLists = res?.data || []
      setDiscounts(discountLists);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code))
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({

  });

  const handleCloseEditModal = () => {
    setOpenModal({ ...openModal, editModal: false });
    reset();
  }

  const onChangeDescription = (editorState: string) => {
    setDescription(editorState);
  };

  const onSubmitEditModal = async (data: any) => {
    try {
      const openingDateFormat = handleFormatDate(openingDate)
      const closingDateFormat = handleFormatDate(closingDate)
      const body: IUpdateCustomerProductReq = {
        "active": editCustomer?.data.active,
        "customer_id": customer_id,
        "customer_product_id": editCustomer?.data.customer_product_id,
        "client_name": clientName,
        "agent_id": agentId.toLocaleLowerCase(),
        "deposit": deposit ? parseFloat(`${deposit}`) : 0,
        "discounts": selectDiscount,
        "prefixes": prefix,
        "product_id": editCustomer.data.product_id,
        "fiat_currency_id": selectFiatCurrency,
        "cryptocurrency_id": selectCryptoCurrency,
        "opening_date": openingDateFormat || "",
        "closing_date": closingDateFormat || "",
        "note": description,
        "deposit_currency": depositCurrency
      }

      if (autoProduct) {
        body.auto_product = autoProduct
      }

      setBackDrop(true)
      const res = await updateCustomerProduct(body);
      setBackDrop(false)
      setOpenModal({ ...openModal, editModal: false });
      alertSuccess(TranslateErrorCode(res?.code));
      setUpdateProduct(!updateProduct)
    } catch (error: any) {
      setBackDrop(false)
      alertError(TranslateErrorCode(error?.response?.data?.code));
    } finally {
      setBackDrop(false)
    }
  };

  const handleSelectDiscountChange = (event: SelectChangeEvent<typeof discounts>) => {
    let checkDiscount = event.target.value as unknown as string[]
    checkDiscount = checkDiscount.filter(e => e !== undefined)
    const {
      target: { value }
    } = event;
    setSelectDiscount(typeof value === "string" ? value.split(",") : checkDiscount);

  };

  const handleChangeDeposit = (values: any) => {
    setDeposit(values.floatValue);
  };


  const handleChangeClientName = (event: any) => {
    setClientName(event.target.value as string);
  };

  const handleChangeAgentId = (event: any) => {
    setAgentId(event.target.value as string);
  };

  const handleChangePrefix = (event: any) => {
    setPrefix(event.target.value.toUpperCase() as string);
  };

  const handleOpeningDate = (opening_date: any) => {
    const dateObject = dayjs(opening_date);
    // Check if opening_date exceeds closing_date
    if (closingDate && dateObject.isAfter(dayjs(closingDate))) {
      setClosingDate(null);
    }
    setOpeningDate(opening_date)
  };

  const handleClosingDate = (closing_date: any) => {
    setClosingDate(closing_date)
  }

  const handleFormatDate = (date: any) => {
    let localDateString: string = ""
    if (date) {
      const dateObject = dayjs(date);
      localDateString = dateObject.format('YYYY-MM-DD');
    }
    return localDateString
  }

  const handleChangeCurrency = (event: any) => {
    setSelectDiscount([])
    setSelectFiatCurrency(event.target.value)
  }

  const [syncLoading, setSyncLoading] = React.useState(false)
  const [isSyncStatus, setIsSyncStatus] = React.useState(false)
  const [isSyncIcon, setIsSyncIcon] = React.useState(false)
  const [isFixCurrenct, setIsFixCurrenct] = React.useState(editCustomer?.data?.client_name && editCustomer?.data?.agent_id ? true : false)
  const handleSyncPrefix = async (prefix: string) => {
    try {
      setSyncLoading(true)
      const res = await getInfoByPrefix(prefix)
      const currencyId = fiatCurrency.find((currency: any) => currency.currency_name === res?.data?.currency)?._id || null;
      if (res?.data?.agentId && res?.data?.web) {
        if (res?.data.isActive) {
          setAgentId(res?.data?.agentId)
          setClientName(res?.data?.web)
          setSelectFiatCurrency(currencyId)
          setOpeningDate(dayjs(new Date(res?.data?.createdDate)))
          setSyncLoading(false)
          setIsSyncStatus(true)
          setIsSyncIcon(true)
          setIsFixCurrenct(true)
        } else {
          setAgentId('')
          setClientName('')
          setSyncLoading(false)
          setIsSyncStatus(false)
          setIsSyncIcon(true)
          setIsFixCurrenct(false)
          alertError(t('alert.prefix-inactive'));
        }
      } else {
        setAgentId('')
        setClientName('')
        setOpeningDate('')
        setSyncLoading(false)
        setIsSyncStatus(false)
        setIsSyncIcon(true)
        setIsFixCurrenct(false)
        alertError(t(`alert.synce-prefix-fail`));
      }
    } catch (error: any) {
      console.log(error)
      setSyncLoading(false)
      setIsSyncStatus(false)
      setIsSyncIcon(false)
      setIsFixCurrenct(false)
      if (error?.response?.data?.code) {
        alertError(t(`error.${error?.response?.data?.code}`));
      }
    }
  }

  const handleChangeCurrencyDeposit = (event: any) => {
    setDepositCurrency(event.target.value as string);
  };

  // Get Prefixx Auto Play
  const [prefixAutoPlay, setPrefixAutoPlay] = React.useState<[]>([])
  const [openPrefixAutoPlay, setOpenPrefixAutoPlay] = React.useState(false);
  const [prefixAutoPlayLoading, setPrefixAutoPlayLoading] = React.useState(false);
  const handleOpenPrefixAuto = async () => {
    try {
      setOpenPrefixAutoPlay(true);
      setPrefixAutoPlayLoading(true);
      const response = await getPrefixAutoPlayList(editCustomer?.data?.product_id);
      setPrefixAutoPlayLoading(false);
      setPrefixAutoPlay(response);
    } catch (error: any) {
      alertError(TranslateErrorCode(error?.response?.data?.code));
    } finally {
      setPrefixAutoPlayLoading(false);
    }
  };

  const handleClosePrefixAuto = () => {
    setOpenPrefixAutoPlay(false);
    setPrefixAutoPlay([])
  };

  return (

    <ModalCustom
      open={openModal.editModal}
      onClose={handleCloseEditModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backDrop || clientList?.length == 0}
        >
          <Loading />
        </Backdrop>
        <form onSubmit={handleSubmit(onSubmitEditModal)}>
          <Box sx={{ maxHeight: "80vh", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>
              {t("title.edit-product-into")} {editCustomer?.data?.product_name}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "80vh", py: "1rem", overflow: "auto", }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  mr: "0.5rem",
                }}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1rem", }} >
                  <TextField
                    disabled
                    fullWidth
                    sx={{ width: '48%' }}
                    required
                    data-testid="customer-editproduct-productname-text"
                    id="username"
                    label={t("placeholder.product-name")}
                    value={editCustomer?.data?.product_name}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        productName: e.target.value,
                      })
                    }
                  />
                  {editCustomer?.data?.product_type === ProductMasterType.SPORT_BOOK_V2 && clientList?.length > 0 &&
                    <Autocomplete
                      data-testid="customer-formaddproductcustomer-clientname-text"
                      sx={{ width: '48%' }}
                      isOptionEqualToValue={(option: any, value) => option.web === value.web}
                      getOptionLabel={(option) => (option.prefix && option.web ? `${option.prefix} (${option.web})` : '')}
                      options={clientList}
                      noOptionsText={t('placeholder.no-options')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("placeholder.client-name")}
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  {!clientList?.find(client => client.web === clientName) && clientName && (
                                    <ErrorIcon sx={{ color: (theme) => theme.palette.error.main }} />
                                  )}
                                </>
                              ),
                            },
                          }}
                        />
                      )}
                      defaultValue={{ prefix: prefix, web: clientName }}
                      onChange={(event, value) => {
                        setClientName(value?.web)
                        setPrefix(value?.prefix)
                      }}
                    />
                  }
                  {editCustomer?.data?.product_type === ProductMasterType.AUTO_PLAY &&
                    <Autocomplete
                      data-testid="customer-formaddproductcustomer-clientname-text"
                      sx={{ width: '48%' }}
                      isOptionEqualToValue={(option: any, value) => option.agentId === value.agentId}
                      getOptionLabel={(option) => (option.prefix && option.agentId ? `${option.prefix} (${option.agentId})` : '')}
                      onOpen={handleOpenPrefixAuto}
                      onClose={handleClosePrefixAuto}
                      open={openPrefixAutoPlay}
                      options={prefixAutoPlay}
                      loading={prefixAutoPlayLoading}
                      noOptionsText={t('placeholder.no-options')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("placeholder.prefix")}
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              // startAdornment: (
                              //   <>
                              //     {!prefixAutoPlay?.find((client: any) => client.agentId === agentId) && agentId && (
                              //       <ErrorIcon sx={{ color: (theme) => theme.palette.error.main }} />
                              //     )}
                              //   </>
                              // ),
                              endAdornment: (
                                <React.Fragment>
                                  {prefixAutoPlayLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            },
                          }}
                        />
                      )}
                      defaultValue={{ prefix: prefix, agentId: agentId }}
                      onChange={(event, value) => {
                        setAgentId(value?.agentId)
                        setClientName(value?.product)
                        setAutoProduct(value?.product)
                        setPrefix(value?.prefix)
                      }}
                    />
                  }
                  {/* <AutoCompleteCreatePrefixs data-testid="customer-editproduct-prefix-autocomplete" init={{ prefix_id: editCustomer?.data?.prefix_id, prefix_name: editCustomer?.data?.prefix_name }} handle={handleChangeAutocompletePrefixCompany} /> */}
                  {(editCustomer?.data?.product_type === ProductMasterType.AUTO || editCustomer?.data?.product_type === ProductMasterType.AUTO_PLAY) &&
                    <>
                      {editCustomer?.data?.product_type === ProductMasterType.AUTO &&
                        <TextField
                          data-testid="customer-formaddproductpagecustomer-prefix-text"
                          sx={{ width: "48%" }}
                          label={t("placeholder.prefix")}
                          type={"text"}
                          id="prefix"
                          {...register(`prefix`, {
                            maxLength: {
                              value: 255,
                              message: `Prefix ${ValidateMessage.max255}`,
                            },
                          })}
                          value={prefix}
                          onChange={(event) =>
                            handleChangePrefix(event)
                          }
                          error={errors.prefix ? true : false}
                          helperText={errors.prefix?.message as string}
                          slotProps={{
                            input: {
                              endAdornment:
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Box sx={{ position: 'relative' }}>
                                    {editCustomer?.data?.product_type === ProductMasterType.AUTO &&
                                      <Button
                                        size="small"
                                        variant="contained"
                                        sx={{ whiteSpace: "nowrap" }}
                                        disabled={!prefix || syncLoading}
                                        onClick={() => handleSyncPrefix(prefix)}
                                      >
                                        {syncLoading ? t('button.syncing') : t('button.sync')}
                                      </Button>
                                    }
                                    {syncLoading && (
                                      <CircularProgress
                                        size={24}
                                        sx={{
                                          position: 'absolute',
                                          top: '50%',
                                          left: '50%',
                                          marginTop: '-12px',
                                          marginLeft: '-12px',
                                        }}
                                      />
                                    )}
                                  </Box>
                                  {isSyncIcon && (
                                    <Fab
                                      aria-label="save"
                                      color="primary"
                                      size="small"
                                      sx={{
                                        ...(isSyncStatus
                                          ? {
                                            bgcolor: green[500],
                                            "&:hover": {
                                              bgcolor: green[500],
                                            },
                                          }
                                          : {
                                            bgcolor: red[500],
                                            "&:hover": {
                                              bgcolor: red[500],
                                            },
                                          }),
                                        width: 28, // ปรับให้เล็กลง
                                        height: 28, // ปรับให้เล็กลง
                                        minHeight: "unset", // ป้องกันขนาดถูกบังคับโดยค่าเริ่มต้น
                                        pointerEvents: "none",
                                      }}
                                    >
                                      {isSyncStatus ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
                                    </Fab>
                                  )}
                                </Box>
                              ,
                            },
                          }}
                        />
                      }
                      <TextField
                        sx={{ width: "48%" }}
                        label={t("placeholder.agent-id")}
                        type={"text"}
                        id="agent-id"
                        data-testid="customer-editproduct-agent-id-text"
                        {...register("agentId", {
                          maxLength: {
                            value: 255,
                            message: `Agent ID ${ValidateMessage.max255}`,
                          },
                        })}
                        value={agentId}
                        onChange={(event) =>
                          handleChangeAgentId(event)
                        }
                        error={errors.agentId ? true : false}
                        helperText={errors.agentId?.message as string}
                        // disabled={customerProductType !== ProductMasterType.AUTO ? true : false}
                        disabled={true}
                      />
                      {editCustomer?.data?.product_type !== ProductMasterType.AUTO_PLAY &&
                        <TextField
                          sx={{ width: "48%" }}
                          label={t("placeholder.client-name")}
                          type={"text"}
                          id="client-name"
                          data-testid="customer-editproduct-clientname-text"
                          {...register("clientName", {
                            maxLength: {
                              value: 255,
                              message: `Client Name ${ValidateMessage.max255}`,
                            },
                          })}
                          value={clientName}
                          onChange={(event) =>
                            handleChangeClientName(event)
                          }
                          error={errors.clientName ? true : false}
                          helperText={errors.clientName?.message as string}
                          // disabled={editCustomer?.data?.product_type === ProductMasterType.AUTO ? true : false}
                          disabled={true}
                        />
                      }
                    </>
                  }
                  <NumericFormat
                    data-testid="customer-editproduct-deposit-text"
                    sx={{ width: '48%' }}
                    label={t("placeholder.deposit")}
                    variant="outlined"
                    value={deposit === 0 ? "" : deposit}
                    inputProps={{
                      maxLength: 19
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Select
                            value={depositCurrency}
                            onChange={handleChangeCurrencyDeposit}
                            variant="standard"
                            disableUnderline
                          >
                            <MenuItem value="USDT">USDT</MenuItem>
                            <MenuItem value="THB">THB</MenuItem>
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                    id="outlined-basic"
                    error={errors.deposit ? true : false}
                    helperText={errors.deposit?.message as string}
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale={true}
                    allowLeadingZeros={true}
                    customInput={TextField}
                    onValueChange={(values: any) => {
                      handleChangeDeposit(values)
                    }}
                  />
                  {editCustomer?.data?.product_type !== ProductMasterType.DIRECT_API &&
                    <FormControl sx={{ width: editCustomer?.data?.product_type === ProductMasterType.DIRECT_API || editCustomer?.data?.product_type === ProductMasterType.AUTO_PLAY ? "98.7%" : "48%" }}>
                      <InputLabel id="discount-checkbox-label">{t("placeholder.discount")}</InputLabel>
                      <Select
                        labelId="discount-checkbox-label"
                        id="discount-checkbox"
                        data-testid="customer-editproduct-discount-select"
                        multiple
                        value={selectDiscount}
                        // {...register(`discounts`, {
                        //   required: {
                        //     value: true,
                        //     message: `Discount ${ValidateMessage.requiredField}`
                        //   }
                        // })}
                        onChange={handleSelectDiscountChange}
                        input={<OutlinedInput label={t("placeholder.discount")} />}
                        renderValue={(selected) => {
                          const selectedNames = selected.map((id) => {
                            const selectedDiscount: any = discounts.find(
                              (discount: any) => discount.id === id
                            );
                            return selectedDiscount ? selectedDiscount?.discount_name : '';
                          });
                          return selectedNames.join(', ');
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
                            <Checkbox checked={selectDiscount?.indexOf(discount.id) > -1} />
                            <ListItemText primary={discount.discount_name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  }
                  {editCustomer?.data?.product_type !== ProductMasterType.DIRECT_API && editCustomer?.data?.product_type !== ProductMasterType.SPORT_BOOK_V2 &&
                    <>
                      <FormControl sx={{ width: "45.3%" }}>
                        <InputLabel id="demo-simple-select-label">
                          {t("placeholder.currency")}
                        </InputLabel>
                        <Select
                          data-testid="customer-editproduct-currency-select"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectFiatCurrency}
                          label={t("placeholder.currency")}
                          onChange={(event) => handleChangeCurrency(event)}
                          disabled={isFixCurrenct}
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
                      <Typography sx={{ pt: "14px" }}>To</Typography>
                      <FormControl sx={{ width: "45.3%" }}>
                        <InputLabel id="demo-simple-select-label">
                          {t("placeholder.crypto")}
                        </InputLabel>
                        <Select
                          data-testid="customer-editproduct-crypto-select"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectCryptoCurrency}
                          label={t("placeholder.crypto")}
                          onChange={(event) => setSelectCryptoCurrency(event.target.value)}
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: "48%" }}
                      views={['year', 'month', 'day']}
                      label={t("title.opening-date")}
                      value={openingDate ? dayjs(openingDate) : null}
                      onChange={(date) => handleOpeningDate(date)}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          size: 'medium',
                          inputProps: {
                            'data-testid': "customer-editproduct-openingdate-datepicker"
                          }
                        }
                      }}
                    />
                    <DatePicker
                      sx={{ width: "48%" }}
                      views={['year', 'month', 'day']}
                      label={t("title.closing-date")}
                      value={closingDate ? dayjs(closingDate) : null}
                      onChange={(date) => handleClosingDate(date)}
                      minDate={openingDate ? dayjs(openingDate) : undefined}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          size: 'medium',
                          inputProps: {
                            'data-testid': "customer-editproduct-closingdate-datepicker"
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                  <Box sx={{ minHeight: "10rem", width: "99%" }}>
                    <ReactQuill
                      data-testid="customer-addcustomer-note-textarea"
                      style={{ height: "6.5rem" }}
                      theme='snow'
                      value={description}
                      onChange={onChangeDescription}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ marginTop: "1rem" }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              marginTop: "1rem"
            }}
          >
            <Button
              data-testid="customer-editproduct-cancel-button"
              variant="text"
              children={t("button.cancel")}
              onClick={handleCloseEditModal}
            />
            <Button
              data-testid="customer-editproduct-submit-button"
              type="submit"
              variant="text"
              children={t("button.save")}
            />
          </Box>
        </form>
      </>
    </ModalCustom>
  );
}
Component.displayName = "EditProduct";
