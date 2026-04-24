import { ReactNode } from "react";
import { cn } from "../../../../lib/cn";

export type MenuItem = {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  isActive?: boolean;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
};

export const MenuItem = ({
  label,
  icon,
  onClick,
  isActive,
  mobileOnly,
  desktopOnly,
}: MenuItem) => {
  return (
    <li
      className={cn(
        "first:pl-2 last:pr-2 sm:first:pl-0 sm:last:pr-0",
        mobileOnly && "sm:hidden",
        desktopOnly && "hidden sm:block"
      )}
    >
      {onClick && (
        <div
          onClick={onClick}
          className={cn(
            "relative mx-auto box-border flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 p-1 text-muted-foreground transition-colors",
            isActive
              ? "bg-accent/10 text-accent"
              : "hover:bg-accent/5 hover:text-accent"
          )}
        >
          {icon && (
            <span className="flex h-[18px] w-[18px] items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]">
              {icon}
            </span>
          )}
          <span className="sr-only">{label}</span>
        </div>
      )}
    </li>
  );
};

export const Nav = ({
  items,
  mobileActions,
  footer,
}: {
  items: Record<string, MenuItem>;
  mobileActions?: ReactNode;
  footer?: ReactNode;
}) => {
  return (
    <nav className="flex sm:h-full sm:flex-col">
      <ul className="flex gap-1 m-0 list-none overflow-x-auto p-0 sm:grow sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pt-4 sm:w-full">
        {Object.entries(items).map(([key, item]) => (
          <MenuItem key={key} {...item} />
        ))}
      </ul>
      {mobileActions && (
        <div className="ml-auto flex items-center justify-center border-l border-border px-4 py-1 sm:hidden">
          {mobileActions}
        </div>
      )}
      {footer && (
        <div className="hidden sm:flex items-center justify-center py-3">
          {footer}
        </div>
      )}
    </nav>
  );
};
