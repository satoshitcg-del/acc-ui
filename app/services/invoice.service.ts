import { config } from "@/core/config.js";
import { TokenType } from "@/core/enum";
import { checkErrorResponse } from "@/core/utils";
import { GridRowId, GridRowModel } from "@mui/x-data-grid";
import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export interface ICustomerGetListResp { }

export interface GetInvoiceResponse {
    id: string
    username: string
    product_id: string
    product_name: string
    prefix: string
    invoice_no: string
    invoice_date: any
    rate: number
    total_payment: number
    active: boolean
    created_at: string
    updated_at: string
}

export interface SearchReq {
    username: string
    prefix: string
    invoice_no: string
}

export interface UpdateReq {
    active: boolean
    invoice_date: string
    invoice_no: string
    prefix: string
    product_name: string
    rate: number
    username: string
}

class InvoiceDataService {
    private readonly endpoint: string
    private readonly config: object

    constructor() {
        this.endpoint = config.app.api || "localhost";
        this.config = {
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
        };
    }
    // Invoice
    async getInvoice(params: SearchReq): Promise<any> {
        try {
            const body = {
                params: {
                    ...params,
                    "page": '1',
                    "limit": '1000',
                },
                ...this.config,
            }
            const payload = await axios.get(`${this.endpoint}/v1/pdf/invoices/search`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getPDF(id: string): Promise<any> {
        try {
            const payload = await axios.get(`${this.endpoint}/v1/pdf/export/invoice/${id}`, { ...this.config, responseType: 'blob' });
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getSearchInvoice(params: SearchReq) {
        try {
            const body: AxiosRequestConfig<any> | undefined = {
                params: {
                    ...params,
                    "page": '1',
                    "limit": '1000',
                },
                ...this.config,
            }
            const payload = await axios.get(`${this.endpoint}/v1/pdf/invoices/search`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateInvoice(id: string, body: GridRowModel) {
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/pdf/invoice/${id}`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteInvoice(id: GridRowId): Promise<any> {
        try {
            const payload = await axios.delete(`${this.endpoint}/v1/pdf/invoice/${id}`, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async confirmInvoice(id: GridRowId) {
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/pdf/invoice/confirm/${id}`, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    // Invoice Details
    async getInvoiceDetails(id: string): Promise<any> {
        try {
            const payload = await axios.get(`${this.endpoint}/v1/pdf/invoice/items/${id}`, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteInvoiceDetails(id: string, no: string): Promise<any> {
        try {
            const payload = await axios.delete(`${this.endpoint}/v1/pdf/invoice/${id}/items/${no}`, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateInvoiceDetails(id: string, no: string, params: GridRowModel): Promise<any> {
        const body = {
            ...params,
            "qty": Number(params.qty)
        }
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/pdf/invoice/${id}/items/${no}`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async addInvoiceDetails(id: string, params: GridRowModel): Promise<any> {
        try {
            const body = {
                ...params,
                "qty": Number(params.qty)
            }
            const payload = await axios.post(`${this.endpoint}/v1/pdf/invoice/${id}/items`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async addDiscount(id: string, no: string, body: GridRowModel): Promise<any> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/pdf/invoice/${id}/items/${no}/discount`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateDiscount(id: string, no: string, discountNo: string, body: GridRowModel): Promise<any> {
        try {
            const payload = await axios.put(`${this.endpoint}/v1/pdf/invoice/${id}/items/${no}/discount/${discountNo}`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteDiscount(id: string, no: string, discountNo: string): Promise<any> {
        try {
            const payload = await axios.delete(`${this.endpoint}/v1/pdf/invoice/${id}/items/${no}/discount/${discountNo}`, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async addInvoiceDiscount(id: string, discountId: string, body: GridRowModel): Promise<any> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/pdf/invoice/${id}/discount`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateInvoiceDiscount(id: string, discountId: string, body: GridRowModel): Promise<any> {
        try {
            const payload = await axios.put(`${this.endpoint}/v1/pdf/invoice/${id}/discount/${discountId}`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteInvoiceDiscount(id: string, discountId: string): Promise<any> {
        try {
            const payload = await axios.delete(`${this.endpoint}/v1/pdf/invoice/${id}/discount/${discountId}`, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    // new
    async getInvoiceDiscount(id: GridRowId) {
        try {
            const payload = await axios.get(`${this.endpoint}/v1/pdf/invoice/${id}/discount`, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getInvoiceDetailsDiscount(id: string, itemId: string): Promise<any> {
        try {
            const payload = await axios.get(`${this.endpoint}/v1/pdf/invoice/${id}/items/${itemId}/discount`, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
}

export default InvoiceDataService;