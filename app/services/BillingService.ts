//interface billing service
import {
  IBillingCustomerInfo,
  IBillingListRes,
  IBillingSearchReq,
  IBillingSearchRes,
} from "@/core/interface/services";
import { GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import ApiService from "./ServiceRequest";

interface IUpdateStatus {
  amount: number;
  cause: string;
  invoice_id: string;
  note: string;
  status: string;
}

interface IMultipleUpdateStatus {
  current_status: string;
  next_status: string;
  note: string;
  invoice_ids: string[];
}

interface IUpdateNote {
  invoice_id: string;
  note: string;
}

const BillingService = () => {
  const { endpoint, option, checkErrorResponse } = ApiService();
  const preview = async (invoice_id: string | GridRowId): Promise<any> => {
    try {
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/preview/${invoice_id}`,
        {
          ...option,
          responseType: "arraybuffer",
        },
      );
      console.log(payload.data);

      return payload;
    } catch (error: any) {
      const decoder = new TextDecoder("utf-8");
      const decodeError = JSON.parse(decoder.decode(error.response.data));
      console.log("error", decodeError);
      checkErrorResponse(decodeError.code);
      throw decodeError;
    }
  };

  const exportPDF = async (invoice_id: string | GridRowId): Promise<any> => {
    try {
      const body: any = {
        ...option,
        responseType: "blob",
      };
      const response = await axios.get(
        `${endpoint}/v1/billing-note/export/${invoice_id}`,
        body,
      );
      const filename =
        response.headers["content-disposition"]?.split("filename=")[1] ||
        "untitled";
      console.log("ggg", response.headers);
      const href = URL.createObjectURL(response.data);

      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      // link.setAttribute('download', 'file.pdf'); //or any other extension
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      return response.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
    // window.open(`${endpoint}/v1/invoice/exports?invoice_id=${invoice_id}`)
  };

  const search = async (req: IBillingSearchReq): Promise<IBillingSearchRes> => {
    // console.log("callll")
    try {
      const body = {
        params: {
          ...req,
        },
        ...option,
      };
      const payload = await axios.get(`${endpoint}/v1/billing-note/all`, body);
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getBillingNote = async (req: IBillingSearchReq) => {
    try {
      const body = {
        params: {
          ...req,
        },
        ...option,
      };
      const payload = await axios.get(`${endpoint}/v1/billing-note/all`, body);
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getDashboard = async (): Promise<IBillingListRes> => {
    try {
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/dashboard`,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getCustomerInfo = async (
    invoice_id: string,
    customer_id: string,
  ): Promise<IBillingCustomerInfo> => {
    try {
      const body = {
        params: {
          invoice_id,
          customer_id,
        },
        ...option,
      };
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/customer-info`,
        body,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getHistory = async (id: GridRowId) => {
    try {
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/history?id=${id}`,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getNote = async (id: GridRowId) => {
    try {
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/note?id=${id}`,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const updateNote = async (body: IUpdateNote) => {
    try {
      const payload = await axios.post(
        `${endpoint}/v1/billing-note/note`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const updateStatus = async (id: string, body: IUpdateStatus) => {
    try {
      const payload = await axios.put(
        `${endpoint}/v1/billing-note/${id}`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getCurrencyForUpdateStatus = async (
    invoice_id: string,
    customer_id: string,
  ) => {
    try {
      const body = {
        params: {
          invoice_id: invoice_id,
          customer_id: customer_id,
        },
        ...option,
      };
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/currency`,
        body,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getNextStatus = async (): Promise<IBillingListRes> => {
    try {
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/status`,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const updateMultipleStatus = async (body: IMultipleUpdateStatus) => {
    try {
      const payload = await axios.post(
        `${endpoint}/v1/billing-note/update-multi`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const deleteDraftInvoice = async (id: string) => {
    try {
      const payload = await axios.delete(
        `${endpoint}/v1/billing-note/${id}`,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const createDraftInvoice = async (body: any) => {
    try {
      const payload = await axios.post(
        `${endpoint}/v1/billing-note`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const viewSlipHistory = async (invoice_id: string): Promise<any> => {
    try {
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/customer/invoice/${invoice_id}`, option,
      );
      return payload.data;
    } catch (error: any) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getSlipImage = async (img_url: string): Promise<any> => {
    try {
      const body: any = {
        ...option,
        responseType: 'blob',
      }

      const response = await axios.get(`${endpoint}${img_url}`, body);
      return response
    } catch (error) {
      checkErrorResponse(error)
      throw error
    }
  }

  const createInvoice = async (body: any) => {
    try {
      const payload = await axios.post(
        `${endpoint}/v1/billing-note`,
        body,
        option
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const uploadSlipByAdmin = async (body: any) => {
    try {
      const payload = await axios.post(
        `${endpoint}/v1/billing-note/upload/slip`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const verifypaymenAmounttByAdmin = async (body: any) => {
    try {
      const payload = await axios.post(
        `${endpoint}/v1/billing-note/payment/verify`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getVerifyPayment = async (id: string) => {
    try {
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/invoice/verifypayment/${id}`,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getAccountVerifyPayment = async (id: string) => {
    try {
      const payload = await axios.get(
        `${endpoint}/v1/billing-note/invoice/account/verifypayment/${id}`,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const updateVerifyPayment = async (id: string, status: string, note?: string) => {
    try {
      const body = {
        note: note || '',
      }
      const payload = await axios.patch(
        `${endpoint}/v1/billing-note/invoice/${id}/${status}`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getPaymentImageUpload = async (file_name: string): Promise<any> => {
    try {
      const body: any = {
        ...option,
        responseType: 'blob'
      }

      const response = await axios.get(`${endpoint}/v1/cr-ticket/export/${file_name}`, body);
      const objectUrl = URL.createObjectURL(response.data);
      return objectUrl
    } catch (error) {
      checkErrorResponse(error)
      throw error
    }
  }

  return {
    preview,
    search,
    getBillingNote,
    getDashboard,
    getCustomerInfo,
    getHistory,
    getNote,
    updateNote,
    updateStatus,
    exportPDF,
    getCurrencyForUpdateStatus,
    getNextStatus,
    updateMultipleStatus,
    deleteDraftInvoice,
    createDraftInvoice,
    viewSlipHistory,
    getSlipImage,
    createInvoice,
    uploadSlipByAdmin,
    getVerifyPayment,
    updateVerifyPayment,
    getAccountVerifyPayment,
    verifypaymenAmounttByAdmin,
    getPaymentImageUpload,

  };
};
export default BillingService;
