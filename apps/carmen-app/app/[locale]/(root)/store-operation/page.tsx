import { Metadata } from "next";
import StoreOperationPage from "./StoreOperationPage";

export const metadata: Metadata = {
    title: "Store Operation",
};

export default function StoreOperation() {
    return <StoreOperationPage />
}
