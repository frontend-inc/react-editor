import { parseExpression } from "@babel/parser";
import type { Expression } from "@babel/types";
import { astToNode, ParseError } from "./ast-to-node";
import type { Node } from "../types/Node";

export { ParseError } from "./ast-to-node";

export type ParseOptions = {
  components: Record<string, unknown>;
};

export const parse = (jsx: string, opts: ParseOptions): Node | Node[] => {
  let expr: Expression;
  try {
    expr = parseExpression(jsx, {
      plugins: ["jsx", "typescript"],
      errorRecovery: false,
    });
  } catch (err) {
    const e = err as Error & {
      loc?: { line: number; column: number };
    };
    throw new ParseError(e.message, e.loc);
  }
  return astToNode(expr, opts);
};
