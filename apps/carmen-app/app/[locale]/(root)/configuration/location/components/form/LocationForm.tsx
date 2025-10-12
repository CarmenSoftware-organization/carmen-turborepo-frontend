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
import { Save, X } from "lucide-react";
import { INVENTORY_TYPE } from "@/constants/enum";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { LookupDeliveryPoint } from "@/components/lookup/DeliveryPointLookup";
import { Transfer } from "@/components/ui-custom/Transfer";
import { useMemo, useState, useEffect } from "react";
import FormBoolean from "@/components/form-custom/form-boolean";
import { useQueryClient } from "@tanstack/react-query";
import transferHandler from "@/components/form-custom/TransferHandler";
import { useTranslations } from "next-intl";
import { useProductQuery } from "@/hooks/useProductQuery";
import { useUserList } from "@/hooks/useUserList";

interface LocationFormProps {
  readonly initialData?: LocationByIdDto;
  readonly mode: formType;
  readonly onViewMode: () => void;
  readonly token: string;
  readonly buCode: string;
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
  buCode,
}: LocationFormProps) {
  const { userList, isLoading: isLoadingUsers } = useUserList(token, buCode);

  const { products, isLoading: isLoadingProducts } = useProductQuery({
    token,
    buCode,
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const tLocation = useTranslations("StoreLocation");
  const tCommon = useTranslations("Common");

  const listUser = userList?.map((user: UserItemTransfer) => ({
    key: user.user_id,
    title: user.firstname + " " + user.lastname,
  }));

  const listProduct = products?.data.map((product: ProductItemTransfer) => ({
    key: product.id,
    title: product.name,
  }));

  const createMutation = useLocationMutation(token, buCode);
  const updateMutation = useUpdateLocation(
    token,
    buCode,
    initialData?.id || ""
  );

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isViewMode = mode === formType.VIEW;

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
  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<(string | number)[]>([]);

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


  // Fix Transfer initialization - update when init data changes
  useEffect(() => {
    if (initUserKeys.length > 0) {
      setSelectedUsers(initUserKeys);
    }
  }, [initUserKeys]);

  useEffect(() => {
    if (initProductKeys.length > 0) {
      setSelectedProducts(initProductKeys);
    }
  }, [initProductKeys]);

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

          // Invalidate all related queries with correct query keys
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["location", buCode, initialData?.id] }),
            queryClient.invalidateQueries({ queryKey: ["locations", buCode] }),
            queryClient.invalidateQueries({ queryKey: ["users"] }),
            queryClient.invalidateQueries({ queryKey: ["products"] }),
          ]);

          onViewMode();
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : tCommon("error_something_went_wrong");
      toastError({ message: errorMessage });

      if (process.env.NODE_ENV === 'development') {
        console.error("Location form error:", error);
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <div className="fxb-c">
              <CardTitle className="text-2xl font-semibold">
                {mode === formType.EDIT
                  ? tLocation("edit_store_location")
                  : tLocation("add_store_location")}
              </CardTitle>
              <div className="fxr-e gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  <X />
                  {tCommon("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || isViewMode}
                >
                  <Save className="w-4 h-4" />
                  {tCommon("save")}
                </Button>
              </div>
            </div>

          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tLocation("store_location_name")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delivery_point_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tLocation("delivery_point")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className={isViewMode ? "pointer-events-none opacity-50" : ""}>
                        <LookupDeliveryPoint
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tLocation("location_type")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isViewMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={tLocation("location_type")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={INVENTORY_TYPE.CONSIGNMENT}>
                            {tLocation("consignment")}
                          </SelectItem>
                          <SelectItem value={INVENTORY_TYPE.DIRECT}>
                            {tLocation("direct")}
                          </SelectItem>
                          <SelectItem value={INVENTORY_TYPE.INVENTORY}>
                            {tLocation("inventory")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>{tCommon("description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
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
                      label={tCommon("status")}
                      type="checkbox"
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="physical_count_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    {tLocation("physical_count_type")}
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                      disabled={isViewMode}
                    >
                      <FormItem className="fxr-c space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={PHYSICAL_COUNT_TYPE.YES} />
                        </FormControl>
                        <FormLabel className="font-normal">{tCommon("yes")}</FormLabel>
                      </FormItem>
                      <FormItem className="fxr-c space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={PHYSICAL_COUNT_TYPE.NO} />
                        </FormControl>
                        <FormLabel className="font-normal">{tCommon("no")}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Transfer
          dataSource={listUser || []}
          leftDataSource={initUsers}
          targetKeys={selectedUsers}
          onChange={handleUsersChange}
          titles={[tCommon("init_users"), tCommon("available_users")]}
          operations={["<", ">"]}
          disabled={isViewMode || isLoadingUsers}
        />
        <Transfer
          dataSource={listProduct || []}
          leftDataSource={initProducts}
          targetKeys={selectedProducts}
          onChange={handleProductsChange}
          titles={[tCommon("init_products"), tCommon("available_products")]}
          operations={["<", ">"]}
          disabled={isViewMode || isLoadingProducts}
        />
      </form>
    </FormProvider>
  );
}
