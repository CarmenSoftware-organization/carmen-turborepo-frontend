import SearchInput from "@/components/ui-custom/SearchInput";
import { Button } from "@/components/ui/button";
import { useURL } from "@/hooks/useURL";
import { mockPurchaseRequests } from "@/mock-data/procurement";
import PurchaseRequestList from "./PurchaseRequestList";
import { useRouter } from "@/lib/navigation";

export default function FromPr() {
    const router = useRouter();
    const [search, setSearch] = useURL('search');
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
                <h1>Create PO from Purchase Requests</h1>
                <div className="fxr-c gap-2">
                    <Button
                        size={'sm'}
                        variant={'outline'}
                        onClick={() => router.push('/procurement/purchase-order')}
                    >
                        Cancel
                    </Button>
                    <Button size={'sm'}>
                        Create Purchase Request
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-lg font-semibold">Select Purchase Requests</p>
                <p className="text-sm text-muted-foreground">
                    Create PO from PR
                </p>
                <SearchInput
                    defaultValue={search}
                    onSearch={setSearch}
                    placeholder="Search..."
                    data-id="po-list-search-input"
                />
            </div>
            <PurchaseRequestList purchaseRequests={mockPurchaseRequests} />
        </div>
    );
}

