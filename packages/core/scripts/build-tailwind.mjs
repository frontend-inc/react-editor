#!/usr/bin/env node
// Pre-compile Tailwind v4 + scope its output to .react-editor so the editor's
// preflight, utilities, and --color-* bindings never leak to the host.
//
// Two outputs:
//   styles/.editor-theme.generated.css — host-overridable --editor-* tokens
//                                        at :root and .dark (NOT scoped)
//   styles/.tailwind.generated.css     — Tailwind preflight + utilities,
//                                        scoped under .react-editor

import fs from "fs";
import path from "path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const SCOPE = ".react-editor";
const root = path.resolve(import.meta.dirname, "..");

// Pass-through copy of editor-theme.css. Stays at :root so host can
// override --editor-* tokens with higher-specificity rules.
fs.copyFileSync(
  path.join(root, "styles/editor-theme.css"),
  path.join(root, "styles/.editor-theme.generated.css")
);

// Run Tailwind on the utility entrypoint.
const twSrc = path.join(root, "styles/tailwind.css");
const twResult = await postcss([tailwindcss()]).process(
  fs.readFileSync(twSrc, "utf8"),
  { from: twSrc }
);

// Scope every selector under .react-editor so utilities + preflight only
// apply inside the editor subtree. :root, :host (from Tailwind's @theme
// block) become .react-editor so the --color-* bindings live inside our
// scope and resolve to the cascaded --editor-* values from :root.
const scoped = await postcss([
  {
    postcssPlugin: "scope-to-editor",
    Once(rootNode) {
      rootNode.walkRules((rule) => {
        // Don't touch rules inside @keyframes (selectors are 0%, 100%, etc.)
        if (
          rule.parent &&
          rule.parent.type === "atrule" &&
          /^(-\w+-)?keyframes$/.test(rule.parent.name)
        ) {
          return;
        }

        // Already scoped? skip.
        const scopeRe = new RegExp(`\\${SCOPE}(\\s|,|\\.|:|$)`);
        if (scopeRe.test(rule.selector)) return;

        rule.selectors = rule.selectors.map((sel) => {
          const trimmed = sel.trim();
          if (trimmed === ":root" || trimmed === ":host") return SCOPE;
          if (trimmed === "html" || trimmed === "body") return SCOPE;
          return `${SCOPE} ${trimmed}`;
        });
      });
    },
  },
]).process(twResult.css, { from: twSrc });

const out = path.join(root, "styles/.tailwind.generated.css");
fs.writeFileSync(out, scoped.css);
console.log(
  `[tailwind] scoped to ${SCOPE} -> ${path.relative(root, out)} (${scoped.css.length}b)`
);
