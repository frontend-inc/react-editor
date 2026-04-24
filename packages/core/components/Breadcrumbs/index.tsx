import { ChevronRight } from "lucide-react";
import { useBreadcrumbs } from "../../lib/use-breadcrumbs";
import { useAppStore } from "../../store";
import { ReactNode } from "react";

export const Breadcrumbs = ({
  children,
  numParents = 1,
}: {
  children?: ReactNode;
  numParents?: number;
}) => {
  const setUi = useAppStore((s) => s.setUi);
  const breadcrumbs = useBreadcrumbs(numParents);

  return (
    <div className="flex items-center gap-1">
      {breadcrumbs.map((breadcrumb, i) => (
        <div key={i} className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="rounded-sm border-0 bg-transparent p-0 font-inherit text-accent hover:text-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            onClick={() => setUi({ itemSelector: breadcrumb.selector })}
          >
            {breadcrumb.label}
          </button>
          <ChevronRight size={14} />
        </div>
      ))}
      {children}
    </div>
  );
};
