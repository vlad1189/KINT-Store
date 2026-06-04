import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Truck } from "lucide-react";

export const Header = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Top promo bar */}
      <div className="bg-brand-50 border-b border-brand-100 text-ink-800 text-xs sm:text-[13px]" data-testid="promo-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-9 flex items-center justify-center gap-2 overflow-hidden">
          <Truck className="w-3.5 h-3.5 text-brand-600" />
          <span className="font-medium">
            <span className="text-brand-700 font-bold">LIVRARE GRATUITĂ</span> la comenzi peste 150 lei · Plată la livrare în toată țara
          </span>
        </div>
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-ink-200"
        data-testid="site-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" data-testid="header-logo-link">
            <Logo className="h-10 w-10 text-ink-900" />
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-2xl tracking-tight text-ink-900">
                KINT
              </span>
              <span className="text-xs uppercase tracking-[0.22em] text-brand-600 font-semibold -mt-2">
                Store
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-700">
            <a href="/#produse" className="hover:text-brand-600 transition-colors" data-testid="nav-products">Produse</a>
            <a href="/#faq" className="hover:text-brand-600 transition-colors" data-testid="nav-faq">Întrebări</a>
          </nav>

          <a
            href="/#produse"
            className="inline-flex items-center gap-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-brand-500/30"
            data-testid="header-cta-shop"
          >
            Rezolvă-ți problema!
          </a>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
