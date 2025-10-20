import { config } from "@/core/config.js";
import { TokenType } from "@/core/enum";
import type { IPrefixesListRes } from "@/core/interface/services";
import { checkErrorResponse } from "@/core/utils";
import axios from "axios";
import Cookies from "js-cookie";


export interface ICustomerGetListResp { }

class PrefixDataService {
    private endpoint: string
    private config: object

    constructor() {
        this.endpoint = config.app.api || "localhost";
        this.config = {
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
        };
    }
    // Todo: Change interface field with IPREFIXLISTRES quick fix na kub
    async getPrefixList(): Promise<IPrefixesListRes> {
        try {
            const body = {
                params: {
                    prefix_name: '',
                    prefix_type: ''
                },
                ...this.config
            }
            const payload = await axios.get(`${this.endpoint}/v1/product-link/list`, body)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    //Todo: Frontend should be add interface with every service
    async createPrefix(name: string, type?: string): Promise<any> {
        try {
            const body = {
                prefix_name: name,
                prefix_type: 1
            }
            const payload = await axios.post(`${this.endpoint}/v1/prefix/create`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
}
export default PrefixDataService;