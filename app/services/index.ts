//interface customer service
import type {
    IGetListCustomerReq,
    IGetListCustomerRes,
    ICustomerProductActiveReq,
    ICustomerProductActiveRes,
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
    IPrefixesListRes,
    IProductManagementListReq,
    IProductManagementListRes,
    IUpdateRateReq,
    IUpdateRateRes,
    IConfirmWLReq,
    IBillingCustomerInfo,
    ISignInReq,
    IVerifyUserReq,
} from "@/core/interface/services";

//interface product service
import { ICreateProductReq, ICreateProductRes, ICreateSubProductReq, IDeleteProductReq, IDeleteProductRes, IDeleteSubProductReq, IDeleteSubProductRes, IProductAllReq, IProductAllRes, IProductListAllRes, IProductOneReq, IProductOneRes, ISubProductListAllRes, ISubProductAllReq, ISubProductAllRes, ISubProductListAllReq, ISubProductOneReq, ISubProductOneRes, IUpdateProductReq, IUpdateProductRes, IUpdateSubProductReq, IUpdateSubProductRes } from "@/core/interface/services";

//interface discount service
import { ICreateDiscountReq, ICreateDiscountRes, IDiscountAllReq, IDiscountAllRes, IDiscountListAllRes, IDiscountOneReq, IDiscountOneRes, IUpdateDiscountReq, IUpdateDiscountRes } from "@/core/interface/services";

import { config } from "@/core/config.js";
import Cookies from "js-cookie";
import { checkErrorResponse } from "@/core/utils";
import { GridRowId } from "@mui/x-data-grid";
import axios from "axios";
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

const ServiceRequest = () => {
    const endpoint = config.app.api || 'localhost';
    const tempOption = {
        // headers: { 'Authorization': `Bearer ${window.document.cookie.split('Token=')[1]}` }
        headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.TempToken)}` }
    };
    const option = {
        headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
    };

    //customer service
    const updateCustomerProductActive = async(args: ICustomerProductActiveReq): Promise<ICustomerProductActiveRes> =>{

        const { active, customer_id, customer_product_id } = args as ICustomerProductActiveReq

        const bodyReq = {
            active,
            customer_id,
            customer_product_id
        }

        try {
            const payload = await axios.patch(`${endpoint}/v1/customer-product/active`, bodyReq, option);

            return payload.data

        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateCustomerSubProductActive = async(args: ICustomerSubProductActiveReq): Promise<ICustomerSubProductActiveRes> => {

        const { active, customer_id, customer_product_id, customer_sub_product_id } = args as ICustomerSubProductActiveReq

        const bodyReq = {
            active,
            customer_id,
            customer_product_id,
            customer_sub_product_id
        }

        try {
            const payload = await axios.patch(`${endpoint}/v1/customer-sub-product/active`, bodyReq, option);

            return payload.data

        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getCustomerPdf = async(customer_id: string | GridRowId): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/pdf/preview/${customer_id}`, {
                ...option,
                // responseType: 'blob'
            });
            return payload
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getCustomerNameList = async(): Promise<ICustomerListRes> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/customer/list`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getProductNameList = async(): Promise<IProductList[]> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/product/list`, null, option);

            return payload.data.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteCustomer = async(args: IDeleteCustomerReq): Promise<IDeleteCustomerRes> => {
        const { id } = args as IDeleteCustomerReq
        try {
            const payload = await axios.patch(`${endpoint}/v1/customer/delete/${id}`, {}, option);

            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteCustomerProduct = async(req: IDeleteCustomerProductReq): Promise<IDeleteCustomerProductRes> => {
        try {
            const payload = await axios.patch(`${endpoint}/v1/customer-product/delete`, req, option);

            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getListCustomer = async(args: IGetListCustomerReq): Promise<IGetCustomerRes> => {
        try {
            const { username, page, limit } = args
            const body = {
                params: {
                    username: username.length != 0 ? username : null,
                    page,
                    limit,
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/customer/search`, body);

            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getOne = async(body: IGetCustomerOneReq): Promise<ICustomerListOneRes> => {
        try {
            const { id } = body
            const payload = await axios.get(`${endpoint}/v1/customer/${id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const create = async(body: IAddCustomerReq): Promise<IAddCustomerRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/customer/create`, body, option);

            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const update = async(body: IUpdateCustomerReq): Promise<IUpdateCustomerRes> => {
        try {
            const payload = await axios.patch(`${endpoint}/v1/customer/update`, body, option);

            if (payload.data.code !== 1001) {
                throw payload.data
            }
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getAllDetailProductToCustomer = async(args?: ICustomerGetListReq): Promise<ICustomerGetListRes> => {

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
                ...option
            }

            const payload = await axios.get(`${endpoint}/v1/customer-product/all`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createProductList = async(body?: IAddCustomerProductReq): Promise<IAddCustomerProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/customer-product/add`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getCustomerProductOne = async(customer_id: string, customer_product_id: string, product_id: string): Promise<IGetCustomerProduct> => {
        try {
            const body = {
                params: {
                    "customer_id": customer_id,
                    "customer_product_id": customer_product_id,
                    "product_id": product_id,
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/customer-product/one`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateCustomerProduct = async(body?: IUpdateCustomerProductReq): Promise<IUpdateCustomerProductRes> => {
        try {
            const payload = await axios.patch(`${endpoint}/v1/customer-product/update`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteProductGlobal = async(cid: string, id: string, note: string): Promise<any> => {// In delete modal, Not used anymore
        const body = {
            "customer_id": cid,
            "id": id,
            "note": note
        }
        try {
            const payload = await axios.patch(`${endpoint}/v1/customer-product/delete`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getOneDetailProductToCustomer = async(args: ICustomerSubProductReq): Promise<ICustomerSubProductRes> => {

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
                ...option
            }

            const payload = await axios.get(`${endpoint}/v1/customer-sub-product/all`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const getOneSubProductCustomer = async(args: ICustomerOneSubProduct): Promise<ICustomerOneSubProductRes> => {
        try {
            const { customer_id, customer_product_id, customer_sub_product_id } = args as ICustomerOneSubProduct
            const body = {
                params: {
                    customer_id,
                    customer_product_id,
                    customer_sub_product_id,
                },
                ...option
            }

            const payload = await axios.get(`${endpoint}/v1/customer-sub-product/one`, body)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const addSubProductToCustomer = async(body: IAddCustomerSubProductReq): Promise<IAddCustomerSubProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/customer-sub-product/add`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateSubProductToCustomer = async(body: IUpdateCustomerSubProductReq): Promise<IUpdateCustomerSubProductRes> => {
        try {
            const payload = await axios.patch(`${endpoint}/v1/customer-sub-product/update`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteSubProductToCustomer = async(body: IDeleteCustomerSubProductReq): Promise<IDeleteCustomerSubProductRes> => {
        try {
            const payload = await axios.patch(`${endpoint}/v1/customer-sub-product/delete`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getPDFGroup = async(id: readonly number[], customer_id: string) => {
        const result = id.join(',');
        try {
            const payload = await axios.get(`${endpoint}/v1/pdf/exports/${customer_id}?invoiceType=GROUP&productIds=${result}`, { ...option, responseType: 'blob' })
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getPDFSeparate = async(id: readonly number[], customer_id: string) => {
        const result = id.join(',');
        try {
            const payload = await axios.get(`${endpoint}/v1/pdf/exports/${customer_id}?invoiceType=SEPERATE&productIds=${result}`, { ...option, responseType: 'blob' })
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    //product service
    const getProductList = async(body: IProductAllReq): Promise<IProductAllRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/product/get`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getSubProductList = async(body: ISubProductAllReq): Promise<ISubProductAllRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/sub-product/get`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getProductListSelect = async(): Promise<IProductListAllRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/product/list`, null, option);
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
            const payload = await axios.post(`${endpoint}/v1/sub-product/list `, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getProductOne = async(body: IProductOneReq): Promise<IProductOneRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/product/get-one`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getSubProductOne = async(body: ISubProductOneReq): Promise<ISubProductOneRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/sub-product/get-one`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createSubProduct = async(body: ICreateSubProductReq): Promise<ICreateProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/sub-product/create`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createProduct = async(body: ICreateProductReq): Promise<ICreateProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/product/create`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateProduct = async(body: IUpdateProductReq): Promise<IUpdateProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/product/update`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateSubProduct = async(body: IUpdateSubProductReq): Promise<IUpdateSubProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/sub-product/update`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteProduct = async(body: IDeleteProductReq): Promise<IDeleteProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/product/update/active`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteSubProduct = async(body: IDeleteSubProductReq): Promise<IDeleteSubProductRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/sub-product/update/active`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    //discount service
    const getDiscountList = async(body: IDiscountAllReq): Promise<IDiscountAllRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/discount/get`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createDiscount = async(body: ICreateDiscountReq): Promise<ICreateDiscountRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/discount/create`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getDiscountOne = async(body: IDiscountOneReq): Promise<IDiscountOneRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/discount/get-one`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateDiscountList = async(body: IUpdateDiscountReq): Promise<IUpdateDiscountRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/discount/update`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getDiscountSelectList = async(): Promise<IDiscountListAllRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/discount/list`, null, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    //prefix service
    // Todo: Change interface field with IPREFIXLISTRES quick fix na kub
    const getPrefixList = async(): Promise<IPrefixesListRes> => {
        try {
            const body = {
                params: {
                    prefix_name: '',
                    prefix_type: ''
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/product-link/list`, body)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    //Todo: Frontend should be add interface with every service
    const createPrefix = async(name: string, type?: string): Promise<any> => {
        try {
            const body = {
                prefix_name: name,
                prefix_type: 1
            }
            const payload = await axios.post(`${endpoint}/v1/prefix/create`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    //product management
    const getProductManagementList = async({ productName, month, year, start, end }: IProductManagementListReq): Promise<IProductManagementListRes> => {
        try {
            const queryParams = { productName, month, year, start, end };
            const config = {
                ...option,
                params: queryParams,
            };
            const response = await axios.get(`${endpoint}/v1/pm/list`, config);
            return response.data;
        } catch (error) {
            // console.error("Error fetching product list:", error);
            checkErrorResponse(error)
            throw error;
        }
    }

    const updateRate = async(id: string, body: IUpdateRateReq): Promise<IUpdateRateRes> => {
        try {
            const response = await axios.put(`${endpoint}/v1/pm/rate/${id}`, body, option);
            return response.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const confirmWinLose = async(body: IConfirmWLReq): Promise<IUpdateRateRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/pm/confirm-wl`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const generatePdf = async(body: IConfirmWLReq): Promise<IUpdateRateRes> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/pm/gen-pdf`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const sendTwoFactor = async(body: string) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/verify/totp`, { "totp_key": body }, option);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    // billing service
    const preview = async(invoice_id: string | GridRowId): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/billing-note/preview/${invoice_id}`, {
                ...option,
                responseType: 'arraybuffer',
            });
            return payload
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const search = async(req: any) => {
        try {
            const body = {
                params: {
                    ...req,
                    "page": '1',
                    "limit": '1000',
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/billing-note/all`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getBillingNote = async(req: any) => {
        try {
            const body = {
                params: {
                    ...req,
                    "page": '1',
                    "limit": '1000',
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/billing-note/all`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getDashboard = async() => {
        try {
            const payload = await axios.get(`${endpoint}/v1/billing-note/dashboard`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getCustomerInfo = async(invoice_id: string, customer_id: string): Promise<IBillingCustomerInfo> => {
        try {
            const body = {
                params: {
                    invoice_id,
                    customer_id
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/billing-note/customer-info`, body);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getHistory = async(id: GridRowId) => {
        try {
            const payload = await axios.get(`${endpoint}/v1/billing-note/history?id=${id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getNote = async(id: GridRowId) => {
        try {
            const payload = await axios.get(`${endpoint}/v1/billing-note/note?id=${id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateNote = async(body: IUpdateNote) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/billing-note/note`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
        }
    }

    const updateStatus = async(body: IUpdateStatus) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/billing-note/update`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
        }
    }

    // user service
    const signIn = async(body: ISignInReq) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/sign-in`, body);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const verifyUser = async(body: IVerifyUserReq) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/verify`, body);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const setPassword = async(password: string) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/set-psw`, { password }, tempOption);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const checkTwoFactor = async() => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/check/totp`, {}, tempOption);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const sendTwoFactorUser = async(body: string, token: boolean) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/verify/totp`, { "totp_key": body }, tempOption);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    return {
        updateCustomerProductActive,
        updateCustomerSubProductActive,
        getCustomerPdf,
        getCustomerNameList,
        getProductNameList,
        deleteCustomer,
        deleteCustomerProduct,
        getListCustomer,
        getOne,
        create,
        update,
        getAllDetailProductToCustomer,
        createProductList,
        getCustomerProductOne,
        updateCustomerProduct,
        deleteProductGlobal,
        getOneDetailProductToCustomer,
        getOneSubProductCustomer,
        addSubProductToCustomer,
        updateSubProductToCustomer,
        deleteSubProductToCustomer,
        getPDFGroup,
        getPDFSeparate,
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
        getDiscountList,
        createDiscount,
        getDiscountOne,
        updateDiscountList,
        getDiscountSelectList,
        getPrefixList,
        createPrefix,
        getProductManagementList,
        updateRate,
        confirmWinLose,
        generatePdf,
        sendTwoFactor,
        preview,
        search,
        getBillingNote,
        getDashboard,
        getCustomerInfo,
        getHistory,
        getNote,
        updateNote,
        updateStatus,
        signIn,
        verifyUser,
        setPassword,
        checkTwoFactor,
        sendTwoFactorUser
    }
}
export default ServiceRequest;