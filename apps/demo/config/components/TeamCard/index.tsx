import { ComponentConfig } from "@/core";
import { TeamCard as TeamCardComponent } from "@/components/team-card";

const socialOptions = [
  { label: "Twitter", value: "twitter" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "GitHub", value: "github" },
] as const;

export type TeamCardProps = {
  avatarUrl: string;
  name: string;
  title: string;
  bio: string;
  socials: Array<{
    platform: "twitter" | "linkedin" | "github";
    href: string;
  }>;
};

export const TeamCard: ComponentConfig<TeamCardProps> = {
  fields: {
    avatarUrl: { type: "text", default: "" },
    name: { type: "text", default: "Alex Rivera", contentEditable: true },
    title: {
      type: "text",
      default: "Founding engineer",
      contentEditable: true,
    },
    bio: {
      type: "textarea",
      default:
        "Builds the editor runtime and the primitives that compose every page.",
      contentEditable: true,
    },
    socials: {
      type: "array",
      default: [
        { platform: "twitter", href: "#" },
        { platform: "github", href: "#" },
      ],
      getItemSummary: (s) => s.platform,
      arrayFields: {
        platform: {
          type: "select",
          default: "twitter",
          options: [...socialOptions],
        },
        href: { type: "text", default: "#" },
      },
    },
  },
  render: ({ avatarUrl, name, title, bio, socials }) => (
    <TeamCardComponent
      avatarUrl={avatarUrl}
      name={name}
      title={title}
      bio={bio}
      socials={socials}
    />
  ),
};
