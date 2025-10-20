import { Action } from "@/core/enum";
import { IOneTimeItem } from "@/core/interface/services";
import { useAlertDialog } from "@/layout/components/alert-dialog/useAlertDialog";
import { useTranslateErrorCode } from "@/routes/product-management/hooks/useErrorCode";
import BillingService from "@/services/BillingService";
import OneTimeBillingService from "@/services/OneTimeBillingService";
import dayjs from "dayjs";
import { t } from "i18next";
import { useState } from "react";


export function generatePassword() {
    return Math.random().toString(36).substring(2, 15);
}

export const useOneTimeInvoiceModal = (setTriggerHandleSearch: (id: boolean) => void, triggerHandleSearch: boolean, prefixLists?: any) => {
    // Add invoice one time controller
    const { getOneTimeById, createOneTimeBilling, getOnetimeCustomerProducts, updateOneTimeBillingById } = OneTimeBillingService()
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { getHistory } = BillingService();
    const [openAddInvoice, setOpenAddInvoice] = useState(false)
    const [customerID, setCustomerID] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [actionType, setActionType] = useState(Action.Add)
    const [oneTimeId, setOneTimeId] = useState('')
    const [status, setStatus] = useState('')
    const [items, setItems] = useState<IOneTimeItem[]>([{ sub_product_id: '', quantity: 1, price: 0 }]);
    const [prefixModal, setPrefixModal] = useState<any>();
    const [prefixInit, setPrefixInit] = useState<any>()
    const [selectPrefixId, setSelectPrefixId] = useState<any>()
    const { alertError, alertSuccess } = useAlertDialog();

    // For Mock data
    const handleCustomerID = async (selected: any) => {
        try {
            if (!selected) {
                setCustomerID('')
                setSelectPrefixId('')
                setPrefixInit([])
                return;
            }
            setCustomerID(selected.customer_id)
            const body = {
                customer_id: selected.customer_id,
            }
            const res: any = await getOnetimeCustomerProducts(body)
            setPrefixInit(res.data)

        } catch (error) {
            console.error(error)
        }
    }

    const handleOpenAddInvoice = () => {
        setActionType(Action.Add)
        setStatus('DRAFT')
        // setPrefixInit()
        clearInputOfAddInvoice()
        setInvoiceDate(dayjs().toISOString());
        setOpenAddInvoice(true)
    }

    const handleOpenEditInvoice = async (id: string) => {
        try {
            if (!id) {
                return;
            }
            setActionType(Action.Edit)
            setOneTimeId(id)

            const res: any = await getOneTimeById(id)
            const req = {
                customer_id: res?.data?.customer_id,
            }

            // For get list of customer products for defualt value editing
            const response: any = await getOnetimeCustomerProducts(req)
            const editId = response?.data.find(
                (product: any) => product.prefix_name === res?.data?.prefix
            )?.customer_product_id || null;
            setPrefixInit(response?.data);
            setSelectPrefixId(editId)
            setCustomerID(res?.data?.customer_id)
            setItems(res?.data?.items)
            setOpenAddInvoice(true)
        } catch (error: any) {
            console.error(error);
            alertError(TranslateErrorCode(error?.data?.code) || "Error");
        }

    }

    const handleChangePrefix = (prefixValue: any) => {
        if (!prefixValue) {
            setPrefixModal('')
            setSelectPrefixId('')
            return;
        }
        setPrefixModal(prefixValue);
        setSelectPrefixId(prefixValue.customer_product_id)

    };

    const handleCloseAddInvoice = () => {
        setOpenAddInvoice(false)
        clearInputOfAddInvoice()
    }

    const clearInputOfAddInvoice = () => {
        setCustomerID('')
        setPrefixModal('')
        setInvoiceDate('')
        setSelectPrefixId('')
        setPrefixInit(null)
        setItems([{ sub_product_id: '', quantity: 1, price: 0 }])
    }

    const handleSubmitModal = async (data: any) => {
        try {
            const updatedItems = items.map((item: any) => ({
                ...item,
                price: parseFloat(item.price), // แปลง price เป็น number
            }));

            const body: any = { // ICreateOneTimeBillingResponse
                customer_id: customerID,
                customer_product_id: actionType === Action.Add ? prefixModal?.customer_product_id : selectPrefixId,
                items: updatedItems,
            }
            const res = actionType == Action.Add ? await createOneTimeBilling(body) : await updateOneTimeBillingById(oneTimeId, body)
            setOpenAddInvoice(false)
            alertSuccess(TranslateErrorCode(res.code));
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.data?.code));
        } finally {
            setTriggerHandleSearch(!triggerHandleSearch);
        }
    }

    const handleAddItem = () => {
        setItems([...items, { sub_product_id: '', quantity: 1, price: 0 }]); // Add a new empty item
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1); // Remove item at the given index
        setItems(newItems);
    };

    const handleItemChange = (index: number, key: string, value: any) => {
        const newItems: any = [...items];
        newItems[index][key] = value; // Update the specific item at the given index
        setItems(newItems);
    };
    // For history modal use
    const [rowModal, setRowModal] = useState<any>([])
    const [openHistory, setOpenHistory] = useState(false);
    const [wallet, setWallet] = useState('');
    const [walletNo, setWalletNo] = useState('');
    const handleOpenHistory = async (id: string, wallet_type: string, wallet_no: string) => {
        try {
            const response = await getHistory(id)
            setRowModal(response.data)
            setWallet(wallet_type)
            setWalletNo(wallet_no)
        } catch (error) {
            console.error(error)
        } finally {
            setOpenHistory(true)
        }
    };
    const handleCloseHistory = () => {
        setWallet('');
        setWalletNo('');
        setOpenHistory(false);
    }
    return {
        handleOpenAddInvoice,
        handleCloseAddInvoice,
        handleCustomerID,
        handleSubmitModal,
        openAddInvoice,
        handleChangePrefix,
        handleOpenEditInvoice,
        customerID,
        handleAddItem,
        handleRemoveItem,
        handleItemChange,
        items,
        prefixInit,
        selectPrefixId,
        actionType,
        // For history modal use
        handleOpenHistory,
        handleCloseHistory,
        openHistory,
        rowModal,
        wallet,
        walletNo,

    };
};
