import * as React from "react";
import { cn } from "@/lib/utils";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "prose" | "full";
type PaddingX = "none" | "sm" | "md" | "lg";

type SlotRender = React.ComponentType<{ className?: string }>;

type Props = {
  maxWidth: MaxWidth;
  paddingX: PaddingX;
  content: SlotRender;
};

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  prose: "max-w-prose",
  full: "max-w-none",
};

const paddingXClasses: Record<PaddingX, string> = {
  none: "px-0",
  sm: "px-4",
  md: "px-6 md:px-8",
  lg: "px-6 md:px-10 lg:px-12",
};

export function Container({ maxWidth, paddingX, content: Content }: Props) {
  return (
    <Content
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingXClasses[paddingX]
      )}
    />
  );
}
