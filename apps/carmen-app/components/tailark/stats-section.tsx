import { ArrowRight } from "lucide-react";

export default function StatsSection() {
  return (
    <section>
      <div className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div>
            <h2 className="text-2xl font-semibold">Carmen in numbers</h2>
            <p className="text-muted-foreground mt-4 text-balance text-lg">
              Our platform empowers hotels and hospitality businesses to streamline inventory
              operations, reduce costs, and optimize procurement workflows.
            </p>
          </div>
          <ul role="list" className="text-muted-foreground mt-8 space-y-2">
            {[
              { value: "50+", label: "Hotel Properties" },
              { value: "40%", label: "Cost Reduction" },
              { value: "99.9%", label: "Uptime Guarantee" },
              { value: "5k+", label: "Daily Transactions" },
            ].map((stat, index) => (
              <li key={index} className="-ml-0.5 flex items-center gap-1.5">
                <ArrowRight className="size-4 opacity-50" />
                <span className="text-foreground font-medium">{stat.value}</span> {stat.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
