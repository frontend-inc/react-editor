import { ComponentConfig } from "@/core";
import { Footer as FooterComponent } from "@/components/footer";
import { defaultFooterColumns, defaultSocial } from "../../seeds";

const socialOptions = [
  { label: "Twitter", value: "twitter" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "GitHub", value: "github" },
] as const;

export type FooterProps = {
  brand: string;
  tagline: string;
  columns: Array<{
    heading: string;
    links: Array<{ label: string; href: string }>;
  }>;
  copyright: string;
  social: Array<{ platform: "twitter" | "linkedin" | "github"; href: string }>;
};

export const Footer: ComponentConfig<FooterProps> = {
  global: true,
  fields: {
    brand: { type: "text", default: "react-editor", contentEditable: true },
    tagline: {
      type: "textarea",
      default: "A visual editor for your React components.",
      contentEditable: true,
    },
    columns: {
      type: "array",
      default: defaultFooterColumns,
      getItemSummary: (c) => c.heading,
      arrayFields: {
        heading: { type: "text", contentEditable: true },
        links: {
          type: "array",
          getItemSummary: (l) => l.label,
          arrayFields: {
            label: { type: "text", contentEditable: true },
            href: { type: "text" },
          },
        },
      },
    },
    copyright: {
      type: "text",
      default: "© 2026 react-editor. All rights reserved.",
      contentEditable: true,
    },
    social: {
      type: "array",
      default: defaultSocial,
      getItemSummary: (s) => s.platform,
      arrayFields: {
        platform: {
          type: "select",
          default: "twitter",
          options: [...socialOptions],
        },
        href: { type: "text" },
      },
    },
  },
  render: ({ brand, tagline, columns, copyright, social }) => (
    <FooterComponent
      brand={brand}
      tagline={tagline}
      columns={columns}
      copyright={copyright}
      social={social}
    />
  ),
};
