import { Modal, Box, Typography, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, InputAdornment, FormControlLabel, RadioGroup, FormHelperText, Radio } from '@mui/material'

import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'
// service
import { useTranslation } from 'react-i18next'
import { CurrencyType, ONETIME_BILLING_STATUS, Status, ValidateMessage } from '@/core/enum'
import { reasons } from '@/layout/components/modal-biiling-note/BillingNoteData'
import { formatNumber } from '@/core/utils'
import { NumericFormat } from 'react-number-format'

interface ModalProps {
    openModal: boolean
    closeModal: () => void
    save: () => void
    walletType: string;
    handleChangeWalletType: (event: SelectChangeEvent) => void;
    walletAddress: string;
    handleChangeWalletAddress: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setNote: any;
    status: string
    currencyList: any[]
    statusType: string
    handleChangeStatusType: (type: string) => void
    currency: string
    handleChangeCurrency: (event: SelectChangeEvent) => void
    paidValue: any
    handleChangePaid: (value: number) => void
    reason: string;
    handleChangeReason: (event: SelectChangeEvent) => void;
    userCredit: number;
    totalPrice: number;
    validatePaidValue: boolean;
    validateWalletType: boolean;
    validateWalletAddress: boolean;

}

export default function OneTimeNotedModal(props: ModalProps) {
    const { t } = useTranslation()
    const {
        openModal,
        closeModal,
        save,
        walletType,
        handleChangeWalletType,
        walletAddress,
        handleChangeWalletAddress,
        setNote,
        status,
        currencyList,
        statusType,
        handleChangeStatusType,
        currency,
        handleChangeCurrency,
        paidValue,
        handleChangePaid,
        reason,
        handleChangeReason,
        userCredit,
        totalPrice,
        validatePaidValue,
        validateWalletType,
        validateWalletAddress,

    } = props
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({})
    const editorContent = watch("note");

    useEffect(() => {
        register("note");
    }, [register])

    const onEditorStateChange = (editorState: string) => {
        setNote(editorState)
        setValue("note", editorState);
    };
    const walletTypeList = ["ERC20", "TRON"]

    return (
        <Modal
            open={openModal}
            onClose={closeModal}
        >
            <Box sx={style}>
                <form onSubmit={handleSubmit(save)}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" component="h2" sx={{ py: 2 }}>{t('billing.header-note')}</Typography>
                        {status === ONETIME_BILLING_STATUS.APPROVED &&
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "start", width: "100%", pb: 2 }} >
                                <Typography>{t('modal.payment')}</Typography>
                                <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "start", width: "100%" }}>
                                    <FormControl size="small" fullWidth error={validateWalletType}>
                                        <InputLabel id="task-wallet-type-label">{t('placeholder.wallet-type')}</InputLabel>
                                        <Select
                                            labelId="task-wallet-type-label"
                                            id="task-wallet-type"
                                            value={walletType || ''}
                                            label={t('placeholder.wallet-type')}
                                            onChange={(event) => {
                                                handleChangeWalletType(event);
                                            }}
                                            error={validateWalletType}

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
                                        {validateWalletType &&
                                            <FormHelperText>{t('validate.wallet-type-require')}</FormHelperText>
                                        }
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        id="task-wallet-address"
                                        placeholder={t('placeholder.wallet-address')}
                                        variant="outlined"
                                        size='small'
                                        value={walletAddress}
                                        onChange={handleChangeWalletAddress}
                                        error={validateWalletAddress}
                                        helperText={validateWalletAddress && t('validate.wallet-address-require')}
                                    />
                                </Box>
                            </Box>
                        }
                        <Box sx={{ minHeight: "10rem" }}>
                            <ReactQuill
                                data-testid="billingnote-billingnotemodal-notes-reactquill"
                                style={{ height: "6.5rem" }}
                                theme='snow'
                                value={editorContent}
                                onChange={onEditorStateChange}
                            />
                        </Box>
                        {(status === ONETIME_BILLING_STATUS.PAID || status === ONETIME_BILLING_STATUS.REFUNDED) &&
                            <Box sx={{ display: "flex", gap: "1.25rem", flexDirection: "column", width: "100%" }}>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-labelledby="row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        sx={{ gap: "1.5rem" }}
                                        data-testid="billingglobal-billingchangestatustype-type-radiogroup"
                                        defaultValue={Status.money_transfer}
                                    >
                                        <FormControlLabel
                                            value={Status.money_transfer}
                                            control={<Radio data-testid={`billingglobal-billingchangestatustype-type-radiogroup-${Status.money_transfer.toLowerCase()}`} />}
                                            label={t('billing.money-transfer')}
                                            onClick={(event) => handleChangeStatusType((event.target as HTMLInputElement).value)}
                                        />
                                        <FormControlLabel
                                            value={Status.credit_accumulation}
                                            control={<Radio data-testid={`billingglobal-billingchangestatustype-type-radiogroup-${Status.credit_accumulation.toLowerCase()}`} />}
                                            label={t('billing.credit-accumulation')}
                                            onClick={(event) => handleChangeStatusType((event.target as HTMLInputElement).value)}
                                        />
                                    </RadioGroup>
                                </FormControl>
                                {statusType === Status.money_transfer &&
                                    <FormControl sx={{ width: "48%" }}>
                                        <InputLabel size='small' id="currency-label">{t('billing.currency')}</InputLabel>
                                        <Select
                                            data-testid="billingnote-billingchangestatus-currency-select"
                                            labelId="currency-label"
                                            id="currency"
                                            value={currency}
                                            label={t('billing.currency')}
                                            size='small'
                                            onChange={handleChangeCurrency}
                                        >
                                            {currencyList.map((currency: any) => {
                                                return <MenuItem key={currency.currency_id} value={currency.currency_id}>{currency.currency_name}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                }
                                <Box sx={{ display: "flex", gap: 2, flexDirection: "row", width: "100%" }}>
                                    {status === ONETIME_BILLING_STATUS.REFUNDED ? (
                                        <>
                                            <FormControl sx={{ width: "50%", mt: 0.6 }}>
                                                <InputLabel size='small' id="reason-label">{t('billing.cause')}</InputLabel>
                                                <Select
                                                    data-testid="billingnote-billingchangestatus-cause-select"
                                                    labelId="reason-label"
                                                    id="reason"
                                                    value={reason}
                                                    label="สาเหตุ"
                                                    onChange={handleChangeReason}
                                                    size='small'
                                                    required
                                                >
                                                    {reasons.map(reason => {
                                                        return <MenuItem key={reason} value={reason}>{t(`billing.${reason}`)}</MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>
                                            <NumericFormat
                                                data-testid="billingnote-billingchangestatus-amount-text"
                                                sx={{ width: "50%" }}
                                                id="paid-value"
                                                label={t('billing.amount')}
                                                placeholder={t('billing.amount')}
                                                variant="standard"
                                                size='small'
                                                autoFocus
                                                required
                                                value={paidValue || ""}
                                                {...register("price", {})}
                                                error={validatePaidValue ? true : false}
                                                helperText={!validatePaidValue || `${t('error.invalid-payment')} ${formatNumber(totalPrice)}`}
                                                inputProps={{ maxLength: 19 }}
                                                thousandSeparator
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                allowLeadingZeros={true}
                                                customInput={TextField}
                                                onValueChange={(values: any) => {
                                                    let numericValue = values?.floatValue ?? 0;
                                                    handleChangePaid(!isNaN(numericValue) ? numericValue : 0)
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <NumericFormat
                                            data-testid="billingnote-billingchangestatus-amount-text"
                                            sx={{ width: "100%" }}
                                            autoComplete="price-product"
                                            id="paid-value"
                                            placeholder={t('billing.amount')}
                                            variant="standard"
                                            size='small'
                                            autoFocus
                                            value={paidValue || ""}
                                            {...register("price", {})}
                                            error={validatePaidValue ? true : false}
                                            helperText={!validatePaidValue || `${t('error.invalid-payment')} ${formatNumber(totalPrice)}`}
                                            inputProps={{ maxLength: 19 }}
                                            thousandSeparator
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            allowLeadingZeros={true}
                                            customInput={TextField}
                                            onValueChange={(values: any) => {
                                                let numericValue = values?.floatValue ?? 0;
                                                handleChangePaid(!isNaN(numericValue) ? numericValue : 0)
                                            }}
                                        />
                                    )}
                                </Box>
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    fontSize={"0.75rem"}
                                    sx={{ mt: -1.5 }}
                                    color={'dimgrey'}
                                >
                                    {`${t('billing.credit-accumulation')} : ${formatNumber(userCredit)} ${t('billing.usdt')}`}
                                </Typography>
                            </Box>
                        }
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", mb: 2 }}>
                        <Box>
                            <Button data-testid="billingnote-billingnotemodal-cancel-button" onClick={closeModal} children={t('billing.cancel')} sx={{ fontWeight: 500, letterSpacing: "0.4px" }} />
                            <Button data-testid="billingnote-billingnotemodal-save-button" disabled={loading} type='submit' children={t('billing.save')} sx={{ fontWeight: 500, letterSpacing: "0.4px" }} />
                        </Box>
                    </Box>
                </form >
            </Box >
        </Modal >
    )
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 3,
};
