"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Medal, Zap, Gamepad2, ChevronRight } from "lucide-react";
import { getLeaderboard, QuizScoreRecord } from "@/lib/supabase";

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<QuizScoreRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      setIsLoading(true);
      const data = await getLeaderboard();
      // 상위 1~5위까지만 추출
      setLeaderboard(data.slice(0, 5));
      setIsLoading(false);
    }
    loadRankings();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-16 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      
      {/* 1. 타이틀 영역: '함께하는 수학교실' 메인 헤딩 */}
      <div className="space-y-4 max-w-2xl pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-full">
          <Zap className="w-4 h-4 text-emerald-600" />
          효주T의 수학 학습 플랫폼
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 leading-tight">
          함께하는 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            수학교실
          </span>
        </h1>
        
        <div className="pt-6">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:scale-105 transition-all text-base"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>수학 퀴즈 도전하러 가기</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
      
      {/* 2. 전교 퀴즈 랭킹 TOP 1~5순위 대시보드 */}
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-emerald-100/80 p-8 rounded-3xl shadow-sm text-left space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-extrabold text-gray-900">전교 퀴즈 랭킹 Top 1~5</h2>
          </div>
          <Link href="/quiz" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
            전체 퀴즈 보기 & 랭킹 등록
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-sm text-gray-400">실시간 랭킹을 불러오는 중...</div>
        ) : leaderboard.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            아직 등록된 랭킹 기록이 없습니다. 퀴즈를 풀고 1위의 영예를 차지해보세요!
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  index === 0
                    ? "bg-amber-50/80 border-amber-300 text-amber-950 font-bold shadow-sm"
                    : index === 1
                    ? "bg-slate-50 border-slate-200 text-slate-900 font-semibold"
                    : index === 2
                    ? "bg-orange-50/50 border-orange-200 text-orange-950 font-semibold"
                    : "bg-gray-50/50 border-gray-100 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* 순위 마크 */}
                  <span className="w-8 h-8 flex items-center justify-center text-xs font-black rounded-full">
                    {index === 0 ? (
                      <Medal className="w-7 h-7 text-amber-500" />
                    ) : index === 1 ? (
                      <Medal className="w-6 h-6 text-slate-400" />
                    ) : index === 2 ? (
                      <Medal className="w-6 h-6 text-amber-700" />
                    ) : (
                      <span className="text-gray-400 font-bold text-base">{index + 1}위</span>
                    )}
                  </span>

                  {/* 이름(학번) 포맷 */}
                  <div>
                    <div className="text-base font-extrabold text-gray-900">
                      {item.name}({item.student_id})
                    </div>
                    <div className="text-xs text-gray-400">
                      정답 개수: {item.correct_count}문제 성공
                    </div>
                  </div>
                </div>

                <div className="text-xl font-black text-emerald-600">
                  {item.score}점
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
