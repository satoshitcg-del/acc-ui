import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";

import DiscountService from "@/services/DiscountService";

import { IDiscountListAllRes, IProductList } from "@/core/interface/services.js";


export const useFetchDiscount = () => {
    const [discounts, setDiscounts] = useState<IDiscountListAllRes>();
    const { getDiscountSelectList } = DiscountService();

    useEffect(() => {
        fetchDiscountList();
    }, [])


    const fetchDiscountList = async () => {
        try {
            const res = await getDiscountSelectList();
            setDiscounts(res);
        } catch (error: any) {
            console.log(`Error useFetchProduct ${error.response.data.message}`);
        }
    };

    return {
        discounts
    }
}