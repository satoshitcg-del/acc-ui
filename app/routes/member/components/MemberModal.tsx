import {
    Autocomplete,
    Box,
    Button,
    Divider,
    TextField,
    Typography,
} from "@mui/material";
import { VpnKeyRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

/* Yup validation */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* Core && Layout*/
import ModalCustom from "@/layout/components/modal/Modal.js";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode.js";
import { useState } from "react";
import { generateNewPassword } from "@/core/utils";
import MemberService from "@/services/MemberService";
import { Action, sweetalert } from "@/core/enum";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";

export default function Component(props: any) {
    const { openModal, setOpenModal, modalType, defaultValueMember, setDefaultValueMember, customersForSelect, handleGetMemberList } = props;
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const { createMember, updateMemberById } = MemberService();
    const { t } = useTranslation();
    const [genPassword, setGenPassword] = useState(modalType == Action.Edit ? defaultValueMember?.password : generateNewPassword());
    const newPassword = () => setGenPassword(generateNewPassword());
    const [selectedCustomer, setSelectedCustomer] = useState(customersForSelect.find((customer: any) => customer.customer_id === defaultValueMember.customer_id));
    let Schema: any = {
        username: yup.string().test('Test detect slash', t('validate.customer-not-special-required'), (value) => !(/\//).test(value as string)).min(1, t('validate.customer-not-special-required')).max(50, t('validate.customer-not-special-required')).required(t('validate.customer-not-special-required')).trim(''),
        full_name: yup.string().required(t('validate.customer-full-name')),
        email: yup.string().email().required(t('validate.customer-email')),
        password: yup.string().required(t('validate.customer-password')),
        customer_id: yup.string().required(t('validate.customer-require')),
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(yup.object().shape(Schema)),
        defaultValues: {
            // Set default values for your form fields here
            customer_id: defaultValueMember?.customer_id,
            username: defaultValueMember?.username,
            full_name: defaultValueMember?.full_name,
            name: defaultValueMember?.name,
            email: defaultValueMember?.email,
            // other fields
        },
    });

    const handleCloseAddModal = () => {
        setOpenModal(false);
        clearMemberInput()
    };

    const onSubmitHandler = async (data: any) => {
        const body: any = {
            customer_id: selectedCustomer && modalType == Action.Add ? selectedCustomer.customer_id : null,
            username: data?.username,
            full_name: data?.full_name,
            email: data?.email,
            password: genPassword,
        };

        try {
            const res = modalType == Action.Add ? await createMember(body) : await updateMemberById(defaultValueMember?.id, body)
            alertSuccess(TranslateErrorCode(res?.code));
            reset();
        } catch (error: any) {
            console.log("error", error);
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            setOpenModal(false);
            clearMemberInput()
            handleGetMemberList()
        }
    };

    const clearMemberInput = () => {
        setDefaultValueMember({
            id: '',
            username: '',
            email: '',
            password: ''
        })
    }

    const handleChangeCustomerName = (event: any, newValue: any) => {
        setSelectedCustomer(newValue);
    };

    return (
        <>
            <ModalCustom
                open={openModal}
                onClose={handleCloseAddModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <Typography variant="h5" sx={{ color: "#3380FF", p: "1rem" }}>
                        {modalType == Action.Add ? t("title.add-member") : t("title.edit-member")}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            p: "1rem",
                            gap: "1.5rem",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <Autocomplete
                                disablePortal
                                sx={{ width: "50%" }}
                                value={selectedCustomer}
                                options={customersForSelect || []}
                                getOptionLabel={(option: any) => option.username}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        {...register("customer_id")}
                                        label={t('placeholder.customer-name')}
                                        helperText={errors.customer_id?.message as string}
                                        error={errors.customer_id ? true : false}
                                    />}
                                onChange={handleChangeCustomerName}
                            />
                            <TextField
                                {...register("username")}
                                data-testid="add-username-member-text"
                                id="username-input"
                                label={`${t("placeholder.username")} *`}
                                size="medium"
                                autoComplete="current-product"
                                sx={{ width: "50%" }}
                                error={errors.username ? true : false}
                                helperText={errors.username?.message as string}
                            />
                        </Box>
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <TextField
                                {...register("full_name")}
                                data-testid="add-full_name-member-text"
                                id="full_name-input"
                                label={`${t("placeholder.fullname")} *`}
                                size="medium"
                                autoComplete="current-product"
                                sx={{ width: "50%" }}
                                error={errors.full_name ? true : false}
                                helperText={errors.full_name?.message as string}
                            />
                            <TextField
                                {...register("email")}
                                data-testid="add-email-member-text"
                                id="email-input"
                                label={`${t("placeholder.email")} *`}
                                size="medium"
                                autoComplete="current-product"
                                sx={{ width: "50%" }}
                                error={errors.email ? true : false}
                                helperText={errors.email?.message as string}
                            />
                        </Box>
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <TextField
                                {...register("password")}
                                data-testid="add-password-member-text"
                                id="password-input"
                                label={`${t("placeholder.password")} *`}
                                size="medium"
                                autoComplete="current-product"
                                sx={{ width: "50%" }}
                                value={genPassword}
                                error={errors.password ? true : false}
                                helperText={errors.password?.message as string}
                            />
                            <Button
                                data-testid="customer-addcustomer-suggestedpassword-text"
                                sx={{ width: "48.5%", maxHeight: "3.5rem" }}
                                variant="contained"
                                size="large"
                                startIcon={<VpnKeyRounded />}
                                onClick={() => newPassword()}
                            >
                                {t("button.suggest-password")}
                            </Button>
                        </Box>
                        <Divider />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button data-testid="member-manangement-cancel-button" onClick={handleCloseAddModal} variant="text" children={t("button.cancel")} />
                        <Button data-testid="member-manangement-save-button" type="submit" variant="text" children={t("button.save")} />
                    </Box>
                </form>
            </ModalCustom>
        </>
    );
}
Component.displayName = "MemberModal";
