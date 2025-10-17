import { Building2, Calendar } from "lucide-react";

export default function HeaderLegal() {
    const lastUpdated = 'October 17, 2025';
    return (
        <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-xl font-bold">Carmen Software</h1>
                            <p className="text-sm">Hotel Finance Management</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Updated: {lastUpdated}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}