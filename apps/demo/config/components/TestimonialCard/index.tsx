import { ComponentConfig } from "@/core";
import { TestimonialCard as TestimonialCardComponent } from "@/components/testimonial-card";

export type TestimonialCardProps = {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
};

export const TestimonialCard: ComponentConfig<TestimonialCardProps> = {
  fields: {
    quote: { type: "richtext", contentEditable: true },
    author: { type: "text", default: "Jane Doe", contentEditable: true },
    role: {
      type: "text",
      default: "Head of Marketing, Acme",
      contentEditable: true,
    },
    avatarUrl: { type: "text", default: "" },
  },
  render: ({ quote, author, role, avatarUrl }) => (
    <TestimonialCardComponent
      quote={quote}
      author={author}
      role={role}
      avatarUrl={avatarUrl}
    />
  ),
};
