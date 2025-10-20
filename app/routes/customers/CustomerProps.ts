export interface ColumnCustomer {
  columnId: "id" | "username" | "customerName" | "invoice" | "management" | "prefix" | "telegram" | "email" | "createAt" | "updateAt" | "phoneNumber" | "sale-owner" | "tag-user";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right" | 'center' | 'left';
  format?: (value: number) => string;
}
export interface ColumnEmployee {
  columnId: "id" | "username" | "fullName" | "management" | "telegram" | "email" | "createAt" | "phoneNumber" | "resetPassword";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  align?: "right" | 'center' | 'left';
  bodyAlign?: "right" | 'center' | 'left';
  format?: (value: number) => string;
}
export interface ColumnDetail {
  columnId: "index" | "productName" | "currency" | "prefix" | "clientName" | "processing" | "status" | "note" | "processingStatus" | "createAt" | "updateAt" | "action" | "formLink";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right" | 'center' | 'left';
  format?: (value: number) => string;
}
export interface SubProductColumnProps {
  columnId: "subProductName" | "linkProductName" | "detail" | "quantity" | "price" | "discount" | "replacerPrice" | "status" | 'note';
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right" | 'center' | 'left';
  paddingLeft?: string;
  format?: (value: number) => string;
}
export interface ColumnSubProduct {
  columnId: "id" | "subProductName" | "linkProductName" | "currency" | "quantity" | "status" | "note" | "createAt" | "updateAt" | "action";
  label: string;
  minWidth?: number;
  width?: number;
  align?: "right" | 'center' | 'left';
  bodyAlign?: "right" | 'center' | 'left';
  paddingLeft?: string;
  format?: (value: number) => string;
}
export type customerProps = {
  id?: string,
  username: string,
  full_name?: string,
  customer_group?: string,
  email?: string,
  password?: string,
  cash_pledge?: string,
  phone_number?: string,
  line_id?: string,
  telegram: string,
  what_app?: string,
  note?: string,
  contact_name?: string,
  contact_telegram?: string,
  tag_reference?: string
  sale_owner?: string[]
}
export type subProductProps = {
  subProductName: string,
  quantity: number,
  price: number,
  discount: number,
  replacerPrice: number,
  status?: number,
}
export type customerProductProps = {
  productName: string,
  prefix: string,
  linkProduct: string,
  discount: string[],
  status?: boolean,
  note: string,
  createAt?: Date,
  updateAt?: Date

}
export type addProductCustomerProps = {
  customerName: string,
  productName: string,
  subProduct: [],
  discount: string,
}
export type customerModalProps = {
  addModal: boolean,
  editModal: boolean,
  deleteModal: boolean,
  addProductModal: boolean,
  pdfViewerModal: boolean,
  confirmTelegramModal: boolean,
  existingCustomerListModal: boolean
  saleOwnerModal: boolean
  tagUserModal: boolean
}
export interface productModalProps {
  addModal: boolean,
  editModal: boolean,
  deleteModal: boolean,
  addProductModal: boolean,
  customerProfileModal: boolean
}

export type subproductModalProps = {
  addModal: boolean,
  editModal: boolean,
  deleteModal: boolean,
  prefixModal: boolean
}
export type subProductCustomerProps = {
  active: string,
  customer_id: string,
  customer_product_id: string,
  client_name?: string,
  detail?: string,
  discounts?: string[],
  product_links?: string[],
  quantity?: number,
  sub_product_id: string,
  note?: string
}
export const discounts = [
  {
    value: "0",
    label: "0%",
  },
  {
    value: "10",
    label: "10%",
  },
  {
    value: "20",
    label: "20%",
  },
  {
    value: "30",
    label: "30%",
  },
];
export const productColumns: readonly SubProductColumnProps[] = [
  {
    columnId: "subProductName",
    label: "sub-product-name",
    minWidth: 120,
    width: 250,
  },
  {
    columnId: "linkProductName",
    label: "link-product-name",
    minWidth: 144,
    width: 250,
  },
  // {
  //   columnId: "detail",
  //   label: "Detail",
  //   minWidth: 160,
  //   width: 280,
  //   // align: "center",
  // },
  {
    columnId: "quantity",
    label: "quantity",
    minWidth: 100,
    align: "center",
  },
  {
    columnId: "status",
    label: "status",
    minWidth: 160,
    align: "center",
  },

  {
    columnId: "note",
    label: "note",
    minWidth: 160,
    // align: "center",
  },
];

const rows = [
  {
    subProductName: "s-sb1",
    quantity: 1,
    status: 2,
    note: "O",
  },
  {
    subProductName: "s-sb2",
    quantity: 1,
    status: 2,
    note: "G",
  },
];

export const customerColumns: readonly ColumnCustomer[] = [
  {
    columnId: "id",
    label: "number",
    minWidth: 50,
    width: 50,
    align: "center",
  },
  {
    columnId: "username",
    label: "username",
    minWidth: 80,
    width: 100,
    align: "center",
  },
  {
    columnId: "customerName",
    label: "customer-name",
    minWidth: 140,
    width: 140,
    align: "center",
  },
  {
    columnId: "prefix",
    label: "prefix-company",
    minWidth: 120,
    width: 120,
    align: "center",
  },
  {
    columnId: "telegram",
    label: "telegram",
    minWidth: 100,
    width: 100,
    align: "center",
  },
  {
    columnId: "email",
    label: "email",
    minWidth: 70,
    width: 70,
    align: "center",
  },
  {
    columnId: "phoneNumber",
    label: "phone-number",
    minWidth: 120,
    width: 120,
    align: "center",
  },
  {
    columnId: "createAt",
    label: "create-at",
    minWidth: 160,
    width: 160,
    align: "center",
  },
  {
    columnId: "updateAt",
    label: "update-at",
    minWidth: 160,
    width: 160,
    align: "center",
  },
  {
    columnId: "sale-owner",
    label: "sale-owner",
    minWidth: 150,
    width: 150,
    align: "center",
  },
  {
    columnId: "tag-user",
    label: "tag-user",
    minWidth: 80,
    width: 80,
    align: "center",
  },
  {
    columnId: "management",
    label: "customer-management",
    minWidth: 150,
    width: 150,
    align: "center",
  },
];

export const subProductHeaderColumns: readonly ColumnSubProduct[] = [
  {
    columnId: "subProductName",
    label: "sub-product-name",
    minWidth: 100,
    width: 300,
  },
  {
    columnId: "linkProductName",
    label: "prefix",
    minWidth: 100,
    align: "center",
  },
  {
    columnId: "quantity",
    label: "quantity",
    minWidth: 100,
    align: "center",
  },
  {
    columnId: "status",
    label: "status",
    minWidth: 100,
    align: "center",
  },
  {
    columnId: "note",
    label: "note",
    minWidth: 100,
    align: "center",
  },
  {
    columnId: "createAt",
    label: "create-at",
    minWidth: 100,
    align: "center",
  },
  {
    columnId: "updateAt",
    label: "update-at",
    minWidth: 100,
    align: "center",
  },
  {
    columnId: "action",
    label: "action",
    minWidth: 100,
    align: "center",
  },
];

export const subProductColumns: readonly ColumnSubProduct[] = [
  {
    columnId: "id",
    label: "number",
    minWidth: 50,
    width: 50,
    align: "center",
    bodyAlign: "center",
  },
  {
    columnId: "subProductName",
    label: "sub-product-name",
    minWidth: 100,
    width: 200,
    align: "center",
  },
  {
    columnId: "linkProductName",
    label: "prefix",
    minWidth: 100,
    align: "center",
    bodyAlign: "center",
  },
  {
    columnId: "currency",
    label: "currency",
    minWidth: 100,
    align: "center",
    bodyAlign: "center",
  },
  {
    columnId: "quantity",
    label: "quantity",
    minWidth: 100,
    align: "center",
    bodyAlign: "right",
  },
  {
    columnId: "status",
    label: "status",
    minWidth: 100,
    align: "center",
  },
  {
    columnId: "note",
    label: "note",
    minWidth: 100,
    align: "center",
    bodyAlign: "center",
  },
  {
    columnId: "createAt",
    label: "create-at",
    minWidth: 120,
    align: "center",
    bodyAlign: "right",
  },
  {
    columnId: "updateAt",
    label: "update-at",
    minWidth: 120,
    align: "center",
    bodyAlign: "right",
  },
  {
    columnId: "action",
    label: "action",
    minWidth: 100,
    align: "center",
  },
];

export const productNames = [
  "No Select",
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
];


export type Currency = {
  _id: string;
  currency_name: string;
};
