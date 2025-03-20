import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockHotels, mockInvoiceStatus } from "@/constants/option";
import { Download } from "lucide-react";

export default function FilterInvoice() {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 w-1/3">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="All hotels" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockHotels.map((hotel) => (
                            <SelectItem key={hotel.value} value={hotel.value}>
                                {hotel.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockInvoiceStatus.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button>
                <Download className="w-4 h-4" />
                Export
            </Button>
        </div>
    )
}
