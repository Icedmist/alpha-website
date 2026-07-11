import React, { useState, useEffect } from "react";
import { 
  BarChart, Users, DollarSign, BookOpen, Award, Shield, 
  Trash2, UserPlus, RefreshCw, Layers, PlusCircle, Edit3, ShieldAlert,
  Plus, Edit, Loader2, Download, Mail, Send, Sparkles, UserCheck, Share2
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CertificateTemplate, CertificateProps } from "./CertificateTemplate";
import { courses, Course } from "../../data/courses";
import { useAuth, User } from "../../context/AuthContext";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  createdAt: string;
}

type AdminTab = "analytics" | "users" | "courses" | "applications" | "certificates" | "system_activities" | "partners" | "communications";

interface AdminDashboardProps {
  activeView?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
}

export default function AdminDashboard({ activeView, onTabChange }: AdminDashboardProps = {}) {
  const { allUsers, updateSpecificUser, loadAllUsers, deleteUser, getAuthHeaders, adminCreateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");

  // User creation state
  const [showAddUser, setShowAddUser] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", phone: "", password: "", role: "student" as const });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      await adminCreateUser(newUserForm.name, newUserForm.email, newUserForm.phone, newUserForm.password, newUserForm.role);
      alert(`User ${newUserForm.name} created successfully!`);
      setShowAddUser(false);
      setNewUserForm({ name: "", email: "", phone: "", password: "", role: "student" });
    } catch (error: any) {
      alert(error.message || "Failed to create user");
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Partners state
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [partnerForm, setPartnerForm] = useState({ name: "", logoUrl: "", websiteUrl: "" });

  // PDF Generation state
  const [printData, setPrintData] = useState<CertificateProps | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const certificateRef = React.useRef<HTMLDivElement>(null);

  // Communications state
  const [commTab, setCommTab] = useState<"newsletter" | "manual" | "welcome" | "referral">("newsletter");
  const [commForm, setCommForm] = useState({ subject: "", title: "", content: "", emails: "" });
  const [referralForm, setReferralForm] = useState({ friendName: "", referrerName: "", email: "" });
  const [welcomeForm, setWelcomeForm] = useState({ subject: "", email: "", firstName: "" });
  const [isSendingComm, setIsSendingComm] = useState(false);

  const handleSendCommunications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingComm(true);
    try {
      let payload: any = {};
      
      if (commTab === "newsletter") {
        if (subscribers.length === 0) {
          alert("No subscribers found!");
          setIsSendingComm(false);
          return;
        }
        payload = {
          emailType: "newsletter",
          subject: commForm.subject,
          title: commForm.title,
          content: commForm.content.split('\n').filter(Boolean),
          emails: subscribers.map(s => s.email)
        };
      } else if (commTab === "manual") {
        payload = {
          emailType: "manual",
          subject: commForm.subject,
          title: commForm.title,
          content: commForm.content.split('\n').filter(Boolean),
          emails: commForm.emails.split(',').map(e => e.trim()).filter(Boolean)
        };
      } else if (commTab === "welcome") {
        payload = {
          emailType: "welcome",
          subject: welcomeForm.subject || "Welcome to Alpha Spark Academy!",
          firstName: welcomeForm.firstName,
          emails: [welcomeForm.email]
        };
      } else if (commTab === "referral") {
        payload = {
          emailType: "referral",
          friendName: referralForm.friendName,
          referrerName: referralForm.referrerName,
          emails: [referralForm.email]
        };
      }

      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/admin/communications", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Emails sent successfully!");
        setCommForm({ subject: "", title: "", content: "", emails: "" });
        setReferralForm({ friendName: "", referrerName: "", email: "" });
        setWelcomeForm({ subject: "", email: "", firstName: "" });
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to send emails.");
      }
    } catch (err: any) {
      alert("Error sending emails: " + err.message);
    } finally {
      setIsSendingComm(false);
    }
  };

  const handleDownloadCertificate = async (data: CertificateProps) => {
    setIsGenerating(data.certId);
    setPrintData(data);
    
    // Wait for React to render the hidden component
    setTimeout(async () => {
      if (certificateRef.current) {
        try {
          const canvas = await html2canvas(certificateRef.current, {
            scale: 2, 
            useCORS: true,
            backgroundColor: '#1a1b2e'
          });
          
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          });
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`AlphaSpark_Cert_${data.studentName.replace(/\\s+/g, '_')}.pdf`);
        } catch (error) {
          console.error("Failed to generate PDF", error);
          alert("Failed to generate certificate PDF.");
        }
      }
      setIsGenerating(null);
      setPrintData(null);
    }, 500); 
  };

  useEffect(() => {
    if (activeView) {
      setActiveTab(activeView);
    }
  }, [activeView]);

  // Activities & Subscribers states
  const [activities, setActivities] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    // Reload user/student list from server
    if (loadAllUsers) {
      loadAllUsers();
    }

    if (activeTab === "system_activities" || activeTab === "communications") {
      const fetchData = async () => {
        setLoadingActivities(true);
        try {
          const authHeaders = await getAuthHeaders();
          if (activeTab === "system_activities") {
            const actRes = await fetch("/api/admin/activities", { headers: authHeaders });
            if (actRes.ok) {
              const actData = await actRes.json();
              setActivities(actData);
            }
          }
          const subRes = await fetch("/api/admin/newsletter", { headers: authHeaders });
          if (subRes.ok) {
            const subData = await subRes.json();
            setSubscribers(subData);
          }
        } catch (err) {
          console.error("Failed to fetch admin activities/subscribers data:", err);
        } finally {
          setLoadingActivities(false);
        }
      };
      fetchData();
    } else if (activeTab === "applications") {
      const fetchApplications = async () => {
        setLoadingApplications(true);
        try {
          const authHeaders = await getAuthHeaders();
          const res = await fetch("/api/admin/applications", { headers: authHeaders });
          if (res.ok) {
            const data = await res.json();
            setApplications(data);
          }
        } catch (err) {
          console.error("Failed to fetch admin applications data:", err);
        } finally {
          setLoadingApplications(false);
        }
      };
      fetchApplications();
    } else if (activeTab === "partners") {
      fetchPartners();
    }
  }, [activeTab]);

  // Local state for Course CRUD
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubtitle, setCourseSubtitle] = useState("");
  const [courseFee, setCourseFee] = useState("₦20,000");
  const [courseDuration, setCourseDuration] = useState("6 WEEKS");
  const [courseHours, setCourseHours] = useState("36 HRS");
  const [courseLevel, setCourseLevel] = useState("BEGINNER");
  const [courseOutcome, setCourseOutcome] = useState("");
  const [courseLearnText, setCourseLearnText] = useState("");
  const [courseToolsText, setCourseToolsText] = useState("");
  const [courseIcon, setCourseIcon] = useState("Code");
  const [courseImageUrl, setCourseImageUrl] = useState("");

  // Certificate generation states
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const students = allUsers.filter(u => u.role === "student");
  const instructors = allUsers.filter(u => u.role === "instructor");

  // Custom courses logic to pull dynamic additions
  const [activeCourses, setActiveCourses] = useState<Course[]>(courses);
  
  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setActiveCourses(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "courses" || activeTab === "certificates" || activeTab === "analytics") {
      fetchCourses();
    }
  }, [activeTab]);

  // Helper: calculate total revenue
  // We sum up the fee of all enrolled courses for all students
  const totalRevenue = students.reduce((acc, student) => {
    const fees = student.enrolledCourses.reduce((sum, courseId) => {
      const courseObj = activeCourses.find(c => c.id === courseId);
      if (courseObj) {
        // Parse fee e.g. "₦25,000" -> 25000
        const numeric = parseInt(courseObj.fee.replace(/\D/g, "")) || 0;
        return sum + numeric;
      }
      return sum;
    }, 0);
    return acc + fees;
  }, 0);

  // Helper: total graduates
  const totalGraduates = students.filter(student => {
    // Check if user has graduated any enrolled course
    return student.enrolledCourses.some(courseId => {
      const course = activeCourses.find(c => c.id === courseId);
      if (!course) return false;
      const courseLessons = course.modules.flatMap(m => m.lessons);
      const completedAll = courseLessons.every(l => student.completedLessons.includes(l.id));
      
      const hasGrades = courseLessons.filter(l => l.type === 'assignment').every(a => 
        student.submissions.some(s => s.lessonId === a.id)
      );

      // Attendance check
      const attendanceDays = (student.attendanceDates || []).length;
      const attendancePercent = Math.min(
        100,
        Math.round(
          (attendanceDays / 4) * 60 + 
          (student.completedLessons.length > 0 ? (student.completedLessons.length / 10) * 40 : 0)
        )
      );

      return completedAll && hasGrades && attendancePercent >= 80;
    });
  }).length;

  const handleRoleChange = (userId: string, newRole: "student" | "instructor" | "admin") => {
    const userObj = allUsers.find(u => u.id === userId);
    if (!userObj) return;

    updateSpecificUser(userId, {
      ...userObj,
      role: newRole
    });
    alert(`Role updated successfully for ${userObj.name}!`);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseSubtitle) return;

    const newCourseId = `c-${Math.random().toString(36).substring(2, 9)}`;
    const newCourse = {
      id: newCourseId,
      title: courseTitle,
      subtitle: courseSubtitle,
      duration: courseDuration,
      hours: courseHours,
      level: courseLevel,
      certificate: "VERIFIED",
      fee: courseFee,
      learn: courseLearnText.split("\n").filter(Boolean),
      outcome: courseOutcome || `Earn competency in ${courseTitle}`,
      careerPaths: [courseTitle + " Consultant"],
      talentCloud: "Graduates get added to our African verified talent database",
      accentColor: "#0099CC",
      tools: courseToolsText.split(",").map(t => t.trim()).filter(Boolean),
      iconName: courseIcon,
      imageUrl: courseImageUrl,
      modules: []
    };

    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        alert(`Course "${courseTitle}" created successfully!`);
        setShowAddCourse(false);
        setCourseTitle("");
        setCourseSubtitle("");
        setCourseOutcome("");
        setCourseLearnText("");
        setCourseToolsText("");
        setCourseImageUrl("");
        await fetchCourses();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to create course.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating course.");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`/api/courses?id=${courseId}`, {
        method: "DELETE",
        headers: authHeaders
      });
      if (res.ok) {
        alert("Course deleted from database.");
        await fetchCourses();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete course.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting course.");
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowAddCourse(true);
    setCourseTitle(course.title);
    setCourseSubtitle(course.subtitle);
    setCourseFee(course.fee);
    setCourseDuration(course.duration);
    setCourseHours(course.hours);
    setCourseLevel(course.level);
    setCourseOutcome(course.outcome);
    setCourseLearnText(course.learn.join("\n"));
    setCourseToolsText(course.tools.join(", "));
    setCourseIcon(course.iconName);
    setCourseImageUrl(course.imageUrl || "");
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseSubtitle || !editingCourse) return;

    const updatedCourse = {
      id: editingCourse.id,
      title: courseTitle,
      subtitle: courseSubtitle,
      duration: courseDuration,
      hours: courseHours,
      level: courseLevel,
      certificate: editingCourse.certificate,
      fee: courseFee,
      learn: courseLearnText.split("\n").filter(Boolean),
      outcome: courseOutcome || `Earn competency in ${courseTitle}`,
      careerPaths: editingCourse.careerPaths,
      talentCloud: editingCourse.talentCloud,
      accentColor: editingCourse.accentColor,
      tools: courseToolsText.split(",").map(t => t.trim()).filter(Boolean),
      iconName: courseIcon,
      imageUrl: courseImageUrl,
      modules: editingCourse.modules
    };

    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/courses", {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(updatedCourse)
      });
      if (res.ok) {
        alert(`Course "${courseTitle}" updated successfully!`);
        setShowAddCourse(false);
        setEditingCourse(null);
        setCourseTitle("");
        setCourseSubtitle("");
        setCourseOutcome("");
        setCourseLearnText("");
        setCourseToolsText("");
        setCourseImageUrl("");
        await fetchCourses();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update course.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating course.");
    }
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setShowAddCourse(false);
    setCourseTitle("");
    setCourseSubtitle("");
    setCourseOutcome("");
    setCourseLearnText("");
    setCourseToolsText("");
    setCourseImageUrl("");
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) return;

    const studentObj = students.find(s => s.id === selectedStudentId);
    const courseObj = activeCourses.find(c => c.id === selectedCourseId);
    if (!studentObj || !courseObj) return;

    // Simulate graduation requirements by pushing all lessons of this course to completedLessons
    const courseLessons = courseObj.modules.flatMap(m => m.lessons);
    const lessonIds = courseLessons.map(l => l.id);
    
    // Union existing completed with new
    const updatedCompleted = Array.from(new Set([...studentObj.completedLessons, ...lessonIds]));

    // Update student's submissions to force graded if they have assignments
    const courseAssignments = courseLessons.filter(l => l.type === "assignment");
    const updatedSubmissions = [...studentObj.submissions];
    courseAssignments.forEach(a => {
      if (!updatedSubmissions.some(s => s.lessonId === a.id)) {
        updatedSubmissions.push({
          courseId: courseObj.id,
          lessonId: a.id,
          assignmentTitle: a.title,
          content: "System generated graduation record.",
          portfolioLink: "https://talentcloud.alphaspark.ng",
          submittedAt: new Date().toISOString(),
          status: "graded",
          score: 85,
          feedback: "System issued graduation credential."
        });
      }
    });

    // Make sure enrolled
    const updatedEnrolled = Array.from(new Set([...studentObj.enrolledCourses, courseObj.id]));
    const updatedIssued = Array.from(new Set([...(studentObj.issuedCertificates || []), courseObj.id]));

    updateSpecificUser(studentObj.id, {
      ...studentObj,
      enrolledCourses: updatedEnrolled,
      completedLessons: updatedCompleted,
      submissions: updatedSubmissions,
      issuedCertificates: updatedIssued
    });

    alert(`Graduation certificate issued to ${studentObj.name} for "${courseObj.title}"!`);
    setSelectedStudentId("");
    setSelectedCourseId("");
  };

  // --- Partner CRUD ---
  const fetchPartners = async () => {
    setIsLoadingPartners(true);
    try {
      const res = await fetch("/api/partners");
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setIsLoadingPartners(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPartner(true);
    try {
      const method = editingPartnerId ? "PUT" : "POST";
      const body = editingPartnerId ? { id: editingPartnerId, ...partnerForm } : partnerForm;
      const res = await fetch("/api/partners", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setPartnerForm({ name: "", logoUrl: "", websiteUrl: "" });
        setEditingPartnerId(null);
        await fetchPartners();
      } else {
        alert("Failed to save partner.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving partner.");
    } finally {
      setIsSubmittingPartner(false);
    }
  };

  const handlePartnerEdit = (partner: Partner) => {
    setEditingPartnerId(partner.id);
    setPartnerForm({
      name: partner.name,
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl || ""
    });
  };

  const handlePartnerDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPartners(partners.filter(p => p.id !== id));
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetPartnerForm = () => {
    setEditingPartnerId(null);
    setPartnerForm({ name: "", logoUrl: "", websiteUrl: "" });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Admin Terminal</p>
        <h2 className="font-display font-black text-2xl md:text-3xl uppercase italic mt-1.5">Executive Panel</h2>
        <p className="text-white/40 text-xs md:text-sm mt-1 italic">Control operations, user rosters, billing databases, and verified certifications.</p>
      </div>


      {/* Tab Contents */}
      <div className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl md:rounded-[32px]">
        {activeTab === "analytics" && (
          <div className="space-y-6 md:space-y-8">
            <h3 className="font-display font-black text-lg md:text-xl uppercase italic tracking-tight text-white mb-3">
              Core Performance Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "Total Students", val: students.length, desc: "Active in classroom db", icon: Users, color: "text-brand-blue" },
                { label: "Total Instructors", val: instructors.length, desc: "Managing tracks", icon: Shield, color: "text-[#3bb75e]" },
                { label: "Accrued Revenue", val: `₦${totalRevenue.toLocaleString()}`, desc: "From mock payments", icon: DollarSign, color: "text-brand-orange" },
                { label: "Alpha Graduates", val: totalGraduates, desc: "Verified credentials", icon: Award, color: "text-purple-400" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-white/30">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                    <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-white">{stat.val}</h4>
                  <p className="text-[9px] md:text-[10px] text-white/35 italic">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Attendance Analytics */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange">Ecosystem Cohort Health</h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs text-white/60 mb-2 leading-relaxed">
                    Student attendance rate is dynamically tracked based on completed lessons and daily check-ins. Eligibility to graduate requires maintaining a minimum of 80% attendance rate.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                    <span>Target Graduate Eligibility</span>
                    <span>80% Required</span>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#3bb75e] h-full" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white">
                Role-Based Access Management
              </h3>
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Create User
              </button>
            </div>

            {showAddUser && (
              <form onSubmit={handleCreateUser} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 max-w-2xl mb-6">
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange">New User Registration</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Initial Password *</label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Assign Role *</label>
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="bg-brand-orange text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isCreatingUser && <Loader2 className="w-4 h-4 animate-spin" />}
                  Register User
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 font-black uppercase tracking-widest text-[9px] pb-3">
                    <th className="pb-3">User Account</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Current Role</th>
                    <th className="pb-3">Enrolled/Assigned Tracks</th>
                    <th className="pb-3 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02]">
                      <td className="py-4 pr-4 font-bold text-white">{user.name}</td>
                      <td className="py-4 pr-4 font-mono text-white/50">{user.email}</td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          user.role === "admin" ? "bg-red-500/10 text-red-400" : user.role === "instructor" ? "bg-[#3bb75e]/10 text-[#3bb75e]" : "bg-brand-blue/10 text-brand-blue"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex flex-col gap-1.5">
                          {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {user.enrolledCourses.map((cid: string) => {
                                const courseObj = courses.find((c) => c.id === cid);
                                return (
                                  <span key={cid} className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {courseObj?.title || cid}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-white/20 italic text-[10px]">None Assigned</span>
                          )}
                          <select
                            onChange={(e) => {
                              if (e.target.value === "") return;
                              const cid = e.target.value;
                              const isEnrolled = (user.enrolledCourses || []).includes(cid);
                              const updatedCourses = isEnrolled
                                ? (user.enrolledCourses || []).filter((id: string) => id !== cid)
                                : [...(user.enrolledCourses || []), cid];
                              
                              updateSpecificUser(user.id, {
                                ...user,
                                enrolledCourses: updatedCourses
                              });
                              e.target.value = "";
                            }}
                            className="bg-brand-navy border border-white/10 rounded-lg px-2 py-1 text-[9px] font-bold text-white/50 focus:outline-none w-fit cursor-pointer hover:text-white"
                          >
                            <option value="">+ Assign/Remove Track</option>
                            {activeCourses.map((c) => (
                              <option key={c.id} value={c.id}>
                                {(user.enrolledCourses || []).includes(c.id) ? "✓ Remove: " : "+ Assign: "} {c.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                            className="bg-brand-navy border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-white focus:outline-none"
                          >
                            <option value="student">Make Student</option>
                            <option value="instructor">Make Instructor</option>
                            <option value="admin">Make Admin</option>
                          </select>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete user "${user.name}"?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white">
                Course Catalog Inventory
              </h3>
              <button
                onClick={() => setShowAddCourse(!showAddCourse)}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Create Course
              </button>
            </div>

            {showAddCourse && (
              <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6 max-w-2xl">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange">{editingCourse ? "Edit Course" : "New Course Blueprint"}</h4>
                  {editingCourse && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Course Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cloud Architecture"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Course Subtitle</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Host complex infrastructure"
                      value={courseSubtitle}
                      onChange={(e) => setCourseSubtitle(e.target.value)}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Tuition Fee</label>
                    <input
                      type="text"
                      required
                      value={courseFee}
                      onChange={(e) => setCourseFee(e.target.value)}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Duration</label>
                    <input
                      type="text"
                      required
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Syllabus Hours</label>
                    <input
                      type="text"
                      required
                      value={courseHours}
                      onChange={(e) => setCourseHours(e.target.value)}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-white/40">Complexity Level</label>
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value)}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="BEGINNER+">Beginner+</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-white/40">Key Learning Outcomes (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="HTML Structure&#10;CSS Positioning&#10;Javascript Basics"
                    value={courseLearnText}
                    onChange={(e) => setCourseLearnText(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-white/40">Tools Taught (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Docker, Kubernetes, AWS"
                    value={courseToolsText}
                    onChange={(e) => setCourseToolsText(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-white/40">Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={courseImageUrl}
                    onChange={(e) => setCourseImageUrl(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-brand-orange text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer"
                >
                  {editingCourse ? "Update Course" : "Publish to Landing Page"}
                </button>
              </form>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {activeCourses.map((c) => (
                <div key={c.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-start">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-white text-sm">{c.title}</h4>
                    <p className="text-[10px] text-white/45">{c.subtitle}</p>
                    <div className="flex gap-4 pt-1.5 font-mono text-[9px] text-white/30 uppercase">
                      <span>{c.duration}</span>
                      <span>{c.fee}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCourse(c)}
                      className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-colors cursor-pointer"
                      title="Edit Course"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="space-y-8">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white mb-4">
              Credential Registry & Issuance
            </h3>

            {/* Manual Issue Form */}
            <form onSubmit={handleIssueCertificate} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 max-w-xl">
              <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Direct Credential Issuance
              </h4>
              <p className="text-[10px] text-white/40 italic">Overrides standard classroom requirements to instantly graduate a student.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-white/40">Select Scholar</label>
                  <select
                    required
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-white/40">Select Discipline</label>
                  <select
                    required
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="">-- Choose Track --</option>
                    {activeCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedStudentId || !selectedCourseId}
                className="bg-brand-orange disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-orange/90 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Approve & Issue Certificate
              </button>
            </form>

            {/* Issued registry */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Issued Certificates List</h4>
              <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-white/40 font-bold border-b border-white/10 pb-2">
                      <th className="pb-2">Certificate ID</th>
                      <th className="pb-2">Graduate Name</th>
                      <th className="pb-2">Discipline Track</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/70">
                    {students.map((student) => {
                      // Check which courses student has completed
                      return student.enrolledCourses.map((courseId) => {
                        const course = activeCourses.find(c => c.id === courseId);
                        if (!course) return null;
                        
                        const courseLessons = course.modules.flatMap(m => m.lessons);
                        const completedAll = courseLessons.length > 0 && courseLessons.every(l => student.completedLessons.includes(l.id));
                        const isManual = student.issuedCertificates?.includes(courseId);
                        if (!completedAll && !isManual) return null;

                        const certId = `AS-${course.id.toUpperCase()}-${student.id.substring(2).toUpperCase()}`;

                        return (
                          <tr key={certId}>
                            <td className="py-3 font-mono font-bold text-brand-orange">{certId}</td>
                            <td className="py-3 font-semibold text-white">{student.name}</td>
                            <td className="py-3">{course.title}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[9px] uppercase font-bold border border-green-500/10">
                                  Active & Verified
                                </span>
                                <button
                                  onClick={() => handleDownloadCertificate({
                                    studentName: student.name,
                                    courseName: course.title,
                                    cohort: "Cohort 1", 
                                    duration: course.duration || "12 Weeks",
                                    score: "100%", // Ideally dynamic
                                    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                                    certId: certId
                                  })}
                                  disabled={isGenerating === certId}
                                  className="p-1.5 rounded bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white transition-colors disabled:opacity-50"
                                  title="Download PDF"
                                >
                                  {isGenerating === certId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="space-y-12">
            <div>
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase italic text-white">Student Applications</h2>
              <p className="text-white/40 text-xs italic">Review admissions applications submitted through the registration and application portal.</p>
            </div>

            {loadingApplications ? (
              <div className="flex justify-center items-center py-20 text-white/50 text-xs font-bold uppercase tracking-widest gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-orange" />
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-4 animate-pulse" />
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">No Applications Yet</h3>
                <p className="text-white/40 text-xs mt-1">When students apply via the /apply page, their applications will show up here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-2xl p-6">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-white/40 font-bold border-b border-white/10 pb-3">
                      <th className="pb-3 pr-4">Applicant</th>
                      <th className="pb-3 pr-4">Program Applied</th>
                      <th className="pb-3 pr-4">Location & Contact</th>
                      <th className="pb-3 pr-4">Background & Experience</th>
                      <th className="pb-3 pr-4">Reason for Applying</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/70">
                    {applications.map((app) => (
                      <tr key={app.id} className="align-top hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-bold text-white text-sm">{app.name}</div>
                          <div className="text-white/40 font-mono text-[10px] mt-0.5">{app.email}</div>
                          <div className="text-[10px] text-brand-orange uppercase tracking-wider font-bold mt-1">
                            Applied: {new Date(app.submittedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 pr-4 font-semibold text-white/90">
                          {app.program}
                          <span className="block text-[10px] text-white/40 font-mono mt-0.5">Course ID: {app.courseId}</span>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="text-white/80">{app.location || "N/A"}</div>
                          <div className="text-white/40 font-mono text-[10px] mt-0.5">{app.phone || "N/A"}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="capitalize font-semibold text-brand-blue">{app.background}</div>
                          <div className="text-white/50 text-[11px] mt-1">{app.experience}</div>
                        </td>
                        <td className="py-4 pr-4 max-w-xs text-white/60 italic leading-relaxed whitespace-pre-wrap">
                          "{app.reason || "No statement provided."}"
                        </td>
                        <td className="py-4">
                          <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                            {app.status || "Approved"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "system_activities" && (
          <div className="space-y-12">
            {/* Header */}
            <div>
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase italic text-white">System Activities & Logs</h2>
              <p className="text-white/40 text-xs italic">View entire system audits, newsletter subscriptions, and all assignment submissions.</p>
            </div>

            {loadingActivities ? (
              <div className="flex justify-center items-center py-20 text-white/50 text-xs font-bold uppercase tracking-widest gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-orange" />
                Loading logs...
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left/Middle Columns: Activities Feed and Course Submissions */}
                <div className="lg:col-span-2 space-y-12">
                  {/* Global Activities */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-white">Global Audit Feed</h3>
                    <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-2xl p-4 max-h-[350px] overflow-y-auto">
                      {activities.length === 0 ? (
                        <p className="text-white/30 text-xs italic py-4">No system activities recorded yet.</p>
                      ) : (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="text-white/40 font-bold border-b border-white/10 pb-2">
                              <th className="pb-2">Timestamp</th>
                              <th className="pb-2">User</th>
                              <th className="pb-2">Event</th>
                              <th className="pb-2">Details</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-white/70">
                            {activities.map((act) => (
                              <tr key={act.id}>
                                <td className="py-2.5 font-mono text-[10px] text-white/40">
                                  {new Date(act.timestamp).toLocaleString()}
                                </td>
                                <td className="py-2.5 font-semibold text-white">
                                  {act.userName || act.userId || 'System'}
                                </td>
                                <td className="py-2.5 font-bold uppercase tracking-wider text-[10px] text-brand-orange">
                                  {act.action}
                                </td>
                                <td className="py-2.5 text-white/60 italic">{act.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* All Assignment Submissions */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-white">All Assignment Submissions</h3>
                    <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-2xl p-4 max-h-[350px] overflow-y-auto">
                      {allUsers.flatMap(user => 
                        (user.submissions || []).map(sub => ({
                          userId: user.id,
                          userName: user.name,
                          userEmail: user.email,
                          ...sub
                        }))
                      ).length === 0 ? (
                        <p className="text-white/30 text-xs italic py-4">No student assignments submitted yet.</p>
                      ) : (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="text-white/40 font-bold border-b border-white/10 pb-2">
                              <th className="pb-2">Student</th>
                              <th className="pb-2">Course / Assignment</th>
                              <th className="pb-2">Submitted</th>
                              <th className="pb-2">Status</th>
                              <th className="pb-2">Grade / Feedback</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-white/70">
                            {allUsers.flatMap(user => 
                              (user.submissions || []).map(sub => ({
                                userId: user.id,
                                userName: user.name,
                                userEmail: user.email,
                                ...sub
                              }))
                            )
                            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                            .map((sub, i) => (
                              <tr key={i}>
                                <td className="py-3">
                                  <div className="font-semibold text-white">{sub.userName}</div>
                                  <div className="text-[10px] text-white/40">{sub.userEmail}</div>
                                </td>
                                <td className="py-3">
                                  <div className="font-bold text-[10px] uppercase text-brand-orange">{sub.courseId}</div>
                                  <div className="text-white/60 italic">{sub.assignmentTitle}</div>
                                </td>
                                <td className="py-3 text-white/40 text-[10px]">
                                  {new Date(sub.submittedAt).toLocaleDateString()}
                                </td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                                    sub.status === 'graded' 
                                      ? 'bg-green-500/10 text-green-400 border-green-500/10' 
                                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/10'
                                  }`}>
                                    {sub.status}
                                  </span>
                                </td>
                                <td className="py-3">
                                  {sub.status === 'graded' ? (
                                    <div>
                                      <span className="font-bold text-white">{sub.score}%</span>
                                      {sub.feedback && <p className="text-[10px] text-white/40 italic">{sub.feedback}</p>}
                                    </div>
                                  ) : (
                                    <span className="text-white/30 italic">Not graded</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Newsletter Roster */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white">Newsletter Roster</h3>
                  <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-2xl p-4 max-h-[750px] overflow-y-auto">
                    {subscribers.length === 0 ? (
                      <p className="text-white/30 text-xs italic py-4">No subscribers registered yet.</p>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="text-white/40 font-bold border-b border-white/10 pb-2">
                            <th className="pb-2">Email Address</th>
                            <th className="pb-2">Subscribed At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white/70">
                          {subscribers.map((sub) => (
                            <tr key={sub.id}>
                              <td className="py-2.5 font-semibold text-white">{sub.email}</td>
                              <td className="py-2.5 font-mono text-[10px] text-white/40">
                                {new Date(sub.subscribedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "partners" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase italic text-white">Partners & Sponsors</h2>
              <p className="text-white/40 text-xs italic">Add, edit, or remove partners shown in the scrolling marquee on the landing page.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange mb-6">
                    {editingPartnerId ? "Edit Partner" : "Add New Partner"}
                  </h4>
                  <form onSubmit={handlePartnerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={partnerForm.name}
                        onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                        placeholder="e.g. Google"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Logo URL *</label>
                      <input
                        type="url"
                        required
                        value={partnerForm.logoUrl}
                        onChange={e => setPartnerForm({ ...partnerForm, logoUrl: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                        placeholder="https://..."
                      />
                      <p className="text-[10px] text-white/30 mt-1">Direct URL to a greyscale PNG or SVG.</p>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Website URL</label>
                      <input
                        type="url"
                        value={partnerForm.websiteUrl}
                        onChange={e => setPartnerForm({ ...partnerForm, websiteUrl: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmittingPartner}
                        className="flex-1 bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors flex justify-center items-center gap-2 cursor-pointer"
                      >
                        {isSubmittingPartner && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingPartnerId ? "Save Changes" : "Add Partner"}
                      </button>
                      {editingPartnerId && (
                        <button
                          type="button"
                          onClick={resetPartnerForm}
                          className="px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold text-xs uppercase transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* List Section */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
                  {isLoadingPartners ? (
                    <div className="flex items-center justify-center h-full py-20">
                      <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                    </div>
                  ) : partners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-white/30 py-20">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-sm">No partners added yet.</p>
                      <p className="text-[10px] text-white/20 mt-1">Use the form on the left to add your first partner.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {partners.map(partner => (
                        <div key={partner.id} className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center gap-4 group">
                          <div className="w-16 h-16 rounded-lg bg-white/10 shrink-0 flex items-center justify-center p-2">
                            <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-sm truncate">{partner.name}</h3>
                            {partner.websiteUrl && (
                              <a href={partner.websiteUrl} target="_blank" rel="noreferrer" className="text-[10px] text-brand-orange hover:underline truncate block mt-1">
                                {partner.websiteUrl}
                              </a>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handlePartnerEdit(partner)} className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handlePartnerDelete(partner.id)} className="p-2 text-red-400/50 hover:text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-md transition-colors cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "communications" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-black text-2xl md:text-3xl uppercase italic text-white">Communications Hub</h2>
              <p className="text-white/40 text-xs italic">Compose, preview, and broadcast newsletters, direct notifications, onboarding welcome templates, or invite links.</p>
            </div>

            {/* Sub-tab Selection */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
              {[
                { id: "newsletter", label: "Newsletter Broadcast", icon: Sparkles },
                { id: "manual", label: "Direct Custom Email", icon: Send },
                { id: "welcome", label: "Welcome Onboarding", icon: UserCheck },
                { id: "referral", label: "Referral Invitation", icon: Share2 }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = commTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCommTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      isActive 
                        ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/20" 
                        : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Form Input Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange mb-6">
                    {commTab === "newsletter" && "Broadcast Newsletter"}
                    {commTab === "manual" && "Send Direct Mail"}
                    {commTab === "welcome" && "Send Onboarding Email"}
                    {commTab === "referral" && "Send Referral Invite"}
                  </h4>

                  <form onSubmit={handleSendCommunications} className="space-y-4">
                    {commTab === "newsletter" && (
                      <>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Subject Line *</label>
                          <input
                            type="text"
                            required
                            value={commForm.subject}
                            onChange={e => setCommForm({ ...commForm, subject: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="e.g. July Technical Bootcamp Update"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Header Title (Inside Email)</label>
                          <input
                            type="text"
                            value={commForm.title}
                            onChange={e => setCommForm({ ...commForm, title: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="e.g. Academy Monthly Bulletin"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Email Body Paragraphs *</label>
                          <textarea
                            required
                            value={commForm.content}
                            onChange={e => setCommForm({ ...commForm, content: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors min-h-[160px] font-sans resize-y"
                            placeholder="Type paragraphs here. Press Enter to start a new paragraph."
                          />
                        </div>
                        <div className="p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-xl text-xs text-white/70">
                          <strong>Note:</strong> This broadcast will go to all {subscribers.length} newsletter subscribers in the system database.
                        </div>
                      </>
                    )}

                    {commTab === "manual" && (
                      <>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Recipient Emails * (Comma-separated)</label>
                          <textarea
                            required
                            value={commForm.emails}
                            onChange={e => setCommForm({ ...commForm, emails: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors min-h-[80px] font-sans resize-y"
                            placeholder="e.g. user1@example.com, user2@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Subject Line *</label>
                          <input
                            type="text"
                            required
                            value={commForm.subject}
                            onChange={e => setCommForm({ ...commForm, subject: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="e.g. Urgent Portal Update Required"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Header Title (Inside Email)</label>
                          <input
                            type="text"
                            value={commForm.title}
                            onChange={e => setCommForm({ ...commForm, title: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="e.g. Alpha Spark Academy Notification"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Email Body Paragraphs *</label>
                          <textarea
                            required
                            value={commForm.content}
                            onChange={e => setCommForm({ ...commForm, content: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors min-h-[160px] font-sans resize-y"
                            placeholder="Type paragraphs here. Press Enter to start a new paragraph."
                          />
                        </div>
                      </>
                    )}

                    {commTab === "welcome" && (
                      <>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Recipient Email Address *</label>
                          <input
                            type="email"
                            required
                            value={welcomeForm.email}
                            onChange={e => setWelcomeForm({ ...welcomeForm, email: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="e.g. student@gmail.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">First Name</label>
                          <input
                            type="text"
                            value={welcomeForm.firstName}
                            onChange={e => setWelcomeForm({ ...welcomeForm, firstName: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="e.g. David (defaults to 'Future Innovator')"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Subject Line</label>
                          <input
                            type="text"
                            value={welcomeForm.subject}
                            onChange={e => setWelcomeForm({ ...welcomeForm, subject: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="e.g. Welcome to Alpha Spark Academy!"
                          />
                        </div>
                      </>
                    )}

                    {commTab === "referral" && (
                      <>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Friend's Email Address *</label>
                          <input
                            type="email"
                            required
                            value={referralForm.email}
                            onChange={e => setReferralForm({ ...referralForm, email: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="friend@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Friend's Name *</label>
                          <input
                            type="text"
                            required
                            value={referralForm.friendName}
                            onChange={e => setReferralForm({ ...referralForm, friendName: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="e.g. Jane"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-white/50 uppercase mb-2">Referrer's Name *</label>
                          <input
                            type="text"
                            required
                            value={referralForm.referrerName}
                            onChange={e => setReferralForm({ ...referralForm, referrerName: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-orange outline-none transition-colors"
                            placeholder="e.g. Alex"
                          />
                        </div>
                      </>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSendingComm}
                        className="flex justify-center items-center gap-2 cursor-pointer bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-xl w-full transition-colors"
                      >
                        {isSendingComm ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Email
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Live Preview Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-black/20 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Email Live Preview</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[8px] font-black uppercase">
                      Draft Mockup
                    </span>
                  </div>

                  {/* Mailbox Header Mockup */}
                  <div className="text-[10px] space-y-1 bg-black/40 border border-white/5 rounded-xl p-3 text-white/60">
                    <div><span className="font-bold text-white/40">From:</span> Alpha Spark Academy &lt;no-reply@alphaspark.ng&gt;</div>
                    <div>
                      <span className="font-bold text-white/40">To:</span>{" "}
                      {commTab === "newsletter" && (subscribers.length > 0 ? `${subscribers[0].email} (+${subscribers.length - 1} others)` : "No subscribers yet")}
                      {commTab === "manual" && (commForm.emails ? commForm.emails : "[Enter email list]")}
                      {commTab === "welcome" && (welcomeForm.email ? welcomeForm.email : "[Enter welcome email]")}
                      {commTab === "referral" && (referralForm.email ? referralForm.email : "[Enter friend's email]")}
                    </div>
                    <div>
                      <span className="font-bold text-white/40">Subject:</span>{" "}
                      <span className="text-white">
                        {commTab === "newsletter" && (commForm.subject || "[Enter subject line]")}
                        {commTab === "manual" && (commForm.subject || "[Enter subject line]")}
                        {commTab === "welcome" && (welcomeForm.subject || "Welcome to Alpha Spark Academy!")}
                        {commTab === "referral" && (referralForm.referrerName ? `${referralForm.referrerName} invited you to Alpha Spark Academy!` : "[Referrer Name] invited you to Alpha Spark Academy!")}
                      </span>
                    </div>
                  </div>

                  {/* HTML Render Mockup */}
                  <div className="bg-[#0b0c10] border border-white/10 rounded-xl p-4 overflow-y-auto max-h-[400px] text-white">
                    <div className="max-w-[465px] mx-auto p-2 space-y-6">
                      {/* Logo Section */}
                      <div className="text-center">
                        <img
                          src="https://raw.githubusercontent.com/Icedmist/alpha-website/main/public/assets/logo.png"
                          width="100"
                          alt="Alpha Spark"
                          className="mx-auto"
                        />
                      </div>

                      {/* Content Render based on Sub-tab */}
                      {(commTab === "newsletter" || commTab === "manual") && (
                        <div className="space-y-4">
                          <h2 className="text-[#0099CC] text-sm font-black text-center uppercase tracking-widest italic">
                            {commForm.title || commForm.subject || "Alpha Spark News"}
                          </h2>
                          <div className="bg-[#1f2833] p-4 rounded-xl border border-white/5 space-y-3">
                            {commForm.content ? (
                              commForm.content.split('\n').filter(Boolean).map((p, idx) => (
                                <p key={idx} className="text-[#c5c6c7] text-[11px] leading-relaxed">
                                  {p}
                                </p>
                              ))
                            ) : (
                              <p className="text-white/20 text-[11px] italic text-center py-6">Your paragraph text will render here dynamic in real-time.</p>
                            )}
                          </div>
                        </div>
                      )}

                      {commTab === "welcome" && (
                        <div className="space-y-4 text-left">
                          <h2 className="text-[#ff6b35] text-sm font-bold text-center uppercase tracking-widest italic">
                            Welcome to the Future
                          </h2>
                          <div className="space-y-3 text-[11px] text-[#c5c6c7] leading-relaxed">
                            <p>Dear {welcomeForm.firstName || "Future Innovator"},</p>
                            <p>We have successfully received your application to Alpha Spark Academy. You have taken the first step towards transforming your tech career.</p>
                            <p>Our admission team is reviewing your profile and will get back to you shortly. In the meantime, feel free to explore our syllabus and prepare yourself for an incredible journey.</p>
                          </div>
                          <div className="text-center py-2">
                            <a
                              href="https://wa.me/2348123456789"
                              onClick={e => e.preventDefault()}
                              className="inline-block bg-[#0099CC] rounded-lg text-white text-[9px] font-bold no-underline text-center px-4 py-2 uppercase tracking-wider"
                            >
                              Message us on WhatsApp
                            </a>
                          </div>
                          <div className="text-[11px] text-[#c5c6c7] pt-2">
                            Stay hungry,<br />
                            The Alpha Spark Team
                          </div>
                        </div>
                      )}

                      {commTab === "referral" && (
                        <div className="space-y-4 text-left">
                          <h2 className="text-[#3bb75e] text-sm font-bold text-center uppercase tracking-widest italic">
                            You're Invited!
                          </h2>
                          <div className="space-y-3 text-[11px] text-[#c5c6c7] leading-relaxed">
                            <p>Hi {referralForm.friendName || "Friend"},</p>
                            <p><strong>{referralForm.referrerName || "A friend"}</strong> thinks you'd be a great fit for Alpha Spark Academy and has invited you to check us out.</p>
                            <p>Alpha Spark Academy is an elite technology training platform that builds workforce infrastructure and practical skills for the digital age.</p>
                          </div>
                          <div className="text-center py-2">
                            <a
                              href="https://alphaspark.ng"
                              onClick={e => e.preventDefault()}
                              className="inline-block bg-[#3bb75e] rounded-lg text-[#0b0c10] text-[9px] font-black no-underline text-center px-5 py-2 uppercase tracking-wider"
                            >
                              Join the Academy
                            </a>
                          </div>
                          <div className="border-t border-white/10 pt-4 text-[9px] text-white/40 text-center">
                            If you don't know {referralForm.referrerName || "this person"}, please ignore this email.
                          </div>
                        </div>
                      )}

                      {/* Footer Section */}
                      <div className="border-t border-white/10 pt-4 text-center space-y-1">
                        <p className="text-[9px] text-white/30">
                          You are receiving this email because you opted in to Alpha Spark Academy updates.
                        </p>
                        <p className="text-[8px] text-white/20">
                          &copy; {new Date().getFullYear()} Alpha Spark Academy. All rights reserved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Certificate Container for PDF Generation */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        {printData && (
          <CertificateTemplate 
            ref={certificateRef}
            {...printData}
          />
        )}
      </div>
    </div>
  );
}
