import {
  Button,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  Fab,
  Autocomplete,
} from "@mui/material";
import { MenuProps } from "../style/stylemui";
import { useTranslation } from "react-i18next";
import type { IFormBundle } from "../props";
import { ValidateMessage, AccountType, ProductMasterType } from "@/core/enum";
import { useFetchCustomerProducts } from "@/core/hooks";

import { useFetchDiscount } from "../hooks";
import AutoCompleteProduct from "../../auto-complete/AutoCompleteProduct";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { NumericFormat } from "react-number-format";
import { green, red } from "@mui/material/colors";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import CustomerService from "@/services/CustomerService";
import { useAlertDialog } from "../../alert-dialog/useAlertDialog";

interface IProps {
  index: number;
  formBundle: IFormBundle;
  remove: (id: number) => void;
  handleUpdate: any;
  handleUpdateMultiple: any;
  handleUpdateAutocomplete: (
    prefix_id: string,
    id: number,
    field: keyof IFormBundle,
  ) => void;
  handleUpdateProduct: (
    product_id: string,
    id: number,
    field: keyof IFormBundle,
  ) => void;
  register: any;
  errors: any;
  setBackDrop: any;
  // selectPrefix?: any
  // setSelectPrefix?: any
  trigerRemoveFormBundle?: any;
  cryptoCurrency: any;
  fiatCurrency: any;
  defaultFiat: any;
  defaultCrypto: any;
  handleOpeningDate: (
    opening_date: any,
    id: number,
  ) => void;
  handleClosingDate: (
    closing_date: any,
    id: number,
  ) => void;
  handleUpdateClientName: (
    event: any,
    id: number,
    field: keyof IFormBundle,
  ) => void;
  handleUpdateFiatCurrency: (
    event: any,
    id: number,
    field: keyof IFormBundle,
  ) => void;
  handleUpdateDescription: (
    event: any,
    id: number,
    field: keyof IFormBundle,
  ) => void;
  handleSyncPrefix: (prefix: string, id: number, fiatCurrency: any) => void;
}

type Client = {
  prefix: string;
  web: string;
};

export const FormAddProductCustomer = (props: IProps) => {
  const {
    index,
    formBundle,
    remove,
    handleUpdate,
    handleUpdateMultiple,
    handleUpdateProduct,
    register,
    errors,
    cryptoCurrency,
    fiatCurrency,
    defaultCrypto,
    defaultFiat,
    handleOpeningDate,
    handleClosingDate,
    handleUpdateFiatCurrency,
    handleUpdateDescription,
    handleSyncPrefix,

  } = props;
  const { t } = useTranslation();
  const { products } = useFetchCustomerProducts();
  const { discounts } = useFetchDiscount(formBundle?.fiat_currency_id ? formBundle?.fiat_currency_id : formBundle.type === ProductMasterType.SPORT_BOOK_V2 ? defaultCrypto : defaultFiat);

  const { getClientNameList, getPrefixAutoPlayList } = CustomerService();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError } = useAlertDialog();

  // Get Client Name
  const [openClient, setOpenClient] = React.useState(false);
  const [clientLoading, setClientLoading] = React.useState(false);
  const [clientName, setClientName] = React.useState<Client[]>([])

  const handleOpenClientName = async () => {
    try {
      setOpenClient(true);
      setClientLoading(true);
      const response = await getClientNameList();
      setClientLoading(false);
      setClientName(response.data);
    } catch (error: any) {
      alertError(TranslateErrorCode(error?.response?.data?.code));
    } finally {
      setClientLoading(false);
    }
  };

  const handleCloseClientName = () => {
    setOpenClient(false);
    setClientName([])
  };

  // Get Prefixx Auto Play
  const [prefixAutoPlay, setPrefixAutoPlay] = React.useState<Client[]>([])
  const [openPrefixAutoPlay, setOpenPrefixAutoPlay] = React.useState(false);
  const [prefixAutoPlayLoading, setPrefixAutoPlayLoading] = React.useState(false);
  const handleOpenPrefixAuto = async () => {
    try {
      setOpenPrefixAutoPlay(true);
      setPrefixAutoPlayLoading(true);
      const response = await getPrefixAutoPlayList(formBundle.product_id as string);
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
    <>
      {index >= 1 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            gap: "0.5rem",
            mr: "0.5rem",
          }}
        >
          <Button
            data-testid="customer-formaddproductcustomer-remove-button"
            variant="contained"
            color="error"
            children={t("button.remove")}
            onClick={() => remove(formBundle.id)}
          />
        </Box>
      ) : null}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          mr: "0.5rem",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <AutoCompleteProduct
            formBundle={formBundle}
            products={products}
            handle={handleUpdateProduct}
            type={AccountType.Product}
            register={register}
            errors={errors}
          />
          {(!formBundle.type || formBundle.type === ProductMasterType.SPORT_BOOK_V2) &&
            <Autocomplete
              data-testid="customer-formaddproductcustomer-clientname-text"
              sx={{ width: '48%' }}
              open={openClient}
              onOpen={handleOpenClientName}
              onClose={handleCloseClientName}
              isOptionEqualToValue={(option: any, value) => option.web === value.web}
              getOptionLabel={(option) => `${option.prefix} (${option.web})`}
              options={clientName}
              loading={clientLoading}
              loadingText={t('placeholder.loading-data')}
              noOptionsText={t('placeholder.no-options')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("placeholder.client-name")}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {clientLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    },
                  }}
                />
              )}
              {...register(`clientName${formBundle.id}`)}
              value={formBundle?.client_name ? { prefix: formBundle?.prefixes, web: formBundle?.client_name } : null}
              onChange={(event, value) => {
                handleUpdate(value, formBundle.id, "client_name")
                handleUpdate(value, formBundle.id, "prefixes")
              }}
            />
          }
          {(formBundle.type === ProductMasterType.AUTO_PLAY) &&
            <>
              <Autocomplete
                data-testid="customer-formaddproductcustomer-prefix-auto-text"
                sx={{ width: '48%' }}
                open={openPrefixAutoPlay}
                onOpen={handleOpenPrefixAuto}
                onClose={handleClosePrefixAuto}
                isOptionEqualToValue={(option: any, value) => option.agentId === value.agentId}
                getOptionLabel={(option) => `${option.prefix} (${option.agentId})`}
                options={prefixAutoPlay}
                loading={prefixAutoPlayLoading}
                loadingText={t('placeholder.loading-data')}
                noOptionsText={t('placeholder.no-options')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("placeholder.prefix")}
                    slotProps={{
                      input: {
                        ...params.InputProps,
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
                {...register(`prefixes${formBundle.id}`)}
                value={formBundle?.agent_id ? { prefix: formBundle?.prefixes, agentId: formBundle?.agent_id } : null}
                onChange={(event, value) => {
                  handleUpdate(value, formBundle.id, "agent_id")
                  handleUpdate(value, formBundle.id, "auto_product")
                  handleUpdate(value, formBundle.id, "prefixes")
                }}
              />
            </>
          }
          {(formBundle.type === ProductMasterType.AUTO || formBundle.type === ProductMasterType.AUTO_PLAY) && (
            <>
              {formBundle.type === ProductMasterType.AUTO &&
                <TextField
                  data-testid="customer-formaddproductpagecustomer-prefix-text"
                  sx={{ width: "48%" }}
                  label={t("placeholder.prefix")}
                  type={"text"}
                  id="prefix"
                  {...register(`prefixes${formBundle.id}`, {
                    maxLength: {
                      value: 255,
                      message: `Prefix ${ValidateMessage.max255}`,
                    },
                  })}
                  value={formBundle?.prefixes}
                  onChange={(event) => handleUpdate(
                    {
                      ...event,
                      target: {
                        ...event.target,
                        value: event.target.value.toUpperCase(),
                      },
                    },
                    formBundle.id,
                    "prefixes"
                  )}
                  error={errors.prefixes ? true : false}
                  helperText={errors.prefixes?.message as string}
                  slotProps={{
                    input: {
                      endAdornment:
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ position: 'relative' }}>
                            {formBundle.type === ProductMasterType.AUTO &&
                              <Button
                                size="small"
                                variant="contained"
                                sx={{ whiteSpace: "nowrap" }}
                                disabled={!formBundle?.prefixes || formBundle?.sync_loading}
                                onClick={() => handleSyncPrefix(formBundle?.prefixes, formBundle.id, fiatCurrency)}
                              >
                                {formBundle?.sync_loading ? t('button.syncing') : t('button.sync')}
                              </Button>
                            }
                            {formBundle?.sync_loading && (
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
                          {formBundle?.is_sync_icon && (
                            <Fab
                              aria-label="save"
                              color="primary"
                              size="small"
                              sx={{
                                ...(formBundle?.is_sync_status
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
                              {formBundle?.is_sync_status ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />}
                            </Fab>
                          )}
                        </Box>
                      ,
                    },
                  }}
                />
              }
              <TextField
                data-testid="customer-formaddproductcustomer-agentId-text"
                sx={{ width: "48%" }}
                label={t("placeholder.agent-id")}
                type={"text"}
                id="agent-id"
                {...register(`agentId${formBundle.id}`, {
                  maxLength: {
                    value: 255,
                    message: `Agent ID ${ValidateMessage.max255}`,
                  },
                })}
                value={formBundle?.agent_id}
                onChange={(event) => handleUpdate(event, formBundle.id, "agent_id")}
                error={errors.agentId ? true : false}
                helperText={errors.agentId?.message as string}
                // disabled={formBundle.type !== ProductMasterType.AUTO ? true : false}
                disabled={true}
              />
              {formBundle.type !== ProductMasterType.AUTO_PLAY &&
                <TextField
                  data-testid="customer-formaddproductcustomer-clientname-text"
                  sx={{ width: "48%" }}
                  label={t("placeholder.client-name")}
                  type={"text"}
                  id="client-name"
                  {...register(`clientName${formBundle.id}`, {
                    maxLength: {
                      value: 255,
                      message: `Client Name ${ValidateMessage.max255}`,
                    },
                  })}
                  value={formBundle?.client_name}
                  onChange={(event) => handleUpdate(event, formBundle.id, "client_name")}
                  error={errors.clientName ? true : false}
                  helperText={errors.clientName?.message as string}
                  disabled={true}
                />
              }
            </>
          )}
          <NumericFormat
            data-testid="customer-formaddproductcustomer-deposit-text"
            sx={{ width: "48%" }}
            id="outlined-basic"
            label={t("placeholder.deposit")}
            variant="outlined"
            {...register(`deposit${formBundle.id}`, {
              min: {
                value: 0,
                message: `Deposit ${ValidateMessage.positve}`,
              },
            })}
            value={formBundle?.deposit === 0 ? "" : formBundle?.deposit}
            inputProps={{
              maxLength: 19
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Select
                    value={formBundle.deposit_currency}
                    onChange={(e) => handleUpdate(e, formBundle.id, "deposit_currency")}
                    variant="standard"
                    disableUnderline
                  >
                    <MenuItem value="USDT">USDT</MenuItem>
                    <MenuItem value="THB">THB</MenuItem>
                  </Select>
                </InputAdornment>
              ),
            }}
            thousandSeparator
            decimalScale={2}
            allowNegative={false}
            fixedDecimalScale={true}
            allowLeadingZeros={true}
            customInput={TextField}
            onValueChange={(values: any) => {
              handleUpdate(values, formBundle.id, "deposit")
            }}
          />
          {formBundle.type !== ProductMasterType.DIRECT_API &&
            <>
              <FormControl sx={{ width: formBundle.type === ProductMasterType.DIRECT_API || formBundle.type === ProductMasterType.AUTO_PLAY ? "98.7%" : "48%" }}>
                <InputLabel id="discount-checkbox-label">
                  {t("placeholder.discount")}
                </InputLabel>
                <Select
                  data-testid="customer-formaddproductcustomer-discount-select"
                  labelId="discount-checkbox-label"
                  id="discount-checkbox"
                  multiple
                  value={[...(formBundle?.discounts || [])]}
                  onChange={(event) => {
                    handleUpdateMultiple(event, formBundle.id);
                  }}
                  input={<OutlinedInput label={t("placeholder.discount")} />}
                  renderValue={(selected) => {
                    const selectedNames = selected.map((id) => {
                      const selectedDiscount = discounts?.find(
                        (discount) => discount.id === id,
                      );
                      return selectedDiscount ? selectedDiscount.discount_name : "";
                    });
                    return selectedNames.join(", ");
                  }}
                  MenuProps={MenuProps}
                >

                  {discounts == null && (
                    <MenuItem>
                      {t('placeholder.no-discount')}
                    </MenuItem>
                  )}
                  {discounts?.map((discount) => (
                    <MenuItem key={discount.id} value={discount.id}>
                      <Checkbox
                        checked={formBundle?.discounts.indexOf(discount.id) > -1}
                      />
                      <ListItemText primary={discount.discount_name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formBundle.type !== ProductMasterType.SPORT_BOOK_V2 &&
                <>
                  <FormControl sx={{ width: "45.3%" }}>
                    <InputLabel id="demo-simple-select-label">
                      {t("placeholder.currency")}
                    </InputLabel>
                    <Select
                      data-testid="customer-formaddproductcustomer-currency-select"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={formBundle?.fiat_currency_id ? formBundle?.fiat_currency_id : defaultFiat}
                      label={t("placeholder.currency")}
                      onChange={(event) => handleUpdateFiatCurrency(event, formBundle.id, "fiat_currency_id")}
                      disabled={formBundle?.is_fix_currency}
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
                      data-testid="customer-formaddproductcustomer-crypto-select"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={formBundle?.cryptocurrency_id ? formBundle?.cryptocurrency_id : defaultCrypto}
                      label={t("placeholder.crypto")}
                      onChange={(event) => handleUpdate(event, formBundle.id, "cryptocurrency_id")}
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
            </>
          }
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ width: "48%" }}
              label={t("title.opening-date")}
              views={['year', 'month', 'day']}
              value={formBundle.opening_date || null}
              onChange={(date) => handleOpeningDate(date, formBundle.id,)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: 'medium',
                  inputProps: {
                    'data-testid': "customer-formaddproductcustomer-openingdate-datepicker"
                  }
                }
              }}
            />
            <DatePicker
              sx={{ width: "48%" }}
              label={t("title.closing-date")}
              views={['year', 'month', 'day']}
              value={formBundle.closing_date ? dayjs(formBundle.closing_date) : null}
              onChange={(date) => handleClosingDate(date, formBundle.id,)}
              minDate={formBundle.opening_date ? dayjs(formBundle.opening_date) : undefined}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: 'medium',
                  inputProps: {
                    'data-testid': "customer-formaddproductcustomer-closingdate-datepicker"
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
              value={formBundle?.note}
              onChange={(description) => handleUpdateDescription(description, formBundle.id, "note")}
            />
          </Box>
        </Box >
      </Box >
    </>
  );
};
