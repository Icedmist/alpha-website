import { motion } from "motion/react";
import { 
  Clock, 
  Calendar, 
  BarChart, 
  Award, 
  CircleDollarSign,
  CheckCircle2,
  Trophy,
  Briefcase,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Wallet,
  Code,
  Palette,
  Rocket,
  Megaphone,
  BrainCircuit,
  Layout,
  BarChart3,
  ShieldCheck,
  Target,
  Smartphone,
  Cpu
} from "lucide-react";
import { Course } from "../data/courses";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";

export default function CourseCard({ 
  course, 
  initialExpanded = false 
}: { 
  course: Course, 
  initialExpanded?: boolean 
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const cardRef = useRef<HTMLDivElement>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case "Wallet": return Wallet;
      case "Code": return Code;
      case "Palette": return Palette;
      case "Rocket": return Rocket;
      case "Megaphone": return Megaphone;
      case "BrainCircuit": return BrainCircuit;
      case "Layout": return Layout;
      case "BarChart3": return BarChart3;
      case "ShieldCheck": return ShieldCheck;
      case "Target": return Target;
      case "Smartphone": return Smartphone;
      case "Cpu": return Cpu;
      default: return Zap;
    }
  };

  const Icon = getIcon(course.iconName);

  useEffect(() => {
    if (initialExpanded) {
      setIsExpanded(true);
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [initialExpanded]);

  return (
    <motion.div 
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 cursor-pointer ${isExpanded ? 'ring-2 ring-brand-orange/30' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Decorative Glow */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none z-10"
        style={{ backgroundColor: course.accentColor }}
      />

      {/* Course Image */}
      <div className="w-full h-24 md:h-32 overflow-hidden relative border-b border-white/5 bg-brand-navy/50">
        <img 
          src={course.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop"} 
          alt={course.title} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 p-4 md:p-5 lg:p-6 space-y-4">
        {/* Header - Always Visible */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-orange/50 transition-colors shrink-0">
              <Icon className="w-6 h-6 md:w-7 md:h-7 text-brand-orange" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-display font-black text-lg md:text-xl lg:text-2xl uppercase italic tracking-tighter leading-none">
                  {course.title}
                </h3>
                <div className="px-2 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[8px] font-black uppercase tracking-widest">
                  Now Enrolling
                </div>
              </div>
              <p className="text-brand-orange font-medium italic text-sm md:text-base opacity-80 leading-tight">
                {course.subtitle}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0 text-white/20 group-hover:text-brand-orange transition-colors">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {/* Collapsed Preview Snippet */}
        {!isExpanded && (
           <div className="flex flex-wrap gap-3 pt-1">
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/30">
                <Calendar className="w-3 h-3 text-brand-orange" /> {course.duration}
             </div>
             <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/30">
                <CircleDollarSign className="w-3 h-3 text-brand-orange" /> {course.fee}
             </div>
           </div>
        )}

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-6 pt-6 border-t border-white/5">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { label: "Duration", val: course.duration, icon: Calendar },
                    { label: "Hours", val: course.hours, icon: Clock },
                    { label: "Level", val: course.level, icon: BarChart },
                    { label: "Certificate", val: course.certificate, icon: Award },
                    { label: "Fee", val: course.fee, icon: CircleDollarSign, highlight: true },
                  ].map((stat, i) => (
                    <div key={i} className={`space-y-0.5 ${stat.highlight ? 'bg-white/5 p-2 rounded-xl border border-white/10' : ''}`}>
                      <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-1">
                        <stat.icon className="w-2.5 h-2.5" /> {stat.label}
                      </p>
                      <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-tight ${stat.highlight ? 'text-brand-orange' : 'text-white'}`}>
                        {stat.val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  {/* What You'll Learn */}
                  <div className="space-y-4">
                    <h4 className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/50">
                      What You'll Learn
                    </h4>
                    <ul className="space-y-2">
                      {course.learn.map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs text-white/60">
                          <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcome & Careers */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/50">
                        Your Outcome
                      </h4>
                      <p className="text-sm md:text-base font-medium italic text-white/80 leading-snug">
                        "{course.outcome}"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/50">
                        Career Paths
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {course.careerPaths.map((path, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-white/40">
                            {path}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tools Section */}
                <div className="space-y-4">
                  <h4 className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/50">
                    Tools You'll Master
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.tools.map((tool, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-1 h-1 rounded-full bg-brand-orange" />
                        <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Talent Cloud & CTA */}
                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                      <Trophy className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-brand-orange">Alpha Talent Cloud</p>
                      <p className="text-[10px] text-white/40">{course.talentCloud}</p>
                    </div>
                  </div>

                  <Link 
                    to="/apply"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full sm:w-auto bg-white text-brand-navy px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-brand-orange/10"
                  >
                    Enroll Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
