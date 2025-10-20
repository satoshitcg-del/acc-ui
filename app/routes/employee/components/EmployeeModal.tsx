import { useEffect, useState } from 'react';
// MUI
import {
    Backdrop,
    Box,
    Button,
    Divider,
    Modal,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { VpnKeyRounded } from '@mui/icons-material';
import { MuiTelInput } from 'mui-tel-input'
// React hook form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// Customers props
import { customerProps } from '@/routes/customers/CustomerProps';
// service
import CustomerService from '@/services/CustomerService.js';
// Layout
import Loading from "@/layout/components/loading/Loading.js";
import { useTranslation } from 'react-i18next';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode.js';
import { PatternFormat } from 'react-number-format';
import { getCountryByDialCode, getPatternFromPlaceholder, getPlaceholder, replaceHttpsLinkNote } from '@/core/utils/index.js';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog.js';
import { Action, CUSTOMER_GROUP } from '@/core/enum';
import EmployeeService from '@/services/EmployeeService';

interface ComponentProps {
    open: any;
    setOpen: any;
    setGenPassword: any;
    genPassword: string;
    generatePassword: any;
    modifiedCustomer: any;
    actionType: string;
    triggerAction: boolean;
    setTriggerAction: any;
}

type TextFieldProps = {
    name: string;
    dataTestId: string;
    label: string;
    placeholder: string;
    value?: string;
    register: any
    errors: any
    width?: any
    disable?: boolean;
};

export default function Component(props: ComponentProps) {
    const { open, setOpen, setGenPassword, genPassword, generatePassword, modifiedCustomer, actionType, triggerAction, setTriggerAction } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const [localTelephone, setLocalTelephone] = useState(modifiedCustomer?.dial_code || '+66')
    const [countryCode, setCountryCode] = useState(getCountryByDialCode(modifiedCustomer?.dial_code || '+66'))
    const { alertError, alertSuccess } = useAlertDialog();
    const { createEmployee, updateEmployee } = EmployeeService();

    const customerValidateSchema = yup.object().shape({
        username: yup.string().test('Test detect slash', t('validate.customer-not-special-required'), (value) => !(/\//).test(value as string)).min(1, t('validate.customer-not-special-required')).max(50, t('validate.customer-not-special-required')).required(t('validate.customer-not-special-required')).trim('').transform((value) => (typeof value === "string" ? value.toLowerCase() : value)),
        full_name: yup.string().max(50, t('validate.customer-full-name')).required(t('validate.customer-full-name')).trim(''),
        email: yup.string().email(t('validate.customer-email')).required(t('validate.customer-email')).max(50, t('validate.customer-email')).transform((value) => (typeof value === "string" ? value.toLowerCase() : value)), // matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('validate.customer-email'))
        password: yup.string().required(t('validate.customer-password')),
        phone_number: yup.string().matches(/^((\+[1-9]{1,4}[ -]*)|(\([0-9]{2,3}\)[ -]*)|([0-9]{2,4})[ -]*)*?[0-9]{3,4}?[ -]*[0-9]{3,4}$/, { message: t('validate.customer-phone-number'), excludeEmptyString: true }).max(15, t('validate.customer-phone-number')),
        line_id: yup.string().max(50, t('validate.customer-special-required')),
        telegram: yup.string().max(50, t('validate.customer-special-required')).required(t('validate.customer-special-required')).trim(''),
        what_app: yup.string().max(50, t('validate.customer-special-required')),
        note: yup.string().max(10000, t('validate.customer-note')),
        contact_name: yup.string().max(50, t('validate.customer-special-required')),
        contact_telegram: yup.string().max(50, t('validate.customer-special-required')),
    });

    const onSubmitModal = async (data: customerProps) => {
        try {
            setIsLoading(true);
            const body = {
                username: data.username,
                full_name: data.full_name || '',
                customer_group: CUSTOMER_GROUP.INTERNAL,
                email: data.email || '',
                password: data.password || '',
                phone_number: data.phone_number || '',
                line_id: data.line_id || '',
                telegram: data.telegram || '',
                what_app: data.what_app || '',
                note: data.note || '',
                contact_name: data.contact_name || '',
                contact_telegram: data.contact_telegram || '',
                dial_code: localTelephone,
            };
            console.log(`CHECK BODY ${actionType} :`, body);

            const res = actionType === Action.Add ? await createEmployee(body) : await updateEmployee(body, modifiedCustomer?.id);
            setOpen(false);
            alertSuccess(TranslateErrorCode(res?.code));
            reset();
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code));
        } finally {
            setIsLoading(false);
            setTriggerAction(!triggerAction);
        }
    }

    const handleCloseAddModal = () => {
        reset();
        setOpen(false);
    };

    const newPassword = () => setGenPassword(generatePassword());

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(customerValidateSchema),
    });

    useEffect(() => {
        register("note");
        setValue("note", replaceHttpsLinkNote(modifiedCustomer.note));
    }, [register])

    const onEditorStateChange = (editorState: string) => {
        setValue("note", editorState);
    };

    const editorContent = watch("note");

    const handleChangeLocalTelephone = (value: any, info: any) => {
        setCountryCode(info?.countryCode)
        if (info?.countryCallingCode) {
            setLocalTelephone(`+${info?.countryCallingCode}`)
        } else {
            setLocalTelephone(value)
        }
    }

    const handleChangeTelephoneNumber = (value: any) => {
        setValue("phone_number", value)
    }

    const [phoneNumberPlaceholder, setPhoneNumberPlaceholder] = useState('');
    const [phoneNumberPattern, setPhoneNumberPattern] = useState('');

    useEffect(() => {
        const placeholder = getPlaceholder(countryCode);
        setPhoneNumberPlaceholder(placeholder);
        const pattern = getPatternFromPlaceholder(placeholder);
        setPhoneNumberPattern(pattern);
    }, [countryCode]);

    return (
        <Modal
            open={open}
            onClose={handleCloseAddModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                <Paper sx={stylePaperModal}>
                    <form onSubmit={handleSubmit(onSubmitModal)}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}>
                            <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "500" }}>{t(`title.${actionType}-employee`)}</Typography>
                            {renderTextField({ name: "full_name", dataTestId: `${actionType}-employee-name-text`, label: t(`placeholder.employee-name`) + '*', placeholder: t(`placeholder.customer-name`), value: modifiedCustomer?.full_name, register, errors, width: "100%" })}
                            <Divider>{t('divider.information-system')}</Divider>
                            <Box sx={{ display: "flex", gap: "1rem", }} >
                                {renderTextField({ name: "username", dataTestId: `${actionType}-employee-username-text`, label: t(`placeholder.username`) + '*', placeholder: t(`placeholder.username`), value: modifiedCustomer?.username, register, errors })}
                                {renderTextField({ name: "email", dataTestId: `${actionType}-employee-email-text`, label: t(`placeholder.email`) + '*', placeholder: t(`placeholder.email`), value: modifiedCustomer?.email, register, errors })}
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: '1rem' }} >
                                {renderTextField({ name: "password", dataTestId: `${actionType}-employee-password-text`, label: t(`placeholder.password`) + '*', placeholder: t(`placeholder.password`), value: actionType === Action.Edit ? modifiedCustomer?.password : genPassword, register, errors, disable: actionType === Action.Edit ? true : false, width: actionType === Action.Edit ? "49.2%" : "50%" })}
                                {actionType === Action.Add &&
                                    <Button
                                        data-testid="add-employee-suggestedpassword-text"
                                        sx={{ width: "50%", maxHeight: "5rem" }}
                                        variant="contained"
                                        size="large"
                                        startIcon={<VpnKeyRounded />}
                                        onClick={() => newPassword()}
                                    >
                                        {t("button.suggest-password")}
                                    </Button>
                                }
                            </Box>
                            <Divider>{t('divider.information-contact')}</Divider>
                            <Box sx={{ display: "flex", gap: "1rem", }} >
                                {renderTextField({ name: "what_app", dataTestId: "add-employee-whatapp-text", label: t(`placeholder.whats-app`), placeholder: t(`placeholder.whats-app`), value: modifiedCustomer?.what_app, register, errors, width: "100%" })}
                                <Box sx={{ display: "flex", gap: "0.5rem", width: '100%' }} >
                                    <MuiTelInput
                                        data-testid="add-employee-dailcode-text"
                                        sx={{ width: "30%" }}
                                        value={localTelephone}
                                        onChange={(value, info: any) => {
                                            handleChangeLocalTelephone(value, info)
                                        }}
                                        slotProps={{
                                            input: {
                                                // readOnly: true,
                                                inputProps: {
                                                    "data-testid": "add-employee-dailcode-input",
                                                },
                                            },
                                        }}
                                    />
                                    <PatternFormat
                                        data-testid="add-employee-telephone-text"
                                        disabled={countryCode ? false : true}
                                        sx={{ width: "70%" }}
                                        customInput={TextField}
                                        value={modifiedCustomer?.phone_number}
                                        placeholder={countryCode ? phoneNumberPlaceholder : t('placeholder.incorrect-country-code')}
                                        format={phoneNumberPattern}
                                        onValueChange={(values) => {
                                            handleChangeTelephoneNumber(values.value);
                                        }}
                                        slotProps={{
                                            input: {
                                                inputProps: {
                                                    "data-testid": "add-employee-telephone-input",
                                                },
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", gap: "1rem", }} >
                                {renderTextField({ name: "line_id", dataTestId: "add-employee-lineid-text", label: t(`placeholder.line-id`), placeholder: t(`placeholder.line-id`), value: modifiedCustomer?.line_id, register, errors })}
                                {renderTextField({ name: "telegram", dataTestId: "add-employee-telegram-text", label: t(`placeholder.telegram`) + '*', placeholder: t(`placeholder.telegram`), value: modifiedCustomer?.telegram, register, errors })}
                            </Box>
                            <Divider>{t('divider.information-contact-backup')}</Divider>
                            <Box sx={{ display: "flex", gap: "1rem", }} >
                                {renderTextField({ name: "contact_name", dataTestId: "add-employee-lineid-text", label: t(`placeholder.name-contact-backup`), placeholder: t(`placeholder.name-contact-backup`), value: modifiedCustomer?.contact_name, register, errors })}
                                {renderTextField({ name: "contact_telegram", dataTestId: "add-employee-telegram-backup-text", label: t(`placeholder.telegram-backup`), placeholder: t(`placeholder.telegram-backup`), value: modifiedCustomer?.contact_telegram, register, errors })}
                            </Box>
                            <Box sx={{ minHeight: "10rem" }}>
                                <ReactQuill
                                    data-testid="add-employee-note-textarea"
                                    style={{ height: "6.5rem" }}
                                    theme='snow'
                                    value={editorContent}
                                    onChange={onEditorStateChange}
                                />
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingTop: "10px", }}>
                                <Button
                                    variant="text"
                                    data-testid="add-employee-cancel-button"
                                    children={t("button.cancel")}
                                    onClick={handleCloseAddModal}
                                />
                                <Button data-testid="add-employee-submit-button" variant="text" children={t("button.save")} type='submit' />
                            </Box>
                        </Box>
                    </form>
                </Paper>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading} >
                    <Loading />
                </Backdrop>
            </Box>
        </Modal>
    );
}

Component.displayName = 'EmployeeModal';

export const renderTextField = ({
    name,
    dataTestId,
    label,
    placeholder,
    register,
    value,
    errors,
    width,
    disable,
}: TextFieldProps): JSX.Element => (
    <TextField
        disabled={disable}
        sx={{ width: width ? width : '50%' }}
        id={name}
        data-testid={dataTestId}
        label={label}
        size="medium"
        defaultValue={value}
        placeholder={placeholder}
        {...register(name)}
        error={!!errors?.[name]}
        helperText={errors?.[name]?.message}
    />
);

const stylePaperModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "55rem",
    height: "auto",
    maxHeight: "calc(100vh - 20px)",
    overflowY: "auto",
    p: "1.5rem"
};