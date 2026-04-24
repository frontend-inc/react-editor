import { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type HeadingProps = {
  children: ReactNode;
  rank?: "1" | "2" | "3" | "4" | "5" | "6";
  size?: "xxxxl" | "xxxl" | "xxl" | "xl" | "l" | "m" | "s" | "xs";
};

const sizeClasses: Record<NonNullable<HeadingProps["size"]>, string> = {
  xs: "text-xs",
  s: "text-sm",
  m: "text-base",
  l: "text-lg",
  xl: "text-xl",
  xxl: "text-2xl",
  xxxl: "text-3xl",
  xxxxl: "text-4xl",
};

export const Heading = ({ children, rank, size = "m" }: HeadingProps) => {
  const Tag: any = rank ? `h${rank}` : "span";

  return (
    <Tag className={cn("font-medium leading-tight", sizeClasses[size])}>
      {children}
    </Tag>
  );
};
