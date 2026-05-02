import { motion } from "motion/react";
import { Flag, ListOrdered } from "lucide-react";

export default function Roadmap() {
  const steps = [
    {
      phase: "PHASE 1: FOUNDATION",
      period: "0-6 Months",
      title: "Establishing the Base",
      items: [
        "Secure partnerships with 3 pilot institutions",
        "Train and certify initial cohort of 300+ students",
        "Bootstrapping the Alpha Talent Cloud registry",
        "Secure strategic government endorsements"
      ],
      progress: 45
    },
    {
      phase: "PHASE 2: SYSTEMIZATION",
      period: "6-18 Months",
      title: "Ecosystem Integration",
      items: [
        "Expansion to 10 institutions across Nigeria",
        "Reach 1,000+ verified talent profiles",
        "Deploy the Employer Portal for talent discovery",
        "Integrated certification system with global partners"
      ],
      progress: 0
    },
    {
      phase: "PHASE 3: EXPANSION",
      period: "18-36 Months",
      title: "National Recognition",
      items: [
        "Regional presence in North, South, and West regions",
        "5,000+ verified skill profiles in the Cloud",
        "Institutional transformation dashboards for Gov/NGOs",
        "Launch of the Corporate Upskilling engine"
      ],
      progress: 0
    },
    {
      phase: "PHASE 4: SCALE",
      period: "3-5 Years",
      title: "Continental Leadership",
      items: [
        "Establishment as the primary talent data source in Nigeria",
        "Expansion into West African regional markets",
        "Full platform automation for talent lifecycle management",
        "Integration with pan-African workforce initiatives"
      ],
      progress: 0
    }
  ];

  return (
    <div className="pt-32 min-h-screen">
      {/* Hero */}
      <section className="px-6 pb-24 text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em]"
        >
          Growth Strategy
        </motion.div>
        <h1 className="font-display font-black text-6xl md:text-8xl uppercase italic leading-none tracking-tighter">
          Growth <br /><span className="text-brand-orange">Roadmap.</span>
        </h1>
        <p className="text-xl text-white/50 leading-relaxed max-w-2xl mx-auto italic font-medium">
            A strategic, phase-by-phase approach to building Nigeria's digital workforce infrastructure.
        </p>
      </section>

      {/* Timeline */}
      <section className="px-6 py-40 bg-white/2 border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-32">
          {steps.map((step, i) => (
            <div key={i} className="relative grid md:grid-cols-2 gap-16 items-start">
               {/* Timeline Dot & Line */}
               {i !== steps.length - 1 && (
                  <div className="absolute left-[31px] top-20 bottom-[-100px] w-0.5 bg-gradient-to-b from-brand-orange to-transparent hidden md:block" />
               )}
               
               <div className="space-y-6">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-full bg-brand-navy border-4 border-brand-orange flex items-center justify-center shrink-0 z-10 shadow-xl shadow-brand-orange/20">
                        <span className="font-display font-black text-xl text-brand-orange italic">{i + 1}</span>
                    </div>
                    <div>
                        <p className="text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] mb-2">{step.period}</p>
                        <h2 className="font-display font-black text-3xl uppercase italic tracking-tight">{step.phase}</h2>
                    </div>
                 </div>
                 <div className="md:pl-24">
                    <h3 className="text-xl font-bold text-white/90 mb-8 italic">{step.title}</h3>
                    <ul className="space-y-6">
                        {step.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-4 text-white/40 uppercase font-black text-xs tracking-widest leading-loose">
                                <div className="w-2 h-2 rounded-full bg-brand-orange mt-2 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                 </div>
               </div>

               <div className="bg-white/5 border border-white/10 p-12 rounded-[56px] space-y-8 h-full flex flex-col justify-center">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                            <span>Readiness Level</span>
                            <span>{step.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${step.progress}%` }}
                                className="h-full bg-brand-orange" 
                            />
                        </div>
                    </div>
                    <p className="text-white/30 text-sm leading-relaxed italic">
                        Phase {i + 1} focuses on {step.title.toLowerCase()}. Success in this stage triggers the expansion protocols for Stage {i + 2}.
                    </p>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
