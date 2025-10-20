import { useState, useEffect } from 'react';
// import dayjs from 'dayjs';

import ProductManagementService from '@/services/ProductManagementService';

//------ Interface && Enum  ------
import type {
    IProductManagementListData,
    IProductManagementListReq,
    IProductManagementListRes,
    IPagination,
} from "@/core/interface/services"
import type { IrowsProductManagement, IrowsProductName } from "../props";
import { TriggerTableProductManagement } from '../storerecoil';
import { useRecoilState } from 'recoil';
import { useTranslateErrorCode } from './useErrorCode';
import { t } from 'i18next';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';


interface IHandlePagination {
    count_data: number,
    count_page: number,
    row_amount: number,
}


const createDataSubProducts = (body: IProductManagementListData): IProductManagementListData => ({
    billing_cycle_id: body.billing_cycle_id,
    billing_cycle: body.billing_cycle,
    month: body.month,
    year: body.year,
    rate: body.rate,
    currency_type: body.currency_type,
    product: body.product,
});


export const useFetchProductManagement = () => {
    const { getProductManagementList } = ProductManagementService();
    // const [triggerTable, setTriggerTable] = useRecoilState(TriggerTableProductManagement);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [productManagementList, setProductManagementList] = useState<IProductManagementListData[] | [] | null>(null)
    const [pagination, setPagination] = useState<IHandlePagination | null>(null)
    const [loading, setLoading] = useState(false);
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();
    const fetchProductManagement = async ({ productName, month, year, start = 0, end = 7 }: IProductManagementListReq) => {
        // setProductManagementList([])
        setLoading(true)
        try {
            const res = await getProductManagementList({ productName, month, year, start, end });
            let data = res.data.map((row: IProductManagementListData) => {
                return createDataSubProducts(row)
            });
            setTriggerFetch(!triggerFetch)
            setLoading(false)
            setProductManagementList(data)
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return {
        productManagementList,
        loading,
        triggerFetch,
        fetchProductManagement
    }
}