import React, { ChangeEvent, useEffect, useState } from 'react'
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, MenuItem, Select, FormLabel, RadioGroup, FormControlLabel, Radio, InputAdornment, FormHelperText, Backdrop, CircularProgress, Checkbox } from '@mui/material'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { set, useForm } from 'react-hook-form';
import { BoxShadowButton } from '@/core/constant';
import { SelectChangeEvent } from '@mui/material';
import * as yup from "yup";
// service
import BillingService from '@/services/BillingService';
import { useTranslation } from 'react-i18next';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { reasons } from '@/layout/components/modal-biiling-note/BillingNoteData';
import numeral from 'numeral';
import RadioButtonStatusType from '@/layout/components/modal-biiling-note/RadioButtonStatusType';
import { BILLING_STATUS, CurrencyType, Money, Status, ValidateMessage } from '@/core/enum';
import { NumericFormat } from 'react-number-format';
import ImageUpload from '../file-upload/SlipUpload';
import PaymentUpload from '../file-upload/PaymentUpload';
import { IPaymentUploadResponse } from '@/core/interface/services';
import SlipUpload from '../file-upload/SlipUpload';
import InvoiceService from '@/services/InvoiceService';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';
interface ModalProps {
    openModal: boolean
    closeModal: () => void
    data: any
    tempStatus: any
    triggerHandleSearch: boolean
    setTriggerHandleSearch: any
    setOpenActionModal: any
}

type Currency = {
    currency_id: string;
    currency_name: string;
    currency_type: string;
    total_amount?: string;
};

export default function BillingNoteChangeStatusModal(props: ModalProps) {
    const { t } = useTranslation()
    const { updateStatus, getCurrencyForUpdateStatus, verifypaymenAmounttByAdmin } = BillingService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { openModal, closeModal, data, tempStatus, triggerHandleSearch, setTriggerHandleSearch, setOpenActionModal } = props
    const { getCustomerInfo } = BillingService();
    const { deleteSlipUpload } = InvoiceService()
    const [loading, setLoading] = useState(false);
    const [currencyList, setCurrencyList] = useState<Currency[]>([])
    const [selectCurrency, setSelectCurrency] = useState<string>("")
    const [currencyCredit, setCurrencyCredit] = useState<string>("")
    const [paidValue, setPaidValue] = useState<string>("")
    const [statusType, setStatusType] = useState<string>(Status.money_transfer)
    const [totalCredit, setTotalCredit] = useState<number>(0)
    const [checkCurrency, setCheckCurrency] = useState<string>(CurrencyType.FIAT)
    const { alertError, alertSuccess } = useAlertDialog();

    const handleChangeStatus = async (obj: any) => {
        try {
            setLoading(true)
            const body = {
                amount: Number(paidValue) || 0,
                status: tempStatus?.props?.value || data.invoice_status,
                old_status: data.invoice_status,
                note: obj.note || "",
                invoice_id: data.id,
                cause: obj.reason || "",
                payment_type: tempStatus?.props?.value === BILLING_STATUS.PAID || tempStatus?.props?.value === BILLING_STATUS.PARTIALPAID || data.invoice_status === BILLING_STATUS.PARTIALPAID || tempStatus?.props?.value === BILLING_STATUS.REFUND ? statusType : "",
                currency_id: tempStatus?.props?.value === BILLING_STATUS.PAID || tempStatus?.props?.value === BILLING_STATUS.PARTIALPAID || data.invoice_status === BILLING_STATUS.PARTIALPAID || tempStatus?.props?.value === BILLING_STATUS.REFUND ? (statusType === Status.money_transfer ? selectCurrency : currencyCredit) : undefined,
                network: walletType,
                crypto_address: walletAddress,
                files: paymentUploadPath
            }

            if ((walletType && !walletAddress) || (!walletType && walletAddress)) {
                alertError(t('modal.input-wallet-address-title'), t('modal.input-wallet-address'))
                setLoading(false)
                return;
            }

            if (tempStatus?.props?.value === BILLING_STATUS.DELIVERED && paymentUploadPath.length === 0 && (!walletType && !walletAddress)) {
                alertError(t('modal.input-wallet-address-title'), t('modal.input-wallet-address'))
                setLoading(false)
                return;
            }

            // if (tempStatus?.props?.value === BILLING_STATUS.VERIFYPAYMENT && paymentUploadPath.length === 0) {
            //     alertError(t('modal.input-wallet-address-title'), t('modal.input-wallet-address'))
            //     return;
            // }

            if (tempStatus?.props?.value || data.invoice_status == BILLING_STATUS.PARTIALPAID) {
                const response = await updateStatus(data?.id, body)
                alertSuccess(TranslateErrorCode(response.code))
                closeModal()
                setLoading(false)
                setTriggerHandleSearch(!triggerHandleSearch);
            }
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code))
            closeModal()
            setLoading(false)
            setTriggerHandleSearch(!triggerHandleSearch);
        }
    }


    const handleSubmitVerifyPayment = async () => {
        try {
            setLoading(true)
            const body = {
                amount: Number(paidValue) || 0,
                status: tempStatus?.props?.value || data.invoice_status,
                old_status: data.invoice_status,
                invoice_id: data.id,
                files: paymentUploadPath
            }

            const response = await verifypaymenAmounttByAdmin(body)
            alertSuccess(TranslateErrorCode(response.code))
            closeModal()
            setLoading(false)
            setTriggerHandleSearch(!triggerHandleSearch);
        } catch (error: any) {
            console.error(error)
            alertError(TranslateErrorCode(error.response.data.code))
            closeModal()
            setLoading(false)
            setTriggerHandleSearch(!triggerHandleSearch);
        }
    }

    const handleClose = async () => {
        if (paymentUploadPath.length > 0) {
            try {
                setOpenActionModal(true)
                await Promise.all(
                    paymentUploadPath.map(slip => deleteSlipUpload(slip.file_name))
                );
            } catch (error: any) {
                alertError(TranslateErrorCode(error?.data?.code))
            } finally {
                setOpenActionModal(false)
            }
        }
        setStatusType(Status.money_transfer)
        closeModal()
    }

    const checkTotalCredit = async () => {
        const res = await getCustomerInfo(data.id, data.customer_id);
        setTotalCredit(res.data.total_credit_usdt)
    }

    const { register, handleSubmit, watch, setValue, getValues, formState: { errors }, } = useForm({
        mode: "onSubmit", reValidateMode: "onChange",
        defaultValues: {
            note: "",
            currency: "",
            reason: "",
            otherValue: "",
            paidValue: "",
        }
    })
    const editorContent = watch("note");

    useEffect(() => {
        register("note");
    }, [register])

    useEffect(() => {
        checkTotalCredit()
        if (statusCase() == 3) {
            setPaidValue((data.overdue_price_crypto * -1).toFixed(2))
        } else {
            setPaidValue("")
        }

        if (statusCase() == 1 || statusCase() == 2 || statusCase() == 3) {
            getCurrency()
        }

    }, [])

    const getCurrency = async () => {
        try {
            const response = await getCurrencyForUpdateStatus(data.id, data.customer_id)
            setCurrencyList(response.data)
            const defaultCurrency = response.data.filter((item: Currency) => item.currency_name.includes("USDT"))
            const defaultCurrencyToFiat = response.data.find((item: Currency) => item.currency_type.includes(CurrencyType.FIAT));
            setCurrencyCredit(defaultCurrency[0].currency_id);
            setSelectCurrency(defaultCurrency[0].currency_id)
            setValue('currency', defaultCurrency[0].currency_id);
        } catch (error) {
            console.log(error)
        }
    }

    const onEditorStateChange = (editorState: string) => {
        setValue("note", editorState);
    };

    const validateNumber = (values: any, register: string) => {
        setPaidValue(values.floatValue)
        setValue('otherValue', values.floatValue);
    }

    const validateNumberPaid = (values: any, value: string) => {
        setPaidValue(values.floatValue)
        setValue('paidValue', values.floatValue);
    }

    const [reason, setReason] = React.useState('');

    const handleChangeReason = (event: SelectChangeEvent) => {
        setReason(event.target.value as string);
    };

    const handleChangeCurrency = async (event: SelectChangeEvent) => {
        const newStatus = tempStatus?.props?.value
        const selectedCurrencyId = event.target.value;
        const selectedCurrency: any = currencyList.find(currency => currency.currency_id === selectedCurrencyId);
        if (newStatus == BILLING_STATUS.PAID) {
            setPaidValue((selectedCurrency?.total_amount * -1).toFixed(2))
        }
        setCheckCurrency(selectedCurrency?.currency_type as string)
        setSelectCurrency(event.target.value as string);
        // switchDefaultPaid(selectedCurrency?.currency_type as string)
        switchTotalPayment()
        switchOverduePrice()
    };

    const statusCase = () => {
        const newStatus = tempStatus?.props?.value

        if (newStatus == BILLING_STATUS.PARTIALPAID || (data.invoice_status == BILLING_STATUS.PARTIALPAID && !newStatus)) {
            return 1
        }

        if (newStatus == BILLING_STATUS.REFUND) {
            return 2
        }

        if (newStatus == BILLING_STATUS.PAID) {
            return 3
        }

        if (newStatus == BILLING_STATUS.DELIVERED) {
            return 4
        }

        if (newStatus == BILLING_STATUS.VERIFYPAYMENT) {
            return 5
        }
        return
    }


    const switchTotalPayment = () => {
        let value = checkCurrency === CurrencyType.CRYPTO ? data.total_payment_crypto : data.total_payment
        return value
    }

    const switchOverduePrice = () => {
        const selectedCurrency: any = currencyList.find(currency => currency.currency_id === selectCurrency);
        return selectedCurrency?.total_amount
    }

    const switchDefaultPaid = (checkCurrency: string) => {
        if (statusCase() == 3) {
            checkCurrency === CurrencyType.CRYPTO ? setPaidValue((data.overdue_price_crypto * -1).toFixed(2)) : setPaidValue((data.overdue_price * -1).toFixed(2))
        } else {
            setPaidValue('')
        }
    }

    let validationRules: {
        required: { value: boolean; message: string; };
        min?: { value: number; message: string; };
    } = {
        required: {
            value: true,
            message: t("error.paidValue"),
        }
    };

    if (statusType === Status.money_transfer) {
        validationRules.min = {
            value: switchOverduePrice() * -1,
            message: `${t('error.paid')} ${formatNumber(switchOverduePrice() * -1)} ${t('billing.baht')}`
        };
    }

    const [paymentUploadPath, setPaymentUploadPath] = useState<IPaymentUploadResponse[] | []>([]);
    const walletTypeList = ["ERC20", "TRON"]
    const [walletType, setWalletType] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const handleChangeWalletType = (event: SelectChangeEvent) => {
        setWalletType(event.target.value as string);
    };

    const handleChangeWalletAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWalletAddress(event.target.value as string);
    };

    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const handleChangeVerifyPaymentAmount = (value: any) => {
        setPaidValue(value.floatValue);
    }
    const [verifyPaymentCheck, setVerifyPaymentCheck] = React.useState(false);
    const handleChangeVerifyPaymentCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setVerifyPaymentCheck(checked);
        if (checked) {
            setPaidValue(`${data?.net_amount * -1}`);
        } else {
            setPaidValue('');
        }
    };

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            disableScrollLock
        >
            <Box sx={style}>
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={openBackdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Typography variant="h6" component="h2" sx={{ py: 2 }}>{t('modal.confirm-change-status-title')}</Typography>
                <Typography variant="body1" component="h2" sx={{ pb: 2 }}>{t('modal.confirm-change-status-descript')}</Typography>
                {
                    statusCase() === 4 && (
                        <>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%" }} >
                                <Typography>{t('modal.payment')}</Typography>
                                <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "start", width: "100%" }}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="task-wallet-type-label">{t('placeholder.wallet-type')}</InputLabel>
                                        <Select
                                            labelId="task-wallet-type-label"
                                            id="task-wallet-type"
                                            value={walletType || ''}
                                            label={t('placeholder.wallet-type')}
                                            onChange={(event) => {
                                                handleChangeWalletType(event);
                                            }}
                                        >
                                            {walletTypeList.map((status: any) => (
                                                <MenuItem
                                                    key={`type ${status}`}
                                                    value={status}
                                                >
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        id="task-wallet-address"
                                        placeholder={t('placeholder.wallet-address')}
                                        variant="outlined"
                                        size='small'
                                        value={walletAddress}
                                        onChange={handleChangeWalletAddress}
                                    />
                                </Box>
                            </Box>
                            <PaymentUpload paymentUploadPath={paymentUploadPath} setPaymentUploadPath={setPaymentUploadPath} setOpenActionModal={setOpenActionModal} />
                        </>
                    )
                }
                {
                    statusCase() === 5 && (
                        <>
                            <Box
                                sx={{
                                    mb: 2,
                                    borderRadius: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    gap: 1,
                                }}
                            >
                                <Typography fontWeight="bold">
                                    {t('title.confirm-payment')}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1, width: '100%' }}>
                                    <Typography
                                        sx={{ width: '150px', display: 'flex', justifyContent: 'flex-end' }}
                                    >
                                        {t('billing.amount-due')}
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '180px',
                                        justifyContent: 'center',
                                        color: data?.total_payment >= 0 ? '' : 'error.main'
                                    }}>
                                        {formatNumber(data?.total_payment)}
                                    </Box>
                                    <Typography>{data?.currency}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                    <Typography
                                        sx={{ width: '150px', display: 'flex', justifyContent: 'flex-end' }}
                                    >
                                        {t('modal.credit-discount')}
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '180px',
                                        justifyContent: 'center',
                                        color: data?.user_credit >= 0 || !data?.user_credit ? '' : 'error.main'
                                    }}>
                                        {formatNumber(data?.user_credit)}
                                    </Box>
                                    <Typography>{data?.currency}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                    <Typography
                                        sx={{ width: '150px', display: 'flex', justifyContent: 'flex-end' }}
                                    >
                                        {t('billing.amount-due')}
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '180px',
                                        justifyContent: 'center',
                                        color: data?.net_amount >= 0 ? '' : 'error.main'
                                    }}>
                                        {formatNumber(data?.net_amount)}
                                    </Box>
                                    <Typography>{data?.currency}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <FormControlLabel
                                        sx={{ width: '130px' }}
                                        control={
                                            <Checkbox checked={verifyPaymentCheck} onChange={handleChangeVerifyPaymentCheck} name="verifyPaymentAmount" />
                                        }
                                        label={t('billing.full-amount')}
                                    />
                                    <NumericFormat
                                        disabled={verifyPaymentCheck}
                                        label={t("placeholder.amount")}
                                        data-testid="verify-payment-amount"
                                        id="amount"
                                        size='small'
                                        value={paidValue}
                                        // error={errors.discount_amount ? true : false}
                                        // helperText={errors.discount_amount?.message as string}
                                        inputProps={{
                                            maxLength: 19,
                                            sx: { width: "140px" },
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">{data?.currency}</InputAdornment>,
                                        }}
                                        thousandSeparator
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        allowLeadingZeros={true}
                                        allowNegative={false}
                                        customInput={TextField}
                                        onValueChange={(values: any) => {
                                            handleChangeVerifyPaymentAmount(values)
                                        }}
                                    />
                                </Box>
                            </Box>

                            <SlipUpload slips={data?.slips} slipUploadPath={paymentUploadPath} setSlipUploadPath={setPaymentUploadPath} setOpenBackdrop={setOpenBackdrop} />
                        </>
                    )

                }
                <form onSubmit={handleSubmit(handleChangeStatus)}>
                    <Box sx={{ minHeight: "10rem" }}>
                        <ReactQuill
                            data-testid="billingnote-billingchangestatus-status-reactquill"
                            style={{ height: "6.5rem" }}
                            theme='snow'
                            value={editorContent}
                            onChange={onEditorStateChange}
                        />
                    </Box>
                    {
                        statusCase() == 1 && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <RadioButtonStatusType
                                    setStatusType={setStatusType}
                                    setPaidValue={setPaidValue}
                                    statusCase={statusCase}
                                    id={data.id}
                                    customerId={data.customer_id}
                                    setTotalCredit={setTotalCredit}
                                    creditActive={totalCredit <= 0 ? false : true}
                                    setCheckCurrency={setCheckCurrency}
                                    currencyList={currencyList}
                                    setSelectCurrency={setSelectCurrency}

                                />
                                {statusType === Status.money_transfer && selectCurrency && (
                                    <FormControl sx={{ width: "48%" }}>
                                        <InputLabel size='small' id="currency-label">{t('billing.currency')}</InputLabel>
                                        <Select
                                            data-testid="billingnote-billingchangestatus-currency-select"
                                            labelId="currency-label"
                                            id="currency"
                                            value={selectCurrency}
                                            label={t('billing.currency')}
                                            {...register('currency', {
                                                required: {
                                                    value: true,
                                                    message: `Currency ${ValidateMessage.required}`,
                                                },
                                            })}
                                            onChange={handleChangeCurrency}
                                            size='small'
                                        >
                                            {
                                                currencyList.map((currency: any) => <MenuItem key={`CurencyId ${currency.currency_id}`} value={currency.currency_id}>{currency.currency_name}</MenuItem>)
                                            }
                                        </Select>
                                        <FormHelperText
                                            id="currency"
                                            sx={{ color: "red" }}
                                        >
                                            {errors?.["currency"]?.message as string}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                                <NumericFormat
                                    data-testid="billingnote-billingchangestatus-amount-text"
                                    id="paid-value" label={t('billing.amount')}
                                    value={paidValue || ""}
                                    {...register('otherValue', {
                                        required: {
                                            value: true,
                                            message: t(`error.otherValue`),
                                        },
                                        min: {
                                            value: Money.min_pay,
                                            message: `${t('error.min-payment')} 0 ${t('billing.baht')}`
                                        },
                                        max: {
                                            value: statusType === Status.credit_accumulation ? totalCredit : Money.Trillion,
                                            message: statusType === Status.credit_accumulation ? `${t('error.max-partial-paid')} ${formatNumber(totalCredit)} ${t('billing.usdt')}` : `${t('error.max-partial-paid')} ${formatNumber(Money.Trillion)}  ${checkCurrency === CurrencyType.FIAT ? data.fiat_currency_name : t('billing.usdt')}`
                                        }

                                    })}
                                    InputProps={statusType === Status.credit_accumulation ? {
                                        endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
                                    } : {}}
                                    placeholder={t('billing.amount')} variant="standard"
                                    fullWidth
                                    autoFocus
                                    error={errors.otherValue?.message ? true : false}
                                    helperText={errors.otherValue?.message as string}
                                    inputProps={{ maxLength: 19 }}
                                    thousandSeparator
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    allowLeadingZeros={true}
                                    customInput={TextField}
                                    onValueChange={(values: any) => {
                                        validateNumber(values, 'otherValue')
                                    }}
                                />
                                <Typography variant="h4" component="h2" fontSize={"0.75rem"} sx={{ mt: -1.5 }} color={'dimgrey'}> {`${t('billing.credit-accumulation')} : ${formatNumber(totalCredit)} ${t('billing.usdt')}`}</Typography>
                            </Box>
                        )
                    }
                    {
                        statusCase() == 2 && (
                            <Box sx={{ display: "flex", gap: "1.25rem", flexDirection: "column", width: "100%" }}>
                                <RadioButtonStatusType
                                    setStatusType={setStatusType}
                                    statusCase={statusCase}
                                    creditActive={true}
                                    setCheckCurrency={setCheckCurrency}
                                    currencyList={currencyList}
                                    setSelectCurrency={setSelectCurrency}
                                />
                                {statusType === Status.money_transfer && (
                                    <FormControl sx={{ width: "48%" }}>
                                        <InputLabel size='small' id="currency-label">{t('billing.currency')}</InputLabel>
                                        <Select
                                            data-testid="billingnote-billingchangestatus-currency-select"
                                            labelId="currency-label"
                                            id="currency"
                                            value={selectCurrency}
                                            label={t('billing.currency')}
                                            {...register('currency', {
                                                required: {
                                                    value: true,
                                                    message: `Currency ${ValidateMessage.required}`,
                                                },
                                            })}
                                            onChange={handleChangeCurrency}
                                            size='small'
                                        >
                                            {
                                                currencyList.map((currency: any) => <MenuItem key={`CurencyId ${currency.currency_id}`} value={currency.currency_id}>{currency.currency_name}</MenuItem>)
                                            }
                                        </Select>
                                        <FormHelperText
                                            id="currency"
                                            sx={{ color: "red" }}
                                        >
                                            {errors?.["currency"]?.message as string}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                                <Box sx={{ display: "flex", alignItems: "end", gap: 2, flexDirection: "row", width: "100%" }}>
                                    <FormControl sx={{ width: "50%" }}>
                                        <InputLabel size='small' id="reason-label">{t('billing.cause')}</InputLabel>
                                        <Select
                                            data-testid="billingnote-billingchangestatus-cause-select"
                                            labelId="reason-label"
                                            id="reason"
                                            value={reason}
                                            label="สาเหตุ"
                                            {...register('reason', {
                                                required: {
                                                    value: true,
                                                    message: t("error.reason"),
                                                },
                                            })}
                                            onChange={handleChangeReason}
                                            size='small'
                                            required
                                            error={errors.reason?.message ? true : false}
                                        // helperText={errors.reason?.message as string}
                                        >
                                            {
                                                reasons.map(reason => <MenuItem key={reason} value={reason}>{t(`billing.${reason}`)}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                    <NumericFormat
                                        data-testid="billingnote-billingchangestatus-amount-text"
                                        sx={{ width: "50%" }} id="paid-value"
                                        label={t('billing.amount')}
                                        value={paidValue || ""}
                                        {...register('otherValue', {
                                            required: {
                                                value: true,
                                                message: t(`error.otherValue`),
                                            },
                                            min: {
                                                value: Money.min_pay,
                                                message: `${t('error.min-payment')} 0  ${checkCurrency === CurrencyType.FIAT ? data.fiat_currency_name : t('billing.usdt')}`
                                            },
                                            max: {
                                                value: switchTotalPayment() > 0 ? switchTotalPayment() : switchTotalPayment() * -1,
                                                message: `${t('error.max-partial-paid')} ${switchTotalPayment() > 0 ? formatNumber(switchTotalPayment()) : formatNumber(switchTotalPayment() * -1)} ${checkCurrency === CurrencyType.FIAT ? data.fiat_currency_name : t('billing.usdt')}`
                                            }
                                        })}
                                        InputProps={statusType === Status.credit_accumulation ? {
                                            endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
                                        } : {}}
                                        placeholder={t('billing.amount')}
                                        variant="standard"
                                        error={errors.otherValue?.message ? true : false}
                                        helperText={errors.otherValue?.message as string}
                                        inputProps={{ maxLength: 19 }}
                                        thousandSeparator
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        allowLeadingZeros={true}
                                        customInput={TextField}
                                        onValueChange={(values: any) => {
                                            validateNumber(values, 'otherValue')
                                        }}
                                    />
                                </Box>
                            </Box>
                        )
                    }
                    {
                        statusCase() == 3 && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <RadioButtonStatusType
                                    setStatusType={setStatusType}
                                    statusCase={statusCase}
                                    id={data.id}
                                    customerId={data.customer_id}
                                    setTotalCredit={setTotalCredit}
                                    setPaidValue={setPaidValue}
                                    overduePrice={data.overdue_price * -1}
                                    creditActive={totalCredit < data.overdue_price_crypto * -1 ? false : true}
                                    setCheckCurrency={setCheckCurrency}
                                    currencyList={currencyList}
                                    setSelectCurrency={setSelectCurrency}
                                    switchDefaultPaid={switchDefaultPaid}
                                />

                                {statusType === Status.money_transfer && selectCurrency && (
                                    <FormControl sx={{ width: "48%" }}>
                                        <InputLabel size='small' id="currency-label">{t('billing.currency')}</InputLabel>
                                        <Select
                                            data-testid="billingnote-billingchangestatus-currency-select"
                                            labelId="currency-label"
                                            id="currency"
                                            value={selectCurrency}
                                            label={t('billing.currency')}
                                            {...register('currency', {
                                                required: {
                                                    value: true,
                                                    message: `Currency ${ValidateMessage.required}`,
                                                },
                                            })}
                                            onChange={handleChangeCurrency}
                                            size='small'
                                        >
                                            {
                                                currencyList.map((currency: any) => <MenuItem key={`CurencyId ${currency.currency_id}`} value={currency.currency_id}>{currency.currency_name}</MenuItem>)
                                            }
                                        </Select>
                                        <FormHelperText
                                            id="currency"
                                            sx={{ color: "red" }}
                                        >
                                            {errors?.["currency"]?.message as string}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                                {data && (
                                    <NumericFormat
                                        data-testid="billingnote-billingchangestatus-amount-text"
                                        id="paid-value"
                                        label={t('billing.amount')}
                                        value={statusType === Status.credit_accumulation ? (data.overdue_price_crypto * -1).toFixed(2) : paidValue || ""}
                                        InputProps={{
                                            readOnly: statusType === Status.credit_accumulation,
                                            endAdornment: statusType === Status.credit_accumulation ? (
                                                <InputAdornment position="end">USDT</InputAdornment>
                                            ) : null,
                                        }}
                                        {...register('paidValue', {
                                            required: {
                                                value: statusType === Status.credit_accumulation ? false : true,
                                                message: t("error.paidValue"),
                                            },
                                            min: {
                                                value: switchOverduePrice() === 0 ? 0.01 : switchOverduePrice() * -1,
                                                message: `${t('error.paid')} ${switchOverduePrice() === 0 ? 0.01 : formatNumber(switchOverduePrice() * -1)} ${checkCurrency === CurrencyType.FIAT ? data.fiat_currency_name : t('billing.usdt')}`
                                            },
                                        })}
                                        placeholder={(switchOverduePrice() * -1).toString()}
                                        variant="standard"
                                        error={errors.paidValue?.message ? true : false}
                                        helperText={errors.paidValue?.message as string}
                                        fullWidth
                                        autoFocus
                                        inputProps={{ maxLength: 19 }}
                                        thousandSeparator
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        allowLeadingZeros={true}
                                        customInput={TextField}
                                        onValueChange={(values: any) => {
                                            validateNumberPaid(values, 'paidValue')
                                        }}
                                    />
                                )}
                                <Typography variant="h4" component="h2" fontSize={"0.75rem"} sx={{ mt: -1.5 }} color={'dimgrey'}> {`${t('billing.credit-accumulation')} : ${formatNumber(totalCredit)} ${t('billing.usdt')}`}</Typography>
                            </Box>
                        )
                    }

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", my: 1 }}>
                        <Box>
                            <Button data-testid="billingnote-billingchangestatus-no-button" onClick={handleClose}>{t('modal.confirm-change-status-no')}</Button>
                            {
                                statusCase() == 5 ? (
                                    <Button data-testid="billingnote-billingchangestatus-yes-button" disabled={loading || !paidValue || paymentUploadPath.length == 0} sx={{ boxShadow: BoxShadowButton }} onClick={handleSubmitVerifyPayment} variant="contained">{t('modal.confirm-change-status-yes')}</Button>
                                ) : (
                                    <Button data-testid="billingnote-billingchangestatus-yes-button" disabled={loading} sx={{ boxShadow: BoxShadowButton }} type='submit' variant="contained">{t('modal.confirm-change-status-yes')}</Button>

                                )
                            }
                        </Box>
                    </Box>
                </form>
            </Box>
        </Modal >
    )
}

const formatNumber = (num: number) => {
    const myNum = numeral(Number(num))
    return myNum.format("0, 0.00")
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 444,
    maxHeight: '90vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 3,
};
