import { config } from "@/core/config.js";
import { TokenType } from "@/core/enum";
import type { IPrefixesListRes } from "@/core/interface/services";
import { checkErrorResponse } from "@/core/utils";
import axios from "axios";
import Cookies from "js-cookie";


export interface ICustomerGetListResp { }

class RegisterFormService {
    private endpoint: string
    private config: object

    constructor() {
        this.endpoint = config.app.api || "localhost";
        this.config = {
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
        };
    }
    
    async createRegisterForm(cid: string, cpid?: string): Promise<any> {
        try {
            const body = {
                customer_id: cid,
                customer_product_id: cpid
            }
            const payload = await axios.post(`${this.endpoint}/v1/prefix-form/create`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async reCreateRegisterForm(cid: string, cpid: string, fid: string): Promise<any> {
        try {
            const body = {
                customer_id: cid,
                customer_product_id: cpid,
                form_id: fid
            }
            const payload = await axios.post(`${this.endpoint}/v1/prefix-form/re-create`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async syncRegisterForm(cid: string, cpid: string, fid: string): Promise<any> {
        try {
            const body = {
                customer_id: cid,
                customer_product_id: cpid,
                form_id: fid
            }
            const payload = await axios.post(`${this.endpoint}/v1/prefix-form/sync`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
}
export default RegisterFormService;