import { Link } from "@/lib/navigation";

export default function Playground() {
    return (
        <div className="p-6 space-y-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Component Playground</h1>
            <ul className="space-y-2">
                <li>
                    <Link href="/playground/input" className="text-blue-500 hover:underline">Input Component Examples</Link>
                </li>
            </ul>
        </div>
    );
}
