import { Rocket } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Hero: Block<Components> = {
  label: "Hero",
  icon: <Rocket size={16} />,
  category: "sections",
  component: "Hero",
  props: {
    eyebrow: "v2 · Visual editing for React",
    title: "Ship pages at the speed of thought",
    subtitle:
      "A drag-and-drop editor for your own React components. Own your data, keep your stack, extend anything.",
    primaryCta: { label: "Start building", href: "#" },
    secondaryCta: { label: "See components", href: "#" },
    align: "center",
    media: [],
  },
};
