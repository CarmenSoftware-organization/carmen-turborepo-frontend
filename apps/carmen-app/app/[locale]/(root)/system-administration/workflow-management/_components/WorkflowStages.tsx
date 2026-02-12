"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Control, useFieldArray } from "react-hook-form";
import { GripVertical } from "lucide-react";
import { Stage, User, WorkflowCreateModel } from "@/dtos/workflows.dto";
import StageList from "./StageList";
import StageDetailPanel from "./StageDetailPanel";

enum enum_available_actions {
  submit = "submit",
  approve = "approve",
  reject = "reject",
  sendback = "sendback",
}

interface WorkflowStageProps {
  control: Control<WorkflowCreateModel>;
  isEditing: boolean;
  listUser: User[];
}

const WorkflowStages = ({ control, isEditing, listUser }: WorkflowStageProps) => {
  const tWf = useTranslations("Workflow");
  const { fields, insert, move, update, remove } = useFieldArray({
    name: "data.stages",
    control: control,
  });
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!fields || !over || active.id === over.id) return;

    const oldIndex = fields.findIndex((_, index) => `stage-list-${index}` === active.id);
    const newIndex = fields.findIndex((_, index) => `stage-list-${index}` === over.id);

    const isFirstOrLast = (index: number) => index === 0 || index === fields.length - 1;

    if (oldIndex !== -1 && newIndex !== -1) {
      if (isFirstOrLast(oldIndex) || isFirstOrLast(newIndex)) {
        return;
      }

      move(oldIndex, newIndex);

      if (selectedStageIndex === oldIndex) {
        setSelectedStageIndex(newIndex);
      } else if (oldIndex < selectedStageIndex && newIndex >= selectedStageIndex) {
        setSelectedStageIndex(selectedStageIndex - 1);
      } else if (oldIndex > selectedStageIndex && newIndex <= selectedStageIndex) {
        setSelectedStageIndex(selectedStageIndex + 1);
      }
    }
  };

  const getActiveDragStage = () => {
    if (!activeDragId || !fields) return null;
    const index = parseInt(activeDragId.replace("stage-list-", ""));
    return fields[index];
  };

  const handleDeleteStage = () => {
    remove(selectedStageIndex);
    //onSave(updatedStages);
  };

  const handleSelectStageIndex = (index: number) => {
    setSelectedStageIndex(index);
  };

  const handleAddStage = () => {
    let stageName = `${tWf("new_stage")} ${fields.length}`;
    let counter = fields.length;
    while (fields.some((s) => s.name.toLowerCase() === stageName.toLowerCase())) {
      counter++;
      stageName = `${tWf("new_stage")} ${counter}`;
    }

    const newStage: Stage = {
      name: stageName,
      description: "",
      sla: "24",
      sla_unit: "hours",
      role: "approve",
      creator_access: "only_creator",
      available_actions: {
        submit: {
          is_active: false,
          recipients: {
            requestor: false,
            current_approve: false,
            next_step: false,
          },
        },
        approve: {
          is_active: true,
          recipients: {
            requestor: true,
            current_approve: false,
            next_step: true,
          },
        },
        reject: {
          is_active: true,
          recipients: {
            requestor: true,
            current_approve: false,
            next_step: false,
          },
        },
        sendback: {
          is_active: true,
          recipients: {
            requestor: true,
            current_approve: false,
            next_step: false,
          },
        },
      },
      hide_fields: {
        price_per_unit: false,
        total_price: false,
      },
      assigned_users: [],
      sla_warning_notification: {
        recipients: {
          current_approve: false,
          requestor: false,
        },
      },
    };

    insert(fields.length - 1, newStage);

    setSelectedStageIndex(fields.length - 1);
  };

  const handleUpdateStage = (stage: Stage) => {
    update(selectedStageIndex, stage);
  };

  const handleActionToggle = (action: enum_available_actions) => {
    // if (!selectedStage) return;
    // const updatedStages = fields.map((stage) => {
    //   if (stage.name === selectedStage.name) {
    //     const updatedActions = { ...stage.available_actions };
    //     if (updatedActions[action]) {
    //       updatedActions[action] = {
    //         ...updatedActions[action],
    //         is_active: !updatedActions[action].is_active,
    //       };
    //     }
    //     return {
    //       ...stage,
    //       available_actions: updatedActions,
    //     };
    //   }
    //   return stage;
    // });
    // form.setValue("data.stages", updatedStages);
  };

  return (
    <div className="space-y-3">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">{tWf("workflow_stages")}</h2>
        <p className="text-sm text-gray-600">{tWf("configure_workflow_stages")}</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Stage List */}
        <div className="col-span-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((_, index) => `stage-list-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <StageList
                stages={fields}
                selectedIndex={selectedStageIndex}
                onSelectStage={handleSelectStageIndex}
                onAddStage={handleAddStage}
                isEditing={isEditing}
              />
            </SortableContext>
            <DragOverlay>
              {activeDragId ? (
                <Card className="shadow-xl">
                  <CardContent className="p-3 flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{getActiveDragStage()?.name}</span>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
        {/* Right Panel - Stage Details */}
        <div className="col-span-8">
          <StageDetailPanel
            stage={fields[selectedStageIndex] as Stage}
            listUser={listUser}
            onUpdate={handleUpdateStage}
            onDelete={handleDeleteStage}
            isLastStage={selectedStageIndex === (fields.length ?? 0) - 1}
            isFirstStage={selectedStageIndex === 0}
            isEditing={isEditing}
            control={control}
            selectedStageIndex={selectedStageIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowStages;
