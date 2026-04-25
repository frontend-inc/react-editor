import { ComponentConfig, Slot } from "@/core";
import { ContainerIcon } from "lucide-react";
import { Container } from "./container";

export type ContainerProps = {
  maxWidth: "sm" | "md" | "lg" | "xl" | "prose" | "full";
  paddingX: "none" | "sm" | "md" | "lg";
  content: Slot;
};

export const containerEditor: ComponentConfig<ContainerProps> = {
  label: "Container",
  icon: <ContainerIcon size={16} />,
  category: "layout",
  defaultProps: {
    maxWidth: "xl",
    paddingX: "md",
    content: [],
  },
  fields: {
    maxWidth: {
      type: "select",
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
    <Container
      maxWidth={maxWidth}
      paddingX={paddingX}
      content={content}
    />
  ),
};
