import { config } from "@/core/config.js";
import { TokenType } from "@/core/enum";
import { ICreateProductReq, ICreateProductRes, ICreateSubProductReq, IDeleteProductReq, IDeleteProductRes, IDeleteSubProductReq, IDeleteSubProductRes, IProductAllReq, IProductAllRes, IProductListAllRes, IProductOneReq, IProductOneRes, ISubProductListAllRes, ISubProductAllReq, ISubProductAllRes, ISubProductListAllReq, ISubProductOneReq, ISubProductOneRes, IUpdateProductReq, IUpdateProductRes, IUpdateSubProductReq, IUpdateSubProductRes } from "@/core/interface/services";
import { checkErrorResponse } from "@/core/utils";
import axios, { AxiosHeaders } from "axios";
import Cookies from "js-cookie";

export interface IProductGetListResp { }


class ProductDataService {
    private endpoint: string
    private config: object

    constructor() {
        this.endpoint = config.app.api || "localhost";
        this.config = {
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
        };
    }

    async getProductList(body: IProductAllReq): Promise<IProductAllRes> {
        try {
            console.log("body", body)
            const payload = await axios.post(`${this.endpoint}/v1/product/get`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    async getSubProductList(body: ISubProductAllReq): Promise<ISubProductAllRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/sub-product/get`, body, this.config);
            console.log("payload", payload.data)
            return payload.data
        } catch (error) {
            // console.log("error", error)
            checkErrorResponse(error)
            throw error
        }
    }

    async getProductListSelect(): Promise<IProductListAllRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/product/list`, null, this.config);
            return payload.data
        } catch (error) {
            // console.log("error", error)
            checkErrorResponse(error)
            throw error
        }
    }

    async getSubProductListSelect(product_id: ISubProductListAllReq): Promise<ISubProductListAllRes> {
        try {
            const body = {
                ref: product_id
            }
            const payload = await axios.post(`${this.endpoint}/v1/sub-product/list `, body, this.config);
            return payload.data
        } catch (error) {
            // console.log("error", error)
            checkErrorResponse(error)
            throw error
        }
    }

    async getProductOne(body: IProductOneReq): Promise<IProductOneRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/product/get-one`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async getSubProductOne(body: ISubProductOneReq): Promise<ISubProductOneRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/sub-product/get-one`, body, this.config);
            // console.log('getSubProductOne', payload);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async createSubProduct(body: ICreateSubProductReq): Promise<ICreateProductRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/sub-product/create`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async createProduct(body: ICreateProductReq): Promise<ICreateProductRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/product/create`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateProduct(body: IUpdateProductReq): Promise<IUpdateProductRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/product/update`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async updateSubProduct(body: IUpdateSubProductReq): Promise<IUpdateSubProductRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/sub-product/update`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteProduct(body: IDeleteProductReq): Promise<IDeleteProductRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/product/update/active`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    async deleteSubProduct(body: IDeleteSubProductReq): Promise<IDeleteSubProductRes> {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/sub-product/update/active`, body, this.config);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
}

export default ProductDataService;