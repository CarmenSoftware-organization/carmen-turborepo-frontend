import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { ParamsGetDto } from "@/dtos/param.dto";
import { backendApi } from "@/lib/backend-api";
import {
    getAllApiRequest,
    getByIdApiRequest,
    postApiRequest,
    updateApiRequest,
} from "@/lib/config.api";

const grnApiUrl = (buCode: string, id?: string) => {
    const baseUrl = `${backendApi}/api/inventory/${buCode}/grn`;
    return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
}