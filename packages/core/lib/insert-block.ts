import { ComponentData, ComponentDataOptionalId, Config } from "../types";
import { InsertTreeAction } from "../reducer";
import { useAppStoreApi } from "../store";
import { generateId } from "./generate-id";
import { populateIds } from "./data/populate-ids";
import { resolveFieldDefaults } from "./resolve-field-defaults";

function toRoots(
  content: ComponentDataOptionalId | ComponentDataOptionalId[]
): ComponentDataOptionalId[] {
  return Array.isArray(content) ? content : [content];
}

// Merge field defaults under authored props at every node in the subtree.
// Authors only spell what they want to override; missing props come from
// each component's `fields.<x>.default`.
function applyDefaultsDeep(
  node: ComponentDataOptionalId,
  config: Config
): ComponentDataOptionalId {
  const componentConfig = config.components[node.type as string];
  const fieldDefaults = resolveFieldDefaults(componentConfig?.fields);

  const mergedProps: Record<string, any> = {
    ...fieldDefaults,
    ...(node.props ?? {}),
  };

  for (const [key, value] of Object.entries(mergedProps)) {
    if (Array.isArray(value)) {
      mergedProps[key] = value.map((child) =>
        child &&
        typeof child === "object" &&
        "type" in child &&
        "props" in child
          ? applyDefaultsDeep(child as ComponentDataOptionalId, config)
          : child
      );
    }
  }

  return { ...node, props: mergedProps as ComponentDataOptionalId["props"] };
}

export const insertBlock = async (
  blockName: string,
  zone: string,
  index: number,
  appStore: ReturnType<typeof useAppStoreApi>
) => {
  const { getState } = appStore;
  const state = getState();
  const config = state.config;

  const block = config.blocks?.[blockName];
  if (!block) {
    console.warn(`insertBlock: no block named "${blockName}" in config.blocks`);
    return;
  }

  // Normalize shorthand → composite. Both flow through applyDefaultsDeep so
  // missing props everywhere in the tree fill in from field defaults.
  let roots: ComponentDataOptionalId[];
  if ("component" in block && block.component) {
    roots = [
      { type: block.component as string, props: (block.props ?? {}) as any },
    ];
  } else if ("content" in block && block.content) {
    roots = toRoots(block.content);
  } else {
    return;
  }

  // Walk each root: merge defaults at every node, then regenerate all ids so
  // repeat drops never collide.
  const prepared: ComponentData[] = roots.map((root) => {
    const withDefaults = applyDefaultsDeep(root, config);
    const withId = {
      ...withDefaults,
      props: { ...withDefaults.props, id: generateId(withDefaults.type) },
    } as ComponentData;
    return populateIds(withId, config, true);
  });

  const insertActionData: InsertTreeAction = {
    type: "insertTree",
    destinationIndex: index,
    destinationZone: zone,
    nodes: prepared,
  };

  const dispatch = getState().dispatch;
  dispatch({ ...insertActionData, recordHistory: true });

  // Select the first inserted root.
  dispatch({ type: "setUi", ui: { itemSelector: { index, zone } } });
};
