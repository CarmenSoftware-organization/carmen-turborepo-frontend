"use client";

import { Button } from "@/components/ui/button";
import { LocationByIdDto, PHYSICAL_COUNT_TYPE } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import LocationForm from "./LocationForm";
import {
  ChevronLeft,
  SquarePen,
} from "lucide-react";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { INVENTORY_TYPE } from "@/constants/enum";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";

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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-transparent"
            >
              <Link href={`/configuration/location`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold leading-tight">
              {initialData?.name}
            </h1>
          </div>

          {/* Details */}
          <div className="px-6 space-y-4">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-start">
              <p className="font-semibold text-base">{tHeader("delivery_point")}</p>
              <p className="text-base">
                {getDeliveryPointName(initialData?.delivery_point.id ?? "")}
              </p>

              <p className="font-semibold text-base">{tHeader("description")}</p>
              <p className="text-base">{initialData?.description ?? '-'}</p>

              <p className="font-semibold text-base">{tHeader("type")}</p>
              {initialData?.location_type && (
                <p className="text-base">
                  {getLocationType(initialData.location_type)}
                </p>
              )}

              <p className="font-semibold text-base">{tHeader("status")}</p>
              <StatusCustom is_active={initialData?.is_active ?? true}>
                {initialData?.is_active ? tCommon("active") : tCommon("inactive")}
              </StatusCustom>

              <p className="font-semibold text-base">
                {tStoreLocation("physical_count_type")}
              </p>
              <p className="text-base capitalize">
                {initialData?.physical_count_type === PHYSICAL_COUNT_TYPE.YES
                  ? tCommon("yes")
                  : tCommon("no")}
              </p>
            </div>

            {/* Users */}
            <div className="space-y-2">
              <p className="font-semibold text-base">
                {tCommon("users")} ({initialData?.user_location?.length ?? 0})
              </p>
              {(initialData?.user_location?.length ?? 0) > 0 ? (
                <div className="overflow-y-auto max-h-[200px]">
                  {initialData?.user_location.map((user) => (
                    <ul key={user.id} className="list-disc list-inside">
                      <li className="text-sm font-medium">
                        {user.firstname} {user.lastname}
                      </li>
                    </ul>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm">{tCommon("data_not_found")}</p>
                </div>
              )}
            </div>

            {/* Products */}
            <div className="space-y-2">
              <p className="font-semibold text-base">
                {tCommon("products")} ({initialData?.product_location?.length ?? 0})
              </p>
              {(initialData?.product_location?.length ?? 0) > 0 ? (
                <div className="overflow-y-auto max-h-[200px]">
                  {initialData?.product_location.map((product) => (
                    <ul key={product.id} className="list-disc list-inside">
                      <li className="text-sm">{product.name}</li>
                    </ul>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm">{tCommon("data_not_found")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Edit button */}
          <div className="px-6">
            <Button
              onClick={handleEditMode}
              size="sm"
              variant="outlinePrimary"
              className="flex items-center gap-2"
            >
              <SquarePen className="w-4 h-4" />
              {tCommon("edit")}
            </Button>
          </div>
        </div>

      )}
    </>
  );
}
