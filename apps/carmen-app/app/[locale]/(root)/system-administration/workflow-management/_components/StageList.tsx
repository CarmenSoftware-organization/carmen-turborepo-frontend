"use client";

import { WorkflowCreateModel } from "@/dtos/workflows.dto";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { FieldArrayWithId } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface StageListItemProps {
  stage: any;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  id: string;
  isLocked: boolean;
  isEditing: boolean;
}

function StageListItem({
  stage,
  index,
  isSelected,
  onClick,
  id,
  isLocked,
  isEditing,
}: StageListItemProps) {
  const tWf = useTranslations("Workflow");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: isLocked || !isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-4 py-3 transition-colors ${
        isSelected
          ? "bg-blue-50 border-l-4 text-black border-blue-500"
          : "hover:bg-gray-50 hover:text-black border-l-4 border-transparent"
      } ${isDragging ? "opacity-50 shadow-lg" : ""} ${isLocked ? "" : ""}`}
    >
      {/* Drag Handle or Lock Icon */}
      {isLocked || !isEditing ? (
        <div className="p-1" title={isLocked ? tWf("fixed_position") : tWf("view_mode")}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      ) : (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:text-gray-600 p-1"
          title={tWf("drag_to_reorder")}
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>
      )}

      {/* Stage Name - Clickable */}
      <button type="button" onClick={onClick} className={`flex-1 text-left text-sm font-medium`}>
        {stage.name}
      </button>

      {/* Stage Number Badge */}
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded `}>{index + 1}</span>
      </div>
    </div>
  );
}

interface StageListProps {
  stages: FieldArrayWithId<WorkflowCreateModel, "data.stages", "id">[];
  selectedIndex: number;
  onSelectStage: (index: number) => void;
  onAddStage?: () => void;
  isEditing?: boolean;
}

export default function StageList({
  stages,
  selectedIndex,
  onSelectStage,
  onAddStage,
  isEditing = true,
}: StageListProps) {
  const tWf = useTranslations("Workflow");

  const isFirstOrLast = (index: number) => {
    return index === 0 || index === stages.length - 1;
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="px-4 py-3 border-b">
        <h3 className="text-base font-semibold">{tWf("stages")}</h3>
        <p className="text-xs mt-1">{tWf("drag_to_reorder")}</p>
      </div>
      {stages.map((stage, index) => (
        <StageListItem
          key={`stage-list-${index}`}
          id={`stage-list-${index}`}
          stage={stage}
          index={index}
          isSelected={selectedIndex === index}
          onClick={() => onSelectStage(index)}
          isLocked={isFirstOrLast(index)}
          isEditing={isEditing}
        />
      ))}

      {onAddStage && (
        <div className="p-3 border-t ">
          <Button
            onClick={onAddStage}
            variant="secondary"
            className={`w-full ${
              isEditing
                ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                : "text-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
            disabled={!isEditing}
            type="button"
          >
            <Plus className="w-4 h-4 mr-2" />
            {tWf("add_stage")}
          </Button>
        </div>
      )}
    </div>
  );
}
