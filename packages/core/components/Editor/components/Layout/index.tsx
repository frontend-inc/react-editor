import { ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import { IframeConfig, UiState } from "../../../../types";
import { usePropsContext } from "../..";
import { useInjectGlobalCss } from "../../../../lib/use-inject-css";
import { useAppStore, useAppStoreApi } from "../../../../store";
import { DefaultOverride } from "../../../DefaultOverride";
import { monitorHotkeys, useMonitorHotkeys } from "../../../../lib/use-hotkey";
import { getFrame } from "../../../../lib/get-frame";
import { usePreviewModeHotkeys } from "../../../../lib/use-preview-mode-hotkeys";
import { DragDropContext } from "../../../DragDropContext";
import { SidebarSection } from "../../../SidebarSection";
import { Canvas } from "../Canvas";
import { Fields } from "../Fields";
import { useSidebarResize } from "../../../../lib/use-sidebar-resize";
import { FrameProvider } from "../../../../lib/frame-context";
import { Sidebar } from "../Sidebar";
import { useDeleteHotkeys } from "../../../../lib/use-delete-hotkeys";
import { MenuItem, Nav } from "../Nav";
import { IconButton } from "../../../IconButton";
import {
  Maximize2,
  Minimize2,
  Moon,
  Redo2Icon,
  Sun,
  ToyBrick,
  Undo2Icon,
} from "lucide-react";
import { PluginInternal } from "../../../../types/Internal";
import { blocksPlugin } from "../../../../plugins/blocks";
import { outlinePlugin } from "../../../../plugins/outline";
import { fieldsPlugin } from "../../../../plugins/fields";
import { Button } from "../../../Button";
import { cn } from "../../../../lib/cn";
import { themeToCssVars } from "../..";

const FieldSideBarToolbar = () => {
  const appStore = useAppStoreApi();
  const { onPublish } = usePropsContext();

  const back = useAppStore((s) => s.history.back);
  const forward = useAppStore((s) => s.history.forward);
  const hasFuture = useAppStore((s) => s.history.hasFuture());
  const hasPast = useAppStore((s) => s.history.hasPast());

  const CustomHeaderActions = useAppStore(
    (s) => s.overrides.headerActions || DefaultOverride
  );

  return (
    <div className="flex items-center justify-between gap-2 border-b border-border bg-card px-3 py-2">
      <div className="flex gap-0.5 text-muted-foreground">
        <IconButton
          type="button"
          title="undo"
          disabled={!hasPast}
          onClick={back}
        >
          <Undo2Icon size={18} />
        </IconButton>
        <IconButton
          type="button"
          title="redo"
          disabled={!hasFuture}
          onClick={forward}
        >
          <Redo2Icon size={18} />
        </IconButton>
      </div>
      <div className="flex items-center gap-2">
        <CustomHeaderActions>
          <Button
            onClick={() => {
              const data = appStore.getState().state.data;
              onPublish && onPublish(data);
            }}
          >
            Publish
          </Button>
        </CustomHeaderActions>
      </div>
    </div>
  );
};

const FieldSideBar = () => {
  const title = useAppStore((s) =>
    s.selectedItem
      ? s.config.components[s.selectedItem.type]?.["label"] ??
        s.selectedItem.type.toString()
      : s.config.root?.label || "Page"
  );

  return (
    <>
      <FieldSideBarToolbar />
      <SidebarSection noBorderTop showBreadcrumbs title={title}>
        <Fields />
      </SidebarSection>
    </>
  );
};

const PluginTab = ({
  children,
  visible,
  mobileOnly,
}: {
  children: ReactNode;
  visible: boolean;
  mobileOnly?: boolean;
}) => {
  return (
    <div
      className={cn(
        "hidden max-h-full grow",
        visible && "flex flex-col",
        mobileOnly && "sm:hidden"
      )}
    >
      <div className="max-h-full grow">{children}</div>
    </div>
  );
};

export const Layout = ({ children }: { children?: ReactNode }) => {
  const {
    iframe: _iframe,
    dnd,
    initialHistory: _initialHistory,
    plugins,
    height,
    className: rootClassName,
    theme: themeProp,
  } = usePropsContext();

  const iframe: IframeConfig = useMemo(
    () => ({
      enabled: true,
      waitForStyles: true,
      ..._iframe,
    }),
    [_iframe]
  );

  useInjectGlobalCss(iframe.enabled);

  const dispatch = useAppStore((s) => s.dispatch);
  const leftSideBarVisible = useAppStore((s) => s.state.ui.leftSideBarVisible);
  const rightSideBarVisible = useAppStore(
    (s) => s.state.ui.rightSideBarVisible
  );

  const instanceId = useAppStore((s) => s.instanceId);

  const {
    width: leftWidth,
    setWidth: setLeftWidth,
    sidebarRef: leftSidebarRef,
    handleResizeEnd: handleLeftSidebarResizeEnd,
  } = useSidebarResize("left", dispatch);

  const {
    width: rightWidth,
    setWidth: setRightWidth,
    sidebarRef: rightSidebarRef,
    handleResizeEnd: handleRightSidebarResizeEnd,
  } = useSidebarResize("right", dispatch);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 638px)").matches) {
      dispatch({
        type: "setUi",
        ui: {
          leftSideBarVisible: false,
          rightSideBarVisible: false,
        },
      });
    }

    const handleResize = () => {
      if (!window.matchMedia("(min-width: 638px)").matches) {
        dispatch({
          type: "setUi",
          ui: (ui: UiState) => ({
            ...ui,
            ...(ui.rightSideBarVisible ? { leftSideBarVisible: false } : {}),
          }),
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const overrides = useAppStore((s) => s.overrides);

  const CustomEditor = useMemo(
    () => overrides.editor || DefaultOverride,
    [overrides]
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ready = useAppStore((s) => s.status === "READY");

  useMonitorHotkeys();

  useEffect(() => {
    if (ready && iframe.enabled) {
      const frameDoc = getFrame();

      if (frameDoc) {
        return monitorHotkeys(frameDoc);
      }
    }
  }, [ready, iframe.enabled]);

  usePreviewModeHotkeys();
  useDeleteHotkeys();

  const setUi = useAppStore((s) => s.setUi);
  const currentPlugin = useAppStore((s) => s.state.ui.plugin?.current);
  const appStoreApi = useAppStoreApi();

  const [mobilePanelHeightMode, setMobilePanelHeightMode] = useState<
    "toggle" | "min-content"
  >("toggle");

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("editor-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("editor-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const themeIcon =
    theme === "dark" ? <Sun size={18} /> : <Moon size={18} />;

  const themeLabel =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  const hasLegacySideBarPlugin = useMemo(
    () => !!plugins?.find((p) => p.name === "legacy-side-bar"),
    [plugins]
  );

  const pluginItems = useMemo(() => {
    const details: Record<string, MenuItem & { render: () => ReactElement }> =
      {};

    const defaultPlugins: PluginInternal[] = [blocksPlugin(), outlinePlugin()];

    const isLegacy = (plugin: PluginInternal) =>
      plugin.name === "legacy-side-bar" ? -1 : 0;

    const combinedPlugins: PluginInternal[] = [
      ...defaultPlugins,
      ...(plugins ?? []),
    ].sort((a, b) => isLegacy(a) - isLegacy(b));

    if (!plugins?.some((p) => p.name === "fields")) {
      combinedPlugins.push(fieldsPlugin());
    }

    combinedPlugins?.forEach((plugin) => {
      if (plugin.name && plugin.render) {
        if (details[plugin.name]) {
          delete details[plugin.name];
        }

        details[plugin.name] = {
          label: plugin.label ?? plugin.name,
          icon: plugin.icon ?? <ToyBrick />,
          onClick: () => {
            setMobilePanelHeightMode(plugin.mobilePanelHeight ?? "toggle");

            if (plugin.name === currentPlugin) {
              if (leftSideBarVisible) {
                setUi({ leftSideBarVisible: false });
              } else {
                setUi({ leftSideBarVisible: true });
              }
            } else {
              if (plugin.name) {
                setUi({
                  plugin: { current: plugin.name },
                  leftSideBarVisible: true,
                });
              }
            }
          },
          isActive: leftSideBarVisible && currentPlugin === plugin.name,
          render: plugin.render,
          mobileOnly: hasLegacySideBarPlugin || plugin.mobileOnly,
          desktopOnly: plugin.name === "legacy-side-bar" || plugin.desktopOnly,
        };
      }
    });

    return details;
  }, [plugins, currentPlugin, appStoreApi, leftSideBarVisible]);

  useEffect(() => {
    if (!currentPlugin) {
      const names = Object.keys(pluginItems);

      setUi({ plugin: { current: names[0] } });
    }
  }, [pluginItems, currentPlugin]);

  const hasDesktopFieldsPlugin =
    pluginItems["fields"] && pluginItems["fields"].mobileOnly === false;

  const mobilePanelExpanded = useAppStore(
    (s) => s.state.ui.mobilePanelExpanded ?? false
  );

  // Grid layout — dynamic based on viewport + sidebar visibility.
  // Mobile (<638px): rows = editor / left / right / sidenav.
  // Desktop (≥638px): cols = sidenav | left | editor | right.
  const showRight = !hasDesktopFieldsPlugin && rightSideBarVisible;
  const sidenavWidth = hasLegacySideBarPlugin ? "0px" : "44px";
  const leftCol = mounted && leftSideBarVisible ? `${leftWidth || 250}px` : "0px";
  const rightCol = mounted && showRight ? `${rightWidth || 250}px` : "0px";

  const mobileLeftRow =
    leftSideBarVisible && mobilePanelHeightMode === "toggle"
      ? mobilePanelExpanded
        ? "55%"
        : "30%"
      : leftSideBarVisible && mobilePanelHeightMode === "min-content"
      ? "min-content"
      : "0";

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 638px)");
    setIsDesktop(mq.matches);
    const listener = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const gridStyle = isDesktop
    ? {
        gridTemplateAreas: '"sidenav left editor right"',
        gridTemplateColumns: `${sidenavWidth} ${leftCol} auto ${rightCol}`,
        gridTemplateRows: "auto",
      }
    : {
        gridTemplateAreas: '"editor" "left" "right" "sidenav"',
        gridTemplateColumns: "auto",
        gridTemplateRows: `auto ${mobileLeftRow} 0 ${sidenavWidth}`,
        transition: "grid-template-rows 150ms ease-in",
      };

  return (
    <div
      className={cn(
        "Editor overflow-x-hidden text-foreground font-sans",
        rootClassName
      )}
      id={instanceId}
      data-theme={theme}
      style={{ height, ...themeToCssVars(themeProp) }}
    >
      <DragDropContext disableAutoScroll={dnd?.disableAutoScroll}>
        <CustomEditor>
          {children || (
            <FrameProvider>
              <div className="h-dvh" style={{ height }}>
                <div
                  className="relative z-0 grid h-full overflow-hidden bg-background"
                  style={gridStyle}
                >
                  <div
                    className="w-full overflow-hidden border-t border-border bg-card sm:border-t-0 sm:border-r"
                    style={{ gridArea: "sidenav" }}
                  >
                    <Nav
                      items={pluginItems}
                      mobileActions={
                        leftSideBarVisible &&
                        mobilePanelHeightMode === "toggle" && (
                          <IconButton
                            type="button"
                            title="maximize"
                            onClick={() => {
                              setUi({
                                mobilePanelExpanded: !mobilePanelExpanded,
                              });
                            }}
                          >
                            {mobilePanelExpanded ? (
                              <Minimize2 size={21} />
                            ) : (
                              <Maximize2 size={21} />
                            )}
                          </IconButton>
                        )
                      }
                      footer={
                        <IconButton
                          type="button"
                          title={themeLabel}
                          onClick={toggleTheme}
                        >
                          {themeIcon}
                        </IconButton>
                      }
                    />
                  </div>
                  <Sidebar
                    position="left"
                    sidebarRef={leftSidebarRef}
                    isVisible={leftSideBarVisible}
                    onResize={setLeftWidth}
                    onResizeEnd={handleLeftSidebarResizeEnd}
                  >
                    {Object.entries(pluginItems).map(
                      ([id, { mobileOnly, render: Render, label }]) => (
                        <PluginTab
                          key={id}
                          visible={currentPlugin === id}
                          mobileOnly={mobileOnly}
                        >
                          <Render />
                        </PluginTab>
                      )
                    )}
                  </Sidebar>
                  <Canvas />
                  {!hasDesktopFieldsPlugin && (
                    <Sidebar
                      position="right"
                      sidebarRef={rightSidebarRef}
                      isVisible={rightSideBarVisible}
                      onResize={setRightWidth}
                      onResizeEnd={handleRightSidebarResizeEnd}
                    >
                      <FieldSideBar />
                    </Sidebar>
                  )}
                </div>
              </div>
            </FrameProvider>
          )}
        </CustomEditor>
      </DragDropContext>
      <div id="editor-portal-root" className="relative z-[2]" />
    </div>
  );
};
