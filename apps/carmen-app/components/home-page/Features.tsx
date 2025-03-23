import React from 'react';
import {
    LineChart, Clock, Shield, CreditCard, RefreshCw, Settings,
    CalendarCheck, Headphones, Smartphone, Briefcase, Building, UserCheck
} from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: LineChart,
            title: "Performance Analytics",
            description: "Comprehensive dashboards with real-time KPIs and actionable insights."
        },
        {
            icon: Clock,
            title: "Automated Workflows",
            description: "Eliminate manual tasks with intelligent workflow automation."
        },
        {
            icon: Shield,
            title: "Secure Access Control",
            description: "Role-based permissions and multi-factor authentication."
        },
        {
            icon: CreditCard,
            title: "Integrated Payments",
            description: "Seamless payment processing and financial reporting."
        },
        {
            icon: RefreshCw,
            title: "Continuous Updates",
            description: "Stay ahead with regular feature enhancements and improvements."
        },
        {
            icon: Settings,
            title: "Custom Configuration",
            description: "Tailor the system to your specific operational requirements."
        },
        {
            icon: CalendarCheck,
            title: "Resource Planning",
            description: "Optimize staff scheduling and resource allocation."
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            description: "Dedicated support team available around the clock."
        },
        {
            icon: Smartphone,
            title: "Mobile Accessibility",
            description: "Manage your property from anywhere with our mobile app."
        },
        {
            icon: Briefcase,
            title: "Inventory Management",
            description: "Track supplies and automate reordering processes."
        },
        {
            icon: Building,
            title: "Multi-Property Support",
            description: "Manage multiple properties from a single unified interface."
        },
        {
            icon: UserCheck,
            title: "Guest Profiles",
            description: "Detailed guest history and preference tracking."
        }
    ];
    return (
        <section id="features" className="bg-background relative pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 section-transition">
                    <div className="inline-flex items-center bg-muted px-4 py-1.5 rounded-full text-xs font-medium text-foreground border border-border mb-5">
                        Features
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
                        Everything you need to run your hotel efficiently
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Carmen combines powerful tools with an intuitive interface to give you complete control over your operations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className={`bg-background border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 stagger-item stagger-delay-${(index % 6) + 1}`}
                        >
                            <div className="bg-blue-600 p-3 rounded-lg inline-block mb-4">
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
