import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
// service
import PrefixService from "@/services/PrefixService";

import { useTranslation } from "react-i18next";
import { useFetchPrefixes } from "@/core/hooks";
import { containsSpecialCharacters } from "@/core/utils/index"
import { ValidateMessage } from "@/core/enum";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { useAlertDialog } from "../alert-dialog/useAlertDialog";

interface PrefixsOptionType {
  inputValue?: string;
  prefix_id?: string;
  prefix_name?: string;
}


export default function AutoCompleteCreatePrefixs(props: any) {
  const { init, handle } = props
  const { t } = useTranslation()
  const { createPrefix } = PrefixService();
  const filter = createFilterOptions<PrefixsOptionType>();

  let prefixsOps: PrefixsOptionType[] = [];
  const [value, setValue] = useState<PrefixsOptionType | null>(init ? init : null);
  const [prefixFetch, setPrefixFetch] = useState<PrefixsOptionType[] | null>([]);

  const { prefixes, fetchPrefixes } = useFetchPrefixes()
  const { alertError } = useAlertDialog();

  const [validatePrefix, setValidatePrefix] = useState({
    helperText: "",
    error: false,
  });

  const handleAddPrefix = async (newValue: any) => {
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

      try {
        const resp = await createPrefix(newValue.inputValue)
        if (resp?.data?.id) {
          prefixsOps.push({
            prefix_id: resp?.data?.id,
            prefix_name: newValue.inputValue,
          });
          setPrefixFetch(prefixsOps)
          setValue({
            prefix_id: resp?.data?.id,
            prefix_name: newValue.inputValue
          })
        }
      } catch (error: any) {
        alertError(TranslateErrorCode(error.response.data.code));
      }

    } else {
      setValue(newValue);
    }
  }

  const { TranslateErrorCode } = useTranslateErrorCode()
  useEffect(() => {
    fetchPrefixes()
    handle(value?.prefix_id ?? "", value?.prefix_name ?? "")
  }, [value])

  useEffect(() => {
    for (const value of prefixes) {
      prefixsOps.push({
        prefix_id: value.product_link_id,
        prefix_name: value.product_link_name
      })
    }
    setPrefixFetch(prefixsOps)
  }, [prefixes])

  return (
    <Autocomplete
      sx={{ width: "48%" }}
      value={value}
      onChange={async (event, newValue) => {
        handleAddPrefix(newValue)
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        const isExisting = options.some(
          (option) => inputValue === option.prefix_name
        );

        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            prefix_name: `Add "${inputValue}"`
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={prefixFetch as PrefixsOptionType[] || []}
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
        return option.prefix_name as string;
      }}
      isOptionEqualToValue={(option, value) => {
        if (!value || !option) return false;
        return option.prefix_id === value.prefix_id;
      }}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return <li key={option.prefix_id} {...restProps}>{option.prefix_name}</li>;
      }}
      freeSolo
      renderInput={(params) => {
        params.inputProps.onFocus = fetchPrefixes
        return (<TextField {...params} data-testid="global-autocompletecreateprefixs-prefix-autocomplete" label={t("placeholder.prefix-company")} error={validatePrefix.error} helperText={validatePrefix.helperText} />)
      }}
    />
  );
};

