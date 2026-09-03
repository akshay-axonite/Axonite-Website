import { NavLink, Outlet, useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import { logout } from "../lib/store";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/blog", label: "Blog posts" },
  { to: "/admin/careers", label: "Careers" },
  { to: "/admin/applications", label: "Applications" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper flex">
      <aside className="w-60 bg-ink text-paper flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-line">
          <BrandMark size={24} />
          <p className="font-mono-label text-[10px] text-mist mt-3">Admin panel</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-mist hover:text-white hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-6 border-t border-line space-y-1">
          <a
            href="/"
            className="block px-4 py-2 rounded-lg text-xs text-mist hover:text-white hover:bg-white/5"
          >
            View live site ↗
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-mist hover:text-white hover:bg-white/5"
          >
            Log out
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
