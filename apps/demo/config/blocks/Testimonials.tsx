import { MessageSquareQuote } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Testimonials: Block<Components> = {
  label: "Testimonials",
  icon: <MessageSquareQuote size={16} />,
  category: "sections",
  content: {
    type: "Testimonials",
    props: {
      eyebrow: "Testimonials",
      heading: "Loved by teams that ship",
      subheading:
        "Engineers and marketers building real products with the editor.",
      items: [
        {
          type: "TestimonialCard" as const,
          props: {
            id: "seed-testimonial-1",
            quote:
              "<p>We replaced a homegrown CMS with this in a weekend. Authoring feels like Figma, output is just JSON.</p>",
            author: "Priya Raman",
            role: "Staff engineer, Lumos",
            avatarUrl: "",
          },
        },
        {
          type: "TestimonialCard" as const,
          props: {
            id: "seed-testimonial-2",
            quote:
              "<p>Marketing ships landing pages without our help now. The primitives map 1:1 to our design system.</p>",
            author: "Marcus Cole",
            role: "Design systems lead, Tessera",
            avatarUrl: "",
          },
        },
        {
          type: "TestimonialCard" as const,
          props: {
            id: "seed-testimonial-3",
            quote:
              "<p>The slot model makes it trivial to mix custom blocks with stock layout primitives. Extensibility that actually scales.</p>",
            author: "Ada Okonkwo",
            role: "Engineering manager, Northwind",
            avatarUrl: "",
          },
        },
      ],
    },
  },
};
