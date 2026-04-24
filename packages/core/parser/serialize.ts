import generate from "@babel/generator";
import { nodeToFragmentOrElement } from "./node-to-ast";
import type { Node } from "../types/Node";

export type SerializeOptions = {
  jsxQuotes?: "single" | "double";
};

const gen = (generate as unknown as { default?: typeof generate }).default ?? generate;

export const serialize = (
  roots: Node | Node[],
  opts: SerializeOptions = {}
): string => {
  const ast = nodeToFragmentOrElement(roots);
  const result = gen(
    ast,
    {
      retainLines: false,
      compact: false,
      jsescOption: { minimal: true },
      jsxBracketSameLine: false,
    } as Parameters<typeof gen>[1]
  );
  return result.code;
};
