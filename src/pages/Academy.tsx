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
import { courses, Course } from "../data/courses";
import CourseCard from "../components/CourseCard";

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
    <div className="pt-24 md:pt-32 min-h-screen">
      {/* Hero */}
      <section className="px-6 pb-16 md:pb-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em]"
            >
              Skills Ecosystem
            </motion.div>
            <h1 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic leading-none tracking-tighter">
              The <br /><span className="text-brand-orange">Academy.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-lg">
              We provide practical, competency-based digital education designed to bridge the gap 
              between academic knowledge and industry requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Active Cohorts */}
      <section className="px-6 py-20 md:py-32 lg:py-40 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 space-y-4">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">Now Enrolling</p>
             <h2 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic tracking-tighter">Active Cohorts</h2>
             <p className="text-white/40 text-base md:text-lg max-w-2xl italic">
               Join our industry-led programs designed to give you practical, verifiable skills in weeks.
             </p>
          </div>
          <div className="grid gap-12">
            {courses.map((course: Course) => (
              <div key={course.id}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment CTA */}
      <section className="px-6 py-16 md:py-32">
        <div className="max-w-7xl mx-auto rounded-[32px] md:rounded-[48px] lg:rounded-[64px] bg-brand-orange p-8 md:p-20 lg:p-32 text-center space-y-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <BookOpen className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
             <h2 className="font-display font-black text-3xl md:text-5xl lg:text-6xl text-white uppercase italic tracking-tighter leading-none">
                Start Your <br />Journey Today.
             </h2>
             <p className="text-white font-medium italic text-lg md:text-xl">
                Ready to skill up for the future? Join our next cohort and become part of the Alpha Spark ecosystem.
             </p>
             <div className="flex justify-center">
                <Link to="/apply" className="bg-white text-brand-navy px-8 py-4 md:px-12 md:py-6 rounded-full font-black uppercase tracking-widest text-xs md:text-sm hover:scale-105 transition-transform">
                    Apply to Academy
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
