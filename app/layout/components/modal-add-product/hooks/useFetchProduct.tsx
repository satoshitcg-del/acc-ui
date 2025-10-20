import { useState, useEffect } from "react";
// service
import CustomerService from "@/services/CustomerService";

import { IProductList } from "@/core/interface/services.js";

export const useFetchProduct = () => {
    const { getProductNameList } = CustomerService();
    const [products, setProducts] = useState<IProductList[]>([]);

    useEffect(() => {
        fetchProductList();
    }, [])

    const fetchProductList = async () => {
        try {
            const products = await getProductNameList();
            setProducts(products);
        } catch (error: any) {
            console.log(`Error useFetchProduct ${error.response.data.message}`);
        }

    };

    return {
        products
    }
}