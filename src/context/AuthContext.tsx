import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../lib/auth-client';

export interface Submission {
  courseId: string;
  lessonId: string;
  assignmentTitle: string;
  content: string;
  portfolioLink: string;
  fileName?: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  score?: number;
  feedback?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'instructor' | 'admin';
  enrolledCourses: string[];
  completedLessons: string[];
  quizScores: Record<string, number>;
  submissions: Submission[];
  attendanceDates: string[];
  employmentStatus?: string;
  portfolioLinks?: string[];
  projectShowcase?: string;
  issuedCertificates?: string[];
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
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role?: 'student' | 'instructor' | 'admin'
  ) => Promise<User>;
  logout: () => void;
  resetPassword: (email: string) => Promise<string>;
  updateUser: (updatedUser: User) => void;
  updateSpecificUser: (userId: string, updatedUser: User) => void;
  loadAllUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        if (data.role === 'admin' || data.role === 'instructor') {
          await loadAllUsers();
        }
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setCurrentUser(null);
    }
  };

  const loadAllUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch all users:', err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      await loadProfile();
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || 'Invalid email or password');
    }

    const res = await fetch('/api/user/profile', {
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Failed to load user profile');
    }

    const profile = await res.json();
    setCurrentUser(profile);

    if (profile.role === 'admin' || profile.role === 'instructor') {
      await loadAllUsers();
    }
    return profile;
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'student' | 'instructor' | 'admin' = 'student'
  ): Promise<User> => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      throw new Error(error.message || 'Email already registered');
    }

    const res = await fetch('/api/user/profile', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        role,
        enrolledCourses: role === 'student' ? [] : ['ai-ml', 'fullstack-web'],
        completedLessons: [],
        quizScores: {},
        submissions: [],
        attendanceDates: [new Date().toISOString().split('T')[0]],
      }),
    });

    if (!res.ok) {
      throw new Error('Account created, but failed to initialize user profile.');
    }

    const profile = await res.json();
    setCurrentUser(profile);

    if (profile.role === 'admin' || profile.role === 'instructor') {
      await loadAllUsers();
    }
    return profile;
  };

  const logout = async () => {
    await authClient.signOut();
    setCurrentUser(null);
    setAllUsers([]);
  };

  const resetPassword = async (email: string): Promise<string> => {
    return 'A password reset link has been simulated. Please check your inbox (simulated email sent successfully).';
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        const profile = await res.json();
        setCurrentUser(profile);
        if (profile.role === 'admin' || profile.role === 'instructor') {
          await loadAllUsers();
        }
      }
    } catch (err) {
      console.error('Failed to update user profile:', err);
    }
  };

  const updateSpecificUser = async (userId: string, updatedUser: User) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedUser,
          targetUserId: userId,
        }),
      });

      if (res.ok) {
        await loadAllUsers();
        if (currentUser && currentUser.id === userId) {
          const profile = await res.json();
          setCurrentUser(profile);
        }
      }
    } catch (err) {
      console.error('Failed to update specific user:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setAllUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        login,
        register,
        logout,
        resetPassword,
        updateUser,
        updateSpecificUser,
        loadAllUsers,
        deleteUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
