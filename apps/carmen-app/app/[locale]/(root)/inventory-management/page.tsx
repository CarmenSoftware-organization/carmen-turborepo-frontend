import { Metadata } from "next";
import InventoryPage from "./InventoryPage";

export const metadata: Metadata = {
    title: "Inventory Management",
};

export default function InventoryManagement() {
    return <InventoryPage />
}
