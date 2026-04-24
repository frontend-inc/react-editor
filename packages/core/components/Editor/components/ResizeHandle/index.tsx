import React, { useCallback, useRef } from "react";
import { cn } from "../../../../lib/cn";
import "./styles.css";

interface ResizeHandleProps {
  position: "left" | "right";
  sidebarRef: { current: HTMLDivElement | null };
  onResize: (width: number) => void;
  onResizeEnd: (width: number) => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  position,
  sidebarRef,
  onResize,
  onResizeEnd,
}) => {
  const handleRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;

      const delta = e.clientX - startX.current;
      const newWidth =
        position === "left"
          ? startWidth.current + delta
          : startWidth.current - delta;

      const width = Math.max(192, newWidth);
      onResize(width);
      e.preventDefault();
    },
    [onResize, position]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;

    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    const overlay = document.getElementById("resize-overlay");
    if (overlay) {
      document.body.removeChild(overlay);
    }

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    const finalWidth = sidebarRef.current?.getBoundingClientRect().width || 0;
    onResizeEnd(finalWidth);
  }, [onResizeEnd]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      startX.current = e.clientX;

      startWidth.current =
        sidebarRef.current?.getBoundingClientRect().width || 0;

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const overlay = document.createElement("div");
      overlay.id = "resize-overlay";
      overlay.setAttribute("data-resize-overlay", "");
      document.body.appendChild(overlay);

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      e.preventDefault();
    },
    [position, handleMouseMove, handleMouseUp]
  );

  return (
    <div
      ref={handleRef}
      className={cn(
        "hidden md:block md:absolute md:top-0 md:h-full md:w-[5px] md:cursor-col-resize md:z-10 md:bg-transparent md:hover:bg-accent/20",
        position === "left" && "md:-right-[3px]",
        position === "right" && "md:-left-[3px]"
      )}
      onMouseDown={handleMouseDown}
    />
  );
};
