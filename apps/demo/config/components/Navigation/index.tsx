import { ComponentConfig } from "@/core";
import { Navigation as NavigationComponent } from "@/components/navigation";
import { defaultNavLinks } from "../../seeds";

export type NavigationProps = {
  brand: string;
  links: Array<{ label: string; href: string }>;
  cta: { label: string; href: string };
};

export const Navigation: ComponentConfig<NavigationProps> = {
  global: true,
  fields: {
    brand: { type: "text", default: "react-editor", contentEditable: true },
    links: {
      type: "array",
      default: defaultNavLinks,
      getItemSummary: (l) => l.label,
      arrayFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
    cta: {
      type: "object",
      default: { label: "Start building", href: "#" },
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
  },
  render: ({ brand, links, cta }) => (
    <NavigationComponent brand={brand} links={links} cta={cta} />
  ),
};
