import { DeliveryPointComponent } from "./components/DeliveryPointComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Delivery Point",
};

export default function DeliveryPointPage() {
    return <DeliveryPointComponent />
}
