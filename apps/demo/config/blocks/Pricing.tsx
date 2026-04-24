import { CreditCard } from "lucide-react";
import type { Block } from "@/core";
import type { Components } from "../types";

export const Pricing: Block<Components> = {
  label: "Pricing",
  icon: <CreditCard size={16} />,
  category: "sections",
  content: {
    type: "Pricing",
    props: {
      eyebrow: "Pricing",
      heading: "Simple, predictable pricing",
      subheading:
        "Start free, upgrade when you need more seats, workspaces, or custom roles.",
      tiers: [
        {
          type: "PriceCard" as const,
          props: {
            id: "seed-tier-starter",
            name: "Starter",
            price: "$0",
            cadence: "month" as const,
            features: [
              { text: "Up to 3 editors" },
              { text: "Unlimited pages" },
              { text: "Community support" },
            ],
            highlighted: "no" as const,
            badge: "",
            cta: {
              label: "Start free",
              href: "#",
              variant: "outline" as const,
            },
          },
        },
        {
          type: "PriceCard" as const,
          props: {
            id: "seed-tier-team",
            name: "Team",
            price: "$49",
            cadence: "month" as const,
            features: [
              { text: "Unlimited editors" },
              { text: "Role-based permissions" },
              { text: "Custom plugins" },
              { text: "Priority support" },
            ],
            highlighted: "yes" as const,
            badge: "Most popular",
            cta: {
              label: "Start 14-day trial",
              href: "#",
              variant: "default" as const,
            },
          },
        },
        {
          type: "PriceCard" as const,
          props: {
            id: "seed-tier-enterprise",
            name: "Enterprise",
            price: "Custom",
            cadence: "year" as const,
            features: [
              { text: "SSO, audit logs, SLA" },
              { text: "Dedicated cluster" },
              { text: "Custom onboarding" },
            ],
            highlighted: "no" as const,
            badge: "",
            cta: {
              label: "Contact sales",
              href: "#",
              variant: "outline" as const,
            },
          },
        },
      ],
    },
  },
};
