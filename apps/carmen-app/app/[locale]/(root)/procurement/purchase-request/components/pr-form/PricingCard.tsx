import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, TrendingUp } from "lucide-react";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { useCurrency } from "@/hooks/useCurrency";
import { useVendor } from "@/hooks/useVendor";

interface PricingCardProps {
    readonly item: PurchaseRequestDetailItem;
    readonly onItemUpdate: (field: keyof PurchaseRequestDetailItem, value: any) => void;
}

export default function PricingCard({ item, onItemUpdate }: PricingCardProps) {
    const { getCurrencyCode } = useCurrency();
    const { getVendorName } = useVendor();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="text-green-500" />
                        Pricing
                    </div>
                    <Button variant="outline" size="sm" className="w-fit h-7">
                        <TrendingUp /> Vendor Comparison
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-5 gap-4">
                    <div>
                        <Label>Vendor</Label>
                        <Input
                            value={getVendorName(item.vendor_id)}
                            onChange={(e) =>
                                onItemUpdate("vendor_id", e.target.value)
                            }
                            placeholder="Vendor"
                            className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <Label>Pricelist Number</Label>
                        <Input
                            value={item.pricelist_detail_id}
                            onChange={(e) =>
                                onItemUpdate("pricelist_detail_id", e.target.value)
                            }
                            placeholder="Pricelist Number"
                            className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <Label>Order Currency</Label>
                        <Input
                            value={getCurrencyCode(item.currency_id)}
                            onChange={(e) =>
                                onItemUpdate("currency_id", e.target.value)
                            }
                            placeholder="Order Currency"
                            className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                        <p className="text-xs text-muted-foreground">
                            Base Currency: USD (mock)
                        </p>
                    </div>
                    <div>
                        <Label>Exchange Rate</Label>
                        <Input
                            value={item.exchange_rate}
                            onChange={(e) =>
                                onItemUpdate("exchange_rate", e.target.value)
                            }
                            placeholder="Exchange Rate"
                            className="text-sm text-right h-8 border-blue-300 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <Label>Price per Unit</Label>
                        <Input
                            value={item.price}
                            onChange={(e) =>
                                onItemUpdate("price", e.target.value)
                            }
                            placeholder="Price per Unit"
                            className="text-sm text-right h-8 border-blue-300 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Discount</Label>
                        <div className="bg-green-50 p-2 rounded-md grid grid-cols-3 gap-2 h-20">
                            <div className="space-y-1">
                                <Label className="text-green-700 font-semibold">Type</Label>
                                <Input />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-green-700 font-semibold">Rate</Label>
                                <Input />
                            </div>
                            <div className="space-y-1">
                                <Label className="flex items-center gap-2 my-1 text-green-700 font-semibold">
                                    <Checkbox />
                                    Amount
                                </Label>
                                <Input />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>Net Total</Label>
                        <div className="bg-blue-50 p-2 rounded-md h-20 flex items-center justify-end">
                            <p className="text-blue-700 font-bold text-xl">(mock) USD 100.00</p>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                            Base Net Total: USD 8,400.00
                        </p>
                    </div>
                    <div className="space-y-1">
                        <Label>Tax</Label>
                        <div className="bg-yellow-50 p-2 rounded-md h-20 grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <Label className="text-yellow-700 font-semibold">Type</Label>
                                <Input />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-yellow-700 font-semibold">Rate</Label>
                                <Input />
                            </div>
                            <div className="space-y-1">
                                <Label className="flex items-center gap-2 my-1 text-yellow-700 font-semibold">
                                    <Checkbox />
                                    Amount
                                </Label>
                                <Input />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                            Base Tax: USD 1,600.00
                        </p>
                    </div>
                    <div className="space-y-1">
                        <Label>Total Amount</Label>
                        <div className="bg-green-50 p-2 rounded-md h-20 flex items-center justify-end">
                            <p className="text-green-700 font-bold text-xl">(mock) USD 100.00</p>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                            Base Total Amount: USD 10,000.00
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}