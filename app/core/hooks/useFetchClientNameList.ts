import CustomerService from "@/services/CustomerService";
import { useEffect, useState } from "react";

export const useFetchClientNameList = () => {
    const { getClientNameList } = CustomerService();
    const [clientList, setClientList] = useState<any[]>([]);
    useEffect(() => {
        fetchClientName()
    }, []);

    const fetchClientName = async () => {
        try {
            const response = await getClientNameList();
            console.log("clientList ", response.data);

            setClientList(response.data);

        } catch (error) {
            console.error(error);

        }
    };
    return {
        clientList,
    }
}