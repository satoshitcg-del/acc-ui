export interface PricesProps {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
export interface AllSubProductProps {
  id: number;
  product_name: string;
  price: number;
  active: boolean;
  management: React.ReactNode;
}
export interface Column {
  id: "id" | "product_name" | "product_name_preview" | "price" | "active" | "management";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right" | "center";
  bodyAlign?: "left" | "right" | "center";
  format?: (value: number) => string;
}
export interface ColumnButton {
  id: "edit" | "delete";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
export interface SubProductProps {
  product_name: string;
  product_name_preview: string;
  description?: string;
  type: string;
  discount?: string[];
  active?: string
}
