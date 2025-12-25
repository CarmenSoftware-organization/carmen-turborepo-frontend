"use client";

import { useState, useEffect } from "react";
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
          <CardTitle>Stage Details</CardTitle>
          {!isFirstStage && !isLastStage && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={!isEditing}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Stage
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
              <h3 className="text-xl font-semibold mb-2">Workflow Completed</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                This is the final stage of the workflow. No further actions or configurations are
                required.
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
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="assigned_users">Assigned Users</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 px-6 pb-6">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`data.stages.${selectedStageIndex}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage Name</FormLabel>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!isEditing}
                          rows={3}
                          placeholder="Enter description"
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
                      <FormLabel>Stage Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger id="stage-role">
                            <SelectValue placeholder="Select a role" />
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
                      <FormLabel>Creator Access</FormLabel>
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
                              Only Creator
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg border">
                            <RadioGroupItem
                              value="all_department"
                              id="all_department"
                              disabled={!isEditing}
                            />
                            <Label htmlFor="all_department" className="cursor-pointer">
                              All user in department
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
                        <FormLabel>SLA</FormLabel>
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
                    name={`data.stages.${selectedStageIndex}.sla_unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SLA Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger id="sla_unit">
                              <SelectValue placeholder="Select SLA Unit" />
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
                <Label>Available Actions</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant={editedStage.available_actions.submit.is_active ? "default" : "outline"}
                    onClick={() => toggleAction("submit")}
                    disabled={!isEditing}
                  >
                    Submit
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
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant={
                          editedStage.available_actions.reject.is_active ? "destructive" : "outline"
                        }
                        onClick={() => toggleAction("reject")}
                        disabled={!isEditing}
                      >
                        Reject
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
                        Send Back
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hidden Fields</Label>
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
                        <FormLabel>Price Per Unit</FormLabel>
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
                        <FormLabel>Total Price</FormLabel>
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
                    <CardTitle className="text-base">Submit Notification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">Recipients</Label>
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
                              <FormLabel>Requestor</FormLabel>
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
                              <FormLabel>Current Approver</FormLabel>
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
                              <FormLabel>Next Stage Approver</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="submit-template">Template</Label>
                      <Select
                        value={editedStage.available_actions.submit.template || ""}
                        onValueChange={(value) => updateTemplate("submit", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="submit-template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submit-template-1">Submit Template 1</SelectItem>
                          <SelectItem value="submit-template-2">Submit Template 2</SelectItem>
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
                    <CardTitle className="text-base">Approve Notification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">Recipients</Label>
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
                              <FormLabel>Requestor</FormLabel>
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
                              <FormLabel>Current Approver</FormLabel>
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
                              <FormLabel>Next Stage Approver</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="approve-template">Template</Label>
                      <Select
                        value={editedStage.available_actions.approve.template || ""}
                        onValueChange={(value) => updateTemplate("approve", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="approve-template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approve-template-1">Approval Template 1</SelectItem>
                          <SelectItem value="approve-template-2">Approval Template 2</SelectItem>
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
                    <CardTitle className="text-base">Reject Notification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">Recipients</Label>
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
                              <FormLabel>Requestor</FormLabel>
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
                              <FormLabel>Previous Stage Approvers</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reject-template">Template</Label>
                      <Select
                        value={stage.available_actions.reject.template || ""}
                        onValueChange={(value) => updateTemplate("reject", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="reject-template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reject-template-1">Rejection Template 1</SelectItem>
                          <SelectItem value="reject-template-2">Rejection Template 2</SelectItem>
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
                    <CardTitle className="text-base">Send Back Notification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">Recipients</Label>
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
                              <FormLabel>Requestor</FormLabel>
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
                              <FormLabel>Previous Stage Approvers</FormLabel>
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
                              <FormLabel>Send Back Stage Approvers</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sendback-template">Template</Label>
                      <Select
                        value={editedStage.available_actions.sendback.template || ""}
                        onValueChange={(value) => updateTemplate("sendback", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="sendback-template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sendback-template-1">Send Back Template 1</SelectItem>
                          <SelectItem value="sendback-template-2">Send Back Template 2</SelectItem>
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
                    <CardTitle className="text-base">SLA Warning Notification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="mb-3">Recipients</Label>
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
                              <FormLabel>Requestor</FormLabel>
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
                              <FormLabel>Current Approver</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sla-template">Template</Label>
                      <Select
                        value={editedStage.sla_warning_notification?.template || ""}
                        onValueChange={(value) => updateSLAWarningTemplate(value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="sla-template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sla-template-1">SLA Warning Template 1</SelectItem>
                          <SelectItem value="sla-template-2">SLA Warning Template 2</SelectItem>
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
                      <h4 className="text-base font-semibold mb-2">No Notifications Available</h4>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Enable actions in the General tab to configure notification settings.
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
                      Is HOD (Head of Department)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enable if this stage requires HOD approval
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-1">Stage Users</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage users assigned to this stage
                </p>

                {editedStage.is_hod ? (
                  /* HOD Mode - Disabled User Assignment */
                  <Card>
                    <CardContent className="text-center py-12">
                      <div className="mb-3">
                        <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
                      </div>
                      <h4 className="text-base font-semibold mb-2">HOD Approval Enabled</h4>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        User assignment is disabled when HOD (Head of Department) approval is
                        enabled. The system will automatically route to the appropriate HOD.
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
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <Button variant="outline" disabled={!isEditing} type="button">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>

                    {/* User List */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <p className="text-sm font-medium">
                          Total Users: {assignedCount} / {totalUsers}
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={!isEditing}>
                              Bulk Actions
                              <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Bulk Operations</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleAssignAll}>
                              Assign All Users
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleUnassignAll}>
                              Unassign All Users
                            </DropdownMenuItem>
                            {searchQuery && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleAssignFiltered}>
                                  Assign Filtered ({filteredUsers.length})
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleUnassignFiltered}>
                                  Unassign Filtered ({filteredUsers.length})
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
                                  {isAssigned ? "Unassign" : "Assign"}
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this stage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setDeleteDialogOpen(false);
                onDelete?.();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
