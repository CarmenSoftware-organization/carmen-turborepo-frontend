import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  CreateStoreLocationDto,
  createStoreLocationSchema,
} from "@/dtos/config.dto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INVENTORY_TYPE } from "@/constants/enum";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DeliveryPointLookup from "@/components/lookup/DeliveryPointLookup";
import { Card } from "@/components/ui/card";
import UserLocation from "./UserLocation";
import { useUserList } from "@/hooks/useUserList";
import { Checkbox } from "@/components/ui/checkbox";

enum PHYSICAL_COUNT_TYPE {
  YES = "yes",
  NO = "no",
}

interface MainLocationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly initialData?: any;
  readonly mode: formType;
  readonly isLoading?: boolean;
}

export default function MainLocation({
  initialData,
  mode,
  isLoading,
}: MainLocationProps) {
  const tStoreLocation = useTranslations("StoreLocation");
  const { userList } = useUserList();

  // Transform initial data to match form structure
  const transformedInitialData = initialData
    ? {
        id: initialData.id || "",
        name: initialData.name || "",
        location_type: initialData.location_type || "",
        description: initialData.description || "",
        is_active: initialData.is_active || false,
        delivery_point_id: initialData.delivery_point?.id || "",
        physical_count_type:
          initialData.physical_count_type || PHYSICAL_COUNT_TYPE.YES,
        users: {
          data:
            initialData.users &&
            Array.isArray(initialData.users) &&
            initialData.users.length > 0
              ? initialData.users.map((user: string | { id: string }) => ({
                  user_id: typeof user === "string" ? user : user.id,
                }))
              : [],
          add: [],
          remove: [],
        },
        info: {
          floor: initialData.info?.floor || 0,
          building: initialData.info?.building || "",
          capacity: initialData.info?.capacity || 0,
          responsibleDepartment: initialData.info?.responsibleDepartment || "",
          itemCount: initialData.info?.itemCount || 0,
          lastCount: initialData.info?.lastCount || "",
        },
      }
    : {
        delivery_point_id: "",
        users: {
          add: [],
          remove: [],
        },
        info: {
          floor: 0,
          building: "",
          capacity: 0,
          responsibleDepartment: "",
          itemCount: 0,
          lastCount: "",
        },
      };

  const form = useForm<CreateStoreLocationDto>({
    resolver: zodResolver(createStoreLocationSchema),
    defaultValues: transformedInitialData,
  });

  const {
    fields: addUserFields,
    append: appendAddUser,
    remove: removeAddUser,
  } = useFieldArray({
    control: form.control,
    name: "users.add",
    keyName: "key", // Use 'key' instead of 'id' for React Hook Form's internal key
  });

  // Remove user fields - not currently used but available for future implementation
  const { append: appendRemoveUser } = useFieldArray({
    control: form.control,
    name: "users.remove",
  });

  const isReadOnly = mode === formType.VIEW;
  const isCreate = mode === formType.ADD;

  // Watch all form values for debugging
  const watchedValues = useWatch({
    control: form.control,
  });

  // Watch specific user fields
  const watchedUsers = useWatch({
    control: form.control,
    name: "users",
  });

  // No need for state since we already have userList from useUserList hook

  const handleAddUser = (userId: string) => {
    appendAddUser({ user_id: userId });
  };

  const handleRemoveUser = (userId: string) => {
    const index = addUserFields.findIndex((field) => field.user_id === userId);
    if (index !== -1) {
      removeAddUser(index);
    }
    appendRemoveUser({ user_id: userId });
  };

  const onFormSubmit = (data: CreateStoreLocationDto) => {
    console.log("Form submitted (raw data):", data);
    console.log("Watched values:", watchedValues);
    console.log(
      "Are they equal?",
      JSON.stringify(data) === JSON.stringify(watchedValues)
    );

    // Handle form submission based on mode
    if (isCreate) {
      // Create new store location
      console.log("Creating new store location:", data);
      // TODO: Add API call for creating
    } else if (mode === "edit") {
      // Update existing store location
      console.log("Updating store location:", data);
      // TODO: Add API call for updating
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-sm">
        Loading...
      </div>
    );
  }

  // const conditionType = (type: INVENTORY_TYPE) => {
  //     if (type === INVENTORY_TYPE.INVENTORY) {
  //         return (
  //             <Checkbox />
  //         )
  //     }
  // }

  return (
    <div className="max-w-full mx-auto p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="text-lg font-medium">
          {isCreate ? "Create" : mode === formType.EDIT ? "Edit" : "View"} Store
          Location
        </h1>
        <div className="text-xs text-gray-500">Mode: {mode}</div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Basic Information */}
          <Card className="p-4">
            <div className="text-sm font-medium mb-2">Basic Information</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={isReadOnly}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_type"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isReadOnly}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value={INVENTORY_TYPE.INVENTORY}
                            className="text-xs"
                          >
                            {tStoreLocation("inventory")}
                          </SelectItem>
                          <SelectItem
                            value={INVENTORY_TYPE.DIRECT}
                            className="text-xs"
                          >
                            {tStoreLocation("direct")}
                          </SelectItem>
                          <SelectItem
                            value={INVENTORY_TYPE.CONSIGNMENT}
                            className="text-xs"
                          >
                            {tStoreLocation("consignment")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="physical_count_type"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">
                      Physical Count Type
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delivery_point_id"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">
                      Delivery Point
                    </FormLabel>
                    <FormControl>
                      <DeliveryPointLookup
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">
                      Status
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2 pt-1">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isReadOnly}
                          className="scale-75"
                        />
                        <span className="text-xs">
                          {field.value ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-4 space-y-1">
                    <FormLabel className="text-xs font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        readOnly={isReadOnly}
                        className="min-h-[60px] text-xs resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="info.floor"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">Floor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        readOnly={isReadOnly}
                        className="h-8 text-xs"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="info.building"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">
                      Building
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={isReadOnly}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="info.capacity"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">
                      Capacity
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        readOnly={isReadOnly}
                        className="h-8 text-xs"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="info.responsibleDepartment"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">
                      Department
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={isReadOnly}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="info.itemCount"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">
                      Item Count
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        readOnly={isReadOnly}
                        className="h-8 text-xs"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="info.lastCount"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium">
                      Last Count
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={isReadOnly}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <UserLocation
            isReadOnly={isReadOnly}
            userList={userList}
            addUserFields={addUserFields}
            onAddUser={handleAddUser}
            onRemoveUser={handleRemoveUser}
          />

          {/* Form Debug Section */}
          {!isReadOnly && (
            <Card className="p-4">
              <p className="text-sm font-medium mb-3">
                🔍 Form Debug & Watch Values
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium mb-2">
                    🔍 Watched Users Field
                  </h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded border max-h-32 overflow-y-auto">
                    {JSON.stringify(watchedUsers, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-2">
                    📋 Add User Fields (Field Array)
                  </h4>
                  <pre className="text-xs bg-blue-50 p-2 rounded border max-h-32 overflow-y-auto">
                    {JSON.stringify(addUserFields, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="text-xs font-medium mb-2">
                    👥 Available Users from API
                  </h4>
                  <pre className="text-xs bg-purple-50 p-2 rounded border max-h-32 overflow-y-auto">
                    {JSON.stringify(userList, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="text-xs font-medium mb-2">
                    🌐 All Form Values
                  </h4>
                  <pre className="text-xs bg-green-50 p-2 rounded border max-h-40 overflow-y-auto">
                    {JSON.stringify(watchedValues, null, 2)}
                  </pre>
                </div>
              </div>
            </Card>
          )}

          {/* View Mode - Display Users */}
          {isReadOnly &&
            (transformedInitialData?.users?.add?.length ||
              transformedInitialData?.users?.remove?.length) && (
              <div className="border border-gray-200 p-3">
                <div className="text-sm font-medium mb-2 border-b pb-1">
                  Users
                </div>
                <div className="space-y-3">
                  {transformedInitialData?.users?.add &&
                    transformedInitialData.users.add.length > 0 && (
                      <div>
                        <Label className="text-xs font-medium">
                          Assigned Users
                        </Label>
                        <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-1">
                          {transformedInitialData.users.add.map(
                            (user: { user_id: string }, index: number) => (
                              <div
                                key={index}
                                className="p-1 border rounded text-xs"
                              >
                                {user.user_id}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {transformedInitialData?.users?.remove &&
                    transformedInitialData.users.remove.length > 0 && (
                      <div>
                        <Label className="text-xs font-medium">
                          Users to Remove
                        </Label>
                        <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-1">
                          {transformedInitialData.users.remove.map(
                            (user: { user_id: string }, index: number) => (
                              <div
                                key={index}
                                className="p-1 border rounded text-xs"
                              >
                                {user.user_id}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

          {/* Form Actions */}
          {!isReadOnly && (
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 px-3 text-xs">
                {isCreate ? "Create" : "Update"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
