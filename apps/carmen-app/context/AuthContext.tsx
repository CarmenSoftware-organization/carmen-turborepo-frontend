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

interface UserInfo {
  firstname: string;
  middlename?: string;
  lastname: string;
}

interface BusinessUnit {
  id: string;
  name: string;
  is_default?: boolean;
  department?: {
    id: string;
    is_hod: boolean;
    name: string;
  };
  config: {
    id: string;
    datatype: string;
    key: string;
    label: string;
    value: any;
  }[];
}

interface User {
  id: string;
  email: string;
  user_info: UserInfo;
  business_unit: BusinessUnit[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  setSession: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  token: string;
  getServerSideToken: () => string;
  tenantId: string;
  handleChangeTenant: (tenantId: string) => void;
  departments: BusinessUnit["department"] | null;
  systemConfig: BusinessUnit["config"] | null;
}

// Create context with a default value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  setSession: () => { },
  logout: () => { },
  token: "",
  getServerSideToken: () => "",
  tenantId: "",
  handleChangeTenant: () => { },
  departments: null,
  systemConfig: null,
});

// ฟังก์ชันช่วยสำหรับดึง token ฝั่ง client
export function getServerSideToken(): string {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("access_token") ?? "";
  }
  return "";
}

// Provider component
export function AuthProvider({ children }: { readonly children: ReactNode }) {
  // State สำหรับ track hydration
  const [isHydrated, setIsHydrated] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();

  // Hydration effect - รันครั้งเดียวหลัง mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTenantId = sessionStorage.getItem("tenant_id") ?? "";
      const storedToken = sessionStorage.getItem("access_token") ?? "";

      setTenantId(storedTenantId);
      setToken(storedToken);
      setIsHydrated(true);
    }
  }, []);

  // ตรวจสอบว่าอยู่ในหน้า sign-in หรือไม่
  const locale = pathname?.split("/")[1] || "en";
  const signInPage = `/${locale}/sign-in`;
  const isSignInPage = pathname === signInPage;

  // ใช้ TanStack Query สำหรับ user profile - รอให้ hydrated ก่อน
  const {
    data: user,
    isLoading: isUserLoading,
  } = useUserProfileQuery(token, isHydrated && !isSignInPage && !!token);

  const updateBusinessUnitMutation = useUpdateBusinessUnitMutation();
  const { clearAuthCache } = useAuthCache();

  // คำนวณ departments และ systemConfig จาก user data
  const { departments, systemConfig } = useMemo(() => {
    if (!user?.business_unit?.length) {
      return { departments: null, systemConfig: null };
    }

    const defaultBu = user.business_unit.find(
      (bu: BusinessUnit) => bu.is_default === true
    );
    const firstBu = user.business_unit[0];
    const selectedBu = defaultBu || firstBu;

    return {
      departments: defaultBu?.department || null,
      systemConfig: selectedBu?.config || null,
    };
  }, [user]);

  // กำหนด tenantId เมื่อ user เปลี่ยน
  useEffect(() => {
    if (user?.business_unit?.length && isHydrated) {
      const defaultBu = user.business_unit.find(
        (bu: BusinessUnit) => bu.is_default === true
      );
      const firstBu = user.business_unit[0];
      const newTenantId = defaultBu?.id ?? firstBu?.id ?? "";

      if (newTenantId && newTenantId !== tenantId) {
        setTenantId(newTenantId);
        sessionStorage.setItem("tenant_id", newTenantId);
      }
    }
  }, [user, tenantId, isHydrated]);

  // จัดการการเข้าสู่ระบบ
  const setSession = useCallback(
    async (accessToken: string, refreshToken: string) => {
      if (accessToken && typeof window !== "undefined") {
        sessionStorage.setItem("access_token", accessToken);
        setToken(accessToken);
      }

      if (refreshToken && typeof window !== "undefined") {
        sessionStorage.setItem("refresh_token", refreshToken);
      }
    },
    []
  );

  // จัดการการออกจากระบบ
  const logout = useCallback(() => {
    // ลบ tokens และ cache
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("tenant_id");
      localStorage.removeItem("user");
    }

    // ล้าง cache และ reset state
    clearAuthCache();
    setTenantId("");
    setToken("");

    // เปลี่ยนเส้นทางไปหน้า sign-in
    router.push(signInPage);
  }, [router, signInPage, clearAuthCache]);

  // ดึง token สำหรับ server actions
  const getServerSideToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("access_token") ?? "";
    }
    return "";
  }, []);

  // ฟังก์ชันจัดการการเปลี่ยน tenant
  const handleChangeTenant = useCallback(
    async (id: string) => {
      if (!id || !token) return;

      updateBusinessUnitMutation.mutate(
        { token, tenantId: id },
        {
          onSuccess: () => {
            setTenantId(id);
          },
        }
      );
    },
    [token, updateBusinessUnitMutation]
  );

  // จัดการการล้าง data เมื่อใน sign-in page (แต่ไม่ใช่เมื่อกำลัง login)
  useEffect(() => {
    if (isSignInPage && isHydrated && !token) {
      // ล้าง session เฉพาะเมื่อไม่มี token (ไม่ได้กำลัง login)
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("tenant_id");
        localStorage.removeItem("user");
      }
      clearAuthCache();
      setTenantId("");
      setToken("");
    }
  }, [isSignInPage, clearAuthCache, isHydrated, token]);

  // ตรวจสอบว่า user เข้าสู่ระบบหรือไม่
  const hasToken = isHydrated && !!token;

  // รวม loading states - แสดง loading ขณะ hydrating หรือ query loading
  const isLoading = !isHydrated || isUserLoading || updateBusinessUnitMutation.isPending;

  // Context value
  const value = useMemo(
    () => ({
      isAuthenticated: hasToken && !!user,
      isLoading,
      user: user || null,
      setSession,
      logout,
      token,
      getServerSideToken,
      tenantId,
      handleChangeTenant,
      departments,
      systemConfig,
    }),
    [
      hasToken,
      user,
      isLoading,
      setSession,
      logout,
      token,
      getServerSideToken,
      tenantId,
      handleChangeTenant,
      departments,
      systemConfig,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook สำหรับใช้ auth context
export function useAuth() {
  return useContext(AuthContext);
}
