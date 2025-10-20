import { ActiveTypeBoolean, ActiveTypeFilter } from "@/core/constant";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { t } from "i18next";
import React from "react";
export default function Component(props: any) {
  const { setSearch, setPage, search, handleGetProductList } = props;

  const onFilterProduct = async () => {
    setPage(1);
    handleGetProductList();
  };

  const handleProductNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setSearch({ ...search, productName: event.target.value });
  const handleStatusChange = (event: SelectChangeEvent) =>
    setSearch({ ...search, status: event.target.value as string });

  const clearInput = () => {
    setSearch({
      productName: "",
      status: "ALL",
    });
  };
  return (
    <>
      <Box
        sx={{
          "& .MuiTextField-root": { mx: 1, width: "30ch" },
          display: "flex",
          flexDirection: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Box
            className={`flex justify-end`}
            sx={{ display: "flex", flexWrap: "wrap" }}
          >
            <TextField
              data-testid="product-productform-productname-text"
              id="product-name-input"
              label={t("placeholder.product-name")}
              size="small"
              autoComplete="current-product"
              value={search.productName}
              onChange={handleProductNameChange}
              style={{ width: "294px" }}
            />
            <FormControl
              style={{
                width: "294px",
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
              }}
              size="small"
            >
              <InputLabel id="status-label">
                {t("placeholder.status")}
              </InputLabel>
              <Select
                data-testid="product-productform-status-select"
                labelId="status-label"
                id="status"
                value={search.status}
                label={t("placeholder.status")}
                onChange={handleStatusChange}
              >
                {ActiveTypeFilter.map((type: any) => (
                  <MenuItem
                    key={`StatusType ${type.id}`}
                    value={type.type_value}
                  >
                    {t(`select.${type.type_name}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Button
                data-testid="product-productform-search-button"
                variant="contained"
                color="primary"
                type="submit"
                children={t("button.search")}
                onClick={onFilterProduct}
                sx={{
                  width: "93px",
                  height: "42px",
                  marginRight: "5px",
                  marginLeft: "5px",
                }}
              />
              <Button
                data-testid="product-productform-clear-button"
                disabled={!search.productName && !search.status ? true : false}
                variant="contained"
                color="secondary"
                children={t("button.clear")}
                onClick={clearInput}
                sx={{
                  width: "93px",
                  height: "42px",
                  marginRight: "5px",
                  marginLeft: "5px",
                }}
              />
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
}
Component.displayName = "ProductForm";
