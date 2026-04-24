import * as React from "react";
import {
  Accordion as UIAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  items: Array<{ question: string; answer: string }>;
  type: "single" | "multiple";
};

export function Accordion({ items, type }: Props) {
  if (type === "single") {
    return (
      <UIAccordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <div>{item.answer as unknown as React.ReactNode}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </UIAccordion>
    );
  }

  return (
    <UIAccordion type="multiple" className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            <div>{item.answer as unknown as React.ReactNode}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </UIAccordion>
  );
}
