import { ComponentConfig, Slot } from "@/core";
import { Testimonials as TestimonialsComponent } from "@/components/testimonials";

export type TestimonialsProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: Slot;
};

export const Testimonials: ComponentConfig<TestimonialsProps> = {
  fields: {
    eyebrow: {
      type: "text",
      default: "Testimonials",
      contentEditable: true,
    },
    heading: {
      type: "text",
      default: "Loved by teams that ship",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      default:
        "Engineers and marketers building real products with the editor.",
      contentEditable: true,
    },
    items: { type: "slot" },
  },
  render: ({ eyebrow, heading, subheading, items }) => (
    <TestimonialsComponent
      eyebrow={eyebrow}
      heading={heading}
      subheading={subheading}
      items={items}
    />
  ),
};
