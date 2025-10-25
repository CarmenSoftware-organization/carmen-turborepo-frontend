import SignInForm from "./_components/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
};

export default function SignIn() {
    return <SignInForm />
}
