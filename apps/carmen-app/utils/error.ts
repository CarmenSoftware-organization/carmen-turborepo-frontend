import { isAxiosError } from "axios";

export type ApiErrorType = "unauthorized" | "forbidden" | "server_error";

export function getApiErrorType(error: unknown): ApiErrorType {
  if (isAxiosError(error) && error.response?.status) {
    const status = error.response.status;
    if (status === 401) return "unauthorized";
    if (status === 403) return "forbidden";
    return "server_error";
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("unauthorized") || msg.includes("401")) return "unauthorized";
    if (msg.includes("forbidden") || msg.includes("403")) return "forbidden";
  }

  return "server_error";
}
