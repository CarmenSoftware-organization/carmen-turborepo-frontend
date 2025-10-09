import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { backendApi } from '@/lib/backend-api';

export interface NotificationPayload {
    title: string;
    message: string;
    type: 'info' | 'error' | 'warning' | 'success';
    category: 'system' | 'user-to-user';
    to_user_id: string;
    from_user_id: string;
}

interface NotificationResponse {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'error' | 'warning' | 'success';
    created_at: string;
}

export const useSendNotification = (token: string | null) => {
    return useMutation({
        mutationFn: async (payload: NotificationPayload): Promise<NotificationResponse> => {
            const response = await axios.post(
                `${backendApi}/api/notifications`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return response.data;
        }
    });
};
