import { Rocket } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const CTA: Block<Components> = {
  label: "CTA",
  icon: <Rocket size={16} />,
  category: "sections",
  component: "CTA",
  props: {
    heading: "Start shipping pages today",
    subheading: "Free for open source and side projects.",
    variant: "gradient",
    buttons: [
      { label: "Start building", href: "#", variant: "secondary" },
      { label: "Read the docs", href: "#", variant: "outline" },
    ],
  },
};
