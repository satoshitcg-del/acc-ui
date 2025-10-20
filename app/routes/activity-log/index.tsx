import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageEffect } from '@/core/page';
// MUI
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
// Component
import Loading from '@/layout/components/loading/Loading';
import EmptyTable from '@/layout/components/table/EmptyTable';
import PaginationMedium from "../pagination/Pagination";
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
// Hooks
import { useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useCustomerSearchStore } from '@/core/storerecoil/useCustomerSearchStore';
// Types
import { ColumnActivity } from './ActivityProps';
// Utils
import { formatDate } from '@/core/dateUtils';
import EmployeeService from '@/services/EmployeeService';
import { useProfileStore } from '@/core/storerecoil/useProfileStore';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ActivityLogService from '@/services/ActivityLogService';

const employeeColumns: readonly ColumnActivity[] = [
    { columnId: "id", label: "number", minWidth: 50, width: 50, align: "center" },
    { columnId: "username", label: "username", minWidth: 100, align: "center" },
    { columnId: "method", label: "method", minWidth: 100, align: "center" },
    { columnId: "path", label: "path", minWidth: 100, align: "center" },
    { columnId: "type", label: "type", minWidth: 100, align: "center" },
    { columnId: "message", label: "message", minWidth: 100, align: "center" },
    { columnId: "createAt", label: "create-at", minWidth: 160, align: "center", bodyAlign: "right" },
];

export default function Component() {
    const { t } = useTranslation()
    let title = t("title.activity-log");
    usePageEffect({ title });

    const { getActivityLogs } = ActivityLogService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();
    const { resetSearchCustomer } = useCustomerSearchStore();
    const [activities, setActivities] = useState<any[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [filterSearchTable, setFilterSearchTable] = useState({ username: '', startDate: '', endDate: '' });
    // Pagination controller
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [page, setPage] = useState(1);
    const [pageAmount, setPageAmount] = useState({ count_data: 0, count_page: 0, row_amount: 0 });
    const { profile } = useProfileStore();

    const handleClearFilterSearchTable = () => {
        setFilterSearchTable({ username: '', startDate: '', endDate: '' });
    }

    const handleFilterSearchTable = () => {
        setPage(1);
        handleSearch();
    }

    useEffect(() => {
        handleSearch();
    }, [page, rowsPerPage]);

    const handleSearch = async () => {
        try {
            setLoading(true);
            const body = {
                username: filterSearchTable.username,
                start_date: filterSearchTable.startDate,
                end_date: filterSearchTable.endDate,
                page: page,
                limit: rowsPerPage,
            }
            const res = await getActivityLogs(body);
            setActivities(res?.data?.activity_log || []);
            setPageAmount({
                ...pageAmount,
                count_data: res?.data?.count_data,
                count_page: res?.data?.count_page,
                row_amount: res?.data?.activity_log?.length,
            });
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleSearch()
        resetSearchCustomer()
    }, [])

    useEffect(() => {
        routeGuards();
    }, [profile]);
    const navigate = useNavigate()

    const routeGuards = () => {
        if (profile && profile?.username !== "superadmin") {
            navigate("/");
        }
    }

    function createActivityRows(data: any, index: number) {
        return {
            id: <Typography align={'center'} variant="body2">{index}</Typography>,
            username: <Typography align={data?.username || "center"} variant="body2">{data?.username || '-'}</Typography>,
            method: <Typography align={data?.method || "center"} variant="body2">{data?.method || '-'}</Typography>,
            path: <Typography align={data?.path || "center"} variant="body2">{data?.path || '-'}</Typography>,
            type: <Typography align={data?.type || "center"} variant="body2">{data?.type || '-'}</Typography>,
            message: <Typography align={data?.message || "center"} variant="body2">{data?.message || '-'}</Typography>,
            createAt: <Typography align={data?.create_at ? 'right' : 'center'} variant="body2">{formatDate(data?.create_at) || '-'}</Typography>,
        };
    }


    const handleStartDateSearch = (start_date: any) => {
        if (!start_date) return;
        const openingDateObject = dayjs(start_date);

        if (!openingDateObject.isValid()) return;
        setFilterSearchTable({
            ...filterSearchTable,
            startDate: openingDateObject.toISOString(),
        });
    }

    const handleEndDateSearch = (end_date: any) => {
        if (!end_date) return;
        const openingDateObject = dayjs(end_date);

        if (!openingDateObject.isValid()) return;
        setFilterSearchTable({
            ...filterSearchTable,
            endDate: openingDateObject.toISOString(),
        });
    }
    return (
        <Box
            sx={{
                width: '100%',
                minWidth: '1040px',
            }}
        >
            <Box className="flex mb-4 gap-6 ">
                <Typography variant="h4" component={"h1"}>
                    {t('title.activity-log')}
                </Typography>
            </Box>

            <Paper className="w-full mt-5 rounded-md">
                {/* Filter search table */}
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        "& .MuiTextField-root": { mx: 1, width: "30ch" }
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <TextField
                            data-testid="activity-log-search-username-text"
                            id="username-input"
                            label={t("placeholder.username")}
                            size="small"
                            fullWidth
                            onChange={(e) => setFilterSearchTable({ ...filterSearchTable, username: e.target.value })}
                            value={filterSearchTable.username}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label={t("placeholder.start-date")}
                                views={['year', 'month', 'day']}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                        inputProps: {
                                            'data-testid': "activity-log-openingdate-datepicker"
                                        }
                                    }
                                }}
                                value={filterSearchTable.startDate ? dayjs(filterSearchTable.startDate) : null}
                                onChange={(date) => handleStartDateSearch(date)}
                            />
                            <DatePicker
                                label={t("placeholder.end-date")}
                                views={['year', 'month', 'day']}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                        inputProps: {
                                            'data-testid': "activity-log-closingdate-datepicker"
                                        }
                                    }
                                }}
                                minDate={filterSearchTable.startDate ? dayjs(filterSearchTable.startDate) : undefined}
                                value={filterSearchTable.endDate ? dayjs(filterSearchTable.endDate) : null}
                                onChange={(date) => handleEndDateSearch(date)}

                            />
                        </LocalizationProvider>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, }}>
                            <Button
                                data-testid="activity-log-search-button"
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{
                                    width: "7%",
                                    height: "40px",
                                    marginRight: "5px",
                                    marginLeft: "5px",
                                }}
                                onClick={() => handleFilterSearchTable()}
                            >
                                {t("button.search")}
                            </Button>
                            <Button
                                disabled={Object.values(filterSearchTable).every(value => value === '')}
                                data-testid="activity-log-clear-button"
                                variant="contained"
                                color="secondary"
                                sx={{
                                    width: "7%",
                                    height: "40px",
                                    marginRight: "5px",
                                    marginLeft: "5px",
                                }}
                                onClick={() => handleClearFilterSearchTable()}
                            >
                                {t("button.clear")}
                            </Button>
                        </Box>
                    </Box>
                </Box>
                {/* Employee Table */}
                <TableContainer className='rounded-md'>
                    <Table aria-label="sticky table">
                        <TableHead sx={(theme) => ({
                            backgroundColor: theme.palette.example.tableHeader,
                            '& .MuiTableCell-root': {
                                color: 'white',
                                border: `1px solid ${theme.palette.example.inherit}`,
                            },
                        })}>
                            <TableRow>
                                {employeeColumns.map((column) => (
                                    <TableCell
                                        key={column.columnId}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, width: column.width, fontWeight: 'bold', maxWidth: column.maxWidth || 'none' }}
                                        sx={{ p: 1 }}
                                    >
                                        {t(`table.${column.label}`)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody sx={(theme) => ({
                            '& .MuiTableCell-root': {
                                border: `1px solid ${theme.palette.example.inherit}`,
                            },
                        })}>
                            {activities.map((row, index) => {
                                const employeeRow = createActivityRows(row, (page - 1) * rowsPerPage + index + 1);
                                return (
                                    <TableRow key={`${row.id}_${index}`} hover sx={{
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: (theme) => theme.palette.action.hover,
                                        },
                                    }}>
                                        {employeeColumns.map((column) => (
                                            <TableCell key={column.columnId} align={column.bodyAlign} sx={{ p: 0, px: 1, height: "28px" }}>
                                                {employeeRow[column.columnId] || '-'}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {activities.length > 0 || false ? null : (
                    <Box sx={{ minHeight: 'calc(80vh - 220px)' }}>
                        {loading ?
                            <Box className="flex justify-center h-full">
                                <Box className="flex items-center w-[15rem]">
                                    <Loading />
                                </Box>
                            </Box>
                            : <EmptyTable />}
                    </Box>
                )}
                {activities.length > 0 &&
                    <PaginationMedium
                        page={page}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        dataAmount={pageAmount.count_data}
                        pageAmount={pageAmount.count_page}
                        rowAmount={pageAmount.row_amount}
                    />
                }
            </Paper>
        </Box>
    )
}

Component.display = "ActivityLog";