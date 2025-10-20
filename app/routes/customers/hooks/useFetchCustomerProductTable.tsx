import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material";

// Customer props
import { type productModalProps } from "../CustomerProps.js";
import type {
  ICustomer,
  ICustomerGetListReq,
  ICustomerListOneComponent,
  ICustomerProductList,
  IGetCustomerProduct,
} from "@/core/interface/services.js";

// Services
import CustomerService from "@/services/CustomerService.js";

// i18n
import { useTranslation } from "react-i18next";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import dayjs from "dayjs";
import { useCustomerProductSearchStore } from "@/core/storerecoil/useCustomerProductSearchStore.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";

type IExportType = "group" | "separate";

export const useFetchCustomerProductTable = () => {
  const { getAllDetailProductToCustomer, getOneCustomerProduct, getPDFGroup, getPDFSeparate, getCryptoCurrency, getFiatCurrency } = CustomerService();
  const [products, setProduct] = useState<ICustomerProductList[]>([]);
  const [openModal, setOpenModal] = useState<productModalProps>({
    addModal: false,
    editModal: false,
    deleteModal: false,
    addProductModal: false,
    customerProfileModal: false,
  });
  const [editCustomer, setEditCustomer] = useState<any>();
  const [exportModal, setExportModal] = useState(false);
  const [exportType, setExportType] = useState<IExportType>("group");
  const [pageAmount, setPageAmount] = useState({
    count_data: 0,
    count_page: 0,
    row_amount: 0,
  });
  const { state } = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const { t } = useTranslation();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const [updateProduct, setUpdateProduct] = useState(false);
  const { alertError } = useAlertDialog();

  const navigateToSubProduct = (
    customer_id: string,
    customer_product_id: string,
    product_id: string,
    product_name: string,
    currency_id: string,
    fait_currency_name: string,
    prfix: string,
    product_type: string,
  ) =>
    navigate(`${location.pathname}/${product_name}`, {
      state: {
        cid: customer_id,
        cpid: customer_product_id,
        pid: product_id,
        pn: product_name,
        fcid: currency_id,
        fccy_name: fait_currency_name,
        prefix: prfix,
        product_type: product_type,
      },
    });

  // Table controller
  const [selected, setSelected] = useState<readonly number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = products.map((n: any) => n.customer_product_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectCustomerProduct = (
    event: React.MouseEvent<unknown>,
    id: number,
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleOpenAddProductModal = () =>
    setOpenModal({ ...openModal, addModal: true });



  const createCustomerProfileList = (value: any): ICustomerListOneComponent => {
    return {
      user_name: value.user_name,
      full_name: value.full_name,
      email: value.email,
      password: value.password,
      phone_number: value.phone_number,
      line_id: value.line_id,
      telegram: value.telegram,
      what_app: value.what_app,
      note: value.note,
    };
  };

  const handleOpenEditProductModal = async (
    customer_id: string,
    customer_product_id: string,
    product_id: string,
  ) => {
    try {
      const data = await getOneCustomerProduct(
        customer_id,
        customer_product_id,
        product_id,
      );
      await handleGetCryptoCurrency()
      await handleGetFiatCurrency()
      console.log(data);
      setEditCustomer({ ...data });
      setOpenModal({ ...openModal, editModal: true });
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  // Customer product filter form
  const { searchCustomerProduct, setSearchCustomerProduct, resetSearchCustomerProduct } = useCustomerProductSearchStore()
  const handleProductNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) =>
    setSearchCustomerProduct({
      ...searchCustomerProduct,
      productName: event.target.value as string,
    });
  const handleStatusNameChange = (event: SelectChangeEvent) =>
    setSearchCustomerProduct({
      ...searchCustomerProduct,
      status: event.target.value as string,
    });

  const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchCustomerProduct({
      ...searchCustomerProduct,
      prefix: event.target.value.toLocaleUpperCase() as string,
    });

  const handleClientNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchCustomerProduct({
      ...searchCustomerProduct,
      clientName: event.target.value as string,
    });

  const [isSearch, setIsSearch] = useState(true)
  function onFilterProduct(input: any) {
    setPage(1)
    setIsSearch(!isSearch)
  }
  const clearInput = () => {
    resetSearchCustomerProduct();
  };
  // handle export PDF
  const handleOpenExportPDF = () => {
    // if (selected.length <= 1) {
    separatePDF();
    // } else {
    //   console.log("PDF more than 1 selected open modal", exportType);
    //   setExportType("group");
    //   setExportModal(true);
    // }
  };

  const separatePDF = async () => {
    try {
      const response = await getPDFSeparate(
        selected,
        // userName,
        state.cid,
      );
      let file = new Blob([response], { type: "application/pdf" });
      window.open(URL.createObjectURL(file));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const groupPDF = async () => {
    try {
      const response = await getPDFGroup(
        selected,
        // userName,
        state.cid,
      );
      let file = new Blob([response], { type: "application/pdf" });
      window.open(URL.createObjectURL(file));
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const submitExportPDF = () => {
    console.log("Export PDF export type :", exportType);
    if (exportType == "group") {
      groupPDF();
    } else {
      separatePDF();
    }
  };

  const downloadAllFile = () => {
    console.log("Download all");
  };

  const [userName, setUserName] = useState<any>();

  // function extractCustomerId(path: string, index?: number): any {
  //     const decodedString = decodeURIComponent(path);
  //     const str = decodedString.split("/").pop()!;
  //     const result = str.split("-");
  //     console.log('iddddd', state.cid)
  //     return index == 0 ? state.cid : result;
  // }

  const navigateToCustomers = () => {
    navigate(-1);
  };

  const getProductList = async (
    product_name?: string | null,
    prefix_name?: string,
    active?: string,
  ) => {
    try {
      setLoading(true);
      // const result = extractCustomerId(pathname);
      setCustomerId(state.cid);

      const bodyReq: ICustomerGetListReq = {
        customer_id: state.cid,
        product_name: searchCustomerProduct.productName as string,
        prefix_name: searchCustomerProduct.prefix as string,
        client_name: searchCustomerProduct.clientName as string,
        active: searchCustomerProduct.status as string,
        limit: String(rowsPerPage),
        page: String(page),
      };
      // console.log("result of bodyReq on filter ==>", bodyReq);

      const res = await getAllDetailProductToCustomer(
        bodyReq,
      );
      console.log("productlist", res.data);
      setLoading(false);
      const checkDataNull = res?.data || [];
      setPageAmount({
        ...pageAmount,
        count_data: res?.pagination?.total,
        count_page: res?.pagination?.total_pages,
        row_amount: checkDataNull.length,
      });
      if (res?.pagination?.total_pages != 0) {
        if (res?.pagination?.total_pages < res?.pagination?.current_page)
          setPage(res?.pagination?.total_pages);
      }
      setProduct(checkDataNull);
      setUserName(state.username);
    } catch (error: any) {
      setLoading(false);
      alertError(TranslateErrorCode(error?.response?.data?.code));
      navigateToCustomers();
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [cryptoCurrency, setCryptoCurrency] = useState([])
  const [fiatCurrency, setFiatCurrency] = useState<any>([])
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

  return {
    products,
    openModal,
    setOpenModal,
    editCustomer,
    setEditCustomer,
    exportModal,
    setExportModal,
    exportType,
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
    selected,
    handleSelectAllClick,
    handleSelectCustomerProduct,
    isSelected,
    handleOpenAddProductModal,
    handleOpenEditProductModal,
    handleProductNameChange,
    handleStatusNameChange,
    handlePrefixChange,
    handleClientNameChange,
    clearInput,
    handleOpenExportPDF,
    submitExportPDF,
    downloadAllFile,
    userName,
    navigateToCustomers,
    getProductList,
    searchCustomerProduct,
    isSearch,
    cryptoCurrency,
    fiatCurrency,
  };
};
