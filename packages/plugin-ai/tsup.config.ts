import { defineConfig } from "tsup";
import tsupconfig from "../tsup-config";

export default defineConfig({
  ...tsupconfig,
  external: [
    ...(tsupconfig.external as string[]),
    "ai",
    "@ai-sdk/react",
    "use-stick-to-bottom",
    "zod",
    "lucide-react",
  ],
});
