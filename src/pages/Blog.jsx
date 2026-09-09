import { useEffect, useState } from "react";
import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";

const API_BASE_URL = "http://localhost:5000/api";

function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Blog() {
  const bgRef = useParallax(-0.12);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null); // Controls the full article modal

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${API_BASE_URL}/blog`);
        const data = await response.json();
        const formatted = (Array.isArray(data) ? data : []).map((p) => ({
          id: p.id || p.blog_id,
          title: p.title || p.blog_title || "",
          tag: p.tag || p.blog_sub_title || "",
          excerpt: p.excerpt || p["blog content"] || "",
          image: p.image || p.blog_image || "",
          video: p.video || p.blog_video || "",
          date: p.formatted_date || formatDisplayDate(p.raw_date || p.created_date),
        }));
        setPosts(formatted);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Lock background scroll when reading modal is open
  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activePost]);

  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Hero Section */}
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

      {/* Main Content Section */}
      <section className="bg-paper py-20">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <p className="text-graphite text-sm">Loading posts...</p>
          ) : !featured ? (
            <p className="text-graphite text-sm">No posts published yet — check back soon.</p>
          ) : (
            <>
              {/* Horizontal Featured Post */}
              <Reveal>
                <article className="grid md:grid-cols-5 gap-8 bg-white border border-line-soft rounded-2xl p-8 md:p-10 mb-14">
                  <div className={featured.image || featured.video ? "md:col-span-3" : "md:col-span-5"}>
                    {featured.date && (
                      <p className="font-mono-label text-[12px] text-graphite mb-1.5">
                        {featured.date}
                      </p>
                    )}

                    {featured.tag && (
                      <div className="font-mono-label text-[12px] text-signal-dim mb-4">
                        <span>{featured.tag}</span>
                      </div>
                    )}

                    <h2 
                      onClick={() => setActivePost(featured)}
                      className="font-display text-2xl md:text-3xl font-semibold mb-4 cursor-pointer hover:text-signal transition-colors"
                    >
                      {featured.title}
                    </h2>

                    <p className="text-graphite leading-relaxed max-w-xl line-clamp-3">
                      {featured.excerpt}
                    </p>

                    <button
                      type="button"
                      onClick={() => setActivePost(featured)}
                      className="inline-flex mt-6 text-signal-dim font-mono-label text-[11px] underline underline-offset-4 hover:text-signal transition-colors cursor-pointer"
                    >
                      Read the post →
                    </button>
                  </div>

                  {(featured.image || featured.video) && (
                    <div 
                      onClick={() => setActivePost(featured)}
                      className="md:col-span-2 flex items-center justify-center cursor-pointer"
                    >
                      {featured.video ? (
                        <video
                          src={featured.video}
                          controls
                          className="w-full max-h-64 rounded-xl border border-line-soft object-cover"
                        />
                      ) : (
                        <img
                          src={featured.image}
                          alt={featured.title}
                          className="w-full max-h-64 rounded-xl border border-line-soft object-cover hover:opacity-95 transition-opacity"
                        />
                      )}
                    </div>
                  )}
                </article>
              </Reveal>

              {/* Vertical Remaining Posts */}
              <div className="grid md:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <Reveal key={post.id} delay={i * 100}>
                    <article 
                      onClick={() => setActivePost(post)}
                      className="border border-line-soft rounded-2xl p-7 h-full hover:border-signal transition-colors cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-44 object-cover rounded-xl border border-line-soft mb-4 group-hover:opacity-95 transition-opacity"
                          />
                        )}

                        {post.date && (
                          <p className="font-mono-label text-[12px] text-graphite mb-1.5">
                            {post.date}
                          </p>
                        )}

                        {post.tag && (
                          <div className="font-mono-label text-[12px] text-signal-dim mb-4">
                            <span>{post.tag}</span>
                          </div>
                        )}

                        <h3 className="font-display text-lg font-semibold mb-3 leading-snug group-hover:text-signal transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-graphite text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <span className="inline-flex mt-5 text-signal-dim font-mono-label text-[11px] underline underline-offset-4">
                        Read post →
                      </span>
                    </article>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Big Reader Modal for Full Content */}
      {activePost && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePost(null)}
        >
          <div 
            className="relative bg-paper w-full max-w-3xl max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-line-soft overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-line-soft flex items-center justify-between">
              <div className="flex items-center gap-3 font-mono-label text-xs">
                {activePost.date && <span className="text-graphite">{activePost.date}</span>}
                {activePost.date && activePost.tag && <span>•</span>}
                {activePost.tag && <span className="text-signal-dim">{activePost.tag}</span>}
              </div>

              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="w-9 h-9 rounded-full border border-line-soft text-graphite hover:text-paper hover:bg-ink flex items-center justify-center text-lg transition-all"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="px-6 sm:px-10 py-8 overflow-y-auto flex-1">
              <h1 className="font-display text-2xl sm:text-4xl font-semibold leading-tight text-ink mb-6">
                {activePost.title}
              </h1>

              {/* Media banner */}
              {activePost.video ? (
                <video
                  src={activePost.video}
                  controls
                  className="w-full max-h-96 rounded-2xl border border-line-soft object-cover mb-8"
                />
              ) : activePost.image ? (
                <img
                  src={activePost.image}
                  alt={activePost.title}
                  className="w-full max-h-96 rounded-2xl border border-line-soft object-cover mb-8"
                />
              ) : null}

              {/* Complete article content with preserved linebreaks */}
              <div className="text-graphite text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal space-y-4">
                {activePost.excerpt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}