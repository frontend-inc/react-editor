export const DEFAULT_LABELS: Record<string, string> = {
  getConfig: "Reading config…",
  getSchema: "Reading schema…",
  updateSchema: "Updating schema…",
  updateRootProps: "Updating root props…",
  getComponent: "Reading component…",
  searchComponents: "Searching components…",
  updateComponent: "Updating component…",
  addComponent: "Adding component…",
  removeComponent: "Removing component…",
  moveComponent: "Moving component…",
};

export const humanize = (name: string) =>
  name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim() + "…";

export const labelFor = (name: string, _args?: unknown) =>
  DEFAULT_LABELS[name] ?? humanize(name);
