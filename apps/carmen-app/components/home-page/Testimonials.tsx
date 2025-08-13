import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
    const testimonials = [
        {
            id: "testimonial-1",
            quote: "Carmen has transformed how we manage our hotel chain. The intuitive interface and powerful analytics have improved our efficiency by over 40%.",
            author: "Alexandra Richards",
            position: "Operations Director, Luxury Hotels Group"
        },
        {
            id: "testimonial-2",
            quote: "After implementing Carmen, our staff can focus more on guest experience rather than administrative tasks. It's been a game-changer for our boutique hotel.",
            author: "Michael Torres",
            position: "General Manager, Riverside Boutique Hotel"
        },
        {
            id: "testimonial-3",
            quote: "The level of customization and the responsive support team make Carmen stand out from other hotel management systems we've used in the past.",
            author: "Sophia Chen",
            position: "IT Manager, Grand Plaza Hotels"
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-muted relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 section-transition">
                    <div className="inline-fxr-c bg-background px-4 py-1.5 rounded-full text-xs font-medium text-foreground border border-border mb-5">
                        Testimonials
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
                        Trusted by hoteliers worldwide
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        See what our customers have to say about their experience with Carmen.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className={`bg-background border border-border rounded-xl p-8 shadow-sm transition-all duration-300 hover:shadow-md relative stagger-item stagger-delay-${index + 1}`}
                        >
                            <Quote className="h-10 w-10 text-primary/20 absolute -top-2 -left-2" />
                            <p className="text-muted-foreground mb-6 relative z-10">{testimonial.quote}</p>
                            <div>
                                <p className="font-medium text-foreground">{testimonial.author}</p>
                                <p className="text-muted-foreground text-sm">{testimonial.position}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}