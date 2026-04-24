import { PanelBottom } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Footer: Block<Components> = {
  label: "Footer",
  icon: <PanelBottom size={16} />,
  category: "navigation",
  component: "Footer",
  props: {
    brand: "react-editor",
    tagline: "A visual editor for your React components.",
    columns: [
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Changelog", href: "#" },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Docs", href: "#" },
          { label: "Guides", href: "#" },
          { label: "GitHub", href: "#" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
    ],
    copyright: "© 2026 react-editor. All rights reserved.",
    social: [
      { platform: "twitter", href: "#" },
      { platform: "github", href: "#" },
      { platform: "linkedin", href: "#" },
    ],
  },
};
