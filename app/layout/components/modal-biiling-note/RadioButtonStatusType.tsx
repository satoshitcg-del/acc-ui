import { CurrencyType, Status } from "@/core/enum";
import BillingService from "@/services/BillingService";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { t } from "i18next";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { useAlertDialog } from "../alert-dialog/useAlertDialog";



export default function radioButtonStatusType(props: any) {
    const { setStatusType, statusCase, id, customerId, setTotalCredit, setPaidValue, overduePrice, creditActive, setCheckCurrency, currencyList,
        setSelectCurrency, switchDefaultPaid } = props
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { getCustomerInfo } = BillingService();
    const { alertError } = useAlertDialog();

    const handleChangeStatusType = (type: string) => {
        if (type !== undefined) {
            if (type === Status.credit_accumulation) {
                setCheckCurrency(CurrencyType.CRYPTO)
                if (statusCase() === 3) switchDefaultPaid(CurrencyType.CRYPTO)
            }
            else {
                const selectedCurrency = currencyList.find((currency: any) => currency.currency_type.toUpperCase().includes('FIAT'))?.currency_id || '';
                setSelectCurrency(selectedCurrency);
                setCheckCurrency(CurrencyType.FIAT)
                if (statusCase() === 3) switchDefaultPaid(CurrencyType.FIAT)
            }
            setStatusType(type);
            checkStatusType(type)
        }
    };

    const checkStatusType = async (type: string) => {
        if (statusCase() !== 2 && type === Status.credit_accumulation) {
            try {
                const res = await getCustomerInfo(id, customerId);
                setTotalCredit(res.data.total_credit_usdt);
            } catch (error: any) {
                alertError(TranslateErrorCode(error.response?.data?.code));
            }
        }
    };

    return (
        <FormControl>
            <RadioGroup
                row
                aria-labelledby="row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ gap: "1.5rem" }}
                defaultValue={Status.money_transfer}
                data-testid="billingglobal-billingchangestatustype-type-radiogroup"
            >
                <FormControlLabel
                    value={Status.money_transfer}
                    control={<Radio data-testid={`billingglobal-billingchangestatustype-type-radiogroup-${Status.money_transfer.toLowerCase()}`} />}
                    label={t('billing.money-transfer')}
                    onClick={(event) => handleChangeStatusType((event.target as HTMLInputElement).value)} />
                <FormControlLabel
                    disabled={!creditActive ? true : false}
                    value={Status.credit_accumulation}
                    control={<Radio data-testid={`billingglobal-billingchangestatustype-type-radiogroup-${Status.credit_accumulation.toLowerCase()}`} />}
                    label={t('billing.credit-accumulation')}
                    onClick={(event) => handleChangeStatusType((event.target as HTMLInputElement).value)} />
            </RadioGroup>
        </FormControl>
    )
}


