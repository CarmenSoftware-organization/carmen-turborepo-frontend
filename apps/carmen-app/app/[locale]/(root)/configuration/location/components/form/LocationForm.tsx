import { LocationByIdDto, PHYSICAL_COUNT_TYPE } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useUserList } from "@/hooks/useUserList";
import LocationUser from "./LocationUser";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { z } from "zod";
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

export const formLocationSchema = z.object({
  name: z.string().min(1, "Please enter name"),
  location_type: z.nativeEnum(INVENTORY_TYPE),
  description: z.string().optional(),
  physical_count_type: z.nativeEnum(PHYSICAL_COUNT_TYPE),
  is_active: z.boolean(),
  delivery_point_id: z.string().min(1, "Please select delivery point"),
  users: z.object({
    add: z.array(
      z.object({
        id: z.string(),
      })
    ),
    remove: z.array(
      z.object({
        id: z.string(),
      })
    ),
  }),
});

export type FormLocationValues = z.infer<typeof formLocationSchema>;

interface LocationFormProps {
  readonly initialData?: LocationByIdDto;
  readonly mode: formType;
  readonly onViewMode: () => void;
}

export default function LocationForm({
  initialData,
  mode,
  onViewMode,
}: LocationFormProps) {
  const { userList } = useUserList();

  console.log("initialData", initialData);

  const form = useForm<FormLocationValues>({
    resolver: zodResolver(formLocationSchema),
    defaultValues: {
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

  const handleSubmit = (data: FormLocationValues) => {
    console.log("data", data);
  };

  const formWatch = form.watch();


  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {mode === formType.EDIT ? "Edit Location" : "Create New Location"}
        </h1>
        <div className="flex gap-2">
          {initialData && (
            <Button onClick={onViewMode} className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Mode
            </Button>
          )}
        </div>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Basic Information
              </CardTitle>
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
                        <Input {...field} />
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
            initAvailableUsers={userList || []}
            formType={mode}
            formControl={form.control}
          />
        </form>
      </FormProvider>
      <pre>{JSON.stringify(formWatch, null, 2)}</pre>
    </div>
  );
}
