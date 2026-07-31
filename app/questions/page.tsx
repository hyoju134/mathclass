"use client";

import { useState } from "react";
import { Lock, Unlock, Send, MessageSquare, ShieldAlert, CheckCircle2 } from "lucide-react";

interface Question {
  id: number;
  studentId: string; // 학번
  name: string;      // 이름
  title: string;
  content: string;
  isPrivate: boolean; // 비공개 여부
  createdAt: string;
}

export default function QuestionsPage() {
  // 초기 더미 질문 데이터
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      studentId: "20315",
      name: "김수학",
      title: "일차방정식 개념이 너무 헷갈려요 ㅠㅠ",
      content: "X값을 구할 때 양변에 같은 수를 더하는 원리가 잘 이해가 안 가는데 다시 설명해주실 수 있나요?",
      isPrivate: false,
      createdAt: "2026.07.31 14:20",
    },
    {
      id: 2,
      studentId: "30102",
      name: "이피타고라스",
      title: "선생님 2학기 수행평가 관련 질문입니다.",
      content: "비공개 질문 내용입니다. 선생님만 확인하실 수 있습니다.",
      isPrivate: true,
      createdAt: "2026.07.31 11:05",
    },
  ]);

  // 폼 입력 상태
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // 질문 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId.trim() || !name.trim()) {
      alert("학번과 이름을 반드시 입력해주세요.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("질문 제목과 내용을 입력해주세요.");
      return;
    }

    const newQuestion: Question = {
      id: Date.now(),
      studentId: studentId.trim(),
      name: name.trim(),
      title: title.trim(),
      content: content.trim(),
      isPrivate,
      createdAt: new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    setQuestions([newQuestion, ...questions]);
    
    // 폼 초기화 및 완료 안내
    setTitle("");
    setContent("");
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* 헤더 타이틀 섹션 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          효주T에게 <span className="text-emerald-600">질문하기</span>
        </h1>
        <p className="text-gray-500 font-medium">
          수학 문제나 개념 중 궁금한 점을 자유롭게 질문해 보세요! (학번과 이름 필수)
        </p>
      </div>

      {/* 질문 작성 폼 카드 */}
      <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">새 질문 작성</h2>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-medium animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>질문이 성공적으로 등록되었습니다! 선생님이 확인 후 답변해 드립니다.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 학번 & 이름 (필수 입력 항목) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                학번 <span className="text-emerald-600">*</span>
              </label>
              <input
                type="text"
                placeholder="예: 20315 (2학년 3반 15번)"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                이름 <span className="text-emerald-600">*</span>
              </label>
              <input
                type="text"
                placeholder="예: 홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* 질문 제목 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              질문 제목 <span className="text-emerald-600">*</span>
            </label>
            <input
              type="text"
              placeholder="질문의 요약을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          {/* 질문 내용 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              질문 내용 <span className="text-emerald-600">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="궁금한 단원, 문제 번호, 이해가 안 가는 내용을 자세히 적어주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm resize-none"
            />
          </div>

          {/* 공개 / 비공개 설정 (라디오 버튼) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">공개 설정</label>
            <div className="flex gap-4">
              <label
                className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-2xl border cursor-pointer transition-all text-sm font-medium ${
                  !isPrivate
                    ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 font-semibold"
                    : "border-gray-200 bg-gray-50/30 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                  className="sr-only"
                />
                <Unlock className="w-4 h-4 text-emerald-600" />
                <span>공개 질문 (모두 볼 수 있음)</span>
              </label>

              <label
                className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-2xl border cursor-pointer transition-all text-sm font-medium ${
                  isPrivate
                    ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 font-semibold"
                    : "border-gray-200 bg-gray-50/30 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                  className="sr-only"
                />
                <Lock className="w-4 h-4 text-gray-500" />
                <span>비공개 질문 (선생님만 봄)</span>
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-xl transition-all duration-200"
          >
            <Send className="w-4 h-4" />
            <span>질문 등록하기</span>
          </button>
        </form>
      </div>

      {/* 질문 목록 섹션 */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-900 px-2">등록된 질문 목록 ({questions.length})</h2>

        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white/70 backdrop-blur-md border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* 공개/비공개 뱃지 */}
                  {q.isPrivate ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      <Lock className="w-3 h-3" />
                      비공개
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      <Unlock className="w-3 h-3" />
                      공개
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 text-lg">
                    {q.isPrivate ? "비공개 질문입니다." : q.title}
                  </h3>
                </div>
                <span className="text-xs text-gray-400 font-medium">{q.createdAt}</span>
              </div>

              {/* 내용 */}
              <p className="text-sm text-gray-600 leading-relaxed pl-1">
                {q.isPrivate ? (
                  <span className="flex items-center gap-1 text-gray-400 italic">
                    <ShieldAlert className="w-4 h-4 text-gray-400" />
                    작성자와 선생님만 확인할 수 있는 비밀 질문입니다.
                  </span>
                ) : (
                  q.content
                )}
              </p>

              {/* 작성자 정보 */}
              <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>
                  작성자: {q.name.charAt(0)}*{q.name.slice(2)} ({q.studentId})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
