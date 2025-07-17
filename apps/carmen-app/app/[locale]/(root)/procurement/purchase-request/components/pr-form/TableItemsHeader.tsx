import { Checkbox } from "@/components/ui/checkbox";
import {
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

/**
 * TableItemsHeader component
 * 
 * Provides a consistent table header for the purchase request items table
 * Used in both view and edit modes to ensure consistent column structure
 */
export default function TableItemsHeader() {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="w-[20px]">
                    <Checkbox />
                </TableHead>
                <TableHead className="w-[20px] font-semibold">#</TableHead>
                <TableHead className="w-[150px] font-semibold">Location & Status</TableHead>
                <TableHead className="w-[150px] font-semibold">Product</TableHead>
                <TableHead className="w-[100px] text-right font-semibold">Requested</TableHead>
                <TableHead className="w-[40px] text-right font-semibold">Approved</TableHead>
                <TableHead className="w-[100px] text-right font-semibold">Price</TableHead>
                <TableHead className="w-[120px] text-right font-semibold">More</TableHead>
            </TableRow>
        </TableHeader>
    );
}