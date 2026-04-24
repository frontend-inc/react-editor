import { HelpCircle } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const FAQ: Block<Components> = {
  label: "FAQ",
  icon: <HelpCircle size={16} />,
  category: "sections",
  component: "FAQ",
  props: {
    eyebrow: "FAQ",
    heading: "Frequently asked questions",
    subheading: "Answers to common questions about the editor.",
    items: [
      {
        question: "How do I register my own components?",
        answer:
          "<p>Export a <code>Config</code> with your components and pass it to the <code>Editor</code>. Every component registers its fields and a render function.</p>",
      },
      {
        question: "Where is my data stored?",
        answer:
          "<p>Wherever you put it. The editor emits JSON; persist to your database, file system, CMS, or browser storage.</p>",
      },
      {
        question: "Does it work with Tailwind?",
        answer:
          "<p>Yes — this demo uses Tailwind v4 and shadcn. Inside the editor preview iframe, Tailwind is injected via the bundled CDN plugin.</p>",
      },
      {
        question: "Is it production-ready?",
        answer:
          "<p>Use it today for content-driven pages, docs, and marketing surfaces. Custom permissions, roles, and plugins are all supported.</p>",
      },
    ],
  },
};
