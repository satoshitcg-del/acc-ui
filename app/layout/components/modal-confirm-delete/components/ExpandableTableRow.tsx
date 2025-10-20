import { useState } from 'react'
import {
    TableRow,
    TableCell,
    IconButton,
} from '@mui/material'
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

import { alpha, styled } from '@mui/material/styles';

export const TableRowNotLine = styled(TableRow)(() => ({
    '& .MuiTableCell-root': {
        borderBottom: "none",
    },
}));

export const TableRowMinCell = styled(TableRow)(() => ({
    '& .MuiTableCell-root': {
        height: "4.5rem"
    },
}));



export const ExpandableTableRow = (props: any) => {
    const { children, expandComponent, ...otherProps } = props;
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <TableRowMinCell {...otherProps}>
                <TableCell padding="checkbox">
                    <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                {children}
            </TableRowMinCell>
            {isExpanded && (
                <>
                    {expandComponent}
                </>
            )}
        </>
    );
};