import { ArrowDownUp } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Stack: Block<Components> = {
  label: "Stack",
  icon: <ArrowDownUp size={16} />,
  category: "layout",
  component: "Stack",
};
