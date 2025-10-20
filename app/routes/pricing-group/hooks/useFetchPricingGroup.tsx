import { ICurrencyLists, IGetPricingGroupReq, IPricingGroupList, IPricingGroupResComponent } from '@/core/interface/services';
import DiscountService from '@/services/DiscountService';
import PricingGroupService from '@/services/PricingGroupService';
import ProductService from '@/services/ProductService';
import { IconButton, SelectChangeEvent, Typography } from '@mui/material';
import {
  Delete as DeleteIcon,
  BorderColor as EditIcon,
} from "@mui/icons-material";
import { useState, useEffect } from 'react';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import {
  useModalConfirmDelete,
} from "@/layout/components/modal-confirm-delete/index.js";
import { SelectedType } from '@/core/enum';
import { t } from 'i18next';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import { useCustomerSearchStore } from '@/core/storerecoil/useCustomerSearchStore';

interface Product {
  id: string;
  product_name: string;
}

export const useFetchPricingGroup = () => {
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError } = useAlertDialog();
  const { resetSearchCustomer } = useCustomerSearchStore();
  const { getProductListSelect } = ProductService();
  const { getPricingGroupList, getOnePricingGroup } = PricingGroupService();
  const { getAllCurrencyForDiscount } = DiscountService();
  const [pricingGroupName, setPricingGroupName] = useState<string>('')
  const [pricingList, setPricingList] = useState<IPricingGroupResComponent[] | []>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [productList, setProductList] = useState<Product[]>([])
  const [currency, setCurrency] = useState<string>(SelectedType.ALL)
  const [currencyList, setCurrencyList] = useState<ICurrencyLists[]>([]);
  const [defaultEditData, setDefaultEditData] = useState<IPricingGroupList>()
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState<string | number>(50);
  const [page, setPage] = useState(1);
  const [dataAmount, setDataAmount] = useState<number>();
  const [pageAmount, setPageAmount] = useState<number>();
  const [rowAmount, setRowAmount] = useState<number>();
  const [triggerAdd, setTriggerAdd] = useState<boolean>(false);
  const [triggerEdit, setTriggerEdit] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
  });
  const {
    trigerDelete,
    modalDelete,
    handleOpenModalDeletePricingGroup,
    handleCloseModalDelete,
    onSubmitDeletePricingGroup,
  } = useModalConfirmDelete();

  const clearInputFilter = () => {
    setCurrency(SelectedType.ALL)
    setProduct(null)
    setPricingGroupName('')
  }

  const handlePricingGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setPricingGroupName(event.target.value as string);

  const handleCurrencyChange = (event: SelectChangeEvent) => setCurrency(event.target.value as string);

  const handleChangeProduct = (selectedProduct: any) => {
    setProduct(selectedProduct)
  };

  const handleOpenAddModal = () => {
    setOpenModal({ ...openModal, addModal: true });
  }

  const handleOpenEditModal = async (pricingId: string) => {
    try {
      const response = await getOnePricingGroup(pricingId)
      setOpenModal({ ...openModal, editModal: true });
      setDefaultEditData(response.data)
    } catch (error) {
      console.log(error)
    }

  }

  const fetchProductList = async () => {
    try {
      const response = await getProductListSelect();
      const products: Product[] = response.data.map((item: any) => ({
        id: item.id,
        product_name: item.product_name,

      })
      );

      setProductList(products);
    } catch (error) {
      console.log("Error fetching product list:", error);
    }
  }


  const getCurrency = async () => {
    try {
      const response = await getAllCurrencyForDiscount()
      setCurrencyList(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const [isSearch, setIsSearch] = useState(true)
  const handleSearch = () => {
    setPage(1)
    setIsSearch(!isSearch)
  }


  const handleGetPricingGroupList = async () => {
    setLoading(true);
    try {
      const bodyReq: IGetPricingGroupReq = {
        pricing_name: pricingGroupName,
        product_id: product ? product.id.toString() : '',
        currency_id: currency == SelectedType.ALL ? '' : currency,
        page: page,
        limit: rowsPerPage as number
      }
      const res = await getPricingGroupList(bodyReq)
      const pricingData = res.data
        ? res.data.map((row: any, index: number) =>
          createPricingListRows({
            id: row.id,
            pricing_name: row.pricing_name,
            product_name: row.product_name,
            price: row.price,
            currency_name: row.currency_name,
            updated_by: row.updated_by,
          }, (page - 1) * Number(rowsPerPage) + index + 1),
        )
        : [];
      setPageAmount(res.pagination?.total_pages);
      setRowAmount(pricingData.length);
      setDataAmount(res.pagination?.total);
      setPricingList(pricingData)
      setLoading(false);
    } catch (error: any) {
      alertError(TranslateErrorCode(error?.response?.data?.code));
      setLoading(true);
    } finally {
      setLoading(false);
    }
  }

  const createPricingListRows = (value: any, index: number): IPricingGroupResComponent => {
    return {
      id: <Typography variant="body2" sx={{ pl: "10px" }}>{index}</Typography>,
      pricingGroupName: <Typography variant="body2">{value.pricing_name || '-'}</Typography>,
      productName: <Typography variant="body2">{value.product_name || '-'}</Typography>,
      price: handlePrice(value.price),
      currency: <Typography variant="body2">{value.currency_name || '-'}</Typography>,
      updatedBy: <Typography variant="body2">{value.updated_by || '-'}</Typography>,
      management: handleManagement(value.id)
    }
  }


  const handlePrice = (price: number) => {
    let thaiCurrency = new Intl.NumberFormat("th", {
      style: "currency",
      currency: "THB",
    })
      .format(price)
      .replace(/฿/g, "");
    return <Typography variant="body2">{thaiCurrency || '-'}</Typography>;
  };

  const handleManagement = (id: string) => {
    return (
      <div className="flex justify-center">
        <IconButton
          data-testid="pricing-group-pricinggrouptable-edit-button"
          className="p-5"
          aria-label="edit"
          sx={{ width: "24px", height: "24px", color: "#EF6C00" }}
          onClick={() => {
            handleOpenEditModal(id);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          data-testid="pricing-group-pricinggrouptable-delete-button"
          className="p-5"
          aria-label="delete"
          sx={{ width: "24px", height: "24px", color: "#D32F2F" }}
          onClick={() => {
            handleOpenModalDeletePricingGroup(id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  };

  useEffect(() => {
    fetchProductList();
    resetSearchCustomer();
  }, [])

  useEffect(() => {
    getCurrency()
    handleGetPricingGroupList()
  }, [triggerAdd, triggerEdit, trigerDelete, page, rowsPerPage, isSearch])


  return {
    pricingList,
    pricingGroupName,
    product,
    productList,
    currency,
    currencyList,
    defaultEditData,
    loading,
    dataAmount,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    pageAmount,
    rowAmount,
    openModal,
    modalDelete,
    setTriggerAdd,
    setTriggerEdit,
    setOpenModal,
    handleOpenAddModal,
    handleChangeProduct,
    handleCurrencyChange,
    handlePricingGroupNameChange,
    handleCloseModalDelete,
    onSubmitDeletePricingGroup,
    handleGetPricingGroupList,
    clearInputFilter,
    handleSearch,
  }
}


