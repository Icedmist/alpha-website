import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Play, CheckCircle2, Circle, HelpCircle, FileText, 
  Upload, Link2, Calendar, Award, Check, UserCheck, AlertCircle, Bell
} from "lucide-react";
import { courses, Course, Lesson, QuizQuestion } from "../../data/courses";
import { useAuth, User, Submission } from "../../context/AuthContext";
import PaymentSimulator from "./PaymentSimulator";
import CertificateGenerator from "./CertificateGenerator";

export default function StudentDashboard() {
  const { currentUser, updateUser, getAuthHeaders } = useAuth();
  if (!currentUser) return null;
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [payingCourse, setPayingCourse] = useState<Course | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<{ courseTitle: string; certId: string; date: string } | null>(null);

  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  // Assignment states
  const [assignmentContent, setAssignmentContent] = useState("");
  const [assignmentLink, setAssignmentLink] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Referral states
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [isReferring, setIsReferring] = useState(false);
  const [referralSuccess, setReferralSuccess] = useState(false);

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail) return;

    setIsReferring(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers,
        body: JSON.stringify({ friendEmail, friendName }),
      });

      if (res.ok) {
        setReferralSuccess(true);
        setFriendEmail("");
        setFriendName("");
        setTimeout(() => setReferralSuccess(false), 5000);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to send referral');
      }
    } catch (err) {
      console.error('Error sending referral:', err);
      alert('Failed to send referral');
    } finally {
      setIsReferring(false);
    }
  };

  const [activeCourses, setActiveCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setActiveCourses(data);
        else {
          const localStr = localStorage.getItem("alpha_custom_courses");
          setActiveCourses(localStr ? JSON.parse(localStr) : courses);
        }
      })
      .catch(() => setActiveCourses(courses));
  }, []);

  if (!currentUser) return null;

  const enrolled = activeCourses.filter((c) => currentUser.enrolledCourses.includes(c.id));
  const available = activeCourses.filter((c) => !currentUser.enrolledCourses.includes(c.id));

  const activeCourse = activeCourses.find((c) => c.id === activeCourseId);
  const activeLesson = activeCourse?.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === activeLessonId);

  // Calculate stats
  const totalLessons = activeCourse ? activeCourse.modules.flatMap(m => m.lessons).length : 0;
  const completedLessonsInActiveCourse = activeCourse 
    ? activeCourse.modules.flatMap(m => m.lessons).filter(l => currentUser.completedLessons.includes(l.id)).length
    : 0;

  // Attendance logic
  const attendanceDays = (currentUser.attendanceDates || []).length;
  const todayDateStr = new Date().toISOString().split("T")[0];
  const hasCheckedInToday = (currentUser.attendanceDates || []).includes(todayDateStr);
  // Let attendance % = (attendanceDays / 5) * 50 + (lessonsCompleted / totalLessonsTotal) * 50
  const attendancePercent = Math.min(
    100,
    Math.round(
      (attendanceDays / 4) * 60 + 
      (currentUser.completedLessons.length > 0 ? (currentUser.completedLessons.length / 10) * 40 : 0)
    )
  );

  const isEligibleForGraduation = (course: Course) => {
    if (currentUser.issuedCertificates?.includes(course.id)) return true;

    const courseLessons = course.modules.flatMap((m) => m.lessons);
    if (courseLessons.length === 0) return false;

    const completedAll = courseLessons.every((l) => currentUser.completedLessons.includes(l.id));
    
    // Checked if all assignments are submitted & graded
    const courseAssignments = courseLessons.filter((l) => l.type === "assignment");
    const assignmentsSubmitted = courseAssignments.every((a) => 
      currentUser.submissions.some((s) => s.lessonId === a.id)
    );
    
    return completedAll && assignmentsSubmitted && attendancePercent >= 80;
  };

  const handleLessonSelect = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setQuizAnswers({});
    setQuizResult(null);
    setAssignmentContent("");
    setAssignmentLink("");
    setUploadProgress(null);
    setUploadSuccess(false);
  };

  const markLessonComplete = (lessonId: string) => {
    if (!currentUser.completedLessons.includes(lessonId)) {
      const updated = {
        ...currentUser,
        completedLessons: [...currentUser.completedLessons, lessonId]
      };
      updateUser(updated);
    }
  };

  const handleQuizSubmit = (questions: QuizQuestion[], lessonId: string) => {
    let correct = 0;
    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 50;

    setQuizResult({ score, passed });

    if (passed) {
      const updatedScores = { ...currentUser.quizScores, [lessonId]: score };
      const updatedCompleted = currentUser.completedLessons.includes(lessonId)
        ? currentUser.completedLessons
        : [...currentUser.completedLessons, lessonId];

      updateUser({
        ...currentUser,
        quizScores: updatedScores,
        completedLessons: updatedCompleted
      });
    }
  };

  const handleAssignmentSubmit = (e: React.FormEvent, lesson: Lesson, courseId: string) => {
    e.preventDefault();
    if (!assignmentContent.trim()) return;

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const submission: Submission = {
              courseId,
              lessonId: lesson.id,
              assignmentTitle: lesson.title,
              content: assignmentContent,
              portfolioLink: assignmentLink,
              submittedAt: new Date().toISOString(),
              status: "pending"
            };

            const updatedSubmissions = [
              ...currentUser.submissions.filter(s => s.lessonId !== lesson.id),
              submission
            ];

            const updatedCompleted = currentUser.completedLessons.includes(lesson.id)
              ? currentUser.completedLessons
              : [...currentUser.completedLessons, lesson.id];

            updateUser({
              ...currentUser,
              submissions: updatedSubmissions,
              completedLessons: updatedCompleted
            });

            setUploadSuccess(true);
            setUploadProgress(null);
          }, 500);
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  const handlePaymentSuccess = (gateway: "Paystack" | "Flutterwave", reference: string) => {
    if (!payingCourse) return;

    const updated = {
      ...currentUser,
      enrolledCourses: [...currentUser.enrolledCourses, payingCourse.id]
    };
    updateUser(updated);
    setPayingCourse(null);
    alert(`Payment successful! You are now enrolled in ${payingCourse.title}.`);
  };

  const handleDailyCheckIn = () => {
    const today = new Date().toISOString().split("T")[0];
    const attendance = currentUser.attendanceDates || [];
    if (attendance.includes(today)) {
      alert("You have already checked in for today!");
      return;
    }

    updateUser({
      ...currentUser,
      attendanceDates: [...attendance, today]
    });
    alert("Checked in successfully! Attendance updated.");
  };

  // Get notifications
  const getNotifications = () => {
    const list = [
      { id: "n1", text: "Welcome to Alpha Spark Academy ecosystem!", date: "Recently" }
    ];

    currentUser.submissions.forEach((s) => {
      if (s.status === "graded") {
        list.unshift({
          id: `n-${s.lessonId}`,
          text: `Your submission for "${s.assignmentTitle}" was graded: ${s.score}/100. Feedback: "${s.feedback}"`,
          date: new Date(s.submittedAt).toLocaleDateString()
        });
      }
    });

    return list;
  };

  return (
    <div className="space-y-12">
      {/* Overview Dashboard */}
      {!activeCourseId ? (
        <div className="space-y-12">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Award className="w-48 h-48 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Student Panel</p>
              <h2 className="font-display font-black text-2xl md:text-4xl uppercase italic tracking-tight mt-1.5">
                Hello, {currentUser.name}
              </h2>
              <p className="text-white/40 text-xs md:text-sm mt-1 italic">Track your courses, attendance, and download certificates.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleDailyCheckIn}
                disabled={hasCheckedInToday}
                className={`${
                  hasCheckedInToday 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed opacity-80" 
                    : "bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20 cursor-pointer"
                } px-4 py-2.5 md:px-6 md:py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all`}
              >
                {hasCheckedInToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Checked In Today
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" /> Check-In Today
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl space-y-2">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/30">Attendance Rate</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl md:text-3xl font-black text-brand-blue">{attendancePercent}%</span>
                <span className={`text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 md:py-1 rounded ${
                  attendancePercent >= 80 ? "bg-green-500/10 text-green-400" : "bg-brand-orange/10 text-brand-orange"
                }`}>
                  {attendancePercent >= 80 ? "Eligible" : "Requires 80%"}
                </span>
              </div>
              <div className="w-full bg-white/5 h-1.5 md:h-2 rounded-full overflow-hidden mt-3">
                <div className="bg-brand-blue h-full transition-all duration-500" style={{ width: `${attendancePercent}%` }} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl space-y-2">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/30">Enrolled tracks</p>
              <span className="text-2xl md:text-3xl font-black text-brand-orange">{enrolled.length} Active</span>
              <p className="text-[11px] text-white/40 italic mt-1.5">Across 12 technical disciplines.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl space-y-2">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/30">Attendance days</p>
              <span className="text-2xl md:text-3xl font-black text-white">{attendanceDays} Checked-in</span>
              <p className="text-[11px] text-white/40 italic mt-1.5">Simulated live check-in history.</p>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="space-y-6">
            <h3 className="font-display font-black text-2xl uppercase italic tracking-tight text-white flex items-center gap-3">
              <BookOpen className="text-brand-orange" /> Enrolled Courses
            </h3>

            {enrolled.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 p-12 text-center rounded-3xl">
                <p className="text-white/40 italic">You are not enrolled in any courses yet. Scroll down to choose an ecosystem track.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {enrolled.map((course) => {
                  const courseLessons = course.modules.flatMap(m => m.lessons);
                  const completed = courseLessons.filter(l => currentUser.completedLessons.includes(l.id)).length;
                  const total = courseLessons.length;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  const eligible = isEligibleForGraduation(course);

                  return (
                    <div 
                      key={course.id} 
                      className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl md:rounded-[32px] space-y-4 flex flex-col justify-between hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => {
                        setActiveCourseId(course.id);
                        if (course.modules[0]?.lessons[0]) {
                          handleLessonSelect(course.modules[0].lessons[0].id);
                        }
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-black text-lg md:text-xl uppercase italic tracking-tight text-white">
                            {course.title}
                          </h4>
                          <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-white/40 uppercase">
                            {course.duration}
                          </span>
                        </div>
                        <p className="text-xs text-white/50">{course.subtitle}</p>
                      </div>

                      <div className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/40">
                            <span>Syllabus Progress</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-brand-orange h-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>

                        {/* Graduation Card */}
                        {eligible ? (
                          <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Award className="w-5 h-5 text-green-400" />
                              <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-wider text-green-400">Graduated</p>
                                <p className="text-[9px] text-white/40">Requirements met successfully.</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingCertificate({
                                  courseTitle: course.title,
                                  certId: `AS-${course.id.toUpperCase()}-${currentUser.id.substring(2).toUpperCase()}`,
                                  date: new Date().toLocaleDateString()
                                });
                              }}
                              className="bg-green-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-green-400 transition-colors"
                            >
                              Get Cert
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white/2 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-brand-orange shrink-0" />
                            <p className="text-[10px] text-white/40 leading-snug">
                              Complete all lessons/quizzes, submit assignments, and maintain &gt;= 80% attendance to unlock certificate.
                            </p>
                          </div>
                        )}

                        <button className="w-full bg-white text-brand-navy py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-2">
                          Resume Track <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications feed */}
          <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[32px] space-y-6">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white flex items-center gap-3">
              <Bell className="text-brand-orange w-5 h-5 animate-bounce" /> Dashboard Alerts
            </h3>
            <div className="space-y-4">
              {getNotifications().map((notif, index) => (
                <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium text-white/80 leading-relaxed">{notif.text}</p>
                    <p className="text-[9px] text-white/30 font-mono">{notif.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refer a Friend Section */}
          <div className="bg-gradient-to-br from-brand-navy to-black border border-white/10 p-6 md:p-8 rounded-[32px] space-y-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-orange/20 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="font-display font-black text-xl md:text-2xl uppercase italic tracking-tight text-white flex items-center gap-3 relative z-10">
              <Link2 className="text-brand-orange w-5 h-5 md:w-6 md:h-6" /> Invite a Friend
            </h3>
            <p className="text-sm text-white/50 relative z-10 max-w-xl">
              Know someone who would benefit from Alpha Spark Academy? Refer them and help them launch their tech career.
            </p>
            
            {referralSuccess ? (
              <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center gap-3 relative z-10">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <p className="text-xs font-bold text-green-400">Referral sent successfully! Thank you for sharing Alpha Spark Academy.</p>
              </div>
            ) : (
              <form onSubmit={handleReferralSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <input 
                  type="text" 
                  placeholder="Friend's Name" 
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-orange transition-colors w-full"
                />
                <input 
                  type="email" 
                  required
                  placeholder="Friend's Email" 
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-orange transition-colors w-full"
                />
                <button 
                  type="submit" 
                  disabled={isReferring || !friendEmail}
                  className="bg-brand-orange hover:bg-brand-orange/90 disabled:opacity-50 text-white rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition-colors w-full"
                >
                  {isReferring ? 'Sending...' : 'Send Invitation'}
                </button>
              </form>
            )}
          </div>

          {/* Available Courses */}
          <div className="space-y-6">
            <h3 className="font-display font-black text-2xl uppercase italic tracking-tight text-white">
              Ecosystem Digital Tracks
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {available.map((course) => (
                <div key={course.id} className="bg-white/5 border border-white/10 p-6 rounded-[28px] space-y-4 flex flex-col justify-between hover:border-brand-orange/30 transition-colors">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-display font-bold text-base uppercase italic tracking-tight text-white">{course.title}</h4>
                      <span className="text-[10px] text-brand-orange font-bold font-mono">{course.fee}</span>
                    </div>
                    <p className="text-xs text-white/40 line-clamp-3">{course.subtitle}</p>
                  </div>
                  <button 
                    onClick={() => setPayingCourse(course)}
                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Enroll & Pay
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Course Syllabus Viewer */
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl">
            <div>
              <button 
                onClick={() => setActiveCourseId(null)} 
                className="text-xs font-black uppercase tracking-widest text-brand-orange hover:text-white transition-colors"
              >
                &larr; Back to Dashboard
              </button>
              <h3 className="font-display font-black text-lg md:text-2xl uppercase italic tracking-tight text-white mt-1">
                {activeCourse?.title}
              </h3>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-white/40 uppercase">Progress</p>
              <p className="font-mono text-xs md:text-sm font-black text-white">{completedLessonsInActiveCourse} / {totalLessons} Completed</p>
            </div>
          </div>

          {/* Two Column Workspace */}
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-start">
            {/* Left Column: Syllabus Menu */}
            <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-4 md:space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange">Syllabus Outline</h4>
              <div className="space-y-6">
                {activeCourse?.modules.map((mod) => (
                  <div key={mod.id} className="space-y-3">
                    <h5 className="text-xs font-black uppercase tracking-tight text-white/80">{mod.title}</h5>
                    <div className="space-y-2">
                      {mod.lessons.map((les) => {
                        const isCompleted = currentUser.completedLessons.includes(les.id);
                        const isActive = activeLessonId === les.id;

                        return (
                          <button
                            key={les.id}
                            onClick={() => handleLessonSelect(les.id)}
                            className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 transition-all ${
                              isActive
                                ? "bg-brand-orange/20 border-brand-orange text-white"
                                : "bg-white/2 border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <div className="flex gap-2.5 items-start">
                              {les.type === "video" && <Play className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                              {les.type === "pdf" && <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                              {les.type === "quiz" && <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                              {les.type === "assignment" && <Upload className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold leading-tight uppercase tracking-tight">{les.title}</p>
                                <p className="text-[9px] text-white/30 font-mono">{les.duration}</p>
                              </div>
                            </div>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-white/10 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Active Lesson Workspace */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 space-y-5 md:space-y-8 min-h-[500px]">
              {activeLesson ? (
                <div className="space-y-4 md:space-y-8">
                  <div>
                    <span className="px-3 py-1 rounded bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[8px] font-black uppercase tracking-widest">
                      Active: {activeLesson.type}
                    </span>
                    <h2 className="font-display font-black text-xl sm:text-2xl uppercase italic tracking-tight text-white mt-2">
                      {activeLesson.title}
                    </h2>
                  </div>

                  {/* Render content based on type */}
                  {activeLesson.type === "video" && (
                    <div className="space-y-4 md:space-y-6">
                      <div className="relative aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                        {activeLesson.videoUrl ? (
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={activeLesson.videoUrl}
                            title={activeLesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="text-center p-8 space-y-3">
                            <Play className="w-12 h-12 mx-auto text-brand-orange" />
                            <p className="text-sm italic text-white/40">Mocking Video Streaming Connection...</p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-xl">
                        <span className="text-xs text-white/50">Marking completed records your attendance for this lesson.</span>
                        {currentUser.completedLessons.includes(activeLesson.id) ? (
                          <span className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> Lesson Completed
                          </span>
                        ) : (
                          <button
                            onClick={() => markLessonComplete(activeLesson.id)}
                            className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {activeLesson.type === "pdf" && (
                    <div className="space-y-6">
                      <div className="bg-white/2 border border-white/5 p-12 text-center rounded-2xl space-y-4">
                        <FileText className="w-16 h-16 mx-auto text-brand-orange" />
                        <div>
                          <h4 className="font-bold text-sm text-white">Syllabus Study Materials (PDF)</h4>
                          <p className="text-xs text-white/40 mt-1">Download and read this resource block offline.</p>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Simulated PDF file download starting...");
                          }}
                          className="inline-flex bg-white text-brand-navy px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-brand-orange hover:text-white transition-colors"
                        >
                          Download Resource PDF
                        </a>
                      </div>

                      <div className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-xl">
                        <span className="text-xs text-white/50">Click below to check off this reading module.</span>
                        {currentUser.completedLessons.includes(activeLesson.id) ? (
                          <span className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> Material Read
                          </span>
                        ) : (
                          <button
                            onClick={() => markLessonComplete(activeLesson.id)}
                            className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {activeLesson.type === "quiz" && (
                    <div className="space-y-8">
                      {!quizResult ? (
                        <div className="space-y-6">
                          {activeLesson.quizQuestions?.map((q, qIndex) => (
                            <div key={q.id} className="space-y-3 p-5 bg-white/2 border border-white/5 rounded-2xl">
                              <p className="text-xs font-bold text-white/30 font-mono">QUESTION {qIndex + 1}</p>
                              <h4 className="font-semibold text-sm text-white">{q.question}</h4>
                              <div className="grid gap-3 pt-2">
                                {q.options.map((opt, optIndex) => (
                                  <button
                                    key={optIndex}
                                    onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIndex })}
                                    className={`w-full p-4 rounded-xl border text-left text-xs font-bold transition-all ${
                                      quizAnswers[q.id] === optIndex
                                        ? "bg-brand-blue/20 border-brand-blue text-white"
                                        : "bg-white/2 border-white/5 text-white/50 hover:border-white/10 hover:text-white"
                                    }`}
                                  >
                                    <span className="font-black text-brand-orange mr-2">{opt.label}.</span>
                                    {opt.text}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={() => handleQuizSubmit(activeLesson.quizQuestions || [], activeLesson.id)}
                            disabled={Object.keys(quizAnswers).length < (activeLesson.quizQuestions?.length || 0)}
                            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Submit Answers
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-8 space-y-6">
                          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                            quizResult.passed ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {quizResult.passed ? <CheckCircle2 className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                          </div>
                          <div>
                            <h4 className="font-display font-black text-xl uppercase italic">
                              {quizResult.passed ? "Quiz Passed!" : "Quiz Failed"}
                            </h4>
                            <p className="text-2xl font-black mt-2 text-white">{quizResult.score}% Score</p>
                            <p className="text-xs text-white/40 mt-1">Passing score requires &gt;= 50% correctness.</p>
                          </div>

                          {!quizResult.passed && (
                            <button
                              onClick={() => {
                                setQuizAnswers({});
                                setQuizResult(null);
                              }}
                              className="bg-brand-orange text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider"
                            >
                              Retry Quiz
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeLesson.type === "assignment" && (
                    <div className="space-y-6">
                      <div className="bg-white/2 border border-white/5 p-6 rounded-2xl space-y-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange">Assignment Brief</h4>
                        <p className="text-xs text-white/80 leading-relaxed italic">"{activeLesson.assignmentPrompt}"</p>
                      </div>

                      {currentUser.submissions.some((s) => s.lessonId === activeLesson.id) ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5" />
                            <div className="text-left">
                              <p className="text-[10px] font-black uppercase tracking-wider">Assignment Submitted</p>
                              <p className="text-[9px] text-white/40">Waiting for instructor grading.</p>
                            </div>
                          </div>
                          
                          {/* Display feedback if graded */}
                          {currentUser.submissions.find(s => s.lessonId === activeLesson.id)?.status === "graded" && (
                            <div className="p-5 bg-white/2 border border-white/5 rounded-2xl space-y-3">
                              <h5 className="text-[10px] font-black uppercase tracking-wider text-brand-orange">Grading & Instructor Comments</h5>
                              <div className="flex justify-between items-center">
                                <span className="text-2xl font-black text-white">
                                  Score: {currentUser.submissions.find(s => s.lessonId === activeLesson.id)?.score}/100
                                </span>
                              </div>
                              <p className="text-xs text-white/50 leading-relaxed italic bg-white/2 p-3 rounded-xl border border-white/5">
                                "{currentUser.submissions.find(s => s.lessonId === activeLesson.id)?.feedback}"
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleAssignmentSubmit(e, activeLesson, activeCourse?.id || "")} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Submission Writeup</label>
                            <textarea
                              rows={5}
                              required
                              placeholder="Detail your solution, code snippets, or project logic..."
                              value={assignmentContent}
                              onChange={(e) => setAssignmentContent(e.target.value)}
                              className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-brand-orange resize-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Live Portfolio / Github Link</label>
                            <div className="relative">
                              <input
                                type="url"
                                required
                                placeholder="https://github.com/yourusername/project"
                                value={assignmentLink}
                                onChange={(e) => setAssignmentLink(e.target.value)}
                                className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 pl-12 text-sm text-white outline-none focus:border-brand-orange"
                              />
                              <Link2 className="absolute left-4 top-3.5 text-white/25 w-4 h-4" />
                            </div>
                          </div>

                          {uploadProgress !== null && (
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-mono text-white/40 uppercase">
                                <span>Uploading assets...</span>
                                <span>{uploadProgress}%</span>
                              </div>
                              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-brand-orange h-full" style={{ width: `${uploadProgress}%` }} />
                              </div>
                            </div>
                          )}

                          <button
                            type="submit"
                            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs transition-colors cursor-pointer"
                          >
                            Submit Project
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <p className="text-white/40 italic">Please select a lesson from the outline panel.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Simulator Overlays */}
      <AnimatePresence>
        {payingCourse && (
          <PaymentSimulator
            course={payingCourse}
            onSuccess={handlePaymentSuccess}
            onClose={() => setPayingCourse(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingCertificate && (
          <CertificateGenerator
            studentName={currentUser.name}
            courseTitle={viewingCertificate.courseTitle}
            certificateId={viewingCertificate.certId}
            issueDate={viewingCertificate.date}
            onClose={() => setViewingCertificate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
