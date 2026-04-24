import { AlignHorizontalJustifyStart } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Row: Block<Components> = {
  label: "Row",
  icon: <AlignHorizontalJustifyStart size={16} />,
  category: "layout",
  component: "Row",
};
