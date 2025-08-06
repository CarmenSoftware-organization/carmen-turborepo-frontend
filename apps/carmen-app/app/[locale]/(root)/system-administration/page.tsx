import { Metadata } from "next";
import SystemAdministrationComponentPage from "./SystemAdministrationComponentPage";

export const metadata: Metadata = {
    title: "System Administration",
};

export default function SystemAdministrationPage() {
    return <SystemAdministrationComponentPage />
}
