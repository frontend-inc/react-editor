import {
  Globe,
  Maximize,
  Minimize,
  Monitor,
  Smartphone,
} from "lucide-react";
import { useMemo } from "react";
import { useAppStore } from "../../store";
import { usePropsContext } from "../Editor";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { Viewport } from "../../types";
import { cn } from "../../lib/cn";

type Device = "desktop" | "mobile";

const DEVICE_VIEWPORTS: Record<Device, Viewport> = {
  desktop: { width: "100%", height: "auto", icon: "Monitor", label: "Desktop" },
  mobile: { width: 360, height: "auto", icon: "Smartphone", label: "Mobile" },
};

export const BrowserBar = ({
  onViewportChange,
}: {
  onViewportChange?: (viewport: Viewport) => void;
}) => {
  const { routes, currentPath, onRouteChange } = usePropsContext();
  const viewports = useAppStore((s) => s.state.ui.viewports);
  const dispatch = useAppStore((s) => s.dispatch);
  const leftSideBarVisible = useAppStore((s) => s.state.ui.leftSideBarVisible);
  const rightSideBarVisible = useAppStore(
    (s) => s.state.ui.rightSideBarVisible
  );
  const isFullScreen = !leftSideBarVisible && !rightSideBarVisible;

  const toggleFullScreen = () => {
    const next = !isFullScreen;
    dispatch({
      type: "setUi",
      ui: {
        leftSideBarVisible: !next,
        rightSideBarVisible: !next,
      },
    });
  };

  const activeDevice: Device = useMemo(() => {
    const w = viewports.current.width;
    if (typeof w === "number" && w <= 640) return "mobile";
    return "desktop";
  }, [viewports.current.width]);

  const setDevice = (device: Device) => {
    onViewportChange?.(DEVICE_VIEWPORTS[device]);
  };

  const showRoutePicker =
    !!routes && currentPath !== undefined && !!onRouteChange;

  const selectedTitle = routes?.find((r) => r.path === currentPath)?.title;

  const urlTriggerClass = cn(
    "flex flex-1 min-w-0 items-center gap-2 overflow-hidden rounded-full border border-border bg-muted px-3 py-2 text-xs text-foreground transition-[color,box-shadow]",
    "hover:bg-accent/10 hover:border-border/80",
    "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "data-[state=open]:border-ring data-[state=open]:ring-[3px] data-[state=open]:ring-ring/50",
    "[&>svg:last-child]:hidden"
  );

  return (
    <div className="flex w-full items-center gap-2 rounded-t-md border border-b-0 border-border bg-card px-[10px] py-2">
      {showRoutePicker ? (
        <Select
          value={currentPath}
          onValueChange={(next) => {
            void onRouteChange?.(next);
          }}
        >
          <SelectTrigger className={urlTriggerClass}>
            <Globe className="shrink-0 text-muted-foreground" size={14} />
            <span className="flex flex-1 min-w-0 items-center gap-2 overflow-hidden text-left whitespace-nowrap truncate">
              <span className="shrink-0 text-muted-foreground">
                {currentPath}
              </span>
              {selectedTitle ? (
                <span className="overflow-hidden text-ellipsis">
                  {selectedTitle}
                </span>
              ) : null}
            </span>
          </SelectTrigger>
          <SelectContent>
            {routes!.some((r) => r.path === currentPath) ? null : (
              <SelectItem value={currentPath!}>{currentPath}</SelectItem>
            )}
            {routes!.map((route) => (
              <SelectItem key={route.path} value={route.path}>
                {route.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className={urlTriggerClass}>
          <Globe className="shrink-0 text-muted-foreground" size={14} />
          <span className="flex flex-1 min-w-0 items-center gap-2">/</span>
        </div>
      )}
      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title={
            activeDevice === "desktop"
              ? "Switch to mobile viewport"
              : "Switch to desktop viewport"
          }
          onClick={() =>
            setDevice(activeDevice === "desktop" ? "mobile" : "desktop")
          }
        >
          {activeDevice === "desktop" ? (
            <Monitor size={16} />
          ) : (
            <Smartphone size={16} />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title={isFullScreen ? "Exit full screen" : "Enter full screen"}
          onClick={toggleFullScreen}
        >
          {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </Button>
      </div>
    </div>
  );
};
