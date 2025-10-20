export interface ColumnDirectApiProps {
    columnId: "id" | "ticketNo" | "billingCycle" | "customerName" | "totalAmount" | "status" | "history" | "preview" | "management";
    label: string;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    align?: "right" | 'center' | 'left';
    bodyAlign?: "right" | 'center' | 'left';
    format?: (value: number) => string;
}

export interface ColumnPreviewDirectApiProps {
    columnId: "id" | "subProductName" | "currency" | "product" | "wlFiatAmount" | "percent" | "fiatAmount" | "totalAmount";
    label: string;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    align?: "right" | 'center' | 'left';
    bodyAlign?: "right" | 'center' | 'left';
    format?: (value: number) => string;
}