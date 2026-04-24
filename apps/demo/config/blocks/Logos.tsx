import { Tag } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Logos: Block<Components> = {
  label: "Logos",
  icon: <Tag size={16} />,
  category: "sections",
  component: "Logos",
  props: {
    eyebrow: "Trusted by teams shipping fast",
    logos: [
      { alt: "Vercel", src: "https://cdn.simpleicons.org/vercel" },
      { alt: "Next.js", src: "https://cdn.simpleicons.org/nextdotjs" },
      { alt: "React", src: "https://cdn.simpleicons.org/react" },
      { alt: "TypeScript", src: "https://cdn.simpleicons.org/typescript" },
      { alt: "Tailwind", src: "https://cdn.simpleicons.org/tailwindcss" },
      { alt: "Radix", src: "https://cdn.simpleicons.org/radixui" },
    ],
    grayscale: "yes",
  },
};
