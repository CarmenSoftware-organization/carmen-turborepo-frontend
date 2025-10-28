import {
  FormLocationValues,
  LocationByIdDto,
  LocationResponse,
  PHYSICAL_COUNT_TYPE,
  UserItemTransfer,
} from "@/dtos/location.dto";
import { createLocationFormSchema } from "../../_schemas/location-form.schema";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, X } from "lucide-react";
import { INVENTORY_TYPE } from "@/constants/enum";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useRouter } from "@/lib/navigation";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useLocationMutation, useUpdateLocation } from "@/hooks/use-locations";
import { LookupDeliveryPoint } from "@/components/lookup/DeliveryPointLookup";
import { Transfer } from "@/components/ui-custom/Transfer";
import { useMemo, useState, useEffect, useCallback } from "react";
import FormBoolean from "@/components/form-custom/form-boolean";
import { useQueryClient } from "@tanstack/react-query";
import transferHandler from "@/components/form-custom/TransferHandler";
import { useTranslations } from "next-intl";
import { useUserList } from "@/hooks/useUserList";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form-custom/form";
import { TreeProductLookup } from "@/components/lookup/tree-product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LocationFormProps {
  readonly initialData?: LocationByIdDto;
  readonly mode: formType;
  readonly onViewMode: () => void;
  readonly token: string;
  readonly buCode: string;
}

export default function LocationForm({
  initialData,
  mode,
  onViewMode,
  token,
  buCode,
}: LocationFormProps) {
  const { userList, isLoading: isLoadingUsers } = useUserList(token, buCode);
  const router = useRouter();
  const queryClient = useQueryClient();
  const tLocation = useTranslations("StoreLocation");
  const tCommon = useTranslations("Common");

  const listUser = userList?.map((user: UserItemTransfer) => ({
    key: user.user_id,
    title: user.firstname + " " + user.lastname,
  }));

  const createMutation = useLocationMutation(token, buCode);
  const updateMutation = useUpdateLocation(
    token,
    buCode,
    initialData?.id || ""
  );

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isViewMode = mode === formType.VIEW;

  const formLocationSchema = useMemo(() => createLocationFormSchema({
    nameRequired: tLocation('location_name_required'),
    deliveryPointRequired: tLocation('delivery_point_required'),
  }), [tLocation]);

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

  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);

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

  useEffect(() => {
    if (initUserKeys.length > 0) {
      setSelectedUsers(initUserKeys);
    }
  }, [initUserKeys]);

  const onCancel = () => {
    if (mode === formType.EDIT) {
      onViewMode();
    } else {
      router.back();
    }
  };

  const handleUsersChange = transferHandler({ form, fieldName: "users", setSelected: setSelectedUsers });

  const handleTreeProductSelect = useCallback((productIds: { id: string }[]) => {
    const currentProductIds = initProductKeys.map(key => key.toString());
    const newProductIds = productIds.map(p => p.id);

    const toAdd = newProductIds
      .filter(id => !currentProductIds.includes(id))
      .map(id => ({ id }));
    const toRemove = currentProductIds
      .filter(id => !newProductIds.includes(id))
      .map(id => ({ id }));

    form.setValue("products", {
      add: toAdd,
      remove: toRemove,
    });
  }, [initProductKeys, form]);

  const handleSubmit = async (data: FormLocationValues) => {
    try {
      if (mode === formType.EDIT) {
        const res = await updateMutation.mutateAsync(data);
        if (res) {
          toastSuccess({ message: tLocation("edit_store_location_description") });
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
          toastSuccess({ message: tLocation("add_store_location_description") });
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
    <div className="max-w-5xl mx-auto">
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="flex items-center justify-between mb-2 pb-2">
          <div className="flex items-center gap-2">
            <Button
              size={'sm'}
              variant={'outline'}
              className="h-7 w-7"
              asChild
            >
              <Link
                href="/configuration/location"
              >
                <ArrowLeft />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">
              {mode === formType.EDIT
                ? tLocation("edit_store_location")
                : tLocation("add_store_location")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
            >
              <X className="w-4 h-4" />
              {tCommon("cancel")}
            </Button>
            <Button
              size="sm"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isPending || isViewMode}
            >
              <Save className="w-4 h-4" />
              {tCommon("save")}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <FormProvider {...form}>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                required
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tLocation("store_location_name")}
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
                required
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tLocation("delivery_point")}
                    </FormLabel>
                    <FormControl>
                      <div className={isViewMode ? "pointer-events-none opacity-50" : ""}>
                        <LookupDeliveryPoint
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder={tLocation("delivery_point")}
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
                required
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tLocation("location_type")}
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
                  <FormItem className="col-span-2">
                    <FormLabel>{tCommon("description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isViewMode}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>
                      {tLocation("physical_count_type")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        disabled={isViewMode}
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={PHYSICAL_COUNT_TYPE.YES} />
                          </FormControl>
                          <FormLabel className="font-normal">{tCommon("yes")}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
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
            </div>
            <Tabs defaultValue="users">
              <TabsList>
                <TabsTrigger value="users">{tCommon("users")}</TabsTrigger>
                <TabsTrigger value="products">{tCommon("products")}</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <Transfer
                  dataSource={listUser || []}
                  leftDataSource={initUsers}
                  targetKeys={selectedUsers}
                  onChange={handleUsersChange}
                  titles={[tCommon("init_users"), tCommon("available_users")]}
                  operations={["<", ">"]}
                  disabled={isViewMode || isLoadingUsers}
                />
              </TabsContent>
              <TabsContent value="products">
                <div className={isViewMode ? "pointer-events-none opacity-50" : ""}>
                  <TreeProductLookup
                    onSelect={handleTreeProductSelect}
                    initialSelectedIds={initProductKeys.map(key => key.toString())}
                    initialProducts={initProducts}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
