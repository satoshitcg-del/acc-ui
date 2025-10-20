import { useState } from "react";
import dayjs from "dayjs";
import { sweetalert } from "@/core/enum.js";

//Services
import CustomerService from "@/services/CustomerService";
import ProductService from "@/services/ProductService";
import type {
  IDeleteCustomerProductReq,
  IDeleteCustomerSubProductReq,
  IDeleteCustomerReq,
  IDeleteProductReq,
  IDeleteSubProductReq,
  IDeleteOnetimeBillingReq,
  IDeletePriceingGroupReq,
  IDeleteDraftInvoiceReq,
  IDeleteEmployeeReq,
} from "@/core/interface/services";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import OneTimeBillingService from "@/services/OneTimeBillingService";
import PricingGroupService from "@/services/PricingGroupService";
import MemberService from "@/services/MemberService";
import TaskManagementService from "@/services/TaskManagementService";
import { t } from "i18next";
import BillingService from "@/services/BillingService";
import { useAlertDialog } from "../../alert-dialog/useAlertDialog";
import EmployeeService from "@/services/EmployeeService";
import DirectApiService from "@/services/DirectApiService";

export const useModalConfirmDelete = () => {
  const { TranslateErrorCode } = useTranslateErrorCode();
  const {
    getOne,
    deleteCustomer,
    deleteCustomerProduct,
    deleteSubProductToCustomer,
  } = CustomerService();
  const { deleteDraftDirectApi } = DirectApiService();
  const { deleteDraftInvoice } = BillingService();
  const { deleteOneTimeBillingById, getOneTimeById } = OneTimeBillingService();
  const { deleteProduct, deleteSubProduct } = ProductService();
  const { deleteMemberById, getMemberById } = MemberService();
  const { deletePricingGroupById } = PricingGroupService();
  const { deleteTaskById } = TaskManagementService();
  const { deleteEmployee } = EmployeeService();
  const [modalDelete, setModalDelete] = useState(false);
  const [req, setReq] = useState<
    | IDeleteCustomerReq
    | IDeleteCustomerProductReq
    | IDeleteCustomerSubProductReq
    | IDeletePriceingGroupReq
    | IDeleteOnetimeBillingReq
    | IDeleteDraftInvoiceReq
    | IDeleteEmployeeReq
    | null
  >(null);
  const [trigerDelete, setTrigerDelete] = useState<Date | string>("");
  const { alertError, alertSuccess } = useAlertDialog();

  const handleCloseModalDelete = () => {
    setModalDelete(false);
  };

  const handleOpenModalDeleteCustomer = async (id: string) => {
    const body = { id };
    try {
      const res = await getOne(body);
      setReq(res.data);
      setModalDelete(true);
    } catch (error: any) {
      alertSuccess(TranslateErrorCode(error.response.data.code));
    }
  };
  const handleOpenModalDeleteCustomerProduct = async (
    customer_id: string,
    customer_product_id: string,
  ) => {
    const body = { customer_id, customer_product_id };
    setReq(body);
    setModalDelete(true);
  };

  const handleOpenModalDeleteCustomerSubProduct = async (
    customer_sub_product_id: string,
  ) => {
    const body = { customer_sub_product_id };
    setReq(body);
    setModalDelete(true);
  };

  const handleOpenModalDeleteProductMaster = async (id: string) => {
    const body = { id };
    setReq(body);
    setModalDelete(true);
  };

  const handleOpenModalDeletePricingGroup = async (id: string) => {
    const body = { id };
    setReq(body);
    setModalDelete(true);
  };

  const handleOpenModalDeleteMember = async (id: string) => {
    try {
      const res = await getMemberById(id);
      setReq(res.data);
      setModalDelete(true);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const handleOpenModalDeleteDraftInvoice = async (id: string) => {
    const body = { id };
    try {
      // const res = await getOne(body);
      setReq(body);
      setModalDelete(true);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const handleOpenModalDeleteEmployee = async (id: string) => {
    const body = { id };
    try {
      setReq(body);
      setModalDelete(true);
    } catch (error: any) {
      alertSuccess(TranslateErrorCode(error.response.data.code));
    }
  };

  const handleOpenModalDeleteDirectApi = async (id: string) => {
    const body = { id };
    try {
      setReq(body);
      setModalDelete(true);
    } catch (error: any) {
      alertSuccess(TranslateErrorCode(error.response.data.code));
    }
  };

  const onSubmitDeleteCustomerSubProduct = async () => {
    try {
      const res = await deleteSubProductToCustomer(
        req as IDeleteCustomerSubProductReq,
      );
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeleteCustomerProduct = async () => {
    try {
      const res = await deleteCustomerProduct(req as IDeleteCustomerProductReq);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeleteCustomer = async () => {
    try {
      const res = await deleteCustomer(req as IDeleteCustomerReq);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeleteProduct = async () => {
    try {
      const res = await deleteProduct(req as IDeleteProductReq);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeleteSubProduct = async () => {
    try {
      const res = await deleteSubProduct(req as IDeleteSubProductReq);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeletePricingGroup = async () => {
    try {
      const res = await deletePricingGroupById(req as IDeletePriceingGroupReq);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const handleOnlDelete = () => {
    setModalDelete(false);
    alertSuccess(TranslateErrorCode(1001));
  };

  const handleOpenModalDeleteOnetimeBilling = async (id: string) => {
    try {
      const res = await getOneTimeById(id);
      const body: IDeleteOnetimeBillingReq = { id };
      setReq(body);
      setModalDelete(true);
    } catch (error: any) {
      alertError(TranslateErrorCode(error));
    }
  };

  const handleOpenModalDeleteCrticket = async (id: string) => {
    try {
      console.log("CHECK ID FOR DELETED :", id);
      // const res = await getOneTimeById(id);
      const body: IDeleteOnetimeBillingReq = { id };
      setReq(body);
      setModalDelete(true);
    } catch (error: any) {
      alertError(TranslateErrorCode(error));
    }
  };

  const onSubmitDeleteOnetimeBlling = async () => {
    try {
      const res = await deleteOneTimeBillingById((req as IDeleteProductReq).id);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeleteMember = async () => {
    try {
      const res = await deleteMemberById((req as IDeleteProductReq).id);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(1001));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeleteCrTicket = async () => {
    try {
      const res = await deleteTaskById((req as IDeleteProductReq).id);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeleteDraftInvoice = async () => {
    try {
      const res = await deleteDraftInvoice((req as IDeleteDraftInvoiceReq).id);
      console.log("CHECK RES OF DELETE:", res);

      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeleteEmployee = async () => {
    try {
      const res = await deleteEmployee((req as IDeleteEmployeeReq).id);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  const onSubmitDeleteDerectApi = async () => {
    try {
      const res = await deleteDraftDirectApi((req as IDeleteDraftInvoiceReq).id);
      console.log("CHECK RES OF DELETE:", req);
      setTrigerDelete(dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]"));
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalDelete(false);
    }
  };

  return {
    trigerDelete,
    modalDelete,
    handleOpenModalDeleteCustomer,
    handleCloseModalDelete,
    handleOnlDelete,
    onSubmitDeleteCustomer,
    handleOpenModalDeleteCustomerProduct,
    onSubmitDeleteCustomerProduct,
    handleOpenModalDeleteCustomerSubProduct,
    onSubmitDeleteCustomerSubProduct,
    handleOpenModalDeleteProductMaster,
    onSubmitDeleteProduct,
    onSubmitDeleteSubProduct,
    handleOpenModalDeleteOnetimeBilling,
    handleOpenModalDeleteCrticket,
    onSubmitDeleteOnetimeBlling,
    onSubmitDeletePricingGroup,
    handleOpenModalDeletePricingGroup,
    handleOpenModalDeleteMember,
    onSubmitDeleteMember,
    onSubmitDeleteCrTicket,
    handleOpenModalDeleteDraftInvoice,
    onSubmitDeleteDraftInvoice,
    handleOpenModalDeleteEmployee,
    onSubmitDeleteEmployee,
    handleOpenModalDeleteDirectApi,
    onSubmitDeleteDerectApi,
  };
};
