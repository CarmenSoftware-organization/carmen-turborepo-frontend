import { CheckCircle2, ArrowRight, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function ContactSection() {
    const benefits = [
        { id: "benefit-1", text: "Personalized demo of all features" },
        { id: "benefit-2", text: "Custom implementation strategy" },
        { id: "benefit-3", text: "Pricing tailored to your property size" },
        { id: "benefit-4", text: "No commitment required" },
        { id: "benefit-5", text: "Direct access to our product specialists" }
    ];
    return (
        <section id="contact" className="py-20 bg-background relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="section-transition">
                            <div className="inline-flex items-center bg-primary/10 px-4 py-1.5 rounded-full text-xs font-medium text-foreground border border-border mb-5">
                                Get Started Today
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
                                Ready to elevate your hotel management?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Schedule a free demonstration with our team and discover how Carmen can transform your operations.
                            </p>

                            <ul className="space-y-3 mb-8">
                                {benefits.map((benefit) => (
                                    <li key={benefit.id} className="flex items-start">
                                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-muted-foreground">{benefit.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                                    <a href="mailto:demo@carmen.com" className="text-foreground hover:text-primary transition-colors">
                                        demo@carmen.com
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                                    <a href="tel:+1-800-CARMEN" className="text-foreground hover:text-primary transition-colors">
                                        +1-800-CARMEN
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background border border-border rounded-xl p-8 shadow-sm section-transition">
                            <h3 className="text-xl font-semibold mb-6 text-foreground">Request a Demo</h3>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                        placeholder="John Smith"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-muted-foreground mb-1">
                                        Hotel/Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                        placeholder="Grand Hotel"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="size" className="block text-sm font-medium text-muted-foreground mb-1">
                                        Number of Rooms
                                    </label>
                                    <select
                                        id="size"
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                    >
                                        <option value="">Select room count</option>
                                        <option value="1-20">1-20 rooms</option>
                                        <option value="21-50">21-50 rooms</option>
                                        <option value="51-100">51-100 rooms</option>
                                        <option value="101+">101+ rooms</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                                        Additional Information
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                        placeholder="Tell us about your current setup and challenges..."
                                    ></textarea>
                                </div>

                                <button
                                    type="button"
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300"
                                >
                                    Request Demo
                                    <ArrowRight className="h-4 w-4" />
                                </button>

                                <p className="text-xs text-muted-foreground text-center">
                                    By submitting this form, you agree to our <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
