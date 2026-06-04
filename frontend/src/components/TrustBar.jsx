import React from "react";
import { Truck, Banknote, RotateCcw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Truck, title: "Livrare 1-3 zile", desc: "Curier rapid · Toată țara" },
  { icon: Banknote, title: "Plată la livrare", desc: "Plătești când primești" },
  { icon: RotateCcw, title: "Retur 14 zile", desc: "Fără explicații" },
  { icon: ShieldCheck, title: "Produse originale", desc: "Cu factură și garanție" },
];

export const TrustBar = () => (
  <section id="beneficii" className="border-y border-ink-200 bg-white" data-testid="trust-bar">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((it, i) => (
        <motion.div
          key={it.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
            <it.icon className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-ink-900">{it.title}</div>
            <div className="text-xs text-ink-500 mt-0.5">{it.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default TrustBar;
