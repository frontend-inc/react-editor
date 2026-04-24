import { Container as ContainerIcon } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Container: Block<Components> = {
  label: "Container",
  icon: <ContainerIcon size={16} />,
  category: "layout",
  component: "Container",
};
