import { useState } from 'react';
import dayjs from 'dayjs';
import { CurrencyType, ONETIME_BILLING_STATUS, Status, sweetalert } from "@/core/enum.js";

//------ Services ------
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import OneTimeBillingService from '@/services/OneTimeBillingService';
import { SelectChangeEvent } from '@mui/material';
import BillingService from '@/services/BillingService';
import { t } from 'i18next';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';

export const useOneTimeChangeStatusModal = () => {
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { updateStatusOneTimeBillingById } = OneTimeBillingService()
    const { getCurrencyForUpdateStatus, getCustomerInfo } = BillingService();
    const { alertError, alertSuccess } = useAlertDialog();

    const [walletType, setWalletType] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [note, setNote] = useState('');
    const [modalStatusToggle, setModalStatusToggle] = useState(false);
    const [trigerChangeStatus, setTrigerChangeStatus] = useState<Date | string>('');
    const [changeStatusReq, setChangeStatusReq] = useState<any | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0)

    const handleOpenModalChangeStatus = async (body: any) => {
        console.log("CHKKK BID", body);

        setChangeStatusReq(body)
        setWalletType(body.wallet_type)
        setWalletAddress(body.wallet_no)
        setModalStatusToggle(true);
        setTotalPrice(body.total_paid * -1)
        setPaidValue(body.status === ONETIME_BILLING_STATUS.PAID ? body.total_paid * -1 : 0)
        getCurrency(body.id, body.customer_id)
        getUserCredit(body.id, body.customer_id)
        setStatusType((body.status === ONETIME_BILLING_STATUS.PAID || body.status === ONETIME_BILLING_STATUS.REFUNDED) ? Status.money_transfer : '')

    }

    const [userCredit, setUserCredit] = useState<number>(0)
    const getUserCredit = async (invoice_id: string, customer_id: string) => {
        const res = await getCustomerInfo(invoice_id, customer_id);
        setUserCredit(res.data.total_credit_usdt)
    }

    const [currencyList, setCurrencyList] = useState<[]>([])
    const getCurrency = async (invoice_id: string, customer_id: string) => {
        try {
            const response = await getCurrencyForUpdateStatus(invoice_id, customer_id)
            const defaultCurrency = response.data.filter((currency: any) => currency.currency_name === 'USDT');
            setCurrency(defaultCurrency[0]?.currency_id)
            setCurrencyList(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const [statusType, setStatusType] = useState<string>('');
    const handleChangeStatusType = (type: string) => {
        setStatusType(type);
    }

    const [currency, setCurrency] = useState('');
    const handleChangeCurrency = (event: SelectChangeEvent) => {
        setCurrency(event.target.value as string);
    };

    const [paidValue, setPaidValue] = useState<number>(0)
    const handleChangePaid = (value: number) => {
        setPaidValue(value);
    }

    const [reason, setReason] = useState('');
    const handleChangeReason = (event: SelectChangeEvent) => {
        setReason(event.target.value as string);
    };

    const handleCloseModalChangeStatus = () => {
        setNote('')
        setWalletAddress('')
        setWalletType('')
        setModalStatusToggle(false);
        setChangeStatusReq(null);
        setReason('')
        setPaidValue(0)
        setTotalPrice(0)
        setValidatePaidValue(false)
        setCurrency('')
        setStatusType('')
        setValidateWalletAddress(false)
        setValidateWalletType(false)
    }

    const [validatePaidValue, setValidatePaidValue] = useState<boolean>(false)
    const [validateWalletType, setValidateWalletType] = useState<boolean>(false)
    const [validateWalletAddress, setValidateWalletAddress] = useState<boolean>(false)
    const onSubmitChangeStatusOneTimeBilling = async () => {
        try {
            if (changeStatusReq?.status === ONETIME_BILLING_STATUS.PAID && paidValue !== totalPrice) {
                setValidatePaidValue(true)
                return;
            }
            if (changeStatusReq?.status === ONETIME_BILLING_STATUS.REFUNDED && paidValue > totalPrice) {
                setValidatePaidValue(true)
                return;
            }
            if (changeStatusReq?.status === ONETIME_BILLING_STATUS.APPROVED && !walletType) {
                setValidateWalletType(true)
            }
            if (changeStatusReq?.status === ONETIME_BILLING_STATUS.APPROVED && !walletAddress) {
                setValidateWalletAddress(true)
            }
            if (changeStatusReq?.status === ONETIME_BILLING_STATUS.APPROVED && (!walletType || !walletAddress)) return;
            setValidateWalletAddress(false)
            setValidateWalletType(false)
            setValidatePaidValue(false)
            const body = {
                id: changeStatusReq?.id,
                status: changeStatusReq?.status,
                amount: paidValue,
                cause: reason,
                currency_id: currency,
                invoice_id: "",
                note,
                payment_type: statusType,
                updated_at: "",
                wallet_name: "",
                wallet_no: walletAddress,
                wallet_type: walletType
            }
            console.log("CHKKK BODY :", body);

            const res = await updateStatusOneTimeBillingById(body); // IUpdateOneTimeStatusReq
            setTrigerChangeStatus(dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'))
            setModalStatusToggle(false);
            alertSuccess(TranslateErrorCode(res?.code));
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    };

    const handleChangeWalletType = (event: SelectChangeEvent) => {
        if (event.target.value) {
            setValidateWalletType(false)
        }
        setWalletType(event.target.value as string);
    };

    const handleChangeWalletAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value) {
            setValidateWalletAddress(false)
        }
        setWalletAddress(event.target.value as string);
    };

    return {
        trigerChangeStatus,
        modalStatusToggle,
        handleCloseModalChangeStatus,
        onSubmitChangeStatusOneTimeBilling,
        walletType,
        walletAddress,
        handleChangeWalletType,
        handleChangeWalletAddress,
        setNote,
        changeStatusReq,
        handleOpenModalChangeStatus,
        currencyList,
        statusType,
        handleChangeStatusType,
        currency,
        handleChangeCurrency,
        paidValue,
        handleChangePaid,
        reason,
        handleChangeReason,
        userCredit,
        totalPrice,
        validatePaidValue,
        validateWalletType,
        validateWalletAddress,
    }
}