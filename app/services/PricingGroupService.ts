import axios from "axios";
import ApiService from "./ServiceRequest"
import { IAddPricingGroupReq, IPricingGroupRes, IGetOnePricingGroupRes, IGetPricingGroupReq, IUpdateCustomerProductReq, IUpdatePricingGroupReq, IResponseBase, IDeletePriceingGroupReq, IGetPricingListReq } from "@/core/interface/services";


const PricingGroupService = () => {
  const { endpoint, option, checkErrorResponse } = ApiService();

  const getPricingGroupList = async (req: IGetPricingGroupReq) => {
    try {
      const body = {
        params: {
          pricing_name: req.pricing_name,
          product_id: req.product_id,
          currency_id: req.currency_id,
          page: req.page,
          limit: req.limit
        },
        ...option
      }
      const payload = await axios.get(`${endpoint}/v1/pricing-group/search`, body)
      return payload.data
    } catch (error) {
      checkErrorResponse(error)
      throw error
    }
  }

  const getPricingGroupSelect = async (req: IGetPricingListReq) => {
    try {
      const body = {
        params: {
          product_id: req.product_id,
          currency_id: req.currency_id,
        },
        ...option
      }
      const payload = await axios.get(`${endpoint}/v1/pricing-group/list`, body)
      return payload.data
    } catch (error) {
      checkErrorResponse(error)
      throw error
    }
  }

  const createPricingGroup = async (body: IAddPricingGroupReq) => {
    try {
      const payload = await axios.post(`${endpoint}/v1/pricing-group`, body, option)
      return payload
    } catch (error) {
      checkErrorResponse(error)
      throw error
    }
  }

  const updatePricingGroup = async (id: string, req: IUpdatePricingGroupReq) => {
    try {
      const payload = await axios.put(`${endpoint}/v1/pricing-group/${id}`, req, option)
      return payload.data
    } catch (error) {
      checkErrorResponse(error)
      throw error
    }
  }

  const getOnePricingGroup = async (id: string) => {
    try {
      const payload = await axios.get(`${endpoint}/v1/pricing-group/${id}`, option)
      return payload.data
    } catch (error) {
      checkErrorResponse(error)
      throw error
    }
  }

  const deletePricingGroupById = async (req: IDeletePriceingGroupReq): Promise<any> => {
    try {
      const { id } = req
      const payload = await axios.delete(`${endpoint}/v1/pricing-group/${id}`, option)
      return payload
    } catch (error) {
      checkErrorResponse(error)
      throw error
    }
  }
  
  return {
    getPricingGroupList,
    createPricingGroup,
    updatePricingGroup,
    getOnePricingGroup,
    getPricingGroupSelect,
    deletePricingGroupById
  }
}
export default PricingGroupService