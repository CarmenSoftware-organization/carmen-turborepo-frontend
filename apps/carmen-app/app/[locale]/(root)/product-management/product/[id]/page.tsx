"use client";

import { formType } from "@/dtos/form.dto";
import { getProductIdService } from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import SignInDialog from "@/components/SignInDialog";
import FormProduct, { ProductFormValues } from "../components/form/FormProduct";
export default function ProductEdit() {
    const { token, tenantId } = useAuth();
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : params.id[0];
    const [product, setProduct] = useState<ProductFormValues | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductIdService(token, tenantId, id);
                if (data.statusCode === 401) {
                    setLoginDialogOpen(true);
                    return;
                }
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [token, tenantId, id]);

    if (loading) {
        return <div>Loading product information...</div>;
    }

    console.log('product', product);



    return (
        <>
            <FormProduct mode={formType.VIEW} initialValues={product} />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </>
    )
}
