"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string; // 학번 또는 admin id ('gywn1340')
  name: string;
  role: "admin" | "student";
  studentId?: string;
}

export interface StudentAccount {
  studentId: string;
  name: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  students: StudentAccount[];
  login: (id: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  addStudent: (student: StudentAccount) => void;
  deleteStudent: (studentId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 기본 초기 학생 목록 데이터
const DEFAULT_STUDENTS: StudentAccount[] = [
  { studentId: "20315", name: "김수학", password: "1234" },
  { studentId: "30102", name: "이피타고라스", password: "1234" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<StudentAccount[]>(DEFAULT_STUDENTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // LocalStorage 불러오기
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("mathclass_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedStudents = localStorage.getItem("mathclass_students");
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      }
    } catch (e) {
      console.error("Failed to load auth state", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 로그인 핸들러
  const login = (id: string, password: string): { success: boolean; message: string } => {
    const trimmedId = id.trim();
    const trimmedPw = password.trim();

    // 1. 관리자 로그인 확인 (아이디: gywn1340, 비번: jamong1013!)
    if (trimmedId === "gywn1340" && trimmedPw === "jamong1013!") {
      const adminUser: User = {
        id: "gywn1340",
        name: "효주T (관리자)",
        role: "admin",
      };
      setUser(adminUser);
      localStorage.setItem("mathclass_user", JSON.stringify(adminUser));
      return { success: true, message: "관리자로 로그인되었습니다." };
    }

    // 2. 학생 로그인 확인 (등록된 학번 & 비밀번호)
    const foundStudent = students.find((s) => s.studentId === trimmedId);
    if (foundStudent) {
      if (foundStudent.password === trimmedPw) {
        const studentUser: User = {
          id: foundStudent.studentId,
          name: foundStudent.name,
          role: "student",
          studentId: foundStudent.studentId,
        };
        setUser(studentUser);
        localStorage.setItem("mathclass_user", JSON.stringify(studentUser));
        return { success: true, message: `${foundStudent.name} 학생으로 로그인되었습니다.` };
      } else {
        return { success: false, message: "비밀번호가 올바르지 않습니다." };
      }
    }

    return {
      success: false,
      message: "등록되지 않은 계정입니다. (관리자인 경우 아이디/비번을 확인하시고, 학생인 경우 선생님께 계정 등록을 요청하세요.)",
    };
  };

  // 로그아웃 핸들러
  const logout = () => {
    setUser(null);
    localStorage.removeItem("mathclass_user");
  };

  // 학생 등록
  const addStudent = (newStudent: StudentAccount) => {
    const updated = [...students.filter((s) => s.studentId !== newStudent.studentId), newStudent];
    setStudents(updated);
    localStorage.setItem("mathclass_students", JSON.stringify(updated));
  };

  // 학생 삭제
  const deleteStudent = (studentId: string) => {
    const updated = students.filter((s) => s.studentId !== studentId);
    setStudents(updated);
    localStorage.setItem("mathclass_students", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, students, login, logout, addStudent, deleteStudent }}>
      {isLoaded ? children : <div className="min-h-screen bg-emerald-50/30" />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
