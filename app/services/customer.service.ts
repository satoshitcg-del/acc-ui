import { config } from "@/core/config.js";
import type {
    IAddCustomerProductReq,
    ICustomerGetListReq,
    ICustomerOneSubProduct,
    ICustomerSubProductReq,
    IDeleteCustomerProductReq,
    IUpdateCustomerProductReq,
    IUpdateCustomerSubProductReq,
    IUpdateCustomerSubProductRes,
    IDeleteCustomerSubProductReq,
    IDeleteCustomerReq,
    ICustomerSubProductActiveReq,
    ICustomerSubProductActiveRes,
    IProductList,
    ICustomerList,
    IDeleteCustomerRes,
    IDeleteCustomerProductRes,
    IGetCustomerOneReq,
    ICustomer,
    IAddCustomerReq,
    IAddCustomerRes,
    IUpdateCustomerReq,
    IUpdateCustomerRes,
    ICustomerGetListRes,
    IAddCustomerProductRes,
    IGetCustomerProduct,
    IUpdateCustomerProductRes,
    IDeleteCustomerSubProductRes,
    IAddCustomerSubProductReq,
    IAddCustomerSubProductRes,
    ICustomerOneSubProductRes,
    ICustomerSubProductRes,
    ICustomerListRes,
    IGetCustomerRes,
    ICustomerListOneRes,
} from "@/core/interface/services";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

import type {
    IGetListCustomerReq,
    IGetListCustomerRes,
    ICustomerProductActiveReq,
    ICustomerProductActiveRes,
} from "@/core/interface/services"
import { checkErrorResponse } from "@/core/utils";
import { GridRowId } from "@mui/x-data-grid";
import { TokenType } from "@/core/enum";

export interface ICustomerGetListResp { }

class CustomerDataService {
    private endpoint: string
    private config: object

    constructor() {
        this.endpoint = config.app.api || "localhost";
        this.config = {
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
        };
    }

    async updateCustomerProductActive(args: ICustomerProductActiveReq): Promise<ICustomerProductActiveRes> {

        const { active, customer_id, customer_product_id } = args as ICustomerProductActiveReq

        const bodyReq = {
            active,
            customer_id,
            customer_product_id
        }

        try {
            const payload = await axios.patch(`${this.endpoint}/v1/customer-product/active`, bodyReq, this.config);

            return payload.data

        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateCustomerSubProductActive(args: ICustomerSubProductActiveReq): Promise<ICustomerSubProductActiveRes> {

        const { active, customer_id, customer_product_id, customer_sub_product_id } = args as ICustomerSubProductActiveReq

        const bodyReq = {
            active,
            customer_id,
            customer_product_id,
            customer_sub_product_id
        }

        try {
            const payload = await axios.patch(`${this.endpoint}/v1/customer-sub-product/active`, bodyReq, this.config);

            return payload.data

        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getCustomerPdf(customer_id: string | GridRowId): Promise<any> {
        // console.log("IDIDIDId", username)
        try {
            const payload = await axios.get(`${this.endpoint}/v1/pdf/preview/${customer_id}`, {
                ...this.config,
                responseType: 'arraybuffer',
            });
            return payload
        } catch (error: any) {
            const decoder = new TextDecoder("utf-8");
            const decodeError = JSON.parse(decoder.decode(error.response.data))


            checkErrorResponse(decodeError.code)
            throw decodeError
        }
    }

    async getCustomerNameList(): Promise<ICustomerListRes> {
        try {
            const payload = await axios.get(`${this.endpoint}/v1/customer/list`, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getProductNameList(): Promise<IProductList[]> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/product/list`, null, this.config);

            return payload.data.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteCustomer(args: IDeleteCustomerReq): Promise<IDeleteCustomerRes> {
        const { id } = args as IDeleteCustomerReq
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/customer/delete/${id}`, {}, this.config);

            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteCustomerProduct(req: IDeleteCustomerProductReq): Promise<IDeleteCustomerProductRes> {
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/customer-product/delete`, req, this.config);

            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getListCustomer(args: IGetListCustomerReq): Promise<IGetCustomerRes> {
        try {
            const { username, page, limit } = args
            const body = {
                params: {
                    username: username.length != 0 ? username : null,
                    page,
                    limit,
                },
                ...this.config
            }
            const payload = await axios.get(`${this.endpoint}/v1/customer/search`, body);
            console.log('payload:', payload);

            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getOne(body: IGetCustomerOneReq): Promise<ICustomerListOneRes> {
        try {
            console.log("body", body)
            const { id } = body
            const payload = await axios.get(`${this.endpoint}/v1/customer?id=${id}`, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async create(body: IAddCustomerReq): Promise<IAddCustomerRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/customer/create`, body, this.config);

            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async update(body: IUpdateCustomerReq): Promise<IUpdateCustomerRes> {
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/customer/update`, body, this.config);

            if (payload.data.code !== 1001) {
                throw payload.data
            }
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getAllDetailProductToCustomer(args?: ICustomerGetListReq): Promise<ICustomerGetListRes> {

        try {
            const { customer_id, product_name, prefix_name, active, limit, page } = args as ICustomerGetListReq

            const body = {
                params: {
                    customer_id,
                    product_name,
                    prefix_name,
                    active,
                    limit,
                    page,
                },
                ...this.config
            }

            const payload = await axios.get(`${this.endpoint}/v1/customer-product/all`, body);
            console.log("payload /customer-product/all ==>", payload);

            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    async createProductList(body?: IAddCustomerProductReq): Promise<IAddCustomerProductRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/customer-product/add`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    async getProductOne(customer_id: string, customer_product_id: string, product_id: string): Promise<IGetCustomerProduct> {
        try {
            const body = {
                params: {
                    "customer_id": customer_id,
                    "customer_product_id": customer_product_id,
                    "product_id": product_id,
                },
                ...this.config
            }
            const payload = await axios.get(`${this.endpoint}/v1/customer-product/one`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateProduct(body?: IUpdateCustomerProductReq): Promise<IUpdateCustomerProductRes> {
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/customer-product/update`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteProduct(cid: string, id: string, note: string): Promise<any> {// In delete modal, Not used anymore
        const body = {
            "customer_id": cid,
            "id": id,
            "note": note
        }
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/customer-product/delete`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getOneDetailProductToCustomer(args: ICustomerSubProductReq): Promise<ICustomerSubProductRes> {

        try {
            const { customer_id, customer_product_id, product_name, prefix_name, active, limit, page } = args as ICustomerSubProductReq
            const body = {
                params: {
                    customer_id,
                    customer_product_id,
                    product_name,
                    prefix_name,
                    active,
                    limit,
                    page,
                },
                ...this.config
            }

            const payload = await axios.get(`${this.endpoint}/v1/customer-sub-product/all`, body);
            // console.log("payload/customer-sub-product/all ==>", payload);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getOneSubProductCustomer(args: ICustomerOneSubProduct): Promise<ICustomerOneSubProductRes> {
        try {
            const { customer_id, customer_product_id, customer_sub_product_id } = args as ICustomerOneSubProduct
            console.log(customer_id, customer_product_id, customer_sub_product_id)
            const body = {
                params: {
                    customer_id,
                    customer_product_id,
                    customer_sub_product_id,
                },
                ...this.config
            }

            const payload = await axios.get(`${this.endpoint}/v1/customer-sub-product/one`, body)
            console.log("payload/customer-sub-product/onel ==>", payload);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async addSubProductToCustomer(body: IAddCustomerSubProductReq): Promise<IAddCustomerSubProductRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/customer-sub-product/add`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateSubProductToCustomer(body: IUpdateCustomerSubProductReq): Promise<IUpdateCustomerSubProductRes> {
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/customer-sub-product/update`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteSubProductToCustomer(body: IDeleteCustomerSubProductReq): Promise<IDeleteCustomerSubProductRes> {
        try {
            const payload = await axios.patch(`${this.endpoint}/v1/customer-sub-product/delete`, body, this.config)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }



    async getPDFGroup(id: readonly number[], customer_id: string) {
        const result = id.join(',');
        try {
            const payload = await axios.get(`${this.endpoint}/v1/pdf/exports/${customer_id}?invoiceType=GROUP&productIds=${result}`, { ...this.config, responseType: 'blob' })
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getPDFSeparate(id: readonly number[], customer_id: string) {
        const result = id.join(',');
        try {
            const payload = await axios.get(`${this.endpoint}/v1/pdf/exports/${customer_id}?invoiceType=SEPERATE&productIds=${result}`, { ...this.config, responseType: 'blob' })
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

}

export default CustomerDataService;