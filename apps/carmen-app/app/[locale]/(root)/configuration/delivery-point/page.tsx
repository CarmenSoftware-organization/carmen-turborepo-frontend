import { Metadata } from "next";
import DeliveryPointComponent from "./components/DeliveryPointComponent";

export const metadata: Metadata = {
    title: "Delivery Point",
};

export default function DeliveryPointPage() {
    return <DeliveryPointComponent />
}
