"use client";

import ContactSection from "./home-page/ContactSection";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HeroHeader } from "./tailark/header";
import HeroSection from "./tailark/hero-section";
import FeaturesSection from "./tailark/feature-section";
import StatsSection from "./tailark/stats-section";
import TeamSection from "./tailark/team-section";
import TestimonialSection from "./tailark/testimonial-section";
import FooterSection from "./tailark/footer-section";
import PricingSection from "./tailark/pricing-section";
import FaqsSection from "./tailark/faqs-section";

export default function LandingPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    return (
        <div>
            {/* <HomeNavbar /> */}
            <HeroHeader />
            <HeroSection />
            <FeaturesSection />
            <StatsSection />
            <TeamSection />
            <TestimonialSection />
            <PricingSection />
            <FaqsSection />
            <ContactSection />
            <FooterSection />
            {/* <main>
                <Hero />
                <Features />
                <Testimonials />
               
            </main> */}
            {/* <HomeFooter /> */}
        </div>
    )
}
