import StockCard from "./StockCard";
import StockLevel from "./StockLevel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StockTable from "./StockTable";
export default function StockReplenishmentComponent() {
  return (
    <div className="space-y-4">
      <StockCard />
      <StockLevel />
      <Alert className="bg-rose-100 border-rose-200 flex items-center">
        <AlertDescription className="text-rose-700">
          8 items are below minimum stock levels and require immediate attention
        </AlertDescription>
      </Alert>
      <StockTable />
    </div>
  );
}
