import type {
  Expression,
  JSXAttribute,
  JSXElement,
  JSXFragment,
  JSXMemberExpression,
  JSXNamespacedName,
  ObjectExpression,
  ArrayExpression,
  ObjectProperty,
} from "@babel/types";
import { generateId } from "../lib/generate-id";
import type { Leaf, Node, NodeChild } from "../types/Node";

export type AstToNodeOptions = {
  components: Record<string, unknown>;
};

export class ParseError extends Error {
  constructor(message: string, public readonly loc?: { line: number; column: number }) {
    super(loc ? `${message} (at ${loc.line}:${loc.column})` : message);
    this.name = "ParseError";
  }
}

const typeNameFromOpeningName = (
  name: JSXElement["openingElement"]["name"]
): string => {
  if (name.type === "JSXIdentifier") return name.name;
  if (name.type === "JSXMemberExpression")
    return `${memberExpressionToString(name)}`;
  // JSXNamespacedName — "xml:foo" style. Not supported in authoring.
  throw new ParseError(
    `Unsupported JSX tag form: ${name.type}`,
    "loc" in name && name.loc ? { line: name.loc.start.line, column: name.loc.start.column } : undefined
  );
};

const memberExpressionToString = (expr: JSXMemberExpression): string => {
  const object = expr.object;
  const property = expr.property.name;
  if (object.type === "JSXIdentifier") return `${object.name}.${property}`;
  return `${memberExpressionToString(object)}.${property}`;
};

const isCapitalized = (name: string) => /^[A-Z]/.test(name);

// Convert a JSXExpressionContainer's expression to either a Leaf prop value,
// a list of NodeChild slot entries, or throw.
const expressionToValue = (
  expr: Expression,
  opts: AstToNodeOptions
): { kind: "leaf"; value: Leaf } | { kind: "slot"; value: NodeChild[] } => {
  if (expr.type === "StringLiteral") return { kind: "leaf", value: expr.value };
  if (expr.type === "NumericLiteral") return { kind: "leaf", value: expr.value };
  if (expr.type === "BooleanLiteral") return { kind: "leaf", value: expr.value };
  if (expr.type === "NullLiteral") return { kind: "leaf", value: null };

  if (expr.type === "ObjectExpression") {
    return { kind: "leaf", value: objectExpressionToLeaf(expr, opts) };
  }

  if (expr.type === "ArrayExpression") {
    // Either all literals (leaf array) or all JSX elements (slot array).
    // Mixed content is rejected.
    const hasJsx = expr.elements.some(
      (el) => el && (el.type === "JSXElement" || el.type === "JSXFragment")
    );
    if (hasJsx) {
      const slotEntries: NodeChild[] = [];
      for (const el of expr.elements) {
        if (!el) continue;
        if (el.type === "JSXElement") slotEntries.push(jsxElementToNode(el, opts));
        else if (el.type === "JSXFragment")
          slotEntries.push(...jsxFragmentChildren(el, opts));
        else
          throw new ParseError(
            `Array prop mixes JSX and non-JSX values; pick one or the other.`,
            el.loc ? { line: el.loc.start.line, column: el.loc.start.column } : undefined
          );
      }
      return { kind: "slot", value: slotEntries };
    }
    return { kind: "leaf", value: arrayExpressionToLeaf(expr, opts) };
  }

  if (expr.type === "JSXElement") {
    return { kind: "slot", value: [jsxElementToNode(expr, opts)] };
  }

  if (expr.type === "JSXFragment") {
    return { kind: "slot", value: jsxFragmentChildren(expr, opts) };
  }

  throw new ParseError(
    `Unsupported expression in authoring JSX: ${expr.type}. Only literal values, object/array literals, and JSX elements are allowed.`,
    expr.loc ? { line: expr.loc.start.line, column: expr.loc.start.column } : undefined
  );
};

const objectExpressionToLeaf = (
  expr: ObjectExpression,
  opts: AstToNodeOptions
): { [key: string]: Leaf } => {
  const out: { [key: string]: Leaf } = {};
  for (const prop of expr.properties) {
    if (prop.type !== "ObjectProperty") {
      throw new ParseError(
        `Object spread and method shorthand aren't supported in authoring JSX.`,
        prop.loc ? { line: prop.loc.start.line, column: prop.loc.start.column } : undefined
      );
    }
    const p = prop as ObjectProperty;
    if (p.computed) {
      throw new ParseError(
        `Computed object keys aren't supported in authoring JSX.`,
        p.loc ? { line: p.loc.start.line, column: p.loc.start.column } : undefined
      );
    }
    let key: string;
    if (p.key.type === "Identifier") key = p.key.name;
    else if (p.key.type === "StringLiteral") key = p.key.value;
    else
      throw new ParseError(
        `Object key must be an identifier or string literal.`,
        p.key.loc ? { line: p.key.loc.start.line, column: p.key.loc.start.column } : undefined
      );
    const value = expressionToValue(p.value as Expression, opts);
    if (value.kind !== "leaf") {
      throw new ParseError(
        `Object values can't be JSX elements.`,
        p.loc ? { line: p.loc.start.line, column: p.loc.start.column } : undefined
      );
    }
    out[key] = value.value;
  }
  return out;
};

const arrayExpressionToLeaf = (
  expr: ArrayExpression,
  opts: AstToNodeOptions
): Leaf[] => {
  const out: Leaf[] = [];
  for (const el of expr.elements) {
    if (el == null) {
      out.push(null);
      continue;
    }
    if (el.type === "SpreadElement") {
      throw new ParseError(
        `Array spread isn't supported in authoring JSX.`,
        el.loc ? { line: el.loc.start.line, column: el.loc.start.column } : undefined
      );
    }
    const value = expressionToValue(el as Expression, opts);
    if (value.kind !== "leaf") {
      throw new ParseError(
        `Array values can't mix JSX elements with literals here.`,
        el.loc ? { line: el.loc.start.line, column: el.loc.start.column } : undefined
      );
    }
    out.push(value.value);
  }
  return out;
};

const attributeNameToString = (
  name: JSXAttribute["name"] | JSXNamespacedName
): string => {
  if (name.type === "JSXIdentifier") return name.name;
  // JSXNamespacedName — reject.
  throw new ParseError(
    `Namespaced JSX attributes aren't supported.`,
    name.loc ? { line: name.loc.start.line, column: name.loc.start.column } : undefined
  );
};

// Decode JSXText whitespace per React's rules: leading/trailing newlines collapse,
// a line of whitespace between elements is dropped entirely, single newlines inside
// text normalize to a single space.
const cleanJsxText = (raw: string): string => {
  const lines = raw.split(/\r\n|\n|\r/);
  const cleaned: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (i !== 0) line = line.replace(/^[\t ]+/, "");
    if (i !== lines.length - 1) line = line.replace(/[\t ]+$/, "");
    if (line) cleaned.push(line);
  }
  return cleaned.join(" ");
};

const jsxFragmentChildren = (
  fragment: JSXFragment,
  opts: AstToNodeOptions
): NodeChild[] => {
  const out: NodeChild[] = [];
  for (const child of fragment.children) {
    if (child.type === "JSXText") {
      const text = cleanJsxText(child.value);
      if (text) out.push(text);
    } else if (child.type === "JSXElement") {
      out.push(jsxElementToNode(child, opts));
    } else if (child.type === "JSXFragment") {
      out.push(...jsxFragmentChildren(child, opts));
    } else if (child.type === "JSXExpressionContainer") {
      if (child.expression.type === "JSXEmptyExpression") continue;
      const value = expressionToValue(child.expression as Expression, opts);
      if (value.kind === "leaf") {
        if (typeof value.value === "string") out.push(value.value);
        else if (typeof value.value === "number" || typeof value.value === "boolean")
          out.push(String(value.value));
        // null/undefined/objects as children: drop silently (React does too).
      } else {
        out.push(...value.value);
      }
    } else if (child.type === "JSXSpreadChild") {
      throw new ParseError(
        `JSX spread children aren't supported.`,
        child.loc ? { line: child.loc.start.line, column: child.loc.start.column } : undefined
      );
    }
  }
  return out;
};

export const jsxElementToNode = (
  element: JSXElement,
  opts: AstToNodeOptions
): Node => {
  const type = typeNameFromOpeningName(element.openingElement.name);

  if (!isCapitalized(type.split(".")[0])) {
    throw new ParseError(
      `<${type}> isn't allowed in authoring JSX. HTML tags belong inside a component's render function, not in the authoring surface. Register a component (e.g. ${type.charAt(0).toUpperCase()}${type.slice(1)}) and use it instead.`,
      element.loc ? { line: element.loc.start.line, column: element.loc.start.column } : undefined
    );
  }

  if (!(type in opts.components)) {
    throw new ParseError(
      `<${type}> isn't a registered component. Add it to the \`components\` prop of <ReactEditor>.`,
      element.loc ? { line: element.loc.start.line, column: element.loc.start.column } : undefined
    );
  }

  const props: Record<string, Leaf> = {};
  const slots: Record<string, NodeChild[]> = {};

  for (const attr of element.openingElement.attributes) {
    if (attr.type === "JSXSpreadAttribute") {
      throw new ParseError(
        `Spread attributes aren't supported in authoring JSX.`,
        attr.loc ? { line: attr.loc.start.line, column: attr.loc.start.column } : undefined
      );
    }
    const name = attributeNameToString(attr.name);
    if (attr.value == null) {
      props[name] = true;
      continue;
    }
    if (attr.value.type === "StringLiteral") {
      props[name] = attr.value.value;
      continue;
    }
    if (attr.value.type === "JSXExpressionContainer") {
      if (attr.value.expression.type === "JSXEmptyExpression") continue;
      const v = expressionToValue(attr.value.expression as Expression, opts);
      if (v.kind === "leaf") props[name] = v.value;
      else slots[name] = v.value;
      continue;
    }
    if (attr.value.type === "JSXElement") {
      slots[name] = [jsxElementToNode(attr.value, opts)];
      continue;
    }
    if (attr.value.type === "JSXFragment") {
      slots[name] = jsxFragmentChildren(attr.value, opts);
      continue;
    }
  }

  // Element children → slots.children.
  const childrenSlot: NodeChild[] = [];
  for (const child of element.children) {
    if (child.type === "JSXText") {
      const text = cleanJsxText(child.value);
      if (text) childrenSlot.push(text);
    } else if (child.type === "JSXElement") {
      childrenSlot.push(jsxElementToNode(child, opts));
    } else if (child.type === "JSXFragment") {
      childrenSlot.push(...jsxFragmentChildren(child, opts));
    } else if (child.type === "JSXExpressionContainer") {
      if (child.expression.type === "JSXEmptyExpression") continue;
      const v = expressionToValue(child.expression as Expression, opts);
      if (v.kind === "leaf") {
        if (typeof v.value === "string") childrenSlot.push(v.value);
        else if (typeof v.value === "number" || typeof v.value === "boolean")
          childrenSlot.push(String(v.value));
      } else {
        childrenSlot.push(...v.value);
      }
    } else if (child.type === "JSXSpreadChild") {
      throw new ParseError(
        `JSX spread children aren't supported.`,
        child.loc ? { line: child.loc.start.line, column: child.loc.start.column } : undefined
      );
    }
  }
  if (childrenSlot.length > 0) slots.children = childrenSlot;

  return {
    id: generateId(type),
    type,
    props,
    slots,
  };
};

// Entry point: produces a single Node or a list of sibling Nodes if the top-level
// expression is a fragment.
export const astToNode = (
  expr: Expression,
  opts: AstToNodeOptions
): Node | Node[] => {
  if (expr.type === "JSXElement") return jsxElementToNode(expr, opts);
  if (expr.type === "JSXFragment") {
    const children = jsxFragmentChildren(expr, opts);
    // Only Node children are valid at the root (no bare text siblings).
    const nodes: Node[] = [];
    for (const child of children) {
      if (typeof child === "string") {
        throw new ParseError(
          `Root-level text isn't allowed. Wrap in a component.`
        );
      }
      nodes.push(child);
    }
    return nodes;
  }
  throw new ParseError(
    `Expected a JSX element at the root, got ${expr.type}.`,
    expr.loc ? { line: expr.loc.start.line, column: expr.loc.start.column } : undefined
  );
};
