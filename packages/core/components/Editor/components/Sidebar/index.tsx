import React from "react";
import { ResizeHandle } from "../ResizeHandle";
import { cn } from "../../../../lib/cn";

interface SidebarProps {
  position: "left" | "right";
  sidebarRef: { current: HTMLDivElement | null };
  isVisible: boolean;
  onResize: (width: number) => void;
  onResizeEnd: (width: number) => void;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  position,
  sidebarRef,
  isVisible,
  onResize,
  onResizeEnd,
  children,
}) => {
  return (
    <>
      <div
        ref={sidebarRef}
        style={{ gridArea: position }}
        className={cn(
          "relative hidden flex-col overflow-y-auto border-t border-border bg-card",
          isVisible && "flex",
          position === "left" && "md:border-t-0 md:border-r",
          position === "right" && "md:border-t-0 md:border-l"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "absolute h-full",
          position === "left" && "justify-self-end",
          position === "right" && "justify-self-start"
        )}
        style={{ gridArea: position }}
      >
        <ResizeHandle
          position={position}
          sidebarRef={sidebarRef}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      </div>
    </>
  );
};
