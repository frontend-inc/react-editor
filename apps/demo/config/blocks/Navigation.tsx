import { PanelTop } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Navigation: Block<Components> = {
  label: "Navigation",
  icon: <PanelTop size={16} />,
  category: "navigation",
  component: "Navigation",
  props: {
    brand: "react-editor",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Team", href: "#team" },
      { label: "Docs", href: "#docs" },
    ],
    cta: { label: "Start building", href: "#" },
  },
};
