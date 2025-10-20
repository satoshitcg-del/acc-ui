import { Autocomplete, Box, Checkbox, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from '@mui/material';
import { AutocompleteSingle } from '../style/stylemui';
import { ValidateMessage } from '@/core/enum';
import AutoCompleteCreatePrefixs from '@/layout/components/auto-complete/AutoCompleteCreatePrefixs';
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
const ProductCustomerSelectBoxComponent = (props: any) => {
  const { index, arrProductCustomers, customerList, extractCustomerNames, products, handleChangeProductName, handleChangeDiscount, handleChangePrefixCompany, prefixes, t, handleChangeDeposit, discounts, register, errors } = props
  return (
    <>
      <Box key={`ProductCustomerSelectBoxComponent-${index}`} sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <FormControl fullWidth sx={{ width: "50%" }}>
            <InputLabel id="customer-name">Customer Name</InputLabel>
            <Select
              data-testid="customer-selectboxproductcustomer-customername-select"
              disabled
              labelId="customer-name-select-label"
              id={`customer-name-select${index}`}
              value={arrProductCustomers[0]?.customerName}
              label="Customer name"
            // onChange={(event: SelectChangeEvent<string>) =>
            //   handleChangeProductCustomerName(index, event)
            // }
            >
              {customerList && (
                extractCustomerNames(customerList)?.map(
                  (customer: any, index: number) => (
                    <MenuItem key={`menu-${index}`} value={customer || ""}>
                      {customer}
                    </MenuItem>
                  ),
                )
              )}
            </Select>
          </FormControl>
          <FormControl sx={{ width: "50%" }} fullWidth>
            <InputLabel id="product-name-select-label">Product name</InputLabel>
            <Select
              data-testid="customer-selectboxproductcustomer-productname-select"
              labelId="product-name-select-label"
              id={`product-name-select${index}`}
              defaultValue={arrProductCustomers[index]?.productName || ""}
              label="Product name"
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
            <FormHelperText id="product-name-text" sx={{ color: "red" }}>{errors?.[`productName${index}`]?.message as string}</FormHelperText>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <AutoCompleteCreatePrefixs data-testid="customer-selectboxproductcustomer-prefix-autocomplete" index={index} handle={handleChangePrefixCompany} />
          <FormControl sx={{ width: '50%' }} fullWidth>
            <InputLabel id="discount-checkbox-label">{t("placeholder.discount")}</InputLabel>
            <Select
              data-testid="customer-selectboxproductcustomer-discount-select"
              labelId="discount-checkbox-label"
              id="discount-checkbox"
              multiple
              value={[...(arrProductCustomers[index]?.arrDiscount || '')]}
              onChange={(event: SelectChangeEvent<string[]>) =>
                handleChangeDiscount(index, event)
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
                  <Checkbox checked={arrProductCustomers[index]?.arrDiscount?.indexOf(discount.id) > -1} />
                  <ListItemText primary={discount.discount_name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <TextField
            data-testid="customer-selectboxproductcustomer-deposit-text"
            sx={{ width: '50%' }}
            fullWidth id="outlined-basic"
            label="Deposit" variant="outlined"
            onChange={(event) => handleChangeDeposit(index, event)} />
          <Box sx={{ width: '50%' }} />
        </Box>
      </Box>
    </>
  );
};

export default ProductCustomerSelectBoxComponent;
