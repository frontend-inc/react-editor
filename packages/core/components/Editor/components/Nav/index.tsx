import { ReactNode } from "react";
import { cn } from "../../../../lib/cn";
import { Button } from "../../../ui/button";

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
  if (!onClick) return null;
  return (
    <li
      className={cn(
        "flex justify-center first:pl-2 last:pr-2 sm:first:pl-0 sm:last:pr-0",
        mobileOnly && "sm:hidden",
        desktopOnly && "hidden sm:flex"
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        title={label}
        data-active={isActive ? true : undefined}
        onClick={onClick}
      >
        {icon ? (
          <span className="flex size-[18px] items-center justify-center [&_svg]:size-[18px]">
            {icon}
          </span>
        ) : null}
        <span className="sr-only">{label}</span>
      </Button>
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
