import { Minus } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Section: Block<Components> = {
  label: "Section",
  icon: <Minus size={16} />,
  category: "layout",
  component: "Section",
};
