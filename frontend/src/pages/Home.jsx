import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star, Zap, Users } from "lucide-react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";
import FAQ from "../components/FAQ";
import Reviews from "../components/Reviews";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("active", "==", true),
          limit(200)
        );
        const querySnapshot = await getDocs(q);
        const productsList = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });
        // Sort by created_at descending
        productsList.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB - dateA;
        });
        setProducts(productsList);
      } catch (e) {
        console.error("Error fetching products:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main data-testid="home-page" className="bg-white">
      {/* HERO - light, airy, conversion-focused */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-brand-50/60 to-white text-ink-900">
        <div className="absolute inset-0 bg-grid-dark opacity-50" />
        <div className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-brand-300/30 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-brand-200/40 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-28 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-200 px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Produse alese cu grijă · Plată la livrare în toată țara</span>
            </div>

            <h1 className="font-display tracking-tight text-ink-900 mt-7 text-5xl sm:text-6xl lg:text-7xl leading-[0.95] font-extrabold">
              <span className="text-brand-600">Noi îți rezolvam</span><br/>
              <span className="shimmer-text">problema.</span>
            </h1>

            <p className="mt-7 text-base md:text-lg text-ink-600 max-w-xl leading-relaxed">
              Fie că e vorba de casă, mașină, frumusețe sau pasiuni — avem produsul care îți simplifică viața. Comanzi în 60 de secunde, plătești când primești.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#produse"
                className="group inline-flex items-center gap-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-base font-bold px-8 py-4 transition-all hover:-translate-y-0.5 hover:shadow-2xl shadow-brand-500/40 animate-pulse-ring"
                data-testid="hero-cta-shop"
              >
                Vezi produsele <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex items-center gap-3 text-sm text-ink-600">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 border-2 border-white" />
                  ))}
                </div>
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 fill-brand-500 text-brand-500" />)}
                    <span className="font-bold text-ink-900 ml-1">4.9</span>
                  </div>
                  <span className="text-xs text-ink-500">Peste 13.000 clienți mulțumiți</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <div className="relative border-t border-brand-100 bg-white/70 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            {[
              { v: "13K+", l: "Clienți mulțumiți" },
              { v: "1-3 zile", l: "Timp de livrare" },
              { v: "100%", l: "Plată la livrare" },
              { v: "14 zile", l: "Drept de retur" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="md:flex md:items-baseline md:gap-3"
              >
                <div className="font-display text-2xl md:text-3xl font-extrabold text-brand-600">{s.v}</div>
                <div className="text-xs uppercase tracking-wider text-ink-500 font-semibold">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="produse" className="max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-14"
        >
          <div className="text-[11px] uppercase tracking-widest text-brand-600 font-bold">Colecția săptămânii</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink-900 tracking-tight font-extrabold mt-3 leading-[1.05]">
            Produse care chiar fac diferența.
          </h2>
          <p className="text-ink-600 text-base md:text-lg mt-4 leading-relaxed">
            Selectate manual, testate de mii de clienți, livrate cu plată la livrare în toată România.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-10">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-ink-100 rounded-xl" />
                <div className="h-4 bg-ink-100 rounded mt-4 w-1/3" />
                <div className="h-6 bg-ink-100 rounded mt-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-ink-500 text-center py-12" data-testid="no-products">Nu există produse disponibile.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-14" data-testid="products-grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-ink-50 border-y border-ink-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-24">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="text-[11px] uppercase tracking-widest text-brand-600 font-bold">Cum funcționează</div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink-900 tracking-tight font-extrabold mt-3">
              3 pași simpli.<br/>Fără bătăi de cap.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: Sparkles, title: "Alegi produsul", desc: "Răsfoiești produsele și apeși pe butonul de comandă." },
              { n: "02", icon: Zap, title: "Completezi formularul", desc: "Date de livrare, în mai puțin de 60 de secunde. Fără carduri." },
              { n: "03", icon: Truck, title: "Plătești la livrare", desc: "Coletul ajunge în 1-3 zile. Plătești curierului când îl primești." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white border border-ink-200 rounded-xl p-7 hover:border-brand-300 hover:shadow-md transition-all"
              >
                <div className="font-display font-extrabold text-7xl text-ink-100 absolute top-3 right-5 select-none">{s.n}</div>
                <div className="w-11 h-11 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-ink-900 mt-5 relative">{s.title}</h3>
                <p className="text-sm text-ink-600 mt-2 leading-relaxed relative">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reviews rating={4.9} count={13427} category="general" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FAQ />
      </div>
    </main>
  );
};

export default Home;
