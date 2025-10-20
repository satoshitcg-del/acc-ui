import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Link,
  Tooltip,
  Backdrop,
  CircularProgress
} from "@mui/material";
import { useLocation } from "react-router-dom";

//----- Interface && Const && Enum -----//
import {
  customerColumns,
} from "../CustomerProps.js";
import { handleHideText } from "@/core/utils/index.js"
//Customer modals
import EditCustomer from "./customer-modal/EditCustomer.js";
import AddCustomer from "./customer-modal/AddCustomer.js";
import { ModalConfirmDelete, useModalConfirmDelete } from "@/layout/components/modal-confirm-delete/index.js";
import AddProductsPageCustomer from "@/layout/components/modal-add-product/AddProductsPageCustomer.js";
import { useFetchCustomerTable } from "../hooks/useFetchCustomerTable.js";

// UI Components
import PaginationMedium from "../../pagination/Pagination.js";
import Breadcrumb from "@/layout/components/breadcrumb/Breadcrumb.js";
import Loading from "@/layout/components/loading/Loading.js";
import EmptyTable from "@/layout/components/table/EmptyTable.js";
// i18next
import { useTranslation } from "react-i18next";
import IconTableSvg from "@/assets/svg/TableSvg.js";
import { IGetListCustomerReq } from "@/core/interface/services.js";
import { usePageEffect } from "@/core/page.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";

import { useShowPdf } from '@/layout/components/modal-pdf/hook/useShowPdf.js';
// service
import CustomerService from "@/services/CustomerService.js";
import ExistingCustomerList from "./customer-modal/ExistingCustomerList.js";
import { formatDate } from "@/core/dateUtils.js";
import { IconMenuSvg } from "@/assets/svg/IconMenuSvg.js";
import ContactModal from "./customer-modal/ContactModal.js";
import ConfirmTelegram from "./customer-modal/ConfirmTelegram.js";
import PdfViewerModal from "@/layout/components/modal-pdf/ModalPreviewPdf.js";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";

export default function Component() {
  const { trigerDelete, modalDelete, handleOpenModalDeleteCustomer, handleCloseModalDelete, onSubmitDeleteCustomer } = useModalConfirmDelete();
  const {
    customers,
    setCustomers,
    genPassword,
    setGenPassword,
    modifiedCustomer,
    loading,
    setLoading,
    updateCustomer,
    setUpdateCustomer,
    navigateToDetails,
    pageAmount,
    setPageAmount,
    openModal,
    setOpenModal,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    handleOpenAddProductModal,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCustomerNameChange,
    handleUsernameChange,
    handleTelegramIdSearch,
    handlePrefixSearch,
    handleEmailSearch,
    handlePhoneNumberSearch,
    clearInput,
    generatePassword,
    existingCustomerLists,
    setExistingCustomerLists,
    dataCustomer,
    setDataCustomer,
    tagReferenceList,
    saleOwnerList,
    handleOpenSaleOwnerModal,
    handleCloseSaleOwnerModal,
    contactData,
    contactModalLabel,
    contactAvatarName,
    handleStartDateSearch,
    handleEndDateSearch,
    searchCustomer,
    clearCustomerProductSearch,
    handleClientNameSearch,
    actionLoading,

  } = useFetchCustomerTable()
  const { alertError } = useAlertDialog();

  const { getListCustomer } = CustomerService();
  const { t } = useTranslation();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const [actionType, setActionType] = useState('')
  const { search } = useLocation();
  const { pdfUrl, openModalPdf, ClosePDFPreviewModal } = useShowPdf();

  const handleSearchCustomer = () => {
    setPage(1)
    fetchCustomerList()
  }

  const fetchCustomerList = async () => {
    try {
      setLoading(true)
      const dataPagination: IGetListCustomerReq = {
        limit: rowsPerPage,
        page: page,
        username: searchCustomer.username,
        full_name: searchCustomer.customerName,
        prefix: searchCustomer.prefix,
        telegram: searchCustomer.telegramId,
        email: searchCustomer.email,
        phone_number: searchCustomer.phoneNumber,
        start_date: searchCustomer.startDate,
        end_date: searchCustomer.endDate,
        client_name: searchCustomer.clientName,
      };

      const res = await getListCustomer(dataPagination);

      if (!res?.data?.customers) {
        setCustomers([]);
      } else {
        setCustomers(res?.data?.customers)
        setPageAmount({
          ...pageAmount,
          count_data: res?.data?.count_data,
          count_page: res?.data?.count_page,
          row_amount: res?.data?.customers?.length,
        });
      }

      if (res?.pagination?.total_pages != 0) {
        if (res?.pagination?.total_pages < res?.pagination?.current_page) setPage(res?.pagination?.total_pages)
      }

      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      alertError(TranslateErrorCode(error?.response?.data?.code));
    } finally {
      clearCustomerProductSearch()
      setLoading(false)
    }
  };

  let title = t("title.customer");
  usePageEffect({ title });

  useEffect(() => {
    fetchCustomerList();
  }, [search, updateCustomer, trigerDelete, page, rowsPerPage]);

  const handlePrefixesToString = (prefixes: string[]) => {
    if (prefixes) {
      let result = prefixes.filter((prefix) => prefix).join(', ');
      let maxLength = 25;
      if (result.length <= maxLength) {
        return result;
      }
      return result.slice(0, maxLength) + '...';
    }
    return '';
  };

  const handlePrefixesJoin = (prefixes: string[]) => {
    if (prefixes) {
      return prefixes.filter((prefix) => prefix).join(', ');
    }
  };

  return (
    <>
      <Box
        className="h-full"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          width: "100%",
          height: "100%",
        }}
      >
        {openModal.saleOwnerModal &&
          <ContactModal
            openModal={openModal}
            contactData={contactData}
            handleCloseSaleOwnerModal={handleCloseSaleOwnerModal}
            label={contactModalLabel}
            name={contactAvatarName}
          />
        }
        {openModal.editModal &&
          <EditCustomer
            openModal={openModal}
            setOpenModal={setOpenModal}
            modifiedCustomer={modifiedCustomer}
            setUpdateCustomer={setUpdateCustomer}
            updateCustomer={updateCustomer}
            setExistingCustomerLists={setExistingCustomerLists}
            setDataCustomer={setDataCustomer}
            setActionType={setActionType}
            tagReferenceList={tagReferenceList}
            saleOwnerList={saleOwnerList}
          />
        }
        {openModal.addModal &&
          <AddCustomer
            openModal={openModal}
            setOpenModal={setOpenModal}
            setUpdateCustomer={setUpdateCustomer}
            updateCustomer={updateCustomer}
            genPassword={genPassword}
            setGenPassword={setGenPassword}
            generatePassword={generatePassword}
            setExistingCustomerLists={setExistingCustomerLists}
            setDataCustomer={setDataCustomer}
            setActionType={setActionType}
            tagReferenceList={tagReferenceList}
            saleOwnerList={saleOwnerList}
          />
        }
        {modalDelete &&
          <ModalConfirmDelete
            title={t("modal.title-delete-customer")}
            description={
              <>
                {t("placeholder.delete1")}
                <br />
                {t("placeholder.delete2")}
              </>
            }
            openModal={modalDelete}
            closeModal={handleCloseModalDelete}
            ConfirmDelete={onSubmitDeleteCustomer}
          />
        }
        {openModal.addProductModal &&
          <AddProductsPageCustomer
            openModal={openModal}
            setOpenModal={setOpenModal}
            setUpdateCustomer={setUpdateCustomer}
            updateCustomer={updateCustomer}
          />
        }

        {openModal.confirmTelegramModal &&
          <ConfirmTelegram
            openModal={openModal}
            setOpenModal={setOpenModal}
            dataCustomer={dataCustomer}
            setDataCustomer={setDataCustomer}
            updateCustomer={updateCustomer}
            setUpdateCustomer={setUpdateCustomer}
            actionType={actionType}
            modifiedCustomer={modifiedCustomer}
            setActionType={setActionType}
          />
        }

        {existingCustomerLists && openModal.existingCustomerListModal && (
          <ExistingCustomerList
            openModal={openModal}
            setOpenModal={setOpenModal}
            existingCustomerLists={existingCustomerLists}

          />
        )}

        {openModalPdf &&
          <PdfViewerModal
            openModal={openModalPdf}
            pdfUrl={pdfUrl}
            closeModal={ClosePDFPreviewModal}
          />
        }
        {actionLoading &&
          <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
            open={actionLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        }
        <Breadcrumb />
        <Box className="flex flex-row items-center gap-6">
          <Typography variant="h4">{t("title.customer")}</Typography>
          <Box className="flex items-center gap-6">
            <Button
              data-testid="customer-customertable-addcustomer-button"
              variant="contained"
              color="success"
              children={`+ ${t("button.add-customer")}`}
              onClick={handleOpenAddModal}
            />
            <Button
              data-testid="customer-customertable-addproduct-button"
              variant="contained"
              color="warning"
              children={`+ ${t("button.add-product")}`}
              onClick={handleOpenAddProductModal}
            />
          </Box>
        </Box>
        <Paper className="w-full mt-5" >
          <form onSubmit={(e) => {
            e.preventDefault();
          }}>
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 2,
                  width: '100%',
                  mb: 2
                }}
              >
                <TextField
                  data-testid="customer-customertable-username-text"
                  id="username-input"
                  label={`${t("placeholder.username")}`}
                  value={searchCustomer.username}
                  onChange={handleUsernameChange}
                  size="small"
                  fullWidth
                />
                <TextField
                  data-testid="customer-customertable-customername-text"
                  id="customer-name-input"
                  label={`${t("placeholder.customer-name")}`}
                  value={searchCustomer.customerName}
                  onChange={handleCustomerNameChange}
                  size="small"
                  fullWidth
                />
                <TextField
                  data-testid="customer-customertable-prefix-text"
                  id="prefix-input"
                  label={`${t("placeholder.prefix")}`}
                  value={searchCustomer.prefix}
                  onChange={handlePrefixSearch}
                  size="small"
                  fullWidth
                />
                <TextField
                  data-testid="customer-customertable-telegram-text"
                  id="telegram-input"
                  label={`${t("placeholder.telegram")}`}
                  value={searchCustomer.telegramId}
                  onChange={handleTelegramIdSearch}
                  size="small"
                  fullWidth
                />
                <TextField
                  data-testid="customer-customertable-email-text"
                  id="email-input"
                  label={`${t("placeholder.email")}`}
                  value={searchCustomer.email}
                  onChange={handleEmailSearch}
                  size="small"
                  fullWidth
                />
                <TextField
                  data-testid="customer-customertable-telephone-text"
                  id="telephone-input"
                  label={`${t("placeholder.phone-number")}`}
                  value={searchCustomer.phoneNumber}
                  onChange={handlePhoneNumberSearch}
                  size="small"
                  fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t("placeholder.start-date")}
                    views={['year', 'month', 'day']}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        inputProps: {
                          'data-testid': "customer-formaddproductpagecustomer-openingdate-datepicker"
                        }
                      }
                    }}
                    value={searchCustomer.startDate ? dayjs(searchCustomer.startDate) : null}
                    onChange={(date) => handleStartDateSearch(date)}
                  />
                  <DatePicker
                    label={t("placeholder.end-date")}
                    views={['year', 'month', 'day']}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        inputProps: {
                          'data-testid': "customer-formaddproductpagecustomer-closingdate-datepicker"
                        }
                      }
                    }}
                    minDate={searchCustomer.startDate ? dayjs(searchCustomer.startDate) : undefined}
                    value={searchCustomer.endDate ? dayjs(searchCustomer.endDate) : null}
                    onChange={(date) => handleEndDateSearch(date)}

                  />
                </LocalizationProvider>
                {/* <TextField
                  data-testid="customer-customertable-client-name-text"
                  id="cilient-name-input"
                  label={`${t("placeholder.client-name")}`}
                  value={searchCustomer.clientName}
                  onChange={handleClientNameSearch}
                  size="small"
                  fullWidth
                /> */}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  data-testid="customer-customertable-search-button"
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={() => handleSearchCustomer()}
                >
                  {t("button.search")}
                </Button>
                <Button
                  disabled={!searchCustomer.customerName && !searchCustomer.prefix && !searchCustomer.telegramId && !searchCustomer.email && !searchCustomer.phoneNumber && !searchCustomer.username && !searchCustomer.startDate && !searchCustomer.endDate && !searchCustomer.clientName}
                  data-testid="customer-customertable-clear-button"
                  variant="contained"
                  color="secondary"
                  onClick={clearInput}
                >
                  {t("button.clear")}
                </Button>
              </Box>
            </Box>
          </form>

          <TableContainer className="rounded-md">
            <Table aria-label="sticky table">
              <TableHead sx={(theme) => ({
                backgroundColor: theme.palette.example.tableHeader,
                '& .MuiTableCell-root': {
                  color: 'white',
                  border: `1px solid ${theme.palette.example.inherit}`,
                },
              })}>
                <TableRow>
                  {customerColumns.map((column, index) => (
                    <TableCell
                      key={column.columnId}
                      align={column.align}
                      width={column.width}
                      style={{
                        minWidth: column.minWidth,
                        paddingLeft: index == 0 ? "10px" : "",
                        fontWeight: 'bold',
                      }}
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
                {customers
                  .map((row: any, index: number) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={`${row.id}`} sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: (theme) => theme.palette.action.hover,
                        },
                      }}>
                        <TableCell align="center" sx={{ p: 0 }}>
                          {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Link
                            data-testid="customer-customertable-customername-link"
                            component="button"
                            variant="body2"
                            underline="none"
                            onClick={() => {
                              navigateToDetails(row.id, row.username);
                            }}
                            whiteSpace={'nowrap'}
                          >
                            {row.username || '-'}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Tooltip title={row.full_name}>
                            <Typography variant="body2" sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                              maxWidth: 120,
                            }}>
                              {row.full_name || '-'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align={row.prefixes ? "left" : "center"} sx={{ p: 1 }}>
                          <Tooltip title={handlePrefixesJoin(row.prefixes)}>
                            <Typography variant="body2" sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                              maxWidth: 120,
                            }}>
                              {handlePrefixesToString(row.prefixes) || '-'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Tooltip title={row.telegram}>
                            <Typography variant="body2" sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                              maxWidth: 120,
                            }}>
                              {row.telegram || '-'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ p: 1 }}>
                          <Tooltip title={row.email} disableHoverListener={row.email.length > 18 ? false : true}>
                            <Typography variant="body2" sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                              maxWidth: 120,
                            }}>
                              {row.email || '-'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align={row.phone_number ? "left" : "center"} sx={{ p: 1 }}>
                          <Tooltip title={row.phone_number} disableHoverListener={row.phone_number.length > 10 ? false : true}>
                            <Typography variant="body2" sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                              maxWidth: 120,
                            }}>
                              {row.phone_number ? (`${row.dial_code}${row.phone_number}`) : '-'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right" sx={{ p: 1 }}>
                          <Typography variant="body2">
                            {formatDate(row.created_at) || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ p: 1 }}>
                          <Typography variant="body2">
                            {formatDate(row.updated_at) || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ p: 0 }}>
                          <IconButton
                            disabled={!row.sale_owner ? true : false}
                            data-testid="customer-customertable-edit-button"
                            sx={{ mx: 1 }}
                            onClick={() => {
                              handleOpenSaleOwnerModal(row.sale_owner, t('table.sale-owner'), row.full_name);
                            }}
                          >
                            <IconMenuSvg icon="account-circle" />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center" sx={{ p: 0 }}>
                          <IconButton
                            disabled={!row.tag_reference ? true : false}
                            data-testid="customer-customertable-edit-button"
                            sx={{ mx: 1 }}
                            onClick={() => {
                              handleOpenSaleOwnerModal(row.tag_reference, t('table.tag-user'), row.full_name);
                            }}
                          >
                            <IconMenuSvg icon="local-offer" />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center" sx={{ p: 0, gap: 2 }}>
                          <IconButton
                            data-testid="customer-customertable-edit-button"
                            sx={{ mx: 1 }}
                            onClick={() => {
                              handleOpenEditModal(row.id);
                            }}
                          >
                            <IconTableSvg icon="edit" />
                          </IconButton>
                          <IconButton
                            data-testid="customer-customertable-delete-button"
                            sx={{ mx: 1 }}
                            onClick={() => {
                              handleOpenModalDeleteCustomer(row.id)
                            }}
                          >
                            <IconTableSvg icon="delete" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
          {customers.length > 0 || false ? null : (
            <Box className="min-h-[40dvh]">
              {loading ?
                <Box className="flex justify-center h-[55dvh]">
                  <Box className=" flex items-center  w-[15rem]">
                    <Loading />
                  </Box>
                </Box>
                : <EmptyTable />}
            </Box>
          )}
          {customers.length > 0 &&
            <PaginationMedium
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              dataAmount={pageAmount.count_data}
              pageAmount={pageAmount.count_page}
              rowAmount={pageAmount.row_amount}
            />
          }
        </Paper>
      </Box >
    </>
  );
}
Component.displayName = "CustomerTable";
