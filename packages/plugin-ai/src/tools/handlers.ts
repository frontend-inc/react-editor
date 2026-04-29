import type { EditorApi, EditorAction, ComponentData } from "@reacteditor/core";
import { z } from "zod";
import { schemas, type BuiltinName } from "./definitions";
import { serializeConfig } from "./schema";

// `useGetEditor()` returns a function that reads the latest API. We accept
// that function so handlers always operate on the freshest state — important
// when several mutations chain inside one assistant turn.
type GetEditor = () => EditorApi;

const ROOT_DROPPABLE_ID = "root:default-zone";

const resolveZone = (
  getEditor: GetEditor,
  parentId?: string,
  slot?: string
): string => {
  if (!parentId) return ROOT_DROPPABLE_ID;
  // Slots on a component live at "<componentId>:<slotName>". With no slot
  // specified we fall back to the parent's default zone.
  return `${parentId}:${slot ?? "default-zone"}`;
};

const summarizeComponent = (data: ComponentData) => ({
  id: data.props?.id,
  type: data.type,
  props: data.props,
});

export type Handler<Name extends BuiltinName> = (
  args: z.infer<(typeof schemas)[Name]>,
  ctx: { getEditor: GetEditor; dispatch: (a: EditorAction) => void }
) => unknown | Promise<unknown>;

export const handlers: { [K in BuiltinName]: Handler<K> } = {
  getConfig: (_args, { getEditor }) => serializeConfig(getEditor().config),

  getSchema: (_args, { getEditor }) => {
    const { data } = getEditor().appState;
    // zones is deprecated — exclude
    return { root: data.root, content: data.content, globals: data.globals };
  },

  updateSchema: (args, { dispatch }) => {
    dispatch({
      type: "setData",
      data: (prev) => ({
        ...prev,
        ...(args.root ? { root: { ...prev.root, ...args.root } } : {}),
        ...(args.content ? { content: args.content as never } : {}),
        ...(args.globals ? { globals: args.globals as never } : {}),
      }),
      recordHistory: true,
    });
    return { ok: true };
  },

  updateRootProps: (args, { getEditor, dispatch }) => {
    const root = getEditor().appState.data.root;
    dispatch({
      type: "replaceRoot",
      root: { ...root, props: { ...(root.props ?? {}), ...args.props } },
    });
    return { ok: true };
  },

  getComponent: (args, { getEditor }) => {
    const item = getEditor().getItemById(args.id);
    if (!item) return { error: "not_found", id: args.id };
    return summarizeComponent(item);
  },

  searchComponents: (args, { getEditor }) => {
    const { data } = getEditor().appState;
    const items: ComponentData[] = [];
    const walk = (list: ComponentData[]) => {
      for (const node of list) items.push(node);
    };
    walk(data.content as ComponentData[]);

    let results = items;
    if (args.type) results = results.filter((c) => c.type === args.type);
    if (args.query) {
      const q = args.query.toLowerCase();
      results = results.filter((c) =>
        JSON.stringify(c.props ?? {})
          .toLowerCase()
          .includes(q)
      );
    }
    return results.map(summarizeComponent);
  },

  updateComponent: (args, { getEditor, dispatch }) => {
    const editor = getEditor();
    const selector = editor.getSelectorForId(args.id);
    if (!selector) return { error: "not_found", id: args.id };
    const item = editor.getItemById(args.id);
    if (!item) return { error: "not_found", id: args.id };

    dispatch({
      type: "replace",
      destinationIndex: selector.index,
      destinationZone: selector.zone,
      data: {
        ...item,
        props: { ...item.props, ...args.props, id: args.id },
      },
      recordHistory: true,
    } as EditorAction);
    return { ok: true, id: args.id };
  },

  addComponent: (args, { getEditor, dispatch }) => {
    const editor = getEditor();
    const zone = resolveZone(getEditor, args.parentId, args.slot);
    const id = `${args.type}-${Math.random().toString(36).slice(2, 10)}`;

    // Determine the index — default to appending to the destination.
    const data = editor.appState.data;
    const targetList =
      args.parentId == null
        ? (data.content as ComponentData[])
        : ((data.zones?.[zone] as ComponentData[] | undefined) ?? []);
    const index = args.index ?? targetList.length;

    dispatch({
      type: "insert",
      componentType: args.type,
      destinationIndex: index,
      destinationZone: zone,
      id,
      recordHistory: true,
    } as EditorAction);

    if (args.props) {
      const item = editor.getItemById(id);
      if (item) {
        dispatch({
          type: "replace",
          destinationIndex: index,
          destinationZone: zone,
          data: { ...item, props: { ...item.props, ...args.props, id } },
          recordHistory: false,
        } as EditorAction);
      }
    }

    return { ok: true, id };
  },

  removeComponent: (args, { getEditor, dispatch }) => {
    const selector = getEditor().getSelectorForId(args.id);
    if (!selector) return { error: "not_found", id: args.id };
    dispatch({
      type: "remove",
      index: selector.index,
      zone: selector.zone,
      recordHistory: true,
    } as EditorAction);
    return { ok: true, id: args.id };
  },

  moveComponent: (args, { getEditor, dispatch }) => {
    const editor = getEditor();
    const source = editor.getSelectorForId(args.id);
    if (!source) return { error: "not_found", id: args.id };
    const destinationZone = resolveZone(getEditor, args.parentId, args.slot);
    dispatch({
      type: "move",
      sourceIndex: source.index,
      sourceZone: source.zone,
      destinationIndex: args.index,
      destinationZone,
      recordHistory: true,
    } as EditorAction);
    return { ok: true, id: args.id };
  },
};

export const callBuiltin = async (
  name: string,
  rawArgs: unknown,
  ctx: { getEditor: GetEditor; dispatch: (a: EditorAction) => void }
): Promise<unknown> => {
  if (!(name in schemas)) return undefined; // not a built-in
  const key = name as BuiltinName;
  const parsed = schemas[key].safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return {
      error: "invalid_arguments",
      issues: parsed.error.issues,
    };
  }
  return await (handlers[key] as Handler<BuiltinName>)(parsed.data, ctx);
};
