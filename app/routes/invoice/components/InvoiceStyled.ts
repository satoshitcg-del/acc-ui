import {
    Box,
    styled
} from '@mui/material'

export const BorderTableColor = styled(Box)(() => ({
    '& .MuiTableCell-root': {
        borderColor: 'red',
        borderStyle: '1px solid'
    },
}));