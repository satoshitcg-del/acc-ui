import { ActiveTypeFilter } from "@/core/constant";
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
  const { setSearch, search, setPage, handleSearchSubProductList } = props;

  const onFilterSubProduct = () => {
    setPage(1);
    handleSearchSubProductList();
  };
  const handleSubProductNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setSearch({ ...search, subProductName: event.target.value as string });
  const handleStatusChange = (event: SelectChangeEvent) =>
    setSearch({ ...search, status: event.target.value as string });

  const clearInput = () => {
    setSearch({
      subProductName: "",
      status: "ALL",
    });
  };
  return (
    <>
      <Box
        className={`flex flex-col w-full`}
        sx={{
          "& .MuiTextField-root": { m: 1, width: "18ch" },
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Box
            className={`flex justify-end`}
            sx={{ display: "flex", flexWrap: "wrap", width: "100%" }}
          >
            <TextField
              data-testid="subproduct-subproductform-subproductname-text"
              id="sub-product-name-input"
              label={t("placeholder.sub-product-name")}
              size="small"
              autoComplete="current-sub-product-name"
              value={search.subProductName}
              onChange={handleSubProductNameChange}
              style={{ width: "25%" }}
            />
            <FormControl
              style={{
                width: "15%",
                marginLeft: "0.5rem",
                marginTop: "0.5rem",
                marginRight: "0.5rem",
              }}
              size="small"
            >
              <InputLabel id="demo-simple-select-label">
                {t("placeholder.status")}
              </InputLabel>
              <Select
                data-testid="subproduct-subproductform-status-select"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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
            <Button
              data-testid="subproduct-subproductform-search-button"
              variant="contained"
              color="primary"
              type="submit"
              children={t("button.search")}
              onClick={onFilterSubProduct}
              sx={{
                width: "7%",
                height: "42px",
                marginRight: "5px",
                marginLeft: "5px",
                marginTop: "8px",
              }}
            />
            <Button
              disabled={
                !search.subProductName && !search.prices && !search.status
                  ? true
                  : false
              }
              data-testid="subproduct-subproductform-clear-button"
              variant="contained"
              color="secondary"
              children={t("button.clear")}
              onClick={clearInput}
              sx={{
                width: "7%",
                height: "42px",
                marginRight: "5px",
                marginLeft: "5px",
                marginTop: "8px",
              }}
            />
          </Box>
        </form>
      </Box>
    </>
  );
}
Component.displayName = "SubProductForm";
