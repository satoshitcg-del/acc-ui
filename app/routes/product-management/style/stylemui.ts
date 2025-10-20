import {
    TableRow,
    TextField,
    styled
} from '@mui/material'

export const TableRowNotLine = styled(TableRow)(() => ({
    '& .MuiTableCell-root': {
        borderBottom: "none",
        borderTop: "none",
    },
    '& .MuiTableCell-root:last-child': {
        
    },
    '& .MuiTableCell-root:not(:last-child)': {
        
    },
}));

export const TableRowMinCell = styled(TableRow)(() => ({
    '& .MuiTableCell-root': {
        minHeight:"4.6rem"
    },

    '& .MuiTableCell-root:not(:last-child)': {
        
    },
}));

export const TextFieldUsdt = styled(TextField)(() => ({
    '& .MuiFormControl-root': {
        height: "2.5rem",      
    },

    '& .MuiInputBase-root': {
        maxWidth: "10rem",  
    },

    '& .MuiOutlinedInput-input' : {
        padding: "0.5rem 0rem 0.5rem 1rem"
    }
}));