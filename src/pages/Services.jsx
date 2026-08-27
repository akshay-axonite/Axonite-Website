import { Link } from "react-router-dom";
import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";
import { services, process, products } from "../data/content";

export default function Services() {
  const bgRef = useParallax(-0.12);

  return (
    <div>
      <section className="relative bg-ink grain overflow-hidden pt-40 pb-24">
        <div
          ref={bgRef}
          data-parallax
          className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, #3E5FE0, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="font-mono-label text-[14px] text-signal mb-6">Services</p>
          <h1 className="font-display text-paper text-4xl md:text-6xl font-semibold leading-tight">
            We build the product, then we keep it running.
          </h1>
          <p className="text-mist text-lg mt-6 max-w-2xl leading-relaxed">
            Whether you need a product built from a blank page or an existing
            one rescued from years of quick fixes, the engagement looks the
            same: one team, accountable end to end.
          </p>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="bg-white border border-line-soft rounded-2xl p-8 h-full hover:border-signal transition-colors">
                  <p className="font-mono-label text-[12px] text-signal-dim mb-4">
                    0{i + 1}
                  </p>
                  <h3 className="font-display text-2xl font-semibold mb-3">
                    {s.title}
                  </h3>
                  <p className="text-graphite leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal mb-4">Engagement flow</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper max-w-xl">
              Five stages, repeated every release.
            </h2>
          </Reveal>
          <div className="mt-14 space-y-0">
            {process.map((step, i) => (
              <Reveal key={step.step} delay={i * 80}>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 py-6 border-b border-line">
                  <span className="font-mono-label text-signal text-sm w-16 shrink-0">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-paper text-xl font-semibold w-full md:w-48 shrink-0">
                    {step.step}
                  </h3>
                  <p className="text-mist text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal-dim mb-4">Products we run today</p>
            <h2 className="font-display text-3xl font-semibold max-w-xl">
              Some of this shows up in our own products.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {products.map((p, i) => (
              <Reveal key={p.name} delay={i * 100}>
                <div className="border border-line-soft rounded-2xl p-7 h-full">
                  <p className="font-mono-label text-[12px] text-signal-dim mb-3">{p.tag}</p>
                  <h3 className="font-display text-xl font-semibold mb-2">{p.name}</h3>
                  <p className="text-graphite text-sm leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="text-center mt-14 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex justify-center border border-line-soft font-mono-label text-[11px] px-7 py-3.5 rounded-full hover:border-signal hover:text-signal-dim transition-colors"
              >
                See full product details
              </Link>
              <Link
                to="/contact"
                className="inline-flex justify-center bg-ink text-paper font-mono-label text-[11px] px-7 py-3.5 rounded-full hover:bg-signal hover:text-white transition-colors"
              >
                Discuss your project
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
