export const categoryList: IBillingCategory[] = [
    {
        name: "All",
        status: "ALL",
        activeColor: "#3956A5",
    },
    {
        name: "Draft",
        status: "DRAFT",
        activeColor: "#F7CD00",
    },
    {
        name: "Pending",
        status: "PENDING",
        activeColor: "#EA6528",
    },
    {
        name: "Approve",
        status: "APPROVE",
        activeColor: "#B8CB49",
    },
    {
        name: "Delivered",
        status: "DELIVERED",
        activeColor: "#3956A5",
    },
    {
        name: "Verifypayment",
        status: "VERIFYPAYMENT",
        activeColor: "#EA035F",
    },
    {
        name: "Partial paid",
        status: "PARTIALPAID",
        activeColor: "#5EAA93",
    },
    {
        name: "Paid",
        status: "PAID",
        activeColor: "#138A5C",
    },
    {
        name: "Overdue",
        status: "OVERDUE",
        activeColor: "#D43D45",
    },
    {
        name: "Void",
        status: "VOID",
        activeColor: "#7B2930",
    },
    {
        name: "Refund",
        status: "REFUND",
        activeColor: "#864792",
    },
    {
        name: "Cancel",
        status: "CANCEL",
        activeColor: "#E34E74",
    },
    {
        name: "Reject",
        status: "REJECT",
        activeColor: "#DF204C",
    }
]

export function getFilteredCategories(
    statusArray: string[],
    categoryList: IBillingCategory[]
): IBillingCategory[] {
    return statusArray.map((status: string) => {
        const category = categoryList.find((category: IBillingCategory) => category.status === status);
        return category ? { ...category } : null;
    }).filter((item): item is IBillingCategory => item !== null);
}

export const StatusEnum = {
    APPROVE: "Approve"
}

export const statusList = [
    "All",
    "Draft",
    "Pending",
    "Approve",
    "Delivered",
    "Partial paid",
    "Paid",
    "Overdue",
    "Void",
    "Refund",
    "Cancel",
]

export interface ICustomerModal {
    id: string
    full_name: string
    username: string
    email: string
    credits: {
        usd: number
        thb: number
    }
    deposit: number
    line_id: string
    telegram: string
    phone_number: string
    note: string
}
export interface IHistoryModal {
    cname: string
    invoiceNo: number
    invoiceHistoryList: InvoiceHistoryList[]
}
export interface INoteModal {
    cname: string
    invoiceNo: number
    invoiceHistoryList: InvoiceHistoryList[]
    note: string
}

export interface InvoiceHistoryList {
    date: string
    statusHistory: StatusHistory[]
}

export interface StatusHistory {
    time: string
    description: string
    operate: string
    status: string
}

export interface IBillingNoteDashboard {
    status: string
    quantity: number
}

export interface IBillingCategory {
    name: string;
    status: string;
    activeColor: string;
}

export const reasons = ["TURNOFF_SYSTEM", "SYSTEM_ERROR", "Refund_W/L"]

export const categoryMultiple = ["DRAFT", "PENDING", "OVERDUE"]

export const categoryOneTimeBilling = ["DRAFT", "PENDING_APPROVED", "APPROVED", "REJECT", "DELIVERED", "PENDING", "PAID", "VOID", "REFUNDED"]

export const onetimeStatusCategory: IBillingCategory[] = [
    {
        name: "All",
        status: "ALL",
        activeColor: "#3956A5",
    },
    {
        name: "Draft",
        status: "DRAFT",
        activeColor: "#F7CD00",
    },
    {
        name: "Pending_approved",
        status: "PENDING_APPROVED",
        activeColor: "#8E7CC3",
    },
    {
        name: "Approved",
        status: "APPROVED",
        activeColor: "#B8CB49",
    },
    {
        name: "Delivered",
        status: "DELIVERED",
        activeColor: "#3956A5",
    },
    {
        name: "Pending_paid",
        status: "PENDING_PAID",
        activeColor: "#E06666",
    },
    {
        name: "Checking_paid",
        status: "CHECKING_PAID",
        activeColor: "#138A5C",
    },
    {
        name: "Paid",
        status: "PAID",
        activeColor: "#138A5C",
    },
    {
        name: "Void",
        status: "VOID",
        activeColor: "#7B2930",
    },
    {
        name: "Refunded",
        status: "REFUNDED",
        activeColor: "#864792",
    },
]

export const chipCategoryForHistory: IBillingCategory[] = [
    {
        name: "All",
        status: "ALL",
        activeColor: "#3956A5",
    },
    {
        name: "Draft",
        status: "DRAFT",
        activeColor: "#F7CD00",
    },
    {
        name: "Pending_approved",
        status: "PENDING_APPROVED",
        activeColor: "#8E7CC3",
    },
    {
        name: "Approved",
        status: "APPROVED",
        activeColor: "#B8CB49",
    },
    {
        name: "Delivered",
        status: "DELIVERED",
        activeColor: "#3956A5",
    },
    {
        name: "Pending_paid",
        status: "PENDING_PAID",
        activeColor: "#E06666",
    },
    {
        name: "Checking_paid",
        status: "CHECKING_PAID",
        activeColor: "#138A5C",
    },
    {
        name: "Paid",
        status: "PAID",
        activeColor: "#138A5C",
    },
    {
        name: "Void",
        status: "VOID",
        activeColor: "#7B2930",
    },
    {
        name: "Refunded",
        status: "REFUNDED",
        activeColor: "#864792",
    },
    {
        name: "Pending",
        status: "PENDING",
        activeColor: "#EA6528",
    },
    {
        name: "Approve",
        status: "APPROVE",
        activeColor: "#B8CB49",
    },
    {
        name: "Verifypayment",
        status: "VERIFYPAYMENT",
        activeColor: "#EA035F",
    },
    {
        name: "Partial paid",
        status: "PARTIALPAID",
        activeColor: "#5EAA93",
    },
    {
        name: "Overdue",
        status: "OVERDUE",
        activeColor: "#D43D45",
    },
    {
        name: "Refund",
        status: "REFUND",
        activeColor: "#864792",
    },
    {
        name: "Cancel",
        status: "CANCEL",
        activeColor: "#E34E74",
    },
    {
        name: "Reject",
        status: "REJECT",
        activeColor: "#DF204C",
    },
    {
        name: "Editrequested",
        status: "EDIT_REQUESTED",
        activeColor: "#DF204C",
    },
]