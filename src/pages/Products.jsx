import { Link } from "react-router-dom";
import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";
import SignalTrace from "../components/SignalTrace";
import { products } from "../data/content";

export default function Products() {
  const bgRef = useParallax(-0.12);
  const gridRef = useParallax(0.06);

  return (
    <div>
      <section className="relative bg-ink grain overflow-hidden pt-40 pb-24">
        <div
          ref={bgRef}
          data-parallax
          className="absolute -top-32 -left-24 w-[560px] h-[560px] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, #3E5FE0, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          ref={gridRef}
          data-parallax
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

      {products.map((p, i) => (
        <section
          key={p.name}
          className={i % 2 === 0 ? "bg-paper py-24" : "bg-white py-24"}
        >
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
            <Reveal className={i % 2 === 1 ? "md:order-2" : ""}>
              <p className="font-mono-label text-[12px] text-signal-dim mb-4">
                {p.tag}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                {p.name}
              </h2>
              <p className="text-graphite leading-relaxed mb-5 max-w-lg">
                {p.desc}
              </p>
              <p className="text-sm text-ink/70 mb-6 max-w-lg">
                <span className="font-mono-label text-[12px] text-signal-dim block mb-1">
                  Best for
                </span>
                {p.idealFor}
              </p>
              <div className="flex gap-3">
                <Link
                  to="/contact"
                  className="inline-flex bg-ink text-paper font-mono-label text-[11px] px-6 py-3 rounded-full hover:bg-signal hover:text-white transition-colors"
                >
                  Request a demo
                </Link>
              </div>
            </Reveal>

            <Reveal delay={100} className={i % 2 === 1 ? "md:order-1" : ""}>
              <div className="bg-ink rounded-2xl p-8 grain relative overflow-hidden">
                <SignalTrace className="w-full h-12 mb-6" variant="light" />
                <ul className="space-y-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 text-paper text-sm leading-relaxed">
                      <span className="text-signal mt-1">—</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

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
