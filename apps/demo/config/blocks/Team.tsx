import { Users } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Team: Block<Components> = {
  label: "Team",
  icon: <Users size={16} />,
  category: "sections",
  content: {
    type: "Team",
    props: {
      eyebrow: "Team",
      heading: "Built by a small, focused team",
      subheading:
        "We come from editor, framework, and design-systems teams. This is the tool we always wanted.",
      members: [
        {
          type: "TeamCard" as const,
          props: {
            id: "seed-member-1",
            avatarUrl: "",
            name: "Riley Chen",
            title: "Founder, editor runtime",
            bio: "Shipped the original block engine. Previously on a visual builder at a large B2B.",
            socials: [
              { platform: "twitter" as const, href: "#" },
              { platform: "github" as const, href: "#" },
            ],
          },
        },
        {
          type: "TeamCard" as const,
          props: {
            id: "seed-member-2",
            avatarUrl: "",
            name: "Sam Okafor",
            title: "Design systems",
            bio: "Tokens, typography, and the opinionated defaults that make pages look intentional.",
            socials: [
              { platform: "twitter" as const, href: "#" },
              { platform: "linkedin" as const, href: "#" },
            ],
          },
        },
        {
          type: "TeamCard" as const,
          props: {
            id: "seed-member-3",
            avatarUrl: "",
            name: "Daria Volkova",
            title: "Infra & API",
            bio: "Persistence, migrations, and the plugin SDK. Owns everything below the render tree.",
            socials: [
              { platform: "github" as const, href: "#" },
              { platform: "linkedin" as const, href: "#" },
            ],
          },
        },
        {
          type: "TeamCard" as const,
          props: {
            id: "seed-member-4",
            avatarUrl: "",
            name: "Jordan Blake",
            title: "Developer relations",
            bio: "Guides, recipes, and the community. Your first stop if you get stuck.",
            socials: [
              { platform: "twitter" as const, href: "#" },
              { platform: "github" as const, href: "#" },
            ],
          },
        },
      ],
    },
  },
};
