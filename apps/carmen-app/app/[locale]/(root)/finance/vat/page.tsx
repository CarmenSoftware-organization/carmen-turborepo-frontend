import TaxCalculator from "./components/TaxCalculator";

export default function VatPage() {
  return (
    <div className="container mx-auto p-4 md:py-16">
      <div className="max-w-6xl mx-auto">
        <TaxCalculator />
      </div>
    </div>
  );
}
