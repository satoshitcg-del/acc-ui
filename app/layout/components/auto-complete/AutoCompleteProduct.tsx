import { Autocomplete, TextField } from "@mui/material"
import { ValidateMessage } from "@/core/enum";
import { t } from "i18next";

export default function AutoCompleteProduct(props: any) {
    const { formBundle, products, handle, register, errors } = props;

    return (
        <Autocomplete
            id="combo-box-demo"
            sx={{ width: '48%' }}
            noOptionsText={t('placeholder.no-options')}
            options={products || []}
            getOptionLabel={(option: any) => option.product_name}
            onChange={(event, newValue) => {
                const selectedId = newValue?.id ?? '';
                const selectedType = newValue?.type ?? '';
                handle(selectedId, formBundle.id, 'product_id', selectedType);
            }}
            renderInput={(params) => (
                <>
                    <TextField
                        data-testid="customer-global-product-autocomplete"
                        {...params}
                        label={t('placeholder.product-name')}
                        variant="outlined"
                        {...register(`productname${formBundle.id}`, {
                            required: {
                                value: true,
                                message: t('validate.product-require'),
                            },
                        })}
                        error={Boolean(errors[`productname${formBundle.id}`])}
                        helperText={errors[`productname${formBundle.id}`]?.message}

                    // required={type == AccountType.Product ? true : false}
                    />
                </>
            )}
        />
    );
}