export function handleErrorCode(errorCode: number): string {
    switch (errorCode) {
        case 1001:
            return "Success.";
        case 1002:
            return "System can not validate data. Please try again later.";
        case 1003:
            return "System cannot process this request at the moment. Please try again later.";
        case 1004:
            return "Bad request. Please try again later.";
        case 1005:
            return "Authentication failed. Please sign in.";
        case 1006:
            return "The email or password is incorrect. Please try again later.";
        case 1007:
            return "Your captcha is invalid.";
        case 1008:
            return "You have already verified your identity.";
        case 1009:
            return "Please set a new password.";
        case 10010:
            return "Please confirm two factor authentication.";
        case 10011:
            return "Role is not found.";
        case 10012:
            return "Account is locked, Please Contact Admin.";
        case 10013:
            return "Two factor authentication is invalid.";
        case 10014:
            return "Email is not found.";
        case 10015:
            return "You don't have permission to access this page.";
        case 2001:
            return "Email already exists.";
        case 2002:
            return "Username already exists.";
        case 2003:
            return "Email and Username already exists.";
        case 2004:
            return "Customer is not found.";
        case 2005:
            return "Password is incorrect.";
        case 3001:
            return "Discount is not found.";
        case 3002:
            return "Discount already exists.";
        case 4001:
            return "Product is not found.";
        case 4002:
            return "Product name already exists.";
        case 4003:
            return "This Sub product name already exists, please enter another Sub product name.";
        case 4004:
            return "Sub product is not found, please try again later.";
        case 5001:
            return "Customer Product is not found.";
        case 5002:
            return "Prefix/Company already exists.";
        case 5003:
            return "Customer Sub Product is not found.";
        case 5004:
            return "Prefix/Company is reached maximum.";
        case 5005:
            return "Some product is not available.";
        case 5006:
            return "Some sub product is not available.";
        case 5007:
            return "Some discount is not available.";
        case 5008:
            return "Cannot get W/L.";
        default:
            return "Unknown error code.";
    }
}
