import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const DEFAULT_ITEMS = [
  { q: "Cum funcționează plata la livrare?", a: "Foarte simplu: plasezi comanda, primești coletul prin curier și plătești în numerar sau cu cardul direct curierului. Fără avansuri, fără carduri online — zero risc." },
  { q: "În cât timp ajunge comanda?", a: "Comenzile plasate înainte de ora 14:00 se procesează în aceeași zi. Livrarea durează 1-3 zile lucrătoare în toată țara prin curier rapid." },
  { q: "Pot returna produsul?", a: "Da, ai la dispoziție 14 zile de la primire pentru retur fără explicații. Returnezi produsul în stare originală și primești banii înapoi integral." },
  { q: "Cât costă livrarea?", a: "Livrarea este GRATUITĂ pentru comenzile peste 150 lei. Sub această sumă, taxa de livrare este 19.99 lei. Plătești și produsul, și livrarea, doar când primești coletul." },
  { q: "Sunt produsele originale?", a: "Toate produsele noastre sunt 100% originale, testate și verificate înainte de listare. Vin cu factură fiscală și garanție conform legii." },
];

export const FAQ = ({ items = DEFAULT_ITEMS, accentClass = "text-brand-600" }) => {
  return (
    <section id="faq" className="py-20" data-testid="faq-section">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className={`text-[11px] uppercase tracking-widest font-bold ${accentClass}`}>Întrebări frecvente</div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink-900 tracking-tight font-extrabold mt-2">
            Tot ce trebuie să știi.
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-ink-200">
              <AccordionTrigger className="text-left font-semibold text-ink-900 hover:text-brand-600 hover:no-underline py-5 text-base" data-testid={`faq-trigger-${i}`}>
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="text-ink-600 text-sm leading-relaxed pb-5">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
