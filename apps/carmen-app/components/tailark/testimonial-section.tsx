import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export default function TestimonialSection() {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Procurement Manager',
            avatar: 'https://avatars.githubusercontent.com/u/47919550?v=4',
            content: "Carmen has revolutionized our procurement process. We've reduced ordering time by 60% and eliminated stock-out situations completely.",
        },
        {
            name: 'Michael Chen',
            role: 'Hotel General Manager',
            avatar: 'https://avatars.githubusercontent.com/u/68236786?v=4',
            content: 'The multi-property support is outstanding. Managing inventory across our 5 hotel properties has never been easier. Real-time visibility is a game-changer.',
        },
        {
            name: 'Emma Rodriguez',
            role: 'F&B Director',
            avatar: 'https://avatars.githubusercontent.com/u/99137927?v=4',
            content: 'Tracking stock movements between kitchen, bar, and storage areas is seamless. The reporting features help us reduce waste by 40%.',
        },
    ]

    return (
        <section id="testimonials">
            <div className="bg-muted py-24">
                <div className="container mx-auto w-full max-w-5xl px-6">
                    <div className="mb-12">
                        <h2 className="text-foreground text-4xl font-semibold">What Our Hotel Partners Say</h2>
                        <p className="text-muted-foreground my-4 text-balance text-lg">Discover how Carmen helps hotels optimize their inventory operations. Read testimonials from procurement managers, hotel operators, and F&B directors who trust our platform.</p>
                    </div>
                    <div className="lg:grid-cols-3 grid gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div key={index}>
                                <div className="bg-background ring-foreground/10 rounded-2xl rounded-bl border border-transparent px-4 py-3 ring-1">
                                    <p className="text-foreground">{testimonial.content}</p>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
                                        <AvatarImage
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                        />
                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-foreground text-sm font-medium">{testimonial.name}</div>
                                    <span
                                        aria-hidden
                                        className="bg-foreground/25 size-1 rounded-full"></span>
                                    <span className="text-muted-foreground text-sm">{testimonial.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}