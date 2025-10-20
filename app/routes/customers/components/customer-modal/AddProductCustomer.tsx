import { useState, useEffect } from 'react';
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
// Service
import DiscountService from '@/services/DiscountService.js';
import CustomerService from '@/services/CustomerService.js';

// Layout
import Loading from "@/layout/components/loading/Loading.js";
import ProductCustomerSelectBoxComponent from '../SelectBoxProductCustomer.js';

// i18n
import { useTranslation } from 'react-i18next';
import { useFetchPrefixes, useFetchCustomerProducts } from '@/core/hooks/index.js';
import { useForm } from 'react-hook-form';
import { ValidateMessage } from "@/core/enum.js";
import AutoCompleteCreatePrefixs from '@/layout/components/auto-complete/AutoCompleteCreatePrefixs.js';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode.js';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog.js';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export interface IProducts {
  customerName?: string;
  productName?: string;
  arrDiscount: string[];
  prefixes?: string;
  deposit?: number;
}

interface Product {
  product_id: string;
  sub_product_list?: string[];
  discounts?: string[];
  prefixes?: string;
  deposit?: number;
}

function extractCustomerNames(CNames: any[]) {
  return CNames?.map((name: any) => name.username);
}

interface IAddProductCustomer {
  openModal: any;
  setOpenModal: any;
  setSignInAlert: any;
  customerList: any;
  setUpdateCustomer: any;
  updateCustomer: boolean;
}
export default function AddProductCustomer(props: IAddProductCustomer) {
  const { openModal, setOpenModal, setSignInAlert, customerList, setUpdateCustomer, updateCustomer } = props;
  const { getDiscountSelectList } = DiscountService();
  const { createProductList } = CustomerService();
  const [discounts, setDiscounts] = useState<any[]>([]);
  const { alertError, alertSuccess } = useAlertDialog();
  const [arrCompProducts, setArrCompProducts] = useState<any[]>([]);
  const [arrProductCustomers, setArrProductCustomers] = useState<IProducts[]>([]);

  const [backDrop, setBackDrop] = useState(false);
  const [scroll, setScroll] = useState<'paper'>('paper');
  const { t } = useTranslation()
  const { TranslateErrorCode } = useTranslateErrorCode()
  const { prefixes } = useFetchPrefixes()
  const { products } = useFetchCustomerProducts()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
  });

  useEffect(() => {
    fetchDiscount()
  }, []);

  const fetchDiscount = async () => { // custom hook
    try {
      const res = await getDiscountSelectList();
      const discountLists = res?.data || []
      setDiscounts(discountLists);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const handleChangeCustomerName = (
    index: number,
    event: SelectChangeEvent<string>
  ) => {
    const updatedArrProductCustomers = [...arrProductCustomers];
    updatedArrProductCustomers[index] = {
      ...updatedArrProductCustomers[index],
      customerName: event.target.value as string,
    };
    setArrProductCustomers(updatedArrProductCustomers);
  };

  const handleChangeProductName = (
    index: number,
    event: SelectChangeEvent<string>
  ) => {
    const updatedArrProductCustomers = [...arrProductCustomers];
    updatedArrProductCustomers[index] = {
      ...updatedArrProductCustomers[index],
      productName: event.target.value as string,
    };
    setArrProductCustomers(updatedArrProductCustomers);
  };

  const handleChangePrefixCompany = (
    index: number,
    event: any
  ) => {
    arrProductCustomers[index] = {
      ...arrProductCustomers[index],
      prefixes: event.target.textContent as string
    };
    setArrProductCustomers(arrProductCustomers);
  };

  const handleChangePrefixCompanySecond = (
    index: number,
    value: any
  ) => {
    console.log("value: ", index, value);
    arrProductCustomers[index] = {
      ...arrProductCustomers[index],
      prefixes: value
    };

    setArrProductCustomers(arrProductCustomers);
  };

  const handleChangeDeposit = (
    index: number,
    event: any
  ) => {
    let numericValue = Number(event.target.value);
    arrProductCustomers[index] = {
      ...arrProductCustomers[index],
      deposit: !isNaN(numericValue) ? numericValue : 0
    };
    setArrProductCustomers(arrProductCustomers);
  };

  const handleChangeDiscount = (
    index: number,
    event: SelectChangeEvent<string[]>
  ) => {
    arrProductCustomers[index] = {
      ...arrProductCustomers[index],
      arrDiscount: [...(event.target.value as string)],
    };
    setArrProductCustomers([...arrProductCustomers]);
  };

  const handleCloseAddProductModal = () => {
    setArrProductCustomers([]);
    setArrCompProducts([]);
    reset()
    setOpenModal({ ...openModal, addProductModal: false });
  };

  const removeSelectBox = async (index: number) => {
    const updatedArrProductCustomers = [...arrProductCustomers];
    if (index + 1 >= 0 && index + 1 < updatedArrProductCustomers.length) {
      updatedArrProductCustomers.splice(index + 1, 1);
    }
    const updatedArrCompProducts = [...arrCompProducts];
    if (index >= 0 && index <= updatedArrCompProducts.length) {
      updatedArrCompProducts.splice(index, 1);
    }

    await setArrCompProducts([]);
    setArrProductCustomers(updatedArrProductCustomers);
    setArrCompProducts(updatedArrCompProducts);
  };

  const addSelectBox = () => {
    arrCompProducts.push(createProductCustomerSelectBoxComponent(arrCompProducts.length + 1));
    setArrCompProducts([...arrCompProducts]);
  };

  const filterPrefixId = (prefix: string) => {
    const prefixFilter: any = prefixes.filter((item: any) => item.product_link_name == prefix)[0]
    return prefixFilter?.product_link_id
  }

  const onSubmitAddProduct = async () => {
    try {
      const customerId = customerList.filter((e: any) => {
        return arrProductCustomers[0].customerName === e.username;
      })[0]?.id;

      const body = {
        customer_id: customerId,
        products: [] as Product[],
      };

      arrProductCustomers.forEach((product: any, index: any) => {
        body.products.push({
          product_id: product.productName,
          discounts: product.arrDiscount,
          prefixes: filterPrefixId(product.prefixes),
          deposit: parseFloat(product.deposit),
        });
      });

      setBackDrop(true);
      const res: any = await createProductList(body);
      setBackDrop(false);
      setUpdateCustomer(!updateCustomer)
      handleCloseAddProductModal();
      reset()
      alertSuccess(TranslateErrorCode(res?.code));
    } catch (error: any) {
      alertError(TranslateErrorCode(error?.response?.data?.code));
    } finally {
      setBackDrop(false);
    }
  };

  function createProductCustomerSelectBoxComponent(index: any) {
    return (
      <ProductCustomerSelectBoxComponent
        key={index}
        index={index}
        arrProductCustomers={arrProductCustomers}
        customerList={customerList}
        extractCustomerNames={extractCustomerNames}
        products={products}
        handleChangeProductName={handleChangeProductName}
        handleChangeDiscount={handleChangeDiscount}
        handleChangePrefixCompany={handleChangePrefixCompanySecond}
        prefixes={prefixes}
        t={t}
        handleChangeDeposit={handleChangeDeposit}
        discounts={discounts}
        register={register}
        errors={errors}
      />
    );
  }

  return (
    <>
      <Dialog
        open={openModal.addProductModal}
        onClose={handleCloseAddProductModal}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent
          dividers={scroll === 'paper'}
          sx={{
            width: '600px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backDrop}
          >
            <Loading />
          </Backdrop>

          <form onSubmit={handleSubmit(onSubmitAddProduct)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Typography variant='h5' sx={{ color: "modal.title_color", }}>
                  {t("title.add-product-to-customer")}
                </Typography>
                <Button
                  disabled={!arrProductCustomers[0]?.customerName || arrCompProducts.length >= 14 ? true : false}
                  data-testid="customer-addproductcustomer-add-button"
                  variant="contained"
                  color="primary"
                  children={`+ ${t("button.add-product")}`}
                  onClick={() => addSelectBox()}
                  sx={{ width: '140px', height: '30px', mx: 2 }}
                />

              </Box>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                <FormControl fullWidth sx={{ width: '50%' }}>
                  <InputLabel id="customer-name">{t("placeholder.customer-name")}</InputLabel>
                  <Select
                    labelId="customer-name-select-label"
                    id="customer-name-select"
                    data-testid="customer-addproductcustomer-customername-select"
                    value={arrProductCustomers[0]?.customerName || ''}
                    label={t("placeholder.customer-name")}
                    {...register(`customerName${0}`, {
                      required: {
                        value: true,
                        message: `Customer name ${ValidateMessage.requiredField}`
                      }
                    })}
                    error={Boolean(errors?.[`customerName${0}`])}
                    onChange={(event: SelectChangeEvent<string>) =>
                      handleChangeCustomerName(0, event)
                    }
                  >
                    {customerList &&
                      extractCustomerNames(customerList)?.map(
                        (customer: any, index: number) => {
                          return (
                            <MenuItem key={`menu-${index}`} value={customer || ''}>
                              {customer}
                            </MenuItem>
                          )
                        }
                      )}
                  </Select>
                  <FormHelperText id="customer-name-text" sx={{ color: "red" }}>{errors?.[`customerName${0}`]?.message as string}</FormHelperText>
                </FormControl>
                <FormControl sx={{ width: '50%' }} fullWidth>
                  <InputLabel id="product-name-select-label">{t("placeholder.product-name")}</InputLabel>
                  <Select
                    labelId="product-name-select-label"
                    id="product-name-select"
                    data-testid="customer-addproductcustomer-productname-select"
                    value={arrProductCustomers[0]?.productName || ''}
                    label={t("placeholder.product-name")}
                    {...register(`productName${0}`, {
                      required: {
                        value: true,
                        message: `Product name ${ValidateMessage.requiredField}`
                      }
                    })}
                    error={Boolean(errors?.[`productName${0}`])}
                    onChange={(event: SelectChangeEvent<string>) =>
                      handleChangeProductName(0, event)
                    }
                  >
                    {products?.map(
                      (customer: any, index: number) => (
                        <MenuItem key={`menu-${index}`} value={customer.id || ''}>
                          {customer.product_name}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <FormHelperText id="product-name-text" sx={{ color: "red" }}>{errors?.[`productName${0}`]?.message as string}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", gap: "1rem", }} >
                <AutoCompleteCreatePrefixs data-testid="customer-addproductcustomer-prefix-autocomplete" index={0} handle={handleChangePrefixCompanySecond} />
                <FormControl sx={{ width: '50%' }} fullWidth>
                  <InputLabel id="discount-checkbox-label">{t("placeholder.discount")}</InputLabel>
                  <Select
                    labelId="discount-checkbox-label"
                    id="discount-checkbox"
                    data-testid="customer-addproductcustomer-discount-select"
                    multiple
                    value={[...(arrProductCustomers[0]?.arrDiscount || [])]}
                    onChange={(event: SelectChangeEvent<string[]>) =>
                      handleChangeDiscount(0, event)
                    }
                    input={<OutlinedInput label={t("placeholder.discount")} />}
                    renderValue={(selected) => {
                      const selectedNames = selected.map((id) => {
                        const selectedProduct: any = discounts?.find(
                          (discount: any) => discount.id === id
                        );
                        return selectedProduct ? selectedProduct?.discount_name : '';
                      });
                      return selectedNames.join(', ');
                    }}
                    MenuProps={MenuProps}
                  >
                    {discounts?.map((discount: any) => (
                      <MenuItem key={discount.id} value={discount.id}>
                        <Checkbox checked={arrProductCustomers[0]?.arrDiscount?.indexOf(discount.id) > -1} />
                        <ListItemText primary={discount.discount_name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", gap: "1rem", }} >
                <TextField data-testid="customer-addproductcustomer-deposit-text" sx={{ width: '50%', }} fullWidth id="outlined-basic" label={t("placeholder.deposit")} variant="outlined" onChange={(event) => handleChangeDeposit(0, event)} />
                <Box sx={{ width: '50%' }} />
              </Box>
              <Typography component="span" variant="h1">
                {arrCompProducts?.map((e, i) => (
                  <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', }}>
                      <span style={{ flexGrow: 1 }} />
                      <Button
                        data-testid="customer-addproductcustomer-remove-button"
                        variant="contained"
                        color="error"
                        children={t("button.remove")}
                        onClick={(event: any) => removeSelectBox(i)}
                        sx={{ width: '140px', height: '30px', mx: 2, my: 2 }}
                      />
                    </Box>
                    {createProductCustomerSelectBoxComponent(i + 1)}
                  </>
                ))}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', }}>
                <Button data-testid="customer-addproductcustomer-cancel-button" variant="text" children={t("button.cancel")} onClick={handleCloseAddProductModal} />
                <Button data-testid="customer-addproductcustomer-submit-button" variant="text" type='submit' children={t("button.save")} />
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
