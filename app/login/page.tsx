"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, StudentAccount } from "@/context/AuthContext";
import { ShieldCheck, UserCheck, KeyRound, UserPlus, Trash2, ArrowLeft, FileSpreadsheet, Upload, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function LoginPage() {
  const { user, login, students, addStudent, addStudentsBulk, deleteStudent } = useAuth();
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

  // 엑셀 붙여넣기 텍스트 폼 상태
  const [pasteText, setPasteText] = useState("");
  const [activeTab, setActiveTab] = useState<"single" | "excel">("excel");

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

  // 단일 학생 추가
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
    setAdminMessage(`학생 ${newAcc.name}(${newAcc.studentId}) 계정이 등록되었습니다.`);
    setTimeout(() => setAdminMessage(""), 4000);
  };

  // 엑셀 (.xlsx, .csv) 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws, { header: 1 });

        const parsedStudents: StudentAccount[] = [];

        data.forEach((row: any, index: number) => {
          if (!row || row.length < 3) return;
          const sId = String(row[0]).trim();
          const sName = String(row[1]).trim();
          const sPw = String(row[2]).trim();

          // 헤더 행 무시 (예: 학번, 이름, 비밀번호)
          if (sId.includes("학번") || sName.includes("이름") || index === 0 && isNaN(Number(sId))) {
            return;
          }

          if (sId && sName && sPw) {
            parsedStudents.push({ studentId: sId, name: sName, password: sPw });
          }
        });

        if (parsedStudents.length > 0) {
          const count = addStudentsBulk(parsedStudents);
          setAdminMessage(`엑셀 파일에서 총 ${count}명의 학생 계정이 일괄 등록되었습니다! 🎉`);
        } else {
          setAdminMessage("엑셀 데이터 형식을 확인해 주세요. (1열: 학번, 2열: 이름, 3열: 비밀번호)");
        }
      } catch (err) {
        console.error(err);
        setAdminMessage("엑셀 파일 읽기 오류가 발생했습니다.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // 엑셀 복사-붙여넣기 텍스트 파싱
  const handlePasteRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteText.trim()) return;

    const lines = pasteText.split("\n");
    const parsedStudents: StudentAccount[] = [];

    lines.forEach((line) => {
      const parts = line.split(/[\t,]+/).map((p) => p.trim());
      if (parts.length >= 3) {
        const sId = parts[0];
        const sName = parts[1];
        const sPw = parts[2];
        if (sId && sName && sPw && !sId.includes("학번")) {
          parsedStudents.push({ studentId: sId, name: sName, password: sPw });
        }
      }
    });

    if (parsedStudents.length > 0) {
      const count = addStudentsBulk(parsedStudents);
      setPasteText("");
      setAdminMessage(`붙여넣기 텍스트에서 총 ${count}명의 학생 계정이 추가되었습니다! 🎉`);
    } else {
      setAdminMessage("올바른 포맷(학번 [Tab] 이름 [Tab] 비밀번호)으로 붙여넣어 주세요.");
    }
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
        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              {user.role === "admin" ? <ShieldCheck className="w-8 h-8" /> : <UserCheck className="w-8 h-8" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              현재 <span className="text-emerald-600">{user.name}</span> 님으로 로그인되어 있습니다.
            </h2>
          </div>

          {/* 관리자인 경우 엑셀 일괄 등록 / 학생 관리 패널 제공 */}
          {user.role === "admin" && (
            <div className="pt-6 border-t border-gray-100 text-left space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-900">학생 계정 엑셀 일괄 세팅</h3>
                </div>
                <div className="flex text-xs bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab("excel")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === "excel" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    엑셀 일괄 업로드
                  </button>
                  <button
                    onClick={() => setActiveTab("single")}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      activeTab === "single" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    직접 입력
                  </button>
                </div>
              </div>

              {adminMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{adminMessage}</span>
                </div>
              )}

              {activeTab === "excel" ? (
                <div className="space-y-4 bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100">
                  {/* 1. 엑셀 파일 직접 업로드 버튼 */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">방법 1: 엑셀 파일(.xlsx, .csv) 업로드</label>
                    <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-emerald-300 rounded-2xl cursor-pointer bg-white hover:bg-emerald-50/50 transition-colors text-xs font-bold text-emerald-700">
                      <Upload className="w-4 h-4" />
                      <span>클릭하여 엑셀(.xlsx / .csv) 파일 선택</span>
                      <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="text-[11px] text-gray-400">
                      * 엑셀 양식: A열(학번), B열(이름), C열(비밀번호) 순서대로 작성
                    </p>
                  </div>

                  <div className="relative border-t border-emerald-100 my-2">
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-emerald-50 px-2 text-[10px] text-gray-400 font-bold">OR</span>
                  </div>

                  {/* 2. 엑셀 복사 붙여넣기 영역 */}
                  <form onSubmit={handlePasteRegister} className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">방법 2: 엑셀 내용 복사-붙여넣기</label>
                    <textarea
                      rows={3}
                      placeholder={`엑셀에서 [학번 이름 비밀번호] 영역을 복사해서 붙여넣으세요.\n예시:\n20315\t김효주\t1234\n20316\t이수학\t5678`}
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      붙여넣은 학생 목록 일괄 등록
                    </button>
                  </form>
                </div>
              ) : (
                /* 개별 등록 폼 */
                <form onSubmit={handleAddStudent} className="space-y-3 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="학번 (20315)"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="이름 (김효주)"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="비밀번호"
                      value={newStudentPassword}
                      onChange={(e) => setNewStudentPassword(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    학생 계정 추가
                  </button>
                </form>
              )}

              {/* 등록된 학생 목록 */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700">현재 등록된 학생 목록 ({students.length}명)</h4>
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
              href="/quiz"
              className="flex-1 py-3 bg-emerald-600 text-white font-semibold text-center rounded-2xl text-sm hover:bg-emerald-700 transition-colors shadow-sm"
            >
              퀴즈 창으로 이동
            </Link>
          </div>
        </div>
      ) : (
        /* 로그인 폼 카드 */
        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">수학교실 로그인</h1>
            <p className="text-xs text-gray-500">학생은 학번, 관리자는 전용 계정으로 로그인하세요.</p>
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
                placeholder={loginType === "student" ? "학번을 입력하세요 (예: 20315)" : "관리자 아이디 (효주T)"}
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

          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              * 관리자 아이디: <span className="font-semibold text-gray-600">효주T</span> / 비밀번호: <span className="font-semibold text-gray-600">jamong1013!</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
