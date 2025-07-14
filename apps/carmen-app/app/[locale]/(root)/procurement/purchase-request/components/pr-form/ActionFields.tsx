import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useRouter } from "@/lib/navigation";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestByIdDto } from "@/dtos/pr.dto";
import { convertPrStatus } from "@/utils/helper";
import { format } from "date-fns";
import {
  ChevronLeft,
  Pencil,
  X,
  Save,
  Printer,
  FileDown,
  Share,
} from "lucide-react";

interface ActionFieldsProps {
  readonly mode: formType;
  readonly currentMode: formType;
  readonly initValues?: PurchaseRequestByIdDto;
  readonly isCreatePending: boolean;
  readonly isUpdatePending: boolean;
  readonly onModeChange: (mode: formType) => void;
}

export default function ActionFields({
  mode,
  currentMode,
  initValues,
  isCreatePending,
  isUpdatePending,
  onModeChange,
}: ActionFieldsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Link href="/procurement/purchase-request">
          <ChevronLeft className="h-4 w-4" />
        </Link>

        <div className="flex items-start gap-2">
          {mode === formType.ADD ? (
            <p className="text-base font-bold">Purchase Request</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold">
                {initValues?.pr_no}
              </p>
              <p className="text-xs text-muted-foreground">
                Created on{" "}
                {initValues?.created_at
                  ? format(
                      new Date(initValues?.created_at ?? ""),
                      "dd MMM yyyy"
                    )
                  : ""}
              </p>
            </div>
          )}
          {initValues?.pr_status && (
            <Badge variant={initValues?.pr_status}>
              {convertPrStatus(initValues?.pr_status)}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {currentMode === formType.VIEW ? (
          <>
            <Button
              variant="outline"
              size={"sm"}
              className="px-2 text-xs"
              onClick={() =>
                router.push("/procurement/purchase-request")
              }
            >
              <ChevronLeft /> Back
            </Button>
            <Button
              variant="default"
              size={"sm"}
              className="px-2 text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onModeChange(formType.EDIT);
              }}
            >
              <Pencil /> Edit
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size={"sm"}
              className="px-2 text-xs"
              onClick={() =>
                currentMode === formType.ADD
                  ? router.push("/procurement/purchase-request")
                  : onModeChange(formType.VIEW)
              }
            >
              <X /> Cancel
            </Button>
            <Button
              variant="default"
              size={"sm"}
              className="px-2 text-xs"
              type="submit"
              disabled={isCreatePending || isUpdatePending}
            >
              <Save />
              {isCreatePending || isUpdatePending
                ? "Saving..."
                : "Save"}
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size={"sm"}
          className="px-2 text-xs"
        >
          <Printer />
          Print
        </Button>

        <Button
          variant="outline"
          size={"sm"}
          className="px-2 text-xs"
        >
          <FileDown />
          Export
        </Button>
        <Button
          variant="outline"
          size={"sm"}
          className="px-2 text-xs"
        >
          <Share />
          Share
        </Button>
      </div>
    </div>
  );
}