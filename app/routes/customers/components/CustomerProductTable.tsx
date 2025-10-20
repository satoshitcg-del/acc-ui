import React, { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { ArrowBackIos as BackwardIcon, Info } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

// Customer props
import { type ColumnDetail, discounts } from "../CustomerProps.js";
import type { ICustomerProductActiveReq } from "@/core/interface/services.js";

// Components
import EditProduct from "./product-modal/EditProduct.js";
import Loading from "@/layout/components/loading/Loading.js";
import { ConfirmChangeStatusToggle, useModalStatusToggle } from "@/layout/components/modal-confirm/index.js";
import PaginationMedium from "../../pagination/Pagination.js";

import { ModalConfirmDelete, useModalConfirmDelete } from "@/layout/components/modal-confirm-delete/index.js";
import ModalCustom from "@/layout/components/modal/Modal.js";
import AddCustomerProducts from "@/layout/components/modal-add-product/AddCustomerProducts.js";
import FormLinkModal from "@/layout/components/modal/FormLinkModal.js";

// Icon SVG
import IconCustomerSvg from "@/assets/svg/IconCustomerSvg.js";
import Breadcrumb from "@/layout/components/breadcrumb/Breadcrumb.js";
import EmptyTable from "@/layout/components/table/EmptyTable.js";
import SwitchComponent from "@/layout/components/table/SwitchTable.js";
import { useFetchCustomerProductTable } from "../hooks/useFetchCustomerProductTable.js";
import { useCustomerProfile } from "@/layout/components/modal-customer-profile/hook/useCustomerProfile.js";
import CustomerProfileModal from "@/layout/components/modal-customer-profile/CustomerProfileModal.js";
import { IconMenuSvg } from "@/assets/svg/IconMenuSvg.js";
import RegisterFormService from "@/services/RegisterFormService.js";
// Enum
import { FormLinkStatus, ProductMasterType } from "@/core/enum.js";
import { formatDate } from "@/core/dateUtils.js";
import { ActiveTypeFilter } from "@/core/constant.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";

const columns: readonly ColumnDetail[] = [
  { columnId: "index", label: "number", minWidth: 50, width: 50, align: "center" },
  { columnId: "productName", label: "product-name", minWidth: 120, align: "center" },
  { columnId: "currency", label: "currency", minWidth: 120, align: "center" },
  { columnId: "prefix", label: "prefix-company", minWidth: 120, align: "center" },
  { columnId: "clientName", label: "client-name", minWidth: 120, align: "center" },
  { columnId: "status", label: "status", minWidth: 30, align: "center" },
  { columnId: "createAt", label: "create-at", minWidth: 150, align: "center" },
  { columnId: "updateAt", label: "update-at", minWidth: 150, align: "center" },
  { columnId: "action", label: "action", minWidth: 150, align: "center" },
  // { columnId: "processing", label: "processing", minWidth: 120, align: "center" },
  // { columnId: "processingStatus", label: "processing-status", minWidth: 150, align: "center" },
  // { columnId: "formLink", label: "form-link", minWidth: 200, align: "center" },
];

interface EnhancedTableProps {
  t: any;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { t } = props;

  return (
    <TableHead sx={(theme) => ({
      backgroundColor: theme.palette.example.tableHeader,
      '& .MuiTableCell-root': {
        color: 'white',
        border: `1px solid ${theme.palette.example.inherit}`,
      },
    })}>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.columnId}
            align={column.align}
            style={{ minWidth: column.minWidth, width: column.width, fontWeight: 'bold' }}
            sx={{ p: 1 }}
          >
            {t(`table.${column.label}`)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function Component() {
  const {
    trigerChangeStatus,
    modalStatusToggle,
    handleOpenModalStatusToggle,
    handleCloseModalStatusToggle,
    onSubmitCustomerProductStatusToggle,
  } = useModalStatusToggle<ICustomerProductActiveReq>();

  const {
    trigerDelete,
    modalDelete,
    handleOpenModalDeleteCustomerProduct,
    handleCloseModalDelete,
    onSubmitDeleteCustomerProduct,
  } = useModalConfirmDelete();

  const {
    products,
    openModal,
    setOpenModal,
    editCustomer,
    setEditCustomer,
    exportModal,
    setExportModal,
    setExportType,
    pageAmount,
    customerId,
    navigateToSubProduct,
    loading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    t,
    updateProduct,
    setUpdateProduct,
    onFilterProduct,
    handleOpenAddProductModal,
    handleOpenEditProductModal,
    handleProductNameChange,
    handleStatusNameChange,
    handlePrefixChange,
    handleClientNameChange,
    clearInput,
    submitExportPDF,
    navigateToCustomers,
    getProductList,
    searchCustomerProduct,
    isSearch,
    cryptoCurrency,
    fiatCurrency,
  } = useFetchCustomerProductTable();

  const {
    customerProfile,
    profileType,
    customerProfileModal,
    setCustomerProfileModal,
    handleOpenCustomerProfileModalTypeCustomer
  } = useCustomerProfile();

  useEffect(() => {
    getProductList();
  }, [updateProduct, trigerDelete, trigerChangeStatus, page, rowsPerPage, isSearch]);

  // handle change status customer product
  const handleChangeStatus = (active: boolean, customer_product_id: string) => {
    const body: ICustomerProductActiveReq = {
      active: active,
      customer_id: customerId,
      customer_product_id: customer_product_id,
    };
    handleOpenModalStatusToggle(body);
  };

  // Move to hooks
  const { createRegisterForm, reCreateRegisterForm, syncRegisterForm } = RegisterFormService();
  const { state } = useLocation();
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [openFormLink, setOpenFormLink] = React.useState(false);
  const [formLink, setFormLink] = React.useState<any>();
  const { alertError, alertSuccess } = useAlertDialog();

  const handleClose = () => setOpenBackdrop(false);
  const handleOpen = () => setOpenBackdrop(true);

  const handleOpenFormLinkModal = (data: any) => {
    const bodyForm: any = {
      'product': data?.product_name,
      'prefix': data?.prefix_name,
      'link': data?.form_url
    }
    setFormLink(bodyForm)
    setOpenFormLink(true)
  }

  const handleAddFormLink = async (data: any) => {
    try {
      handleOpen()
      const res = await createRegisterForm(customerId, data?.customer_product_id)
      alertSuccess(t('alert.create-form-link-success')).then((result) => {
        if (result.isConfirmed) {
          getProductList();
        }
      });
    } catch (error: any) {
      alertError(error.response.data.message);
    } finally {
      handleClose()
    }
  }

  const handleReFormLink = async (data: any) => {
    try {
      handleOpen()
      const res = await reCreateRegisterForm(customerId, data?.customer_product_id, data?.form_id)
      alertSuccess(res.message).then((result) => {
        if (result.isConfirmed) {
          getProductList();
        }
      });
    } catch (error: any) {
      alertError(error.response.data.message);
    } finally {
      handleClose()
    }
  }

  const handleSyncFormLink = async (data: any) => {
    try {
      handleOpen()
      const res = await syncRegisterForm(customerId, data?.customer_product_id, data?.form_id)
      alertSuccess(res.message).then((result) => {
        if (result.isConfirmed) {
          getProductList();
        }
      });
    } catch (error: any) {
      alertError(error.response.data.message);
    } finally {
      handleClose()
    }
  }
  const handleCopyClipboard = (text: string) => { navigator.clipboard.writeText(text) };
  const currentTime = new Date();
  const convertExpireTime = (expTime: any) => {
    return new Date(expTime);
  }
  const navigate = useNavigate();
  const handleRedirectToSetupInv = () => navigate(`/setup-invoice?id=${customerId}&name=${state?.username}`);


  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {modalStatusToggle && (
        <ConfirmChangeStatusToggle // add title and describe
          openModal={modalStatusToggle}
          closeModal={handleCloseModalStatusToggle}
          save={onSubmitCustomerProductStatusToggle}
        />
      )}

      {openFormLink &&
        <FormLinkModal
          openModal={openFormLink}
          closeModal={() => setOpenFormLink(false)}
          productName={formLink?.product}
          prefix={formLink?.prefix}
          formLink={formLink?.link} />
      }

      {openModal.addModal && (
        <AddCustomerProducts
          openModal={openModal}
          setOpenModal={setOpenModal}
          updateProduct={updateProduct}
          setUpdateProduct={setUpdateProduct}
        />
      )}

      {openModal.editModal && (
        <EditProduct
          openModal={openModal}
          setOpenModal={setOpenModal}
          editCustomer={editCustomer}
          setEditCustomer={setEditCustomer}
          customer_id={state.cid}
          updateProduct={updateProduct}
          setUpdateProduct={setUpdateProduct}
          discounts={discounts}
          fiatCurrency={fiatCurrency}
          cryptoCurrency={cryptoCurrency}
        />
      )}
      {modalDelete && (
        <ModalConfirmDelete
          title={t("modal.delete-product")}
          description={
            <>
              {t("modal.delete-product-description")}
              <br />
              {t("modal.delete-product-notation")}
            </>
          }
          openModal={modalDelete}
          closeModal={handleCloseModalDelete}
          ConfirmDelete={onSubmitDeleteCustomerProduct}
        />
      )}
      {customerProfile && (
        <CustomerProfileModal
          openModal={customerProfileModal}
          setOpenModal={setCustomerProfileModal}
          customerProfile={customerProfile}
          profileType={profileType}
        />
      )}

      {exportModal && (
        <ModalCustom
          open={exportModal}
          onClose={() => setExportModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box>
            <FormControl>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                  mb: 3,
                }}
              >
                {t("title.export-billing")}
              </Typography>
              <RadioGroup
                data-testid="customer-producttable-exporttype-radio-buttons-group"
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="group"
                name="radio-buttons-group"
                onChange={(e: any) => setExportType(e.target.value)}
              >
                <FormControlLabel
                  value="group"
                  control={<Radio />}
                  label="Group"
                />
                <FormControlLabel
                  value="separate"
                  control={<Radio />}
                  label="Separate"
                />
              </RadioGroup>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                paddingTop: "10px",
              }}
            >
              <Button
                data-testid="customer-producttable-cancel-button"
                variant="text"
                children={t("button.cancel")}
                onClick={() => setExportModal(false)}
              />
              <Button
                data-testid="customer-producttable-export-button"
                onClick={() => submitExportPDF()}
                variant="text"
                children={t("button.export")}
              />
            </Box>
          </Box>
        </ModalCustom>
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
        <Box className="flex flex-row items-center gap-6 w-full">
          <Link
            data-testid="customer-producttable-backpage-link"
            component="button"
            onClick={navigateToCustomers}
            underline="none"
            color={"GrayText"}
            sx={{
              cursor: "pointer",
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
            whiteSpace={'nowrap'}
          >
            <BackwardIcon />
          </Link>
          <Typography
            variant="h4"
            sx={{ whiteSpace: "nowrap" }}
          >
            {state?.username}
          </Typography>
          <IconButton data-testid="customer-producttable-customerprofile-button" color="primary" onClick={() => {
            handleOpenCustomerProfileModalTypeCustomer(state.cid)
          }}>
            <Info />
          </IconButton>

          <Box className="flex gap-3 mb-1 w-full" >
            <Button
              data-testid="customer-producttable-add-button"
              variant="contained"
              color="primary"
              children={`+ ${t("button.add-product")}`}
              sx={{
                width: "140px",
                height: "35",
                border: "1px",
              }}
              onClick={handleOpenAddProductModal}
            />
            <span className="grow" />
            <Button
              data-testid="customer-producttable-add-button"
              variant="contained"
              color="secondary"
              children={t("button.setup-invoice")}
              sx={{
                width: "140px",
                height: "35",
                border: "1px",
              }}
              onClick={() => handleRedirectToSetupInv()}
            />
          </Box>
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    // flexWrap: "wrap",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <TextField
                    data-testid="customer-producttable-productname-text"
                    id="product-name-input"
                    label={t("placeholder.product-name")}
                    value={searchCustomerProduct.productName}
                    onChange={handleProductNameChange}
                    size="small"
                    sx={{ maxWidth: "20%", mr: 2 }}
                    fullWidth
                  />

                  <TextField
                    data-testid="customer-producttable-prefix-text"
                    id="prefix-input"
                    label={t("placeholder.prefix")}
                    value={searchCustomerProduct.prefix}
                    onChange={handlePrefixChange}
                    size="small"
                    sx={{ maxWidth: "20%", mr: 2 }}
                    fullWidth
                  />

                  <TextField
                    data-testid="customer-producttable-client-name-text"
                    id="client-name-input"
                    label={t("placeholder.client-name")}
                    value={searchCustomerProduct.clientName}
                    onChange={handleClientNameChange}
                    size="small"
                    sx={{ maxWidth: "20%", mr: 2 }}
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
                      data-testid="customer-producttable-status-select"
                      labelId="status-label"
                      id="status"
                      value={searchCustomerProduct.status}
                      label="Status"
                      onChange={handleStatusNameChange}
                    >
                      {ActiveTypeFilter.map((type: any) => (
                        <MenuItem
                          key={`StatusType ${type.id}`}
                          value={type.type_value}
                        >
                          {t(`select.${type.type_name}`)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    data-testid="customer-producttable-search-button"
                    variant="contained"
                    color="primary"
                    type="submit"
                    children={t("button.search")}
                    onClick={onFilterProduct}
                    sx={{
                      width: "7%",
                      height: "39px",
                      marginX: "8px",
                    }}
                  />
                  <Button
                    disabled={
                      !searchCustomerProduct.productName &&
                        !searchCustomerProduct.prefix &&
                        !searchCustomerProduct.clientName &&
                        searchCustomerProduct.status === "ALL"
                        ? true
                        : false
                    }
                    data-testid="customer-producttable-clear-button"
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
          <TableContainer className="rounded-md">
            <Table>
              <EnhancedTableHead
                t={t}
              />
              {products && (
                <TableBody sx={(theme) => ({
                  '& .MuiTableCell-root': {
                    border: `1px solid ${theme.palette.example.inherit}`,
                  },
                })}>
                  {products.map((row: any, index) => {

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={`row-customer-Product-List ${index} ${row.customer_product_id} `}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: (theme) => theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell align="center" sx={{ p: 1 }}>
                          {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Link
                            data-testid="customer-producttable-productname-link"
                            className="cursor-pointer"
                            // sx={{ m: "-8px" }}
                            variant="body2"
                            underline="none"
                            id={row.id}
                            onClick={() => {
                              navigateToSubProduct(
                                state.cid,
                                row.customer_product_id,
                                row.product_id,
                                row.product_name,
                                row.fiat_currency_id,
                                row.fiat_currency_name,
                                row.prefix_name,
                                row.product_type,
                              );
                            }}
                            whiteSpace={'nowrap'}
                          >
                            <Typography variant="body2">
                              {row.product_name || '-'}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell align={"center"} sx={{ p: 1 }}>
                          <Typography variant="body2">
                            {(row.product_type === ProductMasterType.AUTO || row.product_type === ProductMasterType.AUTO_PLAY) ? row.fiat_currency_name || '-' : "-"}
                          </Typography>
                        </TableCell>
                        <TableCell align={row.prefix_name ? "left" : "center"} sx={{ p: 1 }}>
                          <Typography variant="body2">
                            {row.prefix_name || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align={row.client_name ? "left" : "center"} sx={{ p: 1 }}>
                          <Typography variant="body2">
                            <Typography variant="body2">
                              {row.client_name || '-'}
                            </Typography>
                          </Typography>
                        </TableCell>
                        <TableCell align="left" sx={{ p: 0, px: 1 }}>
                          <SwitchComponent
                            status={row?.active}
                            showModalConfirmStatus={handleChangeStatus}
                            id={row.customer_product_id}
                          />
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Typography variant="body2" align="right">
                            {formatDate(row.created_at) || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Typography variant="body2" align="right">
                            {formatDate(row.updated_at) || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align={"center"} sx={{ p: 0 }}>
                          <IconButton
                            sx={{ mx: 1 }}
                            data-testid="customer-producttable-edit-button"
                            onClick={() => {
                              handleOpenEditProductModal(
                                state.cid,
                                row.customer_product_id,
                                row.product_id,
                              );
                            }}
                          >
                            <IconCustomerSvg
                              sx={{ color: "primary.main" }}
                              icon={"edit"}
                              className="w-4"
                            />
                          </IconButton>
                          <IconButton
                            sx={{ mx: 1 }}
                            data-testid="customer-producttable-delete-button"
                            onClick={() => {
                              handleOpenModalDeleteCustomerProduct(
                                state.cid,
                                row.customer_product_id,
                              );
                              console.log("Delete product", row);
                            }}
                          >
                            <IconCustomerSvg
                              sx={{ color: "primary.main" }}
                              icon={"delete"}
                              className="w-4"
                            />
                          </IconButton>
                        </TableCell>
                        {/* <TableCell>
                          <Typography variant="body2" align="center">
                            {row.form_status}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                              sx={{ mx: 2 }}
                              data-testid="customer-producttable-redirec-link"
                              disabled={row.form_status == FormLinkStatus.SUCCESS ? true : false}
                              onClick={() => handleSyncFormLink(row)}
                            >
                              <IconMenuSvg icon={row.form_status == FormLinkStatus.SUCCESS ? "check-circle" : "replay-circle"} color={row.form_status == FormLinkStatus.SUCCESS ? "success" : "primary"}/>
                          </IconButton>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{display: "flex", flexDirection: "row", gap: 1}}>
                            <Tooltip title={row.form_url} 
                            >
                              <Typography variant="body2" alignContent="center" width="100%" align="center" onClick={() => handleCopyClipboard(row.form_url)}>
                                {row.form_url ? handleHideText(row.form_url, 18) : "-"}
                              </Typography>
                            </Tooltip>
                            {row.form_url == '' ? (
                              <IconButton
                                data-testid="customer-producttable-delete-button"
                                onClick={() => handleAddFormLink(row)}
                              >
                                <IconMenuSvg icon="add-link" color="primary"/>
                              </IconButton>
                            ) : (
                              currentTime > convertExpireTime(row.form_exp_time) && row.form_status != FormLinkStatus.SUCCESS ? ( // Condition check link expire time.
                                <IconButton
                                  data-testid="customer-producttable-delete-button"
                                  onClick={() => handleReFormLink(row)}
                                >
                                  <IconMenuSvg icon="restore-page" color="primary"/>
                                </IconButton>
                              ) : (
                                <IconButton
                                  data-testid="customer-producttable-delete-button"
                                  onClick={() => handleOpenFormLinkModal(row)}
                                >
                                  <IconMenuSvg icon="find-in-page" color="primary"/>
                                </IconButton>
                              )
                            )} 
                          </Box>
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          {products.length > 0 || false ? null : (
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
          {products.length > 0 && (
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
Component.displayName = "CustomerProductTable";
