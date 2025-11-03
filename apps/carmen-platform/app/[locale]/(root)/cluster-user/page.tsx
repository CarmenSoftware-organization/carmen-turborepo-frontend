import { Metadata } from "next";
import ClusterUser from "./_components/ClusterUser";

export const metadata: Metadata = {
  title: "Cluster User",
  description: "Cluster User",
};

export default function ClusterUserPage() {
  return <ClusterUser />;
}
