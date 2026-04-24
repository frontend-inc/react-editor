import { Sparkles } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const FeatureCard: Block<Components> = {
  label: "Feature card",
  icon: <Sparkles size={16} />,
  category: "cards",
  component: "FeatureCard",
};
