import { ActiveTypeBooleanProps, ProductTypeProps, type ActiveTypeProps } from "./interface/types.js";

export const ActiveType: ActiveTypeProps[] = [
  { id: 1, type_name: "Active" },
  { id: 0, type_name: "Inactive" },
]

export const DiscountType: ActiveTypeProps[] = [
  { id: 1, type_name: "Static", type_value: "STATIC" },
  { id: 2, type_name: "Percentage", type_value: "PERCENT" },
]

export const DiscountTypeFilter: ActiveTypeProps[] = [
  { id: 0, type_name: "all", type_value: "ALL" },
  { id: 1, type_name: "static", type_value: "STATIC" },
  { id: 2, type_name: "percent", type_value: "PERCENT" },
]

export const ActiveTypeBoolean: ActiveTypeBooleanProps[] = [
  { id: 1, type_name: "active", type_value: true },
  { id: 0, type_name: "inactive", type_value: false },
]

export const ActiveTypeFilter: ActiveTypeProps[] = [
  { id: 2, type_name: "all", type_value: "ALL" },
  { id: 1, type_name: "active", type_value: "ACTIVE" },
  { id: 0, type_name: "inactive", type_value: "INACTIVE" },
]
// Mock
export const ProductType: ProductTypeProps[] = [
  { id: 0, name: "A" },
  { id: 1, name: "B" },
  { id: 3, name: "C" },
]

export const MenuSidebar = [
  {
    key: 'customer',
    icon: 'customer',
    route: '/customer',
    title: 'title.customer',
  },
  {
    key: 'product-cate',
    icon: 'product-cate',
    subFeatures: [
      {
        key: 'product',
        icon: 'product',
        route: '/products',
        title: 'title.product',
      },
      {
        key: 'product-management',
        icon: 'product-management',
        route: '/product-management',
        title: 'title.product-management',
      },
    ],
    title: 'title.product-cate',
  },
  {
    key: 'discount',
    icon: 'discount',
    route: '/discount',
    title: 'title.discount',
  },
  {
    key: 'invoice',
    icon: 'invoice',
    route: '/invoice',
    title: 'title.invoice',
  },
  {
    key: 'billing-cate',
    icon: 'billing-cate',
    subFeatures: [
      {
        key: 'billing-note',
        icon: 'billing-note',
        route: '/billing-note',
        title: 'title.billing-note',
      },
      {
        key: 'billing-note-multi',
        icon: 'billing-note-multi',
        route: '/billing-note-multi',
        title: 'title.billing-note',
      },
      {
        key: 'one-time-billing',
        icon: 'one-time-billing',
        route: '/one-time-billing',
        title: 'title.billing-note',
      },
    ],
    title: 'title.product-cate',
  },
];

export const BoxShadowButton = "0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)"
