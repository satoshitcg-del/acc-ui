import { BoxShadowButton } from "@/core/constant";
import { BILLING_STATUS } from "@/core/enum";
import { IBillingSearchReq, IBillingListResponseBase } from "@/core/interface/services";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { categoryList, StatusEnum } from "@/layout/components/modal-biiling-note/BillingNoteData";
import { useTranslate, useCalendar } from "@/routes/product-management/hooks";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import BillingService from "@/services/BillingService";
import ProductService from "@/services/ProductService";
import { Box, TextField, Autocomplete, FormControl, Select, MenuItem, Button, Chip, Typography, useTheme, CircularProgress } from "@mui/material";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface FilterSearchBillingProps {
    setRows: (row: any) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void
    triggerHandleSearch: boolean
    setTriggerHandleSearch: (isLoading: boolean) => void
    trigerDelete: any
    page: number
    setPage: (page: number) => void
    limitPage: number
    setLimitPage: (limit: number) => void
    pageAmount: { count_data: number, count_page: number, row_amount: number }
    setPageAmount: any

}

interface Product {
    id: string;
    product_name: string;
}

export function FilterSearchBillingNote(props: FilterSearchBillingProps) {
    const { search } = BillingService();
    const { getProductListSelect } = ProductService();
    const { t } = useTranslation()
    const { TranslateMonth } = useTranslate();
    const { month, years, selectMonthBillingNote, selectYearBillingNote, handleClearSelect, handleMonthBillingNoteChange, handleYearBillingNoteChange } = useCalendar();
    const { setRows, loading, setLoading, triggerHandleSearch, setTriggerHandleSearch, trigerDelete, page, setPage, limitPage, setLimitPage, pageAmount, setPageAmount } = props;
    const { register, handleSubmit, reset } = useForm({})
    const [activeFilters, setActiveFilters] = useState<string[]>([BILLING_STATUS.ALL]);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [username, setUsername] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [productList, setProductList] = useState<Product[]>([])
    const [product, setProduct] = useState<Product | null>(null)
    const [prefix, setPrefix] = useState("");
    const [telegramId, setTelegramId] = useState("");
    const { TranslateErrorCode } = useTranslateErrorCode()
    const theme = useTheme();
    const { alertError } = useAlertDialog();
    const [isSubmit, setIsSubmit] = useState(true)

    const handleInvoiceNo = (event: React.ChangeEvent<HTMLInputElement>) => setInvoiceNo(event.target.value as string);
    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value as string);
    const handleCustomer = (event: React.ChangeEvent<HTMLInputElement>) => setCustomerName(event.target.value as string);
    const handlePrefix = (event: React.ChangeEvent<HTMLInputElement>) => setPrefix(event.target.value.toLocaleUpperCase() as string);
    const handleTelegramId = (event: React.ChangeEvent<HTMLInputElement>) => setTelegramId(event.target.value as string);

    const handleClear = () => {
        reset()
        setProduct(null)
        setInvoiceNo('')
        setUsername('')
        setCustomerName('')
        handleClearSelect()
        setActiveFilters([BILLING_STATUS.ALL]);
        setTriggerHandleSearch(!triggerHandleSearch);
        setPrefix('')
        setTelegramId('')
        setPage(1)
        setLimitPage(limitPage)
    };

    const [fetchProductLoading, setFetchProductLoading] = useState(false);
    const fetchProductList = async () => {
        try {
            setFetchProductLoading(true);
            const response = await getProductListSelect();
            const products: Product[] = response.data.map((item: any) => ({
                id: item.id,
                product_name: item.product_name,
            }));
            setProductList(products);
        } catch (error) {
            console.log("Error fetching product list:", error);
        } finally {
            setFetchProductLoading(false);
        }
    };

    const handleChangeProduct = (selectedProduct: Product | null) => {
        setProduct(selectedProduct)
    };



    const handleSearch = async () => {
        try {
            let joinStatus = activeFilters.join(',');
            setRows([])
            setLoading(true)

            const body: IBillingSearchReq = {
                full_name: customerName,
                username: username,
                invoice_no: invoiceNo,
                product_id: product ? product.id.toString() : '',
                month: selectMonthBillingNote === 0 ? "" : selectMonthBillingNote,
                year: selectYearBillingNote === 0 ? "" : selectYearBillingNote,
                status: joinStatus === BILLING_STATUS.ALL ? "" : joinStatus,
                limit: String(limitPage),
                page: String(page),
                prefix: prefix,
                telegram: telegramId
            }
            const response = await search(body)
            const transformedData: IBillingListResponseBase[] = response?.data?.map((item: any, index: number) => ({
                next_status_options: item.next_status.length > 0 ? item.invoice_status != BILLING_STATUS.PARTIALPAID ? [item.invoice_status, ...item.next_status] : item.next_status : item.next_status,
                ...item
            }));

            setRows(transformedData || [])
            setPageAmount({
                ...pageAmount,
                count_data: response?.pagination?.total,
                count_page: response?.pagination?.total_pages,
                row_amount: response?.data?.length,
            });
        } catch (error: any) {
            console.error(error);
            alertError(TranslateErrorCode(error.response.data.code) || "Error").then((result) => {
                if (result.isConfirmed) {
                    setTriggerHandleSearch(!triggerHandleSearch);
                }
            });
        } finally {
            setLoading(false)
        }
    }


    const toggleFilter = (filterName: string) => {
        let filterStatus = categoryList.filter((e) => e.name === filterName)
        if (filterName.toLocaleUpperCase() === BILLING_STATUS.ALL) {
            setActiveFilters([BILLING_STATUS.ALL]);
            setTriggerHandleSearch(!triggerHandleSearch);
        } else if (activeFilters.includes(BILLING_STATUS.ALL)) {
            setActiveFilters([filterStatus[0].status]);
            setTriggerHandleSearch(!triggerHandleSearch);
        } else if (activeFilters.includes(filterStatus[0].status)) {
            if (activeFilters.filter((filter) => filter !== filterStatus[0].status).length === 0) {
                setActiveFilters([BILLING_STATUS.ALL]);
            } else {
                setActiveFilters(activeFilters.filter((filter) => filter !== filterStatus[0].status));
            }
            setTriggerHandleSearch(!triggerHandleSearch);
        } else {
            setActiveFilters([...activeFilters, filterStatus[0].status]);
            setTriggerHandleSearch(!triggerHandleSearch);
        }
        setPage(1)
        setLimitPage(limitPage)
    }

    const onSubmit = () => {
        setPage(1)
        setIsSubmit(!isSubmit)
    };

    useMemo(() => {
        handleSearch();
    }, [triggerHandleSearch, trigerDelete, page, limitPage, isSubmit]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box className="w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box className="flex justify-end mx-4 mt-4 space-x-4" >
                        <TextField
                            data-testid="billingnote-index-invoicenumber-text"
                            id="search-invoice"
                            label={t('invoice.invoice-number')}
                            size="small"
                            {...register('invoice_no')}
                            value={invoiceNo}
                            onChange={handleInvoiceNo}
                            style={{
                                width: "18%",
                                height: "32px",
                            }}
                        />
                        <TextField
                            data-testid="billingnote-index-customername-text"
                            id="search-customer"
                            label={t('invoice.username')}
                            size="small"
                            {...register('username')}
                            value={username}
                            onChange={handleUsername}
                            style={{
                                width: "18%",
                                height: "32px",
                            }}
                        />
                        <TextField
                            data-testid="billingnote-index-customername-text"
                            id="search-customer"
                            label={t('invoice.customer')}
                            size="small"
                            {...register('customer_name')}
                            value={customerName}
                            onChange={handleCustomer}
                            style={{
                                width: "18%",
                                height: "32px",
                            }}
                        />
                        <TextField
                            data-testid="billingnote-index-prefix-text"
                            id="search-prefix"
                            label={t('placeholder.prefix')}
                            size="small"
                            {...register('prefix')}
                            value={prefix}
                            onChange={handlePrefix}
                            style={{
                                width: "18%",
                                height: "32px",
                            }}
                        />
                        <TextField
                            data-testid="billingnote-index-telegram-text"
                            id="search-telegram"
                            label={t('placeholder.telegram')}
                            size="small"
                            {...register('telegram')}
                            value={telegramId}
                            onChange={handleTelegramId}
                            style={{
                                width: "18%",
                                height: "32px",
                            }}
                        />
                        <Autocomplete
                            id="combo-box-demo"
                            size="small"
                            value={product}
                            options={productList}
                            onOpen={fetchProductList}
                            onClose={() => { setProductList([]) }}
                            getOptionLabel={(option) => option.product_name}
                            noOptionsText={t('placeholder.no-options')}
                            loadingText={t('placeholder.loading-data')}
                            loading={fetchProductLoading}
                            renderInput={(params) => (
                                <TextField
                                    data-testid="billingnote-index-productrname-autocomplete"
                                    {...params}
                                    label={t("placeholder.product-name")}
                                    placeholder={t("placeholder.product-name")}
                                    size="small"
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {fetchProductLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                            onChange={(event, value) => handleChangeProduct(value)}
                            style={{
                                width: "20%",
                                height: "32px",
                                minWidth: "10%"
                            }}
                        />
                        <FormControl sx={{ width: "13%", minWidth: "10%" }} size="small">
                            <Select
                                data-testid="billingnote-index-month-select"
                                labelId="search-month"
                                id="search-month"
                                value={String(selectMonthBillingNote)}
                                disabled={month.length === 0}
                                {...register('month')}
                                onChange={handleMonthBillingNoteChange}
                                sx={{ minWidth: "10%" }}
                                MenuProps={{
                                    disableScrollLock: true,
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
                                }}
                            >
                                <MenuItem key={`temp_month`} disabled value={0}>{t("placeholder.month")}</MenuItem>
                                {month.map((month, index) => (
                                    <MenuItem key={`index ${month.month_name}`} value={month.month_number}>{month.month_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: "13%", minWidth: "10%" }} size="small">
                            <Select
                                data-testid="billingnote-index-year-select"
                                labelId="search-year"
                                id="search-year"
                                value={String(selectYearBillingNote)}
                                {...register('year')}
                                onChange={handleYearBillingNoteChange}
                                sx={{ minWidth: "10%" }}
                                MenuProps={{
                                    disableScrollLock: true,
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
                                }}
                            >
                                <MenuItem key={`temp_year`} disabled value={0}>{t("placeholder.year")}</MenuItem>
                                {years.map((year, index) => (
                                    <MenuItem key={`${year}`} value={year.year_number}>{year.year_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            data-testid="billingnote-index-search-button"
                            variant="contained"
                            color="primary"
                            type="submit"
                            children={t('invoice.search')}
                            disabled={loading}
                            sx={{
                                width: "93px",
                                height: "40px",
                                boxShadow: BoxShadowButton,
                            }}
                        />
                        <Button
                            data-testid="billingnote-index-clear-button"
                            variant="contained"
                            color="secondary"
                            disabled={(!username && !invoiceNo && !product && !prefix && !telegramId && !customerName && !selectMonthBillingNote && !selectYearBillingNote)}
                            children={t('invoice.clear')}
                            onClick={handleClear}
                            sx={{
                                width: "93px",
                                height: "40px",
                            }}
                        />
                    </Box>
                </form>
            </Box>
            <Box className="space-x-2 mx-3 w-full">
                {categoryList.filter((category) => category.name !== StatusEnum.APPROVE).map((category) => (
                    <Chip
                        data-testid="billingnote-index-categoryname-chip"
                        key={category.name}
                        label={category.status}
                        onClick={() => toggleFilter(category.name)}
                        size="small"
                        variant="outlined"
                        style={{
                            backgroundColor: activeFilters.includes(category.status)
                                ? category.activeColor
                                : '',

                            color: theme.palette.mode === "light" && !activeFilters.includes(category.status) ? 'black' : 'white',
                            borderColor: activeFilters.includes(category.status) ? category.activeColor : '',
                            cursor: 'pointer',
                            margin: "4px"
                        }}
                        disabled={loading}
                    />
                ))}
            </Box>
            <Box className="px-4 flex flex-row space-x-1">
                <Typography>{t('billing.billing-of')}</Typography>
                <Typography color="#2196F3">{`${TranslateMonth(Number(selectMonthBillingNote))}`}</Typography>
            </Box>
        </Box>
    );
}