import { motion } from "motion/react";
import { Target, Lightbulb, Compass, ShieldCheck, Users, Zap } from "lucide-react";

export default function About() {
  const objectives = [
    {
      title: "Workforce Readiness",
      desc: "Standardize digital education to meet immediate employer needs.",
      icon: Target
    },
    {
      title: "Talent Intelligence",
      desc: "Provide real-time data on skill availability for institutions and governments.",
      icon: Lightbulb
    },
    {
      title: "Scale & Efficiency",
      desc: "Automate skill verification and job matching through the Talent Cloud.",
      icon: Zap
    }
  ];

  const values = [
    { title: "Integrity", desc: "Verified data you can trust." },
    { title: "Innovation", desc: "Redefining how Africa learns and works." },
    { title: "Inclusion", desc: "Scaling digital access for all Nigerians." }
  ];

  return (
    <div className="pt-32 min-h-screen">
      {/* Intro */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Our Identity
          </motion.div>
          <h1 className="font-display font-black text-6xl md:text-8xl uppercase italic leading-none tracking-tighter">
            Workforce <br /><span className="text-brand-orange">Infrastructure.</span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto italic font-medium">
            Alpha Spark is not a traditional training company. We are a workforce infrastructure company 
            building the foundation for Nigeria's digital economy.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-6 py-32 bg-white/2 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="p-12 rounded-[56px] bg-brand-orange/5 border border-brand-orange/10 space-y-6">
            <Compass className="w-12 h-12 text-brand-orange mb-4" />
            <h2 className="font-display font-bold text-4xl uppercase italic tracking-tight">Our Vision</h2>
            <p className="text-lg text-white/50 leading-relaxed uppercase font-bold tracking-wider">
              "To scale digital capability development across Nigeria, ensuring every individual is 
              job-ready and every institution is data-driven."
            </p>
          </div>
          <div className="p-12 rounded-[56px] bg-brand-blue/5 border border-brand-blue/10 space-y-6">
            <Target className="w-12 h-12 text-brand-blue mb-4" />
            <h2 className="font-display font-bold text-4xl uppercase italic tracking-tight">Our Mission</h2>
            <p className="text-lg text-white/50 leading-relaxed uppercase font-bold tracking-wider">
              "To build the largest verified talent network in Africa, connecting skills with opportunities 
              through innovative infrastructure and strategic partnerships."
            </p>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="px-6 py-40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 space-y-4">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">Strategic Goals</p>
             <h2 className="font-display font-black text-5xl md:text-7xl uppercase italic tracking-tighter">Core Objectives</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {objectives.map((obj, i) => (
              <div key={i} className="space-y-6 group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-orange transition-colors duration-500">
                  <obj.icon className="w-8 h-8 text-brand-orange group-hover:text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl uppercase italic tracking-tight">{obj.title}</h3>
                <p className="text-white/40 leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-32 bg-brand-orange">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-white">
            {values.map((v, i) => (
              <div key={i} className="border-t-2 border-white/20 pt-8">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Value 0{i + 1}</span>
                <h3 className="font-display font-black text-4xl uppercase italic tracking-tight mb-4">{v.title}</h3>
                <p className="text-white/80 font-medium italic">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
