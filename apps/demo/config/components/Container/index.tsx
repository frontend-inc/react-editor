import { ComponentConfig, Slot } from "@/core";
import { Container as ContainerComponent } from "@/components/container";

export type ContainerProps = {
  maxWidth: "sm" | "md" | "lg" | "xl" | "prose" | "full";
  paddingX: "none" | "sm" | "md" | "lg";
  content: Slot;
};

export const Container: ComponentConfig<ContainerProps> = {
  fields: {
    maxWidth: {
      type: "select",
      default: "xl",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
        { label: "Prose", value: "prose" },
        { label: "Full", value: "full" },
      ],
    },
    paddingX: {
      type: "select",
      default: "md",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    content: { type: "slot" },
  },
  render: ({ maxWidth, paddingX, content }) => (
    <ContainerComponent
      maxWidth={maxWidth}
      paddingX={paddingX}
      content={content}
    />
  ),
};
