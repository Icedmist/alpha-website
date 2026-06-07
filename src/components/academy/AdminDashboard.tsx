import React, { useState } from "react";
import { 
  BarChart, Users, DollarSign, BookOpen, Award, Shield, 
  Trash2, UserPlus, RefreshCw, Layers, PlusCircle, Edit3, ShieldAlert
} from "lucide-react";
import { courses, Course } from "../../data/courses";
import { useAuth, User } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { allUsers, updateSpecificUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"analytics" | "users" | "courses" | "certificates">("analytics");

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

  // Certificate generation states
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const students = allUsers.filter(u => u.role === "student");
  const instructors = allUsers.filter(u => u.role === "instructor");

  // Custom courses logic to pull dynamic additions
  const getCoursesList = (): Course[] => {
    const local = localStorage.getItem("alpha_custom_courses");
    return local ? JSON.parse(local) : courses;
  };
  const activeCourses = getCoursesList();

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
      const attendanceDays = student.attendanceDates.length;
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

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseSubtitle) return;

    const newCourseId = `c-${Math.random().toString(36).substring(2, 9)}`;
    const newCourse: Course = {
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
      modules: []
    };

    const updatedCourses = [...activeCourses, newCourse];
    localStorage.setItem("alpha_custom_courses", JSON.stringify(updatedCourses));

    alert(`Course "${courseTitle}" created successfully!`);
    setShowAddCourse(false);
    setCourseTitle("");
    setCourseSubtitle("");
    setCourseOutcome("");
    setCourseLearnText("");
    setCourseToolsText("");
  };

  const handleDeleteCourse = (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    const updatedCourses = activeCourses.filter(c => c.id !== courseId);
    localStorage.setItem("alpha_custom_courses", JSON.stringify(updatedCourses));
    alert("Course deleted from database.");
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
          portfolioLink: "https://talentcloud.alphaspark.tech",
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Admin Terminal</p>
        <h2 className="font-display font-black text-3xl uppercase italic mt-2">Executive Panel</h2>
        <p className="text-white/40 text-sm mt-1 italic">Control operations, user rosters, billing databases, and verified certifications.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-6">
        {[
          { id: "analytics", label: "Analytics Summary", icon: BarChart },
          { id: "users", label: "Access Controls", icon: Shield },
          { id: "courses", label: "Course Inventory", icon: BookOpen },
          { id: "certificates", label: "Credential Registry", icon: Award }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id 
                ? "border-brand-orange text-brand-orange" 
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[32px]">
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white mb-4">
              Core Performance Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Students", val: students.length, desc: "Active in classroom db", icon: Users, color: "text-brand-blue" },
                { label: "Total Instructors", val: instructors.length, desc: "Managing tracks", icon: Shield, color: "text-[#3bb75e]" },
                { label: "Accrued Revenue", val: `₦${totalRevenue.toLocaleString()}`, desc: "From mock payments", icon: DollarSign, color: "text-brand-orange" },
                { label: "Alpha Graduates", val: totalGraduates, desc: "Verified credentials", icon: Award, color: "text-purple-400" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-white/30">
                    <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <h4 className="text-2xl font-black text-white">{stat.val}</h4>
                  <p className="text-[10px] text-white/35 italic">{stat.desc}</p>
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
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white mb-4">
              Role-Based Access Management
            </h3>

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
                      <td className="py-4 pr-4 text-white/40">
                        {user.enrolledCourses.length > 0 ? `${user.enrolledCourses.length} Courses` : "None"}
                      </td>
                      <td className="py-4 text-right">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                          className="bg-brand-navy border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-white focus:outline-none"
                        >
                          <option value="student">Make Student</option>
                          <option value="instructor">Make Instructor</option>
                          <option value="admin">Make Admin</option>
                        </select>
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
              <form onSubmit={handleCreateCourse} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6 max-w-2xl">
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange">New Course Blueprint</h4>
                
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

                <button
                  type="submit"
                  className="bg-brand-orange text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer"
                >
                  Publish to Landing Page
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
                  <button
                    onClick={() => handleDeleteCourse(c.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                              <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[9px] uppercase font-bold border border-green-500/10">
                                Active & Verified
                              </span>
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
      </div>
    </div>
  );
}
