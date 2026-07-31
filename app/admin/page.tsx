"use client";

import { useState } from "react";
import { useAuth, StudentAccount } from "@/context/AuthContext";
import { ShieldCheck, FileSpreadsheet, Upload, CheckCircle2, Trash2, Users, MessageSquare, Trophy, BookOpen, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function AdminPage() {
  const { user, students, addStudent, addStudentsBulk, deleteStudent } = useAuth();
  const isAdmin = user?.role === "admin";

  const [activeTab, setActiveTab] = useState<"students" | "questions" | "quiz">("students");

  // 학생 등록 폼 상태
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [registerMode, setRegisterMode] = useState<"excel" | "paste" | "single">("excel");

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
    setAdminMessage(`학생 ${newAcc.name}(${newAcc.studentId}) 계정이 정상 등록되었습니다.`);
    setTimeout(() => setAdminMessage(""), 4000);
  };

  // 엑셀 업로드 처리
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

          if (sId.includes("학번") || sName.includes("이름") || (index === 0 && isNaN(Number(sId)))) {
            return;
          }

          if (sId && sName && sPw) {
            parsedStudents.push({ studentId: sId, name: sName, password: sPw });
          }
        });

        if (parsedStudents.length > 0) {
          const count = addStudentsBulk(parsedStudents);
          setAdminMessage(`엑셀 파일에서 총 ${count}명의 학생 계정이 일괄 세팅되었습니다! 🎉`);
        } else {
          setAdminMessage("엑셀 데이터 형식을 확인해 주세요. (1열: 학번, 2열: 이름, 3열: 비밀번호)");
        }
      } catch (err) {
        console.error(err);
        setAdminMessage("엑셀 파일 파싱 중 오류가 발생했습니다.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // 붙여넣기 등록
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
      setAdminMessage(`붙여넣은 목록에서 총 ${count}명의 학생 계정이 등록되었습니다! 🎉`);
    } else {
      setAdminMessage("올바른 형식(학번 [Tab] 이름 [Tab] 비밀번호)으로 붙여넣어 주세요.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto space-y-6 text-center py-16 animate-in fade-in">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">관리자 접근 권한 필요</h2>
          <p className="text-xs text-gray-500">효주T(관리자) 계정으로 로그인한 경우에만 이용할 수 있습니다.</p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl text-xs shadow-md hover:bg-emerald-700 transition-all"
        >
          관리자 로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* 타이틀 영역 */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors mb-1">
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            <h1 className="text-3xl font-black text-gray-900">효주T 통합 관리자 센터</h1>
          </div>
          <p className="text-xs text-gray-500">사이트 내 모든 계정 세팅, 질문 관리, 퀴즈 랭킹을 관제합니다.</p>
        </div>

        <span className="px-4 py-2 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full border border-emerald-300">
          접속 계정: 효주T(관리자)
        </span>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl max-w-xl">
        <button
          onClick={() => setActiveTab("students")}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "students" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>학생 계정 & 엑셀 등록</span>
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "questions" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>질문게시판 관리</span>
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "quiz" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>퀴즈 랭킹 관리</span>
        </button>
      </div>

      {/* [1] 학생 계정 및 엑셀 일괄 등록 */}
      {activeTab === "students" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 등록 폼 박스 */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">학생 계정 등록 / 엑셀 세팅</h2>
              </div>

              <div className="flex text-xs bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setRegisterMode("excel")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    registerMode === "excel" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"
                  }`}
                >
                  엑셀 파일
                </button>
                <button
                  onClick={() => setRegisterMode("paste")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    registerMode === "paste" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"
                  }`}
                >
                  복사-붙여넣기
                </button>
                <button
                  onClick={() => setRegisterMode("single")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    registerMode === "single" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"
                  }`}
                >
                  개별 등록
                </button>
              </div>
            </div>

            {adminMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{adminMessage}</span>
              </div>
            )}

            {registerMode === "excel" && (
              <div className="space-y-4 bg-emerald-50/40 p-6 rounded-2xl border border-emerald-100 text-left">
                <label className="block text-xs font-bold text-gray-700">엑셀 파일(.xlsx, .csv) 일괄 업로드</label>
                <label className="flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-emerald-300 rounded-2xl cursor-pointer bg-white hover:bg-emerald-50/50 transition-colors text-xs font-bold text-emerald-700">
                  <Upload className="w-6 h-6 text-emerald-600" />
                  <span>클릭하여 학생 목록 엑셀 파일 선택</span>
                  <span className="text-[11px] text-gray-400 font-normal">A열: 학번 / B열: 이름 / C열: 비밀번호</span>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            )}

            {registerMode === "paste" && (
              <form onSubmit={handlePasteRegister} className="space-y-4 bg-emerald-50/40 p-6 rounded-2xl border border-emerald-100 text-left">
                <label className="block text-xs font-bold text-gray-700">엑셀 내용 직접 복사-붙여넣기</label>
                <textarea
                  rows={5}
                  placeholder={`엑셀 테이블 영역을 그대로 복사해 오세요.\n예시:\n20315\t김효주\t1234\n20316\t이수학\t5678`}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  붙여넣은 목록 일괄 세팅하기
                </button>
              </form>
            )}

            {registerMode === "single" && (
              <form onSubmit={handleAddStudent} className="space-y-4 bg-emerald-50/40 p-6 rounded-2xl border border-emerald-100 text-left">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">학번</label>
                    <input
                      type="text"
                      placeholder="예: 20315"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">이름</label>
                    <input
                      type="text"
                      placeholder="예: 김효주"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">비밀번호</label>
                    <input
                      type="text"
                      placeholder="초기 비번"
                      value={newStudentPassword}
                      onChange={(e) => setNewStudentPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  학생 계정 추가하기
                </button>
              </form>
            )}
          </div>

          {/* 현재 세팅된 학생 목록 현황 */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">등록된 학생 목록 ({students.length}명)</h3>
              <span className="text-[11px] text-gray-400">학번 / 이름 / 비번</span>
            </div>

            <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">
              {students.map((s) => (
                <div key={s.studentId} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-2xl text-xs border border-gray-100 hover:border-emerald-200 transition-all">
                  <div>
                    <span className="font-extrabold text-gray-900">{s.name}</span>
                    <span className="text-gray-400 text-[11px] ml-1">({s.studentId})</span>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">PW: {s.password}</div>
                  </div>
                  <button
                    onClick={() => deleteStudent(s.studentId)}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                    title="학생 계정 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* [2] 질문게시판 관리 */}
      {activeTab === "questions" && (
        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6 text-center py-12">
          <MessageSquare className="w-12 h-12 text-emerald-600 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">질문게시판 관리</h2>
            <p className="text-xs text-gray-500">질문게시판으로 이동하여 모든 공개/비공개 질문을 열람하고 삭제할 수 있습니다.</p>
          </div>
          <Link
            href="/questions"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl text-xs shadow-md hover:bg-emerald-700 transition-all"
          >
            질문게시판 바로가기
          </Link>
        </div>
      )}

      {/* [3] 퀴즈 랭킹 관리 */}
      {activeTab === "quiz" && (
        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6 text-center py-12">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">퀴즈 랭킹 대시보드</h2>
            <p className="text-xs text-gray-500">4대 수학 퀴즈에 참여한 학생들의 점수 현황 및 순위를 확인합니다.</p>
          </div>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl text-xs shadow-md hover:bg-emerald-700 transition-all"
          >
            퀴즈 랭킹 보러가기
          </Link>
        </div>
      )}
    </div>
  );
}
