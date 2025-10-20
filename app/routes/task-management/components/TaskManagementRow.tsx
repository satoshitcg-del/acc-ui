import {
    TableRow,
    TableCell,
    IconButton,
    Chip,
} from "@mui/material";
import { CreateData } from "..";
import IconTableSvg from "@/assets/svg/TableSvg";
import { formatDate } from "@/core/dateUtils";
import { CR_TICKET_PRIORITY } from "@/core/enum";

interface RowProps {
    row: ReturnType<typeof CreateData>;
    handleOpenEditTask: (id: string) => void;
    handleOpenModalDeleteCrticket: (id: string) => void;
    statusList: any;
    priorityList: any;
}

const TaskManagementRow = ({
    row,
    handleOpenEditTask,
    handleOpenModalDeleteCrticket,
    statusList,
    priorityList,
}: RowProps) => {
    return (
        <TableRow sx={{
            '&:nth-of-type(odd)': {
                backgroundColor: (theme) => theme.palette.action.hover,
            },
        }}>
            <TableCell align="center" sx={{ p: 1 }}>
                {row?.table_number}
            </TableCell>
            <TableCell
                align="center"
                onClick={() => handleOpenEditTask(row?._id)}
                sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    '&:hover': {
                        textDecoration: 'underline',
                        color: 'primary.main'
                    },
                    p: 1,
                }}
            >
                {row?.cr_no}
            </TableCell>
            <TableCell sx={{ p: 0 }} align="center">
                <Chip
                    label={priorityList.find((priority: any) => priority.id === row?.priority)?.name || '-'}
                    sx={{
                        bgcolor: priorityList.find((priority: any) => priority.id === row?.priority)?.color || 'default',
                        color: 'white',
                        minWidth: '80px'
                    }}
                    size="small"
                />
            </TableCell>
            <TableCell sx={{ p: 0 }} align="center">
                <Chip
                    label={statusList.find((status: any) => status.id === row?.status)?.name || '-'}
                    sx={{
                        bgcolor: statusList.find((status: any) => status.id === row?.status)?.color || 'default',
                        color: 'white',
                        minWidth: '80px',
                    }}
                    size="small"
                />
            </TableCell>
            <TableCell sx={{ p: 1 }} align="left">
                {row?.subject}
            </TableCell>
            <TableCell sx={{ p: 1 }} align="left">
                {row?.created_by}
            </TableCell>
            <TableCell sx={{ p: 1 }} align="right">
                {formatDate(row?.created_at)}
            </TableCell>
            <TableCell sx={{ p: 1 }} align="right">
                {formatDate(row?.due_data)}
            </TableCell>
            <TableCell sx={{ p: 1 }} align="left">
                {row?.assignee.join(", ")}
            </TableCell>
            <TableCell sx={{ p: 1 }} align="left">
                {row?.updated_by}
            </TableCell>
            <TableCell sx={{ p: 0, gap: 2 }} align="center">
                <IconButton
                    data-testid="customer-customertable-edit-button"
                    onClick={() => handleOpenEditTask(row?._id)}
                >
                    <IconTableSvg icon="edit" />
                </IconButton>
                <IconButton
                    data-testid="customer-customertable-delete-button"
                    onClick={() => handleOpenModalDeleteCrticket(row?._id)}
                >
                    <IconTableSvg icon="delete" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default TaskManagementRow;
