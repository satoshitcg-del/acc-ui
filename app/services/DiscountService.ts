//interface discount service
import { ICreateDiscountReq, ICreateDiscountRes, IDiscountAllReq, IDiscountAllRes, IDiscountListAllRes, IDiscountOneReq, IDiscountOneRes, IUpdateDiscountReq, IUpdateDiscountRes, ICurrencyRes } from "@/core/interface/services";
import axios from "axios";
import ApiService from "./ServiceRequest"

const DiscountService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();
    const getDiscountList = async (args: IDiscountAllReq): Promise<IDiscountAllRes> => {
        const { active, discount_name, discount_amount, discount_type, page, limit } = args
        const body = {
            params: {
                active,
                discount_name,
                discount_amount,
                discount_type,
                page,
                limit,
            },
            ...option
        }
        try {
            const payload = await axios.get(`${endpoint}/v1/discount/search`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createDiscount = async (body: ICreateDiscountReq): Promise<ICreateDiscountRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/discount`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getDiscountOne = async (body: IDiscountOneReq): Promise<IDiscountOneRes> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/discount/${body.id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateDiscountList = async (id: string, body: IUpdateDiscountReq): Promise<IUpdateDiscountRes> => {
        try {
            const payload = await axios.put(`${endpoint}/v1/discount/${id}`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getDiscountSelectList = async (): Promise<IDiscountListAllRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/discount/list`, null, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getDiscountsForCustomer = async (currency_id: string) => {
        try {
            const body = {
                params: {
                    "currency_id": currency_id,
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/customer-product/discounts`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getAllCurrencyForDiscount = async (): Promise<ICurrencyRes> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/currency/all`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    return {
        getDiscountList,
        createDiscount,
        getDiscountOne,
        updateDiscountList,
        getDiscountSelectList,
        getAllCurrencyForDiscount,
        getDiscountsForCustomer
    }
}
export default DiscountService
