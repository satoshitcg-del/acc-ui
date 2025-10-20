import { Autocomplete, Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { t } from "i18next";
import {
    Delete as DeleteIcon,
    BorderColor as EditIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useFetchCustomer } from "@/layout/components/modal-add-product/hooks/useFetchCustomer";
import MemberModal from "./components/MemberModal";
import { ModalConfirmDelete, useModalConfirmDelete } from "@/layout/components/modal-confirm-delete";
import MemberService from "@/services/MemberService";
import PaginationMedium from "@/routes/pagination/Pagination";
import Loading from "@/layout/components/loading/Loading";
import EmptyTable from "@/layout/components/table/EmptyTable";
import { useTranslateErrorCode } from "../product-management/hooks/useErrorCode";
import { Action } from "@/core/enum";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";

interface Column {
    id: "id" | "customer_name" | "full_name" | "email" | "username" | "password" | "management";
    label: string;
    minWidth?: number;
    align?: "right" | "center";
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: "id", label: "number", minWidth: 60 },
    { id: "username", label: "username", minWidth: 120 },
    { id: "email", label: "email", minWidth: 250, align: "center" },
    { id: "full_name", label: "fullname", minWidth: 150, align: "center" },
    { id: "customer_name", label: "customer-name", minWidth: 150, align: "center" },
    { id: "management", label: "management", minWidth: 200, align: "center" },
];

export function Component() {
    const { trigerDelete, modalDelete, handleOpenModalDeleteMember, handleCloseModalDelete, onSubmitDeleteMember } = useModalConfirmDelete();
    const { customersForSelect } = useFetchCustomer();
    const { alertError } = useAlertDialog();
    const { getMemberList, getMemberById } = MemberService();
    const [memberList, setMemberList] = useState<any[] | []>([])
    const [openModal, setOpenModal] = useState<boolean>();
    const [modalType, setModalType] = useState<string>('')
    const [defaultValueMember, setDefaultValueMember] = useState({
        id: '',
        customer_id: '',
        full_name: '',
        username: '',
        email: '',
        password: ''
    })
    const [username, setUsername] = useState<string>('')
    const [fullname, setFullname] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { TranslateErrorCode } = useTranslateErrorCode()
    // Pagination controller
    const [pageAmount, setPageAmount] = useState({
        count_data: 0,
        count_page: 0,
        row_amount: 0,
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    const handleGetMemberList = async () => {
        setLoading(true)
        try {
            const bodyReq: any = {
                customer_id: selectedCustomer ? selectedCustomer?.customer_id : null,
                username: username ? username : null,
                full_name: fullname ? fullname : null,
                email: email ? email : null,
                page: page,
                limit: rowsPerPage
            }

            const res = await getMemberList(bodyReq)
            const memberData = res?.data ? res?.data.map((row: any, index: number) =>
                createMemberTableRows({
                    id: row.id,
                    username: row.username,
                    full_name: row.full_name,
                    customer_name: row.customer_name,
                    email: row.email,
                    password: row.password,
                }, index),
            )
                : [];
            setPageAmount({
                count_data: res.pagination.total,
                count_page: res.pagination.total_pages,
                row_amount: res.data.length
            })
            setMemberList(memberData)
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code));
        } finally {
            setLoading(false)
        }
    }

    const createMemberTableRows = (value: any, index: number): any => {
        return {
            id: <Typography variant="body2">{index + 1}</Typography>,
            username: <Typography variant="body2">{value.username}</Typography>,
            email: <Typography variant="body2">{value.email}</Typography>,
            full_name: <Typography variant="body2">{value.full_name}</Typography>,
            customer_name: <Typography variant="body2">{value.customer_name}</Typography>,
            management: handleManagement(value.id)
        }
    }

    const handleManagement = (id: string) => {
        return (
            <div className="flex justify-center">
                <IconButton
                    data-testid="pricing-group-pricinggrouptable-edit-button"
                    className="p-5"
                    aria-label="edit"
                    sx={{ width: "24px", height: "24px", color: "#EF6C00" }}
                    onClick={() => {
                        handleGetMemberById(id);
                    }}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    data-testid="pricing-group-pricinggrouptable-delete-button"
                    className="p-5"
                    aria-label="delete"
                    sx={{ width: "24px", height: "24px", color: "#D32F2F" }}
                    onClick={() => {
                        handleOpenModalDeleteMember(id);
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    };

    useEffect(() => {
        handleGetMemberList()
    }, [trigerDelete, page])

    const handleOpenAddModal = () => {
        setOpenModal(true);
        setModalType(Action.Add)
    }

    const handleGetMemberById = async (id: string) => {
        try {
            const res = await getMemberById(id)
            const member = res?.data
            setOpenModal(true);
            setModalType(Action.Edit)
            setDefaultValueMember({
                id: member.id,
                customer_id: member.customer_id,
                full_name: member.full_name,
                username: member.username,
                email: member.email,
                password: member.password
            })
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code));
        }
    }

    const clearInputFilter = () => {
        setEmail('')
        setUsername('')
        setFullname('')
        setSelectedCustomer(null)
    }

    const handleUsernameSearch = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setUsername(event.target.value as string);

    const handleFullnameSearch = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setFullname(event.target.value as string);

    const handleEmailSearch = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setEmail(event.target.value as string);

    const handleChangeCustomerName = (event: any, newValue: any) => {
        setSelectedCustomer(newValue);
    };

    return (
        <>
            <Box className={`w-full flex justify-start items-center gap-7`}>
                <Typography component="h1" variant="h4">
                    {t("title.member")}
                </Typography>
                <Button
                    data-testid="discount-discounttable-add-button"
                    className="w-36 rounded-l"
                    onClick={handleOpenAddModal}
                    variant="contained"
                    color="primary"
                >
                    {`+ ${t("button.add-member")}`}
                </Button>
            </Box>
            <Paper className="w-full mt-5 rounded-md">
                <Box component="form" className="w-full flex justify-end items-center gap-4 p-4">
                    <Autocomplete
                        disablePortal
                        className={`w-1/4`}
                        size="small"
                        value={selectedCustomer}
                        options={customersForSelect || []}
                        getOptionLabel={(option) => option.username}
                        renderInput={(params) => <TextField {...params} label={t('placeholder.customer-name')} />}
                        onChange={handleChangeCustomerName}
                    />
                    <TextField
                        data-testid="pricing-group-pricinggrouptable-pringgroupname-text"
                        label={t("placeholder.username")}
                        size="small"
                        autoComplete="current-product"
                        value={username}
                        className={`w-1/4`}
                        onChange={handleUsernameSearch}
                    />
                    <TextField
                        data-testid="pricing-group-pricinggrouptable-pringgroupname-text"
                        label={t("placeholder.fullname")}
                        size="small"
                        autoComplete="current-product"
                        value={fullname}
                        className={`w-1/4`}
                        onChange={handleFullnameSearch}
                    />
                    <TextField
                        data-testid="pricing-group-pricinggrouptable-pringgroupname-text"
                        label={t("placeholder.email")}
                        size="small"
                        autoComplete="current-product"
                        value={email}
                        className={`w-1/4`}
                        onChange={handleEmailSearch}
                    />
                    <Box className={`flex gap-3`}>
                        <Button data-testid="pricing-group-pricinggrouptable-search-button" variant="contained" color="primary" children={t("button.search")} onClick={handleGetMemberList} />

                        <Button data-testid="pricing-group-pricinggrouptable-all-button" variant="contained" color="secondary" children={t("button.clear")} onClick={clearInputFilter}
                            disabled={!fullname && !selectedCustomer && !username && !email ? true : false} />
                    </Box>
                </Box>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {t(`table.${column.label}`)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {memberList.map((row: any, index: number) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={`${row.id}_${index}`}
                                    >
                                        {columns.map((column: any) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {memberList.length > 0 ? null : ( // Need check UI
                    <Box className="min-h-[40dvh]">
                        {loading ?
                            <Box className="flex justify-center h-[55dvh]">
                                <Box className=" flex items-center  w-[15rem]">
                                    <Loading />
                                </Box>
                            </Box>
                            : <EmptyTable />}
                    </Box>
                )}
                {memberList.length > 0 &&
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
            {openModal &&
                <MemberModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    modalType={modalType}
                    defaultValueMember={defaultValueMember}
                    setDefaultValueMember={setDefaultValueMember}
                    customersForSelect={customersForSelect}
                    handleGetMemberList={handleGetMemberList}
                />
            }
            {modalDelete &&
                <ModalConfirmDelete
                    title={t("modal.delete-sub-customer")}
                    description={
                        <>
                            {t("modal.delete-sub-customer-description")}
                            <br />
                            {t("modal.delete-sub-customer-notation")}
                        </>
                    }
                    openModal={modalDelete}
                    closeModal={handleCloseModalDelete}
                    ConfirmDelete={onSubmitDeleteMember}
                />
            }

        </>
    );
}
Component.displayName = "MemeberMangement";