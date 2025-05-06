import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Detail",
};

export default function VendorDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 