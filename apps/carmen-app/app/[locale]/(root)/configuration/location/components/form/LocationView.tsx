"use client";

import { Button } from "@/components/ui/button";
import { LocationByIdDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import LocationForm from "./LocationForm";
import { Edit, MapPin, Package, Settings, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { STORE_LOCATION_TYPE_COLOR } from "@/utils/badge-status-color";

interface LocationViewProps {
  readonly initialData?: LocationByIdDto;
  readonly mode: formType;
}

export default function LocationView({ initialData, mode }: LocationViewProps) {
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const { token, tenantId } = useAuth();

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
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{initialData?.name}</h1>
              <p className="text-sm">Location Details</p>
            </div>
            <Button
              onClick={handleEditMode}
              className="flex items-center gap-2 h-7"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-1 text-sm">Name</p>
                  <p className="text-sm">{initialData?.name}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm">Delivery Point</p>
                  <p className="text-sm font-mono">
                    {getDeliveryPointName(initialData?.delivery_point.id ?? "")}
                  </p>
                </div>
                {initialData?.description && (
                  <div>
                    <p className="font-semibold mb-1 text-sm">Description</p>
                    <p className="text-sm">{initialData?.description}</p>
                  </div>
                )}

                <div>
                  <p className="font-semibold mb-1 text-sm">Type</p>
                  {initialData?.location_type && (
                    <Badge
                      className={STORE_LOCATION_TYPE_COLOR(
                        initialData.location_type
                      )}
                    >
                      {initialData.location_type.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-1 text-sm">Status</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${initialData?.is_active ? "bg-green-500" : "bg-gray-400"}`}
                    ></div>
                    <span className="text-sm">
                      {initialData?.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-sm">
                    Physical Count Type
                  </p>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="tcapitalize">
                      {initialData?.physical_count_type}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Users ({initialData?.user_location?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(initialData?.user_location?.length ?? 0) > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {initialData?.user_location.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 rounded-lg px-3 py-2"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                        {user.name ? user.name : "-"}
                      </div>
                      <span className="text-xs font-medium">{user.id}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-xs">
                    No users associated with this location
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Products ({initialData?.product_location?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(initialData?.product_location?.length ?? 0) > 0 ? (
                <div className="overflow-y-auto max-h-[200px]">
                  {initialData?.product_location.map((product) => (
                    <ul
                      key={product.id}
                      className="list-disc list-inside"
                    >
                      <li className="text-xs">{product.name}</li>
                    </ul>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm">
                    No products associated with this location
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
