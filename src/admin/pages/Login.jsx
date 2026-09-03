import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAuthed } from "../../lib/store";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthed()) navigate("/admin", { replace: true });
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (login(username, password)) {
      navigate("/admin");
    } else {
      setError("Incorrect username or password.");
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8">
        {/* Logo - centered */}
        <div className="flex justify-center  ">
          <img
            src="/logo-landscape.png"
            alt="Axonite"
            className="w-full max-w-[200px] h-auto"
          />
        </div>

        <div className=" mb-6">
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
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className="w-full border border-line-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors"
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
              className="w-full border border-line-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-signal transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full text-white font-mono-label text-[11px] px-6 py-3.5 rounded-full transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #9B4FC9, #3E5FE0, #29B6F6)" }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}