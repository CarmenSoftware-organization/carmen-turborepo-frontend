import { useCluster } from "@/app/hooks/useCluster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Building2, CreditCard, Database, Mail, MapPin, Phone, Settings } from "lucide-react";

interface BuFormProps {
    businessData: IBuDto;
}

export default function BuForm({ businessData }: BuFormProps) {
    const { getClusterName } = useCluster();
    const router = useRouter();
    const hotelInfo = businessData?.config?.find((c) => c.key === "hotel")?.value as any
    const companyInfo = businessData?.config?.find((c) => c.key === "company")?.value as any
    const taxId = businessData?.config?.find((c) => c.key === "tax_id")?.value
    const branchNo = businessData?.config?.find((c) => c.key === "branch_no")?.value
    const systemConfigs = businessData?.config?.filter((c) => !["hotel", "company", "tax_id", "branch_no"].includes(c.key))
    const clusterName = getClusterName(businessData?.cluster_id)
    // Helper function to render config values
    const renderConfigValue = (value: any, key: string) => {
        if (typeof value === 'object' && value !== null) {
            switch (key) {
                case 'amount':
                case 'quantity':
                case 'recipe':
                    return `${value.locales} (${value.minimumIntegerDigits} digits)`;
                default:
                    return JSON.stringify(value, null, 2);
            }
        }
        return value;
    };

    return (
        <div className="container space-y-2">
            <Button variant="outline" onClick={() => router.push("/business")}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{businessData?.name}</h1>
                <p className="text-muted-foreground">CODE: {businessData?.code}</p>
                <p className="text-muted-foreground">Cluster: {clusterName}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Database Connection
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-8">
                        <span className="col-span-1 text-sm font-medium">Provider:</span>
                        <Badge variant="outline">{businessData?.db_connection?.provider}</Badge>
                    </div>
                    <div className="grid grid-cols-8">
                        <span className="col-span-1 text-sm font-medium">Host:</span>
                        <span className="text-sm font-mono">{businessData?.db_connection?.host}</span>
                    </div>
                    <div className="grid grid-cols-8">
                        <span className="col-span-1 text-sm font-medium">Port:</span>
                        <span className="text-sm">{businessData?.db_connection?.port}</span>
                    </div>
                    <div className="grid grid-cols-8">
                        <span className="col-span-1 text-sm font-medium">Database:</span>
                        <span className="text-sm">{businessData?.db_connection?.database}</span>
                    </div>
                    <div className="grid grid-cols-8">
                        <span className="col-span-1 text-sm font-medium">Schema:</span>
                        <span className="text-sm">{businessData?.db_connection?.schema}</span>
                    </div>
                    <div className="grid grid-cols-8">
                        <span className="col-span-1 text-sm font-medium">Username:</span>
                        <span className="text-sm">{businessData?.db_connection?.username}</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Settings className="h-6 w-6" />
                        Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Hotel Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/30">
                            <div>
                                <h4 className="font-semibold text-base mb-2">{hotelInfo?.name}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <p>{hotelInfo?.address}</p>
                                            <p className="text-muted-foreground">
                                                {hotelInfo?.country} {hotelInfo?.zip_code}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{hotelInfo?.telephone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{hotelInfo?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Company Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/30">
                            <div>
                                <h4 className="font-semibold text-base mb-2">{companyInfo?.name}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <p>{companyInfo?.address}</p>
                                            <p className="text-muted-foreground">
                                                {companyInfo?.country} {companyInfo?.zip_code}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{companyInfo?.telephone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{companyInfo?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Tax & Legal Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/30">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Tax ID:</span>
                                <span className="text-sm">{taxId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Branch Number:</span>
                                <span className="text-sm">{branchNo}</span>
                            </div>
                        </div>
                    </div>

                    <Separator />
                    <div>
                        <h3 className="text-lg font-semibold mb-3">System Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {systemConfigs?.map((config) => (
                                <div key={config.id} className="p-3 rounded-lg border bg-card">
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-sm font-medium text-muted-foreground">{config.label}</span>
                                        <span className="text-sm font-semibold">
                                            {renderConfigValue(config.value, config.key)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}