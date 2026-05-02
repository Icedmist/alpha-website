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

export default function Home() {
  const pillars = [
    {
      title: "Digital Skills Academy",
      desc: "Structured training programs for students, professionals, and institutions focusing on practical digital capabilities.",
      icon: BookOpen,
      color: "brand-orange",
    },
    {
      title: "Alpha Talent Cloud",
      desc: "A verified talent database that tracks skills, certifications, and capabilities to build a workforce intelligence database.",
      icon: Database,
      color: "brand-blue",
    },
    {
      title: "Workforce Transformation",
      desc: "Upskilling programs and institutional partnerships helping organizations adapt to rapid technological disruption.",
      icon: Building2,
      color: "brand-amber",
    },
  ];

  const courses = [
    { name: "AI Fundamentals", icon: BrainCircuit },
    { name: "Data Analysis", icon: BarChart3 },
    { name: "Programming", icon: Code },
    { name: "Cybersecurity Awareness", icon: ShieldCheck },
    { name: "Digital Literacy", icon: Monitor },
    { name: "Productivity & Automation", icon: Zap },
    { name: "Career Readiness", icon: Target },
  ];

  const roadmap = [
    { phase: "PHASE 1: FOUNDATION", period: "0-6 Months", items: ["3 Schools / 300+ Students", "1 Paid Cohort", "Initial Talent Cloud database"] },
    { phase: "PHASE 2: SYSTEMIZATION", period: "6-18 Months", items: ["10 Institutions", "1,000+ Trained Individuals", "Certification System"] },
    { phase: "PHASE 3: EXPANSION", period: "18-36 Months", items: ["National Recognition", "5,000+ Talent Profiles", "Talent Analytics Dashboards"] },
    { phase: "PHASE 4: SCALE", period: "3-5 Years", items: ["Multi-state Presence", "Platform Automation", "Regional Expansion"] },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section id="hero" className="relative pt-28 pb-40 px-6 overflow-hidden">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-orange/20 blur-[130px] rounded-full opacity-40" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-brand-blue/20 blur-[130px] rounded-full opacity-40" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-lg shadow-brand-orange/10">
              Future-Proofing Africa
            </div>
            <h1 className="font-display font-black text-7xl md:text-[9rem] leading-[0.8] mb-10 uppercase italic tracking-tighter text-white">
              BUILDING <br />
              <span className="text-brand-orange">THE BASE.</span>
            </h1>
            <p className="text-white/60 text-lg md:text-2xl max-w-lg mb-14 leading-relaxed font-medium italic">
              Alpha Spark is Nigeria's workforce infrastructure partner—redefining how talent is verified, 
              trained, and deployed in the digital economy.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/apply" className="bg-brand-orange hover:bg-brand-orange/90 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-4 group transition-all shadow-2xl shadow-brand-orange/30 hover:scale-105 active:scale-95">
                Join Academy
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/about" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-6 rounded-full font-black uppercase tracking-widest text-sm transition-all backdrop-blur-md">
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/20 to-brand-blue/20 blur-3xl animate-pulse" />
              
              <div className="relative bg-white/5 border border-white/10 rounded-[48px] p-12 backdrop-blur-3xl shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <div className="flex justify-center mb-16 relative">
                    <div className="w-32 h-32 bg-brand-orange rounded-3xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-brand-orange/40">
                        <Zap className="w-16 h-16 text-white fill-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">Verified Skills</p>
                    <div className="h-1 bg-gradient-to-r from-brand-orange to-transparent w-full rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-xs font-bold text-white uppercase italic">Active</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Cohort</p>
                      <p className="text-xs font-bold text-white uppercase italic">Alpha-01</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white/2 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Verified Talent", value: "5,000+", icon: Users },
            { label: "Institutions", value: "20+", icon: Building2 },
            { label: "Growth Goal", value: "Africa-wide", icon: Target },
            { label: "Innovation", value: "Leader", icon: Lightbulb },
          ].map((stat, i) => (
            <div key={i} className="text-center group border-r border-white/5 last:border-none">
              <div className="text-5xl font-display font-black mb-3 text-white uppercase italic tracking-tighter">{stat.value}</div>
              <div className="text-brand-orange text-[10px] uppercase tracking-[0.3em] font-black">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Founders / Leadership Section */}
      <section className="py-40 overflow-hidden bg-brand-navy">
        <div className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand-orange/20 blur-[100px] rounded-full" />
              <div className="relative aspect-[4/5] rounded-[64px] overflow-hidden border border-white/10 group shadow-2xl">
                <img 
                  src="/assets/ishaq.jpg" 
                  alt="Ishaq Sulaiman" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-12">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange mb-2">Founder & Executive Director</p>
                   <h3 className="font-display font-black text-4xl text-white uppercase italic tracking-tighter">Ishaq Sulaiman</h3>
                </div>
              </div>
            </motion.div>
            
            <div className="space-y-12">
              <div className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">The Vision</p>
                <h2 className="font-display font-black text-5xl md:text-8xl text-white uppercase italic tracking-tighter leading-[0.85]">
                  Pioneering <br />Digital <br /><span className="text-brand-orange">Verification.</span>
                </h2>
              </div>
              <p className="text-white/50 text-xl leading-relaxed italic font-medium max-w-lg">
                "We aren't just teaching people how to code or design; we are building the registry that validates 
                Africa's potential for the global digital economy."
              </p>
              <div className="flex gap-4 items-center pt-8">
                 <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap className="w-6 h-6 text-brand-orange" />
                 </div>
                 <p className="text-sm font-black uppercase tracking-widest text-white/40">Established 2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange mb-4">Board of Directors & Advisors</p>
          <h2 className="font-display font-black text-5xl md:text-7xl text-white uppercase italic tracking-tighter leading-none">
            The <span className="text-brand-orange">Leadership.</span>
          </h2>
        </div>
        
        <div className="relative flex overflow-hidden">
          <motion.div 
            animate={{ 
              x: ["0%", "-50%"] 
            }}
            transition={{ 
              duration: 30, 
              ease: "linear", 
              repeat: Infinity 
            }}
            className="flex gap-8 whitespace-nowrap"
          >
            {[...Array(13)].map((_, i) => (
              <div key={i} className="w-64 h-80 shrink-0 rounded-[48px] overflow-hidden border border-white/10 relative group">
                <img 
                  src={`/assets/founders/f${i + 1}.jpg`} 
                  alt={`Founder ${i + 1}`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[...Array(13)].map((_, i) => (
              <div key={`dup-${i}`} className="w-64 h-80 shrink-0 rounded-[48px] overflow-hidden border border-white/10 relative group">
                <img 
                  src={`/assets/founders/f${i + 1}.jpg`} 
                  alt={`Founder ${i + 1}`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section id="pillars" className="py-40 px-6 relative overflow-hidden bg-brand-navy">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-blue/5 blur-[120px] rounded-full -translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-24 space-y-6">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">Our Framework</p>
            <h2 className="font-display font-black text-5xl md:text-7xl text-white uppercase italic leading-none tracking-tighter">
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
                className="bg-white/5 border border-white/10 p-12 rounded-[56px] hover:bg-white/[0.08] transition-all group relative overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full -mr-24 -mt-24 group-hover:bg-brand-orange/20 transition-all duration-700" />
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-12 bg-white/5 group-hover:bg-brand-orange transition-all duration-500 shadow-lg`}>
                  <pillar.icon className="text-brand-orange group-hover:text-white w-10 h-10 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-display font-black text-3xl mb-6 uppercase italic tracking-tight text-white leading-tight">{pillar.title}</h3>
                <p className="text-white/40 text-base leading-relaxed italic font-medium">
                  {pillar.desc}
                </p>
                <div className="mt-10 h-1 w-12 bg-brand-orange/20 group-hover:w-24 group-hover:bg-brand-orange transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="institutions" className="py-24 px-6 border-t border-white/5 bg-brand-navy/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
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
                    <span className="text-[10px] font-black tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">{p.label}</span>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy & Skills Preview */}
      <section id="academy" className="py-40 px-6 bg-white/[0.03]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange mb-6">Learning Tracks</p>
                <h2 className="font-display font-black text-5xl md:text-7xl text-white uppercase italic leading-[0.95] tracking-tighter">
                    Practical <br />Skills for <br />the <span className="text-brand-orange">Era.</span>
                </h2>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {courses.slice(0, 4).map((course, i) => (
                <div key={i} className="flex flex-col gap-6 p-8 bg-white/5 rounded-[48px] border border-white/10 hover:border-brand-orange transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                    <course.icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-orange transition-colors duration-500">
                    <course.icon className="w-8 h-8 text-brand-orange group-hover:text-white" />
                  </div>
                  <span className="font-display font-black text-lg text-white uppercase italic tracking-tight leading-tight">{course.name}</span>
                </div>
              ))}
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
      <section id="talent-cloud" className="py-40 px-6">
        <div className="max-w-7xl mx-auto rounded-[80px] bg-gradient-to-br from-brand-orange to-brand-amber p-12 md:p-32 overflow-hidden relative group shadow-[0_0_100px_rgba(244,162,97,0.2)]">
          <div className="absolute top-0 right-0 p-16 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-[2s]">
            <Cloud className="w-[30rem] h-[30rem] text-white" />
          </div>
          
          <div className="relative z-10 max-w-3xl space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em]">
              Talent Analytics
            </div>
            <h2 className="font-display font-black text-6xl md:text-9xl text-white uppercase italic leading-[0.85] tracking-tighter">
              THE TALENT <br />CLOUD.
            </h2>
            <p className="text-white text-xl md:text-2xl leading-relaxed font-medium italic max-w-2xl">
              Nigeria's most advanced registry of verified digital talent. 
              Connecting job-ready professionals with global opportunities.
            </p>
            <div className="flex gap-6">
                <Link to="/talent-cloud" className="bg-white text-brand-orange px-12 py-6 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-transform active:scale-95">
                    Launch Platform
                </Link>
                <div className="hidden md:flex items-center gap-4 text-white/80 font-black text-[10px] uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5 text-white" /> 5,000+ Profiles Verified
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
