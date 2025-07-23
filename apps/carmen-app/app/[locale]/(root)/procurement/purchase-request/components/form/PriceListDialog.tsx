import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { TimerIcon, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TablePriceList from "./TablePriceList";


export default function PriceListDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-5">
                    <TrendingUp /> Compare
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Pricelist Information</DialogTitle>
                </DialogHeader>
                <Card className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-lg font-semibold">Organic Spring Vegetable Medley</h1>
                            <p className="text-sm text-muted-foreground">Premium organic spring vegetables - seasonal selection</p>
                        </div>
                        <Badge variant="destructive">Rejected</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-md">
                            <p className="text-xs text-muted-foreground">Requested</p>
                            <p className="text-sm font-semibold">80 kg</p>
                        </div>
                        <div className="bg-muted p-4 rounded-md">
                            <p className="text-xs text-muted-foreground">Approved</p>
                            <p className="text-sm font-semibold">450 kg</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-blue-50 border-blue-500 space-y-4">
                    <div className="flex items-center gap-2">
                        <TimerIcon className="w-4 h-4 text-blue-500" />
                        <p className="text-sm font-semibold">Purchase History</p>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-background p-4 rounded-md">
                            <p className="text-xs text-muted-foreground">Last Vendor</p>
                            <p className="text-sm font-semibold">Seasonal Gourmet Supplies</p>
                        </div>
                        <div className="bg-background p-4 rounded-md">
                            <p className="text-xs text-muted-foreground">Last Purchase Date</p>
                            <p className="text-sm font-semibold">15/02/2024</p>
                        </div>
                        <div className="bg-background p-4 rounded-md">
                            <p className="text-xs text-muted-foreground">Last Price</p>
                            <p className="text-sm font-semibold">$4,150.00</p>
                        </div>
                        <div className="bg-background p-4 rounded-md">
                            <p className="text-xs text-muted-foreground">Unit</p>
                            <p className="text-sm font-semibold">kg</p>
                        </div>
                    </div>
                </Card>
                <TablePriceList />
            </DialogContent>
        </Dialog>
    )
};