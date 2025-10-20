import { config } from "@/core/config.js";
import { TokenType } from "@/core/enum";
import { ICreateDiscountReq, ICreateDiscountRes, IDiscountAllReq, IDiscountAllRes, IDiscountListAllRes, IDiscountOneReq, IDiscountOneRes, IUpdateDiscountReq, IUpdateDiscountRes } from "@/core/interface/services";
import { checkErrorResponse } from "@/core/utils";
import axios, { AxiosHeaders } from "axios";
import Cookies from "js-cookie";

export interface IDiscountGetListResp { }


class DiscountDataService {
    private endpoint: string
    private config: object

    constructor() {
        this.endpoint = config.app.api || "localhost";
        this.config = {
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
        };
    }

    async getDiscountList(body: IDiscountAllReq): Promise<IDiscountAllRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/discount/get`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async createDiscount(body: ICreateDiscountReq): Promise<ICreateDiscountRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/discount/create`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getDiscountOne(body: IDiscountOneReq): Promise<IDiscountOneRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/discount/get-one`, body, this.config);
            console.log("getDiscountOne", payload)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateDiscountList(body: IUpdateDiscountReq): Promise<IUpdateDiscountRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/discount/update`, body, this.config);
            console.log("discount", payload.data)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getDiscountSelectList(): Promise<IDiscountListAllRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/discount/list`, null, this.config);
            // console.log("getDiscountSelectList", payload)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
}



export default DiscountDataService;