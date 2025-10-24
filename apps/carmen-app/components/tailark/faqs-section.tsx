export default function FaqsSection() {
    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
                    <div className="text-center lg:text-left">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                            Frequently <br className="hidden lg:block" /> Asked <br className="hidden lg:block" />
                            Questions
                        </h2>
                        <p>Everything you need to know about Carmen inventory management system</p>
                    </div>

                    <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
                        <div className="pb-6">
                            <h3 className="font-medium">How does multi-property management work?</h3>
                            <p className="text-muted-foreground mt-4">Carmen supports multi-tenant architecture, allowing you to manage inventory across multiple hotel properties from a single platform.</p>

                            <ol className="list-outside list-decimal space-y-2 pl-4">
                                <li className="text-muted-foreground mt-4">Each property maintains isolated data with complete security and privacy.</li>
                                <li className="text-muted-foreground mt-4">Switch between properties seamlessly with business unit selection.</li>
                                <li className="text-muted-foreground mt-4">View consolidated reports across all properties or filter by specific locations.</li>
                            </ol>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Can I track stock movements between departments?</h3>
                            <p className="text-muted-foreground mt-4">Yes, Carmen provides comprehensive tracking of inventory movements between departments such as kitchen, bar, housekeeping, and storage areas with full audit trails.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">What procurement features are included?</h3>
                            <p className="text-muted-foreground my-4">Carmen includes a complete procurement workflow management system designed for hospitality operations.</p>
                            <ul className="list-outside list-disc space-y-2 pl-4">
                                <li className="text-muted-foreground">Create and approve purchase requests with customizable approval workflows.</li>
                                <li className="text-muted-foreground">Manage vendor relationships, track orders, and process goods receipts.</li>
                                <li className="text-muted-foreground">Generate reports on spending patterns and vendor performance.</li>
                            </ul>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">What kind of support do you offer?</h3>
                            <p className="text-muted-foreground mt-4">We provide dedicated support for all hotel partners including email support, live chat during business hours, and comprehensive documentation with video tutorials.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}