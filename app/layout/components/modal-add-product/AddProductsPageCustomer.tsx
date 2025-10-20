import { useState, useEffect } from 'react';
import {
    Backdrop,
    Box,
    Button,
    Divider,
    Typography,
} from '@mui/material';

import ModalCustom from '../modal/Modal';

//-------- Components && Hooks --------//
import { useFormBundle } from './hooks';
import { FormAddProductPageCustomer } from './components/FormAddProductPageCustomer';
import { useForm } from "react-hook-form";

//-------- Layout --------//
import Loading from "@/layout/components/loading/Loading.js";

//-------- i18n --------//
import { useTranslation } from 'react-i18next';

// service
import CustomerService from '@/services/CustomerService';
import type { IFormBundle } from "./props";
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import React from 'react';
import dayjs from 'dayjs';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';
import { ProductMasterType } from '@/core/enum';


interface Product {
    product_id: string;
    discounts: string[];
    prefixes?: string;
    deposit?: number;
    client_name?: string;
    fiat_currency_id: string,
    cryptocurrency_id: string,
    opening_date?: string;
    closing_date?: string;
    note?: string;
}

type Currency = {
    _id: string;
    currency_name: string;
};


const AddProductsPageCustomer = (props: any) => {
    const { openModal, setOpenModal, setSignInAlert, setUpdateProduct, setUpdateCustomer, updateCustomer } = props;
    const { createProductList, getCryptoCurrency, getFiatCurrency } = CustomerService();
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const [cryptoCurrency, setCryptoCurrency] = useState<Currency[]>([])
    const [fiatCurrency, setFiatCurrency] = useState<Currency[]>([])
    const { formBundle, trigerRemoveFormBundle, setFormBundle, handleAddItem, handleRemoveItem, handleUpdate, handleUpdateMultiple, handleUpdateAutocomplete, handleUpdateProduct, handleOpeningDate, handleClosingDate, handleUpdateClientName, handleUpdateFiatCurrency, handleUpdateDescription, handleSyncPrefix } = useFormBundle<IFormBundle>({
        id: 1, product_id: '', discounts: [], prefixes: '', deposit: 0, client_name: '', agent_id: '', fiat_currency_id: '',
        cryptocurrency_id: '', opening_date: '', closing_date: '', note: '', sync_loading: false, is_sync_status: false, is_sync_icon: false, is_fix_currency: false, deposit_currency: "USDT"
    });
    const [customerID, setCustomerID] = useState('');
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

    const handleCustomerID = (selected: any) => {
        setCustomerID(selected)
    }

    const handleCloseAddProductModal = () => {
        reset();
        setOpenModal({ ...openModal, addProductModal: false });
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
                    updatedProduct.deposit = Number(currency.deposit);
                }
                if (!currency.fiat_currency_id) {
                    updatedProduct.fiat_currency_id = currency.type === ProductMasterType.SPORT_BOOK_V2 ? defaultCrypto : defaultFiat;
                }
                if (!currency.cryptocurrency_id) {
                    updatedProduct.cryptocurrency_id = defaultCrypto;
                }
                if (currency.agent_id) {
                    updatedProduct.agent_id = currency.agent_id.toLowerCase();
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
                customer_id: customerID,
                products: [...updatedFormBundle] as Product[],
            };

            setBackDrop(true)
            const res: any = await createProductList(body);
            setBackDrop(false)
            handleCloseAddProductModal()
            setUpdateCustomer(!updateCustomer)
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
            open={openModal.addProductModal}
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
                                {formBundle.length > 1 ? <Typography variant='h5'> Count {formBundle.length} </Typography> : null}
                                <Button
                                    data-testid="customer-addproductpagecustomer-add-button"
                                    disabled={customerID !== '' && formBundle.length < 15 ? false : true}
                                    variant="contained"
                                    color="primary"
                                    children={`+ ${t("button.add-product")}`}
                                    onClick={() => handleAddItem()}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "80vh", py: "1rem", overflow: "auto", }}>
                            {formBundle?.map((row, index) => {
                                return (
                                    <React.Fragment key={`FormAddProductPageCustomer-${index}`}>
                                        {defaultFiat && (
                                            <FormAddProductPageCustomer
                                                key={index}
                                                index={index}
                                                formBundle={row}
                                                remove={handleRemoveItem}
                                                handleUpdate={handleUpdate}
                                                handleUpdateMultiple={handleUpdateMultiple}
                                                handleUpdateAutocomplete={handleUpdateAutocomplete}
                                                handleUpdateProduct={handleUpdateProduct}
                                                handleCustomerID={handleCustomerID}
                                                customerID={customerID}
                                                register={register}
                                                errors={errors}
                                                setBackDrop={setBackDrop}
                                                trigerRemoveFormBundle={trigerRemoveFormBundle}
                                                handleOpeningDate={handleOpeningDate}
                                                handleClosingDate={handleClosingDate}
                                                handleUpdateClientName={handleUpdateClientName}
                                                handleUpdateFiatCurrency={handleUpdateFiatCurrency}
                                                handleUpdateDescription={handleUpdateDescription}
                                                cryptoCurrency={cryptoCurrency}
                                                fiatCurrency={fiatCurrency}
                                                defaultFiat={defaultFiat}
                                                defaultCrypto={defaultCrypto}
                                                handleSyncPrefix={handleSyncPrefix}
                                            />
                                        )}
                                    </React.Fragment>
                                )
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
                            <Button data-testid="customer-addproductpagecustomer-cancel-button" onClick={handleCloseAddProductModal} variant='text'>
                                {t("button.cancel")}
                            </Button>
                            <Button data-testid="customer-addproductpagecustomer-save-button" variant='text' type='submit'>
                                {t("button.save")}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </>
        </ModalCustom>
    );
}

export default AddProductsPageCustomer