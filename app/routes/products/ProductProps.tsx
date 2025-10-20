export interface PricesProps {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
export interface AllProductProps {
  id: string;
  product_name: string;
  active: boolean;
  management: React.ReactNode;
}
export interface Column {
  id: "id" | "productName" | "productNamePreview" | "active" | "management";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right" | "center";
  bodyAlign?: "left" | "right" | "center";
  format?: (value: number) => string;
}
export type productProps = {
  product_name: string,
  product_name_preview: string,
  description?: string,
  discount_name?: string[],
  type: string,
  active?: string
}

export interface DiscountTemplate {
  id: string,
  discount_name: string,
  description: string,
  type: string,
  value: number,
  product_list: Array<string>
  user_list: Array<string>
  apply_user_all: boolean,
  created_at: Date,
  updated_at: Date
}
