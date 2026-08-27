import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";
import { jobs } from "../data/content";

const perks = [
  { label: "Health cover", desc: "For you and your immediate family, from day one." },
  { label: "Flexible hours", desc: "Core overlap hours, otherwise work when you're sharpest." },
  { label: "Learning budget", desc: "Courses, books, and conferences — no approval theatre." },
  { label: "Real ownership", desc: "You ship to production in your first two weeks." },
];

export default function Career() {
  const bgRef = useParallax(-0.12);

  return (
    <div>
      <section className="relative bg-ink grain overflow-hidden pt-40 pb-24">
        <div
          ref={bgRef}
          data-parallax
          className="absolute -top-24 left-1/4 w-[480px] h-[480px] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, #9B4FC9, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="font-mono-label text-[14px] text-signal mb-6">Career</p>
          <h1 className="font-display text-paper text-4xl md:text-6xl font-semibold leading-tight">
            Work on software people actually depend on.
          </h1>
          <p className="text-mist text-lg mt-6 max-w-2xl leading-relaxed">
            We're a small team in Pune building products that finance teams,
            field crews, and shift workers use every day. No growth-hacking,
            no vanity metrics — just software that has to work.
          </p>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal-dim mb-4">Open roles</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-xl">
              Currently hiring for four positions.
            </h2>
          </Reveal>

          <div className="mt-12 divide-y divide-line-soft border-t border-b border-line-soft">
            {jobs.map((job, i) => (
              <Reveal key={job.title} delay={i * 80}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-7">
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-1.5">
                      {job.title}
                    </h3>
                    <p className="text-graphite text-sm max-w-md leading-relaxed">
                      {job.desc}
                    </p>
                    <div className="flex gap-4 mt-3 font-mono-label text-[12px] text-signal-dim">
                      <span>{job.location}</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <a
                    href="mailto:careers@axonite.in"
                    className="shrink-0 inline-flex items-center justify-center border border-line-soft rounded-full px-5 py-2.5 font-mono-label text-[14px] hover:border-signal hover:text-signal-dim transition-colors"
                  >
                    Apply
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <p className="font-mono-label text-[14px] text-signal mb-4">Why join</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper max-w-xl">
              What you get, beyond the paycheck.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-6 mt-14">
            {perks.map((p, i) => (
              <Reveal key={p.label} delay={i * 100}>
                <div className="border-t-2 border-signal pt-5">
                  <h3 className="font-display text-paper text-lg font-semibold mb-2">
                    {p.label}
                  </h3>
                  <p className="text-mist text-sm leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              Don't see the right role listed?
            </h2>
            <p className="text-graphite mt-3">
              Write to us anyway at{" "}
              <a href="mailto:careers@axonite.in" className="text-signal-dim underline">
                careers@axonite.in
              </a>
              . We keep every good resume on file.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
