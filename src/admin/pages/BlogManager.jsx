import { useEffect, useState } from "react";
import { getBlogPosts, saveBlogPost, deleteBlogPost } from "../../lib/store";

const emptyForm = { title: "", tag: "", date: "", excerpt: "" };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  function refresh() {
    setPosts(getBlogPosts());
  }

  useEffect(refresh, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    saveBlogPost({ ...form, id: editingId || undefined });
    setForm(emptyForm);
    setEditingId(null);
    refresh();
  }

  function handleEdit(post) {
    setForm({ title: post.title, tag: post.tag, date: post.date, excerpt: post.excerpt });
    setEditingId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    if (!confirm("Delete this post? This can't be undone.")) return;
    deleteBlogPost(id);
    refresh();
    if (editingId === id) {
      setForm(emptyForm);
      setEditingId(null);
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div className="p-8 max-w-4xl">
      <p className="font-mono-label text-[11px] text-signal-dim mb-2">Content</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Blog posts</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-line-soft rounded-2xl p-6 mb-10 space-y-4">
        <h2 className="font-display text-lg font-semibold">
          {editingId ? "Edit post" : "New post"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title" name="title" value={form.title} onChange={handleChange} required />
          <Field
            label="Tag"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="Engineering, Design, Product…"
          />
        </div>
        <Field
          label="Date label"
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="Sep 2026"
        />
        <div>
          <label className="font-mono-label text-[10px] text-graphite block mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full border border-line-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="text-white font-mono-label text-[11px] px-6 py-3 rounded-full transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #9B4FC9, #3E5FE0, #29B6F6)" }}
          >
            {editingId ? "Save changes" : "Publish post"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="font-mono-label text-[11px] px-6 py-3 rounded-full border border-line-soft hover:border-signal transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border border-line-soft rounded-2xl divide-y divide-line-soft">
        {posts.length === 0 && <p className="p-6 text-sm text-graphite">No posts yet.</p>}
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="font-display font-semibold truncate">{post.title}</p>
              <p className="text-xs text-graphite mt-1">
                {post.tag} · {post.date}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleEdit(post)}
                className="text-xs font-mono-label px-3 py-2 rounded-full border border-line-soft hover:border-signal transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-xs font-mono-label px-3 py-2 rounded-full border border-line-soft text-red-600 hover:border-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, required, placeholder }) {
  return (
    <div>
      <label className="font-mono-label text-[10px] text-graphite block mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-line-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors"
      />
    </div>
  );
}
