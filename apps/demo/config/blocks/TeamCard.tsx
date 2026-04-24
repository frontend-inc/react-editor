import { Users } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const TeamCard: Block<Components> = {
  label: "Team card",
  icon: <Users size={16} />,
  category: "cards",
  component: "TeamCard",
};
