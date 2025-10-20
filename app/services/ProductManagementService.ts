
import axios from "axios";

import type {
    IConfirmWLReq,
    IProductManagementListReq,
    IProductManagementListRes,
    IUpdateRateReq,
    IUpdateRateRes,
} from "@/core/interface/services"
import ApiService from "./ServiceRequest"

const ProductManagementService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();
    const getProductManagementList = async ({ productName, month, year, start, end }: IProductManagementListReq): Promise<IProductManagementListRes> => {
        try {
            const queryParams = { productName, month, year, start, end };
            const config = {
                ...option,
                params: queryParams,
            };
            const response = await axios.get(`${endpoint}/v1/pm/list`, config);
            return response.data;
        } catch (error) {
            checkErrorResponse(error)
            throw error;
        }
    }

    const updateRate = async (id: string, body: IUpdateRateReq): Promise<IUpdateRateRes> => {
        try {
            const response = await axios.put(`${endpoint}/v1/pm/rate/${id}`, body, option);
            return response.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const confirmWinLose = async (body: IConfirmWLReq): Promise<IUpdateRateRes> => {

        try {
            const payload = await axios.post(`${endpoint}/v1/pm/confirm-wl`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const generatePdf = async (body: IConfirmWLReq): Promise<IUpdateRateRes> => {

        try {
            const payload = await axios.post(`${endpoint}/v1/pm/gen-pdf`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const sendTwoFactor = async (body: string) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/verify/totp`, { "totp_key": body }, option);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const getRateListProductManagement = async (date: string) => {

        const body = {
            params: {
                "date": date,
            },
            ...option
        }

        try {
            const payload = await axios.get(`${endpoint}/v1/currency/rate/list`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getAutoPlayProductList = async () => {
        try {
            const payload = await axios.get(`${endpoint}/v1/pm/autoplay/product`, option);
            return payload?.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getAutoPlayPrefix = async (product_name: string, month: string, year: string) => {
        try {
            const queryParams = { product_name, month, year };
            const config = {
                ...option,
                params: queryParams,
            };
            const payload = await axios.get(`${endpoint}/v1/autoplay/info`, config);
            return payload?.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createAutoPlayWinLose = async (body: any): Promise<IUpdateRateRes> => {

        try {
            const payload = await axios.post(`${endpoint}/v1/autoplay`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }


    const getAutoPlayWinlose = async (month: string, year: string, prefix?: string,) => {
        try {
            const queryParams = { month, year, prefix };
            const config = {
                ...option,
                params: queryParams,
            };
            const payload = await axios.get(`${endpoint}/v1/autoplay/winlose`, config);
            return payload?.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    return {
        getProductManagementList,
        updateRate,
        confirmWinLose,
        generatePdf,
        sendTwoFactor,
        getRateListProductManagement,
        getAutoPlayProductList,
        getAutoPlayPrefix,
        createAutoPlayWinLose,
        getAutoPlayWinlose,
    }
}
export default ProductManagementService