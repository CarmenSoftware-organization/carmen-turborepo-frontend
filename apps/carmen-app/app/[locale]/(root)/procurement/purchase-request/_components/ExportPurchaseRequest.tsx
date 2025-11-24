"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, FileDown, FileSpreadsheet, FileText, FileType, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export type ExportFormat = "excel" | "word" | "pdf";

interface ExportOption {
  id: ExportFormat;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  onExport: (format: ExportFormat) => void;
  children?: React.ReactNode;
}

export default function ExportPurchaseRequest({ onExport, children }: Props) {
  const tCommon = useTranslations("Common");

  const [open, setOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | undefined>(undefined);

  const exportOptions: ExportOption[] = [
    {
      id: "excel",
      label: "Excel (.xlsx)",
      icon: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
    },
    {
      id: "word",
      label: "Word (.docx)",
      icon: <FileText className="h-4 w-4 text-blue-600" />,
    },
    {
      id: "pdf",
      label: "PDF (.pdf)",
      icon: <FileType className="h-4 w-4 text-red-600" />,
    },
  ];

  const handleExport = () => {
    if (selectedFormat) {
      onExport(selectedFormat);
      setOpen(false);
      setSelectedFormat(undefined);
    }
  };

  const handleCancel = () => {
    setSelectedFormat(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="outlinePrimary" size="sm">
            <FileDown className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="end">
        <div className="p-4 space-y-4">
          <h4 className="font-medium text-xs">{tCommon("export")}</h4>
          <RadioGroup
            value={selectedFormat}
            onValueChange={(value) => setSelectedFormat(value as ExportFormat)}
          >
            <div className="space-y-4">
              {exportOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="flex items-center gap-1 text-xs font-normal cursor-pointer"
                  >
                    {option.icon}
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="w-7 h-7" onClick={handleCancel}>
              <X />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-7 w-7"
              onClick={handleExport}
              disabled={!selectedFormat}
            >
              <Download />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
