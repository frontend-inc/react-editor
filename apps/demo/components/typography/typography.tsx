import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2";
type Align = "left" | "center" | "right";

type Props = {
  variant: Variant;
  content: string;
  align: Align;
};

const variantClasses: Record<Variant, string> = {
  h1: "text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]",
  h2: "text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]",
  h3: "text-3xl md:text-4xl font-semibold tracking-tight leading-tight",
  h4: "text-2xl md:text-3xl font-semibold tracking-tight leading-snug",
  h5: "text-xl md:text-2xl font-semibold leading-snug",
  h6: "text-lg md:text-xl font-semibold leading-snug",
  body1: "text-lg leading-relaxed text-muted-foreground",
  body2: "text-base leading-relaxed text-muted-foreground",
};

const alignClasses: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Typography({ variant, content, align }: Props) {
  const Tag = (variant.startsWith("h") ? variant : "p") as
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p";
  return (
    <Tag
      className={cn(
        "text-foreground",
        variantClasses[variant],
        alignClasses[align]
      )}
    >
      {content as unknown as React.ReactNode}
    </Tag>
  );
}
