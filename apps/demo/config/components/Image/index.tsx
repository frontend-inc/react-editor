import { ComponentConfig } from "@/core";
import { Image as ImageComponent } from "@/components/image";

export type ImageProps = {
  src: string;
  alt: string;
  ratio: "auto" | "1:1" | "4:3" | "16:9" | "21:9";
  fit: "cover" | "contain";
  rounded: "none" | "md" | "lg" | "xl" | "full";
};

export const Image: ComponentConfig<ImageProps> = {
  fields: {
    src: {
      type: "text",
      placeholder: "https://...",
      default: "https://placehold.co/1600x900",
    },
    alt: { type: "text", default: "Placeholder image" },
    ratio: {
      type: "select",
      default: "16:9",
      options: [
        { label: "Auto", value: "auto" },
        { label: "1:1", value: "1:1" },
        { label: "4:3", value: "4:3" },
        { label: "16:9", value: "16:9" },
        { label: "21:9", value: "21:9" },
      ],
    },
    fit: {
      type: "radio",
      default: "cover",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
      ],
    },
    rounded: {
      type: "select",
      default: "xl",
      options: [
        { label: "None", value: "none" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
        { label: "Full", value: "full" },
      ],
    },
  },
  render: ({ src, alt, ratio, fit, rounded }) => (
    <ImageComponent
      src={src}
      alt={alt}
      ratio={ratio}
      fit={fit}
      rounded={rounded}
    />
  ),
};
