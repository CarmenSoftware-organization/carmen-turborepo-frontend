import { ActivityLogEntry } from '@/lib/types'
import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'

interface Props {
    activityLog: ActivityLogEntry[]
}

const ActivityLogTab: React.FC<Props> = ({ activityLog }) => {

    const [searchTerm, setSearchTerm] = useState('')
    const filteredActivityLog = useMemo(() => {
        return activityLog.filter(entry =>
            entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.timestamp.toISOString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [activityLog, searchTerm])

    return (
        <div className='p-4 space-y-4'>
            <h2 className="text-xl font-bold">Activity Log</h2>
            <div className="space-y-4">
                <Input
                    placeholder="Search activity log..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date/Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredActivityLog.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>{entry.timestamp.toISOString()}</TableCell>
                            <TableCell>{entry.userName}</TableCell>
                            <TableCell>{entry.action}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {filteredActivityLog.length === 0 && (
                <div className="text-center py-4">
                    No matching activity log entries found.
                </div>
            )}
        </div>
    )
}

export default ActivityLogTab