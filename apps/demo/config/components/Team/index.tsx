import { ComponentConfig, Slot } from "@/core";
import { Team as TeamComponent } from "@/components/team";

export type TeamProps = {
  eyebrow: string;
  heading: string;
  subheading: string;
  members: Slot;
};

export const Team: ComponentConfig<TeamProps> = {
  fields: {
    eyebrow: { type: "text", default: "Team", contentEditable: true },
    heading: {
      type: "text",
      default: "Built by a small, focused team",
      contentEditable: true,
    },
    subheading: {
      type: "textarea",
      default:
        "We come from editor, framework, and design-systems teams. This is the tool we always wanted.",
      contentEditable: true,
    },
    members: { type: "slot" },
  },
  render: ({ eyebrow, heading, subheading, members }) => (
    <TeamComponent
      eyebrow={eyebrow}
      heading={heading}
      subheading={subheading}
      members={members}
    />
  ),
};
