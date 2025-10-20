import { useEffect, useState } from 'react';
// MUI
import {
    Autocomplete,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Divider,
    InputAdornment,
    Modal,
    Paper,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// service
import DirectApiService from '@/services/DirectApiService';

// Layout
import Loading from "@/layout/components/loading/Loading.js";
import { NumericFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode.js';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog.js';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Action } from '@/core/enum';
import { ConfirmModal } from '@/layout/components/modal-confirm/ConfirmModal';

interface ComponentProps {
    open: any;
    setOpen: any;
    defaultData: any;
    actionType: string;
    triggerAction: boolean;
    setTriggerAction: any;
    setOpenActionModal: any;
}

type TextFieldProps = {
    name: string;
    dataTestId: string;
    label: string;
    placeholder: string;
    value?: string;
    register: any
    errors: any
    width?: any
    disable?: boolean;
};

export default function Component(props: ComponentProps) {
    const { open, setOpen, defaultData, actionType, triggerAction, setTriggerAction, setOpenActionModal } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const { createDirectApi, updateDirectApi } = DirectApiService();
    const theme = useTheme();

    const ValidateSchema = yup.object().shape({
        ticket_no: yup.string(),
        billing_cycle: yup.string().required(t('validate.billing-cycle-require')),
        customer_name: yup
            .object({
                user_id: yup.string().required(t('validate.customer-require')),
                user_name: yup.string().required(t('validate.customer-require')),
            })
            .required(t('validate.customer-require')),
        products: yup.array().of(
            yup.object().shape({
                product: yup.string(),
                percent: yup
                    .number()
                    .typeError(t('validate.percent-require'))
                    .min(0, t('validate.percent-min'))
                    .max(100, t('validate.percent-max')),
                sub_product: yup.array().of(
                    yup.object().shape({
                        amount: yup.number()
                            .typeError(t('validate.wl-amount-require'))
                            .required(t('validate.wl-amount-require')),
                    })
                ),
            })
        ),
    });

    const [submitData, setSubmitData] = useState<any>(null);
    const onSubmitModal = async () => {
        try {
            setOpenConfirmModal(false);
            setIsLoading(true);
            const body = {
                billing_cycle: submitData?.billing_cycle,
                month: dayjs(submitData?.billing_cycle).format("MM"),
                year: dayjs(submitData?.billing_cycle).format("YYYY"),
                data: submitData?.products?.map((product: any, index: number) => ({
                    user_product_id: customerProucts[index].user_product_id,
                    product_id: customerProucts[index].product_id,
                    product_name: product?.product,
                    percent: product?.percent,
                    sub_product_detail: product?.sub_product?.map((subProduct: any, sub_index: number) => ({
                        name: customerProucts[index]?.sub_product_detail[sub_index]?.name,
                        winlose: subProduct?.amount,
                        currency: customerProucts[index]?.sub_product_detail[sub_index]?.currency,
                    })),
                })),
            };

            const res = actionType === Action.Add ? await createDirectApi(body) : await updateDirectApi(body, defaultData?.invoice_id);
            console.log("RESPONSE :", res);
            handleCloseAddModal();
            alertSuccess(TranslateErrorCode(res?.data?.code));
            setIsLoading(false);
            setTriggerAction(!triggerAction);
        } catch (error: any) {
            setIsLoading(false);
            alertError(TranslateErrorCode(error?.response?.data?.code));
        }
    }

    const handleCloseAddModal = () => {
        reset();
        setOpen(false);
    };

    const [oepnConfirmModal, setOpenConfirmModal] = useState(false);
    const handleOpenConfirmModal = (data: any) => {
        setSubmitData(data);
        setOpenConfirmModal(true);
    };
    const handleCloseConfirmModal = () => {
        setSubmitData(null);
        setOpenConfirmModal(false);
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
        resetField,
        trigger,
    } = useForm({
        resolver: yupResolver(ValidateSchema),
        defaultValues: {
            ticket_no: defaultData?.invoice_no || `DI${dayjs().format("DDMMYY")}xxxx`,
            billing_cycle: defaultData?.billing_cycle,
            customer_name: defaultData?.user_id && defaultData?.username ? { user_id: defaultData?.user_id, user_name: defaultData?.username } : { user_id: '', user_name: '' },
            products: defaultData?.products?.map((product: any) => ({
                product: product?.product_name,
                percent: product?.percent,
                sub_product: product?.sub_product_detail?.map((subProduct: any) => ({
                    amount: subProduct?.winlose,
                })),
            })),
        },
    });

    // Get Customer Name
    const { getDirectApiCustomerList, getDirectApiProductByCustomerId } = DirectApiService();
    const [openCustomer, setOpenCustomer] = useState(false);
    const [isCustomerLoading, setIsCustomerLoading] = useState(false);
    const [customerName, setCustomerName] = useState<any[]>([])

    const handleOpenCustomerName = async () => {
        try {
            setOpenCustomer(true);
            setIsCustomerLoading(true);
            const response = await getDirectApiCustomerList();
            setIsCustomerLoading(false);
            setCustomerName(response.data);
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code));
        } finally {
            setIsCustomerLoading(false);
        }
    };

    const handleCloseCustomerName = () => {
        setOpenCustomer(false);
        setCustomerName([])
    };

    const [customerProucts, setCustomerProducts] = useState<any[]>(defaultData?.products || [])
    const handleGetProductsByCustomerSelected = async (id: string) => {
        try {
            setOpenActionModal(true)
            if (!id) {
                setCustomerProducts([]);
                resetField('products');
                trigger(['customer_name', 'products']);
                return;
            }
            const response = await getDirectApiProductByCustomerId(id)
            setCustomerProducts(response?.data);
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code));
        } finally {
            setOpenActionModal(false)
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseAddModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                <Paper sx={stylePaperModal}>
                    <form onSubmit={handleSubmit(handleOpenConfirmModal)}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            paddingBottom: "1rem",
                        }}>
                            <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>{t(`modal.${actionType}-transaction`)}</Typography>
                        </Box>
                        <Divider />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                paddingTop: "1rem",
                            }}>
                            <Box sx={{ display: "flex", gap: "1rem", }} >
                                <TextField
                                    data-testid="direct-ticket-no-text"
                                    id="direct-ticket-no-text"
                                    label={t("table.ticket-no")}
                                    size="small"
                                    fullWidth
                                    value={watch('ticket_no') || null}
                                    {...register('ticket_no')}
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        }
                                    }}
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        disabled={actionType === Action.Edit}
                                        data-testid="direct-billing-cycle-datepicker"
                                        label={t('placeholder.billing-cycle')}
                                        maxDate={dayjs().subtract(1, 'month')}
                                        minDate={dayjs().subtract(6, 'month')}
                                        openTo="year"
                                        views={['year', 'month']}
                                        format="MM/YYYY"
                                        sx={{ width: '100%' }}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                inputProps: {
                                                    'data-testid': "direct-date-datepicker"
                                                },
                                                error: !!errors.billing_cycle,
                                                helperText: errors.billing_cycle?.message as string,
                                            }
                                        }}
                                        value={watch('billing_cycle') ? dayjs(watch('billing_cycle')) : null}
                                        onChange={(date: any) => {
                                            if (!date) return;

                                            const formattedDate = dayjs(date).date(15);
                                            if (!formattedDate.isValid()) return;

                                            setValue('billing_cycle', formattedDate.toISOString());
                                            trigger('billing_cycle');
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <Typography variant='body1' sx={{ fontWeight: "700" }}>{t(`modal.product-detail`)}</Typography>
                                <Box sx={{ display: "flex", gap: "1rem", }} >
                                    <Autocomplete
                                        data-testid="direct-customer-name-autocomplete"
                                        sx={{ width: '49%' }}
                                        size="small"
                                        // disableClearable
                                        disabled={actionType === Action.Edit}
                                        open={openCustomer}
                                        onOpen={handleOpenCustomerName}
                                        onClose={handleCloseCustomerName}
                                        isOptionEqualToValue={(option, value) => option?.user_name === value?.user_name}
                                        getOptionLabel={(option) => `${option.user_name}`}
                                        options={customerName}
                                        loading={isCustomerLoading}
                                        loadingText={t('placeholder.loading-data')}
                                        noOptionsText={t('placeholder.no-options')}
                                        value={watch('customer_name') || null}
                                        onChange={(event, value) => {
                                            const selectCustomer = {
                                                user_id: value?.user_id || '',
                                                user_name: value?.user_name || '',
                                            }
                                            handleGetProductsByCustomerSelected(selectCustomer.user_id);
                                            setValue('customer_name', selectCustomer);
                                            trigger('customer_name');
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t("placeholder.customer-name")}
                                                size="small"
                                                error={!!errors.customer_name}
                                                helperText={errors.customer_name?.user_name?.message}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {isCustomerLoading && <CircularProgress color="inherit" size={20} />}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />

                                </Box>
                            </Box>

                            {/* PRODUCTS */}
                            {customerProucts?.length > 0 && (
                                customerProucts?.map((product, index) => (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }} key={`product-${index}`}>
                                        <Typography variant='body1' sx={{ fontWeight: "700" }}>{`${t('modal.product')} ${index + 1}`}</Typography>
                                        <Box sx={{ display: "flex", gap: "1rem", }} >
                                            <TextField
                                                data-testid={`direct-product-${index}-text`}
                                                id="status-input"
                                                label={`${t("modal.product")}*`}
                                                size="small"
                                                fullWidth
                                                value={product?.product_name}
                                                slotProps={{
                                                    input: {
                                                        readOnly: true,
                                                        disabled: true,
                                                    }
                                                }}
                                                {...register(`products.${index}.product`)}
                                                error={!!errors?.products?.[index]?.product}
                                                helperText={errors?.products?.[index]?.product?.message}
                                            />
                                            <TextField
                                                data-testid={`direct-percent-${index}-text`}
                                                id="status-input"
                                                label={`${t("placeholder.percent")}*`}
                                                size="small"
                                                fullWidth
                                                type='number'
                                                {...register(`products.${index}.percent`)}
                                                error={!!errors?.products?.[index]?.percent}
                                                helperText={errors?.products?.[index]?.percent?.message}
                                                onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                                                slotProps={{
                                                    input: {
                                                        endAdornment: (<InputAdornment position="end">%</InputAdornment>),
                                                        sx: {
                                                            '& input[type=number]': {
                                                                MozAppearance: 'textfield',
                                                            },
                                                            '& input[type=number]::-webkit-outer-spin-button': {
                                                                WebkitAppearance: 'none',
                                                                margin: 0,
                                                            },
                                                            '& input[type=number]::-webkit-inner-spin-button': {
                                                                WebkitAppearance: 'none',
                                                                margin: 0,
                                                            },
                                                        },
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ display: "flex", gap: "1rem", mt: "0.5rem", flexWrap: "wrap" }} >
                                            {product?.sub_product_detail?.map((subProduct: any, subIndex: number) => (
                                                <NumericFormat
                                                    key={`direct-amount-product${index}-sub-product${subIndex}`}
                                                    data-testid={`direct-amount-product${index}-sub-product${subIndex}`}
                                                    id={`direct-amount-product${index}-sub-product${subIndex}`}
                                                    label={`${t('placeholder.wl-amount')} (${subProduct?.name})*`}
                                                    placeholder={t(`placeholder.amount`)}
                                                    variant="outlined"
                                                    size='small'
                                                    sx={{ width: "48.8%" }}
                                                    thousandSeparator
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    allowLeadingZeros={true}
                                                    customInput={TextField}
                                                    value={watch(`products.${index}.sub_product.${subIndex}.amount`)}
                                                    {...register(`products.${index}.sub_product.${subIndex}.amount`)}
                                                    error={!!errors?.products?.[index]?.sub_product?.[subIndex]?.amount}
                                                    helperText={errors?.products?.[index]?.sub_product?.[subIndex]?.amount?.message}
                                                    onValueChange={(values) => {
                                                        const numericValue: any = values?.value ?? '';
                                                        setValue(`products.${index}.sub_product.${subIndex}.amount`, numericValue, { shouldValidate: true });
                                                    }}
                                                    slotProps={{
                                                        input: {
                                                            endAdornment: <InputAdornment position="end">{subProduct?.currency}</InputAdornment>,
                                                            // sx: { color: watch(`products.${index}.sub_product.${subIndex}.amount`) < 0 ? theme.palette.error.main : "" }
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        sx: {
                                                            pr: 6,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }
                                                    }}
                                                />

                                            ))}
                                        </Box>
                                    </Box>
                                ))
                            )}
                            <Divider />
                            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "1rem" }}>
                                <Button
                                    variant="outlined"
                                    data-testid="cancel-button"
                                    children={t("button.cancel")}
                                    onClick={handleCloseAddModal}
                                />
                                <Button
                                    variant="contained"
                                    data-testid="submit-button"
                                    children={t("button.save")}
                                    type='submit'
                                />
                            </Box>
                        </Box>
                    </form>
                </Paper>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading} >
                    <Loading />
                </Backdrop>
                {oepnConfirmModal &&
                    <ConfirmModal
                        openModal={oepnConfirmModal}
                        closeModal={handleCloseConfirmModal}
                        save={() => onSubmitModal()}
                    />
                }
            </Box>
        </Modal>
    );
}

Component.displayName = 'DirectApiModal';

const stylePaperModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "738px",
    height: "auto",
    maxHeight: "calc(100vh - 20px)",
    overflowY: "auto",
    p: "1.5rem"
};