import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-mist border-t border-line">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <img
    src="/logo.png"
    alt="Axonite"
    width="100"
    height="100"
    className="object-contain translate-x-10"
  />

  
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
            <li>info@axonite.net</li>
            <li>+91 9823103626  </li>
            <li>Pune, Maharashtra, India</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 border-t border-line flex flex-col md:flex-row justify-center items-center gap-3 text-xs  transition-colors ">
        <span>© {new Date().getFullYear()} Axonite Technology Pvt Ltd. All rights reserved.</span>
        
      </div>
    </footer>
  );
}
