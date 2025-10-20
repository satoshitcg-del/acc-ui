import { useState } from 'react'
import {
    TableRow,
    TableCell,
    IconButton,
    Typography,
    styled,
    Box,
    Divider,
} from '@mui/material'
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { TableRowMinCell } from "../style/stylemui"

import { useTranslation } from "react-i18next";




export const ExpandableTableRow = (props: any) => {
    const { children, expandComponent, firstTableCell, ...otherProps } = props;
    const [isExpanded, setIsExpanded] = useState(false);
    const { t } = useTranslation();

    return (
        <>
            <TableRowMinCell {...otherProps}>
                <TableCell className='flex  items-center gap-2'>
                    <IconButton data-testid="product-management-expandabletablerow-row-button" onClick={() => setIsExpanded(!isExpanded)} sx={{ color: isExpanded ? 'DodgerBlue' : '' }}>
                        {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                    {firstTableCell ?
                        <>
                            {firstTableCell}
                        </>
                        : null
                    }
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