import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Add this import
import { useCustomerPageStore } from "@/core/storerecoil/usePageStore";
//----- Interface && Const && Enum -----//
import {
  ICustomer,
  ICustomerList,
} from "@/core/interface/services";
//Services
import ServiceRequest from "@/services";
import { customerModalProps } from "../CustomerProps";
import UserTagService from "@/services/UserTagService";
import { UserTagType } from "@/core/enum";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { t } from "i18next";
import dayjs from "dayjs";
import { useCustomerSearchStore } from "@/core/storerecoil/useCustomerSearchStore";
import { useCustomerProductSearchStore } from "@/core/storerecoil/useCustomerProductSearchStore";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";


export function generatePassword() {
  return Math.random().toString(36).substring(2, 15);
}

export const useFetchCustomerTable = () => {
  const navigate = useNavigate();
  const { searchCustomer, setSearchCustomer, resetSearchCustomer } = useCustomerSearchStore();
  const { resetSearchCustomerProduct } = useCustomerProductSearchStore()
  const { page, setPage } = useCustomerPageStore();
  const { getOne } = ServiceRequest();
  const { getUserTagList, getSaleOwnerList } = UserTagService()
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError } = useAlertDialog();
  const [customers, setCustomers] = useState<ICustomerList[]>([]);
  const [genPassword, setGenPassword] = useState(generatePassword());
  const [pdfUrl, setPDFUrl] = useState<any>()
  const [modifiedCustomer, setModifiedCustomer] = useState<ICustomer>();
  const [existingCustomerLists, setExistingCustomerLists] = useState([]);
  const [dataCustomer, setDataCustomer] = useState<object>({})
  const [signInAlert, setSignInAlert] = useState({
    status: false,
    success: "",
    message: "",
  });
  // Modal controller
  const [openModal, setOpenModal] = useState<customerModalProps>({
    addModal: false,
    editModal: false,
    deleteModal: false,
    addProductModal: false,
    pdfViewerModal: false,
    confirmTelegramModal: false,
    existingCustomerListModal: false,
    saleOwnerModal: false,
    tagUserModal: false,
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [updateCustomer, setUpdateCustomer] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [contactModalLabel, setContactModalLabel] = useState("");
  const [contactAvatarName, setContactAvatarName] = useState<string | undefined>("");

  // Pagination controller
  const [pageAmount, setPageAmount] = useState({
    count_data: 0,
    count_page: 0,
    row_amount: 0,
  });
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // Open modal controller
  const handleOpenAddProductModal = () => {
    setOpenModal({ ...openModal, addProductModal: true });
  };

  const handleOpenAddModal = () => {
    setGenPassword(generatePassword());
    setOpenModal({ ...openModal, addModal: true });
  };

  const navigateToDetails = (id: any, username: string) =>
    navigate(`${username}`, { state: { cid: id, username } });

  const handleOpenEditModal = async (id: any) => {
    try {
      const body = {
        id: id,
      };
      setActionLoading(true);
      handleGetTagReferenceList();
      handleGetSaleOwnerList();
      const res = await getOne(body);
      setModifiedCustomer(res.data);
      setOpenModal({ ...openModal, editModal: true });
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenSaleOwnerModal = async (value: any, label: string, name?: string) => {
    setActionLoading(true);
    setContactModalLabel(label)
    setContactData(value)
    setContactAvatarName(name)
    setOpenModal({ ...openModal, saleOwnerModal: true });
    setActionLoading(false);
  };

  const handleCloseSaleOwnerModal = async () => {
    setOpenModal({ ...openModal, saleOwnerModal: false });
  };

  const handleOpenPDFPreviewModal = () => {
    setOpenModal({ ...openModal, pdfViewerModal: true });
  }

  const handleUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchCustomer({
      ...searchCustomer,
      username: event.target.value as string,
    });
  }

  const handleCustomerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchCustomer({
      ...searchCustomer,
      customerName: event.target.value as string,
    });
  }

  const handlePrefixSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchCustomer({
      ...searchCustomer,
      prefix: event.target.value.toLocaleUpperCase() as string,
    });
  }

  const handleTelegramIdSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchCustomer({
      ...searchCustomer,
      telegramId: event.target.value as string,
    });
  }

  const handleEmailSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchCustomer({
      ...searchCustomer,
      email: event.target.value as string,
    });
  }

  const handlePhoneNumberSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.target.value;
    const phonePattern = /^[+]?[0-9\s]*$/;

    if (phonePattern.test(inputValue) || inputValue === "") {
      setSearchCustomer({
        ...searchCustomer,
        phoneNumber: inputValue as string,
      });
    }
  };

  const clearCustomerProductSearch = () => {
    resetSearchCustomerProduct();
  };

  const clearInput = () => {
    resetSearchCustomer();
  };

  const [tagReferenceList, setTagReferenceList] = useState([]);
  const handleGetTagReferenceList = async () => {
    try {
      const res: any = await getUserTagList(UserTagType.TAG_REFERENCE);
      const checkPrefixListsNull = res?.data || [];
      setTagReferenceList(checkPrefixListsNull);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const [saleOwnerList, setSaleOwnerList] = useState([]);
  const handleGetSaleOwnerList = async () => {
    try {
      const res: any = await getSaleOwnerList();
      const checkPrefixListsNull = res?.data || [];
      setSaleOwnerList(checkPrefixListsNull);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const handleStartDateSearch = (start_date: any) => {
    if (!start_date) return;
    const openingDateObject = dayjs(start_date);

    if (!openingDateObject.isValid()) return;
    setSearchCustomer({
      ...searchCustomer,
      startDate: openingDateObject.toISOString(),
    });
  }

  const handleEndDateSearch = (end_date: any) => {
    if (!end_date) return;
    const openingDateObject = dayjs(end_date);

    if (!openingDateObject.isValid()) return;
    setSearchCustomer({
      ...searchCustomer,
      endDate: openingDateObject.toISOString(),
    });
  }

  const handleClientNameSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchCustomer({
      ...searchCustomer,
      clientName: event.target.value as string,
    });
  }

  return {
    customers,
    setCustomers,
    genPassword,
    pdfUrl,
    setPDFUrl,
    setGenPassword,
    modifiedCustomer,
    setModifiedCustomer,
    signInAlert,
    setSignInAlert,
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
    handleOpenPDFPreviewModal,
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
  };
};
