import * as React from "react";
import { cn } from "@/lib/utils";

type Columns = "1" | "2" | "3" | "4" | "5" | "6";
type Gap = "sm" | "md" | "lg" | "xl";
type Responsive = "on" | "off";

type SlotRender = React.ComponentType<{ className?: string }>;

type Props = {
  columns: Columns;
  gap: Gap;
  responsive: Responsive;
  content: SlotRender;
};

const columnsClasses: Record<Columns, { responsive: string; fixed: string }> = {
  "1": { responsive: "grid-cols-1", fixed: "grid-cols-1" },
  "2": { responsive: "grid-cols-1 md:grid-cols-2", fixed: "grid-cols-2" },
  "3": {
    responsive: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    fixed: "grid-cols-3",
  },
  "4": {
    responsive: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    fixed: "grid-cols-4",
  },
  "5": {
    responsive: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    fixed: "grid-cols-5",
  },
  "6": {
    responsive: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
    fixed: "grid-cols-6",
  },
};

const gapClasses: Record<Gap, string> = {
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

export function Grid({ columns, gap, responsive, content: Content }: Props) {
  return (
    <Content
      className={cn(
        "grid w-full",
        responsive === "on"
          ? columnsClasses[columns].responsive
          : columnsClasses[columns].fixed,
        gapClasses[gap]
      )}
    />
  );
}
