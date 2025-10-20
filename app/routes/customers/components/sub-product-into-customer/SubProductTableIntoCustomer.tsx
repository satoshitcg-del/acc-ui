import { formatDate } from "@/core/dateUtils.js";
import {
  Topic,
  Delete as DeleteIcon,
  BorderColor as EditIcon,
  ArrowBackIos as BackwardIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Link,
  SelectChangeEvent,
  Modal,
  Divider,
} from "@mui/material";
import {
  Currency,
  subProductColumns,
  subproductModalProps,
} from "../../CustomerProps.js";
import { t } from "i18next";
import React, { useState } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import AddSubProductIntoCustomer from "./AddSubProductIntoCustomer.js";
import SwitchComponent from "@/layout/components/table/SwitchTable.js";
import EditSubProductIntoCustomer from "./EditSubProductIntoCustomer.js";
import PrefixModal from "./PrefixModal.js";
import PaginationMedium from "@/routes/pagination/Pagination.js";
import { boolean } from "yup";
import {
  ModalConfirmDelete,
  useModalConfirmDelete,
} from "@/layout/components/modal-confirm-delete/index.js";
import {
  ConfirmChangeStatusToggle,
  useModalStatusToggle,
} from "@/layout/components/modal-confirm/index.js";
import Loading from "@/layout/components/loading/Loading.js";
import EmptyTable from "@/layout/components/table/EmptyTable.js";
import {
  ICustomerSubProduct,
  ICustomerSubProductResComponents,
  ICustomerSubProductActiveReq,
  ICustomerSubProductReq,
  IGetCustomerProduct,
  IGetPricingListReq,
} from "@/core/interface/services.js";
import { ActiveTypeFilter } from "@/core/constant.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
// service
import DiscountService from "@/services/DiscountService.js";
import CustomerService from "@/services/CustomerService.js";
import ProductService from "@/services/ProductService.js";
import PricingGroupService from "@/services/PricingGroupService";


import Breadcrumb from "@/layout/components/breadcrumb/Breadcrumb.js";
import { replaceHttpsLinkNote } from "@/core/utils/index.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";
import { ProductMasterType } from "@/core/enum.js";


export default function Component() {
  const { getOneDetailProductToCustomer, getOneSubProductCustomer, getOneCustomerProduct, getCryptoCurrency, getFiatCurrency } = CustomerService();
  const { getSubProductListSelect } = ProductService();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError } = useAlertDialog();
  const [pageAmount, setPageAmount] = React.useState({
    count_data: 0,
    count_page: 0,
    row_amount: 0,
  });
  const [openModal, setOpenModal] = React.useState<subproductModalProps>({
    addModal: false,
    editModal: false,
    deleteModal: false,
    prefixModal: false,
  });
  const { state } = useLocation();
  const [customer, setCustomer] = React.useState({
    customerId: "",
    customerProductId: "",
    productId: ""
  });
  const [product, setProduct] = React.useState({
    productId: "",
    productName: "",
  });
  const [filterSubProducts, setFilterSubProducts] = React.useState({
    subProductName: "",
    prefix: "",
    status: "ALL",
  });
  const [subProductsTable, setSubProductTable] = React.useState<
    ICustomerSubProductResComponents[] | []
  >([]);
  const [subProductsList, setSubProductList] = React.useState<Object[]>([]);
  const [subProductDefaultData, setSubProductDefaultData] = React.useState({
    active: boolean,
    customer_sub_product_id: "",
    discounts: [],
    note: "",
    client_name: "",
    detail: "",
    product_links: [],
    quantity: null,
    sub_product_id: "",
    sub_product_name: "",
    sub_product_type: "",
    price: "",
    pricing_type: "",
    pricing_group_id: "",
    cryptocurrency_id: "",
    fiat_currency_id: "",
    crypto_id: "",
    fiat_id: "",
  });
  const navigate = useNavigate();
  const [prefixList, setPrefixList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<string | number>(50);
  const [page, setPage] = React.useState(1);
  const [triggerSubProduct, setTriggerSubProduct] = useState<boolean>(false);
  const navigateToProduct = () => navigate(-1);
  const {
    trigerDelete,
    modalDelete,
    handleOpenModalDeleteCustomerSubProduct,
    handleCloseModalDelete,
    onSubmitDeleteCustomerSubProduct,
  } = useModalConfirmDelete();
  const {
    trigerChangeStatus,
    modalStatusToggle,
    handleOpenModalStatusToggle,
    handleCloseModalStatusToggle,
    onSubmitCustomerSubProductStatusToggle,
  } = useModalStatusToggle<ICustomerSubProductActiveReq>();

  const handleOpenAddProductModal = () => {
    handleGetSubProductsList();
    setCustomer({
      customerId: state.cid,
      customerProductId: state.cpid,
      productId: state.pid
    })
    setOpenModal({ ...openModal, addModal: true });
  };

  const handleOpenEditSubProductModal = (customerSubProductId: string) => {
    handleGetOneSubproduct(customerSubProductId);
    handleGetSubProductsList();
    setCustomer({
      customerId: state.cid,
      customerProductId: state.cpid,
      productId: state.pid
    })
  };
  const showModalConfirmStatus = (
    activeStatus: boolean,
    customerSubProductId: string,
  ) => {
    const bodyReq = {
      active: activeStatus,
      customer_id: state.cid,
      customer_product_id: state.cpid,
      customer_sub_product_id: customerSubProductId,
    };
    handleOpenModalStatusToggle(bodyReq);
  };

  const handleOpenPrefixModal = (prefixList: []) => {
    setPrefixList(prefixList);
    setOpenModal({ ...openModal, prefixModal: true });
  };

  const [openNote, setOpenNote] = React.useState(false);
  const [showNote, setShowNote] = React.useState('');
  const handleOpenNoteModal = (note: string) => {
    setShowNote(note);
    setOpenNote(true);
  }
  const handleCloseNote = () => setOpenNote(false);

  const handleGetSubProductTable = async () => {
    try {
      setLoading(true);
      setProduct({ productId: state.pid, productName: state.pn });
      const bodyReq: ICustomerSubProductReq = {
        customer_id: state.cid,
        customer_product_id: state.cpid,
        product_name: filterSubProducts.subProductName,
        prefix_name: filterSubProducts.prefix,
        active: filterSubProducts.status,
        limit: rowsPerPage,
        page: page,
      };
      const res = await getOneDetailProductToCustomer(
        bodyReq,
      );
      setLoading(false);
      const dataSubProduct = res;
      let rowSubProduct = dataSubProduct?.data
        ? dataSubProduct.data.map((row: any, index: number) => {
          return createSubProductListRows({
            id: (page - 1) * Number(rowsPerPage) + index + 1,
            subProductName: row?.sub_product_name,
            linkProductName: row?.product_links,
            currency: state.product_type === ProductMasterType.DIRECT_API || state.product_type === ProductMasterType.SPORT_BOOK_V2 ? row.fiat_name : state.fccy_name,
            quantity: row?.quantity,
            status: row?.active,
            note: row?.note,
            createAt: row?.created_at,
            updateAt: row?.updated_at,
            action: row?.customer_sub_product_id,
          });
        })
        : [];
      setSubProductTable(rowSubProduct);
      setPageAmount({
        ...pageAmount,
        count_data: res.pagination.total,
        count_page: res.pagination.total_pages,
        row_amount: rowSubProduct?.length,
      });
      if (res?.pagination?.total_pages != 0) {
        if (res?.pagination?.total_pages < res?.pagination?.current_page)
          setPage(res?.pagination?.total_pages);
      }
    } catch (error: any) {
      console.error(error)
      setLoading(false);
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setLoading(false);
    }
  };

  const createSubProductListRows = (
    value: any,
  ): ICustomerSubProductResComponents => {
    return {
      id: value?.id,
      subProductName: (
        <Typography variant="body2">{value?.subProductName}</Typography>
      ),
      linkProductName: buttonShowPrefix(value?.linkProductName as []),
      currency: <Typography variant="body2">{state.product_type === ProductMasterType.AUTO ? state.fccy_name : value?.currency || '-'}</Typography>,
      quantity: <Typography variant="body2">{value?.quantity || '-'}</Typography>,
      status: (
        <SwitchComponent
          status={value?.status}
          showModalConfirmStatus={showModalConfirmStatus}
          id={value?.action}
        />
      ),
      note: (
        value?.note ? (
          <Button
            focusRipple
            onClick={() => handleOpenNoteModal(value.note)}
          >
            Detail
          </Button>
        ) : (
          '-'
        )
      ),
      createAt: (
        <Typography variant="body2">{formatDate(value?.createAt) || '-'}</Typography>
      ),
      updateAt: (
        <Typography variant="body2">{formatDate(value?.updateAt) || '-'}</Typography>
      ),
      action: handleButonAction(value?.action),
    };
  };

  const buttonShowPrefix = (prefixList: []) => {
    return (
      <IconButton
        data-testid="customer-subproducttable-prefix-button"
        disabled={prefixList.length > 0 ? false : true}
        aria-label="prefix"
        sx={{ width: "24px", height: "24px", color: "#2196F3" }}
        onClick={() => {
          handleOpenPrefixModal(prefixList == null ? [] : prefixList);
        }}
      >
        <Topic />
      </IconButton>
    );
  };

  const handleButonAction = (customer_sub_product_id: string) => {
    return (
      <div className="flex justify-center">
        <IconButton
          data-testid="customer-subproducttable-edit-button"
          className="p-5"
          aria-label="edit"
          sx={{ width: "24px", height: "24px", color: "#EF6C00" }} // color use pallete
          onClick={() => {
            handleOpenEditSubProductModal(customer_sub_product_id);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          data-testid="customer-subproducttable-delete-button"
          className="p-5"
          aria-label="delete"
          sx={{ width: "24px", height: "24px", color: "#D32F2F" }}
          onClick={() => {
            handleOpenModalDeleteCustomerSubProduct(customer_sub_product_id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  };

  const handleGetSubProductsList = async () => {
    try {
      const res = await getSubProductListSelect(
        state.pid,
      );
      const subProductList = res.data == null ? [] : res.data;
      setSubProductList(subProductList);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const handledDefaultValueDiscounts = (dataDiscounts: []) => {
    if (dataDiscounts.length > 0) {
      const discountList = dataDiscounts.map(
        (discount: any) => discount.discount_id,
      );
      return discountList;
    }
    return dataDiscounts;
  };

  const handleGetOneSubproduct = async (customer_sub_product_id: string) => {
    try {
      const bodyReq = {
        customer_id: state.cid,
        customer_product_id: state.cpid,
        customer_sub_product_id: customer_sub_product_id,
      };
      const res = await getOneSubProductCustomer(
        bodyReq,
      );
      const subProductOneData: ICustomerSubProduct | any = res?.data;
      const discountArr: any = handledDefaultValueDiscounts(
        subProductOneData?.discounts == null
          ? []
          : subProductOneData?.discounts,
      );
      const prefixList =
        subProductOneData.product_links == null
          ? []
          : subProductOneData.product_links;
      setSubProductDefaultData({
        active: subProductOneData.active,
        customer_sub_product_id: subProductOneData.customer_sub_product_id,
        discounts: discountArr,
        note: subProductOneData.note,
        client_name: subProductOneData.client_name,
        detail: subProductOneData.detail,
        product_links: prefixList,
        quantity: subProductOneData.quantity,
        sub_product_id: subProductOneData.sub_product_id,
        sub_product_name: subProductOneData.sub_product_name,
        price: subProductOneData.price,
        pricing_type: subProductOneData.pricing_type,
        pricing_group_id: subProductOneData.pricing_group.id,
        sub_product_type: subProductOneData.sub_product_type,
        cryptocurrency_id: subProductOneData.crypto_id,
        fiat_currency_id: subProductOneData.fiat_id,
        crypto_id: subProductOneData.crypto_id,
        fiat_id: subProductOneData.fiat_id,
      });
      setOpenModal({ ...openModal, editModal: true });
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const handleSubProductNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) =>
    setFilterSubProducts({
      ...filterSubProducts,
      subProductName: event.target.value as string,
    });

  const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFilterSubProducts({
      ...filterSubProducts,
      prefix: event.target.value.toLocaleUpperCase() as string,
    });

  const handleStatusChange = (event: SelectChangeEvent) =>
    setFilterSubProducts({
      ...filterSubProducts,
      status: event.target.value as string,
    });

  const clearInput = () => {
    setFilterSubProducts({
      subProductName: "",
      prefix: "",
      status: "ALL",
    });
  };

  const onFilterSubProduct = () => {
    setPage(1);
    handleGetSubProductTable();
  };

  React.useEffect(() => {
    handleGetSubProductTable();
  }, [triggerSubProduct, trigerDelete, trigerChangeStatus, rowsPerPage, page]);

  const [cryptoCurrency, setCryptoCurrency] = useState<Currency[]>([])
  const [fiatCurrency, setFiatCurrency] = useState<Currency[]>([])
  const handleGetCryptoCurrency = async () => {
    try {
      const res = await getCryptoCurrency()
      setCryptoCurrency(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetFiatCurrency = async () => {
    try {
      const res = await getFiatCurrency()
      setFiatCurrency(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    handleGetFiatCurrency();
    handleGetCryptoCurrency();
  }, []);
  return (
    <>
      {openNote &&
        <Modal
          open={openNote}
          onClose={handleCloseNote}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            border: '0px',
            borderRadius: '8px',
            boxShadow: 24,
            px: 4,
            pt: 4,
          }}>
            <Box sx={{ maxHeight: "86vh", overflow: "auto", width: "445px" }}>
              <Typography sx={{ p: 1 }} dangerouslySetInnerHTML={{ __html: replaceHttpsLinkNote(showNote) }} />
            </Box>
            <Divider orientation="horizontal" variant="fullWidth" sx={{ mt: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", my: 1 }}>
              <Button data-testid="globalcomponent-customerprofile-close-button" onClick={handleCloseNote}>Close</Button>
            </Box>
          </Box>
        </Modal>
      }
      {openModal.addModal && (
        <AddSubProductIntoCustomer
          openModal={openModal}
          setOpenModal={setOpenModal}
          subProductsList={subProductsList}
          product={product}
          customer={customer}
          setTriggerSubProduct={setTriggerSubProduct}
          triggerSubProduct={triggerSubProduct}
          cryptoCurrency={cryptoCurrency}
          fiatCurrency={fiatCurrency}
          productType={state?.product_type}
        />
      )}

      {openModal.editModal && (
        <EditSubProductIntoCustomer
          openModal={openModal}
          setOpenModal={setOpenModal}
          subProductsList={subProductsList}
          product={product}
          customer={customer}
          subProductDefaultData={subProductDefaultData}
          setTriggerSubProduct={setTriggerSubProduct}
          triggerSubProduct={triggerSubProduct}
          cryptoCurrency={cryptoCurrency}
          fiatCurrency={fiatCurrency}
          productType={state?.product_type}
        />
      )}

      {modalDelete && (
        <ModalConfirmDelete
          title={t("modal.delete-sub-product")}
          description={
            <>
              {t("modal.delete-sub-product-description")}
              <br />
              {t("modal.delete-sub-product-notation")}
            </>
          }
          openModal={modalDelete}
          closeModal={handleCloseModalDelete}
          ConfirmDelete={onSubmitDeleteCustomerSubProduct}
        />
      )}

      {modalStatusToggle && (
        <ConfirmChangeStatusToggle
          openModal={modalStatusToggle}
          closeModal={handleCloseModalStatusToggle}
          save={onSubmitCustomerSubProductStatusToggle}
        />
      )}

      {openModal.prefixModal && (
        <PrefixModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          prefixList={prefixList}
        />
      )}
      <Breadcrumb />
      <Box
        className="h-full"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          minWidth: '1120px',
        }}
      >
        <Box className="flex flex-row items-center gap-6">
          <Link
            data-testid="customer-subproducttable-backpage-link"
            onClick={navigateToProduct}
            underline="none"
            color={"GrayText"}
            sx={{
              cursor: "pointer",
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <BackwardIcon />
          </Link>
          <Typography variant="h4" component={"h1"} whiteSpace={'nowrap'}>
            {state?.pn} {`${state?.prefix ? `(${state?.prefix}) ${state?.product_type === ProductMasterType.AUTO ? `(${state?.fccy_name})` : ""}` : ''} `}
          </Typography>

          <Button
            data-testid="customer-subproducttable-add-button"
            variant="contained"
            color="primary"
            type="submit"
            children={`+ ${t("button.add-sub-product")}`}
            onClick={handleOpenAddProductModal}
          />
        </Box>
        <Paper className="w-full mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div style={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 1,
                  m: 1,
                }}
              >
                <Box className={`flex flex-row flex-wrap justify-end w-full`}>
                  <TextField
                    data-testid="customer-subproducttable-productname-text"
                    id="product-name-input"
                    label={t("placeholder.sub-product-name")}
                    value={filterSubProducts.subProductName}
                    onChange={handleSubProductNameChange}
                    size="small"
                    sx={{ maxWidth: "25%", mr: 2 }}
                    fullWidth
                  />

                  <TextField
                    data-testid="customer-subproducttable-prefix-text"
                    id="prefix-input"
                    label={t("placeholder.prefix")}
                    value={filterSubProducts.prefix}
                    onChange={handlePrefixChange}
                    size="small"
                    sx={{ maxWidth: "25%", mr: 2 }}
                    fullWidth
                  />

                  <FormControl
                    fullWidth
                    style={{
                      maxWidth: "15%",
                      marginRight: "0.5rem",
                    }}
                    size="small"
                  >
                    <InputLabel id="status-label">
                      {t("placeholder.status")}
                    </InputLabel>
                    <Select
                      data-testid="customer-subproducttable-status-select"
                      labelId="status-label"
                      id="status"
                      value={filterSubProducts.status}
                      label={t("placeholder.status")}
                      onChange={handleStatusChange}
                    >
                      {ActiveTypeFilter.map((type: any) => (
                        <MenuItem
                          key={`StatusType ${type.id}`}
                          value={type.type_value.toString()}
                        >
                          {t(`select.${type.type_name}`)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    data-testid="customer-subproducttable-search-button"
                    variant="contained"
                    color="primary"
                    type="submit"
                    children={t("button.search")}
                    onClick={onFilterSubProduct}
                    sx={{
                      width: "7%",
                      height: "39px",
                      marginX: "8px",
                    }}
                  />
                  <Button
                    disabled={
                      !filterSubProducts.subProductName &&
                        !filterSubProducts.prefix &&
                        !filterSubProducts.status
                        ? true
                        : false
                    }
                    data-testid="customer-subproducttable-clear-button"
                    variant="contained"
                    color="secondary"
                    children={t("button.clear")}
                    onClick={clearInput}
                    sx={{
                      width: "7%",
                      height: "39px",
                      marginX: "8px",
                    }}
                  />
                </Box>
              </Box>
            </div>
          </form>
          <TableContainer className='rounded-md'>
            <Table>
              <TableHead sx={(theme) => ({
                backgroundColor: theme.palette.example.tableHeader,
                '& .MuiTableCell-root': {
                  color: 'white',
                  border: `1px solid ${theme.palette.example.inherit}`,
                },
              })}>
                <TableRow>
                  {subProductColumns?.map((column) => (
                    <TableCell
                      key={column.columnId}
                      align={column.align}
                      width={column.width}
                      style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                      sx={{ p: 1 }}
                    >
                      {t(`table.${column.label}`)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={(theme) => ({
                '& .MuiTableCell-root': {
                  border: `1px solid ${theme.palette.example.inherit}`,
                },
              })}>
                {subProductsTable.map((row: any, index: number) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`${row.id}_${index}`}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: (theme) => theme.palette.action.hover,
                      },
                    }}
                  >
                    {subProductColumns.map((column: any) => {
                      const value = row[column.columnId];
                      return (
                        <TableCell
                          key={`${column.columnId}`}
                          align={column.bodyAlign}
                          sx={{ p: 0, px: 1 }}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {subProductsTable.length > 0 || false ? null : (
            <Box className="min-h-[40dvh]">
              {loading ? (
                <Box className="flex justify-center h-[55dvh]">
                  <Box className=" flex items-center  w-[15rem]">
                    <Loading />
                  </Box>
                </Box>
              ) : (
                <EmptyTable />
              )}
            </Box>
          )}
          {subProductsTable.length > 0 && (
            <PaginationMedium
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              dataAmount={pageAmount.count_data}
              pageAmount={pageAmount.count_page}
              rowAmount={pageAmount.row_amount}
            />
          )}
        </Paper>
      </Box>
    </>
  );
}
Component.displayName = "SubProductTableIntoCustomer";
