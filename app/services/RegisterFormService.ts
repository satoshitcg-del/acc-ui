//interface prefix service
import {
    IPrefixesListRes,
} from "@/core/interface/services";
import axios from "axios";
import ApiService from "./ServiceRequest"

const RegisterFormService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();
    
    const createRegisterForm = async(cid: string, cpid?: string): Promise<any> => {
        try {
            const body = {
                customer_id: cid,
                customer_product_id: cpid
            }
            const payload = await axios.post(`${endpoint}/v1/prefix-form/create`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const reCreateRegisterForm = async(cid: string, cpid: string, fid: string): Promise<any> => {
        try {
            const body = {
                customer_id: cid,
                customer_product_id: cpid,
                form_id: fid
            }
            const payload = await axios.post(`${endpoint}/v1/prefix-form/re-create`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    const syncRegisterForm = async(cid: string, cpid: string, fid: string): Promise<any> => {
        try {
            const body = {
                customer_id: cid,
                customer_product_id: cpid,
                form_id: fid
            }
            const payload = await axios.post(`${endpoint}/v1/prefix-form/sync`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    return {
        // getPrefixList,
        createRegisterForm,
        reCreateRegisterForm,
        syncRegisterForm
    }
}
export default RegisterFormService
