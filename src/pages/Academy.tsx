import { motion } from "motion/react";
import { 
  BrainCircuit, 
  BarChart3, 
  Code, 
  ShieldCheck, 
  Monitor, 
  Zap, 
  Target,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Academy() {
  const tracks = [
    { name: "AI Fundamentals", icon: BrainCircuit, desc: "Master the basics of Generative AI and prompt engineering." },
    { name: "Data Analysis", icon: BarChart3, desc: "Turning raw data into strategic insights for decision making." },
    { name: "Programming", icon: Code, desc: "Software development from web apps to system infrastructure." },
    { name: "Cybersecurity Alertness", icon: ShieldCheck, desc: "Protecting digital assets in an increasingly connected world." },
    { name: "Digital Literacy", icon: Monitor, desc: "Foundational skills for the modern digital workplace." },
    { name: "Productivity & Automation", icon: Zap, desc: "Optimizing workflows using modern digital tools." },
    { name: "Career Readiness", icon: Target, desc: "Soft skills and professional branding for global employment." },
  ];

  const formats = [
    { title: "Bootcamps", duration: "12-16 Weeks", desc: "Immersive, full-time career-changing programs." },
    { title: "Cohort-based", duration: "4-8 Weeks", desc: "Structured community-driven learning models." },
    { title: "Institutional", duration: "Semester-Long", desc: "Curriculum integration for schools and universities." },
    { title: "Corporate", duration: "Customizable", desc: "Upskilling tracks for existing employees." }
  ];

  return (
    <div className="pt-32 min-h-screen">
      {/* Hero */}
      <section className="px-6 pb-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em]"
            >
              Skills Ecosystem
            </motion.div>
            <h1 className="font-display font-black text-6xl md:text-8xl uppercase italic leading-none tracking-tighter">
              The <br /><span className="text-brand-orange">Academy.</span>
            </h1>
            <p className="text-xl text-white/50 leading-relaxed max-w-lg">
              We provide practical, competency-based digital education designed to bridge the gap 
              between academic knowledge and industry requirements.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6">
            {formats.map((f, i) => (
              <div key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-4 hover:border-brand-orange/30 transition-colors">
                <h3 className="font-display font-bold text-xl uppercase italic tracking-tight">{f.title}</h3>
                <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest">{f.duration}</p>
                <p className="text-white/30 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="px-6 py-40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 space-y-4">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">Professional Development</p>
             <h2 className="font-display font-black text-5xl md:text-7xl uppercase italic tracking-tighter">Learning Tracks</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.map((track, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[48px] hover:bg-white/10 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 bg-brand-orange/10 group-hover:bg-brand-orange transition-colors">
                  <track.icon className="w-7 h-7 text-brand-orange group-hover:text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4 uppercase italic tracking-tight">{track.name}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">{track.desc}</p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange group-hover:gap-4 transition-all">
                  Track Details <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment CTA */}
      <section className="px-6 py-32">
        <div className="max-w-7xl mx-auto rounded-[64px] bg-brand-orange p-16 md:p-32 text-center space-y-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <BookOpen className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
             <h2 className="font-display font-black text-5xl md:text-7xl text-white uppercase italic tracking-tighter leading-none">
                Start Your <br />Journey Today.
             </h2>
             <p className="text-white font-medium italic text-xl">
                Ready to skill up for the future? Join our next cohort and become part of the Alpha Spark ecosystem.
             </p>
             <div className="flex justify-center">
                <Link to="/apply" className="bg-white text-brand-navy px-12 py-6 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform">
                    Apply to Academy
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
