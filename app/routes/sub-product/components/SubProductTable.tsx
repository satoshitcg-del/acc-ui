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
  Typography,
  SelectChangeEvent,
  Link,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  BorderColor as EditIcon,
  ArrowBackIos as BackwardIcon,
} from "@mui/icons-material";
import React from "react";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import { Column } from "../SubProductProps.js";
import SubProductForm from "./SubProductForm.js";
import {
  SubProductAddModal,
  SubProductEditModal,
} from "@/routes/sub-product/components/index.js";
import PaginationMedium from "../../pagination/Pagination.js";
import {
  ISubProductAllReq,
  ISubProductAllResComponent,
} from "@/core/interface/services.js";
import {
  ModalConfirmDelete,
  useModalConfirmDelete,
} from "@/layout/components/modal-confirm-delete/index.js";
import { t } from "i18next";
import { usePageEffect } from "@/core/page.js";
import EmptyTable from "@/layout/components/table/EmptyTable.js";
import Loading from "@/layout/components/loading/Loading.js";
import { BooleanString } from "@/core/enum.js";

import Breadcrumb from "@/layout/components/breadcrumb/Breadcrumb";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
// service
import ProductService from "@/services/ProductService.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";
const columns: readonly Column[] = [
  { id: "id", label: "number", minWidth: 50, width: 50, align: "center" },
  { id: "product_name", label: "sub-product-name", minWidth: 170, align: "center" },
  { id: "product_name_preview", label: "sub-product-name-preview", minWidth: 170, align: "center" },
  { id: "active", label: "status", minWidth: 100, align: "center" },
  { id: "management", label: "action", minWidth: 170, align: "center" },
];

export default function Component() {
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError } = useAlertDialog();
  const { getSubProductOne, getSubProductList, getTypeListSelect } = ProductService();
  const [subProduct, setSubProduct] = React.useState<
    ISubProductAllResComponent[] | []
  >([]);
  const [search, setSearch] = React.useState({
    subProductName: "",
    status: "ALL",
  });
  const { id, name } = useParams();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<string | number>(50);
  const [status, setStatus] = React.useState<boolean>(true);
  const [type, setType] = React.useState<string>('');
  const [require, setRequire] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
  });
  const [dataAmount, setDataAmount] = React.useState<number>();
  const [pageAmount, setPageAmount] = React.useState<number>();
  const [rowAmount, setRowAmount] = React.useState<number>();
  const [addSubProduct, setAddSubProduct] = React.useState([]);
  const [editSubProduct, setEditSubProduct] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [typeList, setTypeList] = React.useState<string[]>();
  const {
    trigerDelete,
    modalDelete,
    handleOpenModalDeleteProductMaster,
    handleCloseModalDelete,
    onSubmitDeleteSubProduct,
  } = useModalConfirmDelete();

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleRequireChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequire(event.target.checked);
  };

  const handleStatusChange = (event: SelectChangeEvent) =>
    setStatus(event.target.value === BooleanString.true);

  const handleOpenAddModal = () => {
    setOpenModal({ ...openModal, addModal: true });
  };

  React.useEffect(() => {
    handleGetTypeList();
  }, []);

  const handleGetTypeList = async () => {
    try {
      const res = await getTypeListSelect('sub_product');
      setTypeList(res.data.types)
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const handleOpenEditModal = async (id: any) => {
    try {
      const body = { id: id };
      const res = await getSubProductOne(body);
      setStatus(res.data.active);
      setType(res.data.type)
      setRequire(res.data.default_status);
      setModifiedProduct(res.data);
      setOpenModal({ ...openModal, editModal: true });
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };
  const [modifiedProduct, setModifiedProduct] = React.useState<object>();

  React.useEffect(() => {
    handleSearchSubProductList();
  }, [addSubProduct, editSubProduct, trigerDelete, page, rowsPerPage]);

  const handleSearchSubProductList = async () => {
    try {
      setLoading(true);
      const bodyReq: ISubProductAllReq = {
        limit: rowsPerPage as number,
        page: page,
        product_name: search.subProductName as string,
        active: search.status,
        ref: state.id as string,
      };
      const res = await getSubProductList(state.id, bodyReq);
      const subProductData = res?.data?.products
        ? res.data.products.map((row: any, index: number) =>
          createProductDetailListRows({
            id: row.id,
            product_name: row.product_name,
            product_name_preview: row.product_name_preview,
            active: row.active,
          }, (page - 1) * Number(rowsPerPage) + index + 1),
        )
        : [];
      setPageAmount(res.data.count_page);
      setRowAmount(subProductData.length);
      setDataAmount(res.data.count_data);
      setSubProduct(subProductData);
      setLoading(false);
    } catch (error: any) {
      console.log("error", error);
      alertError(TranslateErrorCode(error.response.data.code));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  function createProductDetailListRows(value: any, index: number): ISubProductAllResComponent {
    return {
      id: <Typography variant="body2" sx={{ paddingLeft: "12px" }}>{index}</Typography>,
      product_name: <Typography variant="body2">{value.product_name || '-'}</Typography>,
      product_name_preview: <Typography variant="body2">{value.product_name_preview || '-'}</Typography>,
      active: checkActive(value.active),
      management: handleMangement(value.id),
    };
  }

  const checkActive = (active: boolean) => {
    const activeString =
      active == true
        ? { text: `${t("table.active")}`, colorType: "#2E7D32" }
        : { text: `${t("table.inactive")}`, colorType: "#D32F2F" };
    return (
      <Typography variant="body2" sx={{ color: activeString.colorType }}>
        {activeString.text}
      </Typography>
    );
  };

  const handleMangement = (id: string) => {
    return (
      <div className="flex justify-center">
        <IconButton
          data-testid="subproduct-subproducttable-edit-button"
          className="p-5"
          aria-label="edit"
          sx={{ width: "24px", height: "24px", color: "#EF6C00" }}
          onClick={() => {
            handleOpenEditModal(id);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          data-testid="subproduct-subproducttable-delete-button"
          className="p-5"
          aria-label="delete"
          sx={{ width: "24px", height: "24px", color: "#D32F2F" }}
          onClick={() => {
            handleOpenModalDeleteProductMaster(id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  };

  usePageEffect({ title: "Sub product" });

  const { state } = useLocation();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", width: "100%", }}>
        <Breadcrumb />
      </Box >
      <Box
        sx={{
          display: "flex",
          justifyItems: "center",
          flexDirection: "row",
          flexFlow: "wrap",
          alignItems: "center",
          width: "100%",
          gap: "1.5rem",
        }}
      >
        <Link
          data-testid="subproduct-subproducttable-backpage-link"
          sx={{ display: "flex", justifyItems: "center", alignItems: "center" }}
          component={RouterLink}
          to="/products"
          underline="none"
          color={"GrayText"}
        >
          <BackwardIcon />
        </Link>
        <Typography variant="h4" component={"h1"}>
          {state.name}
        </Typography>

        <Button
          data-testid="subproduct-subproducttable-add-button"
          onClick={handleOpenAddModal}
          variant="contained"
          color="primary"
          type="submit"
          children={`+ ${t("button.add-sub-product")}`}
        />
      </Box>
      {
        openModal.addModal && (
          <SubProductAddModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleStatusChange={handleStatusChange}
            handleTypeChange={handleTypeChange}
            setStatus={setStatus}
            status={status}
            require={require}
            setRequire={setRequire}
            handleRequireChange={handleRequireChange}
            setAddSubProduct={setAddSubProduct}
            refId={state.id}
            type={type}
            setType={setType}
            typeList={typeList}
          />
        )
      }

      {
        openModal.editModal && (
          <SubProductEditModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            modifiedProduct={modifiedProduct}
            handleStatusChange={handleStatusChange}
            handleTypeChange={handleTypeChange}
            status={status}
            setStatus={setStatus}
            require={require}
            setRequire={setRequire}
            handleRequireChange={handleRequireChange}
            refId={state.id}
            setEditSubProduct={setEditSubProduct}
            type={type}
            setType={setType}
            typeList={typeList}
          />
        )
      }

      <ModalConfirmDelete
        title={t("modal.title-delete-sub-product")}
        description={
          <>
            {t("placeholder.delete1")}
            <br />
            {t("placeholder.delete2")}
          </>
        }
        openModal={modalDelete}
        closeModal={handleCloseModalDelete}
        ConfirmDelete={onSubmitDeleteSubProduct}
      />

      <Paper className="w-full mt-5">
        <div style={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
              m: 1,
            }}
          >
            <SubProductForm
              rowsPerPage={rowsPerPage}
              setSearch={setSearch}
              search={search}
              setPage={setPage}
              handleSearchSubProductList={handleSearchSubProductList}
            />
          </Box>
        </div>
        <TableContainer className='rounded-md'>
          <Table aria-label="sticky table">
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
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, width: column.width, fontWeight: 'bold' }}
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
              {subProduct.map((row: any, index: number) => {
                return (
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
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.bodyAlign}
                          sx={{ p: 0, px: 1 }}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {Array.isArray(subProduct) && subProduct?.length > 0 ? null : (
          <>
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
          </>
        )}
        {subProduct.length >= 1 && (
          <PaginationMedium
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            dataAmount={dataAmount}
            pageAmount={pageAmount}
            rowAmount={rowAmount}
          />
        )}
      </Paper>
    </>
  );
}
Component.displayName = "SubProductTable";
