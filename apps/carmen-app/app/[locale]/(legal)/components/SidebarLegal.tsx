import { Link } from "@/lib/navigation";
import { FileText, Shield } from "lucide-react";

export default function SidebarLegal() {
    const navigation = [
        { link: 'terms', label: 'Terms of Service', icon: FileText },
        { link: 'policy', label: 'Privacy Policy', icon: Shield }
    ];
    return (
        <aside className="w-64 flex-shrink-0">
            <div className="bg-background rounded-lg shadow-sm border border-border p-4 sticky top-24">
                <h3 className="text-sm font-semibold mb-3">Legal Documents</h3>
                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                href={item.link}
                                className="flex items-center gap-2"
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    )
}