import * as t from "@babel/types";
import type { Leaf, Node, NodeChild } from "../types/Node";

const identifierFromTypeName = (
  type: string
): t.JSXIdentifier | t.JSXMemberExpression => {
  const parts = type.split(".");
  if (parts.length === 1) return t.jsxIdentifier(parts[0]);
  let current: t.JSXMemberExpression | t.JSXIdentifier = t.jsxIdentifier(
    parts[0]
  );
  for (let i = 1; i < parts.length; i++) {
    current = t.jsxMemberExpression(current, t.jsxIdentifier(parts[i]));
  }
  return current;
};

const leafToExpression = (value: Leaf): t.Expression => {
  if (value === null) return t.nullLiteral();
  if (value === undefined) return t.identifier("undefined");
  if (typeof value === "string") return t.stringLiteral(value);
  if (typeof value === "number") return t.numericLiteral(value);
  if (typeof value === "boolean") return t.booleanLiteral(value);
  if (Array.isArray(value)) {
    return t.arrayExpression(value.map((v) => leafToExpression(v)));
  }
  // Object leaf.
  const props: t.ObjectProperty[] = [];
  for (const [k, v] of Object.entries(value)) {
    props.push(
      t.objectProperty(
        /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? t.identifier(k) : t.stringLiteral(k),
        leafToExpression(v)
      )
    );
  }
  return t.objectExpression(props);
};

const attributeFromProp = (name: string, value: Leaf): t.JSXAttribute => {
  const attrName = t.jsxIdentifier(name);
  // Boolean true collapses to shorthand `attr`. Everything else renders via
  // string literal or expression container.
  if (value === true) return t.jsxAttribute(attrName, null);
  if (typeof value === "string") {
    return t.jsxAttribute(attrName, t.stringLiteral(value));
  }
  return t.jsxAttribute(
    attrName,
    t.jsxExpressionContainer(leafToExpression(value))
  );
};

const attributeFromSlot = (
  name: string,
  children: NodeChild[]
): t.JSXAttribute => {
  const attrName = t.jsxIdentifier(name);
  if (children.length === 1) {
    const only = children[0];
    if (typeof only === "string") {
      return t.jsxAttribute(attrName, t.stringLiteral(only));
    }
    return t.jsxAttribute(
      attrName,
      t.jsxExpressionContainer(nodeToJsxElement(only))
    );
  }
  // Multiple children in a named slot → array literal of JSX elements.
  const exprs: (t.Expression | t.StringLiteral)[] = children.map((c) =>
    typeof c === "string" ? t.stringLiteral(c) : nodeToJsxElement(c)
  );
  return t.jsxAttribute(
    attrName,
    t.jsxExpressionContainer(t.arrayExpression(exprs))
  );
};

const childrenToJsx = (
  children: NodeChild[]
): Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer> => {
  return children.map((c) =>
    typeof c === "string"
      ? t.jsxText(c)
      : nodeToJsxElement(c)
  );
};

export const nodeToJsxElement = (node: Node): t.JSXElement => {
  const openingName = identifierFromTypeName(node.type);
  const closingName = identifierFromTypeName(node.type);

  const attributes: t.JSXAttribute[] = [];
  for (const [k, v] of Object.entries(node.props)) {
    if (v === undefined) continue;
    attributes.push(attributeFromProp(k, v));
  }
  // Slots other than "children" become attribute JSX.
  for (const [slotName, slotChildren] of Object.entries(node.slots)) {
    if (slotName === "children") continue;
    if (!slotChildren || slotChildren.length === 0) continue;
    attributes.push(attributeFromSlot(slotName, slotChildren));
  }

  const bodyChildren = node.slots.children ?? [];
  const selfClosing = bodyChildren.length === 0;

  return t.jsxElement(
    t.jsxOpeningElement(openingName, attributes, selfClosing),
    selfClosing ? null : t.jsxClosingElement(closingName),
    selfClosing ? [] : childrenToJsx(bodyChildren),
    selfClosing
  );
};

export const nodeToFragmentOrElement = (
  roots: Node | Node[]
): t.JSXElement | t.JSXFragment => {
  if (!Array.isArray(roots)) return nodeToJsxElement(roots);
  if (roots.length === 1) return nodeToJsxElement(roots[0]);
  return t.jsxFragment(
    t.jsxOpeningFragment(),
    t.jsxClosingFragment(),
    roots.map((r) => nodeToJsxElement(r))
  );
};
