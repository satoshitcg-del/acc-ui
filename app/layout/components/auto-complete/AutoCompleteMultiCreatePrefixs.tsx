import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import PrefixService from "@/services/PrefixService";

import { useTranslation } from "react-i18next";
import { useFetchPrefixes } from "@/core/hooks";
import { IPrefixes } from "@/core/interface/services";
import { ValidateMessage } from "@/core/enum";
import { containsSpecialCharacters } from "@/core/utils/index"
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import { useAlertDialog } from "../alert-dialog/useAlertDialog";

interface PrefixsOptionType {
  inputValue?: string;
  product_link_id?: string;
  product_link_name?: string;
}

export default function AutoCompleteMultiCreatePrefixs(props: any) {
  const { init, handle, prefixLists, selectPrefix, minHight, width } = props;
  const { t } = useTranslation();
  const { createPrefix } = PrefixService();
  const { TranslateErrorCode } = useTranslateErrorCode()
  const filter = createFilterOptions<PrefixsOptionType>();
  const [tempPrefix, setTempPrefix] = useState<PrefixsOptionType[] | null>([]);
  const { fetchPrefixes } = useFetchPrefixes();
  const { alertError } = useAlertDialog();
  const [validatePrefix, setValidatePrefix] = useState({
    helperText: "",
    error: false,
  });

  const createTempPrefix = () => {
    let temp = prefixLists.map((prefix: IPrefixes, index: number) => {
      return {
        product_link_id: prefix.product_link_id,
        product_link_name: prefix.product_link_name,
      };
    });
    setTempPrefix(temp);
  };

  useEffect(() => {
    createTempPrefix();
  }, [prefixLists]);

  const createNewPrefix = async (newValue: any) => {
    if (newValue.length > 20) {
      setValidatePrefix({
        helperText: t(
          `validate.${ValidateMessage.MAX_PREFIXES_ERROR_MESSAGE}`,
        ),
        error: true,
      });
      return;
    }

    const objectsWithInputValue = newValue.filter((obj: PrefixsOptionType) =>
      obj.hasOwnProperty("inputValue"),
    );

    if (newValue && objectsWithInputValue.length !== 0) {
      try {

        const inputValue = objectsWithInputValue[0].inputValue;
        if (containsSpecialCharacters(inputValue)) {
          // Show an error or handle it as needed
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
        const filteredArray = newValue.filter((obj: PrefixsOptionType) =>
          obj.hasOwnProperty("product_link_id"),
        );
        const resp = await createPrefix(
          objectsWithInputValue[0].inputValue,
        );

        handle([
          ...filteredArray,
          {
            product_link_id: resp?.data?.id,
            product_link_name: objectsWithInputValue[0].inputValue,
          },
        ]);
      } catch (error: any) {
        alertError(TranslateErrorCode(error.response.data.code));
      }
    } else {
      handle(newValue);
    }
  };

  return (
    <>
      <Autocomplete
        sx={{ width: width ? width : null }}
        multiple
        freeSolo
        filterSelectedOptions
        handleHomeEndKeys
        isOptionEqualToValue={(option, value) => option.value === tempPrefix}
        id="tags-outlined"
        disableListWrap={false}
        options={tempPrefix as PrefixsOptionType[] || []}
        value={selectPrefix}
        onChange={(event, newValue: any) => {
          createNewPrefix(newValue);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value

          const isExisting = options.some(
            (option) => inputValue === option.product_link_name,
          );

          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              product_link_name: `Add "${inputValue}"`,
            });
          }

          return filtered;
        }}
        getOptionLabel={(option) => {
          if (typeof option === "string") return option;
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            // console.log("if (option.inputValue) { ACTIVE");

            return option.inputValue;
          }
          // Regular option
          return option.product_link_name as string;
        }}
        renderOption={(props, option) => (
          <li {...props}>{option.product_link_name}</li>
        )}
        renderInput={(params) => {
          params.inputProps.onFocus = fetchPrefixes;
          return (
            <TextField
              {...params}
              data-testid="global-autocompletemulticreateprefixs-prefix-autocomplete"
              label={t("placeholder.prefix-company")}
              error={validatePrefix.error}
              helperText={validatePrefix.helperText}
            />
          );
        }}
      />
    </>
  );
}
