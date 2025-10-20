export interface PricesProps {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
export interface AllDiscountProps {
  id?: string;
  discount_name: string;
  value: any;
  active: boolean;
  management: React.ReactNode;
}
export interface Column {
  id: "id" | "discount_name" | "value" | "active" | "management";
  label: string;
  minWidth?: number | string;
  width?: number | string;
  align?: "right" | "center";
  bodyAlign?: "right" | "center" | "left";
  format?: (value: number) => string;
}
export interface ColumnButton {
  id: "edit" | "delete";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
export interface DiscountProps {
  discount_name?: string;
  discount_type?: number | string;
  discount_amount?: number;
  discount_percentage?: number;
  description?: string;
  product_list?: string;
  used_product?: string;
  currency_id?: string;
  active?: boolean;
  id?: string;
  value?: number;
}


