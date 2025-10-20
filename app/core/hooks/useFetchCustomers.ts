import CustomerService from "@/services/CustomerService";
import { useEffect, useState } from "react";
import { ICustomer } from "../interface/services";

export const useFetchCustomers = () => {
  const [customerList, setCustomerList] = useState<ICustomer[]>();
  const { getCustomerNameList } = CustomerService();
  useEffect(() => {
    fetchProductName()
  }, []);

  const fetchProductName = async () => {
    try {
      const { data } = await getCustomerNameList();
      const checkDataNull = data || []
      setCustomerList(checkDataNull)

    } catch (error) {
      console.error(error)
    }
  };
  return {
    customerList,
  }
}