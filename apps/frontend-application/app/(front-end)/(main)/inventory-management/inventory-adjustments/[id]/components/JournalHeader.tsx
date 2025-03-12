import { Badge } from '@/components/ui/badge'
import React from 'react'

interface JournalHeader {
    status: string
    journalNo: string
    postingDate: string
    postingPeriod: string
    description: string
    reference: string
    createdBy: string
    createdAt: string
    postedBy: string
    postedAt: string
}

interface JournalHeaderProps {
    header: JournalHeader
}
const JournalHeader: React.FC<JournalHeaderProps> = ({ header }) => {
    return (
        <div className="mb-6 space-y-6">
            <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">Journal Entry</h3>
                <Badge>{header.status}</Badge>
                <span className="text-sm text-muted-foreground">{header.journalNo}</span>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Posting Date</p>
                        <p className="font-medium">{header.postingDate}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Created By</p>
                        <p className="font-medium">{header.createdBy}</p>
                        <p className="text-xs text-muted-foreground">{header.createdAt}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Posting Period</p>
                        <p className="font-medium">{header.postingPeriod}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Posted By</p>
                        <p className="font-medium">{header.postedBy}</p>
                        <p className="text-xs text-muted-foreground">{header.postedAt}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium">{header.description}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Reference</p>
                        <p className="font-medium">{header.reference}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JournalHeader