import React from "react";
import { useLocation } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";

export const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 bg-brand-50/40 border-t border-brand-100 text-ink-800" data-testid="site-footer">
      {/* Trust bar */}
      <div className="border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Livrare rapidă", desc: "1-3 zile lucrătoare" },
            { icon: ShieldCheck, title: "Plata la livrare", desc: "Plătești când primești" },
            { icon: RotateCcw, title: "Retur 14 zile", desc: "Fără explicații" },
            { icon: Phone, title: "Suport 7/7", desc: "Răspuns rapid" },
          ].map((it) => (
            <div key={it.title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-white border border-brand-200 flex items-center justify-center shrink-0">
                <it.icon className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="font-bold text-ink-900 text-sm">{it.title}</div>
                <div className="text-xs text-ink-500 mt-0.5">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8 text-ink-900" />
            <span className="font-display font-extrabold text-xl text-ink-900">KINT Store</span>
          </div>
          <p className="text-sm text-ink-600 mt-4 max-w-md leading-relaxed">
            Magazinul tău online de încredere. Produse selectate cu grijă, plată la livrare în toată țara, fără riscuri.
          </p>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-brand-700 font-bold">Contact</div>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
            <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> 0700 000 000</li>
            <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> hello@kshopping.ro</li>
            <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Livrare în toată România</li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-brand-700 font-bold">Despre</div>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
            <li><a href="#" className="hover:text-brand-700 transition-colors">Termeni</a></li>
            <li><a href="#" className="hover:text-brand-700 transition-colors">Confidențialitate</a></li>
            <li><a href="#" className="hover:text-brand-700 transition-colors">Politică retur</a></li>
            <li><a href="#" className="hover:text-brand-700 transition-colors">ANPC</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 text-xs text-ink-500 text-center">
          © {new Date().getFullYear()} KINT Store. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
