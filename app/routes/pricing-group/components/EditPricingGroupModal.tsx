import ModalCustom from "@/layout/components/modal/Modal";
import { Autocomplete, Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEditPricingGroup } from "../hooks";
import { t } from "i18next";
import { NumericFormat } from "react-number-format";

export default function Component(props: any) {
    const { openModal, setOpenModal, defaultEditData, setTriggerEdit } = props;
    const { product, productList, price, currency, currencyList, pricingGroupName, errors, register, handleSubmit, handlePriceChange, handleCurrencyChange, handleChangeProduct, editDataPricingGroup, handlePricingGroupNameChange } = useEditPricingGroup(defaultEditData, setTriggerEdit);
    const handleCloseEditModal = () => setOpenModal({ ...openModal, editModal: false });

    const onSubmit = async () => {
        try {
            await editDataPricingGroup(openModal, setOpenModal);
        } catch (error) {
            console.error("Failed to add pricing group:", error);
        }
    };

    return (
        <>
            <ModalCustom
                open={openModal.editModal}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <form onSubmit={handleSubmit(() => onSubmit())}>
                        <Typography variant="h5" sx={{ color: "#3380FF", p: "1rem" }}>
                            {t("title.edit-pricing-group")}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                p: "1rem",
                                gap: "1.5rem",
                                marginBottom: "10px"
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                }}
                            >
                                <Box sx={{ width: "30%" }}>
                                    <Typography sx={{ marginTop: "7px" }} variant="body1">
                                        {t("placeholder.product-name")}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: "70%" }}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        size="small"
                                        value={product || null}
                                        options={productList}
                                        getOptionLabel={(option) => option.product_name}
                                        sx={{ width: 350 }}
                                        renderInput={(params) => (
                                            <TextField
                                                data-testid="pricing-group-editpricinggroup-productname-autocomplete"
                                                {...params}
                                                label={t("placeholder.product-name")}
                                                placeholder={t("placeholder.product-name")}
                                                {...register("productName", {
                                                    required: {
                                                        value: true,
                                                        message: `${t("validate.product-require")}`,
                                                    },
                                                })}
                                                error={Boolean(errors["productName"])}
                                                helperText={
                                                    typeof errors["productName"]?.message === "string"
                                                        ? errors["productName"]?.message
                                                        : ""
                                                }
                                            />
                                        )}
                                        onChange={(event, value) => handleChangeProduct(value)}
                                        disabled={true}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center"
                                }}
                            >
                                <Box sx={{ width: "30%" }}>
                                    <Typography sx={{ marginTop: "7px" }} variant="body1">
                                        {t("placeholder.pricing-group-name")}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: "70%" }}>
                                    <TextField
                                        data-testid="pricing-group-editpricinggroup-pricinggroupname-text"
                                        label={t("placeholder.pricing-group-name")}
                                        size="small"
                                        autoComplete="current-product"
                                        value={pricingGroupName}
                                        {...register("pricingGroupName", {
                                            required: {
                                                value: true,
                                                message: `${t("validate.pricing-name-require")}`,
                                            },
                                        })}
                                        onChange={handlePricingGroupNameChange}
                                        sx={{ width: 350 }}
                                        error={errors.pricingGroupName ? true : false}
                                        helperText={errors.pricingGroupName?.message as string}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                }}
                            >
                                <Box sx={{ width: "30%" }}>
                                    <Typography sx={{ marginTop: "7px" }} variant="body1">
                                        {t("placeholder.prices")}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: "70%" }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "1rem"
                                    }}>
                                        <NumericFormat
                                            data-testid="pricing-group-editpricinggroup-price-text"
                                            value={price}
                                            thousandSeparator
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            allowLeadingZeros={true}
                                            label={t("placeholder.prices")}
                                            customInput={TextField}
                                            onValueChange={(values: any) => {
                                                handlePriceChange(values)
                                            }}
                                            size="small"
                                            {...register("price", {
                                                required: {
                                                    value: true,
                                                    message: `${t("validate.price-require")}`,
                                                },
                                                min: {
                                                    value: 0,
                                                    message: `${t("validate.pricee-positive")}`
                                                }

                                            })}
                                            error={errors.price ? true : false}
                                            helperText={errors.price?.message as string}
                                            inputProps={{ maxLength: 19 }}
                                            sx={{ width: 235 }}
                                        />
                                        {currencyList.length > 0 && (
                                            <FormControl
                                                style={{
                                                    width: "100px",
                                                }}
                                                size="small"
                                            >
                                                <InputLabel id="status-label">
                                                    {t("placeholder.currency")}
                                                </InputLabel>
                                                <Select
                                                    data-testid="pricing-group-editpricinggroup-currency-select"
                                                    labelId="currency-label"
                                                    id="status"
                                                    className={`w-4/4`}
                                                    value={currency || ''} // Add a fallback value
                                                    label={t("placeholder.currency")}
                                                    onChange={handleCurrencyChange}
                                                >
                                                    {currencyList.map((currency: any, index: number) => (
                                                        <MenuItem key={`currency${index} ${currency._id}`} value={currency._id}>
                                                            {currency.currency_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                            <Button
                                data-testid="pricing-group-editpricinggroup-cancel-button"
                                onClick={handleCloseEditModal}
                                variant="text"
                                children={t("button.cancel")}
                            />
                            <Button data-testid="pricing-group-editpricinggroup-save-button" type="submit" variant="text" children={t("button.save")} />
                        </Box>
                    </form>
                </>
            </ModalCustom>
        </>
    )
}
Component.displayName = "EditPricingGroupModal";