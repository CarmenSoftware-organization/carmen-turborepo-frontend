import StoreLocationComponent from "./components/StoreLocationComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Store Location",
};

export default function StoreLocationPage() {
    return <StoreLocationComponent />
}
