
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { stat } from "fs/promises";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
export default function Component(props: any) {
  const {
    years,
    dates,
    currentDate,
    setCurrentDate,
    currentYear,
    setCurrentYear,
    rowsPerPage,
    setSearch
  } = props

  const textFieldstyle = {
    width: "294px",
    height: "32px"
  };
  const [filterProduct, setFilterProduct] = React.useState("");
  const { pathname, search } = useLocation();
  const [productName, setProductName] = React.useState("");
  const [status, setStatus] = React.useState("");
  const navigate = useNavigate();
  const onFilterProduct = async () => {
    let dataSearch: any = {
      "limit": rowsPerPage,
      "page": 1,
    }

    if (status !== "") {
      dataSearch["active"] = status == "0" ? "false" : "true"
    }

    if (productName !== "") {
      dataSearch["product_name"] = productName
    }
    console.log('dataSearch', dataSearch)
    setSearch(dataSearch)
  };



  const handleProductNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setProductName(event.target.value);
  const handleStatusChange = (event: SelectChangeEvent) =>
    setStatus(event.target.value);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFilterProduct(event.target.value as string);
  const handleDateChange = (event: SelectChangeEvent) =>
    setCurrentDate(event.target.value)
  const handleYearChange = (event: SelectChangeEvent) =>
    setCurrentYear(event.target.value)

  const clearInput = () => {
    setProductName("");
    setStatus("");
  };
  return (
    <>
      <Box sx={{
        "& .MuiTextField-root": { mx: 1, width: "30ch" },
        display: "flex",
        flexDirection: "flex-end",
        flexWrap: "wrap",
      }}
      >
        <Box className={`flex justify-end`} sx={{
          display: "flex",
          flexWrap: "wrap",
        }}>
          <TextField
            data-testid="product-management-productform-productname-text"
            id="product-name-input"
            label="Product name"
            size="small"
            autoComplete="current-product"
            value={productName}
            onChange={handleProductNameChange}
            style={{ width: "294px" }}
          />
          <FormControl
            style={{
              width: "294px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem"
            }}
            size="small"
          >
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              data-testid="product-management-productform-status-select"
              labelId="status-label"
              id="status"
              value={status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            style={{
              width: "294px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem"
            }}
            size="small"
          >
            <Select
              data-testid="product-management-productform-date-select"
              id="date"
              value={currentDate}
              onChange={handleDateChange}
            >
              {dates.map((date: any, index: number) => (
                <MenuItem key={date} value={date}>{date}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            style={{
              width: "87px",
              marginLeft: "0.5rem",
              marginRight: "0.5rem"
            }}
            size="small"
          >
            <Select
              data-testid="product-management-productform-year-select"
              id="year"
              value={currentYear}
              onChange={handleYearChange}
            >
              {years.map((year: any, index: number) => (
                <MenuItem key={`${year}`} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Button
              data-testid="product-management-productform-search-button"
              variant="contained"
              color="primary"
              children="Search"
              onClick={onFilterProduct}
              sx={{
                width: "93px",
                height: "42px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            />
            <Button
              data-testid="product-management-productform-clear-button"
              variant="contained"
              color="inherit"
              children="Clear"
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

      </Box>
    </>
  );
}
Component.displayName = "ProductForm";
