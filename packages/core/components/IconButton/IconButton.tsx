import { ReactNode, SyntheticEvent, useState } from "react";
import { Loader } from "../Loader";
import { cn } from "../../lib/cn";

export const IconButton = ({
  active = false,
  children,
  href,
  onClick,
  type,
  disabled,
  tabIndex,
  newTab,
  fullWidth,
  title,
  suppressHydrationWarning,
}: {
  active?: boolean;
  children: ReactNode;
  href?: string;
  onClick?: (e: SyntheticEvent) => void | Promise<void>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  tabIndex?: number;
  newTab?: boolean;
  fullWidth?: boolean;
  title: string;
  suppressHydrationWarning?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const ElementType = href ? "a" : "button";

  return (
    <ElementType
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        disabled && "text-muted-foreground pointer-events-none opacity-60",
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
      title={title}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      <span className="sr-only">{title}</span>
      {children}
      {loading && (
        <>
          &nbsp;&nbsp;
          <Loader size={14} />
        </>
      )}
    </ElementType>
  );
};
