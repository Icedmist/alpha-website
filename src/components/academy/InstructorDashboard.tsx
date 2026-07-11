import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, ClipboardCheck, GraduationCap, PlusCircle, CheckCircle2, 
  Send, AlertCircle, FileText, ExternalLink, BookOpen, Clock, Loader2, Trash2, Edit3,
  HelpCircle, Link2, Type, X
} from "lucide-react";
import { Course, Module, Lesson, LessonType, QuizQuestion, QuizOption } from "../../data/courses";
import { useAuth, User, Submission } from "../../context/AuthContext";

export default function InstructorDashboard({ 
  activeView, 
  onTabChange 
}: { 
  activeView?: "grading" | "students" | "lessons" | "resources"; 
  onTabChange?: (tab: "grading" | "students" | "lessons" | "resources") => void;
}) {
  const { currentUser, allUsers, updateSpecificUser, getAuthHeaders } = useAuth();
  const [localActiveTab, setLocalActiveTab] = useState<"grading" | "students" | "lessons" | "resources">("grading");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  
  const activeTab = activeView || localActiveTab;
  const setActiveTab = (tab: "grading" | "students" | "lessons" | "resources") => {
    setLocalActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setCourses(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  
  const assignedCourseIds = currentUser?.enrolledCourses || [];
  const instructorCourses = courses.filter((c) => assignedCourseIds.includes(c.id));

  useEffect(() => {
    if (instructorCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(instructorCourses[0].id);
      setSelectedResourceCourseId(instructorCourses[0].id);
    }
  }, [instructorCourses]);

  // Resources tab state
  const [selectedResourceCourseId, setSelectedResourceCourseId] = useState(instructorCourses[0]?.id || "");
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lesson: Lesson } | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState<string | null>(null);
  const [moduleTitleValue, setModuleTitleValue] = useState("");
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonDuration, setEditLessonDuration] = useState("");
  const [editLessonType, setEditLessonType] = useState<LessonType>("video");
  const [editLessonUrl, setEditLessonUrl] = useState("");
  const [editLessonTextContent, setEditLessonTextContent] = useState("");
  const [editLessonLinkUrl, setEditLessonLinkUrl] = useState("");
  const [editLessonLinkTitle, setEditLessonLinkTitle] = useState("");
  const [editLessonDocumentUrl, setEditLessonDocumentUrl] = useState("");
  const [editLessonDocumentName, setEditLessonDocumentName] = useState("");
  const [editLessonAssignmentPrompt, setEditLessonAssignmentPrompt] = useState("");
  const [editQuizQuestions, setEditQuizQuestions] = useState<QuizQuestion[]>([]);

  // Grading states
  const [gradingSubmission, setGradingSubmission] = useState<{ userId: string; userName: string; submission: Submission } | null>(null);
  const [score, setScore] = useState<number>(85);
  const [feedback, setFeedback] = useState<string>("");

  // Lesson editor states
  const [selectedCourseId, setSelectedCourseId] = useState(instructorCourses[0]?.id || "");
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("video");
  const [lessonDuration, setLessonDuration] = useState("15 mins");
  const [lessonPromptOrUrl, setLessonPromptOrUrl] = useState("");
  const [lessonTextContent, setLessonTextContent] = useState("");
  const [lessonLinkUrl, setLessonLinkUrl] = useState("");
  const [lessonLinkTitle, setLessonLinkTitle] = useState("");
  const [lessonDocumentUrl, setLessonDocumentUrl] = useState("");
  const [lessonDocumentName, setLessonDocumentName] = useState("");

  // Quiz question builder state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: "q1",
      question: "",
      options: [
        { label: "A", text: "" },
        { label: "B", text: "" },
        { label: "C", text: "" },
        { label: "D", text: "" }
      ],
      correctAnswerIndex: 0
    }
  ]);

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

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !lessonTitle.trim()) {
      alert("Please enter both module name and lesson name.");
      return;
    }

    const newLessonId = `les-${Math.random().toString(36).substring(2, 9)}`;
    
    // Build lesson based on type
    const newLesson: Lesson = {
      id: newLessonId,
      title: lessonTitle,
      type: lessonType,
      duration: lessonDuration,
    };

    // Add type-specific fields
    if (lessonType === "video") {
      newLesson.videoUrl = lessonPromptOrUrl;
    } else if (lessonType === "pdf") {
      newLesson.pdfUrl = lessonPromptOrUrl;
    } else if (lessonType === "assignment") {
      newLesson.assignmentPrompt = lessonPromptOrUrl;
    } else if (lessonType === "text") {
      newLesson.textContent = lessonTextContent;
    } else if (lessonType === "link") {
      newLesson.linkUrl = lessonLinkUrl;
      newLesson.linkTitle = lessonLinkTitle || lessonLinkUrl;
    } else if (lessonType === "document") {
      newLesson.documentUrl = lessonDocumentUrl;
      newLesson.documentName = lessonDocumentName || "Document Resource";
    } else if (lessonType === "quiz") {
      // Filter out empty questions
      const validQuestions = quizQuestions.filter(q => q.question.trim() !== "");
      if (validQuestions.length === 0) {
        alert("Please add at least one quiz question.");
        return;
      }
      newLesson.quizQuestions = validQuestions.map((q, idx) => ({
        ...q,
        id: `${newLessonId}-q${idx + 1}`
      }));
    }

    try {
      const authHeaders = await getAuthHeaders();
      const course = courses.find(c => c.id === selectedCourseId);
      const existingModule = course?.modules.find(m => m.title.toLowerCase().includes(moduleTitle.toLowerCase()));
      
      if (existingModule) {
        const res = await fetch("/api/courses/content", {
          method: "PUT",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: selectedCourseId,
            moduleId: existingModule.id,
            lesson: newLesson,
            action: "addLesson"
          })
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.error || "Failed to add lesson");
          return;
        }
      } else {
        const newModule: Module = {
          id: `mod-${Math.random().toString(36).substring(2, 9)}`,
          title: moduleTitle,
          lessons: [newLesson]
        };
        
        const res = await fetch("/api/courses/content", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: selectedCourseId,
            module: newModule
          })
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.error || "Failed to create module");
          return;
        }
      }
      
      alert("New lesson added successfully!");
      // Reset form
      setLessonTitle("");
      setLessonPromptOrUrl("");
      setLessonTextContent("");
      setLessonLinkUrl("");
      setLessonLinkTitle("");
      setLessonDocumentUrl("");
      setLessonDocumentName("");
      setQuizQuestions([
        {
          id: "q1",
          question: "",
          options: [
            { label: "A", text: "" },
            { label: "B", text: "" },
            { label: "C", text: "" },
            { label: "D", text: "" }
          ],
          correctAnswerIndex: 0
        }
      ]);
      await fetchCourses();
    } catch (err) {
      console.error("Failed to add lesson:", err);
      alert("Error adding lesson");
    }
  };

  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: `q${quizQuestions.length + 1}`,
        question: "",
        options: [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" }
        ],
        correctAnswerIndex: 0
      }
    ]);
  };

  const removeQuizQuestion = (index: number) => {
    if (quizQuestions.length > 1) {
      setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
    }
  };

  const updateQuizQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...quizQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setQuizQuestions(updated);
  };

  const updateQuizOption = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...quizQuestions];
    updated[questionIndex].options[optionIndex] = {
      ...updated[questionIndex].options[optionIndex],
      text
    };
    setQuizQuestions(updated);
  };

  const startEditLesson = (moduleId: string, lesson: Lesson) => {
    setEditingLesson({ moduleId, lesson });
    setEditLessonTitle(lesson.title);
    setEditLessonDuration(lesson.duration);
    setEditLessonType(lesson.type);
    setEditLessonUrl(lesson.videoUrl || lesson.pdfUrl || "");
    setEditLessonTextContent(lesson.textContent || "");
    setEditLessonLinkUrl(lesson.linkUrl || "");
    setEditLessonLinkTitle(lesson.linkTitle || "");
    setEditLessonDocumentUrl(lesson.documentUrl || "");
    setEditLessonDocumentName(lesson.documentName || "");
    setEditLessonAssignmentPrompt(lesson.assignmentPrompt || "");
    setEditQuizQuestions(lesson.quizQuestions ? JSON.parse(JSON.stringify(lesson.quizQuestions)) : []);
    setEditingModuleTitle(null);
  };

  const startEditModuleTitle = (moduleId: string, currentTitle: string) => {
    setEditingModuleTitle(moduleId);
    setModuleTitleValue(currentTitle);
    setEditingLesson(null);
  };

  const saveModuleTitle = async (courseId: string, moduleId: string) => {
    if (!moduleTitleValue.trim()) return;
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/courses/content", {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          moduleId,
          title: moduleTitleValue,
          action: "updateModule"
        })
      });
      if (res.ok) {
        setEditingModuleTitle(null);
        await fetchCourses();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update module title");
      }
    } catch (err) {
      console.error("Failed to update module:", err);
    }
  };

  const saveLessonEdit = async (courseId: string) => {
    if (!editingLesson) return;
    const { moduleId, lesson } = editingLesson;

    const updatedLesson: Lesson = {
      ...lesson,
      title: editLessonTitle,
      duration: editLessonDuration,
      type: editLessonType,
      videoUrl: editLessonType === "video" ? editLessonUrl : undefined,
      pdfUrl: editLessonType === "pdf" ? editLessonUrl : undefined,
      textContent: editLessonType === "text" ? editLessonTextContent : undefined,
      linkUrl: editLessonType === "link" ? editLessonLinkUrl : undefined,
      linkTitle: editLessonType === "link" ? editLessonLinkTitle : undefined,
      documentUrl: editLessonType === "document" ? editLessonDocumentUrl : undefined,
      documentName: editLessonType === "document" ? editLessonDocumentName : undefined,
      assignmentPrompt: editLessonType === "assignment" ? editLessonAssignmentPrompt : undefined,
      quizQuestions: editLessonType === "quiz" ? editQuizQuestions.filter(q => q.question.trim()) : undefined,
    };

    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/courses/content", {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          moduleId,
          lesson: updatedLesson,
          action: "updateLesson"
        })
      });
      if (res.ok) {
        setEditingLesson(null);
        await fetchCourses();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update lesson");
      }
    } catch (err) {
      console.error("Failed to update lesson:", err);
    }
  };

  const deleteLesson = async (courseId: string, moduleId: string, lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/courses/content", {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          moduleId,
          lesson: { id: lessonId },
          action: "deleteLesson"
        })
      });
      if (res.ok) {
        if (editingLesson?.lesson.id === lessonId) setEditingLesson(null);
        await fetchCourses();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete lesson");
      }
    } catch (err) {
      console.error("Failed to delete lesson:", err);
    }
  };

  const deleteModule = async (courseId: string, moduleId: string) => {
    if (!confirm("Are you sure you want to delete this entire module and all its lessons?")) return;
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/courses/content", {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          moduleId,
          action: "deleteModule"
        })
      });
      if (res.ok) {
        setEditingLesson(null);
        setEditingModuleTitle(null);
        await fetchCourses();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete module");
      }
    } catch (err) {
      console.error("Failed to delete module:", err);
    }
  };

  const addEditQuizQuestion = () => {
    setEditQuizQuestions([
      ...editQuizQuestions,
      {
        id: `q${editQuizQuestions.length + 1}`,
        question: "",
        options: [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" }
        ],
        correctAnswerIndex: 0
      }
    ]);
  };

  const removeEditQuizQuestion = (index: number) => {
    if (editQuizQuestions.length > 1) {
      setEditQuizQuestions(editQuizQuestions.filter((_, i) => i !== index));
    }
  };

  const updateEditQuizQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...editQuizQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setEditQuizQuestions(updated);
  };

  const updateEditQuizOption = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...editQuizQuestions];
    updated[questionIndex].options[optionIndex] = {
      ...updated[questionIndex].options[optionIndex],
      text
    };
    setEditQuizQuestions(updated);
  };

  if (isLoadingCourses) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Panel */}
      <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Instructor Hub</p>
        <h2 className="font-display font-black text-2xl md:text-3xl uppercase italic mt-1.5">Classroom Dashboard</h2>
        <p className="text-white/40 text-xs md:text-sm mt-1 italic">Review code projects, monitor cohorts, and push syllabus updates.</p>
      </div>


      {/* Workspace Area */}
      <div className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl md:rounded-[32px]">
        {activeTab === "grading" && (
          <div className="space-y-6">
            <h3 className="font-display font-black text-lg md:text-xl uppercase italic tracking-tight text-white">
              Submissions Queue
            </h3>
            
            {pendingSubmissions.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 text-center rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-white/40 italic">Queue cleared. All submitted assignments are graded!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {pendingSubmissions.map((item, idx) => {
                  const course = courses.find(c => c.id === item.submission.courseId);

                  return (
                    <div 
                      key={idx} 
                      className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:bg-white/10 transition-colors"
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
                  onChange={(e) => setLessonType(e.target.value as LessonType)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                >
                  <option value="video">Video Stream</option>
                  <option value="pdf">Document PDF</option>
                  <option value="text">Text Content</option>
                  <option value="link">External Link</option>
                  <option value="document">Document Resource</option>
                  <option value="quiz">Interactive Quiz</option>
                  <option value="assignment">Upload Assignment</option>
                </select>
              </div>
            </div>

            {/* Type-specific input fields */}
            {lessonType === "video" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Embed Video URL</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/embed/..."
                  value={lessonPromptOrUrl}
                  onChange={(e) => setLessonPromptOrUrl(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                />
              </div>
            )}

            {lessonType === "pdf" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">PDF Download URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/document.pdf"
                  value={lessonPromptOrUrl}
                  onChange={(e) => setLessonPromptOrUrl(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                />
              </div>
            )}

            {lessonType === "text" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Text Content</label>
                <textarea
                  rows={6}
                  placeholder="Enter lesson text content here... (supports paragraphs, lists, etc.)"
                  value={lessonTextContent}
                  onChange={(e) => setLessonTextContent(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none resize-none"
                />
              </div>
            )}

            {lessonType === "link" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40">External Resource URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={lessonLinkUrl}
                    onChange={(e) => setLessonLinkUrl(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Link Display Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Official Documentation"
                    value={lessonLinkTitle}
                    onChange={(e) => setLessonLinkTitle(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                  />
                </div>
              </div>
            )}

            {lessonType === "document" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Document URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/document.docx"
                    value={lessonDocumentUrl}
                    onChange={(e) => setLessonDocumentUrl(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Document Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Study Guide Week 3"
                    value={lessonDocumentName}
                    onChange={(e) => setLessonDocumentName(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                  />
                </div>
              </div>
            )}

            {lessonType === "assignment" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Assignment Prompt</label>
                <textarea
                  rows={4}
                  placeholder="Specify project expectations and requirements..."
                  value={lessonPromptOrUrl}
                  onChange={(e) => setLessonPromptOrUrl(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none resize-none"
                />
              </div>
            )}

            {/* Quiz Question Builder */}
            {lessonType === "quiz" && (
              <div className="space-y-6 border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Quiz Question Builder
                  </h4>
                  <button
                    type="button"
                    onClick={addQuizQuestion}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {quizQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="space-y-4 bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-bold text-white/40 uppercase">Question {qIndex + 1}</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your question..."
                          value={q.question}
                          onChange={(e) => updateQuizQuestion(qIndex, "question", e.target.value)}
                          className="w-full bg-brand-navy border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-orange outline-none"
                        />
                      </div>
                      {quizQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuizQuestion(qIndex)}
                          className="text-red-400/60 hover:text-red-400 mt-4 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="space-y-1">
                          <label className="text-[9px] font-bold text-white/40 uppercase flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                              q.correctAnswerIndex === optIndex
                                ? "bg-green-500 text-white"
                                : "bg-white/10 text-white/40"
                            }`}>
                              {opt.label}
                            </span>
                            {q.correctAnswerIndex === optIndex && (
                              <span className="text-green-400 text-[8px]">Correct</span>
                            )}
                          </label>
                          <input
                            type="text"
                            placeholder={`Option ${opt.label}`}
                            value={opt.text}
                            onChange={(e) => updateQuizOption(qIndex, optIndex, e.target.value)}
                            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-white/40 uppercase">Correct Answer</label>
                      <select
                        value={q.correctAnswerIndex}
                        onChange={(e) => updateQuizQuestion(qIndex, "correctAnswerIndex", parseInt(e.target.value))}
                        className="w-full bg-brand-navy border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-orange outline-none"
                      >
                        {q.options.map((opt, idx) => (
                          <option key={idx} value={idx}>{opt.label} - {opt.text || `Option ${opt.label}`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              Push Lesson Live
            </button>
          </form>
        )}

        {/* Resources Tab - View and Edit Course Content */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <h3 className="font-display font-black text-xl uppercase italic tracking-tight text-white mb-4">
              Course Resources Manager
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40">Select Course</label>
                <select
                  value={selectedResourceCourseId}
                  onChange={(e) => setSelectedResourceCourseId(e.target.value)}
                  className="w-full bg-brand-navy border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-brand-orange outline-none"
                >
                  {instructorCourses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {(() => {
                const selectedCourse = courses.find(c => c.id === selectedResourceCourseId);
                if (!selectedCourse) {
                  return (
                    <div className="bg-white/[0.02] border border-white/5 p-8 text-center rounded-2xl">
                      <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 text-xs">Select a course to view its resources.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {selectedCourse.modules.length === 0 ? (
                      <div className="bg-white/[0.02] border border-white/5 p-8 text-center rounded-2xl">
                        <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40 text-xs">No modules created yet for this course.</p>
                      </div>
                    ) : (
                      selectedCourse.modules.map((mod) => (
                        <div key={mod.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            {editingModuleTitle === mod.id ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={moduleTitleValue}
                                  onChange={(e) => setModuleTitleValue(e.target.value)}
                                  className="flex-1 bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-brand-orange outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveModuleTitle(selectedCourse.id, mod.id)}
                                  className="bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingModuleTitle(null)}
                                  className="bg-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <h4
                                className="font-bold text-sm text-white uppercase tracking-wider cursor-pointer hover:text-brand-orange transition-colors"
                                onClick={() => startEditModuleTitle(mod.id, mod.title)}
                                title="Click to edit module title"
                              >
                                {mod.title}
                              </h4>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/40 font-mono">{mod.lessons.length} lessons</span>
                              <button
                                onClick={() => deleteModule(selectedCourse.id, mod.id)}
                                className="text-red-400/50 hover:text-red-400 cursor-pointer"
                                title="Delete Module"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {mod.lessons.map((les) => (
                              <div key={les.id}>
                                {editingLesson?.lesson.id === les.id ? (
                                  <div className="bg-white/[0.05] border border-brand-orange/30 rounded-xl p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-[10px] font-black uppercase tracking-wider text-brand-orange">Editing Lesson</h5>
                                      <button
                                        onClick={() => setEditingLesson(null)}
                                        className="text-white/40 hover:text-white cursor-pointer"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-white/40 uppercase">Title</label>
                                        <input
                                          type="text"
                                          value={editLessonTitle}
                                          onChange={(e) => setEditLessonTitle(e.target.value)}
                                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-white/40 uppercase">Duration</label>
                                        <input
                                          type="text"
                                          value={editLessonDuration}
                                          onChange={(e) => setEditLessonDuration(e.target.value)}
                                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-white/40 uppercase">Type</label>
                                      <select
                                        value={editLessonType}
                                        onChange={(e) => setEditLessonType(e.target.value as LessonType)}
                                        className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                                      >
                                        <option value="video">Video</option>
                                        <option value="pdf">PDF</option>
                                        <option value="text">Text</option>
                                        <option value="link">Link</option>
                                        <option value="document">Document</option>
                                        <option value="quiz">Quiz</option>
                                        <option value="assignment">Assignment</option>
                                      </select>
                                    </div>

                                    {editLessonType === "video" && (
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-white/40 uppercase">Video URL</label>
                                        <input
                                          type="url"
                                          value={editLessonUrl}
                                          onChange={(e) => setEditLessonUrl(e.target.value)}
                                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                                        />
                                      </div>
                                    )}

                                    {editLessonType === "pdf" && (
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-white/40 uppercase">PDF URL</label>
                                        <input
                                          type="url"
                                          value={editLessonUrl}
                                          onChange={(e) => setEditLessonUrl(e.target.value)}
                                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                                        />
                                      </div>
                                    )}

                                    {editLessonType === "text" && (
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-white/40 uppercase">Text Content</label>
                                        <textarea
                                          rows={4}
                                          value={editLessonTextContent}
                                          onChange={(e) => setEditLessonTextContent(e.target.value)}
                                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none resize-none"
                                        />
                                      </div>
                                    )}

                                    {editLessonType === "link" && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-white/40 uppercase">URL</label>
                                          <input
                                            type="url"
                                            value={editLessonLinkUrl}
                                            onChange={(e) => setEditLessonLinkUrl(e.target.value)}
                                            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-white/40 uppercase">Display Title</label>
                                          <input
                                            type="text"
                                            value={editLessonLinkTitle}
                                            onChange={(e) => setEditLessonLinkTitle(e.target.value)}
                                            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {editLessonType === "document" && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-white/40 uppercase">Document URL</label>
                                          <input
                                            type="url"
                                            value={editLessonDocumentUrl}
                                            onChange={(e) => setEditLessonDocumentUrl(e.target.value)}
                                            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-white/40 uppercase">Document Name</label>
                                          <input
                                            type="text"
                                            value={editLessonDocumentName}
                                            onChange={(e) => setEditLessonDocumentName(e.target.value)}
                                            className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {editLessonType === "assignment" && (
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-white/40 uppercase">Assignment Prompt</label>
                                        <textarea
                                          rows={3}
                                          value={editLessonAssignmentPrompt}
                                          onChange={(e) => setEditLessonAssignmentPrompt(e.target.value)}
                                          className="w-full bg-brand-navy border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:border-brand-orange outline-none resize-none"
                                        />
                                      </div>
                                    )}

                                    {editLessonType === "quiz" && (
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <label className="text-[9px] font-bold text-white/40 uppercase">Quiz Questions</label>
                                          <button
                                            type="button"
                                            onClick={addEditQuizQuestion}
                                            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg text-[9px] font-bold cursor-pointer"
                                          >
                                            <PlusCircle className="w-3 h-3" /> Add Q
                                          </button>
                                        </div>
                                        {editQuizQuestions.map((q, qi) => (
                                          <div key={qi} className="bg-white/[0.03] border border-white/5 rounded-lg p-3 space-y-2">
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="text"
                                                placeholder="Question..."
                                                value={q.question}
                                                onChange={(e) => updateEditQuizQuestion(qi, "question", e.target.value)}
                                                className="flex-1 bg-brand-navy border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:border-brand-orange outline-none"
                                              />
                                              {editQuizQuestions.length > 1 && (
                                                <button onClick={() => removeEditQuizQuestion(qi)} className="text-red-400/60 hover:text-red-400 cursor-pointer">
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                              {q.options.map((opt, oi) => (
                                                <input
                                                  key={oi}
                                                  type="text"
                                                  placeholder={`${opt.label}`}
                                                  value={opt.text}
                                                  onChange={(e) => updateEditQuizOption(qi, oi, e.target.value)}
                                                  className="bg-brand-navy border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:border-brand-orange outline-none"
                                                />
                                              ))}
                                            </div>
                                            <select
                                              value={q.correctAnswerIndex}
                                              onChange={(e) => updateEditQuizQuestion(qi, "correctAnswerIndex", parseInt(e.target.value))}
                                              className="w-full bg-brand-navy border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:border-brand-orange outline-none"
                                            >
                                              {q.options.map((opt, oi) => (
                                                <option key={oi} value={oi}>{opt.label} - {opt.text || "Empty"}</option>
                                              ))}
                                            </select>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                      <button
                                        onClick={() => saveLessonEdit(selectedCourse.id)}
                                        className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                      >
                                        Save Changes
                                      </button>
                                      <button
                                        onClick={() => editingLesson && deleteLesson(selectedCourse.id, editingLesson.moduleId, les.id)}
                                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    onClick={() => startEditLesson(mod.id, les)}
                                    className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:bg-white/[0.05] hover:border-brand-orange/30 transition-all cursor-pointer group"
                                  >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      les.type === "video" ? "bg-blue-500/20 text-blue-400" :
                                      les.type === "pdf" ? "bg-red-500/20 text-red-400" :
                                      les.type === "quiz" ? "bg-green-500/20 text-green-400" :
                                      les.type === "assignment" ? "bg-yellow-500/20 text-yellow-400" :
                                      les.type === "text" ? "bg-purple-500/20 text-purple-400" :
                                      les.type === "link" ? "bg-cyan-500/20 text-cyan-400" :
                                      "bg-orange-500/20 text-orange-400"
                                    }`}>
                                      {les.type === "video" ? <BookOpen className="w-4 h-4" /> :
                                       les.type === "pdf" ? <FileText className="w-4 h-4" /> :
                                       les.type === "quiz" ? <HelpCircle className="w-4 h-4" /> :
                                       les.type === "assignment" ? <ClipboardCheck className="w-4 h-4" /> :
                                       les.type === "text" ? <Type className="w-4 h-4" /> :
                                       les.type === "link" ? <Link2 className="w-4 h-4" /> :
                                       <FileText className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-white truncate group-hover:text-brand-orange transition-colors">{les.title}</p>
                                      <p className="text-[10px] text-white/40 uppercase">{les.type} • {les.duration}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {les.type === "quiz" && les.quizQuestions && (
                                        <span className="text-[9px] text-green-400/70 bg-green-500/10 px-2 py-0.5 rounded">
                                          {les.quizQuestions.length} Qs
                                        </span>
                                      )}
                                      <Edit3 className="w-3.5 h-3.5 text-white/20 group-hover:text-brand-orange transition-colors" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
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
