import { motion } from "motion/react";
import { 
  Cloud, 
  Database, 
  ShieldCheck, 
  Search, 
  Cpu, 
  BarChart, 
  Users,
  CheckCircle2
} from "lucide-react";

export default function TalentCloud() {
  const features = [
    {
      title: "Verified Skill Profiles",
      desc: "Live skill tracking that goes beyond static CVs, showing actual competency scores.",
      icon: CheckCircle2
    },
    {
      title: "Talent Analytics",
      desc: "Real-time data for governments and institutions on workforce readiness and gaps.",
      icon: BarChart
    },
    {
      title: "Smart Matching",
      desc: "AI-driven mapping of talent to open roles based on verified certifications.",
      icon: Cpu
    }
  ];

  const stakeholders = [
    {
      role: "For Individuals",
      impact: "Access to a global verified network and automated career progression paths."
    },
    {
      role: "For Institutions",
      impact: "Data-driven insights into student performance and curriculum alignment."
    },
    {
      role: "For Employers",
      impact: "Zero-friction hiring with pre-vetted, job-ready digital talent."
    }
  ];

  return (
    <div className="pt-24 md:pt-32 min-h-screen">
      {/* Hero */}
      <section className="px-6 pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/5 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Workforce Intelligence
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
                <h1 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic leading-none tracking-tighter">
                    Talent <br /><span className="text-brand-orange">Cloud.</span>
                </h1>
                <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-lg">
                    The Alpha Talent Cloud is Africa's premier registry of verified digital talent, 
                    designed to eliminate the mismatch between education and employment.
                </p>
                <div className="flex gap-6 pt-4">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl">
                        <Database className="text-brand-orange w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-widest text-white/80">Indexed Database</span>
                    </div>
                </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 p-6 md:p-12 rounded-[32px] md:rounded-[56px] backdrop-blur-xl space-y-8">
                <div className="flex items-center justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b border-white/5">
                    <span className="font-display font-black text-xl md:text-2xl uppercase italic text-brand-orange">Cloud Terminal</span>
                    <Search className="text-white/20 w-5 h-5" />
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl group hover:bg-brand-orange/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10" />
                                <div>
                                    <div className="h-3 w-24 bg-white/20 rounded-full mb-2" />
                                    <div className="h-2 w-16 bg-white/10 rounded-full" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-12 h-6 rounded-full bg-brand-orange/20 border border-brand-orange/40" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 md:py-32 lg:py-40 bg-white/2 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, i) => (
              <div key={i} className="space-y-6">
                <div className="w-16 h-16 rounded-[2rem] bg-brand-blue/10 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-brand-blue" />
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl uppercase italic tracking-tight">{feature.title}</h3>
                <p className="text-white/40 text-sm md:text-base leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="px-6 py-20 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 space-y-4">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-blue">Ecosystem Impact</p>
             <h2 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic tracking-tighter">Who Benefits</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {stakeholders.map((s, i) => (
              <div key={i} className="p-8 md:p-12 rounded-[32px] md:rounded-[48px] lg:rounded-[56px] bg-white/5 border border-white/10 space-y-6 hover:border-brand-blue/30 transition-colors">
                <h3 className="font-display font-bold text-xl md:text-2xl uppercase italic tracking-tight text-white">{s.role}</h3>
                <p className="text-white/40 text-sm md:text-base leading-relaxed italic">{s.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
