import { createMetadata } from "@/utils/metadata";
import SignInForm from "./_components/SignInForm";

export const generateMetadata = createMetadata("SignInPage", "title");

export default function SignIn() {
  return <SignInForm />;
}
