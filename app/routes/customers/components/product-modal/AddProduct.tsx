import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogProps,
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
} from "@mui/material";

// React
import React from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
// Components
import ProductSelectBoxComponent from "../SelectBoxProduct.js";
import Loading from "@/layout/components/loading/Loading.js";
// Enum
import { ValidateMessage } from "@/core/enum.js";
import { IProductList } from "@/core/interface/services.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
// service 
import DiscountService from "@/services/DiscountService.js";
import CustomerService from "@/services/CustomerService.js";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog.js";

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
  discounts: string[];
  prefix?: string;
  deposit?: number;
}
interface Product {
  product_id: string;
  discounts: string[];
  prefixes?: string;
  deposit?: number;
}


export default function Component(props: any) {
  const { openModal, setOpenModal, setSignInAlert, updateProduct, setUpdateProduct, prefixes } = props;
  const { alertError, alertSuccess } = useAlertDialog();
  const { getDiscountSelectList } = DiscountService();
  const { getProductNameList, createProductList } = CustomerService();
  const [products, setProducts] = React.useState<IProductList[]>([]);
  const [discounts, setDiscounts] = React.useState<object[]>([]);
  const [arrCompProducts, setArrCompProducts] = React.useState<any[]>([]);
  const [backDrop, setBackDrop] = React.useState(false);
  const [customerName, setCustomerName] = React.useState("");
  const [arrProduct, setArrProduct] = React.useState<
    IProducts[]
  >([]);

  const { pathname } = useLocation();
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const descriptionElementRef = React.useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const fetchValue = async () => {
    const result: string = pathname.split("/").pop()!;
    const result2 = result.split("-");
    setCustomerName(result2[1]);
    try {
      const products = await getProductNameList();
      setProducts(products);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
  });

  React.useEffect(() => {

    fetchValue();
    fetchDiscountValue()
  }, []);

  const fetchDiscountValue = async () => {
    try {
      const res = await getDiscountSelectList();
      const discountLists = res?.data || []
      setDiscounts(discountLists);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    }
  };

  const handleChangeProductName = (
    index: number,
    event: SelectChangeEvent<string>,
  ) => {
    const updateArrProduct = [...arrProduct]
    updateArrProduct[index] = {
      ...updateArrProduct[index],
      productName: event.target.value as string,
    };
    setArrProduct(updateArrProduct);
  };

  const handleChangePrefixCompany = (
    index: number,
    event: any,
  ) => {
    arrProduct[index] = {
      ...arrProduct[index],
      prefix: event.target.textContent as string
    };
    setArrProduct(arrProduct);
  };

  const handleChangeDiscount = (
    index: number,
    event: SelectChangeEvent<string[]>,
  ) => {
    arrProduct[index] = {
      ...arrProduct[index],
      discounts: [...(event.target.value as string)],
    };
    setArrProduct([...arrProduct]);
  };

  const handleChangeDeposit = (
    index: number,
    event: any
  ) => {
    arrProduct[index] = {
      ...arrProduct[index],
      deposit: event.target.value as number
    };
    setArrProduct(arrProduct);
  };

  const handleCloseAddProductModal = () => {
    setArrProduct([]);
    setArrCompProducts([]);
    reset();
    setOpenModal({ ...openModal, addModal: false });
  };

  const removeSelectBox = async (index: any) => {
    const updatedArrProductCustomers = [...arrProduct];
    if (index + 1 >= 0 && index + 1 < updatedArrProductCustomers.length) {
      updatedArrProductCustomers.splice(index + 1, 1);
    }
    const updatedArrCompProducts = [...arrCompProducts];
    if (index >= 0 && index <= updatedArrCompProducts.length) {
      updatedArrCompProducts.splice(index, 1);
    }

    await setArrCompProducts([])
    setArrProduct(updatedArrProductCustomers);
    setArrCompProducts(updatedArrCompProducts);
  };

  const addSelectProductBox = () => {
    arrCompProducts.push(createProductSelectBoxComponent(arrCompProducts.length + 1))
    setArrCompProducts([...arrCompProducts])
  };

  const filterPrefixId = (prefix: string) => {
    const prefixFilter: any = prefixes.filter((item: any) => item.product_link_name == prefix)[0]
    return prefixFilter?.product_link_id
  }

  const onSubmitAddProduct = async () => {
    try {
      const result: string = pathname.split("/").pop()!;
      const result2 = result.split("-");
      const body = {
        customer_id: result2[0],
        products: [] as Product[],
      };
      arrProduct.forEach((product: any, index: any) => {
        body.products.push({
          product_id: product.productName,
          discounts: product.discounts,
          prefixes: filterPrefixId(product.prefix),
          deposit: parseFloat(product.deposit),
        });
      });
      setBackDrop(true)
      const res: any = await createProductList(body);
      setBackDrop(false)
      handleCloseAddProductModal()
      alertSuccess(TranslateErrorCode(res?.code));
      setUpdateProduct(!updateProduct)
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setBackDrop(false)
      reset();
    }
  };

  function createProductSelectBoxComponent(index: any) {
    return (
      <ProductSelectBoxComponent
        key={index}
        index={index}
        arrProduct={arrProduct}
        products={products}
        handleChangeProductName={handleChangeProductName}
        handleChangeDiscount={handleChangeDiscount}
        handleChangePrefixCompany={handleChangePrefixCompany}
        handleChangeDeposit={handleChangeDeposit}
        register={register}
        errors={errors}
        reset={reset}
        prefixes={prefixes}
        discounts={discounts}
      />
    );
  }

  return (
    <>
      <Dialog
        open={openModal.addModal}
        onClose={handleCloseAddProductModal}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent
          dividers={scroll === 'paper'}
          sx={{
            width: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={backDrop}
            >
              <Loading />
            </Backdrop>
            <form onSubmit={handleSubmit(onSubmitAddProduct)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", my: 0.5 }}>
                  <Typography component={'span'} variant={'h5'} sx={{ color: "modal.title_color", fontWeight: "500" }}>
                    {t("title.add-product-into")} {customerName}
                  </Typography>

                  <Button
                    data-testid="customer-addproduct-add-button"
                    disabled={!arrProduct[0]?.productName || arrCompProducts.length >= 14 ? true : false}
                    variant="contained"
                    color="primary"
                    children={`+ ${t("button.add-product")}`}
                    onClick={() => addSelectProductBox()}
                    sx={{ width: "140px", height: "30px" }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: "1rem", }} >
                  <FormControl sx={{ width: '50%' }} fullWidth >
                    <InputLabel error={Boolean(errors?.[`productName${0}`])} id="product-name-select-label">
                      {t("placeholder.product-name")}
                    </InputLabel>
                    <Select
                      labelId="product-name-select-label"
                      id="product-name-select"
                      data-testid="customer-addproduct-productname-select"
                      value={arrProduct[0]?.productName || ""}
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
                        (product: any, index: number) => (
                          <MenuItem key={`menu-${index}`} value={product.id || ""}>
                            {product.product_name}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                    <FormHelperText id="product_name-text" sx={{ color: "red" }}>{errors?.[`productName${0}`]?.message as string}</FormHelperText>
                  </FormControl>
                  <FormControl sx={{ width: '50%' }} fullWidth>
                    <InputLabel id="discount-checkbox-label">{t("placeholder.discount")}</InputLabel>
                    <Select
                      data-testid="customer-addproduct-discount-select"
                      labelId="discount-checkbox-label"
                      id="discount-checkbox"
                      multiple
                      value={[...(arrProduct[0]?.discounts || [])]}
                      onChange={(event: SelectChangeEvent<string[]>) =>
                        handleChangeDiscount(0, event)
                      }
                      input={<OutlinedInput label={t("placeholder.discount")} />}
                      renderValue={(selected) => {
                        const selectedNames = selected.map((id) => {
                          const selectedDiscount: any = discounts.find(
                            (discount: any) => discount.id === id
                          );
                          return selectedDiscount ? selectedDiscount?.discount_name : '';
                        });
                        return selectedNames.join(', ');
                      }}
                      MenuProps={MenuProps}
                    >
                      {discounts?.map((discount: any) => (
                        <MenuItem key={discount.id} value={discount.id}>
                          <Checkbox checked={arrProduct[0]?.discounts?.indexOf(discount.id) > -1} />
                          <ListItemText primary={discount.discount_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", gap: "1rem", }} >
                  <Autocomplete
                    sx={{ width: "50%" }}
                    value={arrProduct[0]?.prefix}
                    onChange={(event) => {
                      handleChangePrefixCompany(0, event)
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id={t("placeholder.prefix-company")}
                    options={prefixes}
                    getOptionLabel={(option: any) => {
                      if (typeof option === 'string') {
                        return option;
                      }
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      return option.product_link_name;
                    }}
                    renderOption={(props, option: any) => <li {...props}>{option.product_link_name}</li>}
                    freeSolo
                    renderInput={(params) => (
                      <TextField {...params} label={t("placeholder.prefix-company")} error={Boolean(errors?.[`prefixes${0}`])} helperText={errors?.[`prefixes${0}`]?.message as string} />
                    )}
                  />

                  <TextField
                    data-testid="customer-addproduct-deposit-select"
                    sx={{ width: '50%' }}
                    fullWidth id="outlined-basic"
                    label={t("placeholder.deposit")}
                    variant="outlined"
                    onChange={(event) => handleChangeDeposit(0, event)}
                  />
                </Box>
                <Typography component={"span"} variant={"h1"}>
                  {arrCompProducts?.map((e, i) => (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <span style={{ flexGrow: 1 }} />
                        <Button
                          data-testid="customer-addproduct-remove-button"
                          variant="contained"
                          color="error"
                          children={t("button.remove")}
                          onClick={(event: any) => removeSelectBox(i)}
                          sx={{ width: "140px", height: "30px", my: 2, mb: 3 }}
                        />
                      </Box>
                      {createProductSelectBoxComponent(i + 1)}

                    </>
                  ))}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", }}>
                <Button
                  data-testid="customer-addproduct-cancel-button"
                  variant="text"
                  children={t("button.cancel")}
                  onClick={handleCloseAddProductModal}
                />
                <Button
                  data-testid="customer-addproduct-submit-button"
                  type="submit"
                  variant="text"
                  children={t("button.save")}
                />
              </Box>
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
Component.displayName = "AddProduct";