import { Columns as ColumnsIcon } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Columns: Block<Components> = {
  label: "Columns",
  icon: <ColumnsIcon size={16} />,
  category: "layout",
  component: "Columns",
  props: {
    items: [
      { span: "6", content: [] },
      { span: "6", content: [] },
    ],
    gap: "md",
  },
};
