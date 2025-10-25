import SpotCheckComponent from "./_components/SpotCheckComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Spot Check",
};

export default function SpotCheckPage() {
    return <SpotCheckComponent />
}
