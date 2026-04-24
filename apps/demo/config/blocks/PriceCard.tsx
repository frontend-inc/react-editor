import { CreditCard } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const PriceCard: Block<Components> = {
  label: "Price card",
  icon: <CreditCard size={16} />,
  category: "cards",
  component: "PriceCard",
};
