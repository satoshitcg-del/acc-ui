import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import InvoiceDataService from "@/services/invoice.service";

export default function Component(props: any) {
    const {
        setSearch
    } = props

    const [filterForm, setFilterForm] = useState({
        username: '',
        prefix: '',
        invoice: '',
        page: '1',
        limit: '100'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilterForm((prevFilterForm) => ({
            ...prevFilterForm,
            [name]: value
        }));
    };

    const handleClear = () => {
        setFilterForm({
            username: '',
            prefix: '',
            invoice: '',
            page: '1',
            limit: '100'
        });
    };

    const handleSearch = () => {
        console.log('Search data', filterForm)
        try {
            const response = new InvoiceDataService().getSearch(filterForm)
            // setSearch(response)
        } catch (error) {

        }
    }

    return (
        <>
            <Box className={`flex flex-col w-full`} sx={{
                "& .MuiTextField-root": { m: 1, width: "18ch" },
            }}
            >
                <Box className={`flex justify-end`} >
                    <TextField
                        id="search-username"
                        label="Username"
                        name="username"
                        size="small"
                        value={filterForm.username}
                        onChange={handleInputChange}
                        style={{
                            width: "288.67px",
                            height: "32px",
                        }}
                    />
                    <TextField
                        id="search-prefix"
                        label="Prefix"
                        name="prefix"
                        size="small"
                        value={filterForm.prefix}
                        onChange={handleInputChange}
                        style={{
                            width: "288.67px",
                            height: "32px",
                        }}
                    />
                    <TextField
                        id="search-invoice"
                        label="Invoice No."
                        name="invoice"
                        size="small"
                        value={filterForm.invoice}
                        onChange={handleInputChange}
                        style={{
                            width: "288.67px",
                            height: "32px",
                        }}
                    />
                    <Box className='flex'>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            children="Search"
                            onClick={handleSearch}
                            sx={{
                                width: "93px",
                                height: "42px",
                                marginRight: "5px",
                                marginLeft: "5px",
                                marginTop: "8px"
                            }}
                        />
                        <Button
                            variant="contained"
                            color="inherit"
                            children="Clear"
                            onClick={handleClear}
                            sx={{
                                width: "93px",
                                height: "42px",
                                marginRight: "5px",
                                marginLeft: "5px",
                                marginTop: "8px"
                            }}
                        />
                    </Box>
                </Box>

            </Box>
        </>
    );
}
Component.displayName = "InvoiceSearch";
