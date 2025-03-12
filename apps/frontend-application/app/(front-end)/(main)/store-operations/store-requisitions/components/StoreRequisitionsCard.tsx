import React from 'react'
import { RequisitionType, statusVariantMap } from '../data'
import SkeltonCardLoading from '@/components/ui-custom/Loading/SkeltonCardLoading'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import * as m from '@/paraglide/messages.js';
import { StatusBadge } from '@/components/ui-custom/StatusBadge'

interface StoreRequisitionsProps {
    storeRequisition: RequisitionType[]
    isLoading: boolean
}

const StoreRequisitionsCard: React.FC<StoreRequisitionsProps> = ({
    storeRequisition, isLoading
}) => {
    if (isLoading) {
        <div className="grid grid-cols-1 gap-4">
            {[...Array(6)].map((_, index) => (
                <SkeltonCardLoading key={index} />
            ))}
        </div>;
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {storeRequisition?.map((storeRequisition) => (
                <Card key={storeRequisition.refNo} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    {m.date()}
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {storeRequisition.date}
                                </span>
                            </div>
                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    {m.ref()}
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {storeRequisition.refNo}
                                </span>
                            </div>
                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    {m.request_to()}
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {storeRequisition.requestTo}
                                </span>
                            </div>
                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    {m.store_name()}
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {storeRequisition.storeName}
                                </span>
                            </div>

                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    {m.request_to()}
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {storeRequisition.requestTo}
                                </span>
                            </div>
                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    {m.description()}
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {storeRequisition.description}
                                </span>
                            </div>

                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    {m.total_amout()}
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(storeRequisition.totalAmount)}
                                </span>
                            </div>

                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    {m.status_text()}
                                </span>
                                <div className='col-span-3'>
                                    <StatusBadge variant={statusVariantMap[storeRequisition.status]}>
                                        {storeRequisition.status}
                                    </StatusBadge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-0 pb-2 px-2">
                        <Button asChild variant="ghost">
                            <Link href={`/store-operations/store-requisitions/${storeRequisition.refNo}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default StoreRequisitionsCard