"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, StudentAccount } from "@/context/AuthContext";
import { ShieldCheck, UserCheck, KeyRound, UserPlus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, login, students, addStudent, deleteStudent } = useAuth();
  const router = useRouter();

  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 관리자 전용: 학생 등록 폼 상태
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!id.trim() || !password.trim()) {
      setErrorMessage("아이디/학번과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    const result = login(id, password);
    if (result.success) {
      router.push("/questions");
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId.trim() || !newStudentName.trim() || !newStudentPassword.trim()) {
      setAdminMessage("학번, 이름, 비밀번호를 모두 입력해 주세요.");
      return;
    }

    const newAcc: StudentAccount = {
      studentId: newStudentId.trim(),
      name: newStudentName.trim(),
      password: newStudentPassword.trim(),
    };

    addStudent(newAcc);
    setNewStudentId("");
    setNewStudentName("");
    setNewStudentPassword("");
    setAdminMessage(`학생 ${newAcc.name}(${newAcc.studentId}) 계정이 등록/업데이트되었습니다.`);
    setTimeout(() => setAdminMessage(""), 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>
      </div>

      {/* 이미 로그인되어 있는 경우 */}
      {user ? (
        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            {user.role === "admin" ? <ShieldCheck className="w-8 h-8" /> : <UserCheck className="w-8 h-8" />}
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              현재 <span className="text-emerald-600">{user.name}</span> 님으로 로그인되어 있습니다.
            </h2>
            <p className="text-sm text-gray-500">
              {user.role === "admin" ? "관리자 권한으로 모든 질문을 확인 및 삭제할 수 있습니다." : `학번: ${user.studentId}`}
            </p>
          </div>

          {/* 관리자인 경우 학생 계정 관리 패널 제공 */}
          {user.role === "admin" && (
            <div className="pt-6 border-t border-gray-100 text-left space-y-6">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-gray-900">학생 계정 설정 및 등록</h3>
              </div>

              {adminMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold">
                  {adminMessage}
                </div>
              )}

              <form onSubmit={handleAddStudent} className="space-y-3 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="학번 (예: 20315)"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="이름 (예: 김효주)"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="비밀번호 설정"
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  학생 계정 추가 / 비밀번호 저장
                </button>
              </form>

              {/* 등록된 학생 목록 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700">등록된 학생 목록 ({students.length}명)</h4>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {students.map((s) => (
                    <div key={s.studentId} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs border border-gray-100">
                      <div>
                        <span className="font-bold text-gray-900">{s.name}</span> ({s.studentId}) - <span className="text-gray-500">PW: {s.password}</span>
                      </div>
                      <button
                        onClick={() => deleteStudent(s.studentId)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="학생 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <Link
              href="/questions"
              className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-2xl text-sm hover:bg-emerald-700 transition-colors shadow-sm"
            >
              질문게시판으로 이동
            </Link>
          </div>
        </div>
      ) : (
        /* 로그인 폼 카드 */
        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">수학교실 로그인</h1>
            <p className="text-xs text-gray-500">학생은 부여된 학번, 관리자는 전용 계정으로 로그인하세요.</p>
          </div>

          {/* 학생 / 관리자 탭 구별 */}
          <div className="flex p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setLoginType("student");
                setErrorMessage("");
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                loginType === "student" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              학생 로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType("admin");
                setErrorMessage("");
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                loginType === "admin" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              관리자 로그인
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                {loginType === "student" ? "학번" : "관리자 아이디"}
              </label>
              <input
                type="text"
                placeholder={loginType === "student" ? "학번을 입력하세요 (예: 20315)" : "관리자 아이디 입력"}
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-2xl font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>로그인하기</span>
            </button>
          </form>

          {loginType === "student" && (
            <div className="text-center pt-2">
              <p className="text-xs text-gray-400">
                * 초깃값 테스트 학생 계정: 학번 <span className="font-semibold text-gray-600">20315</span> / 비번 <span className="font-semibold text-gray-600">1234</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
