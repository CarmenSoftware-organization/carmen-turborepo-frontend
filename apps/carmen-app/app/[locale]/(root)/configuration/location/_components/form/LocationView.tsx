"use client";

import { Button } from "@/components/ui/button";
import { LocationByIdDto, PHYSICAL_COUNT_TYPE } from "@/dtos/location.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import LocationForm from "./LocationForm";
import { ChevronLeft, SquarePen } from "lucide-react";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { INVENTORY_TYPE } from "@/constants/enum";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabUsersLocation from "./TabUsersLocation";
import TabUsersProduct from "./TabUsersProduct";

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

  return (
    <>
      {currentMode === formType.VIEW ? (
        <div className="space-y-2 mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild className="hover:bg-transparent h-7 w-7">
                <Link href={`/configuration/location`}>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">{initialData?.name}</h1>
            </div>
            <Button onClick={handleEditMode} size="sm" className="h-7 w-7">
              <SquarePen className="w-4 h-4" />
            </Button>
          </div>

          <Separator />

          <dl className="grid grid-cols-[160px_1fr] gap-y-2 gap-x-4 text-sm">
            <dt className="font-medium text-muted-foreground">{tHeader("delivery_point")}</dt>
            <dd>{getDeliveryPointName(initialData?.delivery_point.id ?? "")}</dd>

            <dt className="font-medium text-muted-foreground">{tHeader("description")}</dt>
            <dd>{initialData?.description ?? "-"}</dd>

            <dt className="font-medium text-muted-foreground">{tHeader("type")}</dt>
            <dd>{initialData?.location_type && getLocationType(initialData.location_type)}</dd>

            <dt className="font-medium text-muted-foreground">{tHeader("status")}</dt>
            <dd>
              <StatusCustom is_active={initialData?.is_active ?? true}>
                {initialData?.is_active ? tCommon("active") : tCommon("inactive")}
              </StatusCustom>
            </dd>

            <dt className="font-medium text-muted-foreground">
              {tStoreLocation("physical_count_type")}
            </dt>
            <dd className="capitalize">
              {initialData?.physical_count_type === PHYSICAL_COUNT_TYPE.YES
                ? tCommon("yes")
                : tCommon("no")}
            </dd>
          </dl>

          <Separator />

          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">{tCommon("users")}</TabsTrigger>
              <TabsTrigger value="products">{tCommon("products")}</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <TabUsersLocation users={initialData?.user_location || []} />
            </TabsContent>
            <TabsContent value="products">
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
