"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, CheckCircle2, Bell, Lock, Filter, Users, ChevronDown } from "lucide-react";
import { Stage, WorkflowCreateModel, User } from "@/dtos/workflows.dto";
import { Control, FieldArrayWithId } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/form-custom/form";
import { roleField, slaUnitField } from "@/constants/fields";

interface StageDetailPanelProps {
  stage: Stage;
  listUser: User[];
  onUpdate: (stage: Stage) => void;
  onDelete?: () => void;
  isLastStage?: boolean;
  isFirstStage?: boolean;
  isEditing?: boolean;
  control: Control<WorkflowCreateModel>;
  selectedStageIndex: number;
}

export default function StageDetailPanel({
  stage,
  listUser,
  onUpdate,
  onDelete,
  isLastStage = false,
  isFirstStage = false,
  isEditing = true,
  control,
  selectedStageIndex,
}: StageDetailPanelProps) {
  const tWf = useTranslations("Workflow");
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "assigned_users">(
    "general"
  );
  const [editedStage, setEditedStage] = useState<Stage>(stage as Stage);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Sync local state with prop changes when a different stage is selected
  useEffect(() => {
    setEditedStage(stage as Stage);
  }, [stage]);

  const handleUpdate = (updates: Partial<Stage>) => {
    const updated = { ...editedStage, ...updates };
    setEditedStage(updated);
    onUpdate(updated);
  };

  const toggleAction = (actionName: keyof typeof editedStage.available_actions) => {
    const updated = {
      ...editedStage,
      available_actions: {
        ...editedStage.available_actions,
        [actionName]: {
          ...editedStage.available_actions[actionName],
          is_active: !editedStage.available_actions[actionName].is_active,
        },
      },
    };
    setEditedStage(updated);
    onUpdate(updated);
  };

  const updateTemplate = (
    actionName: keyof typeof editedStage.available_actions,
    template: string
  ) => {
    const updated = {
      ...editedStage,
      available_actions: {
        ...editedStage.available_actions,
        [actionName]: {
          ...editedStage.available_actions[actionName],
          template,
        },
      },
    };
    setEditedStage(updated);
    onUpdate(updated);
  };

  const updateSLAWarningTemplate = (template: string) => {
    const currentNotification = editedStage.sla_warning_notification || {
      recipients: { requestor: false, current_approve: false },
    };

    const updated = {
      ...editedStage,
      sla_warning_notification: {
        ...currentNotification,
        template,
      },
    };
    setEditedStage(updated);
    onUpdate(updated);
  };

  const toggleUserAssignment = (userId: string) => {
    const currentAssigned = editedStage.assigned_users ?? [];
    const isAssigned = currentAssigned.some((u) => u.user_id === userId);
    const updatedUsers = isAssigned
      ? currentAssigned.filter((u) => u.user_id !== userId)
      : [...currentAssigned, listUser.find((u) => u.user_id === userId)!];

    handleUpdate({ assigned_users: updatedUsers });
  };

  const filteredUsers = listUser.filter(
    (user) =>
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.middlename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignAll = () => {
    handleUpdate({ assigned_users: [...listUser] });
  };

  const handleUnassignAll = () => {
    handleUpdate({ assigned_users: [] });
  };

  const handleAssignFiltered = () => {
    const newUsers = [...(editedStage.assigned_users || [])];
    filteredUsers.forEach((user) => {
      if (!newUsers.some((u) => u.user_id === user.user_id)) {
        newUsers.push(user);
      }
    });
    handleUpdate({ assigned_users: newUsers });
  };

  const handleUnassignFiltered = () => {
    const filteredUserIds = filteredUsers.map((u) => u.user_id);
    const updatedUsers = editedStage.assigned_users?.filter(
      (user) => !filteredUserIds.includes(user.user_id)
    );
    handleUpdate({ assigned_users: updatedUsers });
  };

  const assignedCount = editedStage.assigned_users?.length;
  const totalUsers = listUser.length;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{tWf("stage_details")}</CardTitle>
          {!isFirstStage && !isLastStage && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={!isEditing}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {tWf("delete_stage")}
            </Button>
          )}
        </CardHeader>

        {isLastStage ? (
          /* Completed Stage - Minimal Content */
          <CardContent>
            <div className="text-center py-12">
              <div className="mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{tWf("workflow_completed")}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {tWf("final_stage_description")}
              </p>
            </div>
          </CardContent>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "general" | "notifications" | "assigned_users")
            }
          >
            <TabsList className="w-full justify-start px-6">
              <TabsTrigger value="general">{tWf("general")}</TabsTrigger>
              <TabsTrigger value="notifications">{tWf("notifications")}</TabsTrigger>
              <TabsTrigger value="assigned_users">{tWf("assigned_users")}</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 px-6 pb-6">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`data.stages.${selectedStageIndex}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tWf("stage_name")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`data.stages.${selectedStageIndex}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tWf("description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!isEditing}
                          rows={3}
                          placeholder={tWf("enter_description")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`data.stages.${selectedStageIndex}.role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tWf("stage_role")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger id="stage-role">
                            <SelectValue placeholder={tWf("select_role")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleField.map(({ label, value }) => (
                            <SelectItem key={value} value={value} className="cursor-pointer">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {isFirstStage && (
                <FormField
                  control={control}
                  name={`data.stages.${selectedStageIndex}.creator_access`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tWf("creator_access")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          disabled={!isEditing}
                        >
                          <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg border">
                            <RadioGroupItem
                              value="only_creator"
                              id="only_creator"
                              disabled={!isEditing}
                            />
                            <Label htmlFor="only_creator" className="cursor-pointer">
                              {tWf("only_creator")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg border">
                            <RadioGroupItem
                              value="all_department"
                              id="all_department"
                              disabled={!isEditing}
                            />
                            <Label htmlFor="all_department" className="cursor-pointer">
                              {tWf("all_users_department")}
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={control}
                    name={`data.stages.${selectedStageIndex}.sla`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tWf("sla")}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} placeholder={tWf("sla_placeholder")} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={control}
                    name={`data.stages.${selectedStageIndex}.sla_unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tWf("sla_unit")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger id="sla_unit">
                              <SelectValue placeholder={tWf("select_sla_unit")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {slaUnitField.map(({ label, value }) => (
                              <SelectItem key={value} value={value} className="cursor-pointer">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{tWf("available_actions")}</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant={editedStage.available_actions.submit.is_active ? "default" : "outline"}
                    onClick={() => toggleAction("submit")}
                    disabled={!isEditing}
                  >
                    {tWf("submit")}
                  </Button>
                  {!isFirstStage && (
                    <>
                      <Button
                        type="button"
                        variant={
                          editedStage.available_actions.approve.is_active ? "default" : "outline"
                        }
                        onClick={() => toggleAction("approve")}
                        disabled={!isEditing}
                        className={
                          editedStage.available_actions.approve.is_active
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        }
                      >
                        {tWf("approve")}
                      </Button>
                      <Button
                        type="button"
                        variant={
                          editedStage.available_actions.reject.is_active ? "destructive" : "outline"
                        }
                        onClick={() => toggleAction("reject")}
                        disabled={!isEditing}
                      >
                        {tWf("reject")}
                      </Button>
                      <Button
                        type="button"
                        variant={
                          editedStage.available_actions.sendback.is_active ? "default" : "outline"
                        }
                        onClick={() => toggleAction("sendback")}
                        disabled={!isEditing}
                        className={
                          editedStage.available_actions.sendback.is_active
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : ""
                        }
                      >
                        {tWf("send_back")}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{tWf("hidden_fields")}</Label>
                <div className="space-y-2">
                  <FormField
                    control={control}
                    name={`data.stages.${selectedStageIndex}.hide_fields.price_per_unit`}
                    render={({ field }) => (
                      <FormItem className="flex items-end gap-2">
                        <FormControl>
                          <Checkbox
                            id="price_per_unit"
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value);
                            }}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormLabel>{tWf("price_per_unit")}</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`data.stages.${selectedStageIndex}.hide_fields.total_price`}
                    render={({ field }) => (
                      <FormItem className="flex items-end gap-2">
                        <FormControl>
                          <Checkbox
                            id="total_price"
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value);
                            }}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormLabel>{tWf("total_price")}</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 px-6 pb-6">
              {/* Submit Notification */}
              {stage.available_actions.submit.is_active && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{tWf("submit_notification")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">{tWf("recipients")}</Label>
                      <div className="space-y-3 mt-2">
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.submit.recipients.requestor`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="submit-requestor"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("requestor")}</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.submit.recipients.current_approve`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="current-submit"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("current_approver")}</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.submit.recipients.next_step`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="submit-next-step"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("next_stage_approver")}</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="submit-template">{tWf("template")}</Label>
                      <Select
                        value={editedStage.available_actions.submit.template || ""}
                        onValueChange={(value) => updateTemplate("submit", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="submit-template">
                          <SelectValue placeholder={tWf("select_template")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submit-template-1">{tWf("submit_template_1")}</SelectItem>
                          <SelectItem value="submit-template-2">{tWf("submit_template_2")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Approve Notification */}
              {!isFirstStage && stage.available_actions.approve.is_active && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{tWf("approve_notification")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">{tWf("recipients")}</Label>
                      <div className="space-y-3 mt-2">
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.approve.recipients.requestor`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="approve-requestor"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("requestor")}</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.approve.recipients.current_approve`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="current-approve"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("current_approver")}</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.approve.recipients.next_step`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="next-step-approve"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("next_stage_approver")}</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="approve-template">{tWf("template")}</Label>
                      <Select
                        value={editedStage.available_actions.approve.template || ""}
                        onValueChange={(value) => updateTemplate("approve", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="approve-template">
                          <SelectValue placeholder={tWf("select_template")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approve-template-1">{tWf("approval_template_1")}</SelectItem>
                          <SelectItem value="approve-template-2">{tWf("approval_template_2")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reject Notification */}
              {!isFirstStage && stage.available_actions.reject.is_active && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{tWf("reject_notification")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">{tWf("recipients")}</Label>
                      <div className="space-y-3 mt-2">
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.reject.recipients.requestor`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="reject-requestor"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("requestor")}</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.reject.recipients.current_approve`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="current-reject"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("previous_stage_approvers")}</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reject-template">{tWf("template")}</Label>
                      <Select
                        value={stage.available_actions.reject.template || ""}
                        onValueChange={(value) => updateTemplate("reject", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="reject-template">
                          <SelectValue placeholder={tWf("select_template")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reject-template-1">{tWf("rejection_template_1")}</SelectItem>
                          <SelectItem value="reject-template-2">{tWf("rejection_template_2")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Send Back Notification */}
              {!isFirstStage && stage.available_actions.sendback.is_active && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{tWf("send_back_notification")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">{tWf("recipients")}</Label>
                      <div className="space-y-3 mt-2">
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.sendback.recipients.requestor`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="sendback-requestor"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("requestor")}</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.sendback.recipients.current_approve`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="current-sendback"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("previous_stage_approvers")}</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.available_actions.sendback.recipients.next_step`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="sendback-next-step"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("send_back_stage_approvers")}</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sendback-template">{tWf("template")}</Label>
                      <Select
                        value={editedStage.available_actions.sendback.template || ""}
                        onValueChange={(value) => updateTemplate("sendback", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="sendback-template">
                          <SelectValue placeholder={tWf("select_template")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sendback-template-1">{tWf("send_back_template_1")}</SelectItem>
                          <SelectItem value="sendback-template-2">{tWf("send_back_template_2")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SLA Warning Notification */}
              {!isFirstStage && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{tWf("sla_warning_notification")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">{tWf("recipients")}</Label>
                      <div className="space-y-3 mt-2">
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.sla_warning_notification.recipients.requestor`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="sla-requestor"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("requestor")}</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`data.stages.${selectedStageIndex}.sla_warning_notification.recipients.current_approve`}
                          render={({ field }) => (
                            <FormItem className="flex items-end gap-2">
                              <FormControl>
                                <Checkbox
                                  id="sla-current-approve"
                                  checked={field.value}
                                  onCheckedChange={(value) => {
                                    field.onChange(value);
                                  }}
                                  disabled={!isEditing}
                                />
                              </FormControl>
                              <FormLabel>{tWf("current_approver")}</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sla-template">{tWf("template")}</Label>
                      <Select
                        value={editedStage.sla_warning_notification?.template || ""}
                        onValueChange={(value) => updateSLAWarningTemplate(value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="sla-template">
                          <SelectValue placeholder={tWf("select_template")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sla-template-1">{tWf("sla_warning_template_1")}</SelectItem>
                          <SelectItem value="sla-template-2">{tWf("sla_warning_template_2")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Notifications Message */}
              {!stage.available_actions.submit.is_active &&
                !stage.available_actions.approve.is_active &&
                !stage.available_actions.reject.is_active &&
                !stage.available_actions.sendback.is_active && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <div className="mb-3">
                        <Bell className="w-12 h-12 text-muted-foreground mx-auto" />
                      </div>
                      <h4 className="text-base font-semibold mb-2">{tWf("no_notifications")}</h4>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        {tWf("no_notifications_description")}
                      </p>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>

            <TabsContent value="assigned_users" className="space-y-6 px-6 pb-6">
              {!isLastStage && !isFirstStage && (
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg border">
                  <Checkbox
                    id="is-hod"
                    checked={editedStage.is_hod || false}
                    onCheckedChange={(checked) =>
                      handleUpdate({ is_hod: checked as boolean, assigned_users: [] })
                    }
                    disabled={!isEditing}
                  />
                  <div className="flex-1">
                    <Label htmlFor="is-hod" className="cursor-pointer font-medium">
                      {tWf("is_hod")}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tWf("hod_description")}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-1">{tWf("stage_users")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {tWf("manage_stage_users")}
                </p>

                {editedStage.is_hod ? (
                  /* HOD Mode - Disabled User Assignment */
                  <Card>
                    <CardContent className="text-center py-12">
                      <div className="mb-3">
                        <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
                      </div>
                      <h4 className="text-base font-semibold mb-2">{tWf("hod_enabled")}</h4>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        {tWf("hod_enabled_description")}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  /* Normal Mode - User Assignment Enabled */
                  <>
                    {/* Search and Filter */}
                    <div className="flex gap-3 mb-4">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder={tWf("search_users")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <Button variant="outline" disabled={!isEditing} type="button">
                        <Filter className="w-4 h-4 mr-2" />
                        {tWf("filter")}
                      </Button>
                    </div>

                    {/* User List */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <p className="text-sm font-medium">
                          {tWf("total_users")}: {assignedCount} / {totalUsers}
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={!isEditing}>
                              {tWf("bulk_actions")}
                              <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{tWf("bulk_operations")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleAssignAll}>
                              {tWf("assign_all")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleUnassignAll}>
                              {tWf("unassign_all")}
                            </DropdownMenuItem>
                            {searchQuery && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleAssignFiltered}>
                                  {tWf("assign_filtered")} ({filteredUsers.length})
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleUnassignFiltered}>
                                  {tWf("unassign_filtered")} ({filteredUsers.length})
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {filteredUsers.map((user) => {
                            const isAssigned = editedStage.assigned_users?.some(
                              (u) => u.user_id === user.user_id
                            );
                            return (
                              <div
                                key={user.user_id}
                                className="px-4 py-3 flex items-center justify-between hover:bg-secondary/50"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-full flex items-center bg-gray-50 ring-1 ring-gray-200 text-black justify-center font-semibold text-sm"
                                    //style={{ backgroundColor: "red" }}
                                  >
                                    {user.initials}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {user.firstname} {user.lastname}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                  </div>
                                </div>
                                <Button
                                  variant={isAssigned ? "destructive" : "outline"}
                                  size="sm"
                                  type="button"
                                  onClick={() => toggleUserAssignment(user.user_id)}
                                  disabled={!isEditing}
                                >
                                  {isAssigned ? tWf("unassign") : tWf("assign")}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tWf("are_you_sure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tWf("delete_stage_confirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tWf("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setDeleteDialogOpen(false);
                onDelete?.();
              }}
            >
              {tWf("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
