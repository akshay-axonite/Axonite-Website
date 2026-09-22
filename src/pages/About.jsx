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

const facts = [
  { label: "Founded", value: "2026" },
  { label: "Team", value: "11 people" },
  { label: "Products live", value: "3" },
  { label: "Based in", value: "Pune - IN & US" },
];

export default function About() {
  return (
    <div>
      <section className="relative bg-paper ambient-wash overflow-hidden pt-32 pb-20 section-rule">
        <div className="relative max-w-prose mx-auto px-6">
          <p className="eyebrow mb-5">About Axonite</p>
          <h1 className="text-display">
           A scalable team building software we'd want to use ourselves.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[1.125rem] leading-relaxed text-ink-2">
            Axonite Technology Pvt Ltd started as three engineers frustrated
            with how much operations software gets in the way of the work it's
            meant to support. We build the alternative.
          </p>
        </div>
      </section>

      <section className="bg-white py-24 section-rule">
        <div className="max-w-container mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <p className="eyebrow mb-4">Where we work from</p>
            <h2 className="text-display-xs mb-5">
              Pune, with a team that ships remotely too.
            </h2>
            <p className="text-ink-2 leading-relaxed mb-4">
              We're headquartered in Pune, Maharashtra, with engineers and
              designers working both in-office and remote. Most of our
              customers are operations teams across India who've outgrown
              spreadsheets but don't want enterprise software's overhead.
            </p>
            <p className="text-ink-2 leading-relaxed">
              We stay small on purpose — every person here can trace a support
              ticket back to the code they wrote.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="card p-8">
              <SignalTrace className="w-full h-14 mb-7" variant="dark" />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-7">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="font-mono-label text-[0.68rem] text-ink-3 mb-1.5">
                      {f.label}
                    </dt>
                    <dd className="font-serif text-[1.55rem] leading-tight tracking-[-0.02em] text-ink">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-dark section-rule py-24">
        <div className="max-w-container mx-auto px-6">
          <Reveal>
            <div className="max-w-[720px] mb-12">
              <p className="eyebrow mb-4">What we hold to</p>
              <h2 className="text-display-sm max-w-[22ch]">
                Three things that shape how we build.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-x-6 gap-y-10">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 120}>
                <div className="border-t border-line-dark pt-5 h-full">
                  <h3 className="text-[1.35rem] mb-3">{v.title}</h3>
                  <p className="text-[0.9rem] leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
