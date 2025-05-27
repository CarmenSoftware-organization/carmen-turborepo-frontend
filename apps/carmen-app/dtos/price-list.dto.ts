export interface PriceListDto {
    id: string;
    vendor_id: string;
    vendor: {
        id: string;
        name: string;
    };
    from_date: string;
    to_date: string;
    product_id: string;
    product_name: string;
    unit_id: string;
    unit_name: string;
    price: string;
    price_without_vat: string;
    price_with_vat: string;
    tax_type: "add" | "include" | "none";
    tax_rate: string;
    is_active: boolean;
    note: string;
    info: Record<string, string>;
    dimension: Record<string, string>;
};

