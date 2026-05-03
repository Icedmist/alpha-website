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
  ChevronUp
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
      className={`group relative bg-white/5 border border-white/10 rounded-[32px] md:rounded-[40px] overflow-hidden hover:bg-white/10 transition-all duration-500 cursor-pointer ${isExpanded ? 'ring-2 ring-brand-orange/30' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Decorative Glow */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: course.accentColor }}
      />

      <div className="p-6 md:p-8 lg:p-10 space-y-8">
        {/* Header - Always Visible */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-orange/50 transition-colors shrink-0">
              <Zap className="w-7 h-7 md:w-8 md:h-8 text-brand-orange" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="font-display font-black text-xl md:text-2xl lg:text-3xl uppercase italic tracking-tighter leading-none">
                  {course.title}
                </h3>
                <div className="px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[8px] font-black uppercase tracking-widest">
                  Now Enrolling
                </div>
              </div>
              <p className="text-brand-orange font-medium italic text-base md:text-lg opacity-80">
                {course.subtitle}
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0 text-white/20 group-hover:text-brand-orange transition-colors">
            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </div>
        </div>

        {/* Collapsed Preview Snippet */}
        {!isExpanded && (
           <div className="flex flex-wrap gap-4 pt-2">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                <Calendar className="w-3.5 h-3.5 text-brand-orange" /> {course.duration}
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                <CircleDollarSign className="w-3.5 h-3.5 text-brand-orange" /> {course.fee}
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
              <div className="space-y-10 pt-10 border-t border-white/5">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {[
                    { label: "Duration", val: course.duration, icon: Calendar },
                    { label: "Hours", val: course.hours, icon: Clock },
                    { label: "Level", val: course.level, icon: BarChart },
                    { label: "Certificate", val: course.certificate, icon: Award },
                    { label: "Fee", val: course.fee, icon: CircleDollarSign, highlight: true },
                  ].map((stat, i) => (
                    <div key={i} className={`space-y-1 ${stat.highlight ? 'bg-white/5 p-3 rounded-2xl border border-white/10' : ''}`}>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-1">
                        <stat.icon className="w-3 h-3" /> {stat.label}
                      </p>
                      <p className={`text-xs font-bold uppercase tracking-tight ${stat.highlight ? 'text-brand-orange' : 'text-white'}`}>
                        {stat.val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  {/* What You'll Learn */}
                  <div className="space-y-6">
                    <h4 className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                      What You'll Learn
                    </h4>
                    <ul className="space-y-4">
                      {course.learn.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-white/60">
                          <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcome & Careers */}
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h4 className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                        Your Outcome
                      </h4>
                      <p className="text-base md:text-lg font-medium italic text-white/80 leading-snug">
                        "{course.outcome}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                        Career Paths
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {course.careerPaths.map((path, i) => (
                          <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                            {path}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tools Section */}
                <div className="space-y-6">
                  <h4 className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">
                    Tools You'll Master
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {course.tools.map((tool, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Talent Cloud & CTA */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                      <Trophy className="w-6 h-6 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Alpha Talent Cloud</p>
                      <p className="text-xs text-white/40">{course.talentCloud}</p>
                    </div>
                  </div>

                  <Link 
                    to="/apply"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full md:w-auto bg-white text-brand-navy px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-brand-orange/10"
                  >
                    Enroll Now <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
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
