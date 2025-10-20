export interface IrowsProductManagement {
    billing_cycle: Date | string,
    billing_cycle_id: string,
    month: string,
    year: string,
    rate: string,
    currency_type: string,
    product: IrowsProductName[],
}

export interface IrowsProductName {
    product_id: string,
    product_name: string,
    status_pdf: string,
    current: number,
    all: number,
    action_by: string,
    action_time: Date | string
}