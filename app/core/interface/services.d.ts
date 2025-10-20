import { ReactNode } from "react";

// ----------- Base Response ----------- //
export interface IResponseBase {
  code: number;
  message: string;
}

// ----------- Customer ----------- //

export interface IUpdateCustomerReq {
  email?: string;
  full_name?: string;
  customer_group?: string;
  line_id?: string;
  password?: string;
  phone_number?: string;
  dial_code?: string;
  telegram: string;
  username: string;
  what_app?: string;
  contact_name?: string;
  contact_telegram?: string;
  tag_reference?: string[];
  sale_owner?: string[];
}

export interface IUpdateCustomerRes {
  code: number;
  message: string;
}

export interface IAddCustomerReq {
  email: string;
  full_name?: string;
  customer_group?: string;
  line_id?: string;
  password?: string;
  phone_number?: string;
  dial_code?: string;
  telegram?: string;
  username: string;
  what_app?: string;
  note?: string;
  contact_name?: string;
  contact_telegram?: string;
  tag_reference?: string[];
  sale_owner?: string[];
}
export interface IAddCustomerRes {
  code: number;
  message: string;
}
export interface IGetCustomerOneReq {
  id: string;
}
export interface IProductListReq {
  code: number;
  message: string;
  data: IProductList[];
}
export interface IProductList {
  id: string;
  product_name: string;
  description: string;
  active: boolean;
  product_type: string;
  product_status: string;
  default_status: boolean;
  discounts: [];
  is_delete: boolean;
  created_at: string;
  updated_at: string;
}
export interface ICustomerListRes {
  code: number;
  message: string;
  data: ICustomer[];
}

export interface ICustomerListOneRes {
  code: number;
  message: string;
  data: ICustomer;
}
export interface ICustomerListOneComponent {
  user_name: string;
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  line_id: string;
  telegram: string;
  what_app: string;
  note: ReactNode;
}
export interface ICustomer {
  cash_pledge: number;
  created_at: string;
  email: string;
  full_name: string;
  id: string;
  is_set_password: boolean;
  line_id: string;
  otp_auth_url: string;
  otp_enabled: boolean;
  otp_secret: string;
  otp_verified: boolean;
  phone_number: string;
  role: number;
  telegram: string;
  updated_at: string;
  username: string;
  what_app: string;
}
export interface IDeleteDraftInvoiceReq {
  id: string;
}
export interface IDeleteEmployeeReq {
  id: string;
}
export interface IDeleteCustomerReq {
  id: string;
}
export interface IDeleteCustomerRes {
  code: number;
  message: string;
}
export interface ICustomerProductActiveReq {
  active: boolean;
  customer_id: string;
  customer_product_id: string;
}
export interface ICustomerSubProductActiveReq {
  active: boolean;
  customer_id: string;
  customer_product_id: string;
  customer_sub_product_id: string;
}

export interface ICustomerProductActiveRes {
  code: number;
  message: string;
}
export interface ICustomerSubProductActiveRes {
  code: number;
  message: string;
}

export interface IGetListCustomerReq {
  username: string;
  full_name: string;
  prefix: string;
  telegram: string;
  email: string;
  phone_number: string;
  start_date?: string;
  end_date?: string;
  client_name: string;
  page: number;
  limit: number;
}

export interface IGetListCustomerRes {
  customers: ICustomerList[];
  count_data: number;
  count_page: number;
}

export interface IGetCustomerRes {
  code: string;
  data: IGetListCustomerRes;
  message: string;
  pagination: IPagination;
}

export interface ICustomerList {
  id: string;
  username: string;
  full_name: string;
  email: string;
  cash_pledge: number;
  phone_number: string;
  line_id: string;
  telegram: string;
  what_app: string;
  role: number;
  created_at: string;
  updated_at: string;
}

export interface ICustomerProductReq {
  customer_id: string;
  id: string;
  product_id: string;
}
export interface ICustomerProductRes {
  active: boolean;
  discounts: Discount[];
  id: string;
  note: string;
  product_id: string;
  product_name: string;
  sub_product_list: SubProductList[];
}
export interface Discount {
  discount_id: string;
  discount_name: string;
}

export interface ProductLink {
  product_link_id: string;
  product_link_name: string;
}
export interface SubProductList {
  active: boolean;
  note: string;
  product_link: string;
  quantity: number;
  sub_product_id: string;
  sub_product_name: string;
}
export interface IAddCustomerProductReq {
  customer_id: string;
  products: ICustomerProduct[];
}
export interface IAddCustomerProductRes {
  code: number;
  message: string;
}
export interface ICustomerProduct {
  product_id: string;
  discounts?: string[];
  prefixes?: string;
  deposit?: number;
  client_name?: string;
  agent_id?: string;
  fiat_currency_id?: string;
  cryptocurrency_id?: string;
  opening_date?: string;
  closing_date?: string;
}

export interface ICustomerGetListReq {
  customer_id: string;
  product_name: string;
  prefix_name: string;
  client_name: string;
  active: string;
  limit: string;
  page: string;
}
export interface ICustomerGetListRes {
  code: number;
  message: string;
  data: ICustomerProductList[];
  pagination: IPagination;
}
export interface IGetCustomerProduct extends IResponseBase {
  data: ICustomerProductList;
}
export interface ICustomerProductList {
  customer_product_id: string;
  product_id: string;
  product_name: string;
  note: string;
  active: boolean;
  prefix_id: string;
  prefix_name: string;
  deposit: number;
  is_delete: boolean;
  discounts: [];
  cryptocurrency_id: string;
  cryptocurrency_name: string;
  fiat_currency_id: string;
  fiat_currency_name: string;
  created_at: string;
  updated_at: string;
}

export interface ICustomerSubProductReq {
  customer_id: string;
  customer_product_id: string;
  product_name?: string;
  prefix_name?: string;
  active?: string;
  limit: string | number;
  page: number;
}
export interface ICustomerSubProductRes {
  code: number;
  message: string;
  data: ICustomerSubProduct[];
  pagination: IPagination;
}
export interface ICustomerSubProductResComponents {
  id: string;
  subProductName: ReactNode;
  linkProductName: ReactNode;
  currency: ReactNode;
  quantity: ReactNode;
  status: ReactNode;
  note: ReactNode;
  createAt: ReactNode;
  updateAt: ReactNode;
  action: ReactNode;
  currency: ReactNode;
}
export interface ICustomerSubProduct {
  active: boolean;
  discounts: Discount[];
  customer_sub_product_id: string;
  detail: string;
  client_name: string;
  product_id: string;
  product_name: string;
  sub_product_list: SubProductList[];
  active: true;
  created_at: string;
  customer_sub_product_id: string;
  discounts: Discount[];
  note: string;
  product_links: ProductLink[];
  quantity: number;
  sub_product_id: string;
  sub_product_name: string;
  updated_at: string;
}

export interface IAddCustomerSubProductReq {
  active: boolean;
  customer_id: string;
  customer_product_id: string;
  detail?: string;
  discounts?: string[];
  product_links?: string[];
  quantity?: number;
  sub_product_id: string;
  note?: string;
  price?: number;
  pricing_type?: string;
  pricing_group_id?: string;
  fiat_id?: string;
  crypto_id?: string;
}
export interface IAddCustomerSubProductRes {
  active: string;
  customer_id: string;
  customer_product_id: string;
  client_name?: string;
  detail?: string;
  discounts?: string[];
  product_links?: string[];
  quantity?: number;
  sub_product_id: string;
  note?: string;
}
export interface IAddCustomerSubProductRes {
  code: number;
  message: string;
}
export interface ICustomerOneSubProduct {
  customer_id: string;
  customer_product_id: string;
  customer_sub_product_id: string;
}
export interface ICustomerOneSubProductRes {
  code: number;
  message: string;
  data: ICustomerSubProduct;
}
export interface IUpdateCustomerProductReq {
  active: boolean;
  customer_id: string;
  customer_product_id: string;
  deposit: number;
  client_name?: string;
  auto_product?: string;
  agent_id?: string;
  discounts: string[];
  prefixes: string;
  product_id: string;
  cryptocurrency_id: string;
  fiat_currency_id: string;
  opening_date?: string;
  closing_date?: string;
  note?: string;
  deposit_currency?: string;
}
export interface IUpdateCustomerProductRes {
  code: number;
  message: string;
}
export interface IUpdateCustomerSubProductReq {
  active: boolean;
  customer_id: string;
  customer_product_id: string;
  customer_sub_product_id: string;
  discounts?: string[];
  note?: string;
  product_links?: string[];
  quantity: number;
  price?: number;
  pricing_type?: string;
  pricing_group_id?: string;
  fiat_id?: string;
  crypto_id?: string;
}
export interface IUpdateCustomerSubProductRes {
  code: number;
  message: string;
}
export interface IDeleteCustomerProductReq {
  customer_id: string;
  customer_product_id: string;
}
export interface IDeleteCustomerProductRes {
  code: number;
  message: string;
}
export interface IDeleteCustomerSubProductReq {
  customer_sub_product_id: string;
}
export interface IDeleteOnetimeBillingReq {
  id: string;
}
export interface IDeleteCustomerSubProductRes {
  code: number;
  message: string;
}

// ----------- Product Management ----------- //

export interface IConfirmWLReq {
  product_id: string;
  month: string;
  year: string;
  prefix?: string
}

export interface IUpdateRateReq {
  rate: string;
  currency_type: string;
}

export interface IUpdateRateRes extends IResponseBase {
  data: {
    update_at: string;
    products: any
  };
}

export interface IPrefixesListRes {
  code: number;
  data: IPrefixes[];
  message: string;
}

export interface IPrefixes {
  product_link_id: string;
  product_link_name: string;
  "product-link-type": number;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
export interface IProductManagementListReq {
  productName: string;
  month?: string | null;
  year?: string | null;
  start?: number;
  end?: number;
}

export interface IProductManagementListRes extends IResponseBase {
  data: IProductManagementListData[];
  pagination: IPagination;
}

export interface IProductManagementListData {
  billing_cycle_id: string;
  billing_cycle: string;
  month: string;
  year: string;
  rate: string;
  currency_type: string;
  product: IProduct[];
}

export interface IProduct {
  product_id: string;
  product_name: string;
  status_pdf: string;
  action_by: string;
  action_time: string;
}

// ----------- Product ------------ //
export interface IProductResponseBase {
  active: true;
  created_at: string;
  default_status: true;
  description: string;
  discounts: Discount[];
  id: string;
  is_delete: true;
  product_name: string;
  product_status: string;
  product_type: string;
  type: string;
  updated_at: string;
}
export interface ISubProductResponseBase extends IProductResponseBase {
  price: number;
  ref: string;
}
export interface IProductListResponseBase {
  count_data: number;
  count_page: number;
  products: IProductResponseBase[];
}
export interface ISubProductListResponseBase {
  count_data: number;
  count_page: number;
  products: ISubProductResponseBase[];
}
export interface ICreateProductReq {
  active: boolean;
  description?: string;
  product_name: string;
  product_name_preview: string;
  wlsnapshot_data: string;
}
export interface ICreateProductRes extends IResponseBase {
  data: IProductResponseBase;
}
export interface IUpdateProductReq {
  active: boolean;
  description?: string;
  product_name: string;
  product_name_preview: string;
  wlsnapshot_data: string;
}
export interface IUpdateProductRes extends IResponseBase {
  data: IProductResponseBase;
}
export interface IDeleteProductReq {
  id: string;
}
export interface IDeleteProductRes extends IResponseBase {
  data: IProductResponseBase;
}
export interface IProductOneReq {
  id: string;
}
export interface IProductOneRes extends IResponseBase {
  data: IProductResponseBase;
}
export interface IProductAllReq {
  active?: string;
  limit: number;
  page: number;
  price?: number;
  product_name?: string;
}
export interface IProductAllRes extends IResponseBase {
  data: IProductListResponseBase;
}
export interface IProductAllResComponent {
  id: ReactNode;
  productName: ReactNode;
  productNamePreview: ReactNode;
  active: ReactNode;
  management: ReactNode;
}
export interface IProductListAllRes extends IResponseBase {
  data: IProductResponseBase[];
}
export interface ICreateSubProductReq {
  active: boolean;
  default_status: string;
  description?: string;
  product_name: string;
  product_name_preview: string;
  ref: string;
}
export interface ICreateSubProductRes extends IResponseBase {
  data: IProductResponseBase;
}
export interface IUpdateSubProductReq {
  active: boolean;
  default_status: string;
  description?: string;
  id: string;
  product_name: string;
  product_name_preview: string;
  ref: string;
}
export interface IUpdateSubProductRes extends IResponseBase {
  data: ISubProductResponseBase;
}
export interface IDeleteSubProductReq {
  id: string;
}
export interface IDeleteSubProductRes extends IResponseBase {
  data: IProductResponseBase;
}
export interface ISubProductOneReq {
  id: string;
}
export interface ISubProductOneRes extends IResponseBase {
  data: ISubProductResponseBase;
}
export interface ISubProductAllReq {
  active?: string;
  limit: number;
  page: number;
  price?: number;
  product_name?: string;
  ref: string;
}
export interface ISubProductAllRes extends IResponseBase {
  data: ISubProductListResponseBase;
}
export interface ISubProductAllResComponent {
  id: ReactNode;
  product_name: ReactNode;
  product_name_preview: ReactNode;
  active: ReactNode;
  management: ReactNode;
}
export interface ISubProductListAllReq {
  ref: string;
}
export interface ISubProductListAllRes extends IResponseBase {
  data: ISubProductResponseBase[];
}

// ----------- Discount ----------- //
export interface IDiscountResponseBase {
  active: boolean;
  created_at: string;
  description: string;
  discount_name: string;
  discount_type: number;
  id: string;
  updated_at: string;
  used_product: string;
  value: number;
}
export interface IDiscountListResponseBase {
  count_data: number;
  count_page: number;
  discounts: IDiscountResponseBase[];
}
export interface IDiscountAllReq {
  active?: string;
  discount_name?: string;
  discount_amount?: string | null;
  discount_type?: string | null;
  limit: number;
  page: number;
  value?: number;
}
export interface IDiscountAllRes extends IResponseBase {
  data: IDiscountListResponseBase;
}
export interface IDiscountAllResComponent {
  id: ReactNode;
  discount_name: ReactNode;
  discount_type?: ReactNode;
  value: ReactNode;
  active: ReactNode;
  management: ReactNode;
  currency_name?: ReactNode;
}
export interface ICreateDiscountReq {
  active: boolean;
  description?: string;
  discount_name: string;
  discount_type: string;
  currency_id: string;
  value: number;
}
export interface ICreateDiscountRes extends IResponseBase {
  data: IDiscountResponseBase;
}
export interface IUpdateDiscountReq {
  active: boolean;
  description?: string;
  discount_name: string;
  discount_type: number;
  currency_id: string;
  value: number;
}
export interface IUpdateDiscountRes extends IResponseBase {
  data: IDiscountResponseBase;
}
export interface IDiscountOneReq {
  id: string;
}
export interface IDiscountOneRes extends IResponseBase {
  data: IDiscountResponseBase;
}
export interface IDiscountListAllRes extends IResponseBase {
  data: IDiscountResponseBase[];
}

// ----------- Billing note ----------- //

export interface IBillingSearchReq {
  full_name?: string;
  username: string;
  invoice_no: string;
  product_id: string;
  prefix: string;
  telegram: string;
  year: string | number;
  month: string | number;
  status: string;
  limit: string;
  page: string;
}

export interface IBillingListResponseBase {
  next_status_options: string[];
  id: string;
  username: string;
  customer_id: string;
  invoice_no: string;
  invoice_status: string;
  total_payment: number;
  overdue_price: number;
  closing_date: string;
  payment_due_date: string;
  updated_at: string;
  next_status: string[];
  month: string;
  year: string;
}

export interface IBillingSearchRes extends IResponseBase {
  data: IBillingListResponseBase[];
  pagination: IPagination;
}

export interface IBillingNoteCustomerData {
  deposit: number;
  email: string;
  full_name: string;
  line_id: string;
  note: string;
  phone_number: string;
  telegram: string;
  total_credit_thb: number;
  total_credit_usdt: number;
  username: string;
  what_app: string;
}

export interface IBillingCustomerInfo extends IResponseBase {
  data: IBillingNoteCustomerData;
}

export interface IBillingList {
  quantity: number;
  status: string;
}

export interface IBillingListRes extends IResponseBase {
  data: IBillingList[];
}

// ----------- Pagination ----------- //
export interface IPagination {
  current_page: number;
  limit: number;
  total_pages: number;
  total: number;
  first: boolean;
  last: boolean;
}

// ----------- User service ----------- //
export interface IVerifyUserReq {
  email: string;
  password: string;
  captcha: string | null;
}
export interface ISignInReq {
  email: string;
  password: string;
}

// --------- Currency service --------- //
export interface ICurrencyRes extends IResponseBase {
  data: ICurrencyLists[];
}
export interface ICurrencyLists {
  _id: string;
  currency_name: string;
  currency_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// ----------- User tag service ----------- //
export interface IUserTagListRes {
  code: number;
  data: IUserTags[];
  message: string;
}

export interface IUserTags {
  id: string;
  name: string;
  type: string;
}
export interface ICreateUserTagRes {
  code: number;
  data: IUserTags;
  message: string;
}

// ----------- Grouping invoice interface ----------- //

interface IGroupProduct {
  customer_product_id: string;
  product_name: string;
  prefix_name: string;
}

interface ISetupInvoice {
  id: string;
  list: IGroupProduct[];
}

interface IGrouping {
  update_time: string;
  setup_invoice: ISetupInvoice[];
}

interface IGroupingInvoiceResponse {
  code: string;
  message: string;
  data: IGrouping;
}

// ----------- One time billing interface ----------- //

export interface IUpdateOneTimeStatusReq {
  id: string;
  status: string;
}

export interface IOneTimeItem {
  sub_product_id: string;
  quantity: number;
  price: number;
}

export interface IOneTimeBilling {
  customer_id: string;
  prefix: string;
  products: IOneTimeItem[];
  total_price: string;
  type: string;
  customer_name: string;
  invoice_number: string;
  product_name: string;
  status: string;
  created_date: string;
  id: string;
}

export interface IPagination {
  current_page: number;
  limit: number;
  total_pages: number;
  total: number;
  first: boolean;
  last: boolean;
}

export interface IOneTimeBillingListResponse {
  code: string;
  message: string;
  data: IOneTimeBilling[];
  pagination: IPagination;
}

export interface IOneTimeBillingListRequest {
  invoice_no: string;
  full_name?: string;
  prefix?: string;
  status?: string;
  month: number | string;
  year: number | string;
  page: number;
  limit: number;
}

export interface IOneTimeBillingResponse {
  code: string;
  message: string;
  data: IOneTimeBilling;
  pagination: IPagination;
}

export interface ICreateOneTimeBillingResponse {
  customer_id: string;
  prefix: string;
  products: IOneTimeItem[];
}

// --------- Pricing group service --------- //
export interface IGetPricingGroupReq {
  pricing_name: string;
  product_id: string;
  currency_id: string;
  page: number;
  limit: number;
}

export interface IGetPricingListReq {
  product_id: string;
  currency_id: string;
}

export interface IGetPricingGroupRes extends IResponseBase {
  data: IPricingGroupList[];
}

export interface IGetOnePricingGroupRes extends IResponseBase {
  data: IPricingGroupList;
}

export interface IPricingGroupList {
  id: string;
  pricing_name: string;
  product_name: string;
  product_id: string;
  price: number;
  currency_id: string;
  currency_name: string;
  updated_by: string;
}
export interface IPricingGroupResComponent {
  id: ReactNode;
  pricingGroupName: ReactNode;
  productName: ReactNode;
  price: ReactNode;
  currency: ReactNode;
  updatedBy: ReactNode;
  management: ReactNode;
}
export interface IAddPricingGroupReq {
  product_id: string;
  pricing_name: string;
  price: number;
  fiat_id: string;
}
export interface IUpdatePricingGroupReq {
  id: string;
  product_id: string;
  pricing_name: string;
  price: number;
  fiat_id: string;
}
export interface IPricingGroupRes {
  code: number;
  message: string;
}
export interface IDeletePriceingGroupReq {
  id: string;
}

// ----------- CR Ticket interface ----------- //

export interface ICreateCrTicketReq {
  priority: string;
  subject: string;
  description?: string;
  assignees?: string[];
  remark?: string;
  due_date?: string;
  files?: ICRTicketFileReq[];
}

export interface ICRTicketFileReq {
  id?: string;
  full_path: string;
  file_path: string;
  file_name: string;
  file_ext: string;
  created_at: string;
  updated_at: string;
  file_name_preview: string;
  file_size: number;
}

export interface IUpdateCrTicketReq {
  id: string;
  priority: string;
  subject: string;
  status: string;
  description?: string;
  assignees?: string[];
  remark?: string;
  due_date?: string;
  files?: ICRTicketFileReq[];
}

export interface IFileUpload {
  id: string;
  priority: string;
  subject: string;
  status: string;
  description?: string;
  assignees?: string[];
  remark?: string;
  due_date?: string;
  files?: ICRTicketFileReq[];
}

export interface IPaymentUploadResponse {
  id?: string;
  full_path: string;
  file_path: string;
  file_name: string;
  file_ext: string;
  created_at: string;
  updated_at: string;
  file_name_preview: string;
  file_size: number;
}