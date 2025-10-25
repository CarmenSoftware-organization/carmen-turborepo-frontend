import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "@/lib/navigation";
import { Building2, FileText } from "lucide-react";

interface DialogNewPoProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
}

export default function DialogNewPo({ open, onOpenChange }: DialogNewPoProps) {
    const router = useRouter();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <p className="text-base font-semibold leading-none tracking-tight">
                        Create New Purchase Order
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Choose how you would like to create a new purchase order.
                    </p>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <Card
                        className="cursor-pointer hover:bg-accent/50 transition-all duration-300 ease-in-out"
                        onClick={() => router.push('/procurement/purchase-order/new?type=blank')}
                    >
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Blank PO
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                Create a new purchase order from scratch.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:bg-accent/50 transition-all duration-300 ease-in-out"
                        onClick={() => router.push('/procurement/purchase-order/new?type=pr')}
                    >
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    From PR
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                Create a new purchase order from a purchase request.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}