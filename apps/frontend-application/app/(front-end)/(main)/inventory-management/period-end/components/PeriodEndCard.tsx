import React from 'react'
import { PeriodEndRecord } from '../data'
import SkeltonCardLoading from '@/components/ui-custom/Loading/SkeltonCardLoading'
import { Card, CardContent } from '@/components/ui/card'
import * as m from '@/paraglide/messages.js';
import { format } from 'date-fns';
import { getStatusBadge } from './PeriodEndTable';
import { useRouter } from '@/lib/i18n';

interface PeriodEndProps {
    periodEnds: PeriodEndRecord[]
    isLoading: boolean
}
const PeriodEndCard: React.FC<PeriodEndProps> = ({ periodEnds, isLoading }) => {
    const router = useRouter();

    if (isLoading) {
        <div className="grid grid-cols-1 gap-4">
            {[...Array(6)].map((_, index) => (
                <SkeltonCardLoading key={index} />
            ))}
        </div>;
    }

    console.log('periodEnds', periodEnds);

    return (
        <div className="grid grid-cols-1 gap-4">
            {periodEnds?.map((periodEnd) => (
                <Card key={periodEnd.id} className="hover:shadow-md transition-all cursor-pointer" onClick={() => {
                    router.push(`/inventory-management/period-end/${periodEnd.id}`)
                }}>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    ID
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {periodEnd.id}
                                </span>
                            </div>

                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    Period
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {periodEnd.period}
                                </span>
                            </div>

                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    Start Date
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {format(periodEnd.startDate, "PP")}
                                </span>
                            </div>

                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    End Date
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {format(periodEnd.endDate, "PP")}
                                </span>
                            </div>

                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    {m.status_text()}
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {getStatusBadge(periodEnd.status)}
                                </span>
                            </div>
                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    Completed By
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {periodEnd.completedBy}
                                </span>
                            </div>
                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    Completed At
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {periodEnd.completedAt ? format(periodEnd.completedAt, "PP") : "-"}
                                </span>
                            </div>
                            <div className="grid grid-cols-10 gap-4">
                                <span className="text-sm text-muted-foreground col-span-3">
                                    Notes
                                </span>
                                <span className="text-sm font-medium col-span-7">
                                    {periodEnd.notes}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default PeriodEndCard