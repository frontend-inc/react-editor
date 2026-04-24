import * as React from "react";
import { cn } from "@/lib/utils";

type Gap = "none" | "sm" | "md" | "lg" | "xl";
type Align = "start" | "center" | "end" | "stretch";

type SlotRender = React.ComponentType<{ className?: string }>;

type Props = {
  gap: Gap;
  align: Align;
  content: SlotRender;
};

const gapClasses: Record<Gap, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-10",
};

const alignClasses: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export function Stack({ gap, align, content: Content }: Props) {
  return (
    <Content
      className={cn(
        "flex w-full flex-col",
        gapClasses[gap],
        alignClasses[align]
      )}
    />
  );
}
