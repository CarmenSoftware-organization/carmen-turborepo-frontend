import ConfPage from "./ConfPage";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("Modules", "configuration");

export default function Configuration() {
  return <ConfPage />;
}
