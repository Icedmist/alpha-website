import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';

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
  getAuthHeaders: () => Promise<Record<string, string>>;
  adminCreateUser: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'student' | 'instructor' | 'admin'
  ) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    if (!auth.currentUser) return {};
    const token = await auth.currentUser.getIdToken();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const loadProfile = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/user/profile', { headers });
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
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/users', { headers });
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch all users:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        await loadProfile();
      } else {
        setCurrentUser(null);
        setAllUsers([]);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle loading the profile, but we can load it here to return it immediately
      const headers = await getAuthHeaders();
      const res = await fetch('/api/user/profile', { headers });
      if (!res.ok) {
        throw new Error('Failed to load user profile');
      }

      const profile = await res.json();
      setCurrentUser(profile);

      if (profile.role === 'admin' || profile.role === 'instructor') {
        await loadAllUsers();
      }
      return profile;
    } catch (error: any) {
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'student' | 'instructor' | 'admin' = 'student'
  ): Promise<User> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      const headers = await getAuthHeaders();
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers,
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
    } catch (error: any) {
      throw new Error(error.message || 'Email already registered');
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setAllUsers([]);
  };

  const resetPassword = async (email: string): Promise<string> => {
    return 'A password reset link has been simulated. Please check your inbox (simulated email sent successfully).';
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers,
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
      const headers = await getAuthHeaders();
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers,
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
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers,
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

  const adminCreateUser = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: 'student' | 'instructor' | 'admin'
  ): Promise<User> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const data = await res.json();
      await loadAllUsers();
      return data.user;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create user');
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
        getAuthHeaders,
        adminCreateUser,
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
