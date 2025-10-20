import {
    Autocomplete,
    styled
} from '@mui/material'

export const AutocompleteSingle = styled(Autocomplete)(() => ({
    '& .MuiAutocomplete-root, & .MuiInputBase-root, & .MuiOutlinedInput-root': {
        maxHeight: "4rem",
    },
}));


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};