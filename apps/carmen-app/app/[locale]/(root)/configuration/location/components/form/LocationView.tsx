"use client";

import { Button } from "@/components/ui/button";
import { LocationByIdDto, PHYSICAL_COUNT_TYPE } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import LocationForm from "./LocationForm";
import {
  Building,
  ChevronLeft,
  SquarePen,
} from "lucide-react";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { INVENTORY_TYPE } from "@/constants/enum";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { Separator } from "@/components/ui/separator";

interface LocationViewProps {
  readonly initialData?: LocationByIdDto;
  readonly mode: formType;
}

export default function LocationView({ initialData, mode }: LocationViewProps) {
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const { token, tenantId } = useAuth();

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
  }

  const handleViewMode = () => {
    setCurrentMode(formType.VIEW);
  };

  const handleEditMode = () => {
    setCurrentMode(formType.EDIT);
  };
  const { getDeliveryPointName } = useDeliveryPointQuery({ token, tenantId });

  return (
    <>
      {currentMode !== formType.VIEW ? (
        <LocationForm
          initialData={initialData}
          mode={currentMode}
          onViewMode={handleViewMode}
          token={token}
          tenantId={tenantId}
        />
      ) : (

        <div className="space-y-4 p-2">
          {/* Header */}
          <div className="fxr-c gap-2">
            <Button variant="ghost" size="sm" asChild className="hover:bg-transparent">
              <Link href={`/configuration/location`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div className="fxr-c gap-2">
              <Building />
              <h1 className="text-xl font-semibold">{initialData?.name}</h1>
            </div>
          </div>

          <Separator />

          <dl className="grid grid-cols-[160px_1fr] gap-y-2 gap-x-4 text-sm">
            <dt className="font-medium text-muted-foreground">{tHeader("delivery_point")}</dt>
            <dd>{getDeliveryPointName(initialData?.delivery_point.id ?? "")}</dd>

            <dt className="font-medium text-muted-foreground">{tHeader("description")}</dt>
            <dd>{initialData?.description ?? '-'}</dd>

            <dt className="font-medium text-muted-foreground">{tHeader("type")}</dt>
            <dd>{initialData?.location_type && getLocationType(initialData.location_type)}</dd>

            <dt className="font-medium text-muted-foreground">{tHeader("status")}</dt>
            <dd>
              <StatusCustom is_active={initialData?.is_active ?? true}>
                {initialData?.is_active ? tCommon("active") : tCommon("inactive")}
              </StatusCustom>
            </dd>

            <dt className="font-medium text-muted-foreground">{tStoreLocation("physical_count_type")}</dt>
            <dd className="capitalize">
              {initialData?.physical_count_type === PHYSICAL_COUNT_TYPE.YES
                ? tCommon("yes")
                : tCommon("no")}
            </dd>
          </dl>

          <Separator />

          <div className="space-y-2">
            <h2 className="text-sm font-semibold">
              {tCommon("users")} ({initialData?.user_location?.length ?? 0})
            </h2>
            {(initialData?.user_location?.length ?? 0) > 0 ? (
              <ul className="space-y-1 max-h-[150px] overflow-y-auto text-sm pl-4 list-disc">
                {initialData?.user_location.map((user) => (
                  <li key={user.id}>
                    {user.firstname} {user.lastname}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-xs text-center py-2">
                {tCommon("data_not_found")}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h2 className="text-sm font-semibold">
              {tCommon("products")} ({initialData?.product_location?.length ?? 0})
            </h2>
            {(initialData?.product_location?.length ?? 0) > 0 ? (
              <ul className="space-y-1 max-h-[150px] overflow-y-auto text-sm pl-4 list-disc">
                {initialData?.product_location.map((product) => (
                  <li key={product.id}>{product.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-xs text-center py-2">
                {tCommon("data_not_found")}
              </p>
            )}
          </div>

          <Separator />

          <Button
            onClick={handleEditMode}
            size="sm"
            variant="outlinePrimary"
            className="fxr-c gap-1 text-sm"
          >
            <SquarePen className="w-4 h-4" />
            {tCommon("edit")}
          </Button>
        </div>



      )}
    </>
  );
}
