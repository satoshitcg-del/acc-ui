import React, { useEffect } from "react";
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
} from "@mui/material";
import { BorderColor as EditIcon } from "@mui/icons-material";

import Loading from "@/layout/components/loading/Loading.js";

/* interfaces && Enum */
import type { Column } from "../DiscountProps.js";

/* Services */
import DiscountService from "@/services/DiscountService.js";
import { usePageEffect } from "@/core/page.js";

/* State management */
import { useRecoilState } from "recoil";
import { TriggerTableDiscount } from "../storerecoil/index.js";

/* Core Component */
import PaginationMedium from "@/routes/pagination/Pagination.js";

/* Components */
import DiscountForm from "./DiscountForm.js";
import DiscountEditModal from "./DiscountEditModal.js";
import DiscountAddModal from "./DiscountAddModal.js";
import { useTranslation } from "react-i18next";
import {
  ICurrencyLists,
  IDiscountAllReq,
  IDiscountAllResComponent,
} from "@/core/interface/services.js";
import EmptyTable from "@/layout/components/table/EmptyTable.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import { DISCOUNT_TYPE_ENUM } from "@/core/enum.js";
import { formatNumber } from "@/core/utils/index.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";
import { useCustomerSearchStore } from "@/core/storerecoil/useCustomerSearchStore.js";

const columns: readonly Column[] = [
  { id: "id", label: "number", minWidth: 50, width: 50, align: "center", bodyAlign: "center" },
  { id: "discount_name", label: "discount-name", minWidth: "5rem", align: "center", bodyAlign: "left" },
  { id: "value", label: "discount-amount", minWidth: "5rem", align: "center", bodyAlign: "right" },
  { id: "active", label: "status", minWidth: "5rem", align: "center", bodyAlign: "left" },
  { id: "management", label: "management", minWidth: "5rem", align: "center", bodyAlign: "center" },
];

export default function Component() {
  const [triggerTableDiscount, setTriggerTableDiscount] =
    useRecoilState(TriggerTableDiscount);
  const { getDiscountOne, getDiscountList, getAllCurrencyForDiscount } = DiscountService();
  const { resetSearchCustomer } = useCustomerSearchStore();
  const [discounts, setDiscounts] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState({
    status: "ALL",
    discountAmount: "",
    discountName: "",
    discountType: "ALL",
  });
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const { alertError } = useAlertDialog();
  const [dataAmount, setDataAmount] = React.useState<number>();
  const [pageAmount, setPageAmount] = React.useState<number>();
  const [rowAmount, setRowAmount] = React.useState<number>();
  const [currencyDiscount, setCurrencyDiscount] = React.useState<ICurrencyLists[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
  });
  const { t } = useTranslation();
  const { TranslateErrorCode } = useTranslateErrorCode()
  let title = t("title.discount");
  usePageEffect({ title });

  const [modifiedDiscount, setModifiedDiscount] = React.useState<object>();

  const handleOpenAddModal = async () => {
    getCurrency()
    setOpenModal({ ...openModal, addModal: true });
  };

  const handleOpenEditModal = async (discount_id: string) => {
    try {
      const body = { id: discount_id };
      const res = await getDiscountOne(body);
      setModifiedDiscount(res.data);
      getCurrency()
      setOpenModal({
        ...openModal,
        addModal: false,
        editModal: true,
      });
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  React.useEffect(() => {
    handleSearchDiscountList();
  }, [triggerTableDiscount, page, rowsPerPage]);

  React.useEffect(() => {
    resetSearchCustomer();
  }, [])

  const handleSearchDiscountList = async () => {
    setLoading(true);
    try {
      const bodyReq: IDiscountAllReq = {
        discount_name: search.discountName,
        active: search.status,
        discount_amount: search.discountAmount,
        discount_type: search.discountType,
        limit: rowsPerPage,
        page: page,
      };
      if (search.discountAmount) {
        bodyReq.value = parseFloat(search.discountAmount);
      }
      const res = await getDiscountList(bodyReq);
      setDiscounts(res?.data?.discounts || []);
      setPageAmount(res.data.count_page);
      setRowAmount(res?.data?.discounts?.length);
      setDataAmount(res?.data?.count_data);
      setLoading(false);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getCurrency = async () => {
    try {
      const response = await getAllCurrencyForDiscount()
      console.log("res", response.data)
      setCurrencyDiscount(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  function createProductDetailListRows(data: any, index: number): IDiscountAllResComponent {
    return {
      id: <Typography variant="body2" sx={{ pl: '10px' }}>{index}</Typography>,
      discount_name: (
        <Typography variant="body2">{data.discount_name || '-'}</Typography>
      ),
      value: handleCurrency(data.value, data.discount_type, data.currency_name),
      active: checkActive(data.active),
      management: handleMangement(data.id),
    };
  }

  const checkActive = (active: boolean) => {
    const activeString =
      active == true
        ? { text: `${t("table.active")}`, colorType: "#2E7D32" }
        : { text: `${t("table.inactive")}`, colorType: "#D32F2F" };
    return (
      <Typography sx={{ color: activeString.colorType }} variant="body2">
        {activeString.text}
      </Typography>
    );
  };

  const handleMangement = (discount_id: string) => {
    return (
      <Box>
        <IconButton
          data-testid="discount-discounttable-edit-button"
          aria-label="edit"
          className="mx-auto"
          sx={{ color: "#EF6C00" }}
          onClick={() => {
            handleOpenEditModal(discount_id);
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>
    );
  };

  const handleCurrency = (value: any, type: string, currrency: string) => {
    let discountStatic: any;
    type == DISCOUNT_TYPE_ENUM.STATIC ? discountStatic = `${formatNumber(value)} (${currrency})` : discountStatic = `${value}%`;
    return <Typography variant="body2">{discountStatic || '-'}</Typography>;
  };

  return (
    <>
      {openModal.addModal ? (
        <DiscountAddModal openModal={openModal} setOpenModal={setOpenModal} currencyDiscount={currencyDiscount} />
      ) : null}

      {openModal.editModal ? (
        <DiscountEditModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          inputDiscount={modifiedDiscount}
          currencyDiscount={currencyDiscount}
        />
      ) : null}

      <Box className={`w-full flex justify-start items-center gap-7`}>
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
        <Button
          data-testid="discount-discounttable-add-button"
          className="w-36 rounded-l"
          onClick={handleOpenAddModal}
          variant="contained"
          color="primary"
        >
          {`+ ${t("button.add-discount")}`}
        </Button>
      </Box>
      <Paper className="w-full mt-5 rounded-md">
        <Box className="w-full justify-end p-4">
          <DiscountForm
            rowsPerPage={rowsPerPage}
            setSearch={setSearch}
            search={search}
            setPage={setPage}
            handleSearchDiscountList={handleSearchDiscountList}
          />
        </Box>
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
              {discounts.map((row, index) => {
                const discountRow = createProductDetailListRows(row, (page - 1) * rowsPerPage + index + 1);
                return (
                  <TableRow key={`${row.id}_${index}`} hover
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: (theme) => theme.palette.action.hover,
                      },
                    }}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.bodyAlign} sx={{ p: 0, px: 1 }}>
                        {discountRow[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {Array.isArray(discounts) && discounts?.length > 0 ? null : (
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
        {discounts.length >= 1 && (
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
Component.displayName = "DiscountTable";
