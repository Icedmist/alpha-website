import { motion } from "motion/react";
import React, { useState } from "react";
import { CheckCircle2, User, BookOpen, MapPin, Briefcase, GraduationCap, ArrowRight, Zap, ShieldCheck, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Apply() {
  const { currentUser, register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    program: "Full Stack Web Development",
    background: "student",
    experience: "Beginner (0-1 years)",
    reason: ""
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitError("");
    setLoading(true);

    try {
      // 1. Validate personal details
      if (!currentUser) {
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email || !formData.phone) {
          throw new Error("Please fill out all personal details in step 1.");
        }
      }

      // 2. Submit application & auto-enroll
      const appRes = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          program: formData.program,
          background: formData.background,
          experience: formData.experience,
          reason: formData.reason
        }),
      });

      if (!appRes.ok) {
        const errorData = await appRes.json();
        throw new Error(errorData.error || "Failed to submit application.");
      }

      setStep(4); // Success step
      
      // Auto-redirect to WhatsApp
      setTimeout(() => {
        const applicantName = currentUser ? currentUser.name : `${formData.firstName} ${formData.lastName}`.trim();
        const applicantEmail = currentUser ? currentUser.email : formData.email;
        const message = `Hello! I am registering for Alpha Spark Academy.\nName: ${applicantName}\nEmail: ${applicantEmail}\nProgram: ${formData.program}\nReference Mail: ishaqsultan7541@gmail.com`;
        window.location.href = `https://wa.me/2349117514707?text=${encodeURIComponent(message)}`;
      }, 2500);

    } catch (err: any) {
      console.error("Application submission failed:", err);
      setSubmitError(err.message || "Something went wrong while submitting your application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const programs = [
    "Financial Technology (FinTech)",
    "Full Stack Web Development",
    "Graphic Design",
    "Entrepreneurship & Startups",
    "Digital Marketing",
    "AI & Machine Learning",
    "UI/UX Design",
    "Data Science & Analytics",
    "Cybersecurity Strategy",
    "Product Management",
    "Mobile App Development",
    "Blockchain & Web3"
  ];

  return (
    <div className="pt-24 md:pt-32 min-h-screen">
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em]"
            >
              Academy Enrollment
            </motion.div>
            <h1 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic leading-none tracking-tighter">
              Ignite Your <br /><span className="text-brand-orange">Future.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-medium italic">
              Apply to join the next cohort of Alpha Spark scholars.
            </p>
          </div>

          {/* Form Progress */}
          <div className="flex justify-between items-center mb-12 px-8 relative">
            <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-8 h-0.5 bg-brand-orange -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${(step - 1) * 50}%` }}
            />
            
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-black z-10 transition-colors duration-500 ${
                  step >= s ? "bg-brand-orange text-white" : "bg-brand-navy border border-white/10 text-white/20"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>

          {/* Form Container */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[56px] p-6 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap className="w-64 h-64 text-white" />
            </div>

            {submitError && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold">
                {submitError}
              </div>
            )}

            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10 relative z-10"
              >
                <div className="flex items-center gap-4 mb-8">
                    <User className="text-brand-orange w-6 h-6" />
                    <h2 className="font-display font-bold text-2xl md:text-3xl uppercase italic tracking-tight">Personal Info</h2>
                </div>

                {currentUser && (
                  <div className="p-4 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-2xl text-xs font-semibold">
                    Applying as logged-in user: <span className="text-white">{currentUser.name} ({currentUser.email})</span>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">First Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white outline-none focus:border-brand-orange"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white outline-none focus:border-brand-orange"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white outline-none focus:border-brand-orange"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!!currentUser}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white outline-none focus:border-brand-orange"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Current Location</label>
                    <div className="relative">
                        <input 
                          type="text" 
                          placeholder="City, State"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white outline-none focus:border-brand-orange pl-12"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                        <MapPin className="absolute left-4 top-3 md:top-4.5 text-white/20 w-5 h-5" />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={nextStep}
                  className="w-full bg-brand-orange text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 group"
                >
                  Continue to Program Selection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10 relative z-10"
              >
                <div className="flex items-center gap-4 mb-8">
                    <BookOpen className="text-brand-orange w-6 h-6" />
                    <h2 className="font-display font-bold text-2xl md:text-3xl uppercase italic tracking-tight">Program & Background</h2>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Select Your Learning Track</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {programs.map((p) => (
                      <button 
                        key={p}
                        onClick={() => setFormData({...formData, program: p})}
                        className={`p-4 md:p-6 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          formData.program === p ? "bg-brand-orange border-brand-orange text-white shadow-xl shadow-brand-orange/20" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                        }`}
                      >
                        <span className="font-bold uppercase tracking-tight text-xs md:text-sm">{p}</span>
                        {formData.program === p && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Current Status</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { id: "student", label: "Student", icon: GraduationCap },
                            { id: "professional", label: "Professional", icon: Briefcase },
                            { id: "unemployed", label: "Freelancer", icon: Zap }
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setFormData({...formData, background: s.id})}
                                className={`p-4 md:p-6 rounded-2xl border flex sm:flex-col items-center gap-4 sm:gap-3 transition-all ${
                                    formData.background === s.id ? "bg-brand-blue border-brand-blue text-white" : "bg-white/5 border-white/10 text-white/40"
                                }`}
                            >
                                <s.icon className="w-6 h-6 md:w-8 md:h-8" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 bg-white/5 text-white/60 py-5 rounded-2xl font-black uppercase tracking-widest border border-white/10">Back</button>
                  <button onClick={nextStep} className="flex-[2] bg-brand-orange text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 group">
                    Finalize Application
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10 relative z-10"
              >
                <div className="flex items-center gap-4 mb-8">
                    <Zap className="text-brand-orange w-6 h-6" />
                    <h2 className="font-display font-bold text-2xl md:text-3xl uppercase italic tracking-tight">Motivation</h2>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Experience Level</label>
                  <select 
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white outline-none focus:border-brand-orange appearance-none"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  >
                    <option>Beginner (0-1 years)</option>
                    <option>Intermediate (1-3 years)</option>
                    <option>Advanced (3+ years)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Why do you want to join Alpha Spark?</label>
                  <textarea 
                    rows={6}
                    placeholder="Tell us about your goals and how this program will help you."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white outline-none focus:border-brand-orange resize-none"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  />
                </div>

                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 bg-white/5 text-white/60 py-5 rounded-2xl font-black uppercase tracking-widest border border-white/10">Back</button>
                  <button onClick={handleSubmit} className="flex-[2] bg-brand-orange text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-orange/20">
                    Submit Application
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-8 relative z-10"
              >
                <div className="w-32 h-32 bg-[#25D366] rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#25D366]/40">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
                <div className="space-y-4">
                  <h2 className="font-display font-black text-3xl md:text-4xl uppercase italic tracking-tight">Redirecting to WhatsApp...</h2>
                  <p className="text-white/40 max-w-sm mx-auto italic text-sm md:text-base">
                    Your application is submitted! You are being redirected to WhatsApp to finalize your registration.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={() => {
                      const applicantName = currentUser ? currentUser.name : `${formData.firstName} ${formData.lastName}`.trim();
                      const applicantEmail = currentUser ? currentUser.email : formData.email;
                      const message = `Hello! I am registering for Alpha Spark Academy.\nName: ${applicantName}\nEmail: ${applicantEmail}\nProgram: ${formData.program}\nReference Mail: ishaqsultan7541@gmail.com`;
                      window.location.href = `https://wa.me/2349117514707?text=${encodeURIComponent(message)}`;
                    }}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Open WhatsApp Now
                  </button>
                  <button 
                    onClick={() => window.location.href = "/"}
                    className="bg-white/5 border border-white/10 text-white/60 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                  >
                    Return to Homepage
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 md:gap-12 opacity-20">
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                <ShieldCheck className="w-5 h-5" /> Secured Data
            </div>
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                <CheckCircle2 className="w-5 h-5" /> Verified Certs
            </div>
            <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                <Zap className="w-5 h-5" /> Fast Processing
            </div>
        </div>
      </section>
    </div>
  );
}
