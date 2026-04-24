#!/usr/bin/env node
// One-shot migration: rewrite --re-* references in CSS modules to the new
// Tailwind-v4-exposed editor tokens. After this runs, no file references
// --re-* anymore and the editor renders using the shadcn-style token system.

import fs from "fs";
import { execSync } from "child_process";

// Map from legacy --re-* var to its semantic replacement. Values use
// var(--color-*) because Tailwind v4's @theme makes those class-neutral
// (bg-background / text-foreground use the same vars).
const MAP = {
  // Surfaces
  "--re-surface-app": "var(--color-background)",
  "--re-surface-panel": "var(--color-card)",
  "--re-surface-raised": "var(--color-popover)",
  "--re-surface-sunken": "var(--color-muted)",
  "--re-surface-hover":
    "color-mix(in oklch, var(--color-accent) 10%, transparent)",

  // Text
  "--re-text-primary": "var(--color-foreground)",
  "--re-text-secondary": "var(--color-muted-foreground)",
  "--re-text-tertiary": "var(--color-muted-foreground)",
  "--re-text-inverse": "var(--color-primary-foreground)",
  "--re-text-accent": "var(--color-accent)",

  // Brand
  "--re-accent": "var(--color-accent)",
  "--re-accent-strong": "var(--color-accent)",
  "--re-accent-soft":
    "color-mix(in oklch, var(--color-accent) 12%, transparent)",
  "--re-primary": "var(--color-primary)",
  "--re-primary-hover":
    "color-mix(in oklch, var(--color-primary) 90%, black)",
  "--re-primary-foreground": "var(--color-primary-foreground)",

  // Borders (collapsed to one)
  "--re-border-subtle": "var(--color-border)",
  "--re-border-default": "var(--color-border)",
  "--re-border-strong": "var(--color-border)",

  // Ring
  "--re-ring-color": "var(--color-ring)",
  "--re-ring":
    "0 0 0 2px color-mix(in oklch, var(--color-ring) 50%, transparent)",
  "--re-ring-width": "2px",
  "--re-ring-offset": "2px",

  // Radius — use Tailwind v4 --radius scale (host-inherited)
  "--re-radius-sm": "calc(var(--radius) - 4px)",
  "--re-radius-md": "var(--radius)",
  "--re-radius-lg": "calc(var(--radius) + 2px)",
  "--re-radius-xl": "calc(var(--radius) + 6px)",

  // Shadow — use Tailwind v4 --shadow scale (host-inherited)
  "--re-shadow-sm": "var(--shadow-sm)",
  "--re-shadow-md": "var(--shadow)",
  "--re-shadow-lg": "var(--shadow-lg)",
  "--re-shadow-xl": "var(--shadow-xl)",

  // Motion / ease
  "--re-motion-fast": "120ms",
  "--re-motion-base": "150ms",
  "--re-motion-slow": "220ms",
  "--re-ease": "cubic-bezier(0.2, 0, 0.1, 1)",

  // Font family / spacing — host inherits
  "--re-font-family": "var(--font-sans)",
  "--re-font-family-monospaced": "var(--font-mono)",
  "--re-space-px": "16px",

  // Font sizes — approximate mapping to Tailwind scale
  "--re-font-size-xxxs": "0.75rem",
  "--re-font-size-xxs": "0.875rem",
  "--re-font-size-xs": "1rem",
  "--re-font-size-s": "1.125rem",
  "--re-font-size-m": "1.3125rem",
  "--re-font-size-l": "1.5rem",
  "--re-font-size-xl": "1.75rem",
  "--re-font-size-xxl": "2.25rem",
  "--re-font-size-xxxl": "3rem",
  "--re-font-size-xxxxl": "3.5rem",
  "--re-font-size-base": "1rem",

  // Global (editor-specific purple for global components)
  "--re-color-global": "#7c3aed",
  "--re-color-global-strong": "#5b21b6",
  "--re-color-global-soft": "#f3e8ff",

  // Palette — collapsed to semantic fallbacks where possible
  "--re-color-grey-01": "var(--color-foreground)",
  "--re-color-grey-02": "var(--color-foreground)",
  "--re-color-grey-03": "var(--color-muted-foreground)",
  "--re-color-grey-04": "var(--color-muted-foreground)",
  "--re-color-grey-05": "var(--color-muted-foreground)",
  "--re-color-grey-06": "var(--color-muted-foreground)",
  "--re-color-grey-07": "var(--color-border)",
  "--re-color-grey-08": "var(--color-border)",
  "--re-color-grey-09": "var(--color-border)",
  "--re-color-grey-10": "var(--color-muted)",
  "--re-color-grey-11": "var(--color-muted)",
  "--re-color-grey-12": "var(--color-background)",
  "--re-color-azure-01": "#00175d",
  "--re-color-azure-02": "#002c77",
  "--re-color-azure-03": "#014292",
  "--re-color-azure-04": "var(--color-accent)",
  "--re-color-azure-05": "var(--color-accent)",
  "--re-color-azure-06": "var(--color-accent)",
  "--re-color-azure-07": "var(--color-accent)",
  "--re-color-azure-08":
    "color-mix(in oklch, var(--color-accent) 50%, transparent)",
  "--re-color-azure-09":
    "color-mix(in oklch, var(--color-accent) 30%, transparent)",
  "--re-color-azure-10":
    "color-mix(in oklch, var(--color-accent) 20%, transparent)",
  "--re-color-azure-11":
    "color-mix(in oklch, var(--color-accent) 12%, transparent)",
  "--re-color-azure-12":
    "color-mix(in oklch, var(--color-accent) 8%, transparent)",
  "--re-color-red-01": "var(--color-destructive)",
  "--re-color-red-02": "var(--color-destructive)",
  "--re-color-red-03": "var(--color-destructive)",
  "--re-color-red-04": "var(--color-destructive)",
  "--re-color-red-05": "var(--color-destructive)",
  "--re-color-red-06": "var(--color-destructive)",
  "--re-color-red-07":
    "color-mix(in oklch, var(--color-destructive) 60%, transparent)",
  "--re-color-red-08":
    "color-mix(in oklch, var(--color-destructive) 40%, transparent)",
  "--re-color-red-09":
    "color-mix(in oklch, var(--color-destructive) 25%, transparent)",
  "--re-color-red-10":
    "color-mix(in oklch, var(--color-destructive) 15%, transparent)",
  "--re-color-red-11":
    "color-mix(in oklch, var(--color-destructive) 10%, transparent)",
  "--re-color-red-12":
    "color-mix(in oklch, var(--color-destructive) 5%, transparent)",
  "--re-color-green-04": "#0c680c",
  "--re-color-green-05": "#1d882f",
  "--re-color-green-11": "#eff8f0",
  "--re-color-yellow-04": "#645a00",
  "--re-color-yellow-11": "#f9f7ed",
  "--re-color-rose-04": "#a81a66",
  "--re-color-rose-05": "#bc5089",
  "--re-color-rose-06": "#cc7ca5",
  "--re-color-rose-11": "#faf4f8",
  "--re-color-white": "white",
  "--re-color-black": "black",

  // Sidebar width vars (used by Layout grid) — kept as var names but
  // renamed so they don't reference --re-*.
  "--re-side-bar-width": "var(--editor-side-bar-width, 250px)",
  "--re-left-side-bar-width": "var(--editor-left-side-bar-width, 250px)",
  "--re-right-side-bar-width": "var(--editor-right-side-bar-width, 250px)",
  "--re-side-nav-width": "var(--editor-side-nav-width, 44px)",
  "--re-user-left-side-bar-width": "var(--editor-user-left-side-bar-width)",
  "--re-user-right-side-bar-width": "var(--editor-user-right-side-bar-width)",
  "--re-frame-width": "var(--editor-frame-width, auto)",
};

// Collect all .module.css files
const files = execSync(
  "find packages/core/components -name '*.module.css' -not -path '*node_modules*'",
  { encoding: "utf8" }
)
  .trim()
  .split("\n")
  .filter(Boolean);

let replaced = 0;
let filesChanged = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const before = content;

  // Replace var(--re-X) -> mapped replacement. Use a regex to catch all.
  content = content.replace(
    /var\(\s*(--re-[a-z0-9-]+)(\s*,[^)]*)?\s*\)/g,
    (match, name) => {
      if (MAP[name] !== undefined) {
        replaced++;
        return MAP[name];
      }
      console.warn(`[migrate] unmapped: ${name} in ${file}`);
      return match;
    }
  );

  // Replace bare --re-X identifiers (in calc(), in selectors, etc.)
  content = content.replace(/--re-[a-z0-9-]+/g, (match) => {
    if (MAP[match] !== undefined) {
      replaced++;
      // If the replacement starts with "var(", strip the wrapper for bare use.
      const repl = MAP[match];
      const bareMatch = repl.match(/^var\((--[a-z0-9-]+)[^)]*\)$/);
      return bareMatch ? bareMatch[1] : repl;
    }
    console.warn(`[migrate] unmapped bare: ${match} in ${file}`);
    return match;
  });

  if (content !== before) {
    fs.writeFileSync(file, content);
    filesChanged++;
  }
}

console.log(`[migrate] ${filesChanged} files changed, ${replaced} references rewritten`);
