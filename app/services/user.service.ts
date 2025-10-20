import { config } from "@/core/config.js";
import { TokenType } from "@/core/enum";
import { ISignInReq, IVerifyUserReq } from "@/core/interface/services";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export interface IUserDataLoginResp {
    user: {
        id: string,
        username: string,
        full_name: string,
        email: string,
        cash_pledge: number,
        phone_number: string,
        line_id: string,
        telegram: string,
        what_app: string,
        role: number,
        created_at: string,
        updated_at: string
    },
    token: string
}
export interface IUserDataLoginReq {
    email: string
    password: string
}

class UserDataService {
    private endpoint: string
    private config: object
    private token: object

    constructor() {
        this.endpoint = config.app.api || "localhost";
        this.config = {
            // headers: { 'Authorization': `Bearer ${window.document.cookie.split('Token=')[1]}` }
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.TempToken)}` }
        };
        this.token = {
            headers: { 'Authorization': `Bearer ${Cookies.get(TokenType.AuthToken)}` }
        }
    }

    async signIn(body: ISignInReq) {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/auth/sign-in`, body);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    async verifyUser(body: IVerifyUserReq) {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/auth/verify`, body);
            return payload.data
        } catch (error) {
            throw error
        }
    }
    //t6dvaiyokk
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNjk4NzYzNTE1NDEzMTg0NzE0IiwiaXNfYWNjZXNzX2FwaSI6ZmFsc2UsInJvbGUiOiIwIiwidXNlcl9pZCI6IjY1NDBlODllZDVjOWNiYTYxNThjZjBlZCJ9.4OS0EApdmmEISbAnvxb74_8UOZ9eYg5wAjz7cVxkpHU
    async setPassword(password: string) {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/auth/set-psw`, { password }, this.config);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    async checkTwoFactor() {
        try {
            const payload = await axios.post(`${this.endpoint}/v1/auth/check/totp`, {}, this.config);
            return payload.data
        } catch (error) {
            throw error
        }
    }

    async sendTwoFactor(body: string, token: boolean) {
        console.log('Token real', this.token)
        console.log('Token Temp', this.config)
        console.log('Get cookie', Cookies.get(TokenType.AuthToken))
        try {
            const payload = await axios.post(`${this.endpoint}/v1/auth/verify/totp`, { "totp_key": body }, this.config);
            return payload.data
        } catch (error) {
            throw error
        }
    }
}

export default UserDataService;