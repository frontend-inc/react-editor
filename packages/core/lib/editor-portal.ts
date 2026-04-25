export const getEditorPortalContainer = (): HTMLElement | undefined => {
  if (typeof document === "undefined") return undefined;
  return document.getElementById("editor-portal-root") ?? undefined;
};
