import { Link } from "@/lib/navigation";
import { Mail, Phone } from "lucide-react";

export default function FooterLegal() {
    return (
        <footer className="bg-background border-t border-border mt-16">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-semibold mb-3">Contact Us</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>support@carmensoftware.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>+66 (0) XX-XXX-XXXX</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Legal</h4>
                        <div className="space-y-2 text-sm">
                            <Link href="/terms">
                                Terms of Service
                            </Link>
                            <Link href="/policy">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Carmen Software</h4>
                        <p className="text-sm">
                            Enterprise ERP solution for Hospitality Industry
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border text-center text-sm">
                    © 2025 Carmen Software. All rights reserved.
                </div>
            </div>
        </footer>
    )
}