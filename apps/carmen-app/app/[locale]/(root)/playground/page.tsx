import { Link } from "@/lib/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
};

const itemsPlayground = [
  {
    title: "Color",
    href: "/playground/color",
  },
  {
    title: "Input Component Examples",
    href: "/playground/input",
  },
  {
    title: "Lookup Component Examples",
    href: "/playground/lookup",
  },
  {
    title: "Stepper Component Examples",
    href: "/playground/stepper",
  },
  {
    title: "VAT Calculator",
    href: "/playground/vat",
  },
  {
    title: "Test Post Component",
    href: "/playground/test-post",
  },
  {
    title: "Form Reuse",
    href: "/playground/form-reuse",
  },
  {
    title: "Transfer Component",
    href: "/playground/transfer",
  },
  {
    title: "Configuration Page",
    href: "/playground/config",
  },
  {
    title: "Notification Component",
    href: "/playground/noti",
  },
];

export default function Playground() {
  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Component Playground</h1>
      <ul className="space-y-2 list-disc">
        {itemsPlayground.map((item) => (
          <li key={item.title} className="hover:underline text-primary">
            <Link href={item.href}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
