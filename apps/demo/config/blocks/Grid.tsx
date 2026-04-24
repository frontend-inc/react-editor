import { LayoutGrid } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Grid: Block<Components> = {
  label: "Grid",
  icon: <LayoutGrid size={16} />,
  category: "layout",
  component: "Grid",
};
