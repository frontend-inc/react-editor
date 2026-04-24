import { cn } from "@/lib/utils";

type Ratio = "auto" | "1:1" | "4:3" | "16:9" | "21:9";
type Fit = "cover" | "contain";
type Rounded = "none" | "md" | "lg" | "xl" | "full";

type Props = {
  src: string;
  alt: string;
  ratio: Ratio;
  fit: Fit;
  rounded: Rounded;
};

const ratioClasses: Record<Ratio, string> = {
  auto: "",
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  "21:9": "aspect-[21/9]",
};

const roundedClasses: Record<Rounded, string> = {
  none: "",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-2xl",
  full: "rounded-full",
};

export function Image({ src, alt, ratio, fit, rounded }: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden bg-muted",
        ratioClasses[ratio],
        roundedClasses[rounded]
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn(
            "h-full w-full",
            fit === "cover" ? "object-cover" : "object-contain"
          )}
        />
      ) : null}
    </div>
  );
}
