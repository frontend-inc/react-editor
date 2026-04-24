import { MousePointerClick } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Button: Block<Components> = {
  label: "Button",
  icon: <MousePointerClick size={16} />,
  category: "elements",
  component: "Button",
};
