//interface user service
import axios from "axios";
import ApiService from "./ServiceRequest"

const ActivityLogService = () => {
    const { endpoint, option } = ApiService();
    const getActivityLogs = async (params: any) => {
        try {
            const { username, start_date, end_date, page, limit } = params;
            const queryParams: string[] = [];
            queryParams.push(`username=${encodeURIComponent(username)}`);
            queryParams.push(`start_date=${encodeURIComponent(start_date)}`);
            queryParams.push(`end_date=${encodeURIComponent(end_date)}`);
            queryParams.push(`page=${page}`);
            queryParams.push(`limit=${limit}`);
            const queryString = queryParams.join("&");
            const payload = await axios.get(`${endpoint}/v1/activity/search?${queryString}`, { ...option });
            return payload.data
        } catch (error) {
            throw error
        }
    }

    return {
        getActivityLogs,
    }
}
export default ActivityLogService