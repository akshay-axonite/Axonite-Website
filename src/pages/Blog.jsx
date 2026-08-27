import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";
import { blogPosts } from "../data/content";

export default function Blog() {
  const bgRef = useParallax(-0.12);
  const [featured, ...rest] = blogPosts;

  return (
    <div>
      <section className="relative bg-ink grain overflow-hidden pt-40 pb-20">
        <div
          ref={bgRef}
          data-parallax
          className="absolute -top-24 right-1/4 w-[480px] h-[480px] rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, #3E5FE0, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <p className="font-mono-label text-[14px] text-signal mb-6">Blog</p>
          <h1 className="font-display text-paper text-4xl md:text-6xl font-semibold leading-tight">
            Notes from building product software.
          </h1>
          <p className="text-mist text-lg mt-6 max-w-2xl leading-relaxed">
            Engineering decisions, design trade-offs, and the occasional
            postmortem — written by the people who did the work.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <article className="grid md:grid-cols-5 gap-8 bg-white border border-line-soft rounded-2xl p-8 md:p-10 mb-14">
              <div className="md:col-span-4">
                <div className="flex items-center gap-4 font-mono-label text-[12px] text-signal-dim mb-4">
                  <span>{featured.tag}</span>
                  <span className="text-graphite">{featured.date}</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
                  {featured.title}
                </h2>
                <p className="text-graphite leading-relaxed max-w-xl">
                  {featured.excerpt}
                </p>
                <span className="inline-flex mt-6 text-signal-dim font-mono-label text-[11px] underline underline-offset-4">
                  Read the post
                </span>
              </div>
            </article>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <Reveal key={post.title} delay={i * 100}>
                <article className="border border-line-soft rounded-2xl p-7 h-full hover:border-signal transition-colors">
                  <div className="flex items-center gap-3 font-mono-label text-[12px] text-signal-dim mb-4">
                    <span>{post.tag}</span>
                    <span className="text-graphite">{post.date}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-3 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-graphite text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
