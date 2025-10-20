import {
  Box,
  Button,
  IconButton,
  Link,
  Paper,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  BorderColor as EditIcon,
} from "@mui/icons-material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Column, productProps } from "../ProductProps.js";
import ProductAddModal from "./ProductAddModal.js";
import ProductForm from "./ProductForm.js";
import ProductEditModal from "./ProductEditModal.js";
import PaginationMedium from "../../pagination/Pagination.js";
import dayjs from "dayjs";

import {
  ModalConfirmDelete,
  useModalConfirmDelete,
} from "@/layout/components/modal-confirm-delete/index.js";

import {
  IProductAllReq,
  IProductAllResComponent,
} from "@/core/interface/services.js";
import { useTranslation } from "react-i18next";
import { usePageEffect } from "@/core/page.js";

import EmptyTable from "@/layout/components/table/EmptyTable.js";
import Loading from "@/layout/components/loading/Loading.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import Breadcrumb from "@/layout/components/breadcrumb/Breadcrumb.js";
import { BooleanString } from "@/core/enum.js";

// service
import ProductService from "@/services/ProductService.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";
import { useCustomerSearchStore } from "@/core/storerecoil/useCustomerSearchStore.js";

const columns: readonly Column[] = [
  { id: "id", label: "number", minWidth: 50, width: 50, align: "center" },
  { id: "productName", label: "product-name", minWidth: 170, align: "center" },
  { id: "productNamePreview", label: "product-name-preview", minWidth: 170, align: "center" },
  { id: "active", label: "status", minWidth: 170, align: "center" },
  { id: "management", label: "action", minWidth: 170, align: "center", bodyAlign: "center" },
];

export default function Component() {
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError } = useAlertDialog();
  const { resetSearchCustomer } = useCustomerSearchStore();
  const { getProductOne, getProductList, getTypeListSelect } = ProductService();
  const [product, setProduct] = React.useState<any[] | []>([]);
  const [search, setSearch] = React.useState({
    productName: "",
    status: "ALL",
  });
  const [dates, setDates] = React.useState<string[]>([]);
  const [currentDate, setCurrentDate] = React.useState("");
  const [currentYear, setCurrentYear] = React.useState(dayjs().year() + 543);
  const [years, setYears] = React.useState<number[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<boolean>(true);
  const [productType, setProductType] = React.useState<string>('');
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [page, setPage] = React.useState(1);
  const [dataAmount, setDataAmount] = React.useState<number>();
  const [pageAmount, setPageAmount] = React.useState<number>();
  const [rowAmount, setRowAmount] = React.useState<number>();
  const [addProduct, setAddProduct] = React.useState([]);
  const [editProduct, setEditProduct] = React.useState([]);
  const [typeList, setTypeList] = React.useState<string[]>();
  const [loading, setLoading] = React.useState(false);
  const [winLoseSnapshot, setWinLoseSnapshot] = React.useState('');
  const {
    trigerDelete,
    modalDelete,
    handleOpenModalDeleteProductMaster,
    handleCloseModalDelete,
    onSubmitDeleteProduct,
  } = useModalConfirmDelete();

  const handleStatusChange = (event: SelectChangeEvent) => {
    const status: boolean = event.target.value === BooleanString.true
    setStatus(status);
  };
  const handleProductTypeChange = (event: SelectChangeEvent) => {
    setProductType(event.target.value as string);
  };
  const [openModal, setOpenModal] = React.useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
  });

  const handleOpenAddModal = async () => {
    setOpenModal({ ...openModal, addModal: true });
  };

  const handleOpenEditModal = async (id: any) => {
    try {
      const body = {
        id: id,
      };
      const data = await getProductOne(body);
      setModifiedProduct(data.data);
      setStatus(data.data.active);
      setProductType(data.data.type) // Mock
      setOpenModal({ ...openModal, editModal: true });
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };
  const [modifiedProduct, setModifiedProduct] = React.useState<object>();

  React.useEffect(() => {
    handleGetProductList();
    getYears();
  }, [addProduct, editProduct, trigerDelete, page, rowsPerPage]);

  React.useEffect(() => {
    handleGetTypeList();
    resetSearchCustomer();
  }, []);

  const getYears = () => {
    const dataCurrentYear: number = dayjs().year();
    const thaiYear: number = dataCurrentYear + 543;
    const dataYears: number[] = [];

    for (let i = 0; i < 5; i++) {
      dataYears.push(thaiYear - i);
    }
    setYears(dataYears);
  };

  const handleGetTypeList = async () => {
    try {
      const res = await getTypeListSelect('product');
      setTypeList(res.data.types)
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const handleGetProductList = async () => {
    setLoading(true);
    try {
      const bodyReq: IProductAllReq = {
        product_name: search.productName as string,
        active: search.status,
        limit: rowsPerPage as number,
        page: page,
      };

      const res = await getProductList(bodyReq);
      setPageAmount(res?.data?.count_page);
      setRowAmount(res?.data?.products?.length);
      setDataAmount(res?.data?.count_data);
      setProduct(res?.data?.products || []);
      setLoading(false);
    } catch (error: any) {
      console.log("error", error);
      alertError(TranslateErrorCode(error.response.data.code));
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  function createProductListRows(value: any, index: number): IProductAllResComponent {
    return {
      id: <Typography variant="body2" sx={{ paddingLeft: "12px" }}>{index}</Typography>,
      productName: handleProductName(value.id, value.product_name || '-'),
      productNamePreview: (
        <Typography variant="body2">{value.product_name_preview || '-'}</Typography>
      ),
      active: checkActive(value.active),
      management: handleMangement(value.id),
    };
  }

  const handleProductName = (id: string, name: string) => {
    return (
      <Box className="cursor-pointer">
        <Link
          data-testid="product-producttable-productname-link"
          color="primary"
          underline="hover"
          variant="body2"
          onClick={() => {
            navigateToSubProduct(id, name);
          }}
        >
          {name}
        </Link>
      </Box>
    );
  };

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
          data-testid="product-producttable-edit-button"
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
          data-testid="product-producttable-delete-button"
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

  const navigateToSubProduct = (id: any, name: string) =>
    navigate("/products/sub-product", { state: { id, name } });
  // const navigateToSubProduct = (id: any, name: string) => navigate(`${location.pathname}/${id}/${name}`);

  const { t } = useTranslation();
  let title = t("title.product");
  usePageEffect({ title });

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", width: "100%", }}>
        <Breadcrumb />
      </Box>
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
        <Typography variant="h4" component={"h1"}>
          {title}
        </Typography>
        <Button
          data-testid="product-producttable-add-button"
          onClick={handleOpenAddModal}
          variant="contained"
          color="primary"
          type="submit"
          children={`+ ${t("button.add-product")}`}
        />
      </Box>
      {openModal.addModal && (
        <ProductAddModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleStatusChange={handleStatusChange}
          handleProductTypeChange={handleProductTypeChange}
          setStatus={setStatus}
          status={status}
          setAddProduct={setAddProduct}
          addProduct={addProduct}
          winLoseSnapshot={winLoseSnapshot}
          setWinLoseSnapshot={setWinLoseSnapshot}
          productType={productType}
          setProductType={setProductType}
          typeList={typeList}
        />
      )}

      {openModal.editModal && (
        <ProductEditModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          modifiedProduct={modifiedProduct}
          handleStatusChange={handleStatusChange}
          handleProductTypeChange={handleProductTypeChange}
          setEditProduct={setEditProduct}
          status={status}
          setStatus={setStatus}
          winLoseSnapshot={winLoseSnapshot}
          setWinLoseSnapshot={setWinLoseSnapshot}
          productType={productType}
          setProductType={setProductType}
          typeList={typeList}
        />
      )}

      <ModalConfirmDelete
        title={t("modal.title-delete-product")}
        description={
          <>
            {t("modal.delete-product-description")}
            <br />
            {t("modal.delete-product-notation")}
          </>
        }
        openModal={modalDelete}
        closeModal={handleCloseModalDelete}
        ConfirmDelete={onSubmitDeleteProduct}
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
            <ProductForm
              rowsPerPage={rowsPerPage}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
              handleGetProductList={handleGetProductList}
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
              {product.map((row: any, index: number) => {
                const productRow = createProductListRows(row, (page - 1) * rowsPerPage + index + 1);
                return (
                  <TableRow key={`${row.id}_${index}`} hover sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  }}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.bodyAlign} sx={{ p: 0, px: 1 }}>
                        {productRow[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {Array.isArray(product) && product?.length > 0 ? null : (
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
        {product.length >= 1 && (
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
Component.displayName = "ProductTable";
