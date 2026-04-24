import { ComponentConfig } from "@/core";
import { CTA as CTAComponent } from "@/components/cta";

export type CTAProps = {
  heading: string;
  subheading: string;
  variant: "solid" | "gradient" | "outline";
  buttons: Array<{
    label: string;
    href: string;
    variant: "default" | "outline" | "secondary";
  }>;
};

export const CTA: ComponentConfig<CTAProps> = {
  fields: {
    heading: {
      type: "text",
      default: "Start shipping pages today",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      default: "Free for open source and side projects.",
      contentEditable: true,
    },
    variant: {
      type: "radio",
      default: "gradient",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Gradient", value: "gradient" },
        { label: "Outline", value: "outline" },
      ],
    },
    buttons: {
      type: "array",
      default: [
        { label: "Start building", href: "#", variant: "secondary" },
        { label: "Read the docs", href: "#", variant: "outline" },
      ],
      getItemSummary: (b, i) => b.label || `Button ${(i ?? 0) + 1}`,
      arrayFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
        variant: {
          type: "select",
          default: "default",
          options: [
            { label: "Primary", value: "default" },
            { label: "Outline", value: "outline" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      },
      max: 3,
    },
  },
  render: ({ heading, subheading, variant, buttons }) => (
    <CTAComponent
      heading={heading}
      subheading={subheading}
      variant={variant}
      buttons={buttons}
    />
  ),
};
