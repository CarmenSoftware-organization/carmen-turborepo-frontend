import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";
import { CreateGRNDto } from "@/dtos/grn.dto";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/good-received-note`;

export const getAllGrn = async (
    token: string,
    buCode: string,
    params: ParamsGetDto
) => {

    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            query.append(key, String(value));
        }
    });
    const queryString = query.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    try {
        const response = await axios.get(url, {
            headers: requestHeaders(token)
        });

        return response.data;
    } catch (error) {
        return error
    }
};

export const getGrnById = async (token: string, buCode: string, id: string) => {
    const url = `${API_URL}/${id}`;
    try {
        const response = await axios.get(url, {
            headers: requestHeaders(token)
        });
        return response.data;
    } catch (error) {
        return error;
    }
};


export const postGrnService = async (token: string, buCode: string, data: CreateGRNDto) => {
    const url = `${API_URL}`;
    try {
        const response = await axios.post(url, data, {
            headers: requestHeaders(token)
        });

        if (response.status !== 201) {
            throw new Error(response.data.message);
        }

        return response.data;
    } catch (error) {
        console.log('error post grn service', error);
        return error;
    }
}


