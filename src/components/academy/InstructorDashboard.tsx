import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, ClipboardCheck, GraduationCap, PlusCircle, CheckCircle2, 
  Send, AlertCircle, FileText, ExternalLink, BookOpen, Clock
} from "lucide-react";
import { courses, Course } from "../../data/courses";
import { useAuth, User, Submission } from "../../context/AuthContext";

export default function InstructorDashboard({ 
  activeView, 
  onTabChange 
}: { 
  activeView?: "grading" | "students" | "lessons"; 
  onTabChange?: (tab: "grading" | "students" | "lessons") => void;
}) {
  const { currentUser, allUsers, updateSpecificUser } = useAuth();
  const [localActiveTab, setLocalActiveTab] = useState<"grading" | "students" | "lessons">("grading");
  
  const activeTab = activeView || localActiveTab;
  const setActiveTab = (tab: "grading" | "students" | "lessons") => {
    setLocalActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  
  const assignedCourseIds = currentUser?.enrolledCourses || [];
  const instructorCourses = courses.filter((c) => assignedCourseIds.includes(c.id));

  // Grading states
  const [gradingSubmission, setGradingSubmission] = useState<{ userId: string; userName: string; submission: Submission } | null>(null);
  const [score, setScore] = useState<number>(85);
  const [feedback, setFeedback] = useState<string>("");

  // Lesson editor states
  const [selectedCourseId, setSelectedCourseId] = useState(instructorCourses[0]?.id || "");
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<"video" | "pdf" | "quiz" | "assignment">("video");
  const [lessonDuration, setLessonDuration] = useState("15 mins");
  const [lessonPromptOrUrl, setLessonPromptOrUrl] = useState("");

  // Filter students enrolled in at least one course assigned to the instructor
  const students = allUsers.filter(
    (u) => u.role === "student" && u.enrolledCourses.some((cid) => assignedCourseIds.includes(cid))
  );

  // Get all pending submissions across assigned students/courses
  const pendingSubmissions: { userId: string; userName: string; submission: Submission }[] = [];
  students.forEach((student) => {
    student.submissions.forEach((sub) => {
      if (sub.status === "pending" && assignedCourseIds.includes(sub.courseId)) {
        pendingSubmissions.push({
          userId: student.id,
          userName: student.name,
          submission: sub
        });
      }
    });
  });

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const student = students.find((s) => s.id === gradingSubmission.userId);
    if (!student) return;

    // Update the submission
    const updatedSubmissions = student.submissions.map((sub) => {
      if (sub.lessonId === gradingSubmission.submission.lessonId) {
        return {
          ...sub,
          status: "graded" as const,
          score,
          feedback,
          submittedAt: new Date().toISOString() // refresh status timestamp
        };
      }
      return sub;
    });

    // Write updated student user records to localStorage database
    updateSpecificUser(student.id, {
      ...student,
      submissions: updatedSubmissions
    });

    setGradingSubmission(null);
    setScore(85);
    setFeedback("");
    alert("Submission graded and feedback sent to student!");
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !lessonTitle.trim()) {
      alert("Please enter both module name and lesson name.");
      return;
    }

    // In a real DB we would save this to a global state/DB.
    // For this MVP, we can simulate updating the global course list or local course state.
    // Let's store course additions in localStorage as 'alpha_custom_courses' so they persist!
    const localCourses = localStorage.getItem("alpha_custom_courses");
    const coursesDb: Course[] = localCourses ? JSON.parse(localCourses) : [...courses];

    const courseIndex = coursesDb.findIndex(c => c.id === selectedCourseId);
    if (courseIndex === -1) return;

    const targetCourse = coursesDb[courseIndex];
    let moduleIndex = targetCourse.modules.findIndex(m => m.title.toLowerCase().includes(moduleTitle.toLowerCase()));
    
    // Create module if it doesn't exist
    if (moduleIndex === -1) {
      targetCourse.modules.push({
        id: `mod-${Math.random().toString(36).substring(2, 9)}`,
        title: moduleTitle,
        lessons: []
      });
      moduleIndex = targetCourse.modules.length - 1;
    }

    const newLessonId = `les-${Math.random().toString(36).substring(2, 9)}`;
    const newLesson = {
      id: newLessonId,
      title: lessonTitle,
      type: lessonType,
      duration: lessonDuration,
      videoUrl: lessonType === "video" ? lessonPromptOrUrl : undefined,
      pdfUrl: lessonType === "pdf" ? lessonPromptOrUrl : undefined,
      assignmentPrompt: lessonType === "assignment" ? lessonPromptOrUrl : undefined,
      quizQuestions: lessonType === "quiz" ? [
        {
          id: `${newLessonId}-q1`,
          question: "Review Question: Is this course content verified?",
          options: ["Yes, absolutely", "No, in validation", "Not sure"],
          correctAnswerIndex: 0
        }
      ] : undefined
    };

    targetCourse.modules[moduleIndex].lessons.push(newLesson);
    coursesDb[courseIndex] = targetCourse;

    localStorage.setItem("alpha_custom_courses", JSON.stringify(coursesDb));
    
    // Force refresh or notify user (since courses object in memory is static, we can alert user and tell them to reload)
    alert("New lesson added successfully! (Updates are stored in local sandbox).");
    setLessonTitle("");
    setLessonPromptOrUrl("");
  };

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Instructor Hub</p>
        <h2 className="font-display font-black text-3xl uppercase italic mt-2">Classroom Dashboard</h2>
        <p className="text-white/40 text-sm mt-1 italic">Review code projects, monitor cohorts, and push syllabus updates.</p>
      </div>


      {/* Workspace Area */}
      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[32px]">
        {activeTab === "grading" && (
          <div className="space-y-6">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white">
              Submissions Queue
            </h3>
            
            {pendingSubmissions.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 p-12 text-center rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-white/40 italic">Queue cleared. All submitted assignments are graded!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {pendingSubmissions.map((item, idx) => {
                  const course = courses.find(c => c.id === item.submission.courseId);

                  return (
                    <div 
                      key={idx} 
                      className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/10 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[9px] font-black uppercase">
                            {course?.title}
                          </span>
                          <span className="text-white/30 text-[10px] font-mono">
                            Submitted: {new Date(item.submission.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white">
                          {item.submission.assignmentTitle}
                        </h4>
                        <p className="text-xs text-white/50">Submitted by: <span className="font-black text-white">{item.userName}</span></p>
                      </div>

                      <button
                        onClick={() => setGradingSubmission(item)}
                        className="bg-white text-brand-navy hover:bg-brand-orange hover:text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                      >
                        Review Solution
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="space-y-6">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white mb-6">
              Roster & Progress Report
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 font-black uppercase tracking-widest text-[9px]">
                    <th className="pb-4">Student Name</th>
                    <th className="pb-4">Email / Phone</th>
                    <th className="pb-4">Enrolled Tracks</th>
                    <th className="pb-4">Finished Modules</th>
                    <th className="pb-4">Avg Quiz Mark</th>
                    <th className="pb-4">Assignment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {students.map((student) => {
                    const enrolledNames = student.enrolledCourses.map(id => courses.find(c => c.id === id)?.title).filter(Boolean);
                    const completedCount = student.completedLessons.length;
                    const quizCount = Object.keys(student.quizScores).length;
                    const avgQuiz = quizCount > 0 
                      ? Math.round((Object.values(student.quizScores) as number[]).reduce((a, b) => a + b, 0) / quizCount) 
                      : 0;
                    const pendingCount = student.submissions.filter(s => s.status === 'pending').length;

                    return (
                      <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pr-4 font-bold text-white">{student.name}</td>
                        <td className="py-4 pr-4 text-white/50">
                          <div>{student.email}</div>
                          <div className="text-[10px] font-mono mt-0.5">{student.phone}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {enrolledNames.map((n, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-white/60">
                                {n}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 pr-4 font-mono font-bold text-brand-blue">{completedCount} Lessons</td>
                        <td className="py-4 pr-4 font-mono font-bold text-brand-orange">{avgQuiz > 0 ? `${avgQuiz}%` : "—"}</td>
                        <td className="py-4">
                          {pendingCount > 0 ? (
                            <span className="bg-brand-orange/10 border border-brand-orange/20 text-brand-orange px-2 py-0.5 rounded text-[9px] font-black uppercase">
                              {pendingCount} Pending
                            </span>
                          ) : (
                            <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                              All Clear
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "lessons" && (
          <form onSubmit={handleCreateLesson} className="space-y-6 max-w-2xl">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white mb-4">
              Add New Lesson Module
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Select Target Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                  disabled={instructorCourses.length === 0}
                >
                  {instructorCourses.length > 0 ? (
                    instructorCourses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))
                  ) : (
                    <option value="">No courses assigned</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Module Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 3: Intermediate Logic"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Lesson Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Recursion"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Lesson Format</label>
                <select
                  value={lessonType}
                  onChange={(e) => setLessonType(e.target.value as any)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                >
                  <option value="video">Video Stream</option>
                  <option value="pdf">Document PDF</option>
                  <option value="quiz">Interactive Quiz</option>
                  <option value="assignment">Upload Assignment</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-white/40">
                {lessonType === "video" ? "Embed Video URL" : lessonType === "pdf" ? "PDF Download URL" : lessonType === "assignment" ? "Assignment Prompt Text" : "Resource details (Optional)"}
              </label>
              <textarea
                rows={3}
                placeholder={lessonType === "assignment" ? "Specify project expectations and requirements..." : "https://www.youtube.com/embed/..."}
                value={lessonPromptOrUrl}
                onChange={(e) => setLessonPromptOrUrl(e.target.value)}
                className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              Push Lesson Live
            </button>
          </form>
        )}
      </div>

      {/* Grading Review Modal */}
      <AnimatePresence>
        {gradingSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white text-[#333] rounded-[32px] overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="bg-brand-navy p-6 flex justify-between items-center text-white">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Grade Assignment</p>
                  <h4 className="font-bold text-base mt-1">{gradingSubmission.submission.assignmentTitle}</h4>
                </div>
                <button 
                  onClick={() => setGradingSubmission(null)}
                  className="text-white/60 hover:text-white font-bold text-sm uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* Student Submission Contents */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-gray-500 font-bold border-b border-gray-100 pb-2">
                    <span>Submitted by: <strong className="text-brand-navy">{gradingSubmission.userName}</strong></span>
                    <span>Date: {new Date(gradingSubmission.submission.submittedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Student Submission Details:</span>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">
                      {gradingSubmission.submission.content}
                    </div>
                  </div>

                  {gradingSubmission.submission.portfolioLink && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Live Project Portfolio URL:</span>
                      <a 
                        href={gradingSubmission.submission.portfolioLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-brand-blue font-bold hover:underline"
                      >
                        {gradingSubmission.submission.portfolioLink} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Grading Form */}
                <form onSubmit={handleGradeSubmit} className="space-y-5 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <label className="text-xs font-black uppercase tracking-wider text-brand-navy">Assign Grade Score (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={score}
                      onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-navy text-brand-navy font-bold text-center"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instructor Constructive Feedback</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Offer actionable advice on how the student can improve..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-xs text-brand-navy focus:outline-none focus:border-brand-navy resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-orange text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 hover:bg-brand-orange/90 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Save Grade & Submit Feedback
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
