import type { Config } from "@reacteditor/core";
import { heroEditor, type HeroProps } from "@/components/hero/hero.editor";

type Props = {
  "hero": HeroProps;
};

export const config: Config<Props> = {
  components: {
    "hero": heroEditor,
  },
};

export default config;
