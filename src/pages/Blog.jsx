import { useEffect, useRef, useState } from "react";
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

function PostMeta({ post, className = "" }) {
  if (!post.date && !post.tag) return null;
  return (
    <div className={`flex items-center gap-2.5 font-mono-label text-[0.62rem] ${className}`}>
      {post.date && <span className="text-ink-3">{post.date}</span>}
      {post.date && post.tag && (
        <span className="w-1 h-1 rounded-full bg-ink-3" aria-hidden="true" />
      )}
      {post.tag && <span className="text-accent">{post.tag}</span>}
    </div>
  );
}

function PostMedia({ post, className }) {
  if (post.video) {
    return <video src={post.video} controls className={className} />;
  }
  if (!post.image) return null;
  return <img src={post.image} alt="" className={className} />;
}

export default function Blog() {
    const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${API_BASE_URL}/blog`);
        const data = await response.json();
        const formatted = (Array.isArray(data) ? data : []).map((p, i) => ({
          id: p.id || p.blog_id || `post-${i}`,
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

  if (!loading && posts.length === 0) {
    return (
      <div className="bg-paper">
        <BlogHero  />
        <BlogEmpty />
      </div>
    );
  }

  // First post gets the wide editorial treatment; the rest form the index below.
  const [featured, ...rest] = posts;

  return (
    <div className="bg-paper">
      <BlogHero  />

      <section className="max-w-container mx-auto px-6 py-20">
        {loading && <BlogSkeleton />}

        {!loading && featured && (
          <>
            <p className="eyebrow">Latest</p>

            <Reveal className="mt-5">
              <article className="grid gap-8 card card--hover p-7 lg:grid-cols-5 lg:p-9">
                <div className={featured.image || featured.video ? "lg:col-span-3" : "lg:col-span-5"}>
                  <PostMeta post={featured} />

                  <h2 className="text-display-xs mt-3">
                    {featured.title}
                  </h2>

                  <p className="text-ink-2 text-[0.95rem] leading-relaxed mt-4 max-w-xl line-clamp-3">
                    {featured.excerpt}
                  </p>

                  <div className="mt-7">
                    <button
                      type="button"
                      onClick={() => setActivePost(featured)}
                      className="inline-flex items-center justify-center bg-accent text-white font-semibold text-[0.9375rem] px-6 py-3 rounded-full transition-colors hover:bg-accent-strong"
                    >
                      Read the post
                    </button>
                  </div>
                </div>

                {(featured.image || featured.video) && (
                  <div className="lg:col-span-2">
                    <PostMedia
                      post={featured}
                      className="w-full h-56 lg:h-full rounded-md border border-line object-cover bg-paper-alt"
                    />
                  </div>
                )}
              </article>
            </Reveal>

            {rest.length > 0 && (
              <>
                <h2 className="eyebrow mt-16">More posts</h2>

                <ul className="mt-6 grid gap-6 md:grid-cols-2">
                  {rest.map((post, i) => (
                    <li key={post.id}>
                      <Reveal delay={i * 80} className="h-full">
                        <article className="h-full flex flex-col card card--hover overflow-hidden">
                          {post.image && (
                            <PostMedia
                              post={post}
                              className="w-full h-44 object-cover bg-paper-alt"
                            />
                          )}

                          <div className="flex flex-col flex-1 p-6">
                            <PostMeta post={post} />

                            <h3 className="text-[1.25rem] mt-3">
                              {post.title}
                            </h3>

                            <p className="text-ink-2 text-[0.95rem] leading-relaxed mt-3 line-clamp-3">
                              {post.excerpt}
                            </p>

                            <div className="mt-auto pt-6">
                              <button
                                type="button"
                                onClick={() => setActivePost(post)}
                                className="inline-flex items-center gap-2 font-semibold text-[0.9rem] text-accent transition-colors hover:text-accent-strong"
                              >
                                Read the post
                                <span aria-hidden="true">→</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </section>

      {activePost && (
        <PostReader post={activePost} onClose={() => setActivePost(null)} />
      )}
    </div>
  );
}

function BlogHero() {
  return (
    <section className="relative bg-paper ambient-wash overflow-hidden pt-32 pb-16 section-rule">
      <div className="relative max-w-prose mx-auto px-6">
        <p className="eyebrow mb-5">Writing</p>
        <h1 className="text-display max-w-[22ch]">
          Notes from building product software.
        </h1>
        <p className="mt-6 max-w-[52ch] text-[1.125rem] leading-relaxed text-ink-2">
          Engineering decisions, design trade-offs, and the occasional
          postmortem — written by the people who did the work.
        </p>
      </div>
    </section>
  );
}

function BlogEmpty() {
  return (
    <section className="max-w-container mx-auto px-6 py-24">
      <div className="max-w-[620px] mx-auto card px-8 py-14 text-center">
        <h2 className="text-display-xs">
          Nothing published yet.
        </h2>
        <p className="text-ink-2 text-[0.95rem] leading-relaxed mt-4">
          We're working on the first few write-ups. In the meantime, tell us
          what you'd want to read about.
        </p>
      </div>
    </section>
  );
}

function BlogSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-3 w-16 rounded-full bg-paper-alt" />
      <div className="mt-4 card p-7 lg:p-9 animate-pulse">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="h-3 w-28 rounded-full bg-paper-alt" />
            <div className="h-7 w-3/4 rounded-sm bg-paper-alt mt-5" />
            <div className="h-3 w-full rounded-full bg-paper-alt mt-6" />
            <div className="h-3 w-5/6 rounded-full bg-paper-alt mt-3" />
            <div className="h-10 w-36 rounded-full bg-paper-alt mt-8" />
          </div>
          <div className="lg:col-span-2 h-56 lg:h-full min-h-[200px] rounded-sm bg-paper-alt" />
        </div>
      </div>
    </div>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function PostReader({ post, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  // Escape to close, Tab cycles within the dialog, focus returns whence it came.
  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const items = dialogRef.current?.querySelectorAll(FOCUSABLE);
      if (!items || items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-dark/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-reader-title"
        className="relative w-full max-w-3xl max-h-[90vh] rounded-lg bg-paper border border-line shadow-float overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur-md px-6 sm:px-8 py-4 border-b border-line flex items-center justify-between gap-4">
          <PostMeta post={post} />

          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            aria-label="Close article"
            className="w-9 h-9 shrink-0 rounded-full border border-line text-ink-3 hover:text-paper hover:bg-dark flex items-center justify-center transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 sm:px-10 py-8 overflow-y-auto flex-1">
          <h2
            id="post-reader-title"
            className="text-display-xs"
          >
            {post.title}
          </h2>

          {(post.image || post.video) && (
            <PostMedia
              post={post}
              className="w-full max-h-96 rounded-md border border-line object-cover bg-paper-alt mt-7"
            />
          )}

          <div className="text-ink-2 text-[1.05rem] leading-relaxed whitespace-pre-line mt-7">
            {post.excerpt}
          </div>
        </div>
      </div>
    </div>
  );
}
