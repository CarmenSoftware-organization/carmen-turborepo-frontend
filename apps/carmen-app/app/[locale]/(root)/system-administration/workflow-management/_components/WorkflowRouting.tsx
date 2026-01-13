"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
  const tWf = useTranslations("Workflow");
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

  // Auto-select first rule when rules exist and no rule is selected
  useEffect(() => {
    if (rules.length > 0 && selectedRuleIndex === null) {
      setSelectedRuleIndex(0);
    }
  }, [rules.length, selectedRuleIndex]);

  const handleSelectRuleIndex = (index: number | null) => {
    setSelectedRuleIndex(index ?? null);
  };

  const handleAddRule = () => {
    insert(fields.length, {
      name: `${tWf("new_rule")} ${rules.length + 1}`,
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
    { value: "total_amount", label: tWf("total_amount") },
    { value: "department", label: tWf("department") },
    { value: "category", label: tWf("category") },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card className="col-span-1">
        <CardHeader className="pl-4">
          <CardTitle>{tWf("routing_rules")}</CardTitle>
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
                {rule.name || tWf("unnamed_rule")}
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
            {tWf("add_rule")}
          </Button>
        </div>
      </Card>
      {rules.length > 0 ? (
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{tWf("rule_details")}</CardTitle>
            {isEditing && selectedRuleIndex !== null && (
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteRule(selectedRuleIndex)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {tWf("delete_rule")}
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
                            <FormLabel>{tWf("rule_name")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={tWf("enter_rule_name")}
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
                            <FormLabel>{tWf("description")}</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder={tWf("enter_rule_description")}
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
                            <FormLabel>{tWf("trigger_stage")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger id="trigger_stage">
                                  <SelectValue placeholder={tWf("select_trigger_stage")} />
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
                    <Label>{tWf("condition")}</Label>
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
                                // Set value based on field type - array for department/category, undefined for total_amount
                                const newValue = (e === "department" || e === "category") ? [] : undefined;
                                form.setValue(`data.routing_rules.${index}.condition.value`, newValue as any);
                                field.onChange(e);
                              }}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={tWf("select_field")} />
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
                                  onValueChange={(val) => {
                                    const currentOperator = form.getValues(`data.routing_rules.${index}.condition.operator`);
                                    // Clear values when switching operators
                                    if (val === "between") {
                                      form.setValue(`data.routing_rules.${index}.condition.value`, []);
                                      form.setValue(`data.routing_rules.${index}.condition.min_value`, "");
                                      form.setValue(`data.routing_rules.${index}.condition.max_value`, "");
                                    } else if (currentOperator === "between") {
                                      // Switching from 'between' to another operator
                                      form.setValue(`data.routing_rules.${index}.condition.value`, []);
                                      form.setValue(`data.routing_rules.${index}.condition.min_value`, "");
                                      form.setValue(`data.routing_rules.${index}.condition.max_value`, "");
                                    }
                                    field.onChange(val);
                                  }}
                                  defaultValue={field.value}
                                  disabled={!isEditing}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={tWf("select_operator")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="eq">{tWf("equals")}</SelectItem>
                                    <SelectItem value="gt">{tWf("greater_than")}</SelectItem>
                                    <SelectItem value="lt">{tWf("less_than")}</SelectItem>
                                    <SelectItem value="gte">{tWf("greater_than_or_equal")}</SelectItem>
                                    <SelectItem value="lte">{tWf("less_than_or_equal")}</SelectItem>
                                    <SelectItem value="between">{tWf("between")}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {form.watch(`data.routing_rules.${index}.condition.operator`) === "between" ? (
                            <div className="flex gap-2">
                              <FormField
                                control={control}
                                name={`data.routing_rules.${index}.condition.min_value`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder={tWf("min_value")}
                                        disabled={!isEditing}
                                        type="number"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={control}
                                name={`data.routing_rules.${index}.condition.max_value`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder={tWf("max_value")}
                                        disabled={!isEditing}
                                        type="number"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ) : (
                            <FormField
                              control={control}
                              name={`data.routing_rules.${index}.condition.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      value={Array.isArray(field.value) && field.value[0] ? field.value[0] : ""}
                                      placeholder={tWf("enter_value")}
                                      disabled={!isEditing}
                                      type="number"
                                      onChange={(e) => {
                                        const arrValue = e.target.value ? [e.target.value] : [];
                                        field.onChange(arrValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
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
                                        placeholder={tWf("select_operator")}
                                        defaultValue={"eq"}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="eq">{tWf("equals")}</SelectItem>
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
                                    placeholder={`${tWf("select")} ${tWf("department")}`}
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
                                        placeholder={tWf("select_operator")}
                                        defaultValue={"eq"}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="eq">{tWf("equals")}</SelectItem>
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
                                    placeholder={`${tWf("select")} ${tWf("category")}`}
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
                      <Label>{tWf("action")}</Label>
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
                                    <SelectValue placeholder={tWf("select_type")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="SKIP_STAGE">{tWf("skip_stage")}</SelectItem>
                                  <SelectItem value="NEXT_STAGE">{tWf("next_stage")}</SelectItem>
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
                                    <SelectValue placeholder={tWf("select_target_stage")} />
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
      ) : (
        <Card className="col-span-2">
          <CardContent className="flex items-center justify-center h-full min-h-[200px]">
            <p className="text-gray-500">{tWf("no_routing_rules_message")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowRouting;
