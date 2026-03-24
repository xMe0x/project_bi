"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ---------- Animated grid background ----------
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#e0e0e0" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

// ---------- Animated scatter-plot decoration ----------
function ScatterDecoration() {
  const points = [
    { x: 12, y: 28, c: "#d4a843", size: 5, delay: 0 },
    { x: 22, y: 52, c: "#5b9bd5", size: 6, delay: 0.2 },
    { x: 35, y: 38, c: "#777777", size: 4, delay: 0.4 },
    { x: 48, y: 62, c: "#5b9bd5", size: 5, delay: 0.1 },
    { x: 58, y: 44, c: "#d4a843", size: 7, delay: 0.3 },
    { x: 70, y: 30, c: "#6abf8a", size: 5, delay: 0.5 },
    { x: 80, y: 55, c: "#777777", size: 6, delay: 0.15 },
    { x: 88, y: 35, c: "#d4a843", size: 4, delay: 0.35 },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.18 }}
    >
      <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="w-full h-full">
        {/* Regression line */}
        <line
          x1="10" y1="65"
          x2="92" y2="22"
          stroke="#8dbfe8"
          strokeWidth="0.4"
          strokeDasharray="2 1.5"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size * 0.45}
            fill={p.c}
            opacity="0.9"
          />
        ))}
      </svg>
    </div>
  );
}

// ---------- Animated counter ----------
function Counter({ target, suffix = "", duration = 1200 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const steps = 40;
    const inc = target / steps;
    let cur = 0;
    let step = 0;
    ref.current = setInterval(() => {
      step++;
      cur = Math.min(cur + inc, target);
      setVal(Math.round(cur * 100) / 100);
      if (step >= steps) clearInterval(ref.current!);
    }, duration / steps);
    return () => clearInterval(ref.current!);
  }, [target, duration]);

  return <span>{Number.isInteger(target) ? Math.round(val) : val.toFixed(2)}{suffix}</span>;
}

// ---------- Tag pill ----------
function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border"
      style={{ color, borderColor: color + "55", backgroundColor: color + "15" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}

// ---------- Feature card ----------
function FeatureCard({
  icon, title, desc, accent, delay,
}: {
  icon: string; title: string; desc: string; accent: string; delay: string;
}) {
  return (
    <div
      className="group relative bg-[#1e1e20] border border-[#2c2c2e] rounded-2xl p-5 flex flex-col gap-3 overflow-hidden transition-all duration-300 hover:border-[#3e3e44] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      style={{ animationDelay: delay }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }}
      />
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm font-bold text-[#f0f0f0] mb-1">{title}</p>
        <p className="text-[11px] text-[#666] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ---------- Stat block ----------
function Stat({ label, value, unit, accent }: { label: string; value: number; unit: string; accent: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-bold tracking-widest text-[#555] uppercase">{label}</p>
      <p className="text-2xl font-black tracking-tight" style={{ color: accent }}>
        <Counter target={value} suffix={unit} duration={1400} />
      </p>
    </div>
  );
}

// ---------- Main ----------
export default function IndexPage() {
  const router = useRouter();
  const [entered, setEntered] = useState(false);

  function go() {
    setEntered(true);
    setTimeout(() => router.push("/dashboard"), 320);
  }

  return (
    <div
      className="relative min-h-screen bg-[#141416] text-[#f0f0f0] overflow-hidden flex flex-col"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <GridBackground />
      <ScatterDecoration />

      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(91,155,213,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── HEADER ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#1e1e20]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#5b9bd5]/20 border border-[#5b9bd5]/40 flex items-center justify-center">
            <span className="text-[#5b9bd5] text-xs font-black">LR</span>
          </div>
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#555] uppercase">
            Linear Regression Lab
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tag color="#d4a843">sunny</Tag>
          <Tag color="#777777">overcast</Tag>
          <Tag color="#5b9bd5">rainy</Tag>
        </div>
      </header>

      {/* ── HERO ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-px bg-[#5b9bd5]/50" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#5b9bd5] uppercase">
            Gradient Descent · Feature Normalization
          </span>
          <div className="w-8 h-px bg-[#5b9bd5]/50" />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5 max-w-3xl">
          <span className="text-[#f0f0f0]">Predict Temperature</span>
          <br />
          <span
            className="inline-block"
            style={{
              background: "linear-gradient(135deg, #8dbfe8 0%, #5b9bd5 40%, #6abf8a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            from Humidity
          </span>
        </h1>

        {/* Hypothesis */}
        <div className="mb-8 bg-[#1a2630] border border-[#2a3e50] rounded-xl px-6 py-3 inline-block">
          <span className="text-xs text-[#5b9bd5] tracking-wider">
            h(x) = θ₀ + θ₁x &nbsp;·&nbsp; J(θ) = &frac12;m Σ(h(x⁽ⁱ⁾) − y⁽ⁱ⁾)²
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[#666] max-w-lg leading-relaxed mb-10">
          วิเคราะห์ความสัมพันธ์ระหว่าง <span className="text-[#8dbfe8]">ความชื้น</span> และ{" "}
          <span className="text-[#d4a843]">อุณหภูมิ</span> ด้วย Linear Regression<br />
          พร้อม Gradient Descent 10,000 iterations และ Feature Normalization
        </p>

        {/* CTA */}
        <button
          onClick={go}
          disabled={entered}
          className="group relative px-10 py-4 rounded-xl font-black text-sm tracking-widest uppercase text-[#141416] overflow-hidden transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #8dbfe8, #5b9bd5)" }}
        >
          <span className="relative z-10">Open Dashboard →</span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: "linear-gradient(135deg, #aad4f0, #6aaee0)" }} />
        </button>

        
      </main>

    

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-[#1e1e20] px-8 py-4 flex items-center justify-between">
        <span className="text-[10px] text-[#333]">
          x = humidity (%) · y = temperature (°F)
        </span>
        <span className="text-[10px] text-[#333]">
          Gradient Descent · 10,000 iter · α = 0.01
        </span>
      </footer>
    </div>
  );
}