// MUI
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Modal,
    TextField,
    Typography,
} from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { t } from 'i18next';
import { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Loading from '@/layout/components/loading/Loading';
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import BillingService from '@/services/BillingService';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useFetchCustomer } from '@/layout/components/modal-add-product/hooks';
import { useAlertDialog } from '@/layout/components/alert-dialog/useAlertDialog';

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
    const { createInvoice } = BillingService();
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
    const { customersForSelect } = useFetchCustomer();

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const [loading, setLoading] = useState(false);
    const [validateStartMonth, setValidateStartMonth] = useState(false);
    const handleSubmitUpdateInvoice = async () => {
        try {
            if (!startDate) {
                setValidateStartMonth(true);
                return;
            } else {
                setValidateStartMonth(false);
            }
            setLoading(true);
            const cid = selectedCustomers
                .map(item => item.customer_id !== '' ? item.customer_id : null)
                .filter(Boolean);
            const body = {
                type: 'SINGLE',
                start_month: startDate,
                customer_id: cid,
            };
            // Integrate API
            const res = await createInvoice(body)
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
    const customerOptionsWithSelectAll = customersForSelect || []
    const handleCustomerChange = (event: any, newValue: any[]) => {
        setSelectedCustomers(newValue);
    };

    const isBeforeCurrentMonth = dayjs(startDate).isBefore(current, 'month');
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
                        {t(`button.update-invoice`)}
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
                                    id="onetime-customer-autocomplete"
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
                                                {/* <Checkbox
                                                    disabled={selectedAll && option.customer_id !== ''}
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                /> */}
                                                {option.username}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            data-testid="customer-global-customer-autocomplete"
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
                            disabled={loading || !startDate || selectedCustomers.length === 0}
                            type="submit"
                            data-testid="update-invoice-submit-button"
                            variant="contained"
                            color="primary"
                            children={t("button.update-invoice")}
                            onClick={handleSubmitUpdateInvoice}
                        />
                    </Box>
                    {/* </form> */}
                </Box>
            </Modal>
        </>
    );
}

Component.displayName = 'UpdateInvoiceModal';

