import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight, Flame } from "lucide-react";
import { getTheme } from "../lib/themes";

export const ProductCard = ({ product, index = 0 }) => {
  const theme = getTheme(product.category);
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.21, 0.6, 0.32, 1] }}
      className="group"
      data-testid={`product-card-${product.slug}`}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink-100 border border-ink-200">
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2">
            {discount > 0 && (
              <div className="bg-brand-500 text-white text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded">
                -{discount}%
              </div>
            )}
            {product.stock <= 30 && product.stock > 0 && (
              <div className="ml-auto bg-white/95 backdrop-blur text-ink-900 text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded inline-flex items-center gap-1">
                <Flame className="w-3 h-3 text-brand-500" />
                Stoc limitat
              </div>
            )}
          </div>

          {/* Category label */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className={`text-[10px] uppercase tracking-[0.2em] text-white font-bold px-2.5 py-1 rounded ${theme.accentBg}`}>
              {theme.label}
            </div>
          </div>

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="mt-5 px-1">
          <div className="flex items-center gap-2 text-xs text-ink-500 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 0) ? "fill-brand-500 text-brand-500" : "text-ink-300"}`} />
              ))}
            </div>
            <span className="font-semibold text-ink-900">{product.rating?.toFixed(1)}</span>
            <span>({product.reviews_count?.toLocaleString("ro-RO")})</span>
          </div>

          <h3 className="font-display text-xl md:text-2xl text-ink-900 leading-tight tracking-tight font-bold">
            {product.name}
          </h3>
          <p className="text-sm text-ink-600 mt-2 line-clamp-2">{product.short_description}</p>

          <div className="mt-5 flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl text-ink-900 font-extrabold tracking-tight">
                {product.price.toFixed(0)} <span className="text-base font-bold">lei</span>
              </span>
              {product.old_price && (
                <span className="text-sm text-ink-400 line-through">{product.old_price.toFixed(0)} lei</span>
              )}
            </div>
            <span
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all"
              data-testid={`product-card-cta-${product.slug}`}
            >
              Vezi oferta <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
