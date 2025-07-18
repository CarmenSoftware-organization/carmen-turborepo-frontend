import {
  formLocationSchema,
  FormLocationValues,
  LocationByIdDto,
  PHYSICAL_COUNT_TYPE,
  ProductItemTransfer,
  UserItemTransfer,
} from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "@/lib/navigation";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useLocationMutation, useUpdateLocation } from "@/hooks/use-location";
import { useUserList } from "@/hooks/useUserList";
import { LookupDeliveryPoint } from "@/components/lookup/DeliveryPointLookup";
import { Transfer } from "@/components/ui-custom/Transfer";
import { useMemo, useState } from "react";
import useProduct from "@/hooks/useProduct";
import FormBoolean from "@/components/form-custom/form-boolean";
import transferHandler from "@/components/form-custom/TransferHandler";

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
};


export default function LocationForm({
  initialData,
  mode,
  onViewMode,
  token,
  tenantId,
}: LocationFormProps) {
  const { userList } = useUserList();
  const { products } = useProduct();
  const router = useRouter();

  const listUser = userList?.map((user: UserItemTransfer) => ({
    key: user.user_id,
    title: user.firstname + " " + user.lastname,
  }));

  const listProduct = products?.map((product: ProductItemTransfer) => ({
    key: product.id,
    title: product.name,
  }));

  const createMutation = useLocationMutation(token, tenantId);
  const updateMutation = useUpdateLocation(
    token,
    tenantId,
    initialData?.id || ""
  );

  const initUsers = useMemo(() => {
    return (
      initialData?.user_location?.map((user) => ({
        key: user.id,
        title: user.firstname + " " + user.lastname,
      })) || []
    );
  }, [initialData?.user_location]);

  const initProducts = useMemo(() => {
    return (
      initialData?.product_location?.map((product) => ({
        key: product.id,
        title: product.name,
      })) || []
    );
  }, [initialData?.product_location]);

  const initUserKeys = useMemo(() => {
    return initUsers.map((user) => user.key);
  }, [initUsers]);

  const initProductKeys = useMemo(() => {
    return initProducts.map((product) => product.key);
  }, [initProducts]);

  // State สำหรับเก็บ selected items
  const [selectedUsers, setSelectedUsers] =
    useState<(string | number)[]>(initUserKeys);
  const [selectedProducts, setSelectedProducts] =
    useState<(string | number)[]>(initProductKeys);

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
      products: {
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

  const handleUsersChange = transferHandler({ form, fieldName: "users", setSelected: setSelectedUsers });

  const handleProductsChange = transferHandler({ form, fieldName: "products", setSelected: setSelectedProducts });

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
                      <FormLabel>Delivery Point</FormLabel>
                      <FormControl>
                        <LookupDeliveryPoint
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
                      <FormLabel>Type</FormLabel>
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
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <FormControl>
                      <FormBoolean
                        value={field.value}
                        onChange={field.onChange}
                        label="Is Active"
                        type="checkbox"
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
            </CardContent>
          </Card>
          <Transfer
            dataSource={listUser}
            leftDataSource={initUsers}
            targetKeys={selectedUsers}
            onChange={handleUsersChange}
            titles={["Init Users", "Available Users"]}
            operations={["<", ">"]}
          />
          <Transfer
            dataSource={listProduct}
            leftDataSource={initProducts}
            targetKeys={selectedProducts}
            onChange={handleProductsChange}
            titles={["Init Products", "Available Products"]}
            operations={["<", ">"]}
          />
        </form>
      </FormProvider>
    </div>
  );
}
