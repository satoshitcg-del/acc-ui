import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import PrefixService from "@/services/PrefixService";

import { useTranslation } from "react-i18next";
import { IPrefixes } from "@/core/interface/services";
import { containsSpecialCharacters } from "@/core/utils/index"
import { ValidateMessage } from "@/core/enum";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { useAlertDialog } from "../alert-dialog/useAlertDialog";

interface PrefixsOptionType {
  inputValue?: string;
  product_link_id?: string;
  product_link_name?: string;
}


export default function AutoCompleteFormCreatePrefix(props: any) {
  const { formBundle, handle, prefixLists, selectPrefix, setSelectPrefix, fetchPrefixes } = props
  const { t } = useTranslation()
  const { createPrefix } = PrefixService();
  const filter = createFilterOptions<PrefixsOptionType>();

  const [tempPrefix, setTempPrefix] = useState<PrefixsOptionType[] | null>([]);

  const [validatePrefix, setValidatePrefix] = useState({
    helperText: "",
    error: false,
  });

  const { TranslateErrorCode } = useTranslateErrorCode()
  const { alertError } = useAlertDialog();

  const createTempPrefix = () => {

    let temp = prefixLists.map((prefix: IPrefixes, index: number) => {
      return { product_link_id: prefix.product_link_id, product_link_name: prefix.product_link_name }
    })
    setTempPrefix(temp)
  }

  const handleAddPrefix = async (newValue: any) => {
    if (newValue && newValue.inputValue) {
      try {
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
        handle(resp?.data?.id ?? "", formBundle.id, 'prefixes')
        setSelectPrefix({ product_link_id: resp?.data?.id, product_link_name: newValue.inputValue })
      } catch (error: any) {
        alertError(TranslateErrorCode(error.response.data.code));
      } finally {
        fetchPrefixes();
      }

    } else {
      handle(newValue?.product_link_id ?? "", formBundle.id, 'prefixes')
    }
  }

  useEffect(() => {
    createTempPrefix()
  }, [prefixLists])

  return (
    <Autocomplete
      disabled={formBundle.product_id ? false : true}
      sx={{ width: "48%" }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="Autocomplete-form-create"
      freeSolo
      value={selectPrefix || { product_link_id: "", product_link_name: "" }}
      options={tempPrefix as PrefixsOptionType[] || []}
      onChange={(event, newValue: any) => {
        handleAddPrefix(newValue)
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.product_link_name
        );

        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            product_link_name: `Add "${inputValue}"`
          });
        }

        return filtered;
      }}

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
        return option.product_link_name as string;
      }}
      renderOption={(props, option) => <li {...props}>{option.product_link_name}</li>}

      renderInput={(params) => {
        params.inputProps.onFocus = fetchPrefixes
        return (<TextField {...params}
          data-testid="global-autocompleteformcreateprefix-prefix-autocomplete" label={t("placeholder.prefix-company")} error={validatePrefix.error}
          helperText={validatePrefix.helperText} />)
      }}
    />
  );
};

