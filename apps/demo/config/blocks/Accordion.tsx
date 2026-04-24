import { ListChecks } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Accordion: Block<Components> = {
  label: "Accordion",
  icon: <ListChecks size={16} />,
  category: "elements",
  component: "Accordion",
  props: {
    items: [
      {
        question: "How do I get started?",
        answer: "<p>Drag any block from the left sidebar onto the canvas.</p>",
      },
      {
        question: "Can I compose custom layouts?",
        answer:
          "<p>Yes — use Section, Container, Grid, Columns, Stack, and Row.</p>",
      },
    ],
    type: "single",
  },
};
