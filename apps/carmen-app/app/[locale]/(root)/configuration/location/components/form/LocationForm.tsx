import {
  formLocationSchema,
  FormLocationValues,
  LocationByIdDto,
  PHYSICAL_COUNT_TYPE,
} from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useUserList } from "@/hooks/useUserList";
import LocationUser from "./LocationUser";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { INVENTORY_TYPE } from "@/constants/enum";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "@/lib/navigation";
import DeliveryPointLookup from "@/components/lookup/DeliveryPointLookup";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useLocationMutation, useUpdateLocation } from "@/hooks/use-location";

interface LocationFormProps {
  readonly initialData?: LocationByIdDto;
  readonly mode: formType;
  readonly onViewMode: () => void;
  readonly token: string;
  readonly tenantId: string;
}

interface LocationResponse {
  id: string;
  name: string;
  location_type: INVENTORY_TYPE;
  physical_count_type: PHYSICAL_COUNT_TYPE;
  description: string;
  is_active: boolean;
  delivery_point: {
    id: string;
    name: string;
    is_active: boolean;
  };
}

export default function LocationForm({
  initialData,
  mode,
  onViewMode,
  token,
  tenantId,
}: LocationFormProps) {
  const { userList } = useUserList();
  const router = useRouter();

  const createMutation = useLocationMutation(token, tenantId);
  const updateMutation = useUpdateLocation(
    token,
    tenantId,
    initialData?.id || ""
  );

  const form = useForm<FormLocationValues>({
    resolver: zodResolver(formLocationSchema),
    defaultValues: {
      id: initialData?.id || "",
      name: initialData?.name || "",
      location_type: initialData?.location_type || INVENTORY_TYPE.CONSIGNMENT,
      description: initialData?.description || "",
      physical_count_type:
        initialData?.physical_count_type || PHYSICAL_COUNT_TYPE.NO,
      is_active: initialData?.is_active || true,
      delivery_point_id: initialData?.delivery_point.id || "",
      users: {
        add: [],
        remove: [],
      },
    },
  });

  const onCancel = () => {
    if (mode === formType.EDIT) {
      onViewMode();
    } else {
      router.back();
    }
  };

  const handleSubmit = async (data: FormLocationValues) => {
    try {
      if (mode === formType.EDIT) {
        const res = await updateMutation.mutateAsync(data);

        if (res) {
          toastSuccess({ message: "Location updated successfully" });
        }
      } else {
        const response = (await createMutation.mutateAsync(
          data
        )) as LocationResponse;
        if (response?.id) {
          toastSuccess({ message: "Location created successfully" });
          router.push(`/configuration/location/${response.id}`);
          return;
        }
      }
      form.reset();
      window.location.reload();
      onViewMode();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toastError({ message: errorMessage });
      console.error("Location form error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-lg font-semibold">
                {mode === formType.EDIT
                  ? "Edit Location"
                  : "Create New Location"}
              </CardTitle>
              <div className="flex items-center gap-2 justify-end">
                <Button
                  type="submit"
                  className="flex items-center gap-2 sm:order-2"
                >
                  <Save className="w-4 h-4" />
                  {mode === formType.EDIT
                    ? "Update Location"
                    : "Create Location"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="sm:order-1"
                >
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_point_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Point ID</FormLabel>
                      <FormControl>
                        <DeliveryPointLookup
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Location Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={INVENTORY_TYPE.CONSIGNMENT}>
                              Consignment
                            </SelectItem>
                            <SelectItem value={INVENTORY_TYPE.DIRECT}>
                              Direct
                            </SelectItem>
                            <SelectItem value={INVENTORY_TYPE.INVENTORY}>
                              Inventory
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel>
                        <p className="text-sm font-medium">Active Status</p>
                        <p className="text-sm">
                          Enable or disable this location
                        </p>
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="physical_count_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Physical Count Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={PHYSICAL_COUNT_TYPE.YES} />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={PHYSICAL_COUNT_TYPE.NO} />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <LocationUser
            initCurrentUsers={initialData?.users || []}
            initAvailableUsers={userList}
            mode={mode}
            formControl={form.control}
          />
        </form>
      </FormProvider>
      {/* <pre>{JSON.stringify(formWatch, null, 2)}</pre> */}
    </div>
  );
}
