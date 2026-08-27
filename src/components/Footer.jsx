import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-mist border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
              <defs>
                <linearGradient id="footer-mark-grad" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stopColor="#9B4FC9" />
                  <stop offset="55%" stopColor="#3E5FE0" />
                  <stop offset="100%" stopColor="#29B6F6" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="14" fill="url(#footer-mark-grad)" />
              <path
                d="M10 40 L24 24 L40 34 L54 14"
                stroke="#1B1F52"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-display font-semibold text-paper">Axonite</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Axonite Technology Pvt Ltd. Product software, built to last past
            the first release.
          </p>
        </div>

        <div>
          <p className="font-mono-label text-[11px] text-signal mb-4">Company</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-paper transition-colors">About</Link></li>
            <li><Link to="/career" className="hover:text-paper transition-colors">Career</Link></li>
            <li><Link to="/blog" className="hover:text-paper transition-colors">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-paper transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono-label text-[11px] text-signal mb-4">Products</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/products" className="hover:text-paper transition-colors">Ledgerline</Link></li>
            <li><Link to="/products" className="hover:text-paper transition-colors">Fieldpost</Link></li>
            <li><Link to="/products" className="hover:text-paper transition-colors">Rosterly</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono-label text-[11px] text-signal mb-4">Reach us</p>
          <ul className="space-y-2.5 text-sm">
            <li>hello@axonite.in</li>
            <li>+91 20 4567 8899</li>
            <li>Pune, Maharashtra, India</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 border-t border-line flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-graphite">
        <span>© {new Date().getFullYear()} Axonite Technology Pvt Ltd. All rights reserved.</span>
        <span className="font-mono-label text-[10px] text-graphite">Built in Pune</span>
      </div>
    </footer>
  );
}
