"use client";

import { Button } from "@/components/ui/button";
import { LocationByIdDto, PHYSICAL_COUNT_TYPE } from "@/dtos/location.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import LocationForm from "./LocationForm";
import { SquarePen, Check, X, MapPin, Users, Package } from "lucide-react";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { INVENTORY_TYPE } from "@/constants/enum";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabUsersLocation from "./TabUsersLocation";
import TabUsersProduct from "./TabUsersProduct";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LoadingLocation from "./LoadingLocation";

interface LocationViewProps {
  readonly initialData?: LocationByIdDto;
  readonly mode: formType;
}

export default function LocationView({ initialData, mode }: LocationViewProps) {
  const { token, buCode } = useAuth();
  const { getDeliveryPointName } = useDeliveryPointQuery({ token, buCode });
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const tStoreLocation = useTranslations("StoreLocation");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");

  const getLocationType = (location_type: INVENTORY_TYPE) => {
    if (location_type === INVENTORY_TYPE.DIRECT) {
      return tStoreLocation("direct");
    } else if (location_type === INVENTORY_TYPE.CONSIGNMENT) {
      return tStoreLocation("consignment");
    }
    return tStoreLocation("inventory");
  };

  const handleViewMode = () => {
    setCurrentMode(formType.VIEW);
  };

  const handleEditMode = () => {
    setCurrentMode(formType.EDIT);
  };

  const usersCount = initialData?.user_location?.length || 0;
  const productsCount = initialData?.product_location?.length || 0;

  // Show loading skeleton if no data
  if (currentMode === formType.VIEW && !initialData) {
    return <LoadingLocation />;
  }

  return (
    <>
      {currentMode === formType.VIEW ? (
        <div className="space-y-4 mx-auto max-w-3xl">
          {/* Header: Breadcrumb + Edit button */}
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/configuration/location"
                      className="hover:text-primary transition-colors"
                    >
                      {tStoreLocation("title")}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">{initialData?.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleEditMode}
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <SquarePen className="w-4 h-4" />
                    {tCommon("edit")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tCommon("edit")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Main Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                      {initialData?.name}
                    </h2>
                    <Badge variant="outline" className="mt-1.5 font-mono text-xs">
                      {initialData?.code}
                    </Badge>
                  </div>
                </div>
                <Badge
                  variant={initialData?.is_active ? "default" : "destructive"}
                  className="h-6 gap-1.5"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${initialData?.is_active ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                  />
                  {initialData?.is_active ? tCommon("active") : tCommon("inactive")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Delivery Point */}
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {tHeader("delivery_point")}
                  </dt>
                  <dd className="text-sm font-medium">
                    {getDeliveryPointName(initialData?.delivery_point.id ?? "")}
                  </dd>
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {tHeader("type")}
                  </dt>
                  <dd>
                    <Badge variant="secondary" className="font-normal">
                      {initialData?.location_type && getLocationType(initialData.location_type)}
                    </Badge>
                  </dd>
                </div>

                {/* Physical Count */}
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {tStoreLocation("physical_count_type")}
                  </dt>
                  <dd>
                    {initialData?.physical_count_type === PHYSICAL_COUNT_TYPE.YES ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        {tCommon("yes")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        <X className="w-3 h-3 mr-1" />
                        {tCommon("no")}
                      </Badge>
                    )}
                  </dd>
                </div>

                {/* Description - Full width */}
                <div className="space-y-1 sm:col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {tHeader("description")}
                  </dt>
                  <dd className="text-sm text-muted-foreground">
                    {initialData?.description || "-"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                {tCommon("users")}
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {usersCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                {tCommon("products")}
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {productsCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-4">
              <TabUsersLocation users={initialData?.user_location || []} />
            </TabsContent>
            <TabsContent value="products" className="mt-4">
              <TabUsersProduct products={initialData?.product_location || []} />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <LocationForm
          initialData={initialData}
          mode={currentMode}
          onViewMode={handleViewMode}
          token={token}
          buCode={buCode}
        />
      )}
    </>
  );
}
