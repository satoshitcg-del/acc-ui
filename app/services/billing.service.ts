import { config } from "@/core/config.js";
import axios, { AxiosRequestConfig } from "axios";
import { checkErrorResponse } from "@/core/utils";
import { GridRowId, } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import type { IBillingCustomerInfo } from "@/core/interface/services";
import { TokenType } from "@/core/enum";

interface IUpdateStatus {
    amount: number,
    cause: string,
    invoice_id: string,
    note: string,
    status: string
}

interface IUpdateNote {
    invoice_id: string,
    note: string
}

class BillingNoteDataService {
    private readonly endpoint: string
    private readonly config: object

    constructor() {
        this.endpoint = config.app.api || "localhost";
        this.config = {
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
        };
    }


    async preview(invoice_id: string | GridRowId): Promise<any> {
        try {
            const payload = await axios.get(`${this.endpoint}/v1/billing-note/preview/${invoice_id}`, {
                ...this.config,
                responseType: 'arraybuffer',
            });
            console.log(payload.data);

            return payload
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async search(req: any) {
        try {

            const body = {
                params: {
                    ...req,
                    "page": '1',
                    "limit": '1000',
                },
                ...this.config
            }
            const payload = await axios.get(`${this.endpoint}/v1/billing-note/all`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getBillingNote(req: any) {
        try {
            const body = {
                params: {
                    ...req,
                    "page": '1',
                    "limit": '1000',
                },
                ...this.config
            }
            const payload = await axios.get(`${this.endpoint}/v1/billing-note/all`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getDashboard() {
        try {
            const payload = await axios.get(`${this.endpoint}/v1/billing-note/dashboard`, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getCustomerInfo(invoice_id: string, customer_id: string): Promise<IBillingCustomerInfo> {
        try {
            const body = {
                params: {
                    invoice_id,
                    customer_id
                },
                ...this.config
            }
            const payload = await axios.get(`${this.endpoint}/v1/billing-note/customer-info`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getHistory(id: GridRowId) {
        try {
            const payload = await axios.get(`${this.endpoint}/v1/billing-note/history?id=${id}`, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getNote(id: GridRowId) {
        try {
            const payload = await axios.get(`${this.endpoint}/v1/billing-note/note?id=${id}`, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateNote(body: IUpdateNote) {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/billing-note/note`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
        }
    }

    async updateStatus(body: IUpdateStatus) {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/billing-note/update`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
        }
    }



}

export default BillingNoteDataService;