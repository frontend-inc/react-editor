import * as React from "react";
import { cn } from "@/lib/utils";

type Background = "default" | "muted" | "primary" | "gradient";
type PaddingY = "none" | "sm" | "md" | "lg" | "xl";

type SlotRender = React.ComponentType<{ className?: string }>;

type Props = {
  background: Background;
  paddingY: PaddingY;
  content: SlotRender;
};

const backgroundClasses: Record<Background, string> = {
  default: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  gradient:
    "bg-gradient-to-b from-background via-background to-muted text-foreground",
};

const paddingYClasses: Record<PaddingY, string> = {
  none: "py-0",
  sm: "py-8",
  md: "py-16",
  lg: "py-24",
  xl: "py-32 md:py-40",
};

export function Section({ background, paddingY, content: Content }: Props) {
  return (
    <Content
      className={cn(
        "relative block w-full",
        backgroundClasses[background],
        paddingYClasses[paddingY]
      )}
    />
  );
}
