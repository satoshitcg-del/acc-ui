import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useEffect } from "react";
import { containsSpecialCharacters } from "@/core/utils/index";
import { ValidateMessage } from "@/core/enum";
import { t } from "i18next";
// service
import PrefixService from "@/services/PrefixService";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { useAlertDialog } from "../alert-dialog/useAlertDialog";

const filter = createFilterOptions<PrefixsOptionType>();

export default function AutoCompletePrefixsCreatable(props: any) {
    const { index, handle } = props
    const { getPrefixList, createPrefix } = PrefixService();
    const { alertError } = useAlertDialog();
    const [value, setValue] = React.useState<PrefixsOptionType | null>(null);
    const [validatePrefix, setValidatePrefix] = React.useState({
        helperText: "",
        error: false,
    });
    let prefixsOps: PrefixsOptionType[] = [];
    const { TranslateErrorCode } = useTranslateErrorCode()

    useEffect(() => {
        fetchMyAPI();
        handle(index, value)
        return () => { prefixsOps = [] }
    }, [value]);

    async function fetchMyAPI() {
        try {
            const resp = await getPrefixList()
            const response = (resp.data as any[])
            for (const value of response) {
                prefixsOps.push({
                    prefix_id: value.product_link_name,
                    prefix_name: value.product_link_id
                })
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.message));
        }
    }

    const handleAddPrefix = async (newValue: any) => {
        try {
            if (typeof newValue === "string") {
                setValue({
                    prefix_id: newValue
                });
            } else if (newValue && newValue.inputValue) {
                if (containsSpecialCharacters(newValue.inputValue)) {
                    setValidatePrefix({
                        helperText: t(
                            `validate.${ValidateMessage.notIncludeSpecialCharatersAndMax255}`,
                        ),
                        error: true,
                    });
                    return;
                } else {
                    setValidatePrefix({
                        helperText: "",
                        error: false,
                    });
                }
                const resp = await createPrefix(newValue.inputValue)

                if (resp?.data?.prefix_id) {
                    // Push to original size
                    prefixsOps.push({
                        prefix_id: newValue.inputValue,
                        prefix_name: resp?.data?.prefix_id
                    });

                    // Create a new value from the user input
                    setValue({
                        prefix_id: newValue.inputValue
                    });
                } else {
                    setValue(null)
                }
            } else {
                setValue(newValue);
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.message));
        }
    }


    return (
        <Autocomplete
            value={value}
            onChange={(event, newValue: any) => {
                handleAddPrefix(newValue)
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                    (option) => inputValue === option.prefix_id
                );
                if (inputValue !== "" && !isExisting) {
                    filtered.push({
                        inputValue,
                        prefix_id: `Add "${inputValue}"`
                    });
                }

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={prefixsOps || []}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option.prefix_id;
            }}
            renderOption={(props, option) => <li {...props}>{option.prefix_id}</li>}
            sx={{ width: 300 }}
            freeSolo
            renderInput={(params) => {
                return (<TextField {...params}
                    data-testid="global-autocompleteprefixcreatetable-prefix-autocomplete"
                    label="Prefixs/Company" error={validatePrefix.error}
                    helperText={validatePrefix.helperText} />)
            }}
        />
    );
}

interface PrefixsOptionType {
    inputValue?: string;
    prefix_id: string;
    prefix_name?: string;
}