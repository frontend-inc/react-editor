import { defineConfig } from "tsup";
import tsupconfig from "../tsup-config";

export default defineConfig({
  ...tsupconfig,
  external: [
    ...(tsupconfig.external as string[]),
    "ai",
    "@ai-sdk/react",
    "react-markdown",
    "remark-gfm",
    "use-stick-to-bottom",
    "zod",
    "lucide-react",
  ],
});
