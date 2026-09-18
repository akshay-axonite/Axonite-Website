import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";
import SignalTrace from "../components/SignalTrace";
import { products } from "../data/content";

export default function Products() {
  const bgRef = useParallax(-0.12);
  const gridRef = useParallax(0.06);

  const containerRef = useRef(null);
  const pathRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [trackerPos, setTrackerPos] = useState({ x: 500, y: 40 });
  const [totalLength, setTotalLength] = useState(2000);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setTotalLength(length);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !pathRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height - windowHeight;
      const currentScroll = windowHeight - rect.top;

      let progress = currentScroll / totalHeight;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);

      const path = pathRef.current;
      const currentLength = progress * totalLength;
      const point = path.getPointAtLength(currentLength);
      setTrackerPos({ x: point.x, y: point.y });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalLength]);

  // Scaled down spiral path coordinates to match the tighter spacing
  const spiralPathData = `
    M 500 40
    C 860 40,   960 220, 720 380
    C 460 540,  80 440,  180 660
    C 280 880,  920 740, 840 980
    C 740 1220, 160 1140, 360 1380
    C 560 1620, 900 1540, 500 1760
  `;

  return (
    <div className="overflow-x-hidden bg-paper">
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-card-float {
          animation: floatSlow 6s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-ink grain overflow-hidden pt-36 pb-24">
  <div
    ref={bgRef}
    className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full opacity-[0.15]"
    style={{ background: "radial-gradient(circle, #3E5FE0, transparent 70%)" }}
    aria-hidden="true"
  />
  <div
    ref={gridRef}
    className="absolute inset-0 opacity-[0.05]"
    style={{
      backgroundImage:
        "linear-gradient(#3E5FE0 1px, transparent 1px), linear-gradient(90deg, #3E5FE0 1px, transparent 1px)",
      backgroundSize: "50px 50px",
    }}
    aria-hidden="true"
  />
  <div className="relative max-w-5xl mx-auto px-6 text-left">
    <div className="max-w-3xl">
      <p className="font-mono-label text-[13px] text-signal mb-4">Product Systems</p>
      <h1 className="font-display text-paper text-3xl md:text-5xl font-semibold leading-tight">
        Engineered as discrete organs. Unified by design.
      </h1>
      <p className="text-mist text-base mt-4 max-w-xl leading-relaxed">
        Every product operates along an independent axis of efficiency—zero
        shared bloat, maximum specialized performance.
      </p>
    </div>
  </div>
</section>
      {/* Continuous Spiral Section with tighter vertical spacing */}
      <section ref={containerRef} className="relative py-20 overflow-hidden">
        {/* Dynamic Background SVG Spiral Track */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
          <svg
            className="w-full max-w-5xl h-full"
            viewBox="0 0 1000 1800"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="neonSpine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9B4FC9" />
                <stop offset="50%" stopColor="#3E5FE0" />
                <stop offset="100%" stopColor="#29B6F6" />
              </linearGradient>

              <filter id="spiralGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={spiralPathData}
              stroke="#212638"
              strokeWidth="3"
              strokeOpacity="0.08"
            />
            <path
              d={spiralPathData}
              stroke="#3E5FE0"
              strokeWidth="1.5"
              strokeOpacity="0.22"
              strokeDasharray="6 8"
            />

            <path
              ref={pathRef}
              d={spiralPathData}
              stroke="url(#neonSpine)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={totalLength}
              strokeDashoffset={totalLength - scrollProgress * totalLength}
              filter="url(#spiralGlow)"
              style={{ transition: "stroke-dashoffset 0.08s linear" }}
            />

            <g
              transform={`translate(${trackerPos.x}, ${trackerPos.y})`}
              className="transition-transform duration-75 ease-out"
            >
              <circle r="12" fill="#3E5FE0" opacity="0.25" className="animate-ping" />
              <circle r="7" fill="#29B6F6" opacity="0.8" />
              <circle r="3.5" fill="#FFFFFF" />
            </g>
          </svg>
        </div>

        {/* Compact & Animated Cards Along the Spiral */}
        <div className="max-w-5xl mx-auto px-6 relative space-y-16 md:space-y-24">
          {products.map((p, i) => {
            const isLeft = i % 2 === 0;

            const lateralAlignment = isLeft
              ? "md:mr-auto md:ml-4 lg:ml-10"
              : "md:ml-auto md:mr-4 lg:mr-10";

            return (
              <div
                key={p.name || i}
                className={`relative flex flex-col ${
                  isLeft ? "md:items-start" : "md:items-end"
                } items-center`}
              >
                {/* Node Radar Marker */}
                <div
                  className={`hidden md:flex absolute top-10 z-20 items-center gap-3 ${
                    isLeft
                      ? "left-[calc(100%+20px)] flex-row"
                      : "right-[calc(100%+20px)] flex-row-reverse"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 rounded-xl bg-ink/90 backdrop-blur-md border border-signal/40 shadow-lg flex items-center justify-center relative z-10 transition-transform duration-300 hover:scale-110">
                      <span className="font-mono-label text-[10px] text-signal font-bold">
                        0{i + 1}
                      </span>
                    </div>
                    <div className="absolute inset-0 rounded-xl border border-signal/25 animate-ping -z-0" />
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`h-[1px] w-14 ${
                        isLeft
                          ? "bg-gradient-to-r from-signal to-transparent"
                          : "bg-gradient-to-l from-signal to-transparent"
                      }`}
                    />
                    <div className="w-1.5 h-1.5 rounded-full bg-signal/70 shadow-[0_0_6px_#3E5FE0]" />
                  </div>
                </div>

                {/* Animated Compact Card (max-w-md) */}
                <div className={`w-full max-w-sm sm:max-w-md ${lateralAlignment}`}>
                  <Reveal delay={i * 120}>
                    <div
                      className="animate-card-float group relative rounded-2xl p-[1px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(62,95,224,0.35)]"
                      style={{
                        animationDelay: `${i * 1.5}s`,
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(62,95,224,0.15) 50%, rgba(255,255,255,0.03) 100%)",
                      }}
                    >
                      {/* Inner Card Body */}
                      <div className="bg-ink/95 rounded-2xl p-6 sm:p-7 grain border border-white/5 relative overflow-hidden backdrop-blur-md transition-colors group-hover:border-signal/40">
                        {/* Header Pill */}
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-mono-label text-[10px] text-paper">
                            <span className="w-1.5 h-1.5 rounded-full bg-signal shadow-[0_0_5px_#3E5FE0]" />
                            0{i + 1} // {p.tag}
                          </span>
                          <span className="font-mono-label text-[9px] text-mist/40 tracking-wider">
                            NODE-0{i + 1}
                          </span>
                        </div>

                        <SignalTrace className="w-full h-6 mb-3 opacity-70 group-hover:opacity-100 transition-opacity" variant="light" />

                        {p.name && (
                          <h2 className="font-display text-xl sm:text-2xl font-semibold mb-2 text-paper tracking-tight group-hover:text-signal transition-colors">
                            {p.name}
                          </h2>
                        )}

                        <p className="text-mist leading-relaxed text-xs sm:text-sm mb-5 line-clamp-3">
                          {p.desc}
                        </p>

                        {/* Card Bottom / Actions */}
                        <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-white/10">
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] uppercase font-mono-label text-mist/50 block">
                              Best for
                            </span>
                            <span className="text-[11px] text-mist truncate block">
                              {p.idealFor}
                            </span>
                          </div>

                          <Link
                            to="/contact"
                            className="inline-flex items-center justify-center bg-signal hover:bg-white text-white hover:text-ink font-mono-label text-[10px] uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-200 shadow shrink-0"
                          >
                            Demo
                            <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                              →
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-ink py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-paper leading-tight">
              Not sure which one fits your workflow?
            </h2>
            <p className="text-mist mt-3 text-sm leading-relaxed">
              Tell us about the problem you're solving and we'll point you to
              the right one — or tell you honestly if none of them fit yet.
            </p>
            <Link
              to="/contact"
              className="inline-flex mt-6 text-white font-mono-label text-[10px] uppercase tracking-widest px-7 py-3 rounded-full transition-transform hover:scale-105 shadow-xl"
              style={{ background: "linear-gradient(90deg, #9B4FC9, #3E5FE0, #29B6F6)" }}
            >
              Talk to us
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}