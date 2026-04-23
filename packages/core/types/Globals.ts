/**
 * Shared state for components whose config has `global: true`. Keyed by
 * component type. Every instance of a global-marked component renders from
 * its entry in this map instead of its own props (except `children`, which
 * is always extrinsic).
 *
 * There is exactly one entry per component type. Multiple named variants of
 * the same component type are not supported in this shape — deliberately, to
 * avoid introducing references / IDs.
 */
export type GlobalData = Record<
  string,
  {
    props: Record<string, any>;
  }
>;
