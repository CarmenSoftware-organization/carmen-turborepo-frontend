import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mockPlans } from "@/mock-data/subscription";
import { Check, Info } from "lucide-react";

export default function PlanTier() {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {mockPlans.map((plan) => (
                <Card key={plan.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{plan.name}</CardTitle>
                            <Badge>Active</Badge>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="text-3xl font-bold">${plan.price}</div>
                            <div className="text-sm text-muted-foreground">per business unit / month</div>
                        </div>
                        <ul className="space-y-2 text-sm">
                            {plan.features.map((feature, index) => (
                                <li key={`${plan.id}-${feature}`} className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    <span>{feature}</span>
                                    {index === 2 && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="w-[200px] text-xs">Cluster Users can access multiple business units within a cluster</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                    {index === 3 && plan.id === "basic" && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="w-[200px] text-xs">Choose from: Accounting, Inventory, Sales, Analytics, PMS, HR</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
