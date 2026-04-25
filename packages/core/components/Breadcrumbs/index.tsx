import { ReactNode } from "react";
import { useBreadcrumbs } from "../../lib/use-breadcrumbs";
import { useAppStore } from "../../store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export const Breadcrumbs = ({
  children,
  numParents = 1,
}: {
  children?: ReactNode;
  numParents?: number;
}) => {
  const setUi = useAppStore((s) => s.setUi);
  const ancestors = useBreadcrumbs(numParents);
  const currentLabel = useAppStore((s) =>
    s.selectedItem
      ? s.config.components[s.selectedItem.type]?.["label"] ??
        s.selectedItem.type.toString()
      : s.config?.root?.label || "Page"
  );

  // Always render a trailing, non-interactive crumb for the current target
  // so the element type never changes between selection states. This avoids
  // the "Page" label swapping between a <button> (in breadcrumbs) and an
  // <h2> (in a sibling title block), which was shifting layout.
  const crumbs: Array<{
    label: string;
    onClick?: () => void;
  }> = [
    ...ancestors.map((a) => ({
      label: a.label,
      onClick: () => setUi({ itemSelector: a.selector }),
    })),
    { label: currentLabel },
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap gap-1 whitespace-nowrap break-normal text-xs font-medium leading-tight sm:gap-1">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1 && !children;
          return (
            <BreadcrumbItem key={i} className="shrink-0 gap-1">
              <BreadcrumbLink
                asChild
                className="cursor-pointer text-accent/80 hover:text-accent [font:inherit] disabled:pointer-events-none disabled:cursor-default disabled:text-foreground disabled:hover:text-foreground"
              >
                <button
                  type="button"
                  disabled={!crumb.onClick}
                  aria-current={isLast ? "page" : undefined}
                  onClick={crumb.onClick}
                >
                  {crumb.label}
                </button>
              </BreadcrumbLink>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </BreadcrumbItem>
          );
        })}
        {children ? (
          <BreadcrumbItem className="shrink-0">{children}</BreadcrumbItem>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
