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
    { title: "Inclusion", desc: "Scaling digital access for all Africans." }
  ];

  return (
    <div className="pt-24 md:pt-32 min-h-screen">
      {/* Intro */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Our Identity
          </motion.div>
          <h1 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic leading-none tracking-tighter">
            Workforce <br /><span className="text-brand-orange">Infrastructure.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto italic font-medium">
            Alpha Spark is not a traditional training company. We are a workforce infrastructure company 
            building the foundation for Africa's digital economy.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-6 py-16 md:py-32 bg-white/2 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="p-8 md:p-12 rounded-[32px] md:rounded-[56px] bg-brand-orange/5 border border-brand-orange/10 space-y-6">
            <Compass className="w-12 h-12 text-brand-orange mb-4" />
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase italic tracking-tight">Our Vision</h2>
            <p className="text-base md:text-lg text-white/50 leading-relaxed uppercase font-bold tracking-wider">
              "To scale digital capability development across Africa, ensuring every individual is 
              job-ready and every institution is data-driven."
            </p>
          </div>
          <div className="p-8 md:p-12 rounded-[32px] md:rounded-[56px] bg-brand-blue/5 border border-brand-blue/10 space-y-6">
            <Target className="w-12 h-12 text-brand-blue mb-4" />
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase italic tracking-tight">Our Mission</h2>
            <p className="text-base md:text-lg text-white/50 leading-relaxed uppercase font-bold tracking-wider">
              "To build the largest verified talent network in Africa, connecting skills with opportunities 
              through innovative infrastructure and strategic partnerships."
            </p>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="px-6 py-20 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 space-y-4">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">Strategic Goals</p>
             <h2 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic tracking-tighter">Core Objectives</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
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
      <section className="px-6 py-20 md:py-32 lg:py-40 bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <img src="/assets/values_banner.png" alt="Values Backdrop" className="w-full h-full object-cover mix-blend-overlay" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 md:mb-24 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange mb-4">Foundation</p>
            <h2 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic tracking-tighter">Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {values.map((v, i) => (
              <div key={i} className="p-8 md:p-12 rounded-[32px] md:rounded-[48px] bg-white/5 border border-white/10 hover:border-brand-orange transition-all group relative">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-brand-orange rounded-3xl flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-transform shadow-xl shadow-brand-orange/20">
                   <span className="text-2xl font-display font-black text-white italic">0{i + 1}</span>
                </div>
                <div className="pt-8">
                  <h3 className="font-display font-black text-2xl md:text-4xl uppercase italic tracking-tight mb-4 md:mb-6 group-hover:text-brand-orange transition-colors">{v.title}</h3>
                  <p className="text-white/40 text-base md:text-lg leading-relaxed italic font-medium">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="px-6 py-20 md:py-32 lg:py-40 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
           <div className="relative aspect-square rounded-[32px] md:rounded-[48px] lg:rounded-[64px] overflow-hidden border border-white/10 group">
              <img 
                src="/assets/ishaq.jpg" 
                alt="Ishaq Sulaiman" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent opacity-80" />
           </div>
           <div className="space-y-12">
              <div className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">Executive Director</p>
                <h2 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic tracking-tighter leading-none">Ishaq <br />Sulaiman.</h2>
              </div>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed italic font-medium">
                "Our goal is to ensure that every young African has a verifiable digital footprint that the world can trust. 
                We are building the trust layer for the future of work."
              </p>
              <div className="pt-8 flex gap-10">
                 <div>
                    <p className="text-3xl font-display font-black text-white italic">2025</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Established</p>
                 </div>
                 <div>
                    <p className="text-3xl font-display font-black text-white italic">5K+</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Talent Registry</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 md:py-32 lg:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange mb-4">The People Behind Alpha Spark</p>
          <h2 className="font-display font-black text-4xl md:text-6xl lg:text-6xl text-white uppercase italic tracking-tighter leading-none">
            Meet the <span className="text-brand-orange">Team.</span>
          </h2>
        </div>
        
        <div className="relative flex overflow-hidden">
          <motion.div 
            animate={{ 
              x: ["0%", "-50%"] 
            }}
            transition={{ 
              duration: 35, 
              ease: "linear", 
              repeat: Infinity 
            }}
            className="flex gap-10 whitespace-nowrap"
          >
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-64 h-96 md:w-80 md:h-[450px] shrink-0 rounded-[32px] md:rounded-[64px] overflow-hidden border border-white/10 relative group">
                <img 
                  src={`/assets/team/member-${i + 1}.jpg`} 
                  alt={`Team Member ${i + 1}`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[...Array(15)].map((_, i) => (
              <div key={`dup-${i}`} className="w-64 h-96 md:w-80 md:h-[450px] shrink-0 rounded-[32px] md:rounded-[64px] overflow-hidden border border-white/10 relative group">
                <img 
                  src={`/assets/team/member-${i + 1}.jpg`} 
                  alt={`Team Member ${i + 1}`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
