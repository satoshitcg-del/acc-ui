//interface user service
import axios from "axios";
import ApiService from "./ServiceRequest"

const EmployeeService = () => {
    const { endpoint, option } = ApiService();
    const createEmployee = async (body: any) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/admin/`, body, option);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const updateEmployee = async (body: any, id: string) => {
        try {
            const bodyReq = {
                id: id,
                ...body
            }
            const payload = await axios.patch(`${endpoint}/v1/admin/`, bodyReq, option);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const deleteEmployee = async (id: string) => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/admin/${id}`, option);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const getOneEmployee = async (id: string) => {
        try {
            const payload = await axios.get(`${endpoint}/v1/admin/${id}`, option);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const getEmployees = async (params: any) => {
        try {
            const { username, full_name, telegram, email, page, limit } = params;
            const queryParams: string[] = [];
            queryParams.push(`username=${encodeURIComponent(username)}`);
            queryParams.push(`full_name=${encodeURIComponent(full_name)}`);
            queryParams.push(`telegram=${encodeURIComponent(telegram)}`);
            queryParams.push(`email=${encodeURIComponent(email)}`);
            queryParams.push(`page=${page}`);
            queryParams.push(`limit=${limit}`);
            const queryString = queryParams.join("&");
            const payload = await axios.get(`${endpoint}/v1/admin/search?${queryString}`, { ...option });
            return payload.data
        } catch (error) {
            throw error
        }
    }

    const resetPasswordEmployee = async (psw: any, id: string) => {
        try {
            const bodyReq = {
                id: id,
                password: psw
            }
            const payload = await axios.patch(`${endpoint}/v1/admin/reset-psw`, bodyReq, option);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    return {
        createEmployee,
        updateEmployee,
        deleteEmployee,
        getOneEmployee,
        getEmployees,
        resetPasswordEmployee,
    }
}
export default EmployeeService