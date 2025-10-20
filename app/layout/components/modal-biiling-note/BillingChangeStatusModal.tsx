import React, { ChangeEvent, useEffect, useState } from 'react'
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, MenuItem, Select, FormLabel, RadioGroup, FormControlLabel, Radio, InputAdornment, FormHelperText } from '@mui/material'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { set, useForm } from 'react-hook-form';
import { GridRowModes, GridRowModesModel } from '@mui/x-data-grid';
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
import { CurrencyType, Money, Status, ValidateMessage } from '@/core/enum';
import { NumericFormat } from 'react-number-format';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';

interface ModalProps {
    openModal: boolean
    closeModal: () => void
    data: any
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void
    rowModesModel: any
    tempStatus: any
    triggerHandleSearch: boolean
    setTriggerHandleSearch: any
}

type Currency = {
    currency_id: string;
    currency_name: string;
    currency_type: string;
    total_amount?: string;
};

interface CurrencyItem {
    currency_type: string;
    currency_id: string;
}

export default function BillingChangeStatusModal(props: ModalProps) {
    const { t } = useTranslation()
    const { updateStatus, getCurrencyForUpdateStatus } = BillingService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { openModal, closeModal, data, setRowModesModel, rowModesModel, tempStatus, triggerHandleSearch, setTriggerHandleSearch } = props
    const { getCustomerInfo } = BillingService();
    const { alertError, alertSuccess } = useAlertDialog();

    const [loading, setLoading] = useState(false);
    const [lessValue, setLessValue] = useState(true);
    const [currencyList, setCurrencyList] = useState<Currency[]>([])
    const [selectCurrency, setSelectCurrency] = useState<string>("")
    const [currencyCredit, setCurrencyCredit] = useState<string>("")
    const [paidValue, setPaidValue] = useState<string>("")
    const [statusType, setStatusType] = useState<string>(Status.money_transfer)
    const [totalCredit, setTotalCredit] = useState<number>(0)
    const [checkCurrency, setCheckCurrency] = useState<string>(CurrencyType.FIAT)

    const handleChangeStatus = async (obj: any) => {
        try {
            setLoading(true)
            const body = {
                amount: Number(paidValue) || 0,
                status: tempStatus?.props?.value || data.invoice_status,
                note: obj.note || "",
                invoice_id: data.id,
                cause: obj.reason || "",
                payment_type: tempStatus?.props?.value === "PAID" || tempStatus?.props?.value === "PARTIALPAID" || data.invoice_status === "PARTIALPAID" || tempStatus?.props?.value === "REFUND" ? statusType : "",
                currency_id: tempStatus?.props?.value === "PAID" || tempStatus?.props?.value === "PARTIALPAID" || data.invoice_status === "PARTIALPAID" || tempStatus?.props?.value === "REFUND" ? (statusType === Status.money_transfer ? selectCurrency : currencyCredit) : undefined

            }

            if (tempStatus?.props?.value || data.invoice_status == "PARTIALPAID") {
                const response = await updateStatus(data?.id, body)
                alertSuccess(TranslateErrorCode(response.code));
                setTriggerHandleSearch(!triggerHandleSearch);
            }

        } catch (error: any) {
            console.error(error)
            setRowModesModel({
                ...rowModesModel,
                [data.id]: { mode: GridRowModes.View, ignoreModifications: true },
            });
            alertError(TranslateErrorCode(error.response.data.code)).then((result) => {
                if (result.isConfirmed) {
                    setTriggerHandleSearch(!triggerHandleSearch);
                }
            });
        } finally {
            closeModal()
            setLoading(false)
        }
    }

    const handleClose = () => {
        setRowModesModel({
            ...rowModesModel,
            [data.id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
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
            setValue('currency', defaultCurrencyToFiat.currency_id);
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
        if (newStatus == "PAID") {
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

        if (newStatus == "PARTIALPAID" || (data.invoice_status == "PARTIALPAID" && !newStatus)) {
            return 1
        }

        if (newStatus == "REFUND") {
            return 2
        }

        if (newStatus == "PAID") {
            return 3
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

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography variant="h6" component="h2" sx={{ py: 2 }}>{t('modal.confirm-change-status-title')}</Typography>
                <Typography variant="body1" component="h2" sx={{ pb: 2 }}>{t('modal.confirm-change-status-descript')}</Typography>
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
                                                message: `${t('error.max-partial-paid')} ${switchTotalPayment() > 0 ? switchTotalPayment() : switchTotalPayment() * -1} ${checkCurrency === CurrencyType.FIAT ? data.fiat_currency_name : t('billing.usdt')}`
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
                                statusCase() == 3 ? (
                                    <Button data-testid="billingnote-billingchangestatus-yes-button" disabled={loading} sx={{ boxShadow: BoxShadowButton }} type='submit' variant="contained">{t('modal.confirm-change-status-yes')}</Button>
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
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 3,
};
