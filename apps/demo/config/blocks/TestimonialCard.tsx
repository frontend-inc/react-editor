import { Quote } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const TestimonialCard: Block<Components> = {
  label: "Testimonial card",
  icon: <Quote size={16} />,
  category: "cards",
  component: "TestimonialCard",
  props: {
    quote:
      "<p>This tool changed how our team ships pages. Fast to set up, delightful to use.</p>",
    author: "Jane Doe",
    role: "Head of Marketing, Acme",
    avatarUrl: "",
  },
};
