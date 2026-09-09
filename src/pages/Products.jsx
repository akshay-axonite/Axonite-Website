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
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalHeight = rect.height - windowHeight;
      const currentScroll = windowHeight - rect.top;
      
      let progress = currentScroll / totalHeight;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-ink grain overflow-hidden pt-40 pb-24">
        <div
          ref={bgRef}
          className="absolute -top-32 -left-24 w-[560px] h-[560px] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, #3E5FE0, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          ref={gridRef}
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#3E5FE0 1px, transparent 1px), linear-gradient(90deg, #3E5FE0 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="font-mono-label text-[14px] text-signal mb-6">Products</p>
          <h1 className="font-display text-paper text-4xl md:text-6xl font-semibold leading-tight">
            Three products. Each one earns its keep on its own.
          </h1>
          <p className="text-mist text-lg mt-6 max-w-2xl leading-relaxed">
            We don't bundle features into one sprawling platform. Every
            product here solves one operational problem, and nothing else.
          </p>
        </div>
      </section>

      {/* Scroll-Driven Winding Spiral Path Section */}
      <section ref={containerRef} className="relative bg-paper py-32 overflow-hidden">
        
        {/* Background SVG Winding Spiral Track */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-15">
          <svg className="w-full h-full" viewBox="0 0 600 1200" fill="none" preserveAspectRatio="none">
            <path
              d="M300 0 C 100 200, 100 400, 300 600 C 500 800, 500 1000, 300 1200"
              stroke="#3E5FE0"
              strokeWidth="4"
              strokeDasharray="8 8"
            />
            <path
              d="M300 0 C 100 200, 100 400, 300 600 C 500 800, 500 1000, 300 1200"
              stroke="#3E5FE0"
              strokeWidth="4"
              strokeDashoffset={`${1000 - scrollProgress * 1000}`}
              strokeDasharray="1000"
            />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative space-y-36">
          {products.map((p, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div 
                key={p.name} 
                className={`relative flex flex-col md:flex-row items-center gap-12 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Product Content Card */}
                <div className="w-full md:w-1/2">
                  <Reveal>
                    <div className="bg-ink rounded-3xl p-8 grain shadow-2xl border border-white/5 relative overflow-hidden">
                    
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono-label text-[11px] px-3 py-1 rounded-full bg-signal/20 text-paper ">
                          0{i + 1} // {p.tag}
                        </span>
                        <div className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
                        
                      </div>
                      <SignalTrace className="w-full h-8 mb-3" variant="light" />
                      {/* <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3 text-paper">
                        {p.name}
                      </h2> */}
                      <p className="text-mist leading-relaxed text-sm mb-4">
                        {p.desc}
                      </p>

                      {/* <div className="bg-white/5 rounded-xl p-4 mb-6">
                        <SignalTrace className="w-full h-8 mb-3" variant="light" />
                        <ul className="space-y-2">
                          {p.features.map((f) => (
                            <li key={f} className="flex gap-2 text-paper text-xs leading-relaxed">
                              <span className="text-signal">—</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div> */}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
                        <span className="text-xs text-mist/70">Best for: {p.idealFor}</span>
                        <Link
                          to="/contact"
                          className="inline-flex bg-signal text-white font-mono-label text-[10px] px-5 py-2.5 rounded-full hover:bg-white hover:text-ink transition-colors justify-center"
                        >
                          Request demo
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Center Spiral Node Graphic */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-ink border-4 border-signal items-center justify-center shadow-lg z-20">
                  <span className="font-mono-label text-xs text-white">0{i + 1}</span>
                </div>

                {/* Balancing Empty Spacer for Flex Alignment */}
                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-ink py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-paper">
              Not sure which one fits your workflow?
            </h2>
            <p className="text-mist mt-3">
              Tell us about the problem you're solving and we'll point you to
              the right one — or tell you honestly if none of them fit yet.
            </p>
            <Link
              to="/contact"
              className="inline-flex mt-7 text-white font-mono-label text-[11px] px-7 py-3.5 rounded-full transition-opacity hover:opacity-90"
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