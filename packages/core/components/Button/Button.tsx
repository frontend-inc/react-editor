"use client";

import { ReactNode, useEffect, useState } from "react";
import { Loader } from "../Loader";
import { filterDataAttrs } from "../../lib/filter-data-attrs";
import { cn } from "../../lib/cn";

export const Button = ({
  children,
  href,
  onClick,
  variant = "primary",
  type,
  disabled,
  tabIndex,
  newTab,
  fullWidth,
  icon,
  size = "medium",
  loading: loadingProp = false,
  ...props
}: {
  children: ReactNode;
  href?: string;
  onClick?: (e: any) => void | Promise<void>;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  tabIndex?: number;
  newTab?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  size?: "medium" | "large";
  loading?: boolean;
}) => {
  const [loading, setLoading] = useState(loadingProp);

  useEffect(() => setLoading(loadingProp), [loadingProp]);

  const ElementType = href ? "a" : type ? "button" : "span";
  const dataAttrs = filterDataAttrs(props);

  return (
    <ElementType
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "medium" && "h-9 px-4 text-sm",
        size === "large" && "h-10 px-6 text-base",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        variant === "secondary" &&
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        fullWidth && "w-full"
      )}
      onClick={(e) => {
        if (!onClick) return;
        setLoading(true);
        Promise.resolve(onClick(e)).then(() => setLoading(false));
      }}
      type={type}
      disabled={disabled || loading}
      tabIndex={tabIndex}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
      href={href}
      {...dataAttrs}
    >
      {icon && <span className="[&_svg]:size-4">{icon}</span>}
      {children}
      {loading && (
        <span className="ml-1 inline-flex">
          <Loader size={14} />
        </span>
      )}
    </ElementType>
  );
};
