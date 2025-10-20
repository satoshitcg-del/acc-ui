import { BoxShadowButton } from "@/core/constant";
import { BILLING_STATUS } from "@/core/enum";
import { IBillingSearchReq, IBillingListResponseBase } from "@/core/interface/services";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { categoryList, categoryMultiple, getFilteredCategories, IBillingCategory } from "@/layout/components/modal-biiling-note/BillingNoteData";
import { useTranslate, useCalendar } from "@/routes/product-management/hooks";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import BillingService from "@/services/BillingService";
import ProductService from "@/services/ProductService";
import { Box, TextField, Autocomplete, FormControl, Select, MenuItem, Button, Chip, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface FilterSearchBillingMultiProps {
    setRows: (row: any) => void;
    loading: boolean;
    setLoading: (is_loading: boolean) => void,
    triggerHandleSearch: boolean
    setTriggerHandleSearch: (is_loading: boolean) => void
    setSelectStatus: any
    setCurrentBillingStatus: any
    page: number
    setPage: (page: number) => void
    limitPage: number
    setLimitPage: (limit: number) => void
    pageAmount: { count_data: number, count_page: number, row_amount: number }
    setPageAmount: any
    setRowSelected: any
    setActiveFilters: (filter: string) => void
    activeFilters: string
    handleChangeToggleChipsFilter: (category_name: string) => void
}

interface Product {
    id: string;
    product_name: string;
}


export function FilterSearchBillingNoteMulti(props: FilterSearchBillingMultiProps) {
    const {
        setRows,
        loading,
        setLoading,
        triggerHandleSearch,
        setTriggerHandleSearch,
        setSelectStatus,
        setCurrentBillingStatus,
        page,
        setPage,
        limitPage,
        setLimitPage,
        pageAmount,
        setPageAmount,
        setRowSelected,
        setActiveFilters,
        activeFilters,
        handleChangeToggleChipsFilter

    } = props;
    const { search } = BillingService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { getProductListSelect } = ProductService();
    const { t } = useTranslation()
    const { TranslateMonth } = useTranslate();
    const { month, years, selectMonthBillingNote, selectYearBillingNote, handleClearSelect, handleMonthBillingNoteChange, handleYearBillingNoteChange } = useCalendar();
    const { register, handleSubmit, reset } = useForm({})
    const [invoiceNo, setInvoiceNo] = useState('');
    const [username, setUsername] = useState('');
    const [productList, setProductList] = useState<Product[]>([])
    const [product, setProduct] = useState<Product | null>(null)
    const [prefix, setPrefix] = useState("");
    const [telegramId, setTelegramId] = useState("");
    const [categoryMultipleList, _] = useState<IBillingCategory[]>(getFilteredCategories(categoryMultiple, categoryList))
    const [customerName, setCustomerName] = useState('');
    const theme = useTheme();
    const { alertError } = useAlertDialog();

    const handleInvoiceNo = (event: React.ChangeEvent<HTMLInputElement>) => setInvoiceNo(event.target.value as string);
    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value as string);
    const handlePrefix = (event: React.ChangeEvent<HTMLInputElement>) => setPrefix(event.target.value.toLocaleUpperCase() as string);
    const handleTelegramId = (event: React.ChangeEvent<HTMLInputElement>) => setTelegramId(event.target.value as string);
    const handleCustomer = (event: React.ChangeEvent<HTMLInputElement>) => setCustomerName(event.target.value as string);

    const handleClear = () => {
        reset()
        setProduct(null)
        setInvoiceNo('')
        setUsername('')
        setCustomerName('')
        handleClearSelect()
        setActiveFilters(BILLING_STATUS.DRAFT);
        setTriggerHandleSearch(!triggerHandleSearch);
        setPrefix('')
        setTelegramId('')
        setPage(1)
        setLimitPage(limitPage)
    };

    const fetchProductList = async () => {
        try {
            const response = await getProductListSelect();
            const products: Product[] = response.data.map((item: any) => ({
                id: item.id,
                product_name: item.product_name,
            }));
            setProductList(products);
        } catch (error) {
            console.log("Error fetching product list:", error);
        }
    };

    const handleChangeProduct = (selectedProduct: Product | null) => {
        setProduct(selectedProduct)
    };


    useEffect(() => {
        fetchProductList()
    }, [])

    const handleSearch = async () => {
        try {
            setLoading(true)
            setRows([])
            const body: IBillingSearchReq = {
                username: username,
                full_name: customerName,
                invoice_no: invoiceNo,
                product_id: product ? product.id.toString() : '',
                month: selectMonthBillingNote === 0 ? "" : selectMonthBillingNote,
                year: selectYearBillingNote === 0 ? "" : selectYearBillingNote,
                status: activeFilters,
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

            setSelectStatus('')
            setRowSelected([])
            setCurrentBillingStatus(body.status)
            setRows(() => transformedData || [])
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

    const onSubmit = () => {
        setPage(1)
        setLimitPage(limitPage)
        handleSearch();
    };

    useEffect(() => {
        handleSearch();
    }, [triggerHandleSearch, activeFilters, page, limitPage]);

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
                            getOptionLabel={(option) => option.product_name}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                                <TextField
                                    data-testid="billingnote-index-productrname-autocomplete"
                                    {...params}
                                    label={t("placeholder.product-name")}
                                    placeholder={t("placeholder.product-name")}
                                />
                            )}
                            onChange={(event, value) => handleChangeProduct(value)}
                            style={{
                                width: "20%",
                                height: "32px",
                            }}
                        />
                        <FormControl sx={{ width: "13%" }} size="small">
                            <Select
                                data-testid="billingnote-index-month-select"
                                labelId="search-month"
                                id="search-month"
                                value={String(selectMonthBillingNote)}
                                disabled={month.length === 0}
                                {...register('month')}
                                onChange={handleMonthBillingNoteChange}
                            >
                                <MenuItem key={`temp_month`} disabled value={0}>{t("placeholder.month")}</MenuItem>
                                {month.map((month, index) => (
                                    <MenuItem key={`index ${month.month_name}`} value={month.month_number}>{month.month_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: "13%" }} size="small">
                            <Select
                                data-testid="billingnote-index-year-select"
                                labelId="search-year"
                                id="search-year"
                                value={String(selectYearBillingNote)}
                                {...register('year')}
                                onChange={handleYearBillingNoteChange}
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
                            disabled={(!username && !invoiceNo && !customerName && !product && !prefix && !telegramId && !selectMonthBillingNote && !selectYearBillingNote)}
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
                {categoryMultipleList.map((category: IBillingCategory) => (
                    <Chip
                        data-testid="billingnote-index-categoryname-chip"
                        key={category.name}
                        label={category.status}
                        onClick={() => handleChangeToggleChipsFilter(category.name)}
                        size="small"
                        variant="outlined"
                        style={{
                            backgroundColor: activeFilters == category.status ? category.activeColor : '',
                            color: theme.palette.mode === "light" && activeFilters !== category.status ? 'black' : 'white',
                            borderColor: activeFilters == category.name ? category.activeColor : '',
                            cursor: 'pointer',
                            margin: "4px"
                        }}
                        disabled={loading}
                    />
                ))}
            </Box>
            <Box className="px-4 flex flex-row space-x-1 py-1">
                <Typography>{t('billing.billing-of')}</Typography>
                <Typography color="#2196F3">{`${TranslateMonth(Number(selectMonthBillingNote))}`}</Typography>
            </Box>
        </Box>
    );
}