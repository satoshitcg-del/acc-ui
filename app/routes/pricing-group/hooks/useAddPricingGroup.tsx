import { sweetalert } from "@/core/enum";
import { ICurrencyLists } from "@/core/interface/services";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import DiscountService from "@/services/DiscountService";
import PricingGroupService from "@/services/PricingGroupService";
import ProductService from "@/services/ProductService";
import { SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Product {
  id: string;
  product_name: string;
}

export const useAddPricingGroup = (setTriggerAdd: any) => {
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError, alertSuccess } = useAlertDialog();
  const { createPricingGroup } = PricingGroupService();
  const { getProductListSelect } = ProductService();
  const { getAllCurrencyForDiscount } = DiscountService();
  const [product, setProduct] = useState<Product | null>(null)
  const [productList, setProductList] = useState<Product[]>([])
  const [pricingGroupName, setPricingGroupName] = useState<string>('')
  const [currency, setCurrency] = useState<string>('')
  const [currencyList, setCurrencyList] = useState<ICurrencyLists[]>([]);
  const [price, setPrice] = useState<string>('')
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });

  const fetchProductList = async () => {
    try {
      const response = await getProductListSelect();
      const products: Product[] = response.data.map((item: any) => ({
        id: item.id,
        product_name: item.product_name,
      }));
      setProductList(products);
    } catch (error) {
      console.log("Error fetching product list:", error);
    }
  };

  const getCurrency = async () => {
    try {
      const response = await getAllCurrencyForDiscount()
      console.log("res", response.data)
      const defaultCurrency = response.data.filter(item => item.currency_name.includes('THB')).map(item => item._id);
      setCurrency(defaultCurrency[0]);
      setCurrencyList(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePricingGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPricingGroupName(event.target.value as string);
    setValue("pricingGroupName", event.target.value as string)
  }

  const handleCurrencyChange = (event: SelectChangeEvent) => setCurrency(event.target.value as string);
  const handlePriceChange = (values: any) => {
    // ใช้ floatValue เป็นตัวเลข หรือ formattedValue เป็นตัวเลขที่มีคอมม่าคั่น
    const newValue = values.floatValue ?? 0; // ถ้าเป็น undefined ให้ใช้ 0

    setPrice(newValue);
    setValue("price", newValue); // ใช้กับ react-hook-form
  };

  const handleChangeProduct = (selectedProduct: any) => {
    setProduct(selectedProduct)
    setValue("productName", selectedProduct)
  };

  const addNewDataPricingGroup = async (openModal: any, setOpenModal: any) => {
    try {
      const bodyReq = {
        product_id: product ? product.id.toString() : '',
        pricing_name: pricingGroupName,
        price: Number(price),
        fiat_id: currency,
      }

      const response: any = await createPricingGroup(bodyReq)
      setTriggerAdd(dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'))
      alertSuccess(TranslateErrorCode(response?.data.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setOpenModal({ ...openModal, addModal: false });
    }
  }

  useEffect(() => {
    fetchProductList()
    getCurrency()
  }, [])

  return {
    product,
    productList,
    price,
    currency,
    currencyList,
    pricingGroupName,
    errors,
    register,
    handleSubmit,
    handlePriceChange,
    handleCurrencyChange,
    handleChangeProduct,
    addNewDataPricingGroup,
    handlePricingGroupNameChange
  }
}