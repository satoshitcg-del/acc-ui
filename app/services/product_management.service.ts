import { config } from "@/core/config.js";
import axios, { AxiosHeaders } from "axios";
import Cookies from "js-cookie";

import type {
    IConfirmWLReq,
    IProductManagementListReq,
    IProductManagementListRes,
    IUpdateRateReq,
    IUpdateRateRes,
} from "@/core/interface/services"
import { checkErrorResponse } from "@/core/utils";
import { TokenType } from "@/core/enum";


class ProductManagementService {
    private endpoint: string
    private config: object

    constructor() {
        this.endpoint = config.app.api || "localhost";
        this.config = {
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
        };
    }

    async getProductManagementList({ productName, month, year, start, end }: IProductManagementListReq): Promise<IProductManagementListRes> {
        try {
            const queryParams = { productName, month, year, start, end };
            const config = {
                ...this.config,
                params: queryParams,
            };
            const response = await axios.get(`${this.endpoint}/v1/pm/list`, config);
            return response.data;
        } catch (error) {
            // console.error("Error fetching product list:", error);
            checkErrorResponse(error)
            throw error;
        }
    }

    async updateRate(id: string, body: IUpdateRateReq): Promise<IUpdateRateRes> {
        try {
            const response = await axios.put(`${this.endpoint}/v1/pm/rate/${id}`, body, this.config);
            return response.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async confirmWinLose(body: IConfirmWLReq): Promise<IUpdateRateRes> {

        try {
            const payload = await axios.post(`${this.endpoint}/v1/pm/confirm-wl`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async generatePdf(body: IConfirmWLReq): Promise<IUpdateRateRes> {

        try {
            const payload = await axios.post(`${this.endpoint}/v1/pm/gen-pdf`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async sendTwoFactor(body: string) {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/auth/verify/totp`, { "totp_key": body }, this.config);
            return payload.data
        } catch (error) {
            throw error
        }
    }

}

export default ProductManagementService;