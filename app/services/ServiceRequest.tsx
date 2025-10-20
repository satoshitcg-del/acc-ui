import { config } from "@/core/config.js";
import { TokenType } from "@/core/enum";
import Cookies from "js-cookie";
import auth from "@/core/utils/auth/auth";

function ServiceRequest() {
    const { redirectToLogin } = auth();
    const endpoint = config.app.api || 'localhost';
    const tempOption = {
        // headers: { 'Authorization': `Bearer ${window.document.cookie.split('Token=')[1]}` }
        headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.TempToken)}` }
    };
    const option = {
        headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
    };

    const checkErrorResponse = (err: any) => {
        const errorCode = err?.response?.status

        console.log('checkErrorResponse active', typeof (errorCode));
        switch (errorCode) {
            case 401:
                return redirectToLogin();
            default:
                break;
        }
    }

    return {
        endpoint,
        option,
        tempOption,
        checkErrorResponse
    }
}
export default ServiceRequest;
