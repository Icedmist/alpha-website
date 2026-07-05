import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { tracks } from "../data/tracks";

export default function TrackDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const track = tracks.find(t => t.slug === slug);

  useEffect(() => {
    if (!track) {
      // If track doesn't exist, redirect to academy home
      navigate("/", { replace: true });
    }
  }, [track, navigate]);

  if (!track) return null;

  const Icon = track.icon;

  return (
    <div className="pt-24 md:pt-32 min-h-screen pb-20">
      {/* Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[60vh] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-brand-navy" />
        <img 
          src={track.image} 
          alt={track.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation */}
        <Link 
          to="/#cohorts" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Academy
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start mb-20 md:mb-32">
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-orange/20 border border-brand-orange/30"
            >
              <Icon className="w-8 h-8 text-brand-orange" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-black text-4xl md:text-6xl lg:text-7xl uppercase italic tracking-tighter leading-[0.9]"
            >
              {track.name}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-2xl text-white/70 leading-relaxed font-medium"
            >
              {track.desc}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <Link 
                to={`/?course=${track.slug}#cohorts`}
                className="inline-flex items-center gap-3 bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] md:text-xs hover:scale-105 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                View Active Cohorts
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right Image/Stats Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full lg:w-2/5 shrink-0"
          >
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="h-64 relative">
                <img src={track.image} alt={track.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent" />
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange mb-2">Target Audience</p>
                  <p className="text-white/80 text-sm leading-relaxed">{track.targetAudience}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Overview & Curriculum Split */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-32">
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-orange mb-4">Track Overview</p>
              <h2 className="font-display font-black text-3xl md:text-4xl uppercase italic tracking-tighter mb-6">
                About this <br/>Program
              </h2>
              <p className="text-white/60 leading-relaxed text-lg">
                {track.overview}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand-orange" />
              </div>
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase italic tracking-tighter">
                Curriculum Modules
              </h2>
            </div>
            
            <div className="space-y-4">
              {track.modules.map((module, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors flex gap-6"
                >
                  <div className="shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">
                      Module 0{idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {module.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed text-sm">
                      {module.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 rounded-[32px] bg-gradient-to-br from-brand-navy to-black border border-white/10 p-12 text-center"
        >
          <h2 className="font-display font-black text-3xl md:text-4xl uppercase italic tracking-tighter mb-6">
            Ready to Start?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Take the next step in your career by enrolling in our active cohorts for {track.name}.
          </p>
          <Link 
            to={`/?course=${track.slug}#cohorts`}
            className="inline-flex items-center gap-3 bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] md:text-xs hover:scale-105 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          >
            Enroll Now
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
