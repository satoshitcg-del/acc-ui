import CustomerService from "@/services/CustomerService";
import { useEffect, useState } from "react";

export const useFetchCustomerProducts = () => {
  const { getProductNameList } = CustomerService();
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    fetchProductName()
  }, []);
  
  const fetchProductName = async () => {
    try {
      const products = await getProductNameList();
      setProducts(products);
      
    } catch (error) {
      console.error(error);
      
    }
  };
  return {
    products,
  }
}