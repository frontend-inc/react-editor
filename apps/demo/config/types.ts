import { Config, Data } from "@/core";
import { TypographyProps } from "@/components/typography/typography.editor";
import { ImageProps } from "@/components/image/image.editor";
import { ButtonBlockProps } from "@/components/button/button.editor";
import { SectionProps } from "@/components/section/section.editor";
import { ContainerProps } from "@/components/container/container.editor";
import { GridProps } from "@/components/grid/grid.editor";
import { StackProps } from "@/components/stack/stack.editor";
import { RowProps } from "@/components/row/row.editor";
import { ColumnsProps } from "@/components/columns/columns.editor";
import { AccordionProps } from "@/components/accordion/accordion.editor";
import { FeatureCardProps } from "@/components/feature-card/feature-card.editor";
import { TestimonialCardProps } from "@/components/testimonial-card/testimonial-card.editor";
import { PriceCardProps } from "@/components/price-card/price-card.editor";
import { TeamCardProps } from "@/components/team-card/team-card.editor";
import { HeroProps } from "@/components/hero/hero.editor";
import { LogosProps } from "@/components/logos/logos.editor";
import { FeaturesProps } from "@/components/features/features.editor";
import { TestimonialsProps } from "@/components/testimonials/testimonials.editor";
import { PricingProps } from "@/components/pricing/pricing.editor";
import { TeamProps } from "@/components/team/team.editor";
import { CTAProps } from "@/components/cta/cta.editor";
import { FAQProps } from "@/components/faq/faq.editor";
import { NavigationProps } from "@/components/navigation/navigation.editor";
import { FooterProps } from "@/components/footer/footer.editor";

import { RootProps } from "./root";

export type { RootProps } from "./root";

export type Components = {
  "typography": TypographyProps;
  "image": ImageProps;
  "button": ButtonBlockProps;
  "section": SectionProps;
  "container": ContainerProps;
  "grid": GridProps;
  "stack": StackProps;
  "row": RowProps;
  "columns": ColumnsProps;
  "accordion": AccordionProps;
  "feature-card": FeatureCardProps;
  "testimonial-card": TestimonialCardProps;
  "price-card": PriceCardProps;
  "team-card": TeamCardProps;
  "hero": HeroProps;
  "logos": LogosProps;
  "features": FeaturesProps;
  "testimonials": TestimonialsProps;
  "pricing": PricingProps;
  "team": TeamProps;
  "cta": CTAProps;
  "faq": FAQProps;
  "navigation": NavigationProps;
  "footer": FooterProps;
};

export type UserConfig = Config<{
  components: Components;
  root: RootProps;
  categories: [
    "layout",
    "navigation",
    "sections",
    "cards",
    "elements"
  ];
  fields: {
    userField: {
      type: "userField";
      option: boolean;
    };
  };
}>;

export type UserData = Data<Components, RootProps>;
