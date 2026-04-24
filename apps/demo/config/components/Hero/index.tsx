import { ComponentConfig, Slot } from "@/core";
import { Hero as HeroComponent } from "@/components/hero";

export type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  align: "left" | "center";
  media: Slot;
};

export const Hero: ComponentConfig<HeroProps> = {
  fields: {
    eyebrow: {
      type: "text",
      default: "v2 · Visual editing for React",
      placeholder: "New · v2",
      contentEditable: true,
    },
    title: {
      type: "text",
      default: "Ship pages at the speed of thought",
      contentEditable: true,
    },
    subtitle: {
      type: "textarea",
      default:
        "A drag-and-drop editor for your own React components. Own your data, keep your stack, extend anything.",
      contentEditable: true,
    },
    primaryCta: {
      type: "object",
      default: { label: "Start building", href: "#" },
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
    secondaryCta: {
      type: "object",
      default: { label: "See components", href: "#" },
      objectFields: {
        label: { type: "text", contentEditable: true },
        href: { type: "text" },
      },
    },
    align: {
      type: "radio",
      default: "center",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
      ],
    },
    media: { type: "slot" },
  },
  render: ({
    eyebrow,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    align,
    media,
  }) => (
    <HeroComponent
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
      align={align}
      media={media}
    />
  ),
};
