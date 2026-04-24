import { ComponentConfig, Slot } from "@/core";
import { Columns as ColumnsComponent } from "@/components/columns";

export type ColumnsProps = {
  items: Array<{
    span:
      | "1"
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "9"
      | "10"
      | "11"
      | "12";
    content: Slot;
  }>;
  gap: "sm" | "md" | "lg" | "xl";
};

export const Columns: ComponentConfig<ColumnsProps> = {
  fields: {
    items: {
      type: "array",
      default: [
        { span: "6", content: [] },
        { span: "6", content: [] },
      ],
      getItemSummary: (item, i) =>
        `Column ${(i ?? 0) + 1} · span ${item.span}`,
      arrayFields: {
        span: {
          type: "select",
          default: "6",
          options: Array.from({ length: 12 }, (_, i) => {
            const v = String(i + 1) as ColumnsProps["items"][number]["span"];
            return { label: v, value: v };
          }),
        },
        content: { type: "slot" },
      },
    },
    gap: {
      type: "select",
      default: "md",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
    },
  },
  render: ({ items, gap }) => (
    <ColumnsComponent items={items} gap={gap} />
  ),
};
