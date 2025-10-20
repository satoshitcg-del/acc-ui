// MUI
import {
    Autocomplete,
    Box,
    Button,
    InputAdornment,
    Modal,
    TextField,
    Typography,
} from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { t } from 'i18next';
import IconTableSvg from '@/assets/svg/TableSvg';
import { Action } from '@/core/enum';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
interface ComponentProps {
    openAddInvoice: boolean;
    handleCloseAddInvoice: () => void;
    customersForSelect: Array<{ customer_id: number; username: string; full_name?: string }>;
    customerID: string | null;
    handleCustomerID: (customer: { customer_id: number; username: string; full_name?: string } | null) => void;
    handleChangePrefix: (prefix: any) => void;
    handleSubmitModal: (data: any) => void;
    options: any[];
    handleAddItem: () => void;
    handleRemoveItem: (index: number) => void;
    handleItemChange: (index: number, field: string, value: any) => void;
    items: Array<{ sub_product_id: string; quantity: number; price: number }>;
    prefixInit: any;
    selectPrefixId: string;
    actionType: string;
}

const ValidateSchema = yup.object().shape({
    customer_id: yup.string().required(t('validate.task-subject-require')),
    customer_product_id: yup.string().required(t('validate.task-subject-require')),
    items: yup.array().of(
        yup.object().shape({
            sub_product_id: yup.string().required(t('validate.sub-product-require')),
            quantity: yup
                .number()
                .typeError(t('validate.quantity-min'))
                .min(1, t('validate.quantity-min')),
            price: yup
                .number()
                .typeError(t('validate.price-min'))
                .required(t('validate.price-require'))
                .min(0.01, t('validate.price-min')),
        })
    ),
});

export default function Component(props: ComponentProps) {
    // Add invoice one time controller
    const {
        openAddInvoice,
        handleCloseAddInvoice,
        customersForSelect,
        customerID,
        handleCustomerID,
        handleChangePrefix,
        handleSubmitModal,
        options,
        handleAddItem,
        handleRemoveItem,
        handleItemChange,
        items,
        prefixInit,
        selectPrefixId,
        actionType

    } = props;

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

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        reset,
        trigger
    } = useForm({
        resolver: yupResolver(ValidateSchema),
    });

    const onSubmit = (data: any) => {
        handleSubmitModal(data);
    };

    useEffect(() => {
        setValue('customer_id', customerID || '')
        setValue('customer_product_id', selectPrefixId || '')
        items.forEach((item, index) => {
            setValue(`items.${index}.sub_product_id`, item.sub_product_id);
            setValue(`items.${index}.quantity`, item.quantity);
            setValue(`items.${index}.price`, item.price);
        })
    }, [])

    const handleRemoveValueItemById = (index: number) => {
        const updatedItems = [...items];

        // ใช้ splice เพื่อลบ item ที่ตำแหน่ง index
        updatedItems.splice(index, 1);
        // อัปเดตฟอร์มด้วย items ใหม่
        reset({
            ...getValues(), // เก็บค่าปัจจุบัน
            items: updatedItems, // อัปเดต items ใหม่
        });
        trigger()
        // ลบ item จาก state หรือ array ภายนอก (ถ้าจำเป็น)
        handleRemoveItem(index);
    };

    return (
        <>

            <Modal
                open={openAddInvoice}
                onClose={handleCloseAddInvoice}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box
                    sx={{
                        ...style,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: 700,
                        maxHeight: "calc(100vh - 20px)",
                        overflowY: "auto",
                    }}>
                    <Typography variant='h5' sx={{ color: "modal.title_color", fontWeight: "bold" }}>
                        {t(`button.${actionType}-invoice-setup`)}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                            <Autocomplete
                                readOnly={actionType === Action.Edit ? true : false}
                                id="onetime-customer-autocomplete"
                                sx={{ width: '50%' }}
                                options={customersForSelect || []}
                                value={customersForSelect.find((customer: any) => customer.customer_id === customerID) || null}
                                getOptionLabel={(option: any) => option.full_name ? `${option.username}  (${option.full_name})` : option.username || ''}
                                noOptionsText={t('placeholder.no-options')}
                                onChange={(event, newValue: any) => {
                                    setValue('customer_id', newValue?.customer_id || '')
                                    handleCustomerID(newValue);
                                    trigger('customer_id')
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        data-testid="customer-global-customer-autocomplete"
                                        {...params}
                                        label={t('placeholder.customer-name')}
                                        variant="outlined"
                                        {...register(`customer_id`)}
                                        error={errors.customer_id ? true : false}
                                        helperText={errors.customer_id?.message as string}
                                    />
                                )}
                            />

                            <Autocomplete
                                readOnly={actionType === Action.Edit ? true : false}
                                id="onetime-customer-product-autocomplete"
                                sx={{ width: '50%' }}
                                options={prefixInit || []}
                                value={prefixInit?.find((item: any) => item.customer_product_id === selectPrefixId) || null}
                                getOptionLabel={(option: any) =>
                                    option.prefix_name
                                        ? `${option.product_name} (${option.prefix_name})`
                                        : option.product_name || ''
                                }
                                noOptionsText={t('placeholder.no-options')}
                                onChange={(event, newValue) => {
                                    setValue('customer_product_id', newValue?.customer_product_id || '')
                                    handleChangePrefix(newValue);
                                    trigger('customer_product_id')
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        data-testid="customer-global-customer-autocomplete"
                                        {...params}
                                        label={t('placeholder.onetime-customer-product')}
                                        variant="outlined"
                                        {...register(`customer_product_id`)}
                                        error={errors.customer_product_id ? true : false}
                                        helperText={errors.customer_product_id?.message as string}
                                    />
                                )}
                            />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", my: 2, width: '100%', justifyContent: 'end' }}>
                            <Button
                                data-testid="add-item-button"
                                variant="contained"
                                color="primary"
                                children={`+ ${t("button.add-item")}`}
                                onClick={handleAddItem}
                            />
                        </Box>
                        {items.map((item: any, index: any) => (
                            <Box key={index} style={{ display: 'flex', marginBottom: '10px', gap: 16 }}>
                                <Autocomplete
                                    value={options.find((product) => product.id === item.sub_product_id) || null} // Match with sub_product_id
                                    onChange={(event, newValue) => {
                                        const id = newValue?.id || '';
                                        handleItemChange(index, 'sub_product_id', id);
                                        setValue(`items.${index}.sub_product_id`, id);
                                        trigger(`items.${index}.sub_product_id` || '')
                                    }}
                                    id="controllable-states-demo"
                                    options={options}
                                    getOptionLabel={(option) => option.product_name_preview || ''}
                                    isOptionEqualToValue={(option, value) => option.id === value.id} // Compare by id
                                    noOptionsText={t('placeholder.no-options')}
                                    sx={{ width: "45%" }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t('placeholder.sub-product-name')}
                                            {...register(`items.${index}.sub_product_id`)} // Ensure registration
                                            error={!!errors.items?.[index]?.sub_product_id}
                                            helperText={errors.items?.[index]?.sub_product_id?.message}
                                        />
                                    )}
                                />
                                <TextField
                                    data-testid="billingnote-index-price-text"
                                    id="modal-quantity"
                                    label={t('placeholder.quantity')}
                                    value={item.quantity}
                                    onChange={(e) => {
                                        let numericValue = Number(e.target.value);
                                        handleItemChange(index, 'quantity', !isNaN(numericValue) ? numericValue : 0)
                                        setValue(`items.${index}.quantity`, numericValue);
                                        trigger(`items.${index}.quantity`)
                                    }}
                                    sx={{ width: "15%" }}
                                    error={!!errors.items?.[index]?.quantity}
                                    helperText={errors.items?.[index]?.quantity?.message}
                                />
                                <NumericFormat
                                    data-testid="billingnote-index-price-text"
                                    id="modal-price"
                                    label={t('placeholder.prices')}
                                    value={item.price}
                                    sx={{ width: "40%" }}
                                    error={!!errors.items?.[index]?.price}
                                    helperText={errors.items?.[index]?.price?.message}
                                    inputProps={{ maxLength: 19 }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">USDT</InputAdornment>
                                        ),
                                    }}
                                    thousandSeparator
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    allowLeadingZeros={true}
                                    customInput={TextField}
                                    onValueChange={(values: any) => {
                                        const newValue = values.floatValue ?? 0;
                                        handleItemChange(index, 'price', newValue);
                                        setValue(`items.${index}.price`, Number(newValue));
                                        trigger(`items.${index}.price`);
                                    }}
                                />
                                {index !== 0 ? (
                                    <Button
                                        variant="outlined"
                                        children={<IconTableSvg icon="delete" active={false} color='success' />}
                                        onClick={() => handleRemoveValueItemById(index)}
                                        sx={{ borderColor: "#B7B5B5", height: "56px" }}
                                    />
                                ) : (
                                    <Button
                                        disabled={true}
                                        variant="outlined"
                                        children={<IconTableSvg icon="delete" active={true} />}
                                        sx={{ borderColor: "#B7B5B5", height: "56px" }}
                                    />
                                )}
                            </Box>
                        ))}
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", paddingY: "20px" }}>
                            <Button
                                variant="text"
                                data-testid="customer-addcustomer-cancel-button"
                                children={t("button.cancel")}
                                onClick={handleCloseAddInvoice}
                            />
                            <Button
                                type="submit"
                                data-testid="customer-addcustomer-submit-button"
                                variant="text"
                                children={t("button.save")}
                            // onClick={handleSubmitModal}
                            />
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    );
}

Component.displayName = 'OneTimeInvoiceModal';

