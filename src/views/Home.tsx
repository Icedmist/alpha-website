import { motion } from "motion/react";
import { 
  ArrowRight, 
  BookOpen, 
  Cloud, 
  Building2, 
  Users, 
  Database, 
  Lightbulb, 
  CheckCircle2, 
  Target,
  Zap,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  Monitor,
  Code,
  BrainCircuit,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Course } from "../data/courses";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
}

export default function Home() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [academyCourses, setAcademyCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("/api/partners")
      .then(res => res.json())
      .then(data => setPartners(data))
      .catch(console.error);

    fetch("/api/courses")
      .then(res => {
        if (!res.ok) throw new Error('API fetch failed');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setAcademyCourses(data);
        } else {
          throw new Error('Empty data');
        }
      })
      .catch((err) => {
        console.log('Falling back to local courses', err);
        const localCourses = localStorage.getItem('alpha_custom_courses');
        if (localCourses) {
          setAcademyCourses(JSON.parse(localCourses));
        } else {
          // Fallback to imported courses if we import them
          import('../data/courses').then(m => setAcademyCourses(m.courses));
        }
      });
  }, []);

  const pillars = [
    {
      title: "Digital Skills Academy",
      desc: "Structured training programs for students, professionals, and institutions focusing on practical digital capabilities.",
      icon: BookOpen,
      color: "brand-orange",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Alpha Talent Cloud",
      desc: "A verified talent database that tracks skills, certifications, and capabilities to build a workforce intelligence database.",
      icon: Database,
      color: "brand-blue",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Workforce Transformation",
      desc: "Upskilling programs and institutional partnerships helping organizations adapt to rapid technological disruption.",
      icon: Building2,
      color: "brand-amber",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
    },
  ];

  const getCourseIcon = (name: string) => {
    switch (name) {
      case "Wallet": return Database; // Using Lucide icons available in Home.tsx
      case "Code": return Code;
      case "Palette": return Lightbulb;
      case "Rocket": return Zap;
      case "Megaphone": return Users;
      case "BrainCircuit": return BrainCircuit;
      case "Layout": return Monitor;
      case "BarChart3": return BarChart3;
      case "ShieldCheck": return ShieldCheck;
      case "Target": return Target;
      case "Smartphone": return Monitor;
      case "Cpu": return Database;
      default: return Zap;
    }
  };

  const roadmap = [
    { phase: "PHASE 1: FOUNDATION", period: "0-6 Months", items: ["3 Schools / 300+ Students", "1 Paid Cohort", "Initial Talent Cloud database"] },
    { phase: "PHASE 2: SYSTEMIZATION", period: "6-18 Months", items: ["10 Institutions", "1,000+ Trained Individuals", "Certification System"] },
    { phase: "PHASE 3: EXPANSION", period: "18-36 Months", items: ["National Recognition", "5,000+ Talent Profiles", "Talent Analytics Dashboards"] },
    { phase: "PHASE 4: SCALE", period: "3-5 Years", items: ["Multi-state Presence", "Platform Automation", "Regional Expansion"] },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-32 lg:pb-40 px-6 overflow-hidden">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-orange/20 blur-[130px] rounded-full opacity-40" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-brand-blue/20 blur-[130px] rounded-full opacity-40" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-lg shadow-brand-orange/10">
              THE VERIFICATION STANDARD FOR AFRICA'S DIGITAL TALENT
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-8 md:mb-10 uppercase tracking-tighter text-white">
              Don't Just Learn. <br />
              <span className="text-brand-orange">Get Verified & Hired.</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg lg:text-xl max-w-lg mb-10 md:mb-14 leading-relaxed font-medium">
              Alpha Spark is the continent-wide infrastructure connecting verified digital builders with the global employers who need them. Execution over theory.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/apply" className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 md:px-12 md:py-6 rounded-full font-black uppercase tracking-widest text-xs md:text-sm flex items-center gap-3 md:gap-4 group transition-all shadow-2xl shadow-brand-orange/30 hover:scale-105 active:scale-95">
                Apply for Cohort 1
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/talent-cloud" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 md:px-12 md:py-6 rounded-full font-black uppercase tracking-widest text-xs md:text-sm transition-all backdrop-blur-md">
                Hire Talent
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Abstract Tech Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] rounded-full"></div>
            
            <div className="relative w-full max-w-lg aspect-square">
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/20 to-brand-blue/20 blur-3xl animate-pulse" />
               <div className="relative w-full h-full rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/10 shadow-2xl group">
                 <div className="absolute inset-0 bg-brand-navy/30 group-hover:bg-transparent transition-colors duration-500 z-10" />
                 <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Students Coding Environment" className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-110" />
                 
                 <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent">
                   <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-brand-orange/40 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                     <Code className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white uppercase tracking-tighter mb-2">Build The Future</h3>
                   <p className="text-white/60 font-medium">Real-world projects. Real-world impact.</p>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 md:py-32 bg-white/2 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {[
            { label: "Global Tech Job Shortage", value: "85M+", icon: Users },
            { label: "Youth Entering Africa's Workforce Annually", value: "12M", icon: Building2 },
            { label: "Verification Standard", value: "01", icon: Target },
          ].map((stat, i) => (
            <div key={i} className="text-center group border-r border-white/5 last:border-none">
              <div className="text-4xl md:text-6xl font-display font-extrabold mb-3 text-white uppercase tracking-tighter">{stat.value}</div>
              <div className="text-brand-orange text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-black">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 md:py-32 lg:py-40 overflow-hidden bg-brand-navy">
        <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-16 text-center">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange mb-4">Trusted By</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tighter leading-none">
            OUR PARTNERSHIP <span className="text-brand-orange">ECOSYSTEM.</span>
          </h2>
        </div>
        
        <div className="relative flex overflow-hidden">
          {partners.length > 0 ? (
            <motion.div 
              animate={{ 
                x: ["0%", "-50%"] 
              }}
              transition={{ 
                duration: Math.max(30, partners.length * 5), 
                ease: "linear", 
                repeat: Infinity 
              }}
              className="flex gap-16 items-center whitespace-nowrap"
            >
              {partners.map((partner, i) => {
                const content = (
                  <>
                    <img 
                      src={partner.logoUrl} 
                      alt={partner.name} 
                      className="h-16 md:h-20 object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                    <span className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest group-hover:text-white transition-colors">
                      {partner.name}
                    </span>
                  </>
                );
                const formatUrl = (url: string) => url.startsWith('http') ? url : `https://${url}`;
                
                return partner.websiteUrl ? (
                  <a 
                    key={i} 
                    href={formatUrl(partner.websiteUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={i} className="shrink-0 flex flex-col items-center gap-3 group">
                    {content}
                  </div>
                );
              })}
              {/* Duplicate for seamless loop */}
              {partners.map((partner, i) => {
                const content = (
                  <>
                    <img 
                      src={partner.logoUrl} 
                      alt={partner.name} 
                      className="h-16 md:h-20 object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                    <span className="text-[9px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest group-hover:text-white transition-colors">
                      {partner.name}
                    </span>
                  </>
                );
                const formatUrl = (url: string) => url.startsWith('http') ? url : `https://${url}`;
                
                return partner.websiteUrl ? (
                  <a 
                    key={`dup-${i}`} 
                    href={formatUrl(partner.websiteUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={`dup-${i}`} className="shrink-0 flex flex-col items-center gap-3 group">
                    {content}
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <div className="w-full text-center text-white/30 text-sm font-bold uppercase tracking-widest py-10">
              Partners ecosystem is expanding...
            </div>
          )}
        </div>
      </section>

      {/* Pillars Section */}
      <section id="pillars" className="py-40 px-6 relative overflow-hidden bg-brand-navy">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-blue/5 blur-[120px] rounded-full -translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-6">
             <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">Our Framework</p>
            <h2 className="font-display font-black text-4xl md:text-6xl lg:text-6xl text-white uppercase italic leading-none tracking-tighter">
              A Workforce <br />
              <span className="text-brand-orange">Infrastructure</span> Company.
            </h2>
            <p className="text-white/40 text-lg leading-relaxed">
              Alpha Spark positions itself as a workforce infrastructure company, not just a training provider, 
              building the foundation for Africa's digital economy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -12, scale: 1.02 }}
                className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[32px] md:rounded-[48px] lg:rounded-[56px] hover:bg-white/[0.08] transition-all group relative overflow-hidden backdrop-blur-sm flex flex-col"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full -mr-24 -mt-24 group-hover:bg-brand-orange/20 transition-all duration-700 z-0" />
                <div className="w-full h-40 md:h-48 mb-8 md:mb-10 rounded-3xl overflow-hidden relative z-10 border border-white/10 shadow-2xl">
                   <div className="absolute inset-0 bg-brand-navy/40 group-hover:bg-brand-navy/10 transition-colors duration-500 z-10 pointer-events-none" />
                   <img src={pillar.imageUrl} alt={pillar.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                   <div className="absolute top-4 right-4 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-brand-navy/80 backdrop-blur-md group-hover:bg-brand-orange transition-all duration-500 border border-white/10 z-20">
                     <pillar.icon className="text-brand-orange group-hover:text-white w-6 h-6 md:w-7 md:h-7 transition-transform duration-500 group-hover:scale-110" />
                   </div>
                </div>
                <h3 className="font-display font-black text-2xl md:text-3xl mb-4 md:mb-6 uppercase italic tracking-tight text-white leading-tight relative z-10">{pillar.title}</h3>
                <p className="text-white/40 text-sm md:text-base leading-relaxed italic font-medium relative z-10">
                  {pillar.desc}
                </p>
                <div className="mt-10 h-1 w-12 bg-brand-orange/20 group-hover:w-24 group-hover:bg-brand-orange transition-all duration-500 relative z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="institutions" className="py-16 md:py-24 px-6 border-t border-white/5 bg-brand-navy/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
          <div className="max-w-md">
            <h3 className="font-display font-bold text-3xl uppercase italic mb-4">The Partnership Ecosystem</h3>
            <p className="text-white/30 text-sm italic">
              We collaborate across sectors to improve workforce readiness and digital capacity.
            </p>
          </div>
          <div className="flex flex-wrap gap-16 items-center justify-center">
            {[
                { icon: Building2, label: "GOVERNMENT", color: "text-brand-blue", bg: "bg-brand-blue/10" },
                { icon: Users, label: "UNIVERSITIES", color: "text-brand-orange", bg: "bg-brand-orange/10" },
                { icon: Code, label: "TECH COMPANIES", color: "text-brand-amber", bg: "bg-brand-amber/10" },
                { icon: TrendingUp, label: "BANKS", color: "text-emerald-400", bg: "bg-emerald-400/10" }
            ].map((p, i) => (
                <div key={i} className="flex flex-col items-center gap-6 group cursor-help">
                    <div className={`w-24 h-24 rounded-3xl ${p.bg} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-all duration-500`}>
                       <p.icon className={`w-10 h-10 ${p.color} transition-colors`} />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">{p.label}</span>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy & Skills Preview */}
      <section id="academy" className="py-20 md:py-32 lg:py-40 px-6 bg-white/[0.03]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
          <div className="space-y-12">
            <div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange mb-6">Learning Tracks</p>
                <h2 className="font-display font-black text-4xl md:text-6xl lg:text-6xl text-white uppercase italic leading-[0.95] tracking-tighter">
                    Practical <br />Skills for <br />the <span className="text-brand-orange">Era.</span>
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {academyCourses.slice(0, 4).map((course, i) => {
                const Icon = getCourseIcon(course.iconName);
                return (
                  <Link 
                    key={i} 
                    to={`/academy?course=${course.id}`}
                    className="flex flex-col gap-5 md:gap-6 p-6 md:p-8 bg-white/5 rounded-[32px] md:rounded-[48px] border border-white/10 hover:border-brand-orange transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity z-0">
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    {course.imageUrl ? (
                      <div className="w-full h-32 md:h-40 rounded-2xl md:rounded-3xl overflow-hidden relative z-10 border border-white/10">
                        <div className="absolute inset-0 bg-brand-navy/50 group-hover:bg-brand-navy/20 transition-colors duration-500 z-10 pointer-events-none" />
                        <img src={course.imageUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                        <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-brand-navy/90 backdrop-blur-md flex items-center justify-center group-hover:bg-brand-orange transition-colors duration-500 border border-white/10 shadow-lg z-20">
                          <Icon className="w-5 h-5 text-brand-orange group-hover:text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-orange transition-colors duration-500 relative z-10">
                        <Icon className="w-8 h-8 text-brand-orange group-hover:text-white" />
                      </div>
                    )}
                    <span className="font-display font-black text-lg text-white uppercase italic tracking-tight leading-tight relative z-10">{course.title}</span>
                  </Link>
                );
              })}
            </div>
            <Link to="/academy" className="flex items-center gap-3 group text-brand-orange font-black text-sm uppercase tracking-widest">
              Explore all programs
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-blue/10 blur-[100px] rounded-full" />
            <div className="relative bg-white/5 border border-white/10 p-12 rounded-[56px] backdrop-blur-xl">
                <div className="space-y-10">
                    {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-8 items-center group">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 shrink-0 group-hover:bg-brand-orange/10 transition-colors" />
                        <div className="space-y-3 flex-1">
                            <div className="h-4 bg-white/20 rounded-full w-1/4" />
                            <div className="h-3 bg-white/5 rounded-full w-full" />
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Talent Cloud Section Preview */}
      <section id="talent-cloud" className="py-20 md:py-32 lg:py-40 px-6">
        <div className="max-w-7xl mx-auto rounded-[40px] md:rounded-[64px] lg:rounded-[80px] bg-gradient-to-br from-brand-orange to-brand-amber p-8 md:p-16 lg:p-24 overflow-hidden relative group shadow-[0_0_100px_rgba(244,162,97,0.2)]">
          <div className="absolute top-0 right-0 p-16 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-[2s]">
            <Cloud className="w-[30rem] h-[30rem] text-white" />
          </div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em]">
                Talent Analytics
              </div>
              <h2 className="font-display font-extrabold text-5xl md:text-7xl lg:text-7xl text-white uppercase leading-[0.85] tracking-tighter">
                THE TALENT <br />CLOUD.
              </h2>
              <p className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-medium max-w-2xl">
                Africa's most advanced registry of verified digital talent. 
                Connecting job-ready professionals with global opportunities.
              </p>
              <div className="flex flex-wrap gap-6">
                  <Link to="/talent-cloud" className="bg-white text-brand-orange px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-transform active:scale-95">
                      Launch Platform
                  </Link>
                  <div className="hidden md:flex items-center gap-4 text-white/80 font-black text-[10px] uppercase tracking-widest">
                      <CheckCircle2 className="w-5 h-5 text-white" /> Verified Profiles
                  </div>
              </div>
            </div>

            {/* Profile Card Mockup */}
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-[32px] transform rotate-3" />
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-navy/20 border-2 border-white/30 p-1 flex items-center justify-center overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=150&auto=format&fit=crop" alt="Student" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-xl text-white">David O.</h4>
                      <p className="text-white/70 text-sm font-medium">Full-Stack Engineer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-400/20 text-green-100 border border-green-400/30 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Alpha Verified</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Node.js", "Python", "TypeScript", "PostgreSQL"].map(tech => (
                      <span key={tech} className="px-3 py-1.5 rounded-lg bg-black/20 text-white text-xs font-bold border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Availability</p>
                    <p className="text-white font-bold text-sm">Immediate</p>
                  </div>
                  <button className="bg-white text-brand-orange px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                    Hire Talent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
