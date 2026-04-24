import * as React from "react";
import { cn } from "@/lib/utils";

type Gap = "none" | "sm" | "md" | "lg" | "xl";
type Justify = "start" | "center" | "end" | "between" | "around";
type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Wrap = "wrap" | "nowrap";

type SlotRender = React.ComponentType<{ className?: string }>;

type Props = {
  gap: Gap;
  justify: Justify;
  align: Align;
  wrap: Wrap;
  content: SlotRender;
};

const gapClasses: Record<Gap, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-10",
};

const justifyClasses: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const alignClasses: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

export function Row({ gap, justify, align, wrap, content: Content }: Props) {
  return (
    <Content
      className={cn(
        "flex w-full",
        gapClasses[gap],
        justifyClasses[justify],
        alignClasses[align],
        wrap === "wrap" ? "flex-wrap" : "flex-nowrap"
      )}
    />
  );
}
