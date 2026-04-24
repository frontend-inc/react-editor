import { ComponentConfig, Slot } from "@/core";
import { Pricing as PricingComponent } from "@/components/pricing";

export type PricingProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  tiers: Slot;
};

export const Pricing: ComponentConfig<PricingProps> = {
  fields: {
    eyebrow: { type: "text", default: "Pricing", contentEditable: true },
    heading: {
      type: "text",
      default: "Simple, predictable pricing",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      default:
        "Start free, upgrade when you need more seats, workspaces, or custom roles.",
      contentEditable: true,
    },
    tiers: { type: "slot" },
  },
  render: ({ eyebrow, heading, subheading, tiers }) => (
    <PricingComponent
      eyebrow={eyebrow}
      heading={heading}
      subheading={subheading}
      tiers={tiers}
    />
  ),
};
