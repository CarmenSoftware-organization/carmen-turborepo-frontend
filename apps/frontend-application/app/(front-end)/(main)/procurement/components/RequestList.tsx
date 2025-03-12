import React from 'react'
import { FlaggedRequest, getUrgencyBadgeClasses, PendingRequest } from './types_data'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Eye, ThumbsUp, Users } from 'lucide-react'
import { Button } from '@/components/ui-custom/button'
import * as m from '@/paraglide/messages.js';

const RequestList = ({
    requests,
    variant
}: {
    requests: (PendingRequest | FlaggedRequest)[],
    variant: 'pending' | 'flagged'
}) => {
    return (
        <ul className="space-y-4">
            {requests.map((request) => (
                <li key={request.id} className="p-4 rounded-md border">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg text-gray-800">{request.item}</h3>
                        <Badge
                            variant="outline"
                            className={getUrgencyBadgeClasses(request.urgency)}
                        >
                            {request.urgency}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                        {request.quantity} {m.units()}, ${request.total.toLocaleString()} - {m.requested_by()} {request.requester}
                    </p>
                    <div className="flex-between">
                        <div>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800 mr-2">
                                <Users className="w-3 h-3 mr-1" />
                                {request.department}
                            </Badge>
                            {variant === 'flagged' && 'flag' in request && (
                                <Badge
                                    variant="destructive"
                                    className="bg-red-100 text-red-800 border border-red-200"
                                >
                                    {request.flag}
                                </Badge>
                            )}
                        </div>
                        <div className="space-x-2">
                            {variant === 'pending' ? (
                                <>
                                    <Button size="sm" variant="outline">
                                        <Eye className="w-4 h-4 mr-2" />
                                        {m.details()}
                                    </Button>
                                    <Button size="sm">
                                        <ThumbsUp className="w-4 h-4 mr-2" />
                                        {m.approve()}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button size="sm" variant="outline">
                                        <Eye className="w-4 h-4 mr-2" />
                                        {m.details()}
                                    </Button>
                                    <Button size="sm" variant="secondary">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {m.review()}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default RequestList