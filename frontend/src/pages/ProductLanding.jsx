import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, Check, ArrowLeft, ShieldCheck, Truck, Banknote, Flame, Award,
  Wrench, Car, Sparkles, Home as HomeIcon, Smartphone, Dumbbell, ChefHat,
  Baby, PawPrint, Leaf, Shirt, Heart, ChevronRight, Eye
} from "lucide-react";
import api from "../lib/api";
import CountdownTimer from "../components/CountdownTimer";
import PaperformEmbed from "../components/PaperformEmbed";
import Reviews from "../components/Reviews";
import FAQ from "../components/FAQ";
import { getTheme } from "../lib/themes";

const CategoryIcon = ({ category, className = "w-5 h-5" }) => {
  const Map = {
    industrial: Wrench,
    auto: Car,
    home: HomeIcon,
    beauty: Sparkles,
    tech: Smartphone,
    fitness: Dumbbell,
    kitchen: ChefHat,
    kids: Baby,
    pets: PawPrint,
    garden: Leaf,
    fashion: Shirt,
    health: Heart,
    general: Sparkles,
  };
  const Icon = Map[category] || Sparkles;
  return <Icon className={className} />;
};

const ProductLanding = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [viewers] = useState(() => 7 + Math.floor(Math.random() * 14));

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`)
      .then((r) => { setProduct(r.data); setActiveImg(0); window.scrollTo({ top: 0 }); })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20" data-testid="product-loading">
        <div className="animate-pulse grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-ink-100 rounded-lg" />
          <div className="space-y-4">
            <div className="h-10 bg-ink-100 rounded w-3/4" />
            <div className="h-6 bg-ink-100 rounded w-1/2" />
            <div className="h-32 bg-ink-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center" data-testid="product-not-found">
        <h1 className="font-display text-3xl text-ink-900 font-extrabold">Produsul nu a fost găsit</h1>
        <Link to="/" className="inline-flex items-center gap-2 mt-6 text-brand-600 hover:text-brand-700 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Înapoi la magazin
        </Link>
      </div>
    );
  }

  const theme = getTheme(product.category);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;
  const savings = product.old_price ? (product.old_price - product.price).toFixed(0) : 0;

  // Per-category hero text variants
  const heroBigStat = product.category === "industrial"
    ? { value: "1420 KG", label: "Rezistență testată" }
    : product.category === "auto"
    ? { value: "30 SEC", label: "Aplicare rapidă" }
    : { value: "100%", label: "Plată la livrare" };

  return (
    <main className="bg-white" data-testid="product-landing-page">
      {/* Top breadcrumb bar */}
      <div className="border-b border-ink-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between text-xs">
          <Link to="/" className="inline-flex items-center gap-1.5 text-ink-600 hover:text-ink-900 font-medium transition-colors" data-testid="back-to-home">
            <ArrowLeft className="w-3.5 h-3.5" /> Înapoi la produse
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Eye className="w-3.5 h-3.5" /> {viewers} persoane vizualizează acum
            </div>
          </div>
        </div>
      </div>

      {/* HERO STRIP - dramatic per-category banner */}
      <section className={`relative overflow-hidden ${theme.heroBg} text-white`}>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-10 md:py-14 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${theme.accentBg} flex items-center justify-center shrink-0`}>
              <CategoryIcon category={product.category} className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-bold">{theme.label}</div>
              <div className="font-display text-2xl md:text-3xl font-extrabold mt-0.5 tracking-tight">{product.tagline || product.short_description}</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">{heroBigStat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/60 font-semibold">{heroBigStat.label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN PRODUCT */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className={`aspect-square overflow-hidden ${theme.radiusLg} bg-ink-50 border border-ink-200 relative`}>
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                data-testid="product-main-image"
              />
              {discount > 0 && (
                <div className={`absolute top-4 left-4 bg-brand-500 text-white font-display font-extrabold text-base px-3 py-1.5 ${theme.radius}`}>
                  -{discount}%
                </div>
              )}
              <div className={`absolute bottom-4 left-4 bg-black/70 backdrop-blur text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 ${theme.radius}`}>
                {product.units_sold > 0 ? `${product.units_sold.toLocaleString("ro-RO")}+ vândute` : "Bestseller"}
              </div>
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3" data-testid="product-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImg ? `${theme.accentBorder}` : "border-ink-200 hover:border-ink-300"
                    }`}
                    data-testid={`product-thumb-${i}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-brand-500 text-brand-500" : "text-ink-300"}`} />
                ))}
              </div>
              <span className="font-bold text-ink-900">{product.rating?.toFixed(1)}</span>
              <span className="text-ink-500">·</span>
              <span className="text-ink-600">{product.reviews_count?.toLocaleString("ro-RO")} recenzii</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight font-extrabold text-ink-900 mt-4 leading-[1.05]">
              {product.name}
            </h1>

            <p className="text-ink-700 text-base md:text-lg mt-4 leading-relaxed">{product.short_description}</p>

            {/* Bullets */}
            {product.bullets && product.bullets.length > 0 && (
              <ul className="mt-6 space-y-2.5" data-testid="bullets-list">
                {product.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-ink-800">
                    <div className={`w-5 h-5 ${theme.radius} ${theme.accentBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* Price */}
            <div className={`mt-8 p-5 ${theme.radiusLg} bg-ink-50 border border-ink-200`}>
              <div className="flex items-end gap-3 flex-wrap">
                <div className="font-display text-5xl md:text-6xl font-extrabold text-ink-900 tracking-tight leading-none">
                  {product.price.toFixed(0)} <span className="text-2xl">lei</span>
                </div>
                {product.old_price && (
                  <>
                    <div className="text-xl text-ink-400 line-through pb-1">{product.old_price.toFixed(0)} lei</div>
                    <div className={`${theme.accentBg} text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 ${theme.radius} mb-2`}>
                      -{discount}%
                    </div>
                  </>
                )}
              </div>
              {product.old_price && (
                <div className={`text-sm font-bold mt-2 ${theme.accentClass}`}>
                  Economisești {savings} lei azi.
                </div>
              )}
            </div>

            {/* Stock indicator */}
            {product.stock > 0 ? (
              <div className="mt-5 flex items-center gap-3" data-testid="stock-indicator">
                <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${theme.accentBg} rounded-full transition-all`}
                    style={{ width: `${Math.min(100, Math.max(15, (product.stock / 60) * 100))}%` }}
                  />
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${theme.accentClass}`}>
                  {product.stock <= 30 ? <><Flame className="w-3 h-3 inline -mt-0.5" /> Doar {product.stock} în stoc!</> : `${product.stock} în stoc`}
                </span>
              </div>
            ) : (
              <div className="mt-5 text-sm text-red-600 font-bold" data-testid="out-of-stock">Stoc epuizat</div>
            )}

            {/* Countdown */}
            <div className="mt-6">
              <CountdownTimer hours={product.offer_ends_in_hours || 24} accent={product.category === "industrial" ? "red-500" : product.category === "auto" ? "blue-500" : "brand-500"} dark={false} />
            </div>

            {/* Main CTA */}
            <a
              href="#comanda"
              className={`mt-7 inline-flex items-center justify-center gap-2 rounded-md ${theme.accentBg} ${theme.accentBgHover} text-white text-base md:text-lg font-bold px-8 py-4 transition-all hover:-translate-y-0.5 hover:shadow-2xl animate-pulse-ring`}
              data-testid="main-order-cta"
            >
              <Banknote className="w-5 h-5" />
              Comandă acum · Plată la livrare
              <ChevronRight className="w-5 h-5" />
            </a>

            {/* Mini trust */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-ink-700">
                <Truck className={`w-4 h-4 ${theme.accentClass}`} /> Livrare 1-3 zile
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink-700">
                <Banknote className={`w-4 h-4 ${theme.accentClass}`} /> Plată la livrare
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ink-700">
                <ShieldCheck className={`w-4 h-4 ${theme.accentClass}`} /> Retur 14 zile
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM/FRUSTRATION SECTION - Compact, visual-first */}
      {(product.problem_points?.length > 0 || product.problem_image) && (
        <section className="bg-gradient-to-br from-red-50 via-orange-50 to-white py-16 border-t border-red-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold">
                  <span className="text-lg">😟</span> Te confrunți cu asta?
                </div>
                <h2 className="font-display text-3xl md:text-4xl tracking-tight font-extrabold text-ink-900 mt-4">
                  Problema pe care o ai.
                </h2>
              </div>

              {/* Visual */}
              {(product.problem_image || product.problem_gif || (product.images && product.images.length > 0)) && (
                <div className="mb-8">
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-red-200 shadow-lg mx-auto max-w-2xl">
                    <img 
                      src={product.problem_gif || product.problem_image || product.images[0]} 
                      alt="Problema" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* 4 Problem Points */}
              {product.problem_points?.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {product.problem_points.slice(0, 4).map((point, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-red-100">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">✕</span>
                      <span className="text-sm text-ink-700 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* THE HARD TRUTH SECTION - Compact, visual-first */}
      {(product.consequences?.length > 0 || product.truth_image || product.truth_gif) && (
        <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-16 border-t border-amber-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-bold">
                  <span className="text-lg">⚠️</span> Adevărul dur
                </div>
                <h2 className="font-display text-3xl md:text-4xl tracking-tight font-extrabold text-ink-900 mt-4">
                  Ce se întâmplă dacă nu acționezi?
                </h2>
              </div>

              {/* Visual */}
              {(product.truth_image || product.truth_gif) && (
                <div className="mb-8">
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-amber-300 shadow-lg mx-auto max-w-2xl">
                    <img 
                      src={product.truth_gif || product.truth_image} 
                      alt="Adevărul dur" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* 4 Consequence Points */}
              {product.consequences?.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {product.consequences.slice(0, 4).map((point, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-amber-200">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</span>
                      <span className="text-sm text-ink-700 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* SOLUTION SECTION - Compact, visual-first */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-brand-50 py-16 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold">
                <span className="text-lg">✨</span> Soluția ta
              </div>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight font-extrabold text-ink-900 mt-4">
                Așa îți rezolvăm problema.
              </h2>
            </div>

            {/* Visual Demo - Videos, GIFs, Images */}
            {(product.demo_video || product.demo_gif || product.solution_images?.length > 0 || (product.images && product.images.length > 0)) && (
              <div className="mb-8">
                <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {product.demo_video && (
                    <div className="aspect-video rounded-lg overflow-hidden border-2 border-emerald-200 shadow-lg">
                      <video src={product.demo_video} controls className="w-full h-full object-cover" />
                    </div>
                  )}
                  {product.demo_gif && (
                    <div className="aspect-video rounded-lg overflow-hidden border-2 border-emerald-200 shadow-lg">
                      <img src={product.demo_gif} alt="Demo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {product.solution_images?.slice(0, 2).map((img, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden border-2 border-emerald-200 shadow-lg">
                      <img src={img} alt={`Soluție ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {!product.demo_video && !product.demo_gif && !product.solution_images?.length && product.images?.[0] && (
                    <div className="md:col-span-2 aspect-video rounded-lg overflow-hidden border-2 border-emerald-200 shadow-lg">
                      <img src={product.images[0]} alt="Soluție" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5-6 Solution Points */}
            {(product.solution_points?.length > 0 || product.benefits?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[...(product.solution_points || []), ...(product.benefits || [])].slice(0, 6).map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-emerald-100">
                    <div className={`flex-shrink-0 w-6 h-6 ${theme.radius} ${theme.accentBg} flex items-center justify-center mt-0.5`}>
                      <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
                    </div>
                    <span className="text-sm text-ink-700 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Description */}
      {product.description && (
        <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
          <div className={`text-[11px] uppercase tracking-widest font-bold ${theme.accentClass}`}>Despre produs</div>
          <h2 className="font-display text-3xl md:text-4xl text-ink-900 tracking-tight font-extrabold mt-3">
            Detalii complete
          </h2>
          <div className="mt-6 text-ink-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
            {product.description}
          </div>

          {/* Guarantee box */}
          <div className={`mt-10 p-6 ${theme.radiusLg} border-2 ${theme.accentBorder} ${theme.accentSoft}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${theme.radius} ${theme.accentBg} flex items-center justify-center shrink-0`}>
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`font-display font-extrabold text-xl ${theme.accentSoftText}`}>Garanție 100% satisfacție</h3>
                <p className="text-sm text-ink-700 mt-1.5">Dacă produsul nu funcționează conform descrierii, ai 14 zile să-l returnezi și primești banii înapoi integral. Fără întrebări.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reviews
          rating={product.rating || 4.8}
          count={product.reviews_count || 0}
          category={product.category}
          accentClass={theme.accentClass}
          productName={product.name}
        />
      </div>

      {/* Order form */}
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-center mb-8">
          <div className={`text-[11px] uppercase tracking-widest font-bold ${theme.accentClass}`}>Finalizează comanda</div>
          <h2 className="font-display text-3xl md:text-4xl text-ink-900 tracking-tight font-extrabold mt-3">
            Comandă în 60 de secunde
          </h2>
          <p className="text-sm md:text-base text-ink-600 mt-2.5">Plătești când primești coletul. Fără avans, fără carduri online.</p>
        </div>
        <PaperformEmbed
          url={product.paperform_url}
          productName={product.name}
          accentBg={theme.accentBg}
          accentText={theme.accentClass}
        />
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FAQ accentClass={theme.accentClass} />
      </div>
    </main>
  );
};

export default ProductLanding;
