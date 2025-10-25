import MyApprovalComponent from "./_components/MyApprovalComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Approval",
};

export default function MyApprovalPage() {
    return <MyApprovalComponent />
}
