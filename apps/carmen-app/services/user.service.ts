import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";
import { UserListDto } from "@/dtos/user.dto";

const API_URL = `${backendApi}/api/user`;

export const getUserList = async (token: string, buCode: string) => {
    const url = `${API_URL}`;
    const response = await axios.get<UserListDto[]>(url, {
        headers: requestHeaders(token, buCode)
    });

    console.log('response', response.data);

    return response.data;
}
