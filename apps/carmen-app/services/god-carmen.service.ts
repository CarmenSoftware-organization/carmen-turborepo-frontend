import { backendApi } from "@/lib/backend-api";
import axios from "axios";

const API_INVITE_USER = `${backendApi}/api/auth/invite-user`;
const API_REGISTER_CONFIRM = `${backendApi}/api/auth/register-confirm`;

const API_USER_CLUSTER = `${backendApi}/api/api-system/user/clusterr`;

const API_BU_UNIT = `${backendApi}/api/api-system/business-unit`;
const API_USER_BU_UNIT = `${backendApi}/api/api-system/user/business-unit`;

export const inviteUser = async (email: string) => {
    try {
        const response = await axios.post(API_INVITE_USER, {
            email,
        });
        return response.data;
    } catch (error: any) {
        console.error("Invite failed:", error.response?.data ?? error.message);
    }
};

type UserInfo = {
    first_name: string
    middle_name: string
    last_name: string
}

export const confirmRegister = async (
    email_token: string,
    password: string,
    user_info: UserInfo
) => {
    try {
        const response = await axios.post(API_REGISTER_CONFIRM, {
            email_token,
            password,
            user_info
        });
        return response.data;
    } catch (error: any) {
        console.error("Confirm register failed:", error.response?.data ?? error.message);
    }
}
