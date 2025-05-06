import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vendor Detail",
};

export default function VendorDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 