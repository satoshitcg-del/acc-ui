//interface product service
import { ICreateProductReq, ICreateProductRes, ICreateSubProductReq, IDeleteProductReq, IDeleteProductRes, IDeleteSubProductReq, IDeleteSubProductRes, IProductAllReq, IProductAllRes, IProductListAllRes, IProductOneReq, IProductOneRes, ISubProductListAllRes, ISubProductAllReq, ISubProductAllRes, ISubProductListAllReq, ISubProductOneReq, ISubProductOneRes, IUpdateProductReq, IUpdateProductRes, IUpdateSubProductReq, IUpdateSubProductRes } from "@/core/interface/services";
import axios from "axios";
import ApiService from "./ServiceRequest"

const ProductService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();
    const getProductList = async(req: IProductAllReq): Promise<IProductAllRes> => {
        try {
            const body = {
                params: {
                    active: req.active,
                    product_name: req.product_name,
                    price: req.price,
                    page: req.page,
                    limit: req.limit,
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/product/search`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const getSubProductList = async(id: string, req: ISubProductAllReq): Promise<ISubProductAllRes> => {
        try {
            const body = {
                params: {
                    active: req.active,
                    product_name: req.product_name,
                    price: req.price,
                    page: req.page,
                    limit: req.limit,
                    ref: req.ref // 
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/sub-product/search/${id}`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const getProductListSelect = async(): Promise<IProductListAllRes> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/product/list`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const getSubProductListSelect = async(product_id: ISubProductListAllReq): Promise<ISubProductListAllRes> => {
        try {
            const body = {
                ref: product_id
            }
            const payload = await axios.get(`${endpoint}/v1/sub-product/list/${body.ref} `, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const getProductOne = async(body: IProductOneReq): Promise<IProductOneRes> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/product/${body.id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const getSubProductOne = async(body: ISubProductOneReq): Promise<ISubProductOneRes> => {
        try {
            const { id } = body
            const payload = await axios.get(`${endpoint}/v1/sub-product/${id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const createSubProduct = async(body: ICreateSubProductReq): Promise<ICreateProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/sub-product`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const createProduct = async(body: ICreateProductReq): Promise<ICreateProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/product`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const updateProduct = async(id: string, body: IUpdateProductReq): Promise<IUpdateProductRes> => {
        try {
            const payload = await axios.put(`${endpoint}/v1/product/${id}`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const updateSubProduct = async(id: string, body: IUpdateSubProductReq): Promise<IUpdateSubProductRes> => {
        try {
            const payload = await axios.put(`${endpoint}/v1/sub-product/${id}`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const deleteProduct = async(body: IDeleteProductReq): Promise<IDeleteProductRes> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/product/${body.id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const deleteSubProduct = async(body: IDeleteSubProductReq): Promise<IDeleteSubProductRes> => {
        try {
            const { id } = body
            const payload = await axios.delete(`${endpoint}/v1/sub-product/${id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getTypeListSelect = async(type: string): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/type/${type}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    return {
        getProductList,
        getSubProductList,
        getProductListSelect,
        getSubProductListSelect,
        getProductOne,
        getSubProductOne,
        createSubProduct,
        createProduct,
        updateProduct,
        updateSubProduct,
        deleteProduct,
        deleteSubProduct,
        getTypeListSelect
    }
}
export default ProductService