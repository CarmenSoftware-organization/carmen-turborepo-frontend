import { useAuth } from "@/context/AuthContext";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { getVendorIdService } from "@/services/vendor.service";
import { useEffect, useState } from "react";

interface UseVendorDetailReturn {
    vendor: VendorFormValues | undefined;
    loading: boolean;
    error: Error | null;
    loginDialogOpen: boolean;
    setLoginDialogOpen: (open: boolean) => void;
}

export const useVendorDetail = (id: string): UseVendorDetailReturn => {
    const { token, buCode } = useAuth();
    const [vendor, setVendor] = useState<VendorFormValues>();
    const [loading, setLoading] = useState(true);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchVendor = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await getVendorIdService(token, buCode, id);

                if (response && (response.status === 401 || response.statusCode === 401)) {
                    setLoginDialogOpen(true);
                    return;
                }

                if (response.error) {
                    setError(new Error(response.error.message ?? "Failed to fetch vendor data"));
                    return;
                }

                setVendor(response);
            } catch (error) {
                console.error('Error fetching vendor:', error);
                setError(error instanceof Error ? error : new Error("An unknown error occurred"));

                if (error instanceof Error && error.message.includes('401')) {
                    setLoginDialogOpen(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [token, buCode, id]);

    return {
        vendor,
        loading,
        error,
        loginDialogOpen,
        setLoginDialogOpen
    };
}; 