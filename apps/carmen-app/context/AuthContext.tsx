"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  useUserProfileQuery,
  useUpdateBusinessUnitMutation,
  useAuthCache,
} from "@/hooks/use-auth-query";
import { toastSuccess } from "@/components/ui-custom/Toast";

enum LOCAL_STORAGE {
  ACCESS_TOKEN = "access_token",
  BU_CODE = "bu_code",
  REFRESH_TOKEN = "refresh_token",
  BU_ID = "bu_id",
  USER = "user",
}

// Permission Types
// Base actions ที่ใช้ทั่วไป
export type BasePermissionAction =
  | "view_all"
  | "view"
  | "view_dp" // view by department
  | "create"
  | "update"
  | "delete";

// Workflow actions สำหรับ document ที่มี approval flow
export type WorkflowPermissionAction = "approve" | "reject" | "send_back" | "submit";

// รวม action ทั้งหมด
export type PermissionAction = BasePermissionAction | WorkflowPermissionAction;

// Module หลักของระบบ
export type PermissionModule =
  | "configuration"
  | "product_management"
  | "vendor_management"
  | "procurement";

// Resources แต่ละ module
export type ConfigurationResource =
  | "currency"
  | "exchange_rates"
  | "delivery_point"
  | "store_location"
  | "department"
  | "tax_profile"
  | "extra_cost"
  | "business_type";

export type ProductManagementResource = "product" | "category" | "report" | "unit";

export type VendorManagementResource = "vendor" | "vendor_contact";

export type ProcurementResource = "purchase_order" | "purchase_request" | "grn";

// Helper type: ดึง resource type ตาม module
export type ResourceByModule<T extends PermissionModule> = T extends "configuration"
  ? ConfigurationResource
  : T extends "product_management"
    ? ProductManagementResource
    : T extends "vendor_management"
      ? VendorManagementResource
      : T extends "procurement"
        ? ProcurementResource
        : never;

// Permission structure - ใช้ string[] เพื่อรองรับ dynamic actions
export type Permissions = {
  configuration?: Partial<Record<ConfigurationResource, string[]>>;
  product_management?: Partial<Record<ProductManagementResource, string[]>>;
  vendor_management?: Partial<Record<VendorManagementResource, string[]>>;
  procurement?: Partial<Record<ProcurementResource, string[]>>;
};

interface UserInfo {
  firstname: string;
  middlename?: string;
  lastname: string;
}

interface BusinessUnit {
  id: string;
  name: string;
  code: string;
  is_default?: boolean;
  department?: {
    id: string;
    is_hod: boolean;
    name: string;
  };
  config?: {
    calculation_method?: string;
    currency_base?: string;
    date_format?: string;
    date_time_format?: string;
    long_time_format?: string;
    perpage?: number;
    short_time_format?: string;
    timezone?: string;
    amount?: {
      locales: string;
      minimumFractionDigits: number;
    };
    quantity?: {
      locales: string;
      minimumIntegerDigits: number;
    };
    recipe?: {
      locales: string;
      minimumIntegerDigits: number;
    };
  };
}

interface UserData {
  id: string;
  email: string;
  user_info: UserInfo;
  business_unit: BusinessUnit[];
}

interface User {
  data: UserData;
  permissions: Permissions;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isChangingBu: boolean;
  user: User | null;
  permissions: Permissions | undefined;
  setSession: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  token: string;
  getServerSideToken: () => string;
  buId: string;
  handleChangeBu: (buId: string) => void;
  departments: BusinessUnit["department"] | null;
  currencyBase: NonNullable<BusinessUnit["config"]>["currency_base"] | null;
  dateFormat: NonNullable<BusinessUnit["config"]>["date_format"] | null;
  dateTimeFormat: NonNullable<BusinessUnit["config"]>["date_time_format"] | null;
  longTimeFormat: NonNullable<BusinessUnit["config"]>["long_time_format"] | null;
  perpage: NonNullable<BusinessUnit["config"]>["perpage"] | null;
  shortTimeFormat: NonNullable<BusinessUnit["config"]>["short_time_format"] | null;
  timezone: NonNullable<BusinessUnit["config"]>["timezone"] | null;
  amount: NonNullable<BusinessUnit["config"]>["amount"] | null;
  quantity: NonNullable<BusinessUnit["config"]>["quantity"] | null;
  recipe: NonNullable<BusinessUnit["config"]>["recipe"] | null;
  buCode: string;
  businessUnits: BusinessUnit[] | null;
}

// Create context with a default value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  isChangingBu: false,
  user: null,
  permissions: undefined,
  setSession: () => {},
  logout: () => {},
  token: "",
  getServerSideToken: () => "",
  buId: "",
  handleChangeBu: () => {},
  departments: null,
  currencyBase: null,
  dateFormat: null,
  dateTimeFormat: null,
  longTimeFormat: null,
  perpage: null,
  shortTimeFormat: null,
  timezone: null,
  amount: null,
  quantity: null,
  recipe: null,
  buCode: "",
  businessUnits: null,
});

// ฟังก์ชันช่วยสำหรับดึง token ฝั่ง client
export function getServerSideToken(): string {
  if (globalThis.window !== undefined) {
    return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) ?? "";
  }
  return "";
}

// Provider component
export function AuthProvider({ children }: { readonly children: ReactNode }) {
  // State สำหรับ track hydration
  const [isHydrated, setIsHydrated] = useState(false);
  const [buId, setBuId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [buCode, setBuCode] = useState<string>("");
  const [isFromStorageEvent, setIsFromStorageEvent] = useState(false);
  const [isChangingBu, setIsChangingBu] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Hydration effect - รันครั้งเดียวหลัง mount
  useEffect(() => {
    if (globalThis.window !== undefined) {
      const storedBuId = localStorage.getItem(LOCAL_STORAGE.BU_ID) ?? "";
      const storedToken = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) ?? "";
      const storedBuCode = localStorage.getItem(LOCAL_STORAGE.BU_CODE) ?? "";
      setBuId(storedBuId);
      setToken(storedToken);
      setBuCode(storedBuCode);
      setIsHydrated(true);
    }
  }, []);

  // ตรวจสอบว่าอยู่ในหน้า sign-in หรือไม่
  const locale = pathname?.split("/")[1] || "en";
  const signInPage = `/${locale}/sign-in`;
  const dashboardPage = `/${locale}/dashboard`;
  const isSignInPage = pathname === signInPage;
  const isDashboardPage = pathname === dashboardPage;

  // Reset isChangingBu เมื่อถึงหน้า dashboard แล้ว
  useEffect(() => {
    if (isDashboardPage && isChangingBu) {
      setIsChangingBu(false);
    }
  }, [isDashboardPage, isChangingBu]);

  // ใช้ TanStack Query สำหรับ user profile - รอให้ hydrated ก่อน
  const { data: user, isLoading: isUserLoading } = useUserProfileQuery(
    token,
    isHydrated && !isSignInPage && !!token
  );

  const updateBusinessUnitMutation = useUpdateBusinessUnitMutation();
  const { clearAuthCache } = useAuthCache();

  const {
    departments,
    currencyBase,
    dateFormat,
    dateTimeFormat,
    longTimeFormat,
    perpage,
    shortTimeFormat,
    timezone,
    amount,
    quantity,
    recipe,
  } = useMemo(() => {
    const defaultBu = user?.data.business_unit?.find((bu: BusinessUnit) => bu.is_default === true);

    const firstBu = user?.data.business_unit?.[0];
    const selectedBu = defaultBu || firstBu;

    return {
      departments: defaultBu?.department || null,
      currencyBase: selectedBu?.config?.currency_base?.code || "THB",
      dateFormat: selectedBu?.config?.date_format || null,
      dateTimeFormat: selectedBu?.config?.date_time_format || null,
      longTimeFormat: selectedBu?.config?.long_time_format || null,
      perpage: selectedBu?.config?.perpage || null,
      shortTimeFormat: selectedBu?.config?.short_time_format || null,
      timezone: selectedBu?.config?.timezone || null,
      amount: selectedBu?.config?.amount || null,
      quantity: selectedBu?.config?.quantity || null,
      recipe: selectedBu?.config?.recipe || null,
    };
  }, [user]);

  useEffect(() => {
    if (user?.data.business_unit?.length && isHydrated) {
      const defaultBu = user.data.business_unit.find((bu: BusinessUnit) => bu.is_default === true);
      const firstBu = user.data.business_unit[0];
      const newBuId = defaultBu?.id ?? firstBu?.id ?? "";
      const newBuCode = defaultBu?.code ?? firstBu?.code ?? "";

      // Set buId และ buCode แม้ว่าจะเหมือนเดิมก็ตาม (สำหรับ initial load)
      if (newBuId && newBuCode) {
        if (newBuId !== buId) {
          setBuId(newBuId);
        }
        if (newBuCode !== buCode) {
          setBuCode(newBuCode);
        }

        // อัปเดต localStorage เสมอ
        localStorage.setItem(LOCAL_STORAGE.BU_ID, newBuId);
        localStorage.setItem(LOCAL_STORAGE.BU_CODE, newBuCode);
      }
    }
  }, [user, isHydrated]);

  // จัดการการเข้าสู่ระบบ
  const setSession = useCallback(async (accessToken: string, refreshToken: string) => {
    if (accessToken && globalThis.window !== undefined) {
      localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
      setToken(accessToken);
    }

    if (refreshToken && globalThis.window !== undefined) {
      localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, refreshToken);
    }
  }, []);

  // จัดการการออกจากระบบ
  const logout = useCallback(() => {
    // ป้องกันการ trigger storage event ซ้ำเมื่อมาจาก cross-tab sync
    if (isFromStorageEvent) {
      return;
    }

    // ลบ tokens และ cache
    if (globalThis.window !== undefined) {
      localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.BU_ID);
      localStorage.removeItem(LOCAL_STORAGE.USER);
      localStorage.removeItem(LOCAL_STORAGE.BU_CODE);
    }

    // ล้าง cache และ reset state
    clearAuthCache();
    setBuId("");
    setToken("");
    setBuCode("");
    // เปลี่ยนเส้นทางไปหน้า sign-in
    router.push(signInPage);
  }, [router, signInPage, clearAuthCache, isFromStorageEvent]);

  // ดึง token สำหรับ server actions
  const getServerSideToken = useCallback(() => {
    if (globalThis.window !== undefined) {
      return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) ?? "";
    }
    return "";
  }, []);

  // ฟังก์ชันจัดการการเปลี่ยน business unit
  const handleChangeBu = useCallback(
    async (id: string) => {
      if (!id || !token || !user?.data.business_unit?.length) return;

      // ป้องกันการ trigger ซ้ำเมื่อมาจาก cross-tab sync
      if (isFromStorageEvent) {
        return;
      }

      // หา business unit ที่เลือกเพื่อดึง bu_code
      const selectedBu = user.data.business_unit.find((bu: BusinessUnit) => bu.id === id);

      if (!selectedBu) {
        console.error("Business unit not found for id:", id);
        return;
      }

      // เริ่มแสดง global loading
      setIsChangingBu(true);

      updateBusinessUnitMutation.mutate(
        { token, buCode: id },
        {
          onSuccess: () => {
            setBuId(id);
            setBuCode(selectedBu.code);

            // อัปเดต localStorage เพื่อ sync กับ tabs อื่น
            if (globalThis.window !== undefined) {
              localStorage.setItem(LOCAL_STORAGE.BU_ID, id);
              localStorage.setItem(LOCAL_STORAGE.BU_CODE, selectedBu.code);
            }
            router.push(dashboardPage);
            toastSuccess({ message: "Changed Business Unit Success" });
            // Note: isChangingBu จะถูก reset เมื่อหน้า dashboard โหลดเสร็จ
          },
          onError: () => {
            // หยุดแสดง loading เมื่อเกิด error
            setIsChangingBu(false);
          },
        }
      );
    },
    [
      token,
      updateBusinessUnitMutation,
      isFromStorageEvent,
      user?.data.business_unit,
      router,
      dashboardPage,
    ]
  );

  // จัดการการล้าง data เมื่อใน sign-in page (แต่ไม่ใช่เมื่อกำลัง login)
  useEffect(() => {
    if (isSignInPage && isHydrated && !token) {
      // ล้าง session เฉพาะเมื่อไม่มี token (ไม่ได้กำลัง login)
      if (globalThis.window !== undefined) {
        localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE.BU_ID);
        localStorage.removeItem(LOCAL_STORAGE.USER);
        localStorage.removeItem(LOCAL_STORAGE.BU_CODE);
      }
      clearAuthCache();
      setBuId("");
      setToken("");
      setBuCode("");
    }
  }, [isSignInPage, clearAuthCache, isHydrated, token]);

  // Cross-Tab Synchronization - ฟังการเปลี่ยนแปลงใน localStorage
  useEffect(() => {
    if (!isHydrated) return;

    const handleStorageChange = (event: StorageEvent) => {
      // ตรวจสอบเฉพาะ keys ที่เกี่ยวข้องกับ auth
      if (!event.key || !["access_token", "refresh_token", "bu_id"].includes(event.key)) {
        return;
      }

      setIsFromStorageEvent(true);

      switch (event.key) {
        case "access_token":
          if (event.newValue === null) {
            setToken("");
            setBuId("");
            setBuCode("");
            clearAuthCache();

            // Redirect ไป sign-in เฉพาะเมื่อไม่อยู่ในหน้า sign-in อยู่แล้ว
            if (!isSignInPage) {
              router.push(signInPage);
            }
          } else if (event.newValue !== token && event.newValue) {
            setToken(event.newValue);
          }
          break;

        case "bu_id":
          if (event.newValue && event.newValue !== buId) {
            setBuId(event.newValue);
            // Auto refresh page เพื่อโหลดข้อมูลใหม่ตาม tenant ที่เปลี่ยน
            setTimeout(() => {
              globalThis.window.location.reload();
            }, 1000); // รอ 1 วินาทีให้ user เห็น toast ก่อน
          }
          break;

        case "refresh_token":
          // อาจจะต้องการ handle refresh token ถ้ามี logic พิเศษ
          break;
      }

      // Reset flag หลังจาก process เสร็จ
      setTimeout(() => setIsFromStorageEvent(false), 100);
    };

    // เพิ่ม event listener
    globalThis.window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      globalThis.window.removeEventListener("storage", handleStorageChange);
    };
  }, [isHydrated, token, buId, isSignInPage, signInPage, router, clearAuthCache, buCode]);

  // ตรวจสอบว่า user เข้าสู่ระบบหรือไม่
  const hasToken = isHydrated && !!token;

  // รวม loading states - แสดง loading ขณะ hydrating หรือ query loading
  const isLoading = !isHydrated || isUserLoading || updateBusinessUnitMutation.isPending;

  // Context value
  const value = useMemo(
    () => ({
      isAuthenticated: hasToken && !!user,
      isLoading,
      isChangingBu,
      user: user || null,
      permissions: user?.permissions,
      setSession,
      logout,
      token,
      getServerSideToken,
      buId,
      handleChangeBu,
      departments,
      currencyBase,
      dateFormat,
      dateTimeFormat,
      longTimeFormat,
      perpage,
      shortTimeFormat,
      timezone,
      amount,
      quantity,
      recipe,
      buCode,
      businessUnits: user?.data.business_unit || null,
    }),
    [
      hasToken,
      user,
      isLoading,
      isChangingBu,
      setSession,
      logout,
      token,
      getServerSideToken,
      buId,
      handleChangeBu,
      departments,
      currencyBase,
      dateFormat,
      dateTimeFormat,
      longTimeFormat,
      perpage,
      shortTimeFormat,
      timezone,
      amount,
      quantity,
      recipe,
      buCode,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook สำหรับใช้ auth context
export function useAuth() {
  return useContext(AuthContext);
}
