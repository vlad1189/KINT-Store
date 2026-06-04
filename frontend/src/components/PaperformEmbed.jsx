import React from "react";
import { ShieldCheck, Truck, Banknote, Lock } from "lucide-react";

export const PaperformEmbed = ({ url, productName, accentBg = "bg-brand-500", accentText = "text-brand-700" }) => {
  const hasForm = url && url.trim().length > 0;

  return (
    <div id="comanda" className="rounded-xl border border-ink-200 bg-white overflow-hidden shadow-xl shadow-ink-200/50" data-testid="paperform-section">
      <div className={`${accentBg} text-white px-6 py-5 flex items-center justify-between`}>
        <div>
          <div className="text-[11px] uppercase tracking-widest font-bold text-white/80">Comandă rapidă</div>
          <div className="font-display text-xl font-extrabold mt-0.5">Plată la livrare · Fără avans</div>
        </div>
        <Lock className="w-7 h-7 text-white/80" />
      </div>

      {hasForm ? (
        <iframe
          src={url}
          title={`Comandă ${productName}`}
          className="w-full"
          style={{ height: "780px", border: 0 }}
          data-testid="paperform-iframe"
        />
      ) : (
        <div className="p-8 text-center" data-testid="paperform-placeholder">
          <div className="w-14 h-14 mx-auto rounded-full bg-ink-50 flex items-center justify-center">
            <ShieldCheck className={`w-7 h-7 ${accentText}`} />
          </div>
          <h3 className="font-display text-xl md:text-2xl text-ink-900 mt-5 tracking-tight font-bold">
            Formular de comandă
          </h3>
          <p className="text-sm text-ink-600 mt-2 max-w-md mx-auto">
            Setează link-ul formularului Paperform din panoul de admin → editează produsul → câmpul <span className="font-mono text-xs bg-ink-100 px-1.5 py-0.5 rounded">Link Paperform</span>.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto text-left">
            <div className="rounded-md bg-ink-50 p-3">
              <Truck className={`w-4 h-4 ${accentText}`} />
              <div className="text-xs font-semibold text-ink-900 mt-2">Livrare 1-3 zile</div>
            </div>
            <div className="rounded-md bg-ink-50 p-3">
              <Banknote className={`w-4 h-4 ${accentText}`} />
              <div className="text-xs font-semibold text-ink-900 mt-2">Plată la livrare</div>
            </div>
            <div className="rounded-md bg-ink-50 p-3">
              <ShieldCheck className={`w-4 h-4 ${accentText}`} />
              <div className="text-xs font-semibold text-ink-900 mt-2">Retur 14 zile</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperformEmbed;
