import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSubscription } from "@/mock-data/subscription";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function SubscriptionList() {
    const subscriptions = mockSubscription;
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map((subscription) => (
                    <Card key={subscription.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl font-bold">{subscription.name}</CardTitle>
                                <Badge variant={subscription.status ? "default" : "destructive"}>
                                    {subscription.status ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <CardDescription className="mt-2 line-clamp-2 h-10">
                                {subscription.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-2xl font-bold">${subscription.price}</span>
                                    <span className="text-gray-500">/{subscription.period}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">Total Users</span>
                                        <div className="flex items-center mt-1">
                                            <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                                            <span className="font-medium">{subscription.total_users.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">Platform Users</span>
                                        <div className="flex items-center mt-1">
                                            <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                                            <span className="font-medium">{subscription.platform_users.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">Business Unit Users</span>
                                        <div className="flex items-center mt-1">
                                            <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                                            <span className="font-medium">{subscription.bu_users.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">Cluster Users</span>
                                        <div className="flex items-center mt-1">
                                            <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                                            <span className="font-medium">{subscription.cluster_users.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">Next Billing</span>
                                        <div className="flex items-center mt-1">
                                            <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                                            <span className="font-medium">
                                                {formatDistanceToNow(new Date(subscription.next_billing_date), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 pb-2">
                                    <span className="text-sm text-gray-500">Active Module</span>
                                    <div className="mt-1">
                                        <Badge variant="outline">
                                            {subscription.active_module.map((module) => (
                                                <span key={module.id}>{module.name}</span>
                                            ))}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {subscriptions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-xl font-medium text-gray-900">No subscriptions found</p>
                    <p className="text-gray-500 mt-2">No subscription data is available at the moment.</p>
                </div>
            )}
        </div>
    );
}
