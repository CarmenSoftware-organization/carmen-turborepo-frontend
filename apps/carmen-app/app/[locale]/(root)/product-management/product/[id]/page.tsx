"use client";

import { formType } from "@/dtos/form.dto";
import { getProductIdService } from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { ProductGetDto } from "@/dtos/product.dto";
import ProductDetail from "../components/ProductDetail";

export default function ProductEdit() {
    const { token, tenantId } = useAuth();
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : params.id[0];
    const [product, setProduct] = useState<ProductGetDto | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductIdService(token, tenantId, id);
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

    return <ProductDetail mode={formType.EDIT} initValues={product} />;
}
