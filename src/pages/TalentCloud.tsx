import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Cloud, 
  Database, 
  ShieldCheck, 
  Search, 
  Cpu, 
  BarChart, 
  Users,
  CheckCircle2,
  Award
} from "lucide-react";
import { courses, Course } from "../data/courses";

interface Graduate {
  id: string;
  name: string;
  courseTitle: string;
  certId: string;
  skills: string[];
  date: string;
}

export default function TalentCloud() {
  const [graduates, setGraduates] = useState<Graduate[]>([]);

  useEffect(() => {
    // Read from sandbox
    const rawUsers = localStorage.getItem("alpha_academy_users");
    const users = rawUsers ? JSON.parse(rawUsers) : [];
    const localCoursesStr = localStorage.getItem("alpha_custom_courses");
    const activeCourses: Course[] = localCoursesStr ? JSON.parse(localCoursesStr) : courses;

    const list: Graduate[] = [];

    // Seed mock graduates for visual fullness
    const mockGraduates: Graduate[] = [
      {
        id: "mock-1",
        name: "Mustapha Yusuf",
        courseTitle: "Machine Learning & AI",
        certId: "AS-MLAI-YUSUF9",
        skills: ["Python", "TensorFlow", "Scikit-Learn"],
        date: "05/12/2025"
      },
      {
        id: "mock-2",
        name: "Sani Ibrahim",
        courseTitle: "Cloud Architecture & DevOps",
        certId: "AS-CLDE-IBRAH2",
        skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
        date: "06/01/2026"
      }
    ];

    // Read real graduates from registry
    users.forEach((user: any) => {
      user.enrolledCourses?.forEach((courseId: string) => {
        const course = activeCourses.find(c => c.id === courseId);
        if (!course) return;

        const courseLessons = course.modules.flatMap(m => m.lessons);
        const completedAll = courseLessons.length > 0 && courseLessons.every(l => user.completedLessons?.includes(l.id));

        if (completedAll) {
          list.push({
            id: `${user.id}-${course.id}`,
            name: user.name,
            courseTitle: course.title,
            certId: `AS-${course.id.toUpperCase()}-${user.id.substring(2).toUpperCase()}`,
            skills: course.tools.slice(0, 3),
            date: new Date().toLocaleDateString()
          });
        }
      });
    });

    // Combine real + mock
    setGraduates([...list, ...mockGraduates]);
  }, []);

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
            
            {/* Cloud Terminal: Live Graduates Registry */}
            <div className="bg-white/[0.03] border border-white/10 p-6 md:p-10 rounded-[32px] md:rounded-[48px] backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div>
                        <span className="font-display font-black text-lg uppercase italic text-brand-orange">Talent Registry</span>
                        <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest mt-1">Live Verified Scholars</p>
                    </div>
                    <Search className="text-white/20 w-5 h-5" />
                </div>
                
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                    {graduates.map((grad) => (
                        <div 
                          key={grad.id} 
                          className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-orange/30 transition-all flex justify-between items-center gap-4"
                        >
                            <div className="space-y-2 text-left">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-xs text-white">{grad.name}</h4>
                                    <Award className="w-3.5 h-3.5 text-brand-orange" />
                                </div>
                                <p className="text-[10px] text-white/50">{grad.courseTitle}</p>
                                <div className="flex flex-wrap gap-1">
                                    {grad.skills.map((s, idx) => (
                                        <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-mono text-white/40">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="font-mono text-[8px] font-bold text-brand-blue block">ID: {grad.certId}</span>
                                <span className="text-[8px] text-white/20 font-mono block mt-1">{grad.date}</span>
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
