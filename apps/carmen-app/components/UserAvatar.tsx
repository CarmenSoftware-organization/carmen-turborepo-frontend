'use client';

import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

export default function UserAvatar() {
    const { logout } = useAuth();
    return (
        <Button onClick={logout}>
            Logout
        </Button>
    );
}
