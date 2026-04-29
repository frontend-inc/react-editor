import { z } from "zod";

// Shared input schemas. Used to (a) register tools with the model on the
// server via reactEditorTools and (b) validate incoming arguments on the
// client before executing the built-in handler.

export const schemas = {
  getConfig: z.object({}),

  getSchema: z.object({}),

  updateSchema: z.object({
    root: z
      .object({ props: z.record(z.string(), z.unknown()).optional() })
      .optional(),
    content: z.array(z.unknown()).optional(),
    globals: z.record(z.string(), z.unknown()).optional(),
  }),

  updateRootProps: z.object({
    props: z.record(z.string(), z.unknown()),
  }),

  getComponent: z.object({
    id: z.string(),
  }),

  searchComponents: z.object({
    query: z.string().optional(),
    type: z.string().optional(),
  }),

  updateComponent: z.object({
    id: z.string(),
    props: z.record(z.string(), z.unknown()),
  }),

  addComponent: z.object({
    type: z.string(),
    props: z.record(z.string(), z.unknown()).optional(),
    parentId: z.string().optional(),
    slot: z.string().optional(),
    index: z.number().int().nonnegative().optional(),
  }),

  removeComponent: z.object({
    id: z.string(),
  }),

  moveComponent: z.object({
    id: z.string(),
    parentId: z.string().optional(),
    slot: z.string().optional(),
    index: z.number().int().nonnegative(),
  }),
};

export const descriptions: Record<keyof typeof schemas, string> = {
  getConfig:
    "Return the editor's component schema: every component type, its props (as JSON Schema), defaults, label, and category. Call this before adding or updating components so you write valid props.",
  getSchema:
    "Return the current document: { root, content, globals }. The root holds page-level props; content is the ordered array of components on the page.",
  updateSchema:
    "Replace the current document with the supplied { root, content, globals }. Prefer per-component tools when possible.",
  updateRootProps:
    "Merge the given props into the page's root props (e.g. title, meta).",
  getComponent: "Return the component with the given id, including its props.",
  searchComponents:
    "List components on the current page, optionally filtered by type or by a substring match against props.",
  updateComponent:
    "Update the props of the component with the given id. The provided props are merged into the existing props.",
  addComponent:
    "Insert a new component onto the page. parentId+slot pinpoints a slot on a parent component; omit them to append to the page root. index defaults to the end of the destination.",
  removeComponent: "Remove the component with the given id from the document.",
  moveComponent:
    "Move the component with the given id to a new position. parentId+slot pinpoints a slot on a parent; omit them to move to the page root.",
};

export type BuiltinName = keyof typeof schemas;
export const BUILTIN_NAMES = Object.keys(schemas) as BuiltinName[];

// Mutating tools dispatch through the editor reducer with a history step
// boundary so the user can undo a model action atomically. Read-only tools
// skip the boundary.
export const mutates: { [K in BuiltinName]: boolean } = {
  getConfig: false,
  getSchema: false,
  updateSchema: true,
  updateRootProps: true,
  getComponent: false,
  searchComponents: false,
  updateComponent: true,
  addComponent: true,
  removeComponent: true,
  moveComponent: true,
};
