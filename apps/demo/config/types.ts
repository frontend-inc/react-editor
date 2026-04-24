import { Config, Data } from "@/core";
import { TypographyProps } from "./components/Typography";
import { ImageProps } from "./components/Image";
import { ButtonBlockProps } from "./components/Button";
import { SectionProps } from "./components/Section";
import { ContainerProps } from "./components/Container";
import { GridProps } from "./components/Grid";
import { StackProps } from "./components/Stack";
import { RowProps } from "./components/Row";
import { ColumnsProps } from "./components/Columns";
import { AccordionProps } from "./components/Accordion";
import { FeatureCardProps } from "./components/FeatureCard";
import { TestimonialCardProps } from "./components/TestimonialCard";
import { PriceCardProps } from "./components/PriceCard";
import { TeamCardProps } from "./components/TeamCard";
import { HeroProps } from "./components/Hero";
import { LogosProps } from "./components/Logos";
import { FeaturesProps } from "./components/Features";
import { TestimonialsProps } from "./components/Testimonials";
import { PricingProps } from "./components/Pricing";
import { TeamProps } from "./components/Team";
import { CTAProps } from "./components/CTA";
import { FAQProps } from "./components/FAQ";
import { NavigationProps } from "./components/Navigation";
import { FooterProps } from "./components/Footer";

import { RootProps } from "./root";

export type { RootProps } from "./root";

export type Components = {
  Typography: TypographyProps;
  Image: ImageProps;
  Button: ButtonBlockProps;
  Section: SectionProps;
  Container: ContainerProps;
  Grid: GridProps;
  Stack: StackProps;
  Row: RowProps;
  Columns: ColumnsProps;
  Accordion: AccordionProps;
  FeatureCard: FeatureCardProps;
  TestimonialCard: TestimonialCardProps;
  PriceCard: PriceCardProps;
  TeamCard: TeamCardProps;
  Hero: HeroProps;
  Logos: LogosProps;
  Features: FeaturesProps;
  Testimonials: TestimonialsProps;
  Pricing: PricingProps;
  Team: TeamProps;
  CTA: CTAProps;
  FAQ: FAQProps;
  Navigation: NavigationProps;
  Footer: FooterProps;
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
