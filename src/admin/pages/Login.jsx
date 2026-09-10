import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if token is already present
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: username.trim(),
          password: password,
        }),
      });

      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(data.error || "Incorrect username or password.");
      }

      // Store auth session
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8">
        {/* Logo - centered */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo-landscape.png"
            alt="Axonite"
            className="w-full max-w-[200px] h-auto"
          />
        </div>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold mb-1">Admin sign in</h1>
          <p className="text-graphite text-sm">Restricted to Axonite staff.</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono-label text-[10px] text-graphite block mb-2">
              Username or Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
              disabled={loading}
              placeholder="Enter username or email"
              className="w-full border border-line-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="font-mono-label text-[10px] text-graphite block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter password"
              className="w-full border border-line-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-mono-label text-[11px] px-6 py-3.5 rounded-full transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(90deg, #9B4FC9, #3E5FE0, #29B6F6)" }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}