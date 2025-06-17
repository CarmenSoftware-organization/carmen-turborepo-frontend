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
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Location
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={initialData?.is_active ? "active" : "inactive"}
              className="text-sm"
            >
              {initialData?.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {initialData?.location_type}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-1">Location Name</h3>
                  <p className="text-sm">{initialData?.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Delivery Point ID</h3>
                  <p className="text-sm font-mono">
                    {getDeliveryPointName(initialData?.delivery_point.id ?? "")}
                  </p>
                </div>
              </div>

              {initialData?.description && (
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-sm">{initialData?.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-1">Location Type</h3>
                <p className="text-sm">{initialData?.location_type}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Status</h3>
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
                  <h3 className="font-semibold mb-1">Physical Count Type</h3>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
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
                <Users className="w-5 h-5" />
                Associated Users ({initialData?.users?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(initialData?.users?.length ?? 0) > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {initialData?.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 rounded-lg px-3 py-2"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                        {user.name ? user.name : "-"}
                      </div>
                      <span className="text-sm font-medium">{user.id}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm">
                    No users associated with this location
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
