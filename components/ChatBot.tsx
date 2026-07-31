"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Minimize2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕하세요! 👋 효주T 수학 AI 튜터입니다. 수학 개념이나 풀다가 막히는 문제가 있다면 무엇이든 편하게 물어보세요!",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: Message = { role: "user", content: query.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // API 전송용 메시지 데이터 (system 제외 role/content 구조)
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      const botReply: Message = {
        role: "assistant",
        content: data.reply || "답변을 가져오는 중 문제가 발생했습니다.",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "네트워크 연결 중 오류가 발생했습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sampleQuestions = [
    "💡 순환소수를 분수로 바꾸는 방법 알려줘!",
    "📐 피타고라스 정리가 뭐야?",
    "✏️ 일차방정식 푸는 순서 설명해줘",
  ];

  return (
    <>
      {/* 1. 우하단 플로팅 챗봇 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-emerald-700 hover:scale-105 transition-all duration-300 group"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
          </div>
          <span className="font-bold text-sm tracking-tight">효주T AI 튜터</span>
        </button>
      )}

      {/* 2. 애플 스타일 챗봇 대화창 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[420px] h-[580px] bg-white/90 backdrop-blur-xl border border-emerald-100/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* 챗봇 헤더 */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 px-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  효주T 수학 AI 튜터
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[11px] text-emerald-100">OpenAI GPT 기반 실시간 수학 질의응답</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* 메시지 출력 영역 */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-emerald-50/20 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white font-medium rounded-tr-none shadow-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                    {user?.name ? user.name.charAt(0) : "나"}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-gray-400">
                <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-100 p-3 rounded-2xl flex items-center gap-2 shadow-sm text-emerald-600 font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>효주T AI가 답변을 작성하는 중...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* 추천 질문 칩 (초기 질문 제안) */}
          {messages.length < 3 && !loading && (
            <div className="px-4 py-2 bg-emerald-50/40 border-t border-emerald-100/50 flex flex-wrap gap-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-[11px] bg-white border border-emerald-200 hover:border-emerald-500 text-emerald-800 px-2.5 py-1 rounded-full font-medium transition-colors shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 질문 입력 영역 */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <textarea
              rows={1}
              placeholder="수학 질문을 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-emerald-500 resize-none font-medium text-gray-800"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-emerald-600 disabled:bg-gray-300 text-white rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm hover:bg-emerald-700"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
