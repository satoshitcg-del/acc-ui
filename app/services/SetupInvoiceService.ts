//interface prefix service
import {  IGroupingInvoiceResponse, IResponseBase } from "@/core/interface/services";
import axios from "axios";
import ApiService from "./ServiceRequest"

const SetupInvoiceService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();

    const getProductLists = async(id: string): Promise<IGroupingInvoiceResponse> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/setup-inv/${id}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createGroupInvoiceService = async(id: string, body: any): Promise<IResponseBase> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/setup-inv/${id}`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    return {
        getProductLists,
        createGroupInvoiceService
    }
}
export default SetupInvoiceService
