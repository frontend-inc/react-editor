import { ComponentConfig } from "@/core";
import { Logos as LogosComponent } from "@/components/logos";
import { defaultLogos } from "../../seeds";

export type LogosProps = {
  eyebrow: string;
  logos: Array<{ alt: string; src: string }>;
  grayscale: "yes" | "no";
};

export const Logos: ComponentConfig<LogosProps> = {
  fields: {
    eyebrow: {
      type: "text",
      default: "Trusted by teams shipping fast",
      contentEditable: true,
    },
    logos: {
      type: "array",
      default: defaultLogos,
      getItemSummary: (l, i) => l.alt || `Logo ${(i ?? 0) + 1}`,
      arrayFields: {
        alt: { type: "text" },
        src: { type: "text" },
      },
    },
    grayscale: {
      type: "radio",
      default: "yes",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
  },
  render: ({ eyebrow, logos, grayscale }) => (
    <LogosComponent eyebrow={eyebrow} logos={logos} grayscale={grayscale} />
  ),
};
