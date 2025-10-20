import { useState } from "react";
import { AccountType } from "@/core/enum";
import type { IBillingNoteCustomerData, ICustomer } from "@/core/interface/services";
// service
import BillingService from "@/services/BillingService";
import CustomerService from "@/services/CustomerService";

// ----- Hook -----
import { useTranslateErrorCode } from '@/routes/product-management/hooks/useErrorCode';
import { t } from "i18next";
import { useAlertDialog } from "../../alert-dialog/useAlertDialog";

export const useCustomerProfile = () => {
    const { getCustomerInfo } = BillingService();
    const { getOne } = CustomerService();
    const [customerProfile, setCustomerProfile] = useState<IBillingNoteCustomerData | ICustomer | null>(null);
    const [profileType, setProfileType] = useState<string>("")
    const { TranslateErrorCode } = useTranslateErrorCode()
    const { alertError } = useAlertDialog();

    const [customerProfileModal, setCustomerProfileModal] = useState<boolean>(false);

    const handleOpenCustomerProfileModalTypeCustomer = async (id: string) => {
        const body = { id };
        const res = await getOne(body);
        setCustomerProfile(res.data as ICustomer);
        setCustomerProfileModal(true);
        setProfileType(AccountType.Customer)
    };

    const handleOpenCustomerProfileModalTypeBilling = async (invoice_id: string, customer_id: string) => {

        try {
            const res = await getCustomerInfo(invoice_id, customer_id)
            setCustomerProfile(res.data as IBillingNoteCustomerData);
            setCustomerProfileModal(true);
            setProfileType(AccountType.Billing)
        } catch (error: any) {
            alertError(TranslateErrorCode(error?.response?.data?.code));
        }

    }


    return {
        customerProfile,
        profileType,
        customerProfileModal,
        setCustomerProfileModal,
        handleOpenCustomerProfileModalTypeCustomer,
        handleOpenCustomerProfileModalTypeBilling
    }
}


