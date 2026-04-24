#!/usr/bin/env node
// Pre-compile Tailwind v4 + editor theme into a flat CSS file before tsup
// runs. esbuild's CSS bundler doesn't route imports through our plugin
// system, so we produce the Tailwind output ahead of time as a plain CSS
// file that tsup can bundle without any special handling.

import fs from "fs";
import path from "path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "styles/tailwind.css");
const out = path.join(root, "styles/.tailwind.generated.css");

const source = fs.readFileSync(src, "utf8");
const result = await postcss([tailwindcss()]).process(source, { from: src });
fs.writeFileSync(out, result.css);
console.log(`[tailwind] ${src} -> ${out} (${result.css.length}b)`);
