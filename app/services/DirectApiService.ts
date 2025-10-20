//interface user service
import axios from "axios";
import ApiService from "./ServiceRequest"

const DirectApiService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();

    const getDirectApiCustomerList = async (): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/customer-product/direct-api`, option);
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    const getDirectApiProductByCustomerId = async (id: string): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/billing-note/initial-data/direct-api/${id}`, option);
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    const getDirectApiList = async (params: any) => {
        try {
            const body = {
                params: {
                    ...params,
                },
                ...option,
            };
            const payload = await axios.get(`${endpoint}/v1/direct-api`, body);
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    }

    const createDirectApi = async (body: any) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/direct-api`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error);
            throw error
        }
    }

    const updateDirectApi = async (body: any, id: string) => {
        try {
            const bodyReq = {
                direct_id: id,
                ...body
            }
            const payload = await axios.patch(`${endpoint}/v1/direct-api`, bodyReq, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error);
            throw error
        }
    }

    const getDirectApiViewById = async (id: string): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/direct-api/preview/${id}`, option);
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    const getOneDirectApi = async (id: string) => {
        try {
            const payload = await axios.get(`${endpoint}/v1/direct-api/${id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error);
            throw error
        }
    }

    const updateStatusDirectApi = async (body: any) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/direct-api/update-status`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error);
            throw error
        }
    }

    const deleteDraftDirectApi = async (id: string) => {
        try {
            const payload = await axios.delete(
                `${endpoint}/v1/direct-api/${id}`,
                option,
            );
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    const getDirectApiHistory = async (id: string) => {
        try {
            const payload = await axios.get(
                `${endpoint}/v1/direct-api/log/${id}`,
                option,
            );
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };

    return {
        getDirectApiCustomerList,
        getDirectApiProductByCustomerId,
        getDirectApiList,
        createDirectApi,
        updateDirectApi,
        getDirectApiViewById,
        getOneDirectApi,
        updateStatusDirectApi,
        deleteDraftDirectApi,
        getDirectApiHistory,
    }
}
export default DirectApiService