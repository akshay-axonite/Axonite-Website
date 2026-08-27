import { Link } from "react-router-dom";
import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";
import SignalTrace from "../components/SignalTrace";
import { products, process } from "../data/content";

export default function Home() {
  const bgRef = useParallax(-0.15);
  const gridRef = useParallax(0.08);
  const heroTextRef = useParallax(0.05);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen bg-ink grain overflow-hidden flex items-center">
        <div
          ref={bgRef}
          data-parallax
          className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(56,230,181,0.16), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          ref={gridRef}
          data-parallax
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#3E5FE0 1px, transparent 1px), linear-gradient(90deg, #3E5FE0 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden="true"
        />

        <div
          ref={heroTextRef}
          data-parallax
          className="relative max-w-6xl mx-auto px-6 pt-22 md:pt-40 pb-24 w-full"
        >
          <p className="font-mono-label text-[14px] text-signal mb-6 ">
            Axonite Technology Pvt Ltd — Product Software
          </p>
          <h1 className="font-display text-paper text-5xl md:text-7xl font-semibold leading-[1.05] max-w-3xl">
            Software that stays useful after launch day.
          </h1>
          <p className="text-mist text-lg md:text-xl max-w-xl mt-6 leading-relaxed">
            We build and run product software for teams that can't afford
            downtime — finance ops, field service, workforce planning. Fewer
            features, all of them load-bearing.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/contact"
              className="text-white font-mono-label text-[11px] px-6 py-3.5 rounded-full transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(90deg, #9B4FC9, #3E5FE0, #29B6F6)" }}
            >
              Talk to us
            </Link>
            <Link
              to="/services"
              className="border border-line text-paper font-mono-label text-[11px] px-6 py-3.5 rounded-full hover:border-signal hover:text-signal transition-colors"
            >
              See what we build
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <SignalTrace className="w-full h-16 md:h-20" variant="light" />
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-paper py-28">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal-dim mb-4">
              What we run
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-xl">
              Three products, each doing one job well.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {products.map((p, i) => (
              <Reveal key={p.name} delay={i * 120}>
                <Link
                  to="/products"
                  className="block bg-white border border-line-soft rounded-2xl p-8 h-full hover:border-signal transition-colors"
                >
                  <p className="font-mono-label text-[12px] text-signal-dim mb-4">
                    {p.tag}
                  </p>
                  <h3 className="font-display text-2xl font-semibold mb-3">
                    {p.name}
                  </h3>
                  <p className="text-graphite text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={products.length * 120}>
            <div className="mt-10">
              <Link
                to="/products"
                className="font-mono-label text-[14px] text-signal-dim underline underline-offset-4"
              >
                See full product details
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROCESS / PARALLAX BAND */}
      <section className="relative bg-ink py-28 overflow-hidden">
        <ParallaxBand />
        <div className="relative max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal mb-4">
              How a project moves
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper max-w-xl">
              A process that doesn't hide the middle part.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-5 gap-6 mt-14">
            {process.map((step, i) => (
              <Reveal key={step.step} delay={i * 100}>
                <div className="border-t-2 border-signal pt-5">
                  <p className="font-mono-label text-[12px] text-mist mb-3">
                    0{i + 1}
                  </p>
                  <h3 className="font-display text-paper text-lg font-semibold mb-2">
                    {step.step}
                  </h3>
                  <p className="text-mist text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Have a product that needs building — or rebuilding?
            </h2>
            <p className="text-graphite mt-4 max-w-xl mx-auto">
              We take on a small number of projects at a time. Tell us where
              it stands today.
            </p>
            <Link
              to="/contact"
              className="inline-flex mt-8 bg-ink text-paper font-mono-label text-[11px] px-7 py-3.5 rounded-full hover:bg-signal hover:text-white transition-colors"
            >
              Get in touch
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function ParallaxBand() {
  const slow = useParallax(-0.1);
  const fast = useParallax(0.12);
  return (
    <>
      <div
        ref={slow}
        data-parallax
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-[0.08]"
        style={{
          background:
            "radial-gradient(ellipse at center, #3E5FE0, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div
        ref={fast}
        data-parallax
        className="absolute -bottom-10 -left-20 w-72 h-72 rounded-full opacity-[0.1]"
        style={{ background: "radial-gradient(circle, #9B4FC9, transparent 70%)" }}
        aria-hidden="true"
      />
    </>
  );
}
