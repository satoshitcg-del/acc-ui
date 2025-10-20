import { GridRowId, GridRowModel } from "@mui/x-data-grid"
import axios, { AxiosRequestConfig } from "axios"
import ApiService from "./ServiceRequest"

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

const InvoiceService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();
    const getInvoice = async (params: SearchReq): Promise<any> => {
        try {
            const body = {
                params: {
                    ...params,
                    "page": '1',
                    "limit": '1000',
                },
                ...option,
            }
            const payload = await axios.get(`${endpoint}/v1/pdf/invoices/search`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getPDF = async (id: string): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/pdf/export/invoice/${id}`, { ...option, responseType: 'blob' });
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getSearchInvoice = async (params: SearchReq) => {
        try {
            const body: AxiosRequestConfig<any> | undefined = {
                params: {
                    ...params,
                    "page": '1',
                    "limit": '1000',
                },
                ...option,
            }
            const payload = await axios.get(`${endpoint}/v1/pdf/invoices/search`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateInvoice = async (id: string, body: GridRowModel) => {
        try {
            const payload = await axios.patch(`${endpoint}/v1/pdf/invoice/${id}`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteInvoice = async (id: GridRowId): Promise<any> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/pdf/invoice/${id}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const confirmInvoice = async (id: GridRowId) => {
        try {
            const payload = await axios.patch(`${endpoint}/v1/pdf/invoice/confirm/${id}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    // Invoice Details
    const getInvoiceDetails = async (id: string): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/pdf/invoice/items/${id}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteInvoiceDetails = async (id: string, no: string): Promise<any> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/pdf/invoice/${id}/items/${no}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateInvoiceDetails = async (id: string, no: string, params: GridRowModel): Promise<any> => {
        const body = {
            ...params,
            "qty": Number(params.qty)
        }
        try {
            const payload = await axios.patch(`${endpoint}/v1/pdf/invoice/${id}/items/${no}`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const addInvoiceDetails = async (id: string, params: GridRowModel): Promise<any> => {
        try {
            const body = {
                ...params,
                "qty": Number(params.qty)
            }
            const payload = await axios.post(`${endpoint}/v1/pdf/invoice/${id}/items`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const addDiscount = async (id: string, no: string, body: GridRowModel): Promise<any> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/pdf/invoice/${id}/items/${no}/discount`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateDiscount = async (id: string, no: string, discountNo: string, body: GridRowModel): Promise<any> => {
        try {
            const payload = await axios.put(`${endpoint}/v1/pdf/invoice/${id}/items/${no}/discount/${discountNo}`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteDiscount = async (id: string, no: string, discountNo: string): Promise<any> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/pdf/invoice/${id}/items/${no}/discount/${discountNo}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const addInvoiceDiscount = async (id: string, discountId: string, body: GridRowModel): Promise<any> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/pdf/invoice/${id}/discount`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateInvoiceDiscount = async (id: string, discountId: string, body: GridRowModel): Promise<any> => {
        try {
            const payload = await axios.put(`${endpoint}/v1/pdf/invoice/${id}/discount/${discountId}`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteInvoiceDiscount = async (id: string, discountId: string): Promise<any> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/pdf/invoice/${id}/discount/${discountId}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    // new
    const getInvoiceDiscount = async (id: GridRowId) => {
        try {
            const payload = await axios.get(`${endpoint}/v1/pdf/invoice/${id}/discount`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getInvoiceDetailsDiscount = async (id: string, itemId: string): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/pdf/invoice/${id}/items/${itemId}/discount`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createPaymentUpload = async (body: FormData, onProgress: (progress: number) => void): Promise<any> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/system-file/invoice/qr-payment`, body, {
                ...option,
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total || 1;
                    const progress = Math.round((progressEvent.loaded / total) * 100);
                    onProgress(progress);
                },
            });
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    const deletePaymentUpload = async (file_name: string): Promise<any> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/system-file/invoice/qr-payment/${file_name}`, option)
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    const createSlipUpload = async (body: FormData, onProgress: (progress: number) => void): Promise<any> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/system-file/invoice/slip`, body, {
                ...option,
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total || 1;
                    const progress = Math.round((progressEvent.loaded / total) * 100);
                    onProgress(progress);
                },
            });
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    const deleteSlipUpload = async (file_name: string): Promise<any> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/system-file/invoice/slip/${file_name}`, option)
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    const updateQrPayment = async (body: any, id: string): Promise<any> => {
        try {
            const payload = await axios.put(`${endpoint}/v1/billing-note/invoice/qr-payment/${id}`, body, {
                ...option,
            });
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    const deleteUploadSlips = async (req: string[]): Promise<any> => {
        try {
            const body = {
                file_name: req,
            }
            const payload = await axios.delete(`${endpoint}/v1/system-file/invoice/group`, {
                ...option,
                data: body,
            })
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };
    return {
        getInvoice,
        getPDF,
        getSearchInvoice,
        updateInvoice,
        deleteInvoice,
        confirmInvoice,
        getInvoiceDetails,
        deleteInvoiceDetails,
        updateInvoiceDetails,
        addInvoiceDetails,
        addDiscount,
        updateDiscount,
        deleteDiscount,
        addInvoiceDiscount,
        updateInvoiceDiscount,
        deleteInvoiceDiscount,
        getInvoiceDiscount,
        getInvoiceDetailsDiscount,
        createPaymentUpload,
        deletePaymentUpload,
        createSlipUpload,
        deleteSlipUpload,
        updateQrPayment,
        deleteUploadSlips,

    }
}
export default InvoiceService