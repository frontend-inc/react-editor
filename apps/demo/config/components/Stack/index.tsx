import { ComponentConfig, Slot } from "@/core";
import { Stack as StackComponent } from "@/components/stack";

export type StackProps = {
  gap: "none" | "sm" | "md" | "lg" | "xl";
  align: "start" | "center" | "end" | "stretch";
  content: Slot;
};

export const Stack: ComponentConfig<StackProps> = {
  fields: {
    gap: {
      type: "select",
      default: "md",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
    },
    align: {
      type: "radio",
      default: "stretch",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ gap, align, content }) => (
    <StackComponent gap={gap} align={align} content={content} />
  ),
};
