import { Card } from "@/components/ui/card";
import { formatLargeNumber } from "@/utils/formatLargeNumber";
import React from "react";

interface Props {
  title: string;
  value: string | number;
  subtext: string;
  unit: string;
}

const MetricCard: React.FC<Props> = ({ title, value, subtext, unit }) => {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium text-secondary-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-semibold">
        {typeof value === "number" ? formatLargeNumber(value) : value}{" "}
        <span className="text-lg font-normal text-secondary-foreground">{unit}</span>
      </p>
      <p className="text-sm text-secondary-foreground">{subtext}</p>
    </Card>
  );
};

export default MetricCard;
