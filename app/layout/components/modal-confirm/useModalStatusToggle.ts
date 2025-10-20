import { useState } from 'react';
import dayjs from 'dayjs';

//------ Interface && Enum  ------
import type {
  ICustomerProductActiveReq,
  ICustomerSubProductActiveReq,
} from "@/core/interface/services"
import { sweetalert } from "@/core/enum.js";

//------ Services ------
import CustomerService from '@/services/CustomerService';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import OneTimeBillingService from '@/services/OneTimeBillingService';
import { t } from 'i18next';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';

export const useModalStatusToggle = <R>() => {
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { updateCustomerProductActive, updateCustomerSubProductActive } = CustomerService();
  const { updateStatusOneTimeBillingById } = OneTimeBillingService()
  const [modalStatusToggle, setModalStatusToggle] = useState(false);
  const [req, setReq] = useState<R | null>(null);
  const [trigerChangeStatus, setTrigerChangeStatus] = useState<Date | string>('');
  const { alertError, alertSuccess } = useAlertDialog();

  const handleCloseModalStatusToggle = () => {
    setModalStatusToggle(false);
  }
  const handleOpenModalStatusToggle = async (body: R) => {
    setReq(body)
    setModalStatusToggle(true);
  }

  const onSubmitCustomerProductStatusToggle = async () => {
    try {
      const res = await updateCustomerProductActive(req as ICustomerProductActiveReq);
      setTrigerChangeStatus(dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'))
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalStatusToggle(false);
    }
  };

  const onSubmitCustomerSubProductStatusToggle = async () => {
    try {
      const res = await updateCustomerSubProductActive(req as ICustomerSubProductActiveReq);
      setTrigerChangeStatus(dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'))
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalStatusToggle(false);
    }
  };

  const onSubmitChangeStatusOneTimeBilling = async () => {
    try {
      const res = await updateStatusOneTimeBillingById(req as any); // IUpdateOneTimeStatusReq
      setTrigerChangeStatus(dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'))
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setModalStatusToggle(false);
    }
  };

  return {
    trigerChangeStatus,
    modalStatusToggle,
    handleCloseModalStatusToggle,
    onSubmitCustomerProductStatusToggle,
    handleOpenModalStatusToggle,
    onSubmitCustomerSubProductStatusToggle,
    onSubmitChangeStatusOneTimeBilling
  }
};

