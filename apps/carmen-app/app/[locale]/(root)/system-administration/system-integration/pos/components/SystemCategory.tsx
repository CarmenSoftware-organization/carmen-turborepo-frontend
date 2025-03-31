import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
    Settings,
    Map,
    Layers,
    FileBarChart2,
    RefreshCcw,
    ArrowRight,
    LucideIcon
} from "lucide-react";

// Types
interface SystemStatus {
    unmappedItems: number;
    failedTransactions: number;
    pendingApprovals: number;
    todaysSales: {
        amount: number;
        target: number;
        percentage: number;
    };
}

interface BaseItem {
    title: string;
    description: string;
}

interface LinkItem extends BaseItem {
    link: string;
    buttonText: string;
    highlight?: boolean;
    disabled?: boolean;
}

interface StatusItem extends BaseItem {
    isStatus: true;
    status: {
        isConnected: boolean;
        text: string;
    };
}

interface ProgressItem extends BaseItem {
    isProgress: true;
    progress: {
        value: number;
        amount: number;
        target: number;
    };
}

type CategoryItem = LinkItem | StatusItem | ProgressItem;

interface SystemCategory {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    items: CategoryItem[];
    footerLink: string;
    footerText: string;
}

// Mock data for system status
const systemStatus: SystemStatus = {
    unmappedItems: 5,
    failedTransactions: 2,
    pendingApprovals: 3,
    todaysSales: {
        amount: 1234.56,
        target: 1900.00,
        percentage: 65
    }
};

// Helper functions for dynamic descriptions
const getRecipeMappingDescription = (unmappedItems: number) =>
    unmappedItems > 0 ? `${unmappedItems} items need mapping` : "Map POS items to system recipes";

const getFailedTransactionsDescription = (failedTransactions: number) =>
    failedTransactions > 0 ? `${failedTransactions} transactions failed` : "No failed transactions";

const getPendingApprovalsDescription = (pendingApprovals: number) =>
    pendingApprovals > 0 ? `${pendingApprovals} pending approvals` : "No pending approvals";

// Mock data for system categories
const systemCategories: SystemCategory[] = [
    {
        id: "setup",
        title: "Setup",
        description: "Configure POS system integration and settings",
        icon: Settings,
        items: [
            {
                title: "POS Configuration",
                description: "API settings and connection details",
                link: "/system-administration/system-integrations/pos/settings/config",
                buttonText: "Configure"
            },
            {
                title: "System Settings",
                description: "Workflow and notification preferences",
                link: "/system-administration/system-integrations/pos/settings/system",
                buttonText: "Settings"
            },
            {
                title: "Connection Status",
                description: "Connected to Comanche POS",
                isStatus: true,
                status: {
                    isConnected: true,
                    text: "Connected to Comanche POS"
                }
            }
        ],
        footerLink: "/system-administration/system-integrations/pos/settings/config",
        footerText: "Go to Setup"
    },
    {
        id: "mapping",
        title: "Mapping",
        description: "Map POS data to system entities",
        icon: Map,
        items: [
            {
                title: "Recipe Mapping",
                description: getRecipeMappingDescription(systemStatus.unmappedItems),
                link: "/system-administration/system-integrations/pos/mapping/recipes",
                buttonText: "Map Recipes",
                highlight: systemStatus.unmappedItems > 0
            },
            {
                title: "Unit Mapping",
                description: "Configure unit conversions",
                link: "/system-administration/system-integrations/pos/mapping/units",
                buttonText: "Map Units"
            },
            {
                title: "Location Mapping",
                description: "Map POS locations to system locations",
                link: "/system-administration/system-integrations/pos/mapping/locations",
                buttonText: "Map Locations"
            }
        ],
        footerLink: "/system-administration/system-integrations/pos/mapping/recipes",
        footerText: "Go to Mapping"
    },
    {
        id: "operations",
        title: "Operations",
        description: "Manage daily POS operations and transactions",
        icon: Layers,
        items: [
            {
                title: "View Transactions",
                description: "Browse and filter transaction history",
                link: "/system-administration/system-integrations/pos/transactions",
                buttonText: "View All"
            },
            {
                title: "Failed Transactions",
                description: getFailedTransactionsDescription(systemStatus.failedTransactions),
                link: "/system-administration/system-integrations/pos/transactions?filter=failed",
                buttonText: "Review",
                disabled: systemStatus.failedTransactions === 0,
                highlight: systemStatus.failedTransactions > 0
            },
            {
                title: "Stock-out Review",
                description: getPendingApprovalsDescription(systemStatus.pendingApprovals),
                link: "/system-administration/system-integrations/pos/transactions/stock-out-review",
                buttonText: "Approve",
                disabled: systemStatus.pendingApprovals === 0,
                highlight: systemStatus.pendingApprovals > 0
            }
        ],
        footerLink: "/system-administration/system-integrations/pos/transactions",
        footerText: "Go to Operations"
    },
    {
        id: "reporting",
        title: "Reporting",
        description: "Access reports and analytics",
        icon: FileBarChart2,
        items: [
            {
                title: "Gross Profit Analysis",
                description: "Sales vs. Cost analysis by category",
                link: "/system-administration/system-integrations/pos/reports/gross-profit",
                buttonText: "View Report"
            },
            {
                title: "Consumption Report",
                description: "Actual vs. Theoretical usage analysis",
                link: "/system-administration/system-integrations/pos/reports/consumption",
                buttonText: "View Report"
            },
            {
                title: "Today&apos;s Sales",
                description: "Sales progress",
                isProgress: true,
                progress: {
                    value: systemStatus.todaysSales.percentage,
                    amount: systemStatus.todaysSales.amount,
                    target: systemStatus.todaysSales.target
                }
            }
        ],
        footerLink: "/system-administration/system-integrations/pos/reports",
        footerText: "Go to Reports"
    }
];

// Helper function for description text color
const getDescriptionTextColor = (item: CategoryItem) =>
    'highlight' in item && item.highlight ? 'text-amber-600 font-medium' : 'text-muted-foreground';

// Helper function for rendering item content
const renderItemContent = (item: CategoryItem) => {
    if ('isStatus' in item) {
        return (
            <Button size="sm" variant="ghost">
                <RefreshCcw className="h-4 w-4" />
            </Button>
        );
    }

    if ('isProgress' in item) {
        return (
            <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium">{item.title}</h3>
                    <span className="text-xs font-bold">${item.progress.amount.toFixed(2)}</span>
                </div>
                <Progress value={item.progress.value} className="h-1.5" />
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.progress.value}% of target</span>
                    <span className="text-muted-foreground">Target: ${item.progress.target.toFixed(2)}</span>
                </div>
            </div>
        );
    }

    return (
        <Button asChild variant="outline" size="sm" disabled={item.disabled}>
            <Link href={item.link}>
                {item.buttonText}
            </Link>
        </Button>
    );
};

export default function SystemCategory() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {systemCategories.map((category) => {
                const Icon = category.icon;
                return (
                    <Card key={category.id} className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <Icon className="h-5 w-5" />
                                <span>{category.title}</span>
                            </CardTitle>
                            <CardDescription>
                                {category.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                {category.items.map((item) => (
                                    <div key={item.title}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-medium">{item.title}</h3>
                                                <p className={`text-xs ${getDescriptionTextColor(item)}`}>
                                                    {item.description}
                                                </p>
                                            </div>
                                            {renderItemContent(item)}
                                        </div>
                                        {item !== category.items[category.items.length - 1] && <Separator className="my-3" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-3 flex justify-end">
                            <Button asChild size="sm">
                                <Link href={category.footerLink}>
                                    {category.footerText}
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
