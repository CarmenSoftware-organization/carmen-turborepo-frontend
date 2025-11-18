"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Control, useFieldArray, UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { WorkflowCreateModel } from "@/dtos/workflows.dto";
import { useCategory } from "@/hooks/use-category";
import { useDepartmentsQuery } from "@/hooks/use-departments";
import { useAuth } from "@/context/AuthContext";

interface WorkflowRoutingProps {
  form: UseFormReturn<WorkflowCreateModel>;
  control: Control<WorkflowCreateModel>;
  stagesName: string[];
  isEditing: boolean;
}

const WorkflowRouting = ({ form, control, stagesName, isEditing }: WorkflowRoutingProps) => {
  const { fields, insert, remove } = useFieldArray({
    name: "data.routing_rules",
    control: control,
  });
  const { token, buCode } = useAuth();
  const { departments } = useDepartmentsQuery(token, buCode);
  const { categories } = useCategory();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const departmentList = departments?.data.map((el: any) => {
    return Object.assign(
      {},
      {
        value: el.id ?? "",
        label: el.name,
        disabled: !el.is_active,
      }
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryList = categories.map((el: any) => {
    return Object.assign(
      {},
      {
        value: el.id ?? "",
        label: el.name,
        disabled: !el.is_active,
      }
    );
  });

  const rules = form.getValues().data?.routing_rules || [];
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number | null>(null);

  const handleSelectRuleIndex = (index: number | null) => {
    setSelectedRuleIndex(index ?? null);
  };

  const handleAddRule = () => {
    insert(fields.length, {
      name: `New Rule ${rules.length + 1}`,
      description: "",
      trigger_stage: stagesName[0] || "",
      condition: { field: "", operator: "eq", value: [] },
      action: { type: "NEXT_STAGE", parameters: { target_stage: "Completed" } },
    });
    setSelectedRuleIndex(fields.length);
  };

  const handleDeleteRule = (index: number) => {
    remove(index);
  };

  const fieldList = [
    { value: "total_amount", label: "Total Amount" },
    { value: "department", label: "Department" },
    { value: "category", label: "Category" },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card className="col-span-1">
        <CardHeader className="pl-4">
          <CardTitle>Routing Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <ul>
            {rules.map((rule, index) => (
              <li
                key={rule.name}
                className={`p-2 cursor-pointer ${
                  selectedRuleIndex === index
                    ? "bg-gray-100 border-l-4 border-blue-500 text-black"
                    : "hover:bg-gray-100/50"
                }`}
                onClick={() => handleSelectRuleIndex(index)}
              >
                {rule.name || "Unnamed Rule"}
              </li>
            ))}
          </ul>
        </CardContent>
        <div className="p-3 border-t">
          <Button
            type="button"
            onClick={handleAddRule}
            variant="secondary"
            className={`w-full ${
              isEditing
                ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                : "text-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
            disabled={!isEditing}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </Card>
      {rules.length > 0 && (
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rule Details</CardTitle>
            {isEditing && selectedRuleIndex !== null && (
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteRule(selectedRuleIndex)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Rule
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">
            {fields.map((item, index) => (
              <div key={item.id}>
                {selectedRuleIndex === index && (
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <FormField
                        control={control}
                        name={`data.routing_rules.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rule Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter rule name"
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={control}
                        name={`data.routing_rules.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter rule description"
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={control}
                        name={`data.routing_rules.${index}.trigger_stage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trigger Stage</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger id="trigger_stage">
                                  <SelectValue placeholder="Select Trigger Stage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {stagesName.map((stage) => (
                                  <SelectItem key={stage} value={stage}>
                                    {stage}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Label>Condition</Label>
                    <div className="flex flex-col space-y-2 mt-2">
                      <FormField
                        control={control}
                        name={`data.routing_rules.${index}.condition.field`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(e) => {
                                form.setValue(
                                  `data.routing_rules.${index}.condition.operator`,
                                  "eq"
                                );
                                form.setValue(`data.routing_rules.${index}.condition.value`, []);
                                field.onChange(e);
                              }}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select field" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fieldList.map((f) => (
                                  <SelectItem key={f.value} value={f.value}>
                                    {f.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch(`data.routing_rules.${index}.condition.field`) ===
                        "total_amount" && (
                        <>
                          <FormField
                            control={control}
                            name={`data.routing_rules.${index}.condition.operator`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select operator" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="eq">Equals</SelectItem>
                                    <SelectItem value="gt">Greater than</SelectItem>
                                    <SelectItem value="lt">Less than</SelectItem>
                                    <SelectItem value="gte">Greater than or equal</SelectItem>
                                    <SelectItem value="lte">Less than or equal</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`data.routing_rules.${index}.condition.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter value"
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {form.watch(`data.routing_rules.${index}.condition.field`) ===
                        "department" && (
                        <>
                          <FormField
                            control={control}
                            name={`data.routing_rules.${index}.condition.operator`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder="Select operator"
                                        defaultValue={"eq"}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="eq">Equals</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`data.routing_rules.${index}.condition.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <MultiSelect
                                    options={departmentList}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    placeholder={`Select ${item.condition.field}`}
                                    variant="inverted"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      {form.watch(`data.routing_rules.${index}.condition.field`) === "category" && (
                        <>
                          <FormField
                            control={control}
                            name={`data.routing_rules.${index}.condition.operator`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder="Select operator"
                                        defaultValue={"eq"}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="eq">Equals</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`data.routing_rules.${index}.condition.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <MultiSelect
                                    options={categoryList}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    placeholder={`Select ${item.condition.field}`}
                                    variant="inverted"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Action</Label>
                      <div className="space-y-2 mt-2">
                        <FormField
                          control={control}
                          name={`data.routing_rules.${index}.action.type`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!isEditing}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="SKIP_STAGE">Skip Stage</SelectItem>
                                  <SelectItem value="NEXT_STAGE">Next Stage</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`data.routing_rules.${index}.action.parameters.target_stage`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!isEditing}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select target stage" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {stagesName.map((stage) => (
                                    <SelectItem key={stage} value={stage}>
                                      {stage}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowRouting;
