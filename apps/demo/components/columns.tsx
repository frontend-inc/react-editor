import * as React from "react";
import { cn } from "@/lib/utils";

type Span =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

type Gap = "sm" | "md" | "lg" | "xl";

type SlotRender = React.ComponentType<{ className?: string }>;

type Props = {
  items: Array<{ span: Span; content: SlotRender }>;
  gap: Gap;
};

const spanClasses: Record<Span, string> = {
  "1": "md:col-span-1",
  "2": "md:col-span-2",
  "3": "md:col-span-3",
  "4": "md:col-span-4",
  "5": "md:col-span-5",
  "6": "md:col-span-6",
  "7": "md:col-span-7",
  "8": "md:col-span-8",
  "9": "md:col-span-9",
  "10": "md:col-span-10",
  "11": "md:col-span-11",
  "12": "md:col-span-12",
};

const gapClasses: Record<Gap, string> = {
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

export function Columns({ items, gap }: Props) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 items-start md:grid-cols-12",
        gapClasses[gap]
      )}
    >
      {items.map((item, i) => {
        const Content = item.content;
        return (
          <Content
            key={i}
            className={cn("col-span-1", spanClasses[item.span])}
          />
        );
      })}
    </div>
  );
}
