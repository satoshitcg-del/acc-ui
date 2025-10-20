//interface prefix service
import { ICreateCrTicketReq, IResponseBase, IUpdateCrTicketReq } from "@/core/interface/services";
import axios from "axios";
import ApiService from "./ServiceRequest"
import { FILE_EXTENSION_TO_TYPE } from "@/core/utils/fileValidation";

const TaskManagementService = () => {
    const { endpoint, option, checkErrorResponse } = ApiService();

    const getTaskLists = async (req: any): Promise<any> => {
        try {
            const bodyReq = {
                params: {
                    ...req,
                },
                ...option
            }

            const payload = await axios.get(`${endpoint}/v1/cr-ticket/list`, bodyReq)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const getOneTask = async (id: string): Promise<any> => {
        try {
            const payload = await axios.get(`${endpoint}/v1/cr-ticket/${id}`, option)
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const deleteTaskById = async (id: string): Promise<IResponseBase> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/cr-ticket/${id}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const createTask = async (body: ICreateCrTicketReq): Promise<IResponseBase> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/cr-ticket`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const updateTaskById = async (id: string, body: IUpdateCrTicketReq): Promise<IResponseBase> => {
        try {
            const payload = await axios.put(`${endpoint}/v1/cr-ticket/${id}`, body, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    // const createFileUpload = async (body: FormData): Promise<any> => {
    //     try {
    //         const payload = await axios.post(`${endpoint}/v1/system-file/cr-ticket`, body, option);
    //         return payload.data
    //     } catch (error) {
    //         checkErrorResponse(error)
    //         throw error
    //     }
    // }
    const createFileUpload = async (body: FormData, onProgress: (progress: number) => void): Promise<any> => {
        try {
            const payload = await axios.post(`${endpoint}/v1/system-file/cr-ticket`, body, {
                ...option,
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total || 1; // ป้องกันกรณี total เป็น null/undefined
                    const progress = Math.round((progressEvent.loaded / total) * 100);
                    onProgress(progress);
                },
            });
            return payload.data;
        } catch (error) {
            checkErrorResponse(error);
            throw error;
        }
    };
    

    const deleteFileUpload = async (file_name: string): Promise<IResponseBase> => {
        try {
            const payload = await axios.delete(`${endpoint}/v1/system-file/cr-ticket/${file_name}`, option);
            return payload.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const exportFileUpload = async (file_name: string): Promise<any> => {
        try {
            const body: any = {
                ...option,
                responseType: 'blob'
            }

            const response = await axios.get(`${endpoint}/v1/cr-ticket/export/${file_name}`, body);
            const filename = response.headers['content-disposition']?.split('filename=')[1] || 'untitled';
            console.log('Export File Upload :', response.headers)
            const href = URL.createObjectURL(response.data);

            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            // link.setAttribute('download', 'file.pdf'); //or any other extension
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
            return response.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    const previewFileUpload = async (file_name: string, file_ext: string) : Promise<any> => {
        try {
            const body: any = {
                ...option,
                responseType: 'blob',
            }
            
            const response = await axios.get(`${endpoint}/v1/cr-ticket/export/${file_name}`, body);
            const filename = response.headers['content-disposition']?.split('filename=')[1] || 'untitled';
            console.log('Export File Upload :', response)
            const file_type = FILE_EXTENSION_TO_TYPE[file_ext]
            const blob = new Blob([response.data], { type: file_type });
            const href = URL.createObjectURL(blob);
            // Open PDF in new tab
            window.open(href, '_blank');

            // Clean up ObjectURL after a delay to ensure the file loads
            setTimeout(() => {
                URL.revokeObjectURL(href);
            }, 1000);

            return response.data
        } catch (error) {
            checkErrorResponse(error)
            throw error
        }
    }

    return {
        getTaskLists,
        getOneTask,
        createTask,
        updateTaskById,
        deleteTaskById,
        createFileUpload,
        exportFileUpload,
        previewFileUpload,
        deleteFileUpload
    }
}
export default TaskManagementService
