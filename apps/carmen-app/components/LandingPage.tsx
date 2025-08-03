"use client";

import ContactSection from "./home-page/ContactSection";
import Features from "./home-page/Features";
import Hero from "./home-page/Hero";
import HomeFooter from "./home-page/HomeFooter";
import HomeNavbar from "./home-page/HomeNavbar";
import Testimonials from "./home-page/Testimonials";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="flex flex-col min-h-screen bg-background overflow-hidden">
            <HomeNavbar />
            <main>
                <Hero />
                <Features />
                <Testimonials />
                <ContactSection />
            </main>
            <HomeFooter />
        </div>
    )
}
