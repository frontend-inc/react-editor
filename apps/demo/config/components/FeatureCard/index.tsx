import { ComponentConfig } from "@/core";
import { FeatureCard as FeatureCardComponent } from "@/components/feature-card";
import { iconOptions } from "../../icons";

export type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
};

export const FeatureCard: ComponentConfig<FeatureCardProps> = {
  fields: {
    icon: { type: "select", default: "sparkles", options: iconOptions },
    title: {
      type: "text",
      default: "Feature title",
      contentEditable: true,
    },
    description: {
      type: "textarea",
      default:
        "A short description of the feature, focusing on the user benefit.",
      contentEditable: true,
    },
    cta: {
      type: "object",
      default: { label: "", href: "" },
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
  },
  render: ({ icon, title, description, cta }) => (
    <FeatureCardComponent
      icon={icon}
      title={title}
      description={description}
      cta={cta}
    />
  ),
};
