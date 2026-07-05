import { motion, Variants } from "motion/react";
import { 
  BrainCircuit, 
  BarChart3, 
  Code, 
  ShieldCheck, 
  Monitor, 
  Zap, 
  Target,
  ArrowRight,
  BookOpen,
  Megaphone,
  Rocket,
  GraduationCap,
  Users,
  Building,
  Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Course } from "../data/courses";
import { tracks } from "../data/tracks";
import CourseCard from "../components/CourseCard";

export default function Academy() {
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [searchParams] = useSearchParams();
  const activeCourseId = searchParams.get("course");

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => setCoursesList(data))
      .catch(console.error);
  }, []);

  const formats = [
    { title: "Bootcamps", duration: "12-16 Weeks", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600", desc: "Immersive, full-time career-changing programs.", icon: GraduationCap },
    { title: "Cohort-based", duration: "4-8 Weeks", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600", desc: "Structured community-driven learning models.", icon: Users },
    { title: "Institutional", duration: "Semester-Long", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600", desc: "Curriculum integration for schools and universities.", icon: Building },
    { title: "Corporate", duration: "Customizable", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600", desc: "Upskilling tracks for existing employees.", icon: Briefcase }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="pt-24 md:pt-32 min-h-screen">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-orange/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="px-6 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="max-w-3xl space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <Zap className="w-3 h-3" />
              Skills Ecosystem
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-black text-5xl md:text-7xl lg:text-8xl uppercase italic leading-[0.9] tracking-tighter"
            >
              The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">
                Academy.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-2xl text-white/60 leading-relaxed max-w-xl font-medium"
            >
              We provide practical, competency-based digital education designed to bridge the gap 
              between academic knowledge and industry requirements.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-6"
            >
              <a href="#cohorts" className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] md:text-xs hover:scale-105 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Browse Tracks
              </a>
              <Link to="/academy/dashboard" className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] md:text-xs hover:scale-105 transition-all">
                Sign In to Portal
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Formats Section */}
      <section className="px-6 py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 space-y-4 max-w-2xl">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">How We Teach</p>
             <h2 className="font-display font-black text-3xl md:text-5xl uppercase italic tracking-tighter">Learning Formats</h2>
             <p className="text-white/50 text-base md:text-lg italic">
               Flexible educational structures built to accommodate different learning speeds, goals, and organizational needs.
             </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {formats.map((format, i) => {
              const Icon = format.icon;
              return (
                <motion.div 
                  key={format.title}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/10 transition-colors group cursor-default"
                >
                  <div className="w-full h-32 rounded-xl bg-white/10 mb-4 overflow-hidden relative border border-white/5">
                    <img src={format.image} alt={format.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[9px] uppercase font-bold tracking-widest text-brand-orange border border-white/10">
                      {format.duration}
                    </div>
                  </div>
                  <h3 className="font-display font-black text-lg md:text-xl uppercase italic tracking-tight mb-2 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-brand-orange" />
                    {format.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{format.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Curriculum Tracks Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 space-y-4 max-w-2xl">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">Curriculum</p>
             <h2 className="font-display font-black text-3xl md:text-5xl uppercase italic tracking-tighter">Core Tracks</h2>
             <p className="text-white/50 text-base md:text-lg italic">
               Comprehensive learning pathways crafted by industry professionals to deliver high-demand skills.
             </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tracks.map((track, i) => {
              const Icon = track.icon;
              // Make the first item span 2 columns on large screens for visual interest
              const isFeatured = i === 0;
              return (
                <motion.div 
                  key={track.name}
                  variants={itemVariants}
                >
                  <Link 
                    to={`/track/${track.slug}`}
                    className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-orange/50 transition-colors group cursor-pointer flex flex-col md:flex-row h-full ${isFeatured ? 'lg:col-span-2' : ''}`}
                  >
                    <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-white/10">
                      <img src={track.image} alt={track.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-navy/90 via-brand-navy/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                         <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className={`font-display font-black uppercase italic tracking-tight ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                          {track.name}
                        </h3>
                        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-brand-orange group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                      <p className="text-white/50 leading-relaxed text-sm md:text-base max-w-md">
                        {track.desc}
                      </p>
                      <div className="mt-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-orange/0 group-hover:text-brand-orange transition-colors">
                        View Track Details &rarr;
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Active Cohorts */}
      <section id="cohorts" className="px-6 py-20 md:py-32 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 space-y-4">
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange">Now Enrolling</p>
             <h2 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic tracking-tighter">Active Cohorts</h2>
             <p className="text-white/50 text-base md:text-lg max-w-2xl italic">
               Join our industry-led programs designed to give you practical, verifiable skills in weeks.
             </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {coursesList.map((course: Course) => (
              <div key={course.id} id={course.id}>
                <CourseCard 
                  course={course} 
                  initialExpanded={activeCourseId === course.id} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment CTA */}
      <section className="px-6 py-20 md:py-32 relative overflow-hidden">
        {/* Background elements for CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[80%] bg-brand-orange/20 blur-[100px] rounded-full pointer-events-none -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto rounded-[32px] md:rounded-[48px] lg:rounded-[64px] bg-gradient-to-br from-brand-orange to-amber-600 p-8 md:p-20 lg:p-32 text-center space-y-12 overflow-hidden relative shadow-2xl shadow-brand-orange/20"
        >
          <motion.div 
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
              y: [0, -10, 0, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 md:top-0 md:right-0 p-12 opacity-15"
          >
            <BookOpen className="w-64 h-64 md:w-96 md:h-96 text-white" />
          </motion.div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
             <h2 className="font-display font-black text-4xl md:text-5xl lg:text-7xl text-white uppercase italic tracking-tighter leading-[0.9]">
                Start Your <br />Journey Today.
             </h2>
             <p className="text-white/90 font-medium italic text-lg md:text-xl">
                Ready to skill up for the future? Join our next cohort and become part of the Alpha Spark ecosystem.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link to="/apply" className="bg-brand-navy text-white px-8 py-4 md:px-12 md:py-6 rounded-full font-black uppercase tracking-widest text-xs md:text-sm hover:scale-105 hover:bg-brand-navy/90 transition-all shadow-xl">
                    Apply to Academy
                </Link>
                <Link to="/academy/dashboard" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 md:px-12 md:py-6 rounded-full font-black uppercase tracking-widest text-xs md:text-sm hover:scale-105 transition-all">
                    Sign In to Portal
                </Link>
             </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
