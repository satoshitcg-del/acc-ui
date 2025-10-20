// MUI
import {
    Autocomplete,
    Box,
    Button,
    Modal,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loading from '@/layout/components/loading/Loading';
import { CREATE_DRAFT_TYPE, sweetalert } from '@/core/enum';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { setTimeout } from 'timers/promises';
import BillingService from '@/services/BillingService';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';
import { useFetchCustomer } from '@/layout/components/modal-add-product/hooks';

interface ComponentProps {
    openModal: boolean;
    handleCloseModal: () => void;
    setTriggerHandleSearch: any
    triggerHandleSearch: boolean

}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '8px',
    boxShadow: 24,
    px: 4,
    pt: 4,
};

export default function Component(props: ComponentProps) {
    const {
        openModal,
        handleCloseModal,
        setTriggerHandleSearch,
        triggerHandleSearch,

    } = props;
    const { customersForSelect } = useFetchCustomer();
    const { createDraftInvoice } = BillingService();
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError, alertSuccess } = useAlertDialog();
    const current = dayjs();
    const [startDate, setStartDate] = useState('');
    const handleChangeStartDate = (date: any) => {
        if (!date) return;
        const openingDateObject = dayjs(date).date(15);

        if (!openingDateObject.isValid()) return;
        setStartDate(openingDateObject.toISOString())
        setValidateStartMonth(false)
    };

    const [loading, setLoading] = useState(false);
    const [validateStartMonth, setValidateStartMonth] = useState(false);
    const handleSubmitCreateDraftModal = async () => {
        try {
            if (!startDate) {
                setValidateStartMonth(true);
                return;
            } else {
                setValidateStartMonth(false);
            }
            setLoading(true);
            const body = {
                type: 'SINGLE', // Fix type
                start_month: startDate,
                // customer_id: selectedCustomers.map((item) => item.customer_id),
            };
            console.log("CHECK MONTH SELECTED :", body);
            // Integrate API
            const res = await createDraftInvoice(body);

            handleCloseModal()
            setLoading(false);
            setTriggerHandleSearch(!triggerHandleSearch)
            alertSuccess(TranslateErrorCode(res?.code));
        } catch (error: any) {
            alertError(TranslateErrorCode(error.response.data.code));
        } finally {
            handleCloseModal()
            setLoading(false);
        }
    };

    const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
    const SELECT_ALL_OPTION = { customer_id: '', username: t('select.all'), full_name: '' };
    const customerOptionsWithSelectAll = [SELECT_ALL_OPTION, ...(customersForSelect || [])];
    const handleCustomerChange = (event: any, newValue: any[]) => {
        const justSelectedAll = newValue.some((item) => item.customer_id === '');

        if (justSelectedAll) {
            setSelectedCustomers([SELECT_ALL_OPTION]);
        } else {
            setSelectedCustomers(newValue);
        }
    };
    return (
        <>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >

                <Box
                    sx={{
                        ...style,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: 500,
                        maxHeight: "calc(100vh - 20px)",
                        overflowY: "auto",
                    }}>
                    <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "bold" }}>
                        {t(`button.create-draft`)}
                    </Typography>
                    {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                    {loading ? (
                        <Box sx={{
                            display: 'flex',
                            width: "100%",
                            height: 72,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            <Box sx={{
                                display: 'flex',
                                width: 200,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Loading />
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}>
                            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: '100%' }}>
                                <Typography sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{t('modal.select-month')}</Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label={t('modal.target-month')}
                                        maxDate={current}
                                        minDate={dayjs().subtract(6, 'month')}
                                        openTo="year"
                                        views={['year', 'month']}
                                        sx={{ width: '100%' }}
                                        value={startDate ? dayjs(startDate) : null}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                inputProps: {
                                                    'data-testid': "crate-draft-openingdate-datepicker"
                                                },
                                                error: validateStartMonth,
                                                helperText: validateStartMonth ? t('validate.select-month') : '',
                                            }
                                        }}
                                        onChange={(date: any) => {
                                            handleChangeStartDate(date);
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: '100%' }}>
                                <Typography sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{t('modal.select-customer')}</Typography>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    // disableCloseOnSelect
                                    filterSelectedOptions
                                    size="small"
                                    id="create-draft-customer-autocomplete"
                                    data-testid="create-draft-customer-autocomplete"
                                    options={selectedCustomers.some((item) => item.customer_id === '') ? [] : customerOptionsWithSelectAll}
                                    value={selectedCustomers}
                                    isOptionEqualToValue={(option, value) => option.customer_id === value.customer_id}
                                    noOptionsText={t('placeholder.no-options')}
                                    getOptionLabel={(option: any) => option.username}
                                    onChange={handleCustomerChange}
                                    renderOption={(props, option, { selected }) => {
                                        const { key, ...optionProps } = props;
                                        const selectedAll = selectedCustomers.some((item) => item.customer_id === '');
                                        return (
                                            <li key={key} {...optionProps}>
                                                {option.username}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            data-testid="customer-list-autocomplete"
                                            {...params}
                                            // label={t('placeholder.customer-name')}
                                            placeholder={t('placeholder.customer-name')}
                                            variant="outlined"
                                            sx={{
                                                maxHeight: 90,
                                                overflowY: 'auto',
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>
                    )}

                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingY: "20px", gap: 1 }}>
                        <Button
                            disabled={loading}
                            data-testid="create-darft-cacncel-button"
                            variant="contained"
                            color="error"
                            children={t("button.cancel")}
                            onClick={handleCloseModal}
                        />
                        <Button
                            disabled={loading || !startDate}
                            type="submit"
                            data-testid="create-draft-submit-button"
                            variant="contained"
                            color="primary"
                            children={t("button.create-draft")}
                            onClick={handleSubmitCreateDraftModal}
                        />
                    </Box>
                    {/* </form> */}
                </Box>
            </Modal>
        </>
    );
}

Component.displayName = 'CreateDraftModal';

