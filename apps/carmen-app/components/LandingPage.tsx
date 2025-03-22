import ContactSection from "./home-page/ContactSection";
import Features from "./home-page/Features";
import Hero from "./home-page/Hero";
import HomeFooter from "./home-page/HomeFooter";
import HomeNavbar from "./home-page/HomeNavbar";
import Testimonials from "./home-page/Testimonials";
export default function LandingPage() {
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
