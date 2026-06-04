import React, { useEffect, useState, useMemo } from "react";
import { Clock } from "lucide-react";

export const CountdownTimer = ({ hours = 24, accent = "brand-500", dark = false }) => {
  const endTime = useMemo(() => Date.now() + hours * 60 * 60 * 1000, [hours]);
  const [remaining, setRemaining] = useState(endTime - Date.now());

  useEffect(() => {
    const t = setInterval(() => setRemaining(Math.max(0, endTime - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endTime]);

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");

  const containerCls = dark
    ? "bg-white/5 border-white/10 backdrop-blur-sm"
    : "bg-ink-900";
  const labelCls = dark ? "text-white/60" : "text-white/60";
  const valueCls = dark ? "text-white" : "text-white";

  const Box = ({ value, label }) => (
    <div className="flex flex-col items-center min-w-[60px]">
      <div className={`font-display font-extrabold text-3xl md:text-4xl tabular-nums ${valueCls}`}>{pad(value)}</div>
      <div className={`text-[10px] uppercase tracking-widest mt-1 font-semibold ${labelCls}`}>{label}</div>
    </div>
  );

  return (
    <div className={`flex items-center gap-4 rounded-lg border px-5 py-4 ${containerCls}`} data-testid="countdown-timer">
      <Clock className={`w-6 h-6 shrink-0 text-${accent}`} />
      <div className="flex-1">
        <div className={`text-[11px] font-bold uppercase tracking-wider text-${accent}`}>
          Oferta expiră în
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <Box value={h} label="ore" />
          <span className="text-2xl text-white/40 font-light">:</span>
          <Box value={m} label="min" />
          <span className="text-2xl text-white/40 font-light">:</span>
          <Box value={s} label="sec" />
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
