import { useState, useEffect } from "react";
// service
import DiscountService from "@/services/DiscountService";

import { IProductList } from "@/core/interface/services.js";


export const useFetchDiscount = (currency_id: string) => {
    const { getDiscountsForCustomer } = DiscountService();
    const [discounts, setDiscounts] = useState<any[]>([]);

    useEffect(() => {
        if(currency_id) fetchDiscountList(currency_id);
    }, [currency_id])


    const fetchDiscountList = async (currency_id: string) => {
        try {
            const res = await getDiscountsForCustomer(currency_id);
            setDiscounts(res.data);
        } catch (error: any) {
            console.log(`Error useFetchProduct ${error.response.data.message}`);
        }
    };

    return {
        discounts
    }
}