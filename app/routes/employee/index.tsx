import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageEffect } from '@/core/page';
// MUI
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
// Component
import Loading from '@/layout/components/loading/Loading';
import EmptyTable from '@/layout/components/table/EmptyTable';
import PaginationMedium from "../pagination/Pagination";
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import IconTableSvg from '@/assets/svg/TableSvg';
import EmployeeModal from './components/EmployeeModal';
import EmployeeFilterSearch from './components/EmployeeFilterSearch';
// Hooks
import { useTranslateErrorCode } from '../product-management/hooks/useErrorCode';
import { useCustomerSearchStore } from '@/core/storerecoil/useCustomerSearchStore';
// Types
import { ColumnEmployee } from '../customers/CustomerProps';
// Utils
import { formatDate } from '@/core/dateUtils';
import { handleHideText } from '@/core/utils';
import { generatePassword } from '../customers/hooks/useFetchCustomerTable';
import { Action, StatusCode } from '@/core/enum';
import { ModalConfirmDelete, useModalConfirmDelete } from '@/layout/components/modal-confirm-delete';
import EmployeeService from '@/services/EmployeeService';
import { useProfileStore } from '@/core/storerecoil/useProfileStore';
import { useNavigate } from 'react-router-dom';
import { IconMenuSvg } from '@/assets/svg/IconMenuSvg';
import { ConfirmModal } from '@/layout/components/modal-confirm/ConfirmModal';
import { EmployeeResetPasswordModal } from './components/EmployeeResetPasswordModal';

const employeeColumns: readonly ColumnEmployee[] = [
    { columnId: "id", label: "number", minWidth: 50, width: 50, align: "center" },
    { columnId: "username", label: "username", minWidth: 100, align: "left" },
    { columnId: "fullName", label: "employee-name", minWidth: 140, align: "center" },
    { columnId: "telegram", label: "telegram", minWidth: 100, align: "center" },
    { columnId: "email", label: "email", minWidth: 160, align: "center" },
    { columnId: "phoneNumber", label: "phone-number", minWidth: 140, align: "center", bodyAlign: "left" },
    { columnId: "createAt", label: "create-at", minWidth: 160, align: "center", bodyAlign: "right" },
    { columnId: "resetPassword", label: "reset-password", minWidth: 80, align: "center", bodyAlign: "center" },
    { columnId: "management", label: "action", minWidth: 120, align: "center" },
];

export default function Component() {
    const { t } = useTranslation()
    let title = t("title.employee");
    usePageEffect({ title });

    const { getEmployees, getOneEmployee, resetPasswordEmployee } = EmployeeService();
    const { trigerDelete, modalDelete, handleOpenModalDeleteEmployee, handleCloseModalDelete, onSubmitDeleteEmployee } = useModalConfirmDelete();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();
    const { resetSearchCustomer } = useCustomerSearchStore();
    const [employees, setEmployees] = useState<any[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [genPassword, setGenPassword] = useState(generatePassword());
    const [modifiedCustomer, setModifiedCustomer] = useState<any>();
    const [actionType, setActionType] = useState<string>(Action.Add);
    const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
    const [filterSearchTable, setFilterSearchTable] = useState({ username: '', employeeName: '', telegram: '', email: '' });
    const [triggerAction, setTriggerAction] = useState(false);
    // Pagination controller
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [page, setPage] = useState(1);
    const [pageAmount, setPageAmount] = useState({ count_data: 0, count_page: 0, row_amount: 0 });
    const { profile } = useProfileStore();

    const handleOpenAddEmployeeModal = () => {
        setActionType(Action.Add)
        setModifiedCustomer([]);
        setOpenEmployeeModal(true);
    };

    const handleOpenEditEmployeeModal = async (id: string) => {
        try {
            setActionType(Action.Edit)
            const res = await getOneEmployee(id);
            setModifiedCustomer(res?.data || []);
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            setOpenEmployeeModal(true);
        }

    };

    const [oepnResetPasswordModal, setOpenResetPasswordModal] = useState(false);
    const [passwordForReset, setPasswordForReset] = useState("");
    const [usernameForReset, setUsernameForReset] = useState("");
    const handleOpenResetPaasswordEmployee = async () => {
        try {
            console.log("Reset password for employee with ID:", resetPassId);
            console.log("New password:", passwordForReset);
            console.log("Username:", usernameForReset);
            const res = await resetPasswordEmployee(passwordForReset, resetPassId);
            if (res?.code === StatusCode.success) {
                setOpenResetPasswordModal(true);
            }
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            handleCloseConfirmModal()
        }

    };

    const [oepnConfirmModal, setOpenConfirmModal] = useState(false);
    const [resetPassId, setResetPassId] = useState("");
    const handleOpenConfirmModal = (id: string, username: string) => {
        setResetPassId(id);
        setUsernameForReset(username)
        setPasswordForReset(generatePassword());
        setOpenConfirmModal(true);
    };
    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
    };

    const handleClearFilterSearchTable = () => {
        setFilterSearchTable({ username: '', employeeName: '', telegram: '', email: '' });
    }

    const handleFilterSearchTable = () => {
        setPage(1);
        handleSearch();
    }

    useEffect(() => {
        handleSearch();
    }, [triggerAction, trigerDelete, page, rowsPerPage]);

    const handleSearch = async () => {
        try {
            setLoading(true);
            const body = {
                username: filterSearchTable.username,
                full_name: filterSearchTable.employeeName,
                telegram: filterSearchTable.telegram,
                email: filterSearchTable.email,
                page: page,
                limit: rowsPerPage,
            }
            const res = await getEmployees(body);
            setEmployees(res?.data?.customers || []);
            setPageAmount({
                ...pageAmount,
                count_data: res?.data?.count_data,
                count_page: res?.data?.count_page,
                row_amount: res?.data?.customers?.length,
            });
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code) || "Error");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
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

    function createEmployeeRows(data: any, index: number) {
        return {
            id: <Typography align={'center'} variant="body2">{index}</Typography>,
            username: <Typography variant="body2">{data?.username || '-'}</Typography>,
            fullName: <Typography align={data?.full_name ? 'left' : 'center'} variant="body2"> {handleHideText(data?.full_name, 15) || '-'}</Typography>,
            telegram: <Typography align={data?.telegram ? 'left' : 'center'} variant="body2">{data?.telegram || '-'}</Typography>,
            email: <Typography align={data?.email ? 'left' : 'center'} variant="body2">{data?.email || '-'}</Typography>,
            phoneNumber: <Typography align={data?.phone_number ? 'left' : 'center'} variant="body2">{data?.phone_number ? handleHideText(`${data?.dial_code}${data?.phone_number}`, 15) : '-'}</Typography>,
            createAt: <Typography align={data?.created_at ? 'right' : 'center'} variant="body2">{formatDate(data?.created_at) || '-'}</Typography>,
            resetPassword: (
                <IconButton
                    data-testid="employee-edit-button"
                    onClick={() => {
                        handleOpenConfirmModal(data?.id, data?.username);
                    }}
                    sx={{ p: 0.5 }}
                >
                    <IconMenuSvg color='success' icon="reset-password" />
                </IconButton>
            ),
            management: (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <IconButton
                        data-testid="employee-edit-button"
                        onClick={() => {
                            handleOpenEditEmployeeModal(data?.id);
                        }}
                    >
                        <IconTableSvg icon="edit" />
                    </IconButton>
                    <IconButton
                        data-testid="employee-delete-button"
                        onClick={() => {
                            handleOpenModalDeleteEmployee(data?.id)
                        }}
                    >
                        <IconTableSvg icon="delete" />
                    </IconButton>
                </Box>
            ),
        };
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
                    {t('title.employee')}
                </Typography>
                <Button
                    data-testid="employee-add-button"
                    variant="contained"
                    color="primary"
                    children={`+ ${t("button.add-employee")}`}
                    onClick={handleOpenAddEmployeeModal}
                />
            </Box>

            <Paper className="w-full mt-5 rounded-md">
                {/* Filter search table */}
                <EmployeeFilterSearch
                    filterSearchTable={filterSearchTable}
                    setFilterSearchTable={setFilterSearchTable}
                    handleFilterSearchTable={handleFilterSearchTable}
                    handleClearFilterSearchTable={handleClearFilterSearchTable}
                />

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
                            {employees.map((row, index) => {
                                const employeeRow = createEmployeeRows(row, (page - 1) * rowsPerPage + index + 1);
                                return (
                                    <TableRow key={`${row.id}_${index}`} hover sx={{
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: (theme) => theme.palette.action.hover,
                                        },
                                    }}>
                                        {employeeColumns.map((column) => (
                                            <TableCell key={column.columnId} align={column.bodyAlign} sx={{ p: 0, px: 1 }}>
                                                {employeeRow[column.columnId] || '-'}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {employees.length > 0 || false ? null : (
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
                {employees.length > 0 &&
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
            {/* Employee Modal */}
            {openEmployeeModal &&
                <EmployeeModal
                    open={openEmployeeModal}
                    setOpen={setOpenEmployeeModal}
                    genPassword={genPassword}
                    setGenPassword={setGenPassword}
                    generatePassword={generatePassword}
                    modifiedCustomer={modifiedCustomer}
                    actionType={actionType}
                    triggerAction={triggerAction}
                    setTriggerAction={setTriggerAction}
                />
            }
            {modalDelete &&
                <ModalConfirmDelete
                    title={t("modal.title-delete-employee")}
                    description={
                        <>
                            {t("placeholder.delete1")}
                            <br />
                            {t("placeholder.delete2")}
                        </>
                    }
                    openModal={modalDelete}
                    closeModal={handleCloseModalDelete}
                    ConfirmDelete={onSubmitDeleteEmployee}
                />
            }
            {oepnConfirmModal &&
                <ConfirmModal
                    openModal={oepnConfirmModal}
                    closeModal={handleCloseConfirmModal}
                    save={() => handleOpenResetPaasswordEmployee()}
                />
            }
            {oepnResetPasswordModal &&
                <EmployeeResetPasswordModal
                    openModal={oepnResetPasswordModal}
                    closeModal={() => setOpenResetPasswordModal(false)}
                    username={usernameForReset}
                    newPassword={passwordForReset}
                />
            }

        </Box>
    )
}

Component.display = "EmployeeManagement";