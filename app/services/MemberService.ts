//interface prefix service
import { IResponseBase } from "@/core/interface/services";
import axios from "axios";
import ApiService from "./ServiceRequest"

const MemberService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();
    const getMemberList = async (req: any): Promise<any> => {
        try {
            const { customer_id, username, full_name, email, page, limit } = req
            const body = {
                params: {
                    customer_id,
                    username,
                    full_name,
                    email,
                    page,
                    limit
                },
                ...option
            }
            const payload = await axios.get(`${endpoint}/v1/sub-customer/search`, body)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createMember = async (req: any): Promise<IResponseBase> => {
        try {
            const { customer_id, full_name, username, email, password } = req
            const body = {
                customer_id,
                username,
                full_name,
                email,
                password
            }
            const payload = await axios.post(`${endpoint}/v1/sub-customer`, body, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getMemberById = async (id: string): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/sub-customer/${id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateMemberById = async (id: string, req: any): Promise<any> => {
        try {
            const { customer_id, full_name, username, email, password} = req
            const body = {
                full_name,
                email,
                password
             }
            const payload = await axios.put(`${endpoint}/v1/sub-customer/${id}`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteMemberById = async(id: string): Promise<IResponseBase> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/sub-customer/${id}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    return {
        getMemberList,
        createMember,
        getMemberById,
        updateMemberById,
        deleteMemberById
    }
}
export default MemberService
