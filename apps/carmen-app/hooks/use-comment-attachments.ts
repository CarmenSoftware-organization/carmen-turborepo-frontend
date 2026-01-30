import { useMutation, useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import {
  getAllApiRequest,
  getByIdApiRequest,
  postApiRequest,
  updateApiRequest,
  deleteApiRequest,
} from "@/lib/config.api";
import { AttachmentDto, CreatePrCommentAttachmentDto } from "@/dtos/comment-attachments.dto";

// Get all comments for a PR
export const usePrCommentAttachmentsQuery = (token: string, buCode: string, prId: string) => {
  const API_URL = `${backendApi}/api/${buCode}/purchase-request/${prId}/comment`;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pr-comment-attachments", buCode, prId],
    queryFn: async () => {
      return await getAllApiRequest(API_URL, token, "Error fetching PR comments");
    },
    enabled: !!token && !!buCode && !!prId,
  });

  const comments = data?.data;
  const paginate = data?.paginate;

  return { comments, paginate, isLoading, error, refetch };
};

// Get comment by ID
export const usePrCommentAttachmentByIdQuery = (
  token: string,
  buCode: string,
  commentId: string
) => {
  const API_URL = `${backendApi}/api/${buCode}/purchase-request-comment/${commentId}`;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pr-comment-attachment", buCode, commentId],
    queryFn: async () => {
      return await getByIdApiRequest(API_URL, token, "Error fetching PR comment");
    },
    enabled: !!token && !!buCode && !!commentId,
  });
  return { comment: data, isLoading, error, refetch };
};

// Create comment
export const usePrCommentAttachmentsMutate = (token: string, buCode: string) => {
  const API_URL = `${backendApi}/api/${buCode}/purchase-request-comment`;

  return useMutation({
    mutationFn: async (payload: CreatePrCommentAttachmentDto) => {
      return await postApiRequest(API_URL, token, payload, "Error creating PR comment");
    },
  });
};

// Update Attachment
export const useUpdatePrCommentAttachmentFiles = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async ({ id, attachments }: { id: string; attachments: AttachmentDto[] }) => {
      const API_URL = `${backendApi}/api/${buCode}/purchase-request-comment/${id}/attachment`;
      return await updateApiRequest(
        API_URL,
        token,
        { attachments },
        "Error updating PR comment attachments",
        "PATCH"
      );
    },
  });
};

// Update comment
export const useUpdatePrCommentAttachment = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreatePrCommentAttachmentDto>;
    }) => {
      const API_URL = `${backendApi}/api/${buCode}/purchase-request-comment/${id}`;
      return await updateApiRequest(API_URL, token, data, "Error updating PR comment", "PATCH");
    },
  });
};

// Delete comment
export const useDeletePrCommentAttachment = (token: string, buCode: string) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const API_URL = `${backendApi}/api/${buCode}/purchase-request-comment/${id}`;
      return await deleteApiRequest(API_URL, token, "Error deleting PR comment");
    },
  });
};
