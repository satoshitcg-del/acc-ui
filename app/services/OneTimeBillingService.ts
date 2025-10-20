//interface prefix service

import axios from "axios";
import ApiService from "./ServiceRequest"
import { IResponseBase, IOneTimeBillingListRequest, IOneTimeBillingListResponse, IUpdateOneTimeStatusReq, IOneTimeBillingResponse, IBillingListRes } from "@/core/interface/services";

const OneTimeBillingService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();
    const createOneTimeBilling = async (body: any): Promise<IResponseBase> => { // ICreateOneTimeBillingResponse
        try {
            const payload = await axios.post(`${endpoint}/v1/onetime-billing`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateOneTimeBillingById = async (id: string, body: any): Promise<any> => {
        try {
            const bodyReq = {
                invoice_id: id,
                items: body.items
            }
            const payload = await axios.put(`${endpoint}/v1/onetime-billing/${id}`, bodyReq, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteOneTimeBillingById = async (id: string): Promise<IResponseBase> => {
        try {
            console.log("Query Params By ID :", id);
            const payload = await axios.delete(`${endpoint}/v1/onetime-billing/${id}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getOneTimeLists = async (req: IOneTimeBillingListRequest): Promise<IOneTimeBillingListResponse[]> => {
        try {
            const { invoice_no, full_name, prefix, status, month, year, page, limit } = req
            const body = {
                params: {
                    invoice_no,
                    full_name,
                    prefix,
                    status,
                    month,
                    year,
                    page,
                    limit,
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/onetime-billing/search`, body)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getOnetimeCustomerProducts = async (req: any): Promise<IOneTimeBillingListResponse[]> => {
        try {
            const { customer_id, is_setup } = req
            const body = {
                params: {
                    customer_id,
                    is_setup,
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/onetime-billing/customer-product`, body)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getOneTimeById = async (id: string): Promise<IOneTimeBillingResponse> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/onetime-billing/${id}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getSubProductLists = async (): Promise<any[]> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/onetime-billing/sub-product`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateStatusOneTimeBillingById = async (req: any): Promise<any> => { // IUpdateOneTimeStatusReq
        try {
            const { id, status, amount, cause, currency_id, invoice_id, note, payment_type, updated_at, wallet_name, wallet_no, wallet_type } = req;
            const body = {
                status,
                note,
                wallet_no,
                wallet_type,
                amount,
                cause,
                currency_id,
                // invoice_id,
                payment_type,
                // updated_at,
                // wallet_name,
            }
            console.log("Update status By ID :", id, "status :", body);
            const payload = await axios.put(`${endpoint}/v1/onetime-billing/status/${id}`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getOnetimeDashboard = async (): Promise<IBillingListRes> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/onetime-billing/dashboard`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    return {
        createOneTimeBilling,
        updateOneTimeBillingById,
        deleteOneTimeBillingById,
        getOneTimeLists,
        getOneTimeById,
        updateStatusOneTimeBillingById,
        getSubProductLists,
        getOnetimeCustomerProducts,
        getOnetimeDashboard
    }
}
export default OneTimeBillingService
