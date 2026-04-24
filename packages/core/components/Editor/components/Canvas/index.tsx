import { getBox } from "css-box-model";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppStore, useAppStoreApi } from "../../../../store";
import { BrowserBar } from "../../../BrowserBar";
import { Preview } from "../Preview";
import { Loader } from "../../../Loader";
import { useShallow } from "zustand/react/shallow";
import { useCanvasFrame } from "../../../../lib/frame-context";
import { usePropsContext } from "../..";
import { defaultViewports } from "../../../ViewportControls/default-viewports";
import { cn } from "../../../../lib/cn";

const TRANSITION_DURATION = 150;

export const Canvas = () => {
  const { frameRef } = useCanvasFrame();

  const { viewports: viewportOptions = defaultViewports, ui: uiProp } =
    usePropsContext();

  const {
    dispatch,
    overrides,
    setUi,
    zoomConfig,
    setZoomConfig,
    status,
    iframe,
    fullScreenCanvas,
  } = useAppStore(
    useShallow((s) => ({
      dispatch: s.dispatch,
      overrides: s.overrides,
      setUi: s.setUi,
      zoomConfig: s.zoomConfig,
      setZoomConfig: s.setZoomConfig,
      status: s.status,
      iframe: s.iframe,
      fullScreenCanvas: s.fullScreenCanvas,
    }))
  );
  const viewports = useAppStore((s) => s.state.ui.viewports);

  const [showTransition, setShowTransition] = useState(false);
  const isResizingRef = useRef(false);

  const defaultRender = useMemo<
    React.FunctionComponent<{ children?: ReactNode }>
  >(() => {
    const EditorDefault = ({ children }: { children?: ReactNode }) => (
      <>{children}</>
    );

    return EditorDefault;
  }, []);

  const CustomPreview = useMemo(
    () => overrides.preview || defaultRender,
    [overrides]
  );

  const getFrameDimensions = useCallback(() => {
    if (frameRef.current) {
      const frame = frameRef.current;

      const box = getBox(frame);

      return { width: box.contentBox.width, height: box.contentBox.height };
    }

    return { width: 0, height: 0 };
  }, [frameRef]);

  // Keep zoom at 100% and constrain root height to frame
  useEffect(() => {
    const { height: frameHeight } = getFrameDimensions();

    if (viewports.current.height === "auto") {
      setZoomConfig({ ...zoomConfig, zoom: 1, rootHeight: frameHeight });
    }
  }, [getFrameDimensions, setZoomConfig, viewports.current.height]);

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(true);
    }, 500);
  }, []);

  const appStoreApi = useAppStoreApi();

  // Select closest viewport on load
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't override if user has set a viewport
    if (uiProp?.viewports?.current) return;

    const viewportWidth = window.innerWidth;
    const frameWidth = frameRef.current?.getBoundingClientRect().width;

    if (!viewportWidth) return;
    if (!frameWidth) return;
    if (viewportOptions.length === 0) return;

    const fullWidthViewport = Object.values(viewportOptions).find(
      (v) => v.width === "100%"
    );

    const containsFullWidthViewport = !!fullWidthViewport;

    const viewportDifferences = Object.entries(viewportOptions)
      .filter(([_, value]) => value.width !== "100%")
      .map(([key, value]) => ({
        key,
        diff: Math.abs(
          viewportWidth -
            (typeof value.width === "string" ? viewportWidth : value.width)
        ),
        value,
      }))
      .sort((a, b) => (a.diff > b.diff ? 1 : -1));

    let closestViewport = viewportDifferences[0].value;

    // Select full width viewport if it exists, and the closest viewport is smaller than the window
    if (
      (closestViewport.width as number) < frameWidth &&
      containsFullWidthViewport
    ) {
      closestViewport = fullWidthViewport;
    }

    if (iframe.enabled) {
      const s = appStoreApi.getState();

      const appState = {
        state: {
          ...s.state,
          ui: {
            ...s.state.ui,
            viewports: {
              ...s.state.ui.viewports,

              current: {
                ...s.state.ui.viewports.current,
                height: closestViewport?.height || "auto",
                width: closestViewport?.width,
              },
            },
          },
        },
      };

      let history = s.history;

      if (s.history.histories.length === 1) {
        history = { ...history, histories: [appState] };
      }

      appStoreApi.setState({ ...appState, history });
    }
  }, [
    viewportOptions,
    frameRef.current,
    iframe,
    appStoreApi,
    uiProp?.viewports?.current,
  ]);

  const isReady =
    status === "READY" || !iframe.enabled || !iframe.waitForStyles;

  return (
    <div
      className={cn(
        "relative flex flex-col bg-muted p-4 overflow-auto xl:px-6 xl:py-6",
        fullScreenCanvas && "p-0 overflow-hidden xl:p-0"
      )}
      style={{ gridArea: "editor" }}
      onClick={(e) => {
        const el = e.target as Element;

        if (
          !el.hasAttribute("data-editor-component") &&
          !el.hasAttribute("data-editor-dropzone")
        ) {
          dispatch({
            type: "setUi",
            ui: { itemSelector: null },
            recordHistory: false,
          });
        }
      }}
    >
      <div
        className="relative flex h-full w-full min-w-[288px] justify-center"
        ref={frameRef}
      >
        <div
          className="box-content absolute inset-y-0 flex flex-col min-w-[321px] xl:min-w-0 origin-top"
          style={{
            width: iframe.enabled ? viewports.current.width : "100%",
            transition: showTransition
              ? `width ${TRANSITION_DURATION}ms ease-out`
              : "",
          }}
        >
          {iframe.enabled && (
            <div className="shrink-0 w-full">
              <BrowserBar
                onViewportChange={(viewport) => {
                  setShowTransition(true);
                  isResizingRef.current = true;

                  const uiViewport = {
                    ...viewport,
                    height: viewport.height || "auto",
                    zoom: 1,
                  };

                  setUi({
                    viewports: { ...viewports, current: uiViewport },
                  });
                }}
              />
            </div>
          )}
          <div
            className={cn(
              "flex-1 min-h-0 rounded-b-md bg-card shadow-lg outline outline-border",
              isReady ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            style={{
              height: zoomConfig.rootHeight,
              transform: iframe.enabled
                ? `scale(${zoomConfig.zoom})`
                : undefined,
              transition: showTransition
                ? `height ${TRANSITION_DURATION}ms ease-out, transform ${TRANSITION_DURATION}ms ease-out`
                : "",
              overflow: iframe.enabled ? undefined : "auto",
            }}
            suppressHydrationWarning
            id="editor-canvas-root"
            onTransitionEnd={() => {
              setShowTransition(false);
              isResizingRef.current = false;
            }}
          >
            <CustomPreview>
              <Preview />
            </CustomPreview>
          </div>
        </div>
        <div
          className={cn(
            "flex h-full items-center justify-center text-muted-foreground transition-opacity duration-300 ease-out",
            showLoader && !isReady ? "opacity-100" : "opacity-0",
            showLoader && isReady && "h-0 transition-none"
          )}
        >
          <Loader size={24} />
        </div>
      </div>
    </div>
  );
};
