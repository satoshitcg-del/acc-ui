export enum StatusCode {
    success = 1001,
    fail = 1003,
    authorization = 1004
}

export enum Status {
    pending = 'WL_PENDING',
    invalid = 'WL_INVALID',
    success = 'WL_SUCCESS',
    no_prefix = 'NO_PREFIX',
    money_transfer = 'CASH',
    credit_accumulation = 'CREDIT',
    some_prefix_invalid = 'WL_SOME_PREFIX_INVALID',
}

export enum sweetalert {
    successTimer = 1000
}

export enum ValidateMessage {
    lessThan100 = 'must be less than 100',
    lessThan1000 = 'must be less than 1000',
    moreThan0 = 'must be more than 0',
    max50 = 'must be at most 50 characters',
    max255 = 'must be at most 255 characters',
    requiredField = 'is a required field',
    required = 'is required',
    positve = 'must be a positive number',
    typeNumber = 'must be type number',
    notIncludeSpecialCharatersAndMax255 = "not-special-char-and-max255",
    MAX_PREFIXES_ERROR_MESSAGE = "MAX-PREFIXES-ERROR-MESSAGE"
}

export enum BooleanString {
    true = 'true',
    false = 'false',
}

export enum AuthenticationPage {
    LoginForm = 'LoginForm',
    SetPasswordForm = 'SetPasswordForm',
    SetTwoFactorForm = 'SetTwoFactorForm',
    InputTwoFactorForm = 'InputTwoFactorForm',

}

export enum TokenType {
    AuthToken = "TOKEN",
    AuthTokenTemp = "AUTH_TOKEN_TEMP",
    Language = "LANGUAGE",
    NoneToken = "NONE",
    Token = "Token",
    TempToken = "TempToken",
}

export enum Locales {
    thai = "th",
    eng = "en",
}

export enum Action {
    Add = "add",
    Edit = "edit",
    Remove = "remove",
}

export enum AccountType {
    Customer = "customer",
    Product = "product",
    Billing = "billing",
}

export enum Money {
    Trillion = 1000000000000,
    min_pay = 0.01
}

export enum CurrencyType {
    FIAT = "FIAT",
    CRYPTO = "CRYPTO"
}

export enum FormLinkStatus {
    SUCCESS = "SUCCESS",
    CANCEL = "CANCEL",
    PENDING = "PENDING",
}

export enum UserTagType {
    PREFIX = "PREFIX",
    TAG_REFERENCE = "TAG_REFERENCE",
    SALE_OWNER = "SALE_OWNER"
}

export enum PricingType {
    DEFAULT = "DEFAULT",
    CUSTOM = "CUSTOM",
}

export enum ProductMasterType {
    SPORT_BOOK_V1 = "SPORT_BOOK_V1",
    SPORT_BOOK_V2 = "SPORT_BOOK_V2",
    AUTO = "AUTO",
    AUTO_PLAY = "AUTO_PLAY",
    DIRECT_API = "DIRECT_API",
    OTHER = "OTHER",
}

export enum SubProductMasterType {
    WINLOSE = "WINLOSE",
    MAINTENANCE = "MAINTENANCE",
    MONTHLY_FEE = "MONTHLY_FEE",
    OTHER = "OTHER",
    DEPOSIT = "DEPOSIT",
    WINLOSE_API = "WINLOSE_DIRECT_API",
}

export enum SelectedType {
    ALL = "ALL",
}

export const responseOfPrefixes = [ // Mock prefix lists
    {
        product_link_id: "66aa0778651caf0779f438af",
        product_link_name: "ambking"
    },
    {
        product_link_id: "66ab53a3aecda5410c94e493",
        product_link_name: "zgakk112"
    },
    {
        product_link_id: "66b5c470aecda5410c94e4af",
        product_link_name: "clubxbet"
    }
]

export enum DISCOUNT_TYPE_ENUM {
    ALL = "ALL",
    STATIC = "STATIC",
    PERCENT = "PERCENT",
}

// CR-Ticket
export enum CR_TICKET_PRIORITY {
    ALL = "ALL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}

export enum CR_TICKET_STATUS {
    ALL = "ALL",
    PENDING = "PENDING",
    PROCESS = "PROCESS",
    DONE = "DONE",
    CANCEL = "CANCEL",
}

export enum ONETIME_BILLING_STATUS {
    ALL = "ALL",
    DRAFT = "DRAFT",
    PENDING_APPROVED = "PENDING_APPROVED",
    APPROVED = "APPROVED",
    DELIVERED = "DELIVERED",
    PENDING_PAID = "PENDING_PAID",
    PAID = "PAID",
    REFUNDED = "REFUNDED",
    VOID = "VOID",
}

export enum BILLING_TYPE {
    ONE_TIME_BILLING = "ONE_TIME_BILLING",
    BILLING = "BILLING",
    DIRECT_API = "DIRECT_API",
}

export enum CREATE_DRAFT_TYPE {
    SINGLE = "single",
    RANGE = "range",
}

export enum BILLING_STATUS {
    ALL = "ALL",
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    DELIVERED = "DELIVERED",
    PARTIALPAID = "PARTIALPAID",
    PAID = "PAID",
    OVERDUE = "OVERDUE",
    VOID = "VOID",
    REFUND = "REFUND",
    CANCEL = "CANCEL",
    REJECT = "REJECT",
    VERIFYPAYMENT = "VERIFYPAYMENT",
}

export enum DIRECT_API_STATUS {
    ALL = "ALL",
    DRAFT = "DRAFT",
    APPROVED = "APPROVE",
    EDIT_REQUESTED = "EDIT_REQUESTED",
}

export enum CUSTOMER_GROUP {
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL",
}