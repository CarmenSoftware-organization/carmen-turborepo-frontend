import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function VendorComparison() {
    return (
        <Dialog>
            <DialogTrigger
                className="hover:bg-transparent text-primary hover:text-primary/70 text-sm font-semibold pr-4"

            >
                Compare
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Vendor Comparison</DialogTitle>
                    <DialogDescription>
                        Compare the vendor and pricing information
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}