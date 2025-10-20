import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Backdrop,
  InputLabel,
  Tooltip,
  Card
} from "@mui/material";
import { CurrencyExchange } from '@mui/icons-material';
import { usePageEffect } from "@/core/page.js";
import { useTranslation } from "react-i18next";

/* Interface && Enum */
import type { IrowsProductManagement, IrowsProductName } from "../props";
import { ProductMasterType, Status, StatusCode } from "@/core/enum"

/* Style */
import { TableRowNotLine, TextFieldUsdt } from "../style/stylemui"
import CurrencySvg from "@/assets/svg/CurrencySvg";

/* Component && Hook && Utils  */
import { ExpandableTableRow } from "./ExpandableTableRow.js";
import { useFetchProductManagement, useCurrencyRate, useConfirm, useCalendar, useTranslate } from "../hooks";
import { dateFormated } from "@/core/utils"
import EmptyTable from "@/layout/components/table/EmptyTable";
import PaginationTable from "@/routes/pagination/Pagination.js"
import Loading from "@/layout/components/loading/Loading.js";

/* State management */
import { useRecoilState } from 'recoil';
import { TriggerTableProductManagement } from "../storerecoil";
import { IProductManagementListData } from "@/core/interface/services";
import { AuthProductManagement } from "./AuthProductManagement";
import ExchangeRateModal from "./ExchangeRateModal";
import theme from "@/routes/customers/components/sub-product-into-customer/theme";
import WinLossPrefixDetailModal from "./WinLossPrefixDetailModal";
import GetWinlossPrefixModal from "./GetWinlossPrefixModal";
import dayjs from "dayjs";
import { useCustomerSearchStore } from "@/core/storerecoil/useCustomerSearchStore";
import { formatDate } from "@/core/dateUtils";
import AutoPlayPrefixModal from "./AutoPlayPrefixModal";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { useTranslateErrorCode } from "../hooks/useErrorCode";
import ProductManagementService from "@/services/ProductManagementService";



interface Column {
  id: string;
  label: string;
  minWidth?: number | string;
  maxWidth?: number | string;
  align?: "right" | "left" | "center";
}

const GroupButtonComponent = (props: { product_id: string, month: string, year: string, status_pdf: string, product_type: string }): ReactNode => {
  const { product_id, month, year, status_pdf, product_type } = props
  const { t } = useTranslation();
  const [isTrigerComfirmbutton, setIsTrigerComfirmbutton] = useState(false);
  const { loadingWL, onSubmitConfirmWL, onSubmitGeneratePdf } = useConfirm(product_id, month, year, setIsTrigerComfirmbutton, product_type);

  const StatusPDF = (staus: string): ReactNode => {
    switch (staus) {
      case Status.success:
        return <Typography variant="body1" component="h6" sx={{ whiteSpace: "nowrap", color: 'status.success' }} >{t('status.success')}</Typography>
      case Status.pending:
        return <Typography variant="body1" component="h6" sx={{ whiteSpace: "nowrap", color: 'status.pending' }} >{t('status.pending')}</Typography>
      case Status.invalid:
        return <Typography variant="body1" component="h6" sx={{ whiteSpace: "nowrap", color: 'status.invalid' }} >{t('status.invalid')}</Typography>
      case Status.no_prefix:
        return <Typography variant="body1" component="h6" sx={{ whiteSpace: "nowrap", color: 'status.not_ready' }} >{t('status.no-prefix')}</Typography>
      case Status.some_prefix_invalid:
        return <Typography variant="body1" component="h6" sx={{ whiteSpace: "nowrap", color: 'status.invalid' }} >{t('status.some-prefix-invalid')}</Typography>
      default:
        break;
    }
  }

  const StatusPending = (): ReactNode => {
    return <Typography variant="body1" component="h6" sx={{ whiteSpace: "nowrap", color: 'status.success' }} >{t('status.system-pending')}</Typography>
  }
  return (
    <>
      <TableCell align="center" >
        <Button
          data-testid="product-management-productmanagementtable-confirmwl-button"
          disabled={loadingWL || status_pdf === Status.no_prefix ? true : false}
          onClick={onSubmitConfirmWL}
          variant="contained"
          sx={{ bgcolor: "button.bg.tertiary" }}>
          <Box className="flex justify-center items-center gap-2">
            {t("button.get-win-lose")}
            {loadingWL ?
              <CircularProgress size={"1rem"} color="inherit" />
              : null}
          </Box>
        </Button>
      </TableCell>
      {/* <TableCell align="center">
        <Button
          disabled={status_pdf === Status.success ? false : true}
          onClick={onSubmitGeneratePdf}
          variant="contained"
          sx={{ bgcolor: "button.bg.primary" }}>
          {t("button.generate-invoice")}
        </Button>
      </TableCell> */}
      <TableCell align="center">
        {isTrigerComfirmbutton ? StatusPending() : StatusPDF(status_pdf)}
      </TableCell>
    </>
  )
}

const CurrencyInputComponent = (props: { id: string, rate: string, currency_type: string, date: string }): ReactNode => {
  const { id, rate, currency_type, date } = props
  const { value, handleChange, onSubmitUpdate, openExchangeRateModal, setOpenModal, formatDate, openModal, currencyRate } = useCurrencyRate(id, rate, currency_type);
  // const [triggerTable, setTriggerTable] = useRecoilState(TriggerTableProductManagement);

  return (
    <Box className={`flex justify-center items-center gap-3`}>
      {/* <TextFieldUsdt
        data-testid="product-management-productmanagementtable-currencytype-text"
        error={(value === "" || Number(value) <= 0)}
        // helperText={}
        label=""
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={`${currency_type}`}
        InputLabelProps={{ shrink: true, }}
        InputProps={{
          endAdornment: <CurrencySvg icon={currency_type} sx={{ marginLeft: "0.5rem" }} />
        }}
      /> */}
      {openModal && (
        <ExchangeRateModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          currencyRate={currencyRate}
          formatDate={formatDate}
          date={date}
        />
      )}
      <IconButton data-testid="product-management-productmanagementtable-exchangeratemodal-button" onClick={() => openExchangeRateModal(date)} sx={{ color: 'button.bg.primary' }}>
        <CurrencyExchange />
      </IconButton>
    </Box>
  )
}
const GetColorByStatusPDF = (staus: string) => {
  switch (staus) {
    case Status.success:
      return theme.palette.success.main
    case Status.pending:
      return theme.palette.primary.main
    case Status.invalid:
      return theme.palette.error.main
    case Status.no_prefix:
      return theme.palette.warning.main
    case Status.some_prefix_invalid:
      return theme.palette.error.main
    default:
      break;
  }
}

export default function Component() {

  const { t } = useTranslation();
  let title = t("title.product-management");
  usePageEffect({ title });

  const columns: readonly Column[] = [
    { id: "billing_cycle", label: t("table.billing-cycle"), minWidth: "10rem", align: "left" },
    { id: "product_name", label: t("table.product-name"), minWidth: "10rem", align: "left" },
    { id: "management", label: t("table.management"), minWidth: "13rem", align: "center" },
    // { id: "generate_pdf", label: t("table.generate-invoice"), minWidth: "7rem", align: "center" },
    { id: "status_pdf", label: t("table.status-pdf"), align: "center" },
    { id: "prefix", label: t("table.prefix"), align: "center" },
    { id: "action_by", label: t("table.action-by"), align: "center" },
    { id: "action_time", label: t("table.action-time"), align: "center" },
  ];
  const { getAutoPlayProductList } = ProductManagementService();
  const { alertError, alertSuccess } = useAlertDialog();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { TranslateMonth } = useTranslate();
  const { productManagementList, loading, fetchProductManagement } = useFetchProductManagement();
  const { resetSearchCustomer } = useCustomerSearchStore();
  const { month, years, selectMonth, selectYear, handleClearSelect, handleMonthChange, handleYearChange } = useCalendar();
  const [productName, setProductName] = useState('');
  const [auth, setAuth] = useState(false)

  const [triggerTable, setTriggerTable] = useRecoilState(TriggerTableProductManagement);


  const handleSearchProductManagement = () => {
    // console.log('active handleSearchProductManagement', { productName: productName, month: selectMonth === 0 ? "" : `${selectMonth}`, year: selectYear === 0 ? "" : `${selectYear}` });
    fetchProductManagement({
      productName: productName,
      month: selectMonth === 0 ? "" : `${selectMonth}`,
      year: selectYear === 0 ? "" : `${selectYear}`
    });
  }

  const handleSearchAllProductManagement = () => {
    // console.log('active handleSearchAllProductManagement');  
    setProductName("")
    handleClearSelect();
    fetchProductManagement({ productName: "", month: null, year: null })
  }

  const handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setProductName(event.target.value as string);

  useEffect(() => {
    handleSearchAllProductManagement();
    resetSearchCustomer();
  }, [])

  useEffect(() => {
    handleSearchProductManagement();
  }, [triggerTable])

  const [openPrefixDetail, setOpenPrefixDetail] = useState(false)
  const [prefixDetail, setPrefixDetail] = useState()
  const [prefixSuccessDetail, setPrefixSuccessDetail] = useState()
  const handleOpenPrefixDetailModal = (product: any) => {
    setPrefixDetail(product.allPrefixName)
    setPrefixSuccessDetail(product.currentPrefixName)
    setOpenPrefixDetail(true)
  }

  const [openGetWinloss, setOpenGetWinloss] = useState(false)
  const [products, setProducts] = useState()
  const [wlDate, setWlDate] = useState<any>()
  const handleOpenGetWinlossPrefixModal = (product: any, month: string, year: string) => {
    setProducts(product)
    setWlDate({
      month: month,
      year: year,
    })
    setOpenGetWinloss(true)
  }
  //Auto Play Prefix Modal
  const [openAutoPlayWinloss, setOpenAutoPlayWinloss] = useState(false)
  const [autoPlayProducts, setAutoPlayProducts] = useState<any>()
  const handleOpenAutoPlayWinlossPrefixModal = async (productId: string, month: string, year: string) => {
    try {
      const res = await getAutoPlayProductList();
      if (res?.code === StatusCode.success) {
        const monthStr = month.padStart(2, "0");
        const autoPlayProducts = {
          product_id: productId,
          month: monthStr,
          year: year,
          products: res?.data?.products
        }
        setAutoPlayProducts(autoPlayProducts)
        setOpenAutoPlayWinloss(true)
      }
    } catch (error: any) {
      alertError(TranslateErrorCode(error?.response?.data?.code));
    }
  }
  return (
    <>
      <Box className={`w-full flex justify-start items-center gap-7`}>
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
      </Box>
      {auth ? (
        <Paper className="w-full mt-5 rounded-md">
          <Box component="form" className="w-full flex justify-end items-center gap-4 p-4" onSubmit={(e) => { e.preventDefault() }}>
            <TextField
              data-testid="product-management-productmanagementtable-productname-text"
              label={t("placeholder.product-name")}
              size="small"
              autoComplete="current-product"
              value={productName}
              onChange={handleProductNameChange}
              className={`w-1/4`}
            />
            {/* <FormControl className="w-48" size="small">
              <InputLabel>{t("placeholder.month")}</InputLabel>
              <Select
                // label={t("placeholder.month")}
                value={String(selectMonth)}
                onChange={handleMonthChange}
                disabled={month.length === 0}
              >
                <MenuItem key={`temp_month`} disabled value={0}>{t("placeholder.month")}</MenuItem>
                {month.map((month, index) => (
                  <MenuItem key={`index ${month.month_name}`} value={month.month_number}>{month.month_name}</MenuItem>
                ))}

              </Select>
            </FormControl> */}
            {/* <FormControl className="w-24" size="small">
              <InputLabel>{t("placeholder.year")}</InputLabel>
              <Select
                id="year"
                // label={t("placeholder.year")}
                value={String(selectYear)}
                onChange={handleYearChange}
              >
                <MenuItem key={`temp_year`} disabled value={0}>{t("placeholder.year")}</MenuItem>
                {years.map((year, index) => (
                  <MenuItem key={`${year}`} value={year}>{year}</MenuItem>
                ))}

              </Select>
            </FormControl> */}
            <Box className={`flex gap-3`}>
              <Button data-testid="product-management-productmanagementtable-search-button" variant="contained" color="primary" type="submit" onClick={handleSearchProductManagement} children={t("button.search")} />
              <Tooltip arrow title={t('tooltip.all-product-management')} placement="top">
                <Button data-testid="product-management-productmanagementtable-all-button" variant="contained" color="secondary" onClick={handleSearchAllProductManagement} children={t("button.all")} />
              </Tooltip>
            </Box>
          </Box>

          <TableContainer className='rounded-md' sx={{ overflow: "auto" }} >
            <Table aria-label="sticky table">
              <TableHead sx={(theme) => ({
                backgroundColor: theme.palette.example.tableHeader,
                '& .MuiTableCell-root': {
                  color: 'white',
                },
              })}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: 'bold' }} sx={{ py: 1 }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {productManagementList?.map((row: IProductManagementListData, index) => {
                  // console.log('row =======>', row.month, row.year);
                  return (
                    <ExpandableTableRow key={`ExpandableTable ${index}`}
                      firstTableCell={<Typography component="h6" variant="body2">{TranslateMonth(Number(row.month)) + `/${row.year}`}</Typography>}
                      expandComponent={
                        row.product?.map((row_product: any, index: number) => {
                          return (
                            <TableRowNotLine key={`rowProduct-${index}`}>
                              <TableCell align="left">
                                {""}
                              </TableCell>
                              <TableCell>{row_product.product_name}</TableCell>
                              <GroupButtonComponent product_id={row_product.product_id} month={row.month} year={row.year} status_pdf={row_product.status_pdf} product_type={row_product.product_type} />
                              <TableCell align="left">
                                <Box className={`text-center`}>
                                  <Button data-testid="prefix-detail"
                                    disabled={row_product.allPrefixName.length === 0}
                                    onClick={() => {
                                      row_product.product_type === ProductMasterType.AUTO_PLAY ? handleOpenAutoPlayWinlossPrefixModal(row_product?.product_id, row.month, row.year) : handleOpenGetWinlossPrefixModal(row_product, row.month, row.year)
                                    }}
                                    variant="contained"
                                    sx={{
                                      borderStyle: "ridge",
                                      borderColor: GetColorByStatusPDF(row_product.status_pdf),
                                      borderWidth: "1px",
                                      bgcolor: "background.paper",
                                      color: GetColorByStatusPDF(row_product.status_pdf),
                                    }}>
                                    {`${row_product.currentPrefixName.length}/${row_product.allPrefixName.length}`}
                                  </Button>
                                </Box>
                              </TableCell>
                              <TableCell align="left">
                                <Box className={`text-center`}>
                                  {row_product.action_by}
                                </Box>
                              </TableCell>
                              <TableCell align="left">
                                <Box className={`text-center`}>
                                  {formatDate(row_product.action_time)}
                                </Box>
                              </TableCell>
                            </TableRowNotLine>
                          )
                        })
                      }
                    >
                      <TableCell component="th" scope="row">
                        {row.product?.length ? `${row.product?.length} ${t("table.product")}` : `0 ${t("table.product")}`}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row">
                        <CurrencyInputComponent id={row.billing_cycle_id} rate={row.rate} currency_type={row.currency_type} date={row.billing_cycle} />
                      </TableCell>
                      <TableCell component="th" scope="row">
                      </TableCell>
                      <TableCell component="th" scope="row">
                      </TableCell>
                      {/* <TableCell component="th" scope="row">
                      </TableCell> */}
                      <TableCell component="th" scope="row">
                      </TableCell>
                      <TableCell component="th" scope="row">
                      </TableCell>
                    </ExpandableTableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {Array.isArray(productManagementList) && productManagementList?.length > 0 ?
            null :
            <>
              <Box className="min-h-[40dvh]">
                {loading ?
                  <Box className="flex justify-center h-[55dvh]">
                    <Box className=" flex items-center  w-[15rem]">
                      <Loading />
                    </Box>
                  </Box>
                  : <EmptyTable />}
              </Box>
            </>
          }
          <Box className="h-14" />
        </Paper>
      ) : (
        <Box className="w-full h-full">
          <Card className="w-full h-full mt-4 pt-20 pb-6">
            <AuthProductManagement setAuth={setAuth} />
          </Card>
        </Box>
      )
      }
      {openPrefixDetail &&
        <WinLossPrefixDetailModal openPrefixDetail={openPrefixDetail} setOpenPrefixDetail={setOpenPrefixDetail} prefixDetail={prefixDetail} prefixSuccessDetail={prefixSuccessDetail} />
      }
      {openGetWinloss &&
        <GetWinlossPrefixModal openGetWinloss={openGetWinloss} setOpenGetWinloss={setOpenGetWinloss} products={products} wlDate={wlDate} setTriggerTable={setTriggerTable} triggerTable={triggerTable} />
      }
      {openAutoPlayWinloss &&
        <AutoPlayPrefixModal open={openAutoPlayWinloss} setOpen={setOpenAutoPlayWinloss} autoPlayProducts={autoPlayProducts} setTriggerTable={setTriggerTable} triggerTable={triggerTable} />
      }
    </>

  );
}
Component.displayName = "ProductManagementTable";
