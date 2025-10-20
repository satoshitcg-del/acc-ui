import React from "react";
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
import { useTranslation } from "react-i18next";
import { ActiveTypeBoolean, ActiveTypeFilter, DiscountType, DiscountTypeFilter } from "@/core/constant";
import { validateDiscountNumber } from "../hook/useMediumFunctionDiscount";
export default function Component(props: any) {
  const { setSearch, search, setPage, handleSearchDiscountList } = props;

  const onFilterDiscount = () => {
    setPage(1);
    handleSearchDiscountList();
  };

  const { t } = useTranslation();

  const handleStaticChange = (event: any) => {
    console.log("event", event);
    const valueNumber = validateDiscountNumber(
      event.target.value,
      search.discountType,
    );
    console.log("valueNumber", valueNumber);
    setSearch({
      ...search,
      discountAmount: valueNumber,
    });
  };
  const handleDiscountNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setSearch({ ...search, discountName: event.target.value as string });
  const handleStatusChange = (event: SelectChangeEvent) =>
    setSearch({ ...search, status: event.target.value as string });
  const handleDiscountTypeChange = (event: SelectChangeEvent) => {
    setSearch({ ...search, discountType: event.target.value });
  };

  const clearInput = () => {
    setSearch({
      status: "ALL",
      discountAmount: "",
      discountName: "",
      discountType: 'ALL',
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
          <div className={`flex justify-end`} style={{ width: "100%" }}>
            <TextField
              data-testid="discount-discountform-discountname-text"
              id="discount-name-input"
              label={t("placeholder.discount-name")}
              size="small"
              autoComplete="current-sub-discount-name"
              value={search.discountName || ""}
              onChange={handleDiscountNameChange}
              style={{ width: "25%" }}
            />
            <TextField
              data-testid="discount-discountform-amount-text"
              id="amount-input"
              label={t("placeholder.amount")}
              size="small"
              type="string"
              autoComplete="current-amount"
              value={search.discountAmount || ""}
              onChange={handleStaticChange}
              style={{ width: "25%" }}
            />
            <FormControl
              style={{
                width: "10%",
                marginLeft: "0.5rem",
                marginTop: "0.5rem",
                marginRight: "0.5rem",
              }}
              size="small"
            >
              <InputLabel id="status-label">
                {t("placeholder.discount-type")}
              </InputLabel>
              <Select
                data-testid="discount-discountform-discounttype-select"
                labelId="discount-type-label"
                id="iscount-type"
                value={search.discountType || ""}
                label="Discount type"
                onChange={handleDiscountTypeChange}
              >
                {DiscountTypeFilter.map((type: any) => (
                  <MenuItem
                    key={`StatusType ${type.id}`}
                    value={type.type_value}
                  >
                    {t(`select.${type.type_name}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              style={{
                width: "15%",
                marginLeft: "0.5rem",
                marginTop: "0.5rem",
                marginRight: "0.5rem",
              }}
              size="small"
            >
              <InputLabel id="status-label">
                {t("placeholder.status")}
              </InputLabel>
              <Select
                data-testid="discount-discountform-status-select"
                labelId="status-label"
                id="status"
                value={search.status || ""}
                label="Status"
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
              data-testid="discount-discountform-search-button"
              variant="contained"
              color="primary"
              type="submit"
              children={t("button.search")}
              onClick={onFilterDiscount}
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
                !search.discountName && !search.discountAmount && !search.status
                  ? true
                  : false
              }
              data-testid="discount-discountform-clear-button"
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
          </div>
        </form>
      </Box>
    </>
  );
}
Component.displayName = "DiscountForm";
