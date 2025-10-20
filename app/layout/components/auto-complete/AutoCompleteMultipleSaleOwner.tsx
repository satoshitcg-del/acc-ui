import React, { useState, useEffect } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import UserTagService from '@/services/UserTagService';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { CircularProgress } from '@mui/material';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';

interface Tag {
  id: string;
  full_name: string;
}

interface AutoCompleteMultipleSaleOwnerProps {
  init?: Tag | null;
  handle: (tags: Tag[]) => void;
  dataLists: any[];
  selected: Tag[];
  label: string;
  type?: string;
  dataTestId?: string;
}

const AutoCompleteMultipleSaleOwner: React.FC<AutoCompleteMultipleSaleOwnerProps> = ({
  init,
  handle,
  dataLists,
  selected,
  label,
  type,
  dataTestId
}) => {
  const { t } = useTranslation();
  const { alertError } = useAlertDialog();
  const [validateUserTag, setValidateUserTag] = useState({
    helperText: "",
    error: false,
  });

  const { getSaleOwnerList } = UserTagService()
  const { TranslateErrorCode } = useTranslateErrorCode()
  const [openOwnerList, setOpenOwnerList] = React.useState(false);
  const [loadingList, setLoadingList] = React.useState(false);
  const [saleOwnerList, setSaleOwnerList] = useState<Tag[]>(dataLists ?? []);
  const handleGetSaleOwnerList = async () => {
    try {
      setLoadingList(true);
      const res: any = await getSaleOwnerList();
      setSaleOwnerList(res?.data);
      setOpenOwnerList(true);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setLoadingList(false);
    }
  };

  const handleCloseSaleOwnerList = () => {
    setOpenOwnerList(false);
    setSaleOwnerList([])
  };
  return (
    <Autocomplete
      open={openOwnerList}
      onClose={handleCloseSaleOwnerList}
      onOpen={handleGetSaleOwnerList}
      loading={loadingList}
      multiple
      sx={{ width: "50%" }}
      filterSelectedOptions
      handleHomeEndKeys
      isOptionEqualToValue={(option, value) => option.id === value.id}
      id={`tags-outlined-${type}`}
      options={saleOwnerList}
      value={selected}
      getOptionLabel={(option: any) => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.full_name;
      }}
      onChange={(event, newValue: any) => {
        handle(newValue);
      }}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <li key={props.key} {...restProps}>
            {option.full_name}
          </li>
        );
      }}
      noOptionsText={t('placeholder.no-options')}
      renderInput={(params) => (
        <TextField
          {...params}
          data-testid={dataTestId}
          label={label}
          error={validateUserTag.error}
          helperText={validateUserTag.helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loadingList ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default AutoCompleteMultipleSaleOwner;
