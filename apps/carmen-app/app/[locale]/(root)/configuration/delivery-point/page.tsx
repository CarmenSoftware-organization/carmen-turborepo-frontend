import { Metadata } from "next";
import DeliveryPointComponent from "./_components/DeliveryPointComponent";

export const metadata: Metadata = {
    title: "Delivery Point",
};

export default function DeliveryPointPage() {
    return <DeliveryPointComponent />
}
