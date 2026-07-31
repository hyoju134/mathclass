"use client";

import Link from "next/link";
import { Calculator, LogIn, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-emerald-100/50 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative">
        {/* 로고 영역 */}
        <Link href="/" className="flex items-center gap-2 text-emerald-600 font-semibold text-xl tracking-tight z-10 hover:opacity-90 transition-opacity">
          <Calculator className="w-6 h-6" />
          <span>효주T의 수학교실</span>
        </Link>
        
        {/* 네비게이션 공간 (중앙 정렬) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 absolute left-1/2 -translate-x-1/2">
          <Link href="/quiz" className="hover:text-emerald-600 transition-colors font-semibold text-emerald-600 flex items-center gap-1">퀴즈</Link>
          <Link href="/grade1" className="hover:text-emerald-600 transition-colors">중1</Link>
          <Link href="/grade2" className="hover:text-emerald-600 transition-colors">중2</Link>
          <Link href="/grade3" className="hover:text-emerald-600 transition-colors">중3</Link>
          <Link href="/questions" className="hover:text-emerald-600 transition-colors">질문게시판</Link>
        </nav>

        {/* 로그인 / 계정 상태 영역 */}
        <div className="flex items-center gap-3 z-10">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 hover:bg-emerald-200/80 text-xs font-bold rounded-full transition-all shadow-2xs"
                  title="관리자 센터로 이동"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>효주T(관리자)</span>
                </Link>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user.name} ({user.studentId})</span>
                </span>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-emerald-700 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
