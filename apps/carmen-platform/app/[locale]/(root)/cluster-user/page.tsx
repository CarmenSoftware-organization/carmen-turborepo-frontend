import { Metadata } from "next";
import ClusterUser from "./components/ClusterUser";

export const metadata: Metadata = {
    title: "Cluster User",
    description: "Cluster User",
};

export default function ClusterUserPage() {
    return <ClusterUser />
}