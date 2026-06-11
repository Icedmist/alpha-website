import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "../components/academy/StudentDashboard";
import InstructorDashboard from "../components/academy/InstructorDashboard";
import AdminDashboard from "../components/academy/AdminDashboard";
import AccountCenter from "../components/academy/AccountCenter";
import ReferralModal from "../components/academy/ReferralModal";
import { LogOut, User, Lock, Mail, Phone, BookOpen, ShieldCheck, Zap, LayoutDashboard, Gift, BarChart, Users, ClipboardCheck, Award, Menu, X } from "lucide-react";

export default function AcademyDashboard() {
  const { currentUser, login, register, logout, resetPassword } = useAuth();
  
  // Dashboard tabs
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      setActiveTab("admin_analytics");
    } else if (currentUser?.role === "instructor") {
      setActiveTab("instructor_grading");
    } else {
      setActiveTab("dashboard");
    }
  }, [currentUser]);

  // Form toggles
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "instructor" | "admin">("student");
  
  // Feedback messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (showForgot) {
        const msg = await resetPassword(email);
        setSuccess(msg);
        setShowForgot(false);
      } else if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, phone, password, selectedRole);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="min-h-screen bg-[#080c14] text-white flex flex-col md:flex-row w-full">
        {/* Mobile Dashboard Top Header */}
        <div className="md:hidden flex justify-between items-center bg-[#0d1220] border-b border-white/10 px-6 py-4 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.svg" alt="Alpha Spark Logo" className="w-6 h-6 object-contain" />
            <span className="font-display font-black text-sm uppercase tracking-tight text-white italic">
              Alpha <span className="text-brand-orange">Academy</span>
            </span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="text-white hover:text-brand-orange transition-colors p-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden w-full bg-[#0d1220]/95 backdrop-blur-xl border-b border-white/10 absolute top-[57px] left-0 z-20 flex flex-col p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-57px)]"
            >
              {/* User Profile Info */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${currentUser.avatarGradient || 'from-brand-orange to-brand-blue'} flex items-center justify-center font-bold text-white uppercase shrink-0`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                  <p className="text-[9px] text-white/40 truncate">{currentUser.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  currentUser.role === "admin" 
                    ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                    : currentUser.role === "instructor" 
                      ? "bg-[#3bb75e]/10 border border-[#3bb75e]/20 text-[#3bb75e]" 
                      : "bg-brand-blue/10 border border-brand-blue/20 text-brand-blue"
                }`}>
                  {currentUser.role}
                </span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 px-3">Portal Menu</span>
                
                {currentUser.role === "admin" && (
                  <>
                    <button 
                      onClick={() => { setActiveTab("admin_analytics"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        activeTab === "admin_analytics" ? "text-white bg-white/10" : "text-white/60"
                      }`}
                    >
                      <BarChart className="w-4 h-4 text-brand-orange" />
                      Analytics Overview
                    </button>
                    <button 
                      onClick={() => { setActiveTab("admin_users"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        activeTab === "admin_users" ? "text-white bg-white/10" : "text-white/60"
                      }`}
                    >
                      <Users className="w-4 h-4 text-brand-blue" />
                      User Access
                    </button>
                    <button 
                      onClick={() => { setActiveTab("admin_courses"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        activeTab === "admin_courses" ? "text-white bg-white/10" : "text-white/60"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-[#3bb75e]" />
                      Course Catalog
                    </button>
                    <button 
                      onClick={() => { setActiveTab("admin_applications"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        activeTab === "admin_applications" ? "text-white bg-white/10" : "text-white/60"
                      }`}
                    >
                      <ClipboardCheck className="w-4 h-4 text-yellow-400" />
                      Applications Panel
                    </button>
                    <button 
                      onClick={() => { setActiveTab("admin_certificates"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        activeTab === "admin_certificates" ? "text-white bg-white/10" : "text-white/60"
                      }`}
                    >
                      <Award className="w-4 h-4 text-purple-400" />
                      Certificates Registry
                    </button>
                    <button 
                      onClick={() => { setActiveTab("admin_system_activities"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        activeTab === "admin_system_activities" ? "text-white bg-white/10" : "text-white/60"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-red-400" />
                      System Activities
                    </button>
                  </>
                )}

                {currentUser.role === "instructor" && (
                  <>
                    <button 
                      onClick={() => { setActiveTab("instructor_grading"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        activeTab === "instructor_grading" ? "text-white bg-white/10" : "text-white/60"
                      }`}
                    >
                      <ClipboardCheck className="w-4 h-4 text-brand-orange" />
                      Grading Center
                    </button>
                    <button 
                      onClick={() => { setActiveTab("instructor_students"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        activeTab === "instructor_students" ? "text-white bg-white/10" : "text-white/60"
                      }`}
                    >
                      <Users className="w-4 h-4 text-brand-blue" />
                      Student Roster
                    </button>
                    <button 
                      onClick={() => { setActiveTab("instructor_lessons"); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        activeTab === "instructor_lessons" ? "text-white bg-white/10" : "text-white/60"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-[#3bb75e]" />
                      Syllabus Builder
                    </button>
                  </>
                )}

                {currentUser.role === "student" && (
                  <button 
                    onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      activeTab === "dashboard" ? "text-white bg-white/10" : "text-white/60"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-orange" />
                    My Dashboard
                  </button>
                )}

                <button 
                  onClick={() => { setActiveTab("account"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    activeTab === "account" ? "text-white bg-white/10" : "text-white/60"
                  }`}
                >
                  <User className="w-4 h-4 text-brand-blue" />
                  Account Center
                </button>
                
                <button 
                  onClick={() => { setShowReferralModal(true); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-brand-orange" />
                  Refer & Earn
                </button>
              </div>

              {/* Ecosystem Links */}
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 px-3">Ecosystem Links</span>
                <a 
                  href="/" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Zap className="w-4 h-4 text-brand-orange" />
                  Ecosystem Home
                </a>
                <a 
                  href="/talent-cloud" 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-brand-blue" />
                  Talent Cloud
                </a>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop/Tablet Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 bg-brand-navy border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between p-6 md:h-screen sticky top-0 shrink-0">
          <div className="space-y-8">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <img src="/assets/logo.svg" alt="Alpha Spark Logo" className="w-8 h-8 object-contain" />
              <div>
                <h2 className="font-display font-black text-base tracking-tighter uppercase italic leading-none text-white">ALPHA SPARK</h2>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-orange">ACADEMY PORTAL</span>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${currentUser.avatarGradient || 'from-brand-orange to-brand-blue'} flex items-center justify-center font-bold text-white uppercase shadow-md shadow-brand-orange/20 shrink-0`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                  <p className="text-[9px] text-white/40 truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                <span className="text-[8px] font-black text-white/45 uppercase tracking-wider">Access Tier</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                  currentUser.role === "admin" 
                    ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                    : currentUser.role === "instructor" 
                      ? "bg-[#3bb75e]/10 border border-[#3bb75e]/20 text-[#3bb75e]" 
                      : "bg-brand-blue/10 border border-brand-blue/20 text-brand-blue"
                }`}>
                  {currentUser.role}
                </span>
              </div>
            </div>

            {/* Portal Navigation Menu */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 px-3">Portal Menu</span>
              {currentUser.role === "admin" ? (
                <>
                  <button 
                    onClick={() => setActiveTab("admin_analytics")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "admin_analytics" 
                        ? "text-white bg-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <BarChart className="w-4 h-4 text-brand-orange" />
                    Analytics Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab("admin_users")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "admin_users" 
                        ? "text-white bg-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Users className="w-4 h-4 text-brand-blue" />
                    User Access
                  </button>
                  <button 
                    onClick={() => setActiveTab("admin_courses")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "admin_courses" 
                        ? "text-white bg-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#3bb75e]" />
                    Course Catalog
                  </button>
                  <button 
                    onClick={() => setActiveTab("admin_applications")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "admin_applications" 
                        ? "text-white bg-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ClipboardCheck className="w-4 h-4 text-yellow-400" />
                    Applications Panel
                  </button>
                  <button 
                    onClick={() => setActiveTab("admin_certificates")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "admin_certificates" 
                        ? "text-white bg-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Award className="w-4 h-4 text-purple-400" />
                    Certificates Registry
                  </button>
                  <button 
                    onClick={() => setActiveTab("admin_system_activities")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "admin_system_activities" 
                        ? "text-white bg-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                    System Activities
                  </button>
                </>
              ) : currentUser.role === "instructor" ? (
                <>
                  <button 
                    onClick={() => setActiveTab("instructor_grading")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "instructor_grading" 
                        ? "text-white bg-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ClipboardCheck className="w-4 h-4 text-brand-orange" />
                    Grading Center
                  </button>
                  <button 
                    onClick={() => setActiveTab("instructor_students")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "instructor_students" 
                        ? "text-white bg-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Users className="w-4 h-4 text-brand-blue" />
                    Student Roster
                  </button>
                  <button 
                    onClick={() => setActiveTab("instructor_lessons")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "instructor_lessons" 
                        ? "text-white bg-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#3bb75e]" />
                    Syllabus Builder
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === "dashboard" 
                      ? "text-white bg-white/10" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-orange" />
                  My Dashboard
                </button>
              )}
              <button 
                onClick={() => setActiveTab("account")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === "account" 
                    ? "text-white bg-white/10" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <User className="w-4 h-4 text-brand-blue" />
                Account Center
              </button>
              <button 
                onClick={() => setShowReferralModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
              >
                <Gift className="w-4 h-4 text-brand-orange" />
                Refer & Earn
              </button>
            </div>

            {/* General Portal Tools / Stats (Quick indicators in Sidebar) */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 px-3">Ecosystem Links</span>
              <a 
                href="/" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Zap className="w-4 h-4 text-brand-orange" />
                Ecosystem Home
              </a>
              <a 
                href="/talent-cloud" 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-brand-blue" />
                Talent Cloud
              </a>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <div className="text-center text-[8px] text-white/20 font-mono">
              Session: Secured Sandbox
            </div>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 md:h-screen md:overflow-y-auto p-6 md:p-10 space-y-8 bg-[#0a0d16]">

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab.startsWith("admin_") ? (
              <AdminDashboard 
                activeView={activeTab.replace("admin_", "") as any} 
                onTabChange={(tab) => setActiveTab("admin_" + tab)}
              />
            ) : activeTab.startsWith("instructor_") ? (
              <InstructorDashboard 
                activeView={activeTab.replace("instructor_", "") as any} 
                onTabChange={(tab) => setActiveTab("instructor_" + tab)}
              />
            ) : activeTab === "dashboard" ? (
              <>
                {currentUser.role === "student" && <StudentDashboard />}
              </>
            ) : (
              <AccountCenter />
            )}
          </motion.div>
        </main>

        <AnimatePresence>
          {showReferralModal && (
            <ReferralModal onClose={() => setShowReferralModal(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 min-h-screen px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[9px] font-black uppercase tracking-[0.4em]">
              Academy Workspace
            </span>
            <h1 className="font-display font-black text-3xl md:text-4xl uppercase italic tracking-tight text-white">
              {showForgot ? "Reset Password" : isLogin ? "Welcome Back" : "Register Profile"}
            </h1>
            <p className="text-sm text-white/45 italic leading-relaxed">
              {showForgot 
                ? "Enter your email to request sandbox reset details." 
                : isLogin 
                  ? "Access student, instructor, or admin portal views." 
                  : "Create an account to enroll in technical tracks."}
            </p>
          </div>

          <motion.div
            layout
            className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Zap className="w-64 h-64 text-white" />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-[#3bb75e]/10 border border-[#3bb75e]/20 text-[#3bb75e] rounded-xl text-xs font-semibold">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {showForgot ? (
                /* Forgot Password Form */
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40 ml-4">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                    />
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white/20" />
                  </div>
                </div>
              ) : (
                /* Standard Forms */
                <>
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-white/40 ml-4">Full Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="Mustapha Yusuf"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                          />
                          <User className="absolute left-4 top-3.5 w-4 h-4 text-white/20" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-white/40 ml-4">Phone Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="+234..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                          />
                          <Phone className="absolute left-4 top-3.5 w-4 h-4 text-white/20" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-white/40 ml-4">Register As Role (For Testing)</label>
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as any)}
                          className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                        >
                          <option value="student">Student Scholar</option>
                          <option value="instructor">Cohort Instructor</option>
                          <option value="admin">System Admin</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/40 ml-4">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                      />
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white/20" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-white/40 ml-4">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 pl-12 text-sm text-white focus:border-brand-orange outline-none"
                      />
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white/20" />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors cursor-pointer"
              >
                {loading ? "Processing..." : showForgot ? "Reset Sandbox" : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Toggles */}
            <div className="mt-8 border-t border-white/5 pt-6 flex flex-col items-center gap-3 text-xs text-white/40 font-bold uppercase tracking-widest">
              {showForgot ? (
                <button 
                  onClick={() => { setShowForgot(false); setError(""); setSuccess(""); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Back to Login
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => { window.location.href = "http://localhost:3000/apply"; }}
                    className="hover:text-white transition-colors cursor-pointer text-brand-orange"
                  >
                    Need an Account? Register & Apply
                  </button>
                  <button 
                    onClick={() => { setShowForgot(true); setError(""); setSuccess(""); }}
                    className="text-[10px] hover:text-white/60 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Test Credentials Box */}
          <div className="bg-white/2 border border-white/5 p-4 rounded-2xl text-[10px] font-mono text-white/35 space-y-2 leading-relaxed text-center">
            <p className="font-bold text-white/50 uppercase">Sandbox Account Logins:</p>
            <p>Admin: <span className="text-white">admin@alphaspark.tech</span> / <span className="text-white">admin123</span></p>
            <p>Instructor: <span className="text-white">instructor@alphaspark.tech</span> / <span className="text-white">instructor123</span></p>
            <p>Student: <span className="text-white">student@alphaspark.tech</span> / <span className="text-white">student123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
