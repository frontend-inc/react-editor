import { ComponentConfig, Slot } from "@/core";
import { Features as FeaturesComponent } from "@/components/features";

export type FeaturesProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  columns: "2" | "3" | "4";
  items: Slot;
};

export const Features: ComponentConfig<FeaturesProps> = {
  fields: {
    eyebrow: { type: "text", default: "Features", contentEditable: true },
    heading: {
      type: "text",
      default: "Everything you need to ship a page",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      default:
        "Composable primitives, rich fields, and a preview that mirrors production.",
      contentEditable: true,
    },
    columns: {
      type: "radio",
      default: "3",
      options: [
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
    },
    items: { type: "slot" },
  },
  render: ({ eyebrow, heading, subheading, columns, items }) => (
    <FeaturesComponent
      eyebrow={eyebrow}
      heading={heading}
      subheading={subheading}
      columns={columns}
      items={items}
    />
  ),
};
