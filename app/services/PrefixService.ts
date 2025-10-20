//interface prefix service
import {
    IPrefixesListRes,
} from "@/core/interface/services";
import axios from "axios";
import ApiService from "./ServiceRequest"

const PrefixService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();
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

    const getInfoByPrefix = async(prefix: string): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/customer-product/prefix/info/${prefix}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    return {
        getPrefixList,
        createPrefix,
        getInfoByPrefix
    }
}
export default PrefixService
