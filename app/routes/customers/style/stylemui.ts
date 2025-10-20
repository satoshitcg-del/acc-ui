import {
    Autocomplete,
    styled
} from '@mui/material'

export const AutocompleteSingle = styled(Autocomplete)(() => ({
    '& .MuiAutocomplete-root, & .MuiInputBase-root, & .MuiOutlinedInput-root': {
        maxHeight: "4rem",
    },
}));
