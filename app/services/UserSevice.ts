//interface user service
import {
    ISignInReq,
    IVerifyUserReq,
} from "@/core/interface/services";
import axios from "axios";
import ApiService from "./ServiceRequest"

const UserService = () => {
    const { endpoint, tempOption } = ApiService();
    const signIn = async(body: ISignInReq) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/sign-in`, body);
            return payload.data
        } catch (error) {
            throw error
        }
    }
    
    const verifyUser = async(body: IVerifyUserReq) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/verify`, body);
            return payload.data
        } catch (error) {
            throw error
        }
    }
    
    const setPassword = async(password: string) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/set-psw`, { password }, tempOption);
            return payload.data
        } catch (error) {
            throw error
        }
    }
    
    const checkTwoFactor = async() => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/check/totp`, {}, tempOption);
            return payload.data
        } catch (error) {
            throw error
        }
    }
    
    const sendTwoFactorUser = async(body: string, token: boolean) => {
        try {
            const payload = await axios.post(`${endpoint}/v1/auth/verify/totp`, { "totp_key": body }, tempOption);
            return payload.data
        } catch (error) {
            throw error
        }
    }
    
    return {
        signIn,
        verifyUser,
        setPassword,
        checkTwoFactor,
        sendTwoFactorUser
    }
}
export default UserService