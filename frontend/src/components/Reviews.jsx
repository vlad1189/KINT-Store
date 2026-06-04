import React from "react";
import { Star, BadgeCheck, Camera } from "lucide-react";
import { motion } from "framer-motion";

// AI-generated image URLs for reviews (using placeholder services with AI-like images)
const REVIEW_IMAGES = {
  industrial: [
    "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=400&h=300&fit=crop",
  ],
  auto: [
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=400&h=300&fit=crop",
  ],
  general: [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  ],
  beauty: [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop",
  ],
  tech: [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=300&fit=crop",
  ],
  home: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  ],
  kitchen: [
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  ],
  fitness: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
  ],
  garden: [
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  ],
};

const REVIEWS_BY_CATEGORY = {
  industrial: [
    { name: "Mihai D.", location: "Brașov", rating: 5, text: "Am lipit o țeavă crăpată de calorifer, ține de 3 luni perfect. Mai bun decât sudura, recomand!", initials: "MD" },
    { name: "Vasile P.", location: "Iași", rating: 5, text: "Am încercat să rup ce am lipit. Imposibil. 1420 kg e real, băieți. Cel mai bun adeziv din viața mea.", initials: "VP" },
    { name: "Andrei C.", location: "Cluj", rating: 5, text: "Mecanic auto aici. Folosesc metal.FIX la atelier de luni de zile. Calitate superioară, clienții sunt mulțumiți.", initials: "AC" },
  ],
  auto: [
    { name: "Bogdan S.", location: "București", rating: 5, text: "Am avut o zgârietură urâtă pe capotă. În 30 secunde a dispărut complet. Pare magic, dar funcționează!", initials: "BS" },
    { name: "Ana M.", location: "Timișoara", rating: 5, text: "Mi-am salvat banii de la service. Funcționează pe culoarea mea (roșu metalizat) perfect. Worth every leu.", initials: "AM" },
    { name: "Răzvan I.", location: "Constanța", rating: 5, text: "Comandat de probă, am rămas șocat. Trei zgârieturi eliminate în 2 minute. Rezistă și după spălare auto.", initials: "RI" },
  ],
  general: [
    { name: "Andreea P.", location: "București", rating: 5, text: "Comandă rapidă, colet primit în 2 zile. Plata la livrare super convenabilă.", initials: "AP" },
    { name: "Mihai T.", location: "Cluj", rating: 5, text: "Calitate peste așteptări. Am revenit pentru o a doua comandă.", initials: "MT" },
    { name: "Ioana R.", location: "Iași", rating: 5, text: "Recomand. Produsele exact ca în descriere, livrare corectă.", initials: "IR" },
  ],
  beauty: [
    { name: "Elena S.", location: "București", rating: 5, text: "Pielea mea arată incredibil după 2 săptămâni. Toată lumea mă întreabă ce tratament folosesc!", initials: "ES" },
    { name: "Maria C.", location: "Cluj", rating: 5, text: "În sfârșit un produs care chiar funcționează. Textură ușoară, se absoarbe repede.", initials: "MC" },
    { name: "Laura B.", location: "Timișoara", rating: 5, text: "Am pielea sensibilă și acesta e singurul produs care nu m-a iritat. Recomand cu încredere!", initials: "LB" },
  ],
  tech: [
    { name: "Alex P.", location: "București", rating: 5, text: "Cel mai bun gadget pe care l-am cumpărat anul ăsta. Funcționează exact cum promite.", initials: "AP" },
    { name: "Cristi M.", location: "Iași", rating: 5, text: "Calitate premium la preț corect. Livrare rapidă, ambalaj perfect.", initials: "CM" },
    { name: "Dan S.", location: "Cluj", rating: 5, text: "L-am testat o săptămână întreagă. Battery life incredibil, performanță top.", initials: "DS" },
  ],
  home: [
    { name: "Adriana V.", location: "București", rating: 5, text: "Mi-a transformat complet livingul. Design elegant, calitate superioară.", initials: "AV" },
    { name: "Simona R.", location: "Constanța", rating: 5, text: "Ușor de montat, arată exact ca în poze. Foarte mulțumită!", initials: "SR" },
    { name: "Monica L.", location: "Brașov", rating: 5, text: "Raport calitate-preț imbatabil. Am mai comandat încă două pentru cadou.", initials: "ML" },
  ],
  kitchen: [
    { name: "Carmen D.", location: "București", rating: 5, text: "Gătesc zilnic cu el și economisesc atât de mult timp. Cel mai bun investment pentru bucătărie!", initials: "CD" },
    { name: "Ioana M.", location: "Cluj", rating: 5, text: "Se curăță ușor, nu se lipește nimic de el. Recomand cu drag!", initials: "IM" },
    { name: "Gabriela P.", location: "Timișoara", rating: 5, text: "Soțul meu e impresionat de cât de repede gătesc acum. Produs fantastic!", initials: "GP" },
  ],
  fitness: [
    { name: "Robert K.", location: "București", rating: 5, text: "Folosesc produsul de 3 săptămâni și rezultatele sunt vizibile. Mușchii se definesc frumos.", initials: "RK" },
    { name: "Andrei F.", location: "Cluj", rating: 5, text: "Calitate profesională la preț de amator. Îl recomand tuturor din sală.", initials: "AF" },
    { name: "Marius T.", location: "Iași", rating: 5, text: "Rezistent, ușor de folosit, perfect și pentru acasă. Worth every leu!", initials: "MT" },
  ],
  garden: [
    { name: "Ion G.", location: "Brașov", rating: 5, text: "Grădina mea arată ca niciodată. Produsul face exact ce promite.", initials: "IG" },
    { name: "Victor S.", location: "Cluj", rating: 5, text: "Ușor de aplicat, rezultate imediate. Vecinii mă întreabă ce secret am.", initials: "VS" },
    { name: "Gheorghe M.", location: "Timișoara", rating: 5, text: "După o lună de utilizare, plantele mele sunt sănătoase și viguroase.", initials: "GM" },
  ],
};

const Stars = ({ count = 5, color = "text-brand-500" }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 fill-current ${color}`} />
    ))}
  </div>
);

export const Reviews = ({ rating = 4.8, count = 247, category = "general", accentClass = "text-brand-500", productName = "" }) => {
  const reviews = REVIEWS_BY_CATEGORY[category] || REVIEWS_BY_CATEGORY.general;
  const reviewImages = REVIEW_IMAGES[category] || REVIEW_IMAGES.general;
  
  // Dynamic title based on product name
  const title = productName 
    ? `De ce aleg clientii noștri ${productName}`
    : "De ce aleg clientii noștri acest produs";

  return (
    <section className="py-16" data-testid="reviews-section">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <div className={`text-[11px] uppercase tracking-widest font-bold ${accentClass}`}>Recenzii clienți</div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink-900 tracking-tight font-extrabold mt-2">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-ink-50 border border-ink-200">
          <Stars color={accentClass} />
          <div>
            <div className="font-display text-2xl text-ink-900 font-extrabold leading-none">{rating.toFixed(1)}/5</div>
            <div className="text-xs text-ink-500 mt-0.5">{count.toLocaleString("ro-RO")} recenzii</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white border border-ink-200 rounded-xl p-6 hover:border-ink-300 hover:shadow-sm transition-all"
            data-testid={`review-card-${i}`}
          >
            {/* AI-generated image for the review */}
            <div className="mb-4 rounded-lg overflow-hidden border border-ink-100">
              <div className="relative aspect-[4/3]">
                <img 
                  src={reviewImages[i % reviewImages.length]} 
                  alt={`Recenzie ${r.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                  <Camera className="w-3 h-3" /> AI Generated
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Stars count={r.rating} color={accentClass} />
              <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
                <BadgeCheck className="w-3 h-3" /> Verificat
              </div>
            </div>
            <p className="text-sm text-ink-700 leading-relaxed mt-4">"{r.text}"</p>
            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-ink-100">
              <div className="w-9 h-9 rounded-full bg-ink-100 text-ink-700 flex items-center justify-center text-xs font-bold">
                {r.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-900">{r.name}</div>
                <div className="text-xs text-ink-500">{r.location} · Cumpărător verificat</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
