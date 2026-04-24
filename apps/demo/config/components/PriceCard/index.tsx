import { ComponentConfig } from "@/core";
import { PriceCard as PriceCardComponent } from "@/components/price-card";

export type PriceCardProps = {
  name: string;
  price: string;
  cadence: "month" | "year" | "once";
  features: Array<{ text: string }>;
  highlighted: "yes" | "no";
  badge: string;
  cta: {
    label: string;
    href: string;
    variant: "default" | "outline" | "secondary";
  };
};

export const PriceCard: ComponentConfig<PriceCardProps> = {
  fields: {
    name: { type: "text", default: "Pro", contentEditable: true },
    price: { type: "text", default: "$49", contentEditable: true },
    cadence: {
      type: "radio",
      default: "month",
      options: [
        { label: "Per month", value: "month" },
        { label: "Per year", value: "year" },
        { label: "One-time", value: "once" },
      ],
    },
    features: {
      type: "array",
      default: [
        { text: "Unlimited pages" },
        { text: "Role-based permissions" },
        { text: "Priority support" },
      ],
      getItemSummary: (f, i) => f.text || `Feature ${(i ?? 0) + 1}`,
      arrayFields: { text: { type: "text", contentEditable: true } },
    },
    highlighted: {
      type: "radio",
      default: "no",
      options: [
        { label: "No", value: "no" },
        { label: "Yes", value: "yes" },
      ],
    },
    badge: {
      type: "text",
      default: "Most popular",
      placeholder: "Most popular",
      contentEditable: true,
    },
    cta: {
      type: "object",
      default: { label: "Get started", href: "#", variant: "default" },
      objectFields: {
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
    },
  },
  resolveFields: (data, { fields }) => ({
    ...fields,
    badge: { ...fields.badge, visible: data.props.highlighted === "yes" },
  }),
  render: ({ name, price, cadence, features, highlighted, badge, cta }) => (
    <PriceCardComponent
      name={name}
      price={price}
      cadence={cadence}
      features={features}
      highlighted={highlighted}
      badge={badge}
      cta={cta}
    />
  ),
};
