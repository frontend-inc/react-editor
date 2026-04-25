import { ReactNode } from "react";
import { Heading } from "../Heading";
import { Loader } from "../Loader";
import { Breadcrumbs } from "../Breadcrumbs";
import { cn } from "../../lib/cn";

export const SidebarSection = ({
  children,
  title,
  background,
  showBreadcrumbs,
  noBorderTop,
  isLoading,
}: {
  children: ReactNode;
  title: ReactNode;
  background?: string;
  showBreadcrumbs?: boolean;
  noBorderTop?: boolean;
  isLoading?: boolean | null;
}) => {
  return (
    <div
      className="relative flex flex-col text-foreground last-of-type:grow"
      style={{ background }}
    >
      <div
        className={cn(
          "overflow-x-auto border-b border-border bg-card px-4 py-3",
          !noBorderTop && "border-t"
        )}
      >
        <div className="flex items-center gap-1">
          {showBreadcrumbs ? (
            <Breadcrumbs />
          ) : (
            <div className="pr-4 text-[13px] leading-tight">
              <Heading rank="2" size="xs">
                {title}
              </Heading>
            </div>
          )}
        </div>
      </div>
      <div className="last:grow last:border-b-0 [&:last-child]:pb-1">
        {children}
      </div>
      {isLoading && (
        <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center bg-card opacity-80">
          <Loader size={32} />
        </div>
      )}
    </div>
  );
};
