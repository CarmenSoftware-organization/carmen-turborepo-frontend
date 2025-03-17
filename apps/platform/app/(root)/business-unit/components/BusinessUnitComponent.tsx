import { Button } from "@/components/ui/button";
import { getBusinessUnits } from "@/services/bu.service";
import Link from "next/link";
import BuFilter from "./BuFilter";
import BuList from "./BuList";

export default async function BusinessUnitComponent() {
    const businessUnits = await getBusinessUnits();
    return (
        <div className="space-y-4">
            <div className='flex justify-between items-center'>
                <div className='space-y-2'>
                    <h2 className="text-2xl font-bold tracking-tight">Business Units</h2>
                    <p className="text-muted-foreground">
                        Manage all hotels and properties in the system
                    </p>
                </div>
                <Button asChild>
                    <Link href="/business-unit/add">Add Business Unit</Link>
                </Button>
            </div>
            <BuFilter />
            <BuList businessUnits={businessUnits} />
        </div>
    )
}
