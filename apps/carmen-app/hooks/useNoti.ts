import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { backendApi } from "@/lib/backend-api";
import { NotiPayloadDto, NotificationResponse } from "@/dtos/notification.dto";

export const useSendNotification = (token: string | null) => {
  return useMutation({
    mutationFn: async (payload: NotiPayloadDto): Promise<NotificationResponse> => {
      const response = await axios.post(`${backendApi}/api/notifications`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
  });
};
