import React, { useState, useEffect } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { containsSpecialCharacters } from '@/core/utils';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import UserTagService from '@/services/UserTagService';
import { UserTagType } from '@/core/enum';
import { CircularProgress } from '@mui/material';
import { useAlertDialog } from '../alert-dialog/useAlertDialog';

interface Tag {
  id: string;
  name: string;
}

interface AutoCompleteMultipleUserTagProps {
  init?: Tag | null;
  handle: (tag: Tag | null) => void;
  dataLists: any[];
  selected: Tag | null;
  label: string;
  type?: string;
  dataTestId?: string;
}

const AutoCompleteMultipleUserTag: React.FC<AutoCompleteMultipleUserTagProps> = ({
  init,
  handle,
  dataLists,
  selected,
  label,
  type,
  dataTestId
}) => {
  const { t } = useTranslation();
  const { TranslateErrorCode } = useTranslateErrorCode();
  const { createUserTag, getUserTagList } = UserTagService();
  const filter = createFilterOptions<Tag>();
  const { alertError } = useAlertDialog();
  const [validateUserTag, setValidateUserTag] = useState({
    helperText: "",
    error: false,
  });

  const createNewUserTag = async (newValue: Tag | null) => {
    if (!newValue) {
      handle(null)
      return;
    }

    if (newValue.hasOwnProperty('inputValue')) {
      const inputValue = (newValue as any).inputValue;

      if (containsSpecialCharacters(inputValue)) {
        setValidateUserTag({
          helperText: t('validate.not-special-char-and-max255'),
          error: true,
        });
        return;
      } else {
        setValidateUserTag({
          helperText: "",
          error: false,
        });
      }

      try {
        const resp = await createUserTag(inputValue, type);
        handle({
          id: resp?.data?.id,
          name: inputValue,
        });
      } catch (error: any) {
        alertError(TranslateErrorCode(error.response.data.code));
      }
    } else {
      handle(newValue);
    }
  };

  const [openUserTagList, setOpenUserTagList] = React.useState(false);
  const [loadingList, setLoadingList] = React.useState(false);
  const [tagReferenceList, setTagReferenceList] = useState<Tag[]>(dataLists ?? []);
  const handleOpenUserTagList = async () => {
    try {
      setLoadingList(true);
      const res: any = await getUserTagList(UserTagType.TAG_REFERENCE);
      console.log('res', res.data);
      setTagReferenceList(res?.data);
      setOpenUserTagList(true);
    } catch (error: any) {
      alertError(TranslateErrorCode(error.response.data.code));
    } finally {
      setLoadingList(false);
    }
  };

  const handleCloseUserTagList = () => {
    setOpenUserTagList(false);
    setTagReferenceList([]);
  };

  return (
    <Autocomplete
      open={openUserTagList}
      onClose={handleCloseUserTagList}
      onOpen={handleOpenUserTagList}
      loading={loadingList}
      sx={{ width: "50%" }}
      freeSolo
      value={selected}
      onChange={(event, newValue: any) => {
        createNewUserTag(newValue)
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;

        // Filters selected items out of the option. Check if selected is present or not.
        const finalFiltered: any = filtered.filter(option =>
          !(selected && selected.id === option.id)
        );

        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          finalFiltered.push({
            inputValue,
            name: `Add "${inputValue}"`,
          });
        }

        return finalFiltered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id={`tags-outlined-${type}`}
      options={tagReferenceList}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => {
        if (typeof option === 'string') {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.name;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.name}
          </li>
        );
      }}
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

export default AutoCompleteMultipleUserTag;
