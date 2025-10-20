
import { ValidateMessage } from "@/core/enum";
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Modal, Paper, Select, SelectChangeEvent, Typography } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Component(props: any) {
    const navigate = useNavigate();
    const navigateToDetails = (id: any, username: string) =>
        navigate(`${username}`, { state: { cid: id, username } });
    const stylePaperModal = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "30rem",
        height: "auto",
        p: "1.5rem"
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm({});

    const {openModal, setOpenModal, existingCustomerLists} = props;
    const [customerID, setCustomerID] = useState<string>("")

    const handleCloseExistingCustomerListModal = () => {
        setOpenModal({ ...openModal, existingCustomerListModal: false });
    };

    const handleCustomerNameChange = (event: any) => {
        setCustomerID(event.target.value);
    }

    const confirmCustomer = () => {
        const foundCustomer = existingCustomerLists.find((customer: any) => 
            customer.id === customerID
        );
        console.log('foundCustomer', foundCustomer)
        if (foundCustomer) {
            navigateToDetails(foundCustomer.id, foundCustomer.username);
        }
        reset()
        handleCloseExistingCustomerListModal()
    }

    return (

        <Modal
            open={openModal.existingCustomerListModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEnforceFocus
        >
            <Paper sx={stylePaperModal}>
                <form onSubmit={handleSubmit(confirmCustomer)}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems:"center" }}>
                        <Typography id="modal-modal-title">{t("title.existing-customer")}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems:"center", p: "1rem", gap: "1.5rem" }}>
                        <FormControl sx={{ width: "70%" }}>
                            <InputLabel id="demo-simple-select-label">
                                {t("placeholder.customer-name")}
                            </InputLabel>
                            <Select
                                data-testid="product-existincustomerlist-customername-select"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={customerID}
                                label={t("placeholder.customer-name")}
                                {...register("customerName", {
                                    required: {
                                        value: true,
                                        message: `Customer name ${ValidateMessage.requiredField}`,
                                    },
                                })}
                                error={Boolean(errors?.["customerName"])}
                                onChange={(event: SelectChangeEvent<string>) => {handleCustomerNameChange(event)}}
                            >
                                {existingCustomerLists.map((customer: any) => (
                                    <MenuItem
                                        key={`StatusType ${customer.id}`}
                                        value={customer.id}
                                    >
                                        {customer.username}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText
                                id="customer_name-text"
                                sx={{ color: "red" }}
                            >
                                {errors?.["customerName"]?.message as string}
                            </FormHelperText>
                        </FormControl>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "end",
                            paddingTop: "10px",
                        }}
                    >
                        <Button
                            data-testid="customer-existincustomerlist-cancel-button"
                            variant="text"
                            children={t("button.cancel")}
                            onClick={handleCloseExistingCustomerListModal}
                        />
                        <Button
                            data-testid="customer-existincustomerlist-submit-button"
                            type="submit"
                            variant="text"
                            children={t("button.confirm")}
                        />
                    </Box>
                </form>
            </Paper>
        </Modal>

    )
}
Component.displayName = "ExistingCustomerList";