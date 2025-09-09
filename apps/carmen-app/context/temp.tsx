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
    TENANT_ID = "tenant_id",
    USER = "user",
}

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
    currencyBase: NonNullable<BusinessUnit["config"]>["currency_base"] | null;
    dateFormat: NonNullable<BusinessUnit["config"]>["date_format"] | null;
    longTimeFormat: NonNullable<BusinessUnit["config"]>["long_time_format"] | null;
    perpage: NonNullable<BusinessUnit["config"]>["perpage"] | null;
    shortTimeFormat: NonNullable<BusinessUnit["config"]>["short_time_format"] | null;
    timezone: NonNullable<BusinessUnit["config"]>["timezone"] | null;
    amount: NonNullable<BusinessUnit["config"]>["amount"] | null;
    quantity: NonNullable<BusinessUnit["config"]>["quantity"] | null;
    recipe: NonNullable<BusinessUnit["config"]>["recipe"] | null;
    buCode: string;
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
    currencyBase: null,
    dateFormat: null,
    longTimeFormat: null,
    perpage: null,
    shortTimeFormat: null,
    timezone: null,
    amount: null,
    quantity: null,
    recipe: null,
    buCode: "",
});

// ฟังก์ชันช่วยสำหรับดึง token ฝั่ง client
export function getServerSideToken(): string {
    if (typeof window !== "undefined") {
        return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) ?? "";
    }
    return "";
}

// Provider component
export function AuthProvider({ children }: { readonly children: ReactNode }) {
    // State สำหรับ track hydration
    const [isHydrated, setIsHydrated] = useState(false);
    const [tenantId, setTenantId] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [buCode, setBuCode] = useState<string>("");
    const [isFromStorageEvent, setIsFromStorageEvent] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    // Hydration effect - รันครั้งเดียวหลัง mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTenantId = localStorage.getItem(LOCAL_STORAGE.TENANT_ID) ?? "";
            const storedToken = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) ?? "";
            const storedBuCode = localStorage.getItem(LOCAL_STORAGE.BU_CODE) ?? "";
            setTenantId(storedTenantId);
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

    // ใช้ TanStack Query สำหรับ user profile - รอให้ hydrated ก่อน
    const {
        data: user,
        isLoading: isUserLoading,
    } = useUserProfileQuery(token, isHydrated && !isSignInPage && !!token);

    const updateBusinessUnitMutation = useUpdateBusinessUnitMutation();
    const { clearAuthCache } = useAuthCache();

    // คำนวณ departments และ system properties จาก user data
    const {
        departments,
        currencyBase,
        dateFormat,
        longTimeFormat,
        perpage,
        shortTimeFormat,
        timezone,
        amount,
        quantity,
        recipe
    } = useMemo(() => {
        if (!user?.business_unit?.length) {
            return {
                departments: null,
                currencyBase: null,
                dateFormat: null,
                longTimeFormat: null,
                perpage: null,
                shortTimeFormat: null,
                timezone: null,
                amount: null,
                quantity: null,
                recipe: null
            };
        }

        const defaultBu = user.business_unit.find(
            (bu: BusinessUnit) => bu.is_default === true
        );
        const firstBu = user.business_unit[0];
        const selectedBu = defaultBu || firstBu;

        return {
            departments: defaultBu?.department || null,
            currencyBase: selectedBu?.config?.currency_base || null,
            dateFormat: selectedBu?.config?.date_format || null,
            longTimeFormat: selectedBu?.config?.long_time_format || null,
            perpage: selectedBu?.config?.perpage || null,
            shortTimeFormat: selectedBu?.config?.short_time_format || null,
            timezone: selectedBu?.config?.timezone || null,
            amount: selectedBu?.config?.amount || null,
            quantity: selectedBu?.config?.quantity || null,
            recipe: selectedBu?.config?.recipe || null
        };
    }, [user]);

    useEffect(() => {
        if (user?.business_unit?.length && isHydrated) {
            const defaultBu = user.business_unit.find(
                (bu: BusinessUnit) => bu.is_default === true
            );
            const firstBu = user.business_unit[0];
            const newTenantId = defaultBu?.id ?? firstBu?.id ?? "";
            const newBuCode = defaultBu?.code ?? firstBu?.code ?? "";

            // Set tenantId และ buCode แม้ว่าจะเหมือนเดิมก็ตาม (สำหรับ initial load)
            if (newTenantId && newBuCode) {
                if (newTenantId !== tenantId) {
                    setTenantId(newTenantId);
                }
                if (newBuCode !== buCode) {
                    setBuCode(newBuCode);
                }

                // อัปเดต localStorage เสมอ
                localStorage.setItem(LOCAL_STORAGE.TENANT_ID, newTenantId);
                localStorage.setItem(LOCAL_STORAGE.BU_CODE, newBuCode);
            }
        }
    }, [user, isHydrated]);

    // จัดการการเข้าสู่ระบบ
    const setSession = useCallback(
        async (accessToken: string, refreshToken: string) => {
            if (accessToken && typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
                setToken(accessToken);
            }

            if (refreshToken && typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, refreshToken);
            }
        },
        []
    );

    // จัดการการออกจากระบบ
    const logout = useCallback(() => {
        // ป้องกันการ trigger storage event ซ้ำเมื่อมาจาก cross-tab sync
        if (isFromStorageEvent) {
            return;
        }

        // ลบ tokens และ cache
        if (typeof window !== "undefined") {
            localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE.TENANT_ID);
            localStorage.removeItem(LOCAL_STORAGE.USER);
            localStorage.removeItem(LOCAL_STORAGE.BU_CODE);
        }

        // ล้าง cache และ reset state
        clearAuthCache();
        setTenantId("");
        setToken("");
        setBuCode("");
        // เปลี่ยนเส้นทางไปหน้า sign-in
        router.push(signInPage);
    }, [router, signInPage, clearAuthCache, isFromStorageEvent]);

    // ดึง token สำหรับ server actions
    const getServerSideToken = useCallback(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) ?? "";
        }
        return "";
    }, []);

    // ฟังก์ชันจัดการการเปลี่ยน tenant
    const handleChangeTenant = useCallback(
        async (id: string) => {
            if (!id || !token || !user?.business_unit?.length) return;

            // ป้องกันการ trigger ซ้ำเมื่อมาจาก cross-tab sync
            if (isFromStorageEvent) {
                return;
            }

            // หา business unit ที่เลือกเพื่อดึง bu_code
            const selectedBu = user.business_unit.find(
                (bu: BusinessUnit) => bu.id === id
            );

            if (!selectedBu) {
                console.error('Business unit not found for id:', id);
                return;
            }

            updateBusinessUnitMutation.mutate(
                { token, tenantId: id },
                {
                    onSuccess: () => {
                        setTenantId(id);
                        setBuCode(selectedBu.code);

                        // อัปเดต localStorage เพื่อ sync กับ tabs อื่น
                        if (typeof window !== "undefined") {
                            localStorage.setItem(LOCAL_STORAGE.TENANT_ID, id);
                            localStorage.setItem(LOCAL_STORAGE.BU_CODE, selectedBu.code);
                        }
                        router.push(dashboardPage);
                        toastSuccess({ message: "Changed Business Unit Success" });
                    },
                }
            );
        },
        [token, updateBusinessUnitMutation, isFromStorageEvent, user?.business_unit]
    );

    // จัดการการล้าง data เมื่อใน sign-in page (แต่ไม่ใช่เมื่อกำลัง login)
    useEffect(() => {
        if (isSignInPage && isHydrated && !token) {
            // ล้าง session เฉพาะเมื่อไม่มี token (ไม่ได้กำลัง login)
            if (typeof window !== "undefined") {
                localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
                localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
                localStorage.removeItem(LOCAL_STORAGE.TENANT_ID);
                localStorage.removeItem(LOCAL_STORAGE.USER);
                localStorage.removeItem(LOCAL_STORAGE.BU_CODE);
            }
            clearAuthCache();
            setTenantId("");
            setToken("");
            setBuCode("");
        }
    }, [isSignInPage, clearAuthCache, isHydrated, token]);

    // Cross-Tab Synchronization - ฟังการเปลี่ยนแปลงใน localStorage
    useEffect(() => {
        if (!isHydrated) return;

        const handleStorageChange = (event: StorageEvent) => {
            // ตรวจสอบเฉพาะ keys ที่เกี่ยวข้องกับ auth
            if (!event.key || !['access_token', 'refresh_token', 'tenant_id'].includes(event.key)) {
                return;
            }

            setIsFromStorageEvent(true);

            switch (event.key) {
                case 'access_token':
                    if (event.newValue === null) {
                        setToken("");
                        setTenantId("");
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

                case 'tenant_id':
                    if (event.newValue && event.newValue !== tenantId) {
                        setTenantId(event.newValue);
                        // Auto refresh page เพื่อโหลดข้อมูลใหม่ตาม tenant ที่เปลี่ยน
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000); // รอ 1 วินาทีให้ user เห็น toast ก่อน
                    }
                    break;

                case 'refresh_token':
                    // อาจจะต้องการ handle refresh token ถ้ามี logic พิเศษ
                    break;
            }

            // Reset flag หลังจาก process เสร็จ
            setTimeout(() => setIsFromStorageEvent(false), 100);
        };

        // เพิ่ม event listener
        window.addEventListener('storage', handleStorageChange);

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [isHydrated, token, tenantId, isSignInPage, signInPage, router, clearAuthCache, buCode]);

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
            currencyBase,
            dateFormat,
            longTimeFormat,
            perpage,
            shortTimeFormat,
            timezone,
            amount,
            quantity,
            recipe,
            buCode,
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
            currencyBase,
            dateFormat,
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

    console.log('AuthContext value:', value);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook สำหรับใช้ auth context
export function useAuth() {
    return useContext(AuthContext);
}
