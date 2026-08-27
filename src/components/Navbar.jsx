import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/career", label: "Career" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "border-b border-line-soft shadow-sm" : "border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 py-6 md:py-3 relative">
  <NavLink to="/" className="flex items-center w-48 relative">
    <img
      src="/logo-landscape.png"
      alt="Axonite Technology Pvt Ltd"
      className="absolute left-0 top-1/2 -translate-y-1/2 h-35 md:h-30 w-auto"
    />
  </NavLink>

        <ul className="hidden md:flex items-center gap-8 font-mono-label text-[11px] text-blue">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `pb-1 border-b transition-colors ${
                    isActive
                      ? "text-signal border-signal font-bold"
                      : "border-transparent hover:text-ink hover:border-mist hover:font-bold"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink
          to="/contact"
          className="hidden md:inline-flex items-center gap-2 text-white font-mono-label text-[11px] px-4 py-2.5 rounded-full transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(90deg, #9B4FC9, #3E5FE0, #29B6F6)" }}
        >
          Start a project
        </NavLink>

        <button
          className="md:hidden text-ink"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-paper border-t border-line-soft px-6 py-4 flex flex-col gap-4 ">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-mono-label text-xs ${isActive ? "text-signal font-bold" : "text-graphite"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className="inline-flex justify-center text-white font-mono-label text-[11px] px-4 py-2.5 rounded-full mt-2"
            style={{ background: "linear-gradient(90deg, #9B4FC9, #3E5FE0, #29B6F6)" }}
          >
            Start a project
          </NavLink>
        </div>
      )}
    </header>
  );
}
