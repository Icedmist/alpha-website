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
import { AuthProvider, useAuth } from "./context/AuthContext";

// Page Components
import Home from "./views/Home";
import About from "./views/About";
import Academy from "./views/Academy";
import TalentCloud from "./views/TalentCloud";
import Roadmap from "./views/Roadmap";
import Contact from "./views/Contact";
import Apply from "./views/Apply";
import AcademyDashboard from "./views/AcademyDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children, isAcademy }: { children: ReactNode; isAcademy: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Newsletter form states
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const [newsletterFeedback, setNewsletterFeedback] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubmittingNewsletter(true);
    setNewsletterFeedback("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterFeedback("Successfully joined!");
        setNewsletterEmail("");
      } else {
        setNewsletterFeedback(data.error || "Failed to subscribe.");
      }
    } catch (err) {
      setNewsletterFeedback("An error occurred.");
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  // Hide headers/footers for student/instructor/admin dashboards
  const isDashboard = isAcademy
    ? (pathname === "/dashboard" || pathname === "/academy/dashboard") && !!currentUser
    : pathname.startsWith("/academy/dashboard") && !!currentUser;

  const isLocal = typeof window !== "undefined" && (window.location.hostname.includes('localhost') || window.location.hostname.startsWith('127.0.0.1'));
  const mainBaseUrl = isLocal ? "http://localhost:3000" : "https://alphaspark.ng";
  const academyBaseUrl = isLocal ? "http://academy.localhost:3000" : "https://academy.alphaspark.ng";

  const navLinks = isAcademy ? [
    { name: "Ecosystem Home", href: `${mainBaseUrl}/` },
    { name: "Talent Cloud", href: `${mainBaseUrl}/talent-cloud` },
    { name: "Syllabus Tracks", href: "#cohorts" },
  ] : [
    { name: "About", href: "/about" },
    { name: "Academy", href: `${academyBaseUrl}/` },
    { name: "Talent Cloud", href: "/talent-cloud" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Contact", href: "/contact" },
  ];

  const getLoginHref = () => {
    return isAcademy ? "/dashboard" : `${academyBaseUrl}/dashboard`;
  };

  const getCtaLinkProps = () => {
    if (currentUser) {
      return {
        href: isAcademy ? "/dashboard" : `${academyBaseUrl}/dashboard`,
        label: "Portal Dashboard"
      };
    } else {
      return {
        href: isAcademy ? `${mainBaseUrl}/apply` : "/apply",
        label: "Join Academy"
      };
    }
  };

  const cta = getCtaLinkProps();

  return (
    <div className="min-h-screen bg-brand-navy relative overflow-x-hidden">
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-20" />
      
      {/* Navigation */}
      {!isDashboard && (
        <nav id="navbar" className="fixed top-0 w-full z-40 bg-brand-navy/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between text-white">
            <a href={isAcademy ? `${academyBaseUrl}/` : `${mainBaseUrl}/`} className="flex items-center gap-2 md:gap-3">
              <img src="/assets/logo.svg" alt="Alpha Spark Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <span className="font-display font-black text-lg md:text-2xl tracking-tighter uppercase italic">
                {isAcademy ? "ALPHA ACADEMY" : "ALPHA SPARK"}
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                if (isExternal) {
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-brand-orange transition-colors"
                      id={`nav-${link.name.toLowerCase().replace(" ", "-")}`}
                    >
                      {link.name}
                    </a>
                  );
                }
                return (
                  <Link 
                    key={link.name} 
                    to={link.href}
                    className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-brand-orange transition-colors"
                    id={`nav-${link.name.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {!currentUser && (
                <a 
                  href={getLoginHref()}
                  id="nav-login"
                  className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-brand-orange transition-colors"
                >
                  Login
                </a>
              )}

              {cta.href.startsWith("http") ? (
                <a 
                  href={cta.href}
                  id="cta-join-academy"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wide text-xs transition-all"
                >
                  {cta.label}
                </a>
              ) : (
                <Link 
                  to={cta.href}
                  id="cta-join-academy"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wide text-xs transition-all"
                >
                  {cta.label}
                </Link>
              )}
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
                {navLinks.map((link) => {
                  if (link.href.startsWith("http")) {
                    return (
                      <a 
                        key={link.name} 
                        href={link.href}
                        className="text-lg font-display font-bold uppercase italic"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    );
                  }
                  return (
                    <Link 
                      key={link.name} 
                      to={link.href}
                      className="text-lg font-display font-bold uppercase italic"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                {!currentUser && (
                  <a 
                    href={getLoginHref()}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-display font-bold uppercase italic text-white/60 hover:text-brand-orange"
                  >
                    Login
                  </a>
                )}
                <a 
                  href={cta.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-brand-orange text-white text-center px-6 py-4 rounded-xl font-bold uppercase"
                >
                  {cta.label}
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      )}

      <main className={isDashboard ? "w-full" : ""}>{children}</main>

      {/* Footer */}
      {!isDashboard && (
        <footer id="footer" className="bg-white/2 pt-20 pb-12 md:pt-32 md:pb-16 border-t border-white/10 px-6 mt-20 md:mt-40">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-12 lg:gap-20 mb-20 md:mb-32">
              <div className="lg:col-span-2 space-y-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <img src="/assets/logo.svg" alt="Alpha Spark Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                  <span className="font-display font-black text-2xl md:text-3xl tracking-tighter text-white uppercase italic">alpha spark.</span>
                </div>
                <p className="text-white/30 text-base md:text-lg max-w-sm leading-relaxed italic">
                  Empowering individuals and institutions with practical digital capabilities, 
                  verified skills, and access to opportunities.
                </p>

                {/* Newsletter Form */}
                <div className="space-y-4 max-w-sm pt-4 border-t border-white/5">
                  <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-brand-orange">Newsletter</h5>
                  <p className="text-white/50 text-xs italic">Stay updated on cohorts, technology tracks, and talent opportunities.</p>
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <input 
                      type="email" 
                      required
                      placeholder="email@example.com" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:border-brand-orange outline-none flex-1 transition-colors"
                    />
                    <button 
                      type="submit" 
                      disabled={submittingNewsletter}
                      className="bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {submittingNewsletter ? "..." : "Join"}
                    </button>
                  </form>
                  {newsletterFeedback && (
                    <p className={`text-[10px] font-bold uppercase ${newsletterFeedback.includes("Successfully") ? "text-[#3bb75e]" : "text-red-400"}`}>
                      {newsletterFeedback}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-brand-orange mb-10">Platform</h4>
                <ul className="space-y-6 text-white/40 text-sm font-bold uppercase tracking-widest">
                  <li><a href={`${academyBaseUrl}/`} className="hover:text-white transition-colors">Academy</a></li>
                  <li><a href={`${mainBaseUrl}/talent-cloud`} className="hover:text-white transition-colors">Talent Cloud</a></li>
                  <li><a href={`${mainBaseUrl}/apply`} className="hover:text-white transition-colors">Enrollment</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-brand-orange mb-10">Connect</h4>
                <ul className="space-y-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                  <li><a href="mailto:hello@alphaspark.ng" className="hover:text-white transition-colors">hello@alphaspark.ng</a></li>
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
                © 2025 Alpha Spark. Ignite Africa.
              </div>
              <div className="flex gap-10 text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">
                #ALPHASPARK #IGNITE #FUTURE
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  const [isAcademySubdomain, setIsAcademySubdomain] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const pathname = window.location.pathname;
      const search = window.location.search;
      const isAcademy = 
        window.location.hostname.startsWith('academy.alphaspark.ng') || 
        window.location.hostname.startsWith('academy.localhost');
      
      setIsAcademySubdomain(isAcademy);

      const isLocal = window.location.hostname.includes('localhost') || window.location.hostname.startsWith('127.0.0.1');
      const mainBaseUrl = isLocal ? "http://localhost:3000" : "https://alphaspark.ng";
      const academyBaseUrl = isLocal ? "http://academy.localhost:3000" : "https://academy.alphaspark.ng";

      if (isAcademy) {
        // Redirect main site routes back to root domain
        const mainSiteRoutes = ["/about", "/talent-cloud", "/roadmap", "/contact", "/apply"];
        if (mainSiteRoutes.some(route => pathname.startsWith(route))) {
          window.location.href = `${mainBaseUrl}${pathname}${search}`;
        }
      } else {
        // Redirect academy paths to academy subdomain
        if (pathname === "/academy") {
          window.location.href = `${academyBaseUrl}/${search}`;
        } else if (pathname.startsWith("/academy/")) {
          const subPath = pathname.replace(/^\/academy/, "");
          window.location.href = `${academyBaseUrl}${subPath}${search}`;
        }
      }
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Layout isAcademy={isAcademySubdomain}>
          <Routes>
            {isAcademySubdomain ? (
              <>
                <Route path="/" element={<Academy />} />
                <Route path="/dashboard" element={<AcademyDashboard />} />
                <Route path="/academy/dashboard" element={<AcademyDashboard />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="*" element={<AcademyDashboard />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/talent-cloud" element={<TalentCloud />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="*" element={<Home />} />
              </>
            )}
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}
