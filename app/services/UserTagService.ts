//interface prefix service
import {
    ICreateUserTagRes,
    IUserTagListRes,
} from "@/core/interface/services";
import axios from "axios";
import ApiService from "./ServiceRequest"

const UserTagService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();
    const getUserTagList = async(type: string): Promise<IUserTagListRes> => {
        try {
            const body = {
                params: {type},
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/user-tag`, body)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createUserTag = async(name: string, type?: string): Promise<ICreateUserTagRes> => {
        try {
            const body = {
                name: name,
                type: type
            }
            const payload = await axios.post(`${endpoint}/v1/user-tag`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }
    
    const getSaleOwnerList = async(): Promise<IUserTagListRes> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/sale/list`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    return {
        getUserTagList,
        createUserTag,
        getSaleOwnerList
    }
}
export default UserTagService
