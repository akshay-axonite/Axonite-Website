import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000/api";

const emptyForm = {
  title: "",
  tag: "",
  excerpt: "",
  image: "",
  imageName: "",
  video: "",
  videoName: "",
};

const MAX_CONTENT_CHARS = 5000;
const MAX_VIDEO_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageError, setImageError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [apiError, setApiError] = useState("");

  async function refresh() {
    setLoading(true);
    setApiError("");
    try {
      const response = await fetch(`${API_BASE_URL}/blog`);
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const result = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to load posts");
      }

      setPosts(result || []);
    } catch (err) {
      console.error(err);
      setApiError(err.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "excerpt" && value.length > MAX_CONTENT_CHARS) return;
    setForm({ ...form, [name]: value });
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only PNG or JPG images are allowed.");
      e.target.value = "";
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setForm((f) => ({ ...f, image: base64, imageName: file.name }));
    } catch {
      setImageError("Couldn't read that image. Try again.");
    }
  }

  async function handleVideoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoError("");

    if (file.size > MAX_VIDEO_BYTES) {
      setVideoError("Video must be 10MB or smaller.");
      e.target.value = "";
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setForm((f) => ({ ...f, video: base64, videoName: file.name }));
    } catch {
      setVideoError("Couldn't read that video. Try again.");
    }
  }

  function removeImage() {
    setForm((f) => ({ ...f, image: "", imageName: "" }));
    setImageError("");
  }

  function removeVideo() {
    setForm((f) => ({ ...f, video: "", videoName: "" }));
    setVideoError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSubmitting(true);
    setApiError("");

    try {
      const url = editingId ? `${API_BASE_URL}/blog/${editingId}` : `${API_BASE_URL}/blog`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          tag: form.tag,
          excerpt: form.excerpt,
          image: form.image,
          video: form.video,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to save post");
      }

      setForm(emptyForm);
      setEditingId(null);
      setImageError("");
      setVideoError("");
      await refresh();
    } catch (err) {
      console.error(err);
      setApiError(err.message || "Failed to submit post");
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(post) {
    setForm({
      title: post.title || "",
      tag: post.tag || "",
      excerpt: post.excerpt || "",
      image: post.image || "",
      imageName: post.image ? "Current Image" : "",
      video: post.video || "",
      videoName: post.video ? "Current Video" : "",
    });
    setEditingId(post.id);
    setImageError("");
    setVideoError("");
    setApiError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this post? This can't be undone.")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.details || result.error || "Failed to delete post");
      }
      await refresh();
      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }
    } catch (err) {
      alert(err.message || "Could not delete post");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setImageError("");
    setVideoError("");
    setApiError("");
  }


  
  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <p className="font-mono-label text-[11px] text-signal-dim mb-2">Content</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Blog posts</h1>

      {apiError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-line-soft rounded-2xl p-4 sm:p-6 mb-10 space-y-4">
        <h2 className="font-display text-lg font-semibold">
          {editingId ? "Edit post" : "New post"}
        </h2>

        {/* Title + Subtitle side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title" name="title" value={form.title} onChange={handleChange} required />
          <Field
            label="Tag / Subtitle"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="Engineering, Design, Product…"
          />
        </div>

        {/* Media Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-mono-label text-[10px] text-graphite block mb-2">
              Image (PNG or JPG)
            </label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={handleImageChange}
              className="w-full text-sm border border-line-soft rounded-xl px-4 py-3 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:font-mono-label file:text-[10px] file:bg-line-soft file:cursor-pointer cursor-pointer"
            />
            {imageError && <p className="text-xs text-red-600 mt-2">{imageError}</p>}
            {form.image && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-line-soft"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs truncate">{form.imageName || "Image ready"}</p>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-[10px] font-mono-label text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="font-mono-label text-[10px] text-graphite block mb-2">
              Video (max 10MB)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full text-sm border border-line-soft rounded-xl px-4 py-3 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:font-mono-label file:text-[10px] file:bg-line-soft file:cursor-pointer cursor-pointer"
            />
            {videoError && <p className="text-xs text-red-600 mt-2">{videoError}</p>}
            {form.video && (
              <div className="mt-3">
                <video src={form.video} controls className="w-full max-h-32 rounded-lg border border-line-soft" />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs truncate">{form.videoName || "Video ready"}</p>
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="text-[10px] font-mono-label text-red-600 hover:underline shrink-0"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono-label text-[10px] text-graphite">Content</label>
            <span
              className={`text-[10px] font-mono-label ${
                form.excerpt.length >= MAX_CONTENT_CHARS ? "text-red-600" : "text-graphite"
              }`}
            >
              {form.excerpt.length}/{MAX_CONTENT_CHARS}
            </span>
          </div>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={5}
            maxLength={MAX_CONTENT_CHARS}
            className="w-full border border-line-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="text-white font-mono-label text-[11px] px-6 py-3 rounded-full transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(90deg, #9B4FC9, #3E5FE0, #29B6F6)" }}
          >
            {submitting ? "Saving..." : editingId ? "Save changes" : "Publish post"}
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

      {/* Posts List */}
      <div className="bg-white border border-line-soft rounded-2xl divide-y divide-line-soft">
        {loading ? (
          <p className="p-6 text-sm text-graphite">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="p-6 text-sm text-graphite">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3 min-w-0">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-10 h-10 object-cover rounded-lg border border-line-soft shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-display font-semibold truncate">{post.title}</p>
                  <p className="text-xs text-graphite mt-1 flex items-center gap-1.5 flex-wrap">
                    {/* Automatically shown formatted system date */}
                    <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium font-mono">
                      {post.formatted_date || "Today"}
                    </span>
                    {post.tag && <span>· {post.tag}</span>}
                    {post.video && <span>· has video</span>}
                  </p>
                </div>
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
          ))
        )}
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
