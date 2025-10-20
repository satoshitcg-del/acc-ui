import { useState, useEffect } from 'react';
import {
    Backdrop,
    Box,
    Button,
    Divider,
    Typography,
} from '@mui/material';

import ModalCustom from '../modal/Modal';

import type { IFormBundle } from './props';

//-------- Components && Hooks --------//
import { FormAddProductCustomer } from "./components/FormAddProductCustomer";
import { useFormBundle } from './hooks';
import { useForm } from "react-hook-form";

//-------- Layout --------//
import Loading from "@/layout/components/loading/Loading.js";

//-------- i18n --------//
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
// service
import CustomerService from '@/services/CustomerService';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import dayjs from 'dayjs';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';
import { ProductMasterType } from '@/core/enum';



interface Product {
    product_id: string;
    discounts: string[];
    prefixes?: string;
    deposit?: number;
    client_name?: string;
    opening_date?: string;
    closing_date?: string;
    note?: string;
}

type Currency = {
    _id: string;
    currency_name: string;
};


const AddCustomerProducts = (props: any) => {
    const { openModal, setOpenModal, setUpdateProduct, updateProduct } = props;
    const { createProductList, getCryptoCurrency, getFiatCurrency } = CustomerService();
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { state } = useLocation();
    const { alertError, alertSuccess } = useAlertDialog();
    const [cryptoCurrency, setCryptoCurrency] = useState<Currency[]>([])
    const [fiatCurrency, setFiatCurrency] = useState<Currency[]>([])
    const { formBundle, setFormBundle, handleAddItem, handleRemoveItem, handleUpdate, handleUpdateMultiple, handleUpdateAutocomplete, handleUpdateProduct, handleOpeningDate, handleClosingDate, handleUpdateClientName, handleUpdateDescription, handleUpdateFiatCurrency, handleSyncPrefix } = useFormBundle<IFormBundle>({
        id: 1, product_id: '', discounts: [], prefixes: '', deposit: 0, client_name: '', agent_id: '', fiat_currency_id: '',
        cryptocurrency_id: '', opening_date: '', closing_date: '', note: '', sync_loading: false, is_sync_status: false, is_sync_icon: false, deposit_currency: "USDT"
    });

    const [backDrop, setBackDrop] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        mode: "all",
        reValidateMode: "onChange"
    });

    const defaultFiat = fiatCurrency ? fiatCurrency.find((item: any) => item.currency_name.includes("THB"))?._id || '' : "";
    const defaultCrypto = cryptoCurrency ? cryptoCurrency.find((item: any) => item.currency_name.includes("USDT"))?._id || '' : "";

    const handleCloseAddProductModal = () => {
        reset();
        setOpenModal({ ...openModal, addModal: false });
        setFormBundle([{
            id: 1, product_id: '', discounts: [], prefixes: '', deposit: 0, client_name: '', agent_id: '', fiat_currency_id: '',
            cryptocurrency_id: '', opening_date: '', closing_date: '', note: '', sync_loading: false, is_sync_status: false, is_sync_icon: false
        }])
    };

    const onSubmitAddProduct = async () => {
        try {
            const updatedFormBundle = formBundle.map((currency) => {
                let updatedProduct = { ...currency };
                if (currency.deposit) {
                    updatedProduct.deposit = !currency.deposit ? 0 : Number(currency.deposit);
                }
                if (!currency.fiat_currency_id) {
                    updatedProduct.fiat_currency_id = currency.type === ProductMasterType.SPORT_BOOK_V2 ? defaultCrypto : defaultFiat;
                }
                if (!currency.cryptocurrency_id) {
                    updatedProduct.cryptocurrency_id = defaultCrypto;
                }
                if (currency.agent_id) {
                    updatedProduct.agent_id = currency.agent_id.toLowerCase();;
                }
                if (currency.opening_date) {
                    const openingDateObject = dayjs(currency.opening_date);
                    const localOpeningDateString = openingDateObject.format('YYYY-MM-DD');
                    updatedProduct.opening_date = localOpeningDateString
                }

                return updatedProduct;
            });

            const duplicateProduct = updatedFormBundle.some((item, index) =>
                updatedFormBundle.findIndex(
                    (i) => i.product_id === item.product_id && i.prefixes === item.prefixes
                ) !== index
            );

            if (duplicateProduct) {
                alertError(t('alert.duplicate-product-and-prefix'));
                return;
            }

            const body = {
                customer_id: state.cid,
                products: [...updatedFormBundle] as Product[],
            };

            setBackDrop(true)
            const res: any = await createProductList(body);
            setBackDrop(false)
            handleCloseAddProductModal()
            setUpdateProduct(!updateProduct)
            reset();
            alertSuccess(TranslateErrorCode(res?.code));
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code));
        } finally {
            setBackDrop(false)
        }

    };

    const handleGetCryptoCurrency = async () => {
        try {
            const res = await getCryptoCurrency()
            setCryptoCurrency(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetFiatCurrency = async () => {
        try {
            const res = await getFiatCurrency()
            setFiatCurrency(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetCryptoCurrency()
        handleGetFiatCurrency()
    }, [])
    return (
        <ModalCustom
            open={openModal.addModal}
            onClose={handleCloseAddProductModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={backDrop}>
                    <Loading />
                </Backdrop>
                <form onSubmit={handleSubmit(onSubmitAddProduct)}>
                    <Box sx={{ maxHeight: "80vh", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", mr: "0.5rem" }}>
                            <Typography variant='h5' sx={{ color: "modal.title_color", }}>
                                {t("title.add-product-to-customer")}
                            </Typography>
                            <Box sx={{ width: "auto", display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem" }} >
                                <Button
                                    data-testid="customer-addcustomerproducts-additem-button"
                                    disabled={formBundle[0].product_id && formBundle.length < 15 ? false : true}
                                    variant="contained"
                                    color="primary"
                                    children={`+ ${t("button.add-product")}`}
                                    onClick={() => handleAddItem()}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "80vh", py: "1rem", overflow: "auto", }}>
                            {formBundle.map((row, index) => {
                                return (
                                    <FormAddProductCustomer
                                        index={index}
                                        formBundle={row}
                                        remove={handleRemoveItem}
                                        handleUpdate={handleUpdate}
                                        handleUpdateMultiple={handleUpdateMultiple}
                                        handleUpdateAutocomplete={handleUpdateAutocomplete}
                                        handleUpdateProduct={handleUpdateProduct}
                                        key={`FormAddProductCustomer-${index}`}
                                        register={register}
                                        errors={errors}
                                        setBackDrop={setBackDrop}
                                        handleOpeningDate={handleOpeningDate}
                                        handleClosingDate={handleClosingDate}
                                        handleUpdateClientName={handleUpdateClientName}
                                        handleUpdateDescription={handleUpdateDescription}
                                        handleUpdateFiatCurrency={handleUpdateFiatCurrency}
                                        cryptoCurrency={cryptoCurrency}
                                        fiatCurrency={fiatCurrency}
                                        defaultFiat={defaultFiat}
                                        defaultCrypto={defaultCrypto}
                                        handleSyncPrefix={handleSyncPrefix}
                                    />)
                            })}
                        </Box>
                        <Divider sx={{ marginTop: "1rem" }} />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "end",
                            }}
                        >
                            <Button data-testid="customer-addcustomerproducts-cancel-button" onClick={handleCloseAddProductModal} variant='text'>
                                {t("button.cancel")}
                            </Button>
                            <Button data-testid="customer-addcustomerproducts-save-button" variant='text' type='submit'>
                                {t("button.save")}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </>
        </ModalCustom>
    );
}

export default AddCustomerProducts

