import ProfileComponent from "./components/ProfileComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile",
};

export default function ProfilePage() {
    return <ProfileComponent />
}
