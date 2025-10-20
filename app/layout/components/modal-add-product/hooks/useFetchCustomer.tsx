import { useState, useEffect } from "react";
// service
import CustomerService from "@/services/CustomerService";


export const useFetchCustomer = () => {
    const { getCustomerNameList } = CustomerService();
    const [customers, setCustomers] = useState<any[]>([]);
    const [customersForSelect, setCustomersForSelect] = useState<any[]>([]);

    useEffect(() => {
        FetchCustomerList();
    }, [])

    useEffect(() => {
        Formatcustomers()
    }, [customers])



    const Formatcustomers = () => {
        let data = customers?.map((rows, index) => {
            return { customer_id: rows.id, username: rows.username, full_name: rows.full_name }
        })
        setCustomersForSelect(data)
    }

    const FetchCustomerList = async () => {
        try {
            const res = await getCustomerNameList();
            setCustomers(res?.data);
        } catch (error: any) {
            console.log(`Error useFetchProduct ${error.response.data.message}`);
        }
    };

    return {
        customers,
        FetchCustomerList,
        customersForSelect,
        Formatcustomers,
    }
}