import { LayoutTemplate } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Features: Block<Components> = {
  label: "Features",
  icon: <LayoutTemplate size={16} />,
  category: "sections",
  content: {
    type: "Features",
    props: {
      eyebrow: "Features",
      heading: "Everything you need to ship a page",
      subheading:
        "Composable primitives, rich fields, and a preview that mirrors production.",
      columns: "3",
      items: [
        {
          type: "FeatureCard" as const,
          props: {
            id: "seed-feature-1",
            icon: "sparkles",
            title: "Drag-and-drop authoring",
            description:
              "Compose pages from your own React components. Fields, validation, and rich text built in.",
            cta: { label: "", href: "" },
          },
        },
        {
          type: "FeatureCard" as const,
          props: {
            id: "seed-feature-2",
            icon: "zap",
            title: "Own your stack",
            description:
              "No vendor runtime. Ships as a React package and stores data as plain JSON.",
            cta: { label: "", href: "" },
          },
        },
        {
          type: "FeatureCard" as const,
          props: {
            id: "seed-feature-3",
            icon: "rocket",
            title: "Extensible end to end",
            description:
              "Plugins, custom fields, permission rules, and overrides for every editor surface.",
            cta: { label: "", href: "" },
          },
        },
      ],
    },
  },
};
