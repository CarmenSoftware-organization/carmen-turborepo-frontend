"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Separator } from "@/components/ui/separator";

export interface PurchaseRequestFilterValues {
  status?: string;
  stage?: string;
  dateRange?: DateRange;
  prType?: string;
  department?: string;
}

interface Props {
  onApply: (filters: PurchaseRequestFilterValues) => void;
  onReset: () => void;
  initialValues?: PurchaseRequestFilterValues;
  children?: React.ReactNode;
}

export default function FilterPurchaseRequest({
  onApply,
  onReset,
  initialValues,
  children,
}: Props) {
  const tCommon = useTranslations("Common");
  const tTableHeader = useTranslations("TableHeader");
  const tDataControls = useTranslations("DataControls");
  const tStatus = useTranslations("Status");
  const tPr = useTranslations("PurchaseRequest");

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | undefined>(initialValues?.status);
  const [stage, setStage] = useState<string | undefined>(initialValues?.stage);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialValues?.dateRange);
  const [prType, setPrType] = useState<string | undefined>(initialValues?.prType);
  const [department, setDepartment] = useState<string | undefined>(initialValues?.department);

  const handleApply = () => {
    onApply({
      status,
      stage,
      dateRange,
      prType,
      department,
    });
    setOpen(false);
  };

  const handleReset = () => {
    setStatus(undefined);
    setStage(undefined);
    setDateRange(undefined);
    setPrType(undefined);
    setDepartment(undefined);
    onReset();
  };

  const getDateRangeDisplay = () => {
    if (!dateRange?.from) {
      return <span>{tCommon("select_date")}</span>;
    }

    if (dateRange.to) {
      return (
        <>
          {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
        </>
      );
    }

    return format(dateRange.from, "dd/MM/yyyy");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button size="sm" variant={"outlinePrimary"}>
            <Filter className="h-4 w-4" />
            {tCommon("filter")}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="end">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <h4 className="font-semibold text-sm">Filter Options</h4>
            <span className="text-[10px] text-muted-foreground">Select criteria to filter</span>
          </div>
          {/* Date Range Filter */}
          <div className="flex flex-col gap-2">
            <Label>{tTableHeader("date")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal text-xs h-9 bg-muted/30 hover:bg-muted/50 border-border/60",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  {getDateRangeDisplay()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-2">
            <Label>{tTableHeader("status")}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 text-xs bg-muted/30 hover:bg-muted/50 border-border/60">
                <SelectValue placeholder={tDataControls("allStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tDataControls("allStatus")}</SelectItem>
                <SelectItem value="draft">{tStatus("draft")}</SelectItem>
                <SelectItem value="pending">{tStatus("pending")}</SelectItem>
                <SelectItem value="approved">{tStatus("approved")}</SelectItem>
                <SelectItem value="rejected">{tStatus("rejected")}</SelectItem>
                <SelectItem value="completed">{tStatus("completed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stage Filter */}
          <div className="flex flex-col gap-2">
            <Label>{tTableHeader("stage")}</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="h-9 text-xs bg-muted/30 hover:bg-muted/50 border-border/60">
                <SelectValue placeholder={tDataControls("allStage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tDataControls("allStage")}</SelectItem>
                <SelectItem value="requestor">{tDataControls("requestor")}</SelectItem>
                <SelectItem value="approver">
                  {tDataControls("department_head_approval")}
                </SelectItem>
                <SelectItem value="finance">{tDataControls("finance_manager_approval")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PR Type Filter */}
          <div className="flex flex-col gap-2">
            <Label>{tTableHeader("type")}</Label>
            <Select value={prType} onValueChange={setPrType}>
              <SelectTrigger className="h-9 text-xs bg-muted/30 hover:bg-muted/50 border-border/60">
                <SelectValue placeholder={tDataControls("allType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tDataControls("allType")}</SelectItem>
                <SelectItem value="general">{tPr("general")}</SelectItem>
                <SelectItem value="market_list">{tPr("market_list")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Department Filter */}
          <div className="flex flex-col gap-2">
            <Label>{tTableHeader("department")}</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="h-9 text-xs bg-muted/30 hover:bg-muted/50 border-border/60">
                <SelectValue placeholder={tDataControls("allDepartment")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tDataControls("allDepartment")}</SelectItem>
                {/* Add more departments as needed */}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <Separator className="my-2 mt-6" />
          <div className="flex justify-end gap-2">
            <Button variant={"outline"} size={"sm"} onClick={handleReset}>
              {tCommon("reset")}
            </Button>
            <Button variant={"default"} size={"sm"} onClick={handleApply}>
              {tCommon("apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
