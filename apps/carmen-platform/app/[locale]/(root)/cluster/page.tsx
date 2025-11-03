import { Metadata } from "next";
import Cluster from "./_components/Cluster";

export const metadata: Metadata = {
  title: "Cluster",
  description: "Cluster",
};

export default function ClusterPage() {
  return <Cluster />;
}
