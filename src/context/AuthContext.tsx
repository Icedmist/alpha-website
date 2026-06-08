import React, { createContext, useContext, useState, useEffect } from "react";

export interface Submission {
  courseId: string;
  lessonId: string;
  assignmentTitle: string;
  content: string;
  portfolioLink: string;
  fileName?: string;
  submittedAt: string;
  status: "pending" | "graded";
  score?: number;
  feedback?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "student" | "instructor" | "admin";
  enrolledCourses: string[]; // Course IDs
  completedLessons: string[]; // Lesson IDs
  quizScores: Record<string, number>; // quizId -> score (percentage)
  submissions: Submission[];
  attendanceDates: string[]; // YYYY-MM-DD
  employmentStatus?: string;
  portfolioLinks?: string[];
  projectShowcase?: string;
  issuedCertificates?: string[]; // Course IDs that have been issued certificates
  headline?: string;
  biography?: string;
  website?: string;
  githubLink?: string;
  linkedinLink?: string;
  avatarGradient?: string;
}

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, phone: string, password: string, role?: "student" | "instructor" | "admin") => Promise<User>;
  logout: () => void;
  resetPassword: (email: string) => Promise<string>;
  updateUser: (updatedUser: User) => void;
  updateSpecificUser: (userId: string, updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SEED_USERS = [
  {
    id: "u-admin",
    name: "Alpha Admin",
    email: "admin@alphaspark.tech",
    password: "admin123",
    phone: "+2348011223344",
    role: "admin" as const,
    enrolledCourses: [],
    completedLessons: [],
    quizScores: {},
    submissions: [],
    attendanceDates: []
  },
  {
    id: "u-instructor",
    name: "Dr. Gabriel Okafor",
    email: "instructor@alphaspark.tech",
    password: "instructor123",
    phone: "+2348055667788",
    role: "instructor" as const,
    enrolledCourses: ["ai-ml", "fullstack-web", "graphic-design"],
    completedLessons: [],
    quizScores: {},
    submissions: [],
    attendanceDates: []
  },
  {
    id: "u-student",
    name: "Mustapha Yusuf",
    email: "student@alphaspark.tech",
    password: "student123",
    phone: "+2349075444148",
    role: "student" as const,
    enrolledCourses: ["fullstack-web"],
    completedLessons: ["fsw-m1-l1"],
    quizScores: {
      "fsw-m1-q1": 100
    },
    submissions: [
      {
        courseId: "fullstack-web",
        lessonId: "fsw-m2-a1",
        assignmentTitle: "Assignment: Portfolio Website Deployment",
        content: "I have built my website and deployed it. It contains a details page.",
        portfolioLink: "https://myportfolio-mustapha.vercel.app",
        submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        status: "pending" as const
      }
    ],
    attendanceDates: [
      new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split("T")[0],
      new Date(Date.now() - 24 * 3600 * 1000).toISOString().split("T")[0],
      new Date().toISOString().split("T")[0]
    ]
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // Read all users from localStorage, or seed them
    const storedUsers = localStorage.getItem("alpha_academy_users");
    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem("alpha_academy_users", JSON.stringify(SEED_USERS));
      setAllUsers(SEED_USERS);
    }

    // Read current logged-in user
    const storedSession = localStorage.getItem("alpha_academy_session");
    if (storedSession) {
      setCurrentUser(JSON.parse(storedSession));
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Read raw credentials mapping from users database (just password in plaintext for simulated flow)
    const storedRaw = localStorage.getItem("alpha_academy_users");
    const db: any[] = storedRaw ? JSON.parse(storedRaw) : SEED_USERS;
    
    const matched = db.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!matched) {
      throw new Error("Invalid email or password");
    }
    
    const userCopy = { ...matched };
    delete userCopy.password;
    
    setCurrentUser(userCopy);
    localStorage.setItem("alpha_academy_session", JSON.stringify(userCopy));
    return userCopy;
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: "student" | "instructor" | "admin" = "student"
  ): Promise<User> => {
    const storedRaw = localStorage.getItem("alpha_academy_users");
    const db: any[] = storedRaw ? JSON.parse(storedRaw) : [...SEED_USERS];

    const exists = db.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: `u-${Math.random().toString(36).substring(2, 11)}`,
      name,
      email,
      phone,
      password,
      role,
      enrolledCourses: role === "student" ? [] : ["ai-ml", "fullstack-web"],
      completedLessons: [],
      quizScores: {},
      submissions: [],
      attendanceDates: [new Date().toISOString().split("T")[0]] // Check in for today
    };

    db.push(newUser);
    localStorage.setItem("alpha_academy_users", JSON.stringify(db));
    setAllUsers(db);

    const userCopy = { ...newUser };
    delete userCopy.password;

    // Auto login
    setCurrentUser(userCopy);
    localStorage.setItem("alpha_academy_session", JSON.stringify(userCopy));

    return userCopy;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("alpha_academy_session");
  };

  const resetPassword = async (email: string): Promise<string> => {
    const storedRaw = localStorage.getItem("alpha_academy_users");
    const db: any[] = storedRaw ? JSON.parse(storedRaw) : [...SEED_USERS];

    const exists = db.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      throw new Error("Email not found");
    }

    return "A password reset link has been simulated. Please check your inbox (simulated email sent successfully).";
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("alpha_academy_session", JSON.stringify(updatedUser));

    // Save to users database
    const storedRaw = localStorage.getItem("alpha_academy_users");
    if (storedRaw) {
      const db: any[] = JSON.parse(storedRaw);
      const index = db.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) {
        db[index] = { ...db[index], ...updatedUser };
        localStorage.setItem("alpha_academy_users", JSON.stringify(db));
        setAllUsers(db);
      }
    }
  };

  const updateSpecificUser = (userId: string, updatedUser: User) => {
    const storedRaw = localStorage.getItem("alpha_academy_users");
    if (storedRaw) {
      const db: any[] = JSON.parse(storedRaw);
      const index = db.findIndex((u) => u.id === userId);
      if (index !== -1) {
        db[index] = { ...db[index], ...updatedUser };
        localStorage.setItem("alpha_academy_users", JSON.stringify(db));
        setAllUsers(db);
        
        // If updating the active user
        if (currentUser && currentUser.id === userId) {
          const userCopy = { ...db[index] };
          delete userCopy.password;
          setCurrentUser(userCopy);
          localStorage.setItem("alpha_academy_session", JSON.stringify(userCopy));
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      allUsers,
      login,
      register,
      logout,
      resetPassword,
      updateUser,
      updateSpecificUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
