import type { JSX } from "react";

export const Loader = ({
  color,
  size = 16,
  ...props
}: {
  color?: string;
  size?: number;
} & JSX.IntrinsicAttributes) => {
  return (
    <span
      className="inline-block rounded-full border-2 border-current border-b-transparent animate-spin"
      style={{ width: size, height: size, color }}
      aria-label="loading"
      {...props}
    />
  );
};
