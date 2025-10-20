import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { t } from "i18next";
import PaginationMedium from "../../pagination/Pagination.js";
import { useFetchPricingGroup } from "../hooks/index.js";
import EmptyTable from "@/layout/components/table/EmptyTable";
import Loading from "@/layout/components/loading/Loading";
import AddPricingGroupModal from "./AddPricingGroupModal.js";
import EditPricingGroupModal from "./EditPricingGroupModal.js";
import { ModalConfirmDelete } from "@/layout/components/modal-confirm-delete/index.js";
import { SelectedType } from "@/core/enum.js";

interface Column {
    id: "id" | "pricingGroupName" | "productName" | "price" | "currency" | "updatedBy" | "management";
    label: string;
    minWidth?: number;
    width?: number;
    align?: "right" | "center";
    bodyAlign?: "left" | "right" | "center";
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: "id", label: "number", minWidth: 50, width: 50, align: "center", bodyAlign: "left" },
    { id: "pricingGroupName", label: "pricing-group-name", minWidth: 170, align: "center", bodyAlign: "left" },
    { id: "productName", label: "product-name", minWidth: 170, align: "center", bodyAlign: "left" },
    { id: "price", label: "prices", minWidth: 170, align: "center", bodyAlign: "right" },
    { id: "currency", label: "currency", minWidth: 170, align: "center", bodyAlign: "left" },
    { id: "updatedBy", label: "updated-by", minWidth: 170, align: "center", bodyAlign: "left" },
    { id: "management", label: "action", minWidth: 170, align: "center", bodyAlign: "left" },
];

export default function Component() {
    const {
        pricingList,
        pricingGroupName,
        product,
        productList,
        currency,
        currencyList,
        defaultEditData,
        loading,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        dataAmount,
        pageAmount,
        rowAmount,
        openModal,
        modalDelete,
        setTriggerAdd,
        setTriggerEdit,
        setOpenModal,
        handleOpenAddModal,
        handleChangeProduct,
        handleCurrencyChange,
        handlePricingGroupNameChange,
        handleCloseModalDelete,
        handleGetPricingGroupList,
        onSubmitDeletePricingGroup,
        clearInputFilter,
        handleSearch,

    } = useFetchPricingGroup();
    return (
        <>
            <Box className={`w-full flex justify-start items-center gap-7`}>
                <Typography component="h1" variant="h4">
                    {t("title.pricing-group")}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", width: "100%", marginTop: "16px;" }}>
                <Button data-testid="pricing-group-pricinggrouptable-add-button" variant="contained" color="primary" children={`+ ${t("button.add-pricing-group")}`} onClick={handleOpenAddModal} />
            </Box>
            <Paper className="w-full mt-5 rounded-md">
                <Box
                    component="form"
                    className="w-full flex justify-end items-center gap-4 p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                    <TextField
                        data-testid="pricing-group-pricinggrouptable-pringgroupname-text"
                        label={t("placeholder.pricing-group-name")}
                        size="small"
                        autoComplete="current-product"
                        value={pricingGroupName}
                        onChange={handlePricingGroupNameChange}
                        className={`w-1/4`}
                    />
                    <Autocomplete
                        id="combo-box-demo"
                        size="small"
                        value={product}
                        options={productList}
                        getOptionLabel={(option) => option.product_name}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                data-testid="pricing-group-pricinggrouptable-productname-autocomplete"
                                {...params}
                                label={t("placeholder.product-name")}
                                placeholder={t("placeholder.product-name")}
                            />
                        )}
                        onChange={(event, value) => handleChangeProduct(value)}
                    />
                    <FormControl
                        style={{
                            width: "10%",
                        }}
                        size="small"
                    >
                        <InputLabel id="status-label">
                            {t("placeholder.currency")}
                        </InputLabel>
                        <Select
                            data-testid="pricing-group-pricinggrouptable-currency-select"
                            labelId="currency-label"
                            id="currency"
                            value={currency}
                            label={t("placeholder.currency")}
                            onChange={handleCurrencyChange}
                            MenuProps={{
                                disableScrollLock: true,
                                anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                },
                                transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                },
                            }}
                        >
                            <MenuItem value={SelectedType.ALL}>{t('select.all')}</MenuItem>
                            {currencyList.map((currency: any, index: number) => (
                                <MenuItem key={`currency${index} ${currency._id}`} value={currency._id}>
                                    {currency.currency_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box className={`flex gap-3`}>
                        <Button data-testid="pricing-group-pricinggrouptable-search-button" variant="contained" type="submit" color="primary" children={t("button.search")} onClick={handleSearch} />

                        <Button data-testid="pricing-group-pricinggrouptable-all-button" variant="contained" color="secondary" children={t("button.clear")} onClick={clearInputFilter}
                            disabled={!pricingGroupName && !product && currency == SelectedType.ALL ? true : false} />
                    </Box>
                </Box>
                {openModal.addModal && (
                    <AddPricingGroupModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        setTriggerAdd={setTriggerAdd}
                    />
                )}
                {openModal.editModal && defaultEditData && (
                    <EditPricingGroupModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        defaultEditData={defaultEditData}
                        setTriggerEdit={setTriggerEdit}
                    />
                )}
                {modalDelete && (
                    <ModalConfirmDelete
                        title={t("modal.delete-pricing")}
                        description={
                            <>
                                {t("modal.delete-pricing-description")}
                                <br />
                                {t("modal.delete-pricing-notation")}
                            </>
                        }
                        openModal={modalDelete}
                        closeModal={handleCloseModalDelete}
                        ConfirmDelete={onSubmitDeletePricingGroup}
                    />
                )}
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
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, width: column.width, fontWeight: 'bold' }}
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
                            {pricingList.map((row: any, index: number) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={`${row.id}_${index}`}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: (theme) => theme.palette.action.hover,
                                            },
                                        }}
                                    >
                                        {columns.map((column: any) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.bodyAlign} sx={{ p: 0, px: 1 }}>
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
                {Array.isArray(pricingList) && pricingList?.length > 0 ? null : (
                    <>
                        <Box className="min-h-[40dvh]">
                            {loading ? (
                                <Box className="flex justify-center h-[55dvh]">
                                    <Box className=" flex items-center  w-[15rem]">
                                        <Loading />
                                    </Box>
                                </Box>
                            ) : (
                                <EmptyTable />
                            )}
                        </Box>
                    </>
                )}
                {pricingList.length >= 1 && (
                    <PaginationMedium
                        page={page}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        dataAmount={dataAmount}
                        pageAmount={pageAmount}
                        rowAmount={rowAmount}
                    />
                )}
            </Paper>
        </>
    )
}
Component.displayName = "PricingGroupTable";