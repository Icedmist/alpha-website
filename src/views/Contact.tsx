import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import React, { useState } from "react";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formState);
    alert("Thank you for reaching out! We'll get back to you soon.");
  };

  return (
    <div className="pt-24 md:pt-32 min-h-screen">
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24">
            {/* Info Column */}
            <div className="space-y-12">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em]"
                >
                  Contact Us
                </motion.div>
                <h1 className="font-display font-black text-4xl md:text-6xl lg:text-6xl uppercase italic leading-none tracking-tighter text-white">
                  Get in <br /><span className="text-brand-orange">Touch.</span>
                </h1>
                <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-md italic">
                  Have questions about our programs or want to partner with us? Our team is ready to help.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Mail className="text-brand-orange w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-2">Email Us</h3>
                    <p className="text-white/60 font-medium font-mono">hello@alphaspark.ng</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Phone className="text-brand-orange w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-2">Call Us</h3>
                    <p className="text-white/60 font-medium font-mono">09075444148</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <MapPin className="text-brand-orange w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-2">Headquarters</h3>
                    <p className="text-white/60 font-medium italic">Gombe State, Nigeria.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="relative">
              <div className="absolute inset-0 bg-brand-orange/5 blur-[100px] rounded-full" />
              <div className="relative bg-white/5 border border-white/10 rounded-[32px] md:rounded-[56px] p-6 md:p-12 backdrop-blur-xl shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white placeholder:text-white/20 focus:border-brand-orange outline-none transition-colors"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white placeholder:text-white/20 focus:border-brand-orange outline-none transition-colors"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Subject</label>
                    <select 
                      className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white hover:border-brand-orange outline-none transition-colors appearance-none"
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                    >
                      <option>General Inquiry</option>
                      <option>Partnership</option>
                      <option>Academy Enrollment</option>
                      <option>Media Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4">Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white placeholder:text-white/20 focus:border-brand-orange outline-none transition-colors resize-none"
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-brand-orange/20"
                  >
                    Send Message
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Sneak Peek */}
      <section className="px-6 py-20 md:py-32 lg:py-40 bg-white/2 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                <MessageSquare className="text-brand-orange w-8 h-8" />
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase italic tracking-tight">Common Questions</h2>
            <div className="grid gap-6 text-left">
                {[
                    { q: "How do I apply for the academy?", a: "You can apply directly through our Academy portal. Enrollment happens in cohorts." },
                    { q: "Is the Talent Cloud free for students?", a: "Yes, every graduate of our academy gets a verified profile in the Talent Cloud for life." },
                    { q: "Do you offer corporate training?", a: "Absolutely. We build custom workforce infrastructure for organizations of all sizes." }
                ].map((item, i) => (
                    <div key={i} className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10">
                        <h4 className="font-bold text-white mb-2 uppercase text-sm tracking-tight">{item.q}</h4>
                        <p className="text-white/40 text-sm italic">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
