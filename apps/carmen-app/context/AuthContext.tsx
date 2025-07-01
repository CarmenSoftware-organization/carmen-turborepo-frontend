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
  getUserProfileService,
  updateUserBusinessUnitService,
} from "@/services/auth.service";

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
}

// Create context with a default value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  setSession: () => {},
  logout: () => {},
  token: "",
  getServerSideToken: () => "",
  tenantId: "",
  handleChangeTenant: () => {},
  departments: null,
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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tenantId, setTenantId] = useState<string>(() => {
    // เริ่มต้นจาก sessionStorage เพื่อป้องกัน 400 errors เมื่อ refresh
    return typeof window !== "undefined"
      ? (sessionStorage.getItem("tenant_id") ?? "")
      : "";
  });
  const [departments, setDepartments] = useState<
    BusinessUnit["department"] | null
  >(null);
  const router = useRouter();
  const pathname = usePathname();
  const token =
    typeof window !== "undefined"
      ? (sessionStorage.getItem("access_token") ?? "")
      : "";

  // กำหนด tenantId เมื่อ user เปลี่ยน
  useEffect(() => {
    if (user?.business_unit?.length) {
      const defaultBu = user.business_unit.find(
        (bu: BusinessUnit) => bu.is_default === true
      );
      const firstBu = user.business_unit[0];
      const newTenantId = defaultBu?.id ?? firstBu?.id ?? "";
      setTenantId(newTenantId);

      // เก็บ tenantId ใน sessionStorage เพื่อคงไว้เมื่อ refresh
      if (typeof window !== "undefined" && newTenantId) {
        sessionStorage.setItem("tenant_id", newTenantId);
      }
    }
  }, [user]);

  // กำหนด departments เมื่อ user เปลี่ยน
  useEffect(() => {
    if (user?.business_unit?.length) {
      const defaultBu = user.business_unit.find(
        (bu: BusinessUnit) => bu.is_default === true && bu.department
      );
      setDepartments(defaultBu?.department || null);
    } else {
      setDepartments(null);
    }
  }, [user]);

  // ตรวจสอบข้อมูล user ที่มีอยู่เมื่อโหลด
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ดึง locale จาก pathname แบบ dynamic
        const locale = pathname?.split("/")[1];
        const signInPage = `/${locale}/sign-in`;

        const isSignInPage = pathname === signInPage;

        if (isSignInPage) {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
            sessionStorage.removeItem("tenant_id");
            localStorage.removeItem("user");
          }
          setUser(null);
          setTenantId("");
          setIsLoading(false);
          return;
        }

        // โหลดข้อมูล user จาก localStorage หากมี
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const setSession = useCallback(
    async (accessToken: string, refreshToken: string) => {
      if (accessToken) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("access_token", accessToken);
        }

        const data = await getUserProfileService(accessToken);

        // เก็บข้อมูล user ใน localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(data));
        }
        setUser(data);

        // กำหนด tenant ID เริ่มต้นเมื่อ user เข้าสู่ระบบ
        if (data?.business_unit?.length) {
          const defaultBu = data.business_unit.find(
            (bu: BusinessUnit) => bu.is_default === true
          );
          const firstBu = data.business_unit[0];
          const newTenantId = defaultBu?.id ?? firstBu?.id ?? "";

          if (newTenantId && typeof window !== "undefined") {
            sessionStorage.setItem("tenant_id", newTenantId);
            setTenantId(newTenantId);
          }
        }
      }

      if (refreshToken && typeof window !== "undefined") {
        sessionStorage.setItem("refresh_token", refreshToken);
      }
    },
    []
  );

  const logout = useCallback(() => {
    const locale = pathname?.split("/")[1] || "en";

    // ลบ tokens
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("tenant_id");
      // ลบข้อมูล user จาก localStorage ด้วย
      localStorage.removeItem("user");
    }
    setUser(null);
    setTenantId("");
    // เปลี่ยนเส้นทางไปหน้า sign-in ตาม locale ปัจจุบัน
    router.push(`/${locale}/sign-in`);
  }, [router, pathname]);

  // ดึง token สำหรับ server actions
  const getServerSideToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("access_token") ?? "";
    }
    return "";
  }, []);

  // ตรวจสอบว่า user เข้าสู่ระบบหรือไม่โดยมอง tokens
  const hasToken =
    typeof window !== "undefined" && !!sessionStorage.getItem("access_token");

  // ฟังก์ชันจัดการการเปลี่ยน tenant
  const handleChangeTenant = useCallback(
    async (id: string) => {
      if (!id) return;
      const data = await updateUserBusinessUnitService(token, id);
      if (data) {
        setTenantId(id);
        // เก็บ tenant ID ที่อัปเดตใน sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.setItem("tenant_id", id);
        }
      }
    },
    [token]
  );

  // Context value
  const value = useMemo(
    () => ({
      isAuthenticated: hasToken,
      isLoading,
      user,
      setSession,
      logout,
      token,
      getServerSideToken,
      tenantId,
      handleChangeTenant,
      departments,
    }),
    [
      hasToken,
      isLoading,
      user,
      setSession,
      logout,
      token,
      getServerSideToken,
      tenantId,
      handleChangeTenant,
      departments,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook สำหรับใช้ auth context
export function useAuth() {
  return useContext(AuthContext);
}
