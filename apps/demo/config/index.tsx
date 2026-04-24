import { Typography } from "./components/Typography";
import { Image } from "./components/Image";
import { Button } from "./components/Button";
import { Section } from "./components/Section";
import { Container } from "./components/Container";
import { Grid } from "./components/Grid";
import { Stack } from "./components/Stack";
import { Row } from "./components/Row";
import { Columns } from "./components/Columns";
import { Accordion } from "./components/Accordion";
import { FeatureCard } from "./components/FeatureCard";
import { TestimonialCard } from "./components/TestimonialCard";
import { PriceCard } from "./components/PriceCard";
import { TeamCard } from "./components/TeamCard";
import { Hero } from "./components/Hero";
import { Logos } from "./components/Logos";
import { Features } from "./components/Features";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { Team } from "./components/Team";
import { CTA } from "./components/CTA";
import { FAQ } from "./components/FAQ";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

import { Section as SectionBlock } from "./blocks/Section";
import { Container as ContainerBlock } from "./blocks/Container";
import { Grid as GridBlock } from "./blocks/Grid";
import { Stack as StackBlock } from "./blocks/Stack";
import { Row as RowBlock } from "./blocks/Row";
import { Columns as ColumnsBlock } from "./blocks/Columns";
import { Navigation as NavigationBlock } from "./blocks/Navigation";
import { Footer as FooterBlock } from "./blocks/Footer";
import { Hero as HeroBlock } from "./blocks/Hero";
import { Logos as LogosBlock } from "./blocks/Logos";
import { Features as FeaturesBlock } from "./blocks/Features";
import { Testimonials as TestimonialsBlock } from "./blocks/Testimonials";
import { Pricing as PricingBlock } from "./blocks/Pricing";
import { Team as TeamBlock } from "./blocks/Team";
import { CTA as CTABlock } from "./blocks/CTA";
import { FAQ as FAQBlock } from "./blocks/FAQ";
import { FeatureCard as FeatureCardBlock } from "./blocks/FeatureCard";
import { TestimonialCard as TestimonialCardBlock } from "./blocks/TestimonialCard";
import { PriceCard as PriceCardBlock } from "./blocks/PriceCard";
import { TeamCard as TeamCardBlock } from "./blocks/TeamCard";
import { Typography as TypographyBlock } from "./blocks/Typography";
import { Image as ImageBlock } from "./blocks/Image";
import { Button as ButtonBlock } from "./blocks/Button";
import { Accordion as AccordionBlock } from "./blocks/Accordion";

import Root from "./root";
import { UserConfig } from "./types";
import { initialData } from "./initial-data";

export const conf: UserConfig = {
  root: Root,
  categories: {
    layout: { title: "Layout" },
    navigation: { title: "Navigation" },
    sections: { title: "Sections" },
    cards: { title: "Cards" },
    elements: { title: "Elements" },
  },
  components: {
    Typography,
    Image,
    Button,
    Section,
    Container,
    Grid,
    Stack,
    Row,
    Columns,
    Accordion,
    FeatureCard,
    TestimonialCard,
    PriceCard,
    TeamCard,
    Hero,
    Logos,
    Features,
    Testimonials,
    Pricing,
    Team,
    CTA,
    FAQ,
    Navigation,
    Footer,
  },
  blocks: {
    Section: SectionBlock,
    Container: ContainerBlock,
    Grid: GridBlock,
    Stack: StackBlock,
    Row: RowBlock,
    Columns: ColumnsBlock,

    Navigation: NavigationBlock,
    Footer: FooterBlock,

    Hero: HeroBlock,
    Logos: LogosBlock,
    Features: FeaturesBlock,
    Testimonials: TestimonialsBlock,
    Pricing: PricingBlock,
    Team: TeamBlock,
    CTA: CTABlock,
    FAQ: FAQBlock,

    FeatureCard: FeatureCardBlock,
    TestimonialCard: TestimonialCardBlock,
    PriceCard: PriceCardBlock,
    TeamCard: TeamCardBlock,

    Typography: TypographyBlock,
    Image: ImageBlock,
    Button: ButtonBlock,
    Accordion: AccordionBlock,
  },
};

export const componentKey = Buffer.from(
  `${Object.keys(conf.components).join("-")}-${JSON.stringify({ initialData })}`
).toString("base64");

export default conf;
