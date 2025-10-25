import FooterLegal from "./_components/FooterLegal";
import HeaderLegal from "./_components/HeaderLegal";
import SidebarLegal from "./_components/SidebarLegal";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-muted">
            <HeaderLegal />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    <SidebarLegal />
                    <main className="flex-1 bg-background rounded-lg shadow-sm border border-border p-8">
                        {children}
                    </main>
                </div>
            </div>
            <FooterLegal />
        </div>
    );
}
