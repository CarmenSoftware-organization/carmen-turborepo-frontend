import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FLAGGED_REQUESTS, PENDING_REQUESTS } from './types_data';
import RequestList from './RequestList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as m from '@/paraglide/messages.js';
const PrqApproval = () => {
    return (
        <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="border-b">
                <CardTitle>{m.procurement_request_queue()}</CardTitle>
                <CardDescription>{m.staff_requests_awaiting_your_approval()}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue="pending-approval" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pending-approval">{m.pending_approval()}</TabsTrigger>
                        <TabsTrigger value="flagged">{m.flagged_for_review()}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending-approval" className="p-4">
                        <ScrollArea className="h-[500px] pr-4">
                            <RequestList requests={PENDING_REQUESTS} variant="pending" />
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="flagged" className="p-4">
                        <ScrollArea className="h-[500px] pr-4">
                            <RequestList requests={FLAGGED_REQUESTS} variant="flagged" />
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default PrqApproval;
