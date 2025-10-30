import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { backendApi } from "@/lib/backend-api";

const mockAdminPermission = {
  configuration: {
    currency: ["view_all", "create", "update", "delete"],
    exchange_rate: ["view_all", "create", "update", "delete"],
    delivery_point: ["view_all", "create", "update", "delete"],
    store_location: ["view_all", "create", "update", "delete"],
    department: ["view_all", "create", "update", "delete"],
    tax_profile: ["view_all", "create", "update", "delete"],
    extra_cost: ["view_all", "create", "update", "delete"],
    business_type: ["view_all", "create", "update", "delete"],
  },
  product_management: {
    unit: ["view_all", "create", "update", "delete"],
    product: ["view_all", "create", "update", "delete"],
    category: ["view_all", "create", "update", "delete"],
    report: ["view_all"],
  },
  vendor_management: {
    vendor: ["view_all", "create", "update", "delete"],
    price_list: ["view_all", "create", "update", "delete"],
    price_comparison: ["view_all"],
  },
  procurement: {
    purchase_request: [
      "view_all",
      "create",
      "update",
      "delete",
      "submit",
      "approve",
      "reject",
      "send_back",
    ],
    purchase_request_approval: ["view_all", "approve", "reject", "send_back"],
    purchase_request_template: ["view_all", "create", "update", "delete"],
    purchase_order: ["view_all", "create", "update", "delete", "submit", "approve", "reject"],
    goods_received_note: ["view_all", "create", "update", "delete"],
    credit_note: ["view_all", "create", "update", "delete"],
    vendor_comparison: ["view_all"],
    my_approval: ["view_all", "approve", "reject", "send_back"],
  },
  inventory_management: {
    stock_overview: ["view_all"],
    inventory_adjustment: ["view_all", "create", "update", "delete", "submit", "approve"],
    physical_count_management: ["view_all", "create", "update", "delete", "submit", "approve"],
    spot_check: ["view_all", "create", "update", "delete"],
    period_end: ["view_all", "create", "approve"],
  },
  finance: {
    account_code_mapping: ["view_all", "create", "update", "delete"],
    credit_term: ["view_all", "create", "update", "delete"],
  },
};

const mockLeaderPermission = {
  configuration: {
    currency: ["view_all", "create", "update"],
    exchange_rate: ["view_all", "create", "update"],
    delivery_point: ["view_all", "create", "update"],
    location: ["view_all", "create", "update"],
    department: ["view_dp", "update"],
    tax_profile: ["view_all", "create", "update"],
    extra_cost: ["view_all", "create", "update"],
    business_type: ["view_all"],
  },
  product_management: {
    unit: ["view_all", "create", "update"],
    product: ["view_all", "create", "update"],
    category: ["view_all", "create", "update"],
    report: ["view_all"],
  },
  vendor_management: {
    vendor: ["view_all", "create", "update"],
    price_list: ["view_all", "create", "update"],
    price_comparison: ["view_all"],
  },
  procurement: {
    purchase_request: ["view_dp", "create", "update", "submit", "approve", "reject", "send_back"],
    purchase_request_approval: ["view_dp", "approve", "reject", "send_back"],
    purchase_request_template: ["view_all", "create", "update"],
    purchase_order: ["view_dp", "create", "update", "approve", "reject"],
    goods_received_note: ["view_dp", "create", "update"],
    credit_note: ["view_dp", "create", "update"],
    vendor_comparison: ["view_all"],
    my_approval: ["view_all", "approve", "reject", "send_back"],
  },
  inventory_management: {
    stock_overview: ["view_dp"],
    inventory_adjustment: ["view_dp", "create", "update", "submit", "approve"],
    physical_count_management: ["view_dp", "create", "update", "submit", "approve"],
    spot_check: ["view_dp", "create", "update"],
    period_end: ["view_dp", "approve"],
  },
  finance: {
    account_code_mapping: ["view_all", "create", "update"],
    credit_term: ["view_all", "create", "update"],
  },
};

const mockUserPermission = {
  configuration: {
    currency: ["view_all"],
    exchange_rate: ["view_all"],
    delivery_point: ["view_all"],
    location: ["view_all"],
    department: ["view_dp"],
    tax_profile: ["view_all"],
    extra_cost: ["view_all"],
    business_type: ["view_all"],
  },
  product_management: {
    unit: ["view_all"],
    product: ["view_all"],
    category: ["view_all"],
    report: ["view_all"],
  },
  vendor_management: {
    vendor: ["view_all"],
    price_list: ["view_all"],
    price_comparison: ["view_all"],
  },
  procurement: {
    purchase_request: ["view", "create", "update", "submit"],
    purchase_request_approval: [],
    purchase_request_template: ["view_all"],
    purchase_order: ["view"],
    goods_received_note: ["view"],
    credit_note: ["view"],
    vendor_comparison: ["view_all"],
    my_approval: ["view", "approve", "reject"],
  },
  inventory_management: {
    stock_overview: ["view"],
    inventory_adjustment: ["view", "create", "submit"],
    physical_count_management: ["view", "create", "submit"],
    spot_check: ["view", "create"],
    period_end: ["view"],
  },
  finance: {
    account_code_mapping: ["view_all"],
    credit_term: ["view_all"],
  },
};

// Query keys for better cache management
export const authQueryKeys = {
  userProfile: ["userProfile"] as const,
  businessUnit: (buCode: string) => ["businessUnit", buCode] as const,
};

// Hook สำหรับ query user profile
export const useUserProfileQuery = (token: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: authQueryKeys.userProfile,
    queryFn: async () => {
      const url = `${backendApi}/api/user/profile`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // TODO: Remove mock permissions when backend is ready

      return {
        ...response.data,
        permissions: response.data.permissions || mockAdminPermission, // เปลี่ยนเป็น mockLeaderPermission หรือ mockUserPermission เพื่อทดสอบสิทธิ์อื่นๆ
      };
    },
    enabled: !!token && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// Hook สำหรับ mutation การเปลี่ยน business unit
export const useUpdateBusinessUnitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ token, buCode }: { token: string; buCode: string }) => {
      const url = `${backendApi}/api/business-unit/default`;
      const response = await axios.post(
        url,
        { tenant_id: buCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate และ refetch user profile หลังจากเปลี่ยน business unit
      queryClient.invalidateQueries({
        queryKey: authQueryKeys.userProfile,
      });

      // อัปเดต tenant ID ใน sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tenant_id", variables.buCode);
      }
    },
    onError: (error) => {
      console.error("Failed to update business unit:", error);
    },
  });
};

// Hook สำหรับ login mutation
export const useSignInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const url = `${backendApi}/api/auth/login`;
      const response = await axios.post(url, { email, password });
      return response.data;
    },
    onSuccess: () => {
      // Clear cache เพื่อให้โหลดข้อมูล user ใหม่
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Failed to sign in:", error);
    },
  });
};

// Hook สำหรับจัดการ cache การ logout
export const useAuthCache = () => {
  const queryClient = useQueryClient();

  const clearAuthCache = () => {
    queryClient.removeQueries({
      queryKey: authQueryKeys.userProfile,
    });
    queryClient.clear();
  };

  return { clearAuthCache };
};
