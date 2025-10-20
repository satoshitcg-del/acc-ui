import { useTranslation } from 'react-i18next';

export const useTranslateErrorCode = () => {
    const { t } = useTranslation()
    const TranslateErrorCode = (errorCode: number): string => {
        switch (errorCode) {
            case 1001:
                return t("error.1001")
            case 1002:
                return t("error.1002")
            case 1003:
                return t("error.1003")
            case 1004:
                return t("error.1004")
            case 1005:
                return t("error.1005")
            case 1006:
                return t("error.1006")
            case 1007:
                return t("error.1007")
            case 1008:
                return t("error.1008")
            case 1009:
                return t("error.1009")
            case 10010:
                return t("error.10010")
            case 10011:
                return t("error.10011")
            case 10012:
                return t("error.10012")
            case 10013:
                return t("error.10013")
            case 10014:
                return t("error.10014")
            case 10015:
                return t("error.10015")
            case 2001:
                return t("error.2001")
            case 2002:
                return t("error.2002")
            case 2003:
                return t("error.2003")
            case 2004:
                return t("error.2004")
            case 2005:
                return t("error.2005")
            case 2007:
                return t("error.2007")
            case 3001:
                return t("error.3001")
            case 3002:
                return t("error.3002")
            case 3003:
                return t("error.3003")
            case 4001:
                return t("error.4001")
            case 4002:
                return t("error.4002")
            case 4003:
                return t("error.4003")
            case 4004:
                return t("error.4004")
            case 4005:
                return t("error.4005")
            case 4007:
                return t("error.4007")
            case 5001:
                return t("error.5001")
            case 5002:
                return t("error.5002")
            case 5003:
                return t("error.5003")
            case 5004:
                return t("error.5004")
            case 5005:
                return t("error.5005")
            case 5006:
                return t("error.5006")
            case 5007:
                return t("error.5007")
            case 5008:
                return t("error.5008")
            case 5010:
                return t("error.5010")
            case 5011:
                return t("error.5011")
            case 5012:
                return t("error.5012")
            case 5018:
                return t("error.5018")
            case 6001:
                return t("error.6001")
            case 7001:
                return t("error.7001")
            case 7002:
                return t("error.7002")
            case 7003:
                return t("error.7003")
            case 7004:
                return t("error.7004")
            case 7005:
                return t("error.7005")
            case 7006:
                return t("error.7006")
            case 7007:
                return t("error.7007")
            case 8001:
                return t("error.8001")
            case 8002:
                return t("error.8002")
            case 8003:
                return t("error.8003")
            case 8004:
                return t("error.8004")
            case 9001:
                return t("error.9001")
            default:
                if (t(`error.${errorCode}`) != `error.${errorCode}`) {
                    return t(`error.${errorCode}`)
                }
                return t("error.page");
        }
    }

    return { TranslateErrorCode }
}

export const useTranslateBillingStatus = () => {
    const { t } = useTranslation()
    const TranslateBillingStatus = (status: string | undefined): string => {
        switch (status) {
            case "ALL" || "All":
                return t("billing.status-all")
            case "DRAFT" || "Draft":
                return t("billing.status-draft")
            case "PENDING" || "Pending":
                return t("billing.status-pending")
            case "DELIVERED" || "Delivered":
                return t("billing.status-delivered")
            case "PARTIALPAID" || "Partial paid":
                return t("billing.status-partial-paid")
            case "PAID" || "Paid":
                return t("billing.status-paid")
            case "OVERDUE" || "Overdue":
                return t("billing.status-overdue")
            case "VOID" || "Void":
                return t("billing.status-void")
            case "REFUND" || "Refund":
                return t("billing.status-refund")
            case "CANCEL" || "Cancel":
                return t("billing.status-cancel")
            default:
                return "Unknown status"
        }
    }

    const TranslateBillingOptionStatus = (arrStatus: Array<string> | undefined): Array<string> => {
        console.log("Arr : ", arrStatus)
        const result = arrStatus?.map(item => TranslateBillingStatus(item));
        console.log("Array : ", result)
        return result || []
    }

    return { TranslateBillingStatus, TranslateBillingOptionStatus }
}

export const useTranslateBillingOptionStatus = () => {
    const { t } = useTranslation()
    const TranslateBillingOptionStatus = (arrStatus: Array<string> | undefined): Array<string> => {
        // switch (status) {
        //     case "ALL" || "All":
        //         return t("billing.status-all")
        //     case "DRAFT" || "Draft":
        //         return t("billing.status-draft")
        //     case "PENDING" || "Pending":
        //         return t("billing.status-pending")
        //     case "DELIVERED" || "Delivered":
        //         return t("billing.status-delivered")
        //     case "PARTIALPAID" || "Partial paid":
        //         return t("billing.status-partial-paid")
        //     case "PAID" || "Paid":
        //         return t("billing.status-paid")
        //     case "OVERDUE" || "Overdue":
        //         return t("billing.status-overdue")
        //     case "VOID" || "Void":
        //         return t("billing.status-void")
        //     case "REFUND" || "Refund":
        //         return t("billing.status-refund")
        //     case "CANCEL" || "Cancel":
        //         return t("billing.status-cancel")
        //     default:
        //         return "Unknown status"
        // }
        return []
    }

    return { TranslateBillingOptionStatus }
}