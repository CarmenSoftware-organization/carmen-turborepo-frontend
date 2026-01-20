import RoleComponent from "./_components/RoleComponent";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("Role", "title");

export default function RolePage() {
  return <RoleComponent />;
}
