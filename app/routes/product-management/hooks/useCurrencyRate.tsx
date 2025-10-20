import { useEffect, useState } from 'react';
import { sweetalert } from "@/core/enum.js";
import { useTranslation } from 'react-i18next';
import ProductManagementService from '@/services/ProductManagementService';

import { dateStamp } from '@/core/utils';

/* State management */
import { useRecoilState } from 'recoil';
import { TriggerTableProductManagement } from '../storerecoil';
import { useTranslateErrorCode } from './useErrorCode';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';

dayjs.extend(customParseFormat);



export const useCurrencyRate = (id: string, rate: string, curency_type: string) => {
    const { t } = useTranslation();
    const { updateRate, getRateListProductManagement } = ProductManagementService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess, alertWarning } = useAlertDialog();
    const [triggerTable, setTriggerTable] = useRecoilState(TriggerTableProductManagement);
    const [value, setValue] = useState<number | string | null>(rate);
    const [currencyRate, setCurrencyRate] = useState([])
    const [openModal, setOpenModal] = useState<boolean>(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^(?!0\d)\d*(\.\d*)?$/;
        if (regex.test(event.target.value)) {
            // console.log(' ===> ', event.target.value, typeof event.target.value);
            setValue(event.target.value);
        }
    };

    const onSubmitUpdate = async () => {
        if (Number(value) <= 0) {
            alertWarning(Number(value) === 0 ? t("alert.warning-input-currency") : t("alert.warning-input-negative"));
        } else {
            const body = { rate: String(value), currency_type: curency_type }
            try {
                const res = await updateRate(id, body);
                alertSuccess(t('modal.save-success'));
                setTriggerTable(!triggerTable)
            } catch (error: any) {
                alertError(TranslateErrorCode(error.response.data.code));
            }
        }

    }

    const openExchangeRateModal = async (date: string) => {
        try {
            const newDate = formatDate(date)
            const response = await getRateListProductManagement(newDate)
            setCurrencyRate(response.data)
            setOpenModal(true)
            console.log('response', response)
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    }

    function formatDate(input: string) {
        const date = new Date(input + " 1"); // ใช้วันที่ 1 เพื่อให้ Date เข้าใจ
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // เติม 0 ถ้าตัวเลขเป็นหลักเดียว
        return `${year}-${month}-01`;
    }

    return { value, handleChange, onSubmitUpdate, openExchangeRateModal, setOpenModal, openModal, currencyRate, formatDate }
}