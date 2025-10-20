import { Autocomplete, TextField } from "@mui/material"
import { ValidateMessage } from "@/core/enum";
import { t } from "i18next";

export default function AutoCompleteProduct(props: any) {
    const { formBundle, customersForSelect, customerID, handleCustomerID, type, register, errors } = props;

    return (
        <Autocomplete
            disabled={formBundle.id !== 1}
            id="combo-box-demo"
            sx={{ width: '48%' }}
            noOptionsText={t('placeholder.no-options')}
            options={customersForSelect || []}
            value={customersForSelect.find((customer: any) => customer.customer_id === customerID) || null}
            getOptionLabel={(option: any) => option.full_name ? `${option.full_name}  (${option.username})` : option.username || ''}
            onChange={(event, newValue) => {
                if (formBundle.id === 1) {
                    handleCustomerID(newValue?.customer_id);
                }
            }}
            renderInput={(params) => (
                <TextField
                    data-testid="customer-global-customer-autocomplete"
                    {...params}
                    label={t('placeholder.customer-name')}
                    variant="outlined"
                    {...register(`customerName${1}`, {
                        required: {
                            value: true,
                            message: t('validate.customer-require'),
                        },
                    })}
                    error={Boolean(errors?.[`customerName${1}`])}
                    helperText={errors[`customerName${1}`]?.message}
                />
            )}
        />
    );
}