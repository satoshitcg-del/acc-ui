import { useEffect } from "react";
import { Autocomplete, Box, Checkbox, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from '@mui/material';
import { ValidateMessage } from "@/core/enum.js";
import { useTranslation } from 'react-i18next';
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
const ProductSelectBoxComponent = (props: any) => {
  const { index, arrProduct, products, handleChangeProductName, handleChangeDiscount, handleChangePrefixCompany, register, errors, prefixes, handleChangeDeposit, discounts, } = props
  const { t } = useTranslation();
  console.log("sssssss")
  // useEffect(() => {
  //   reset();
  // }, [])


  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <FormControl sx={{ width: '50%' }} fullWidth>
            <InputLabel id="product-name-select-label">{t("placeholder.product-name")}</InputLabel>
            <Select
              data-testid="customer-selectboxproduct-productname-select"
              labelId="product-name-select-label"
              id={`product-name-select${index}`}
              defaultValue={arrProduct[index]?.productName || ""}
              label={t("placeholder.product-name")}
              {...register(`productName${index}`, {
                required: {
                  value: true,
                  message: `Product name ${ValidateMessage.requiredField}`
                }
              })}
              error={Boolean(errors?.[`productName${index}`])}
              onChange={(event: SelectChangeEvent<string>) =>
                handleChangeProductName(index, event)
              }
            >
              {products?.map(
                (customer: any, index: number) => (
                  <MenuItem key={`menu-${index}`} value={customer.id || ""}>
                    {customer.product_name}
                  </MenuItem>
                ),
              )}
            </Select>
            <FormHelperText id="product_name-text" sx={{ color: "red" }}>{errors?.[`productName${index}`]?.message as string}</FormHelperText>
          </FormControl>
          <FormControl sx={{ width: '50%' }} fullWidth>
            <InputLabel id="discount-checkbox-label">{t("placeholder.discount")}</InputLabel>
            <Select
              data-testid="customer-selectboxproduct-discount-select"
              labelId="discount-checkbox-label"
              id="discount-checkbox"
              multiple
              value={[...(arrProduct[index]?.discounts || '')]}
              onChange={(event: SelectChangeEvent<string[]>) =>
                handleChangeDiscount(index, event)
              }
              input={<OutlinedInput label={t("placeholder.discount")} />}
              renderValue={(selected) => {
                const selectedNames = selected.map((id) => {
                  const selectedProduct: any = discounts.find(
                    (discount: any) => discount.id === id
                  );
                  return selectedProduct ? selectedProduct?.discount_name : '';
                });
                return selectedNames.join(', ');
              }}
              MenuProps={MenuProps}
            >
              {/* Discount list */}
              {discounts?.map((discount: any) => (
                <MenuItem key={discount.id} value={discount.id}>
                  <Checkbox checked={arrProduct[index]?.discounts?.indexOf(discount.id) > -1} />
                  <ListItemText primary={discount.discount_name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: "1rem", }} >
          <Autocomplete
            data-testid="customer-selectboxproduct-prefix-autocomplete"
            value={arrProduct[index]?.prefix}
            onChange={(event) => {
              handleChangePrefixCompany(index, event)
            }}
            // filterOptions={(options: any, params: any) => {
            //   const filtered: any = filter(options, params);
            //   const { inputValue } = params;
            //   const isExisting = options.some((option: any) => inputValue === option.prefix_name);
            //   if (inputValue !== '' && !isExisting) {
            //     filtered.push({
            //       inputValue,
            //       prefix_name: `Add "${inputValue}"`,
            //     });
            //   }
            //   return filtered;
            // }}
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
            sx={{ width: "50%" }}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label={t("placeholder.prefix-company")} />
            )}
          />
          <TextField sx={{ width: '50%' }} fullWidth data-testid="customer-selectboxproduct-deposit-select" id="outlined-basic" label="Deposit" variant="outlined" onChange={(event) => handleChangeDeposit(index, event)} />
        </Box>
      </Box>

    </>
  );
};

export default ProductSelectBoxComponent;
