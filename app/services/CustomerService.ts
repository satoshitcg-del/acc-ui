// service interface
import type {
  IGetListCustomerReq,
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
  IDeleteCustomerRes,
  IDeleteCustomerProductRes,
  IGetCustomerOneReq,
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
} from "@/core/interface/services";
import { GridRowId } from "@mui/x-data-grid";

import axios from "axios";

import ApiService from "./ServiceRequest";
import { Telegram } from "@mui/icons-material";

const CustomerService = () => {
  const { endpoint, option, checkErrorResponse } = ApiService();
  const updateCustomerProductActive = async (
    args: ICustomerProductActiveReq,
  ): Promise<ICustomerProductActiveRes> => {
    const { active, customer_id, customer_product_id } =
      args as ICustomerProductActiveReq;

    const bodyReq = {
      active,
      customer_id,
      customer_product_id,
    };

    try {
      const payload = await axios.patch(
        `${endpoint}/v1/customer-product/active`,
        bodyReq,
        option,
      );

      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const updateCustomerSubProductActive = async (
    args: ICustomerSubProductActiveReq,
  ): Promise<ICustomerSubProductActiveRes> => {
    const {
      active,
      customer_id,
      customer_product_id,
      customer_sub_product_id,
    } = args as ICustomerSubProductActiveReq;

    const bodyReq = {
      active,
      customer_id,
      customer_product_id,
      customer_sub_product_id,
    };

    try {
      const payload = await axios.patch(
        `${endpoint}/v1/customer-sub-product/active`,
        bodyReq,
        option,
      );

      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getCustomerPdf = async (
    customer_id: string | GridRowId,
  ): Promise<any> => {
    try {
      const payload = await axios.get(
        `${endpoint}/v1/pdf/preview/${customer_id}`,
        {
          ...option,
          responseType: "arraybuffer",
        },
      );
      return payload;
    } catch (error: any) {
      const decoder = new TextDecoder("utf-8");
      const decodeError = JSON.parse(decoder.decode(error.response.data));

      checkErrorResponse(decodeError.code);
      throw decodeError;
    }
  };

  const getCustomerNameList = async (): Promise<ICustomerListRes> => {
    try {
      const payload = await axios.get(`${endpoint}/v1/customer/list`, option);
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getProductNameList = async (): Promise<IProductList[]> => {
    try {
      const payload = await axios.get(`${endpoint}/v1/product/list`, option);

      return payload.data.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const deleteCustomer = async (
    args: IDeleteCustomerReq,
  ): Promise<IDeleteCustomerRes> => {
    const { id } = args as IDeleteCustomerReq;
    try {
      const payload = await axios.delete(
        `${endpoint}/v1/customer/${id}`,
        option,
      );

      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const deleteCustomerProduct = async (
    req: IDeleteCustomerProductReq,
  ): Promise<IDeleteCustomerProductRes> => {
    try {
      const { customer_id, customer_product_id } = req;
      const payload = await axios.delete(
        `${endpoint}/v1/customer-product/${customer_id}/${customer_product_id}`,
        option,
      );

      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getListCustomer = async (
    args: IGetListCustomerReq,
  ): Promise<IGetCustomerRes> => {
    try {
      const {
        username,
        page,
        limit,
        prefix,
        telegram,
        email,
        phone_number,
        full_name,
        start_date,
        end_date,
        client_name,
      } = args;
      const queryParams: string[] = [];
      if (username.length !== 0)
        queryParams.push(`username=${encodeURIComponent(username)}`);
      queryParams.push(`full_name=${encodeURIComponent(full_name)}`);
      queryParams.push(`prefix=${encodeURIComponent(prefix)}`);
      queryParams.push(`telegram=${encodeURIComponent(telegram)}`);
      queryParams.push(`email=${email}`); // Directly append email
      queryParams.push(`phone_number=${encodeURIComponent(phone_number)}`);
      queryParams.push(`start_date=${start_date}`);
      queryParams.push(`end_date=${end_date}`);
      queryParams.push(`client_name=${client_name}`);
      queryParams.push(`page=${page}`);
      queryParams.push(`limit=${limit}`);

      const queryString = queryParams.join("&");
      const url = `${endpoint}/v1/customer/search?${queryString}`;
      // Make GET request without passing body as the second argument
      const payload = await axios.get(url, { ...option });

      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getOne = async (
    body: IGetCustomerOneReq,
  ): Promise<ICustomerListOneRes> => {
    try {
      const { id } = body;
      const payload = await axios.get(`${endpoint}/v1/customer/${id}`, option);
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getProfile = async (): Promise<ICustomerListOneRes> => {
    try {
      const payload = await axios.get(`${endpoint}/v1/user/profile`, option);
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const create = async (body: IAddCustomerReq): Promise<IAddCustomerRes> => {
    try {
      const payload = await axios.post(
        `${endpoint}/v1/customer/create`,
        body,
        option,
      );

      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const update = async (
    body: IUpdateCustomerReq,
  ): Promise<IUpdateCustomerRes> => {
    try {
      const payload = await axios.patch(
        `${endpoint}/v1/customer/update`,
        body,
        option,
      );

      if (payload.data.code !== 1001) {
        throw payload.data;
      }
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getAllDetailProductToCustomer = async (
    args?: ICustomerGetListReq,
  ): Promise<ICustomerGetListRes> => {
    try {
      const { customer_id, product_name, prefix_name, client_name, active, limit, page } =
        args as ICustomerGetListReq;

      const body = {
        params: {
          customer_id,
          product_name,
          prefix_name,
          client_name,
          active,
          limit,
          page,
        },
        ...option,
      };
      const payload = await axios.get(
        `${endpoint}/v1/customer-product/all`,
        body,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const createProductList = async (
    body?: IAddCustomerProductReq,
  ): Promise<IAddCustomerProductRes> => {
    try {
      const payload = await axios.post(
        `${endpoint}/v1/customer-product/add`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getOneCustomerProduct = async (
    customer_id: string,
    customer_product_id: string,
    product_id: string,
  ): Promise<IGetCustomerProduct> => {
    try {
      const body = {
        params: {
          customer_id: customer_id,
          customer_product_id: customer_product_id,
          product_id: product_id,
        },
        ...option,
      };
      const payload = await axios.get(
        `${endpoint}/v1/customer-product/one`,
        body,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const updateCustomerProduct = async (
    body?: IUpdateCustomerProductReq,
  ): Promise<IUpdateCustomerProductRes> => {
    try {
      const payload = await axios.patch(
        `${endpoint}/v1/customer-product/update`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const deleteProduct = async (
    cid: string,
    id: string,
    note: string,
  ): Promise<any> => {
    // In delete modal, Not used anymore
    const body = {
      customer_id: cid,
      id: id,
      note: note,
    };
    try {
      const payload = await axios.patch(
        `${endpoint}/v1/customer-product/delete`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getOneDetailProductToCustomer = async (
    args: ICustomerSubProductReq,
  ): Promise<ICustomerSubProductRes> => {
    try {
      const {
        customer_id,
        customer_product_id,
        product_name,
        prefix_name,
        active,
        limit,
        page,
      } = args as ICustomerSubProductReq;
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
        ...option,
      };

      const payload = await axios.get(
        `${endpoint}/v1/customer-sub-product/all`,
        body,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getOneSubProductCustomer = async (
    args: ICustomerOneSubProduct,
  ): Promise<ICustomerOneSubProductRes> => {
    try {
      const { customer_id, customer_product_id, customer_sub_product_id } =
        args as ICustomerOneSubProduct;
      const body = {
        params: {
          customer_id,
          customer_product_id,
          customer_sub_product_id,
        },
        ...option,
      };

      const payload = await axios.get(
        `${endpoint}/v1/customer-sub-product/one`,
        body,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const addSubProductToCustomer = async (
    body: IAddCustomerSubProductReq,
  ): Promise<IAddCustomerSubProductRes> => {
    try {
      const payload = await axios.post(
        `${endpoint}/v1/customer-sub-product/add`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const updateSubProductToCustomer = async (
    body: IUpdateCustomerSubProductReq,
  ): Promise<IUpdateCustomerSubProductRes> => {
    try {
      const payload = await axios.patch(
        `${endpoint}/v1/customer-sub-product/update`,
        body,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const deleteSubProductToCustomer = async (
    body: IDeleteCustomerSubProductReq,
  ): Promise<IDeleteCustomerSubProductRes> => {
    try {
      const { customer_sub_product_id } = body;
      const payload = await axios.delete(
        `${endpoint}/v1/customer-sub-product/${customer_sub_product_id}`,
        option,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getPDFGroup = async (id: readonly number[], customer_id: string) => {
    const result = id.join(",");
    try {
      const payload = await axios.get(
        `${endpoint}/v1/pdf/exports/${customer_id}?invoiceType=GROUP&productIds=${result}`,
        { ...option, responseType: "blob" },
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getPDFSeparate = async (id: readonly number[], customer_id: string) => {
    const result = id.join(",");
    try {
      const payload = await axios.get(
        `${endpoint}/v1/pdf/exports/${customer_id}?invoiceType=SEPERATE&productIds=${result}`,
        { ...option, responseType: "blob" },
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getCryptoCurrency = async () => {
    try {
      const payload = await axios.get(`${endpoint}/v1/currency/crypto`, option);
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getFiatCurrency = async () => {
    try {
      const payload = await axios.get(`${endpoint}/v1/currency/fiat`, option);
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const checkTelegramAdd = async (telegram: string) => {
    try {
      const body = {
        params: {
          telegram: telegram,
        },
        ...option,
      };
      const payload = await axios.get(
        `${endpoint}/v1/customer/telegram/create`,
        body,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const checkTelegramEdit = async (telegram: string, customer_id: string) => {
    try {
      const body = {
        params: {
          telegram: telegram,
          customer_id: customer_id,
        },
        ...option,
      };
      const payload = await axios.get(
        `${endpoint}/v1/customer/telegram/update`,
        body,
      );
      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getClientNameList = async (): Promise<any> => {
    try {
      const payload = await axios.get(`${endpoint}/v1/customer-product/prefix/info_spb`, option);
      console.log("payload payload ", payload);

      return payload.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

  const getPrefixAutoPlayList = async (productId: string): Promise<any> => {
    try {
      const payload = await axios.get(`${endpoint}/v1/auto/prefix?product_id=${productId}`, option);
      console.log("payload payload ", payload);

      return payload?.data?.data;
    } catch (error) {
      checkErrorResponse(error);
      throw error;
    }
  };

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
    getOneCustomerProduct,
    updateCustomerProduct,
    deleteProduct,
    getOneDetailProductToCustomer,
    getOneSubProductCustomer,
    addSubProductToCustomer,
    updateSubProductToCustomer,
    deleteSubProductToCustomer,
    getPDFGroup,
    getPDFSeparate,
    getCryptoCurrency,
    getFiatCurrency,
    checkTelegramAdd,
    checkTelegramEdit,
    getProfile,
    getClientNameList,
    getPrefixAutoPlayList,
  };
};
export default CustomerService;
