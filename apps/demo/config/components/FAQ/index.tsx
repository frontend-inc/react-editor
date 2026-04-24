import { ComponentConfig } from "@/core";
import { FAQ as FAQComponent } from "@/components/faq";
import { defaultFAQItems } from "../../seeds";

export type FAQProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: Array<{ question: string; answer: string }>;
};

export const FAQ: ComponentConfig<FAQProps> = {
  fields: {
    eyebrow: { type: "text", default: "FAQ", contentEditable: true },
    heading: {
      type: "text",
      default: "Frequently asked questions",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      default: "Answers to common questions about the editor.",
      contentEditable: true,
    },
    items: {
      type: "array",
      default: defaultFAQItems,
      getItemSummary: (item, i) => item.question || `Question ${(i ?? 0) + 1}`,
      arrayFields: {
        question: { type: "text", contentEditable: true },
        answer: { type: "richtext", contentEditable: true },
      },
    },
  },
  render: ({ eyebrow, heading, subheading, items }) => (
    <FAQComponent
      eyebrow={eyebrow}
      heading={heading}
      subheading={subheading}
      items={items}
    />
  ),
};
