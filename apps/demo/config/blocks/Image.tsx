import { Image as ImageIcon } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Image: Block<Components> = {
  label: "Image",
  icon: <ImageIcon size={16} />,
  category: "elements",
  component: "Image",
  props: {
    src: "https://placehold.co/1600x900",
    alt: "Placeholder image",
  },
};
