import { ProductMasterType } from "@/core/enum";
import { IGetCustomerProduct, IGetPricingListReq } from "@/core/interface/services";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import CustomerService from "@/services/CustomerService";
import DiscountService from "@/services/DiscountService";
import PricingGroupService from "@/services/PricingGroupService";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export const useFetchDiscountAndPricingGroupbyFiatId = (productType: any, fiatCurrencyId: string) => {
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const { getOneCustomerProduct } = CustomerService();
    const { state } = useLocation();
    const handleGetOneProductCustomer = async () => {
        try {
            const { data }: IGetCustomerProduct = await getOneCustomerProduct(
                state.cid,
                state.cpid,
                state.pid,
            );
            return data?.fiat_currency_id
        } catch (error) {
            console.log(error)
        }
    }

    const { getDiscountsForCustomer } = DiscountService();
    const [discounts, setDiscounts] = useState<Object[]>([]);
    const getDiscountsList = async (fiatId?: string) => {
        try {
            let currencyId: any = await handleGetOneProductCustomer()
            const res = await getDiscountsForCustomer(productType === ProductMasterType.AUTO ? currencyId : (fiatId ? fiatId : fiatCurrencyId));
            const discountLists = res?.data || [];
            setDiscounts(discountLists);
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        }
    };


    const { getPricingGroupSelect } = PricingGroupService();
    const [pricingGroup, setPricingGroup] = useState<any[]>([])
    const getPricingGroup = async (fiatId?: string) => {
        try {
            const body: IGetPricingListReq = {
                product_id: state.pid,
                currency_id: productType === ProductMasterType.AUTO ? state.fcid : (fiatId ? fiatId : fiatCurrencyId)
            }
            const response = await getPricingGroupSelect(body)
            setPricingGroup(response.data)

        } catch (error) {

        }
    }

    return {
        discounts,
        getDiscountsList,
        pricingGroup,
        getPricingGroup,
    };
};
