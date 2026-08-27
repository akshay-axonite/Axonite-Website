import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";
import SignalTrace from "../components/SignalTrace";

const values = [
  {
    title: "Fewer, better products",
    desc: "We'd rather run three products well than eight adequately. Every product we ship, we intend to still be running in ten years.",
  },
  {
    title: "Slow to promise, fast to build",
    desc: "We scope carefully before we start, then move quickly once we do — so estimates hold and surprises don't.",
  },
  {
    title: "Built by the people who support it",
    desc: "The engineers who build a feature are the ones who get paged when it breaks. That keeps the code honest.",
  },
];

export default function About() {
  const bgRef = useParallax(-0.12);

  return (
    <div>
      <section className="relative bg-ink grain overflow-hidden pt-40 pb-24">
        <div
          ref={bgRef}
          data-parallax
          className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, #3E5FE0, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="font-mono-label text-[14px] text-signal mb-6">About Axonite</p>
          <h1 className="font-display text-paper text-4xl md:text-6xl font-semibold leading-tight">
            A small team building software we'd want to use ourselves.
          </h1>
          <p className="text-mist text-lg mt-6 max-w-2xl leading-relaxed">
            Axonite Technology Pvt Ltd started as three engineers frustrated
            with how much operations software gets in the way of the work it's
            meant to support. We build the alternative.
          </p>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal-dim mb-4">Where we work from</p>
            <h2 className="font-display text-3xl font-semibold mb-5">
              Pune, with a team that ships remotely too.
            </h2>
            <p className="text-graphite leading-relaxed mb-4">
              We're headquartered in Pune, Maharashtra, with engineers and
              designers working both in-office and remote. Most of our
              customers are operations teams across India who've outgrown
              spreadsheets but don't want enterprise software's overhead.
            </p>
            <p className="text-graphite leading-relaxed">
              We stay small on purpose — every person here can trace a support
              ticket back to the code they wrote.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="bg-white border border-line-soft rounded-2xl p-8">
              <SignalTrace className="w-full h-14 mb-6" variant="dark" />
              <dl className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="font-mono-label text-[10px] text-signal-dim mb-1">Founded</dt>
                  <dd className="font-display text-2xl font-semibold">2021</dd>
                </div>
                <div>
                  <dt className="font-mono-label text-[10px] text-signal-dim mb-1">Team</dt>
                  <dd className="font-display text-2xl font-semibold">24 people</dd>
                </div>
                <div>
                  <dt className="font-mono-label text-[10px] text-signal-dim mb-1">Products live</dt>
                  <dd className="font-display text-2xl font-semibold">3</dd>
                </div>
                <div>
                  <dt className="font-mono-label text-[10px] text-signal-dim mb-1">Based in</dt>
                  <dd className="font-display text-2xl font-semibold">Pune, IN</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal mb-4">What we hold to</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper max-w-xl">
              Three things that shape how we build.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 120}>
                <div className="border-t-2 border-signal pt-5 h-full">
                  <h3 className="font-display text-paper text-xl font-semibold mb-3">
                    {v.title}
                  </h3>
                  <p className="text-mist text-sm leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
