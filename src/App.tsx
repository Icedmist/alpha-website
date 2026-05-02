/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { 
  Zap,
  Menu,
  X,
  TrendingUp,
  Target,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";

// Page Components
import Home from "./pages/Home";
import About from "./pages/About";
import Academy from "./pages/Academy";
import TalentCloud from "./pages/TalentCloud";
import Roadmap from "./pages/Roadmap";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Academy", href: "/academy" },
    { name: "Talent Cloud", href: "/talent-cloud" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-brand-navy relative overflow-x-hidden">
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-20" />
      
      {/* Progress Bar removed */}

      {/* Navigation */}
      <nav id="navbar" className="fixed top-0 w-full z-40 bg-brand-navy/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-white">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/logo.svg" alt="Alpha Spark Logo" className="w-10 h-10 object-contain" />
            <span className="font-display font-black text-2xl tracking-tighter uppercase italic">ALPHA SPARK</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-brand-orange transition-colors"
                id={`nav-${link.name.toLowerCase().replace(" ", "-")}`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/apply"
              id="cta-join-academy"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wide text-xs transition-all"
            >
              Join Academy
            </Link>
          </div>

          <button id="mobile-menu-toggle" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-navy border-b border-white/10 px-6 py-8 flex flex-col gap-6 overflow-hidden"
            >
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className="text-xl font-display font-bold uppercase italic"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <button className="bg-brand-orange text-white px-6 py-4 rounded-xl font-bold uppercase">
                Join Academy
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer id="footer" className="bg-white/2 pt-32 pb-16 border-t border-white/10 px-6 mt-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-20 mb-32">
            <div className="lg:col-span-2 space-y-10">
              <div className="flex items-center gap-4">
                <img src="/assets/logo.svg" alt="Alpha Spark Logo" className="w-12 h-12 object-contain" />
                <span className="font-display font-black text-3xl tracking-tighter text-white uppercase italic">alpha spark.</span>
              </div>
              <p className="text-white/30 text-lg max-w-sm leading-relaxed italic">
                Empowering individuals and institutions with practical digital capabilities, 
                verified skills, and access to opportunities.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-brand-orange mb-10">Platform</h4>
              <ul className="space-y-6 text-white/40 text-sm font-bold uppercase tracking-widest">
                <li><Link to="/academy" className="hover:text-white transition-colors">Academy</Link></li>
                <li><Link to="/talent-cloud" className="hover:text-white transition-colors">Talent Cloud</Link></li>
                <li><Link to="/apply" className="hover:text-white transition-colors">Enrollment</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-brand-orange mb-10">Connect</h4>
              <ul className="space-y-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                <li><a href="mailto:hello@alphaspark.tech" className="hover:text-white transition-colors">hello@alphaspark.tech</a></li>
                <li><a href="tel:09075444148" className="hover:text-white transition-colors">09075444148</a></li>
                <li className="text-brand-orange">Gombe State, Nigeria</li>
                <li className="pt-6 flex gap-8">
                  <TrendingUp className="w-6 h-6 opacity-30 hover:opacity-100 transition-opacity cursor-pointer" />
                  <Target className="w-6 h-6 opacity-30 hover:opacity-100 transition-opacity cursor-pointer" />
                  <ShieldCheck className="w-6 h-6 opacity-30 hover:opacity-100 transition-opacity cursor-pointer" />
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
            <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
              © 2025 Alpha Spark Initiative. Ignite Nigeria.
            </div>
            <div className="flex gap-10 text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">
              #ALPHASPARK #IGNITE #FUTURE
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/talent-cloud" element={<TalentCloud />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
        </Routes>
      </Layout>
    </Router>
  );
}


