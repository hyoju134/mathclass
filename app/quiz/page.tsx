"use client";

import { useState, useEffect, useRef } from "react";
import { Trophy, Zap, Timer, RotateCcw, Medal, Award, Play, Lock, LogIn, Sparkles, Brain, Gamepad2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { saveQuizScore, getLeaderboard, QuizScoreRecord } from "@/lib/supabase";
import Link from "next/link";

interface Problem {
  num1: number;
  num2: number;
  operator: "+" | "-" | "×";
  answer: number;
}

export default function QuizPage() {
  const { user } = useAuth();

  // 선택된 퀴즈 모드 ("hub": 메뉴선택, "mental": 단순 암산 퀴즈)
  const [selectedGame, setSelectedGame] = useState<"hub" | "mental">("hub");

  // 게임 상태
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");

  // 문제 & 점수 상태
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  // 리더보드 데이터
  const [leaderboard, setLeaderboard] = useState<QuizScoreRecord[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 사용자 로그인 시 정보 자동 세팅
  useEffect(() => {
    if (user) {
      setStudentId(user.studentId || user.id);
      setName(user.name);
    }
  }, [user]);

  // 리더보드 로드
  const fetchLeaderboardData = async () => {
    setIsLoadingLeaderboard(true);
    const data = await getLeaderboard();
    setLeaderboard(data);
    setIsLoadingLeaderboard(false);
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // 10개의 무작위 암산 문제 생성
  const generateProblems = (): Problem[] => {
    const list: Problem[] = [];
    const ops: ("+" | "-" | "×")[] = ["+", "-", "×"];

    for (let i = 0; i < 10; i++) {
      const op = ops[Math.floor(Math.random() * ops.length)];
      let n1 = 0;
      let n2 = 0;
      let ans = 0;

      if (op === "+") {
        n1 = Math.floor(Math.random() * 40) + 5;
        n2 = Math.floor(Math.random() * 40) + 5;
        ans = n1 + n2;
      } else if (op === "-") {
        n1 = Math.floor(Math.random() * 50) + 10;
        n2 = Math.floor(Math.random() * n1);
        ans = n1 - n2;
      } else {
        n1 = Math.floor(Math.random() * 12) + 2;
        n2 = Math.floor(Math.random() * 9) + 2;
        ans = n1 * n2;
      }

      list.push({ num1: n1, num2: n2, operator: op, answer: ans });
    }
    return list;
  };

  // 게임 시작
  const handleStartGame = () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    const newProblems = generateProblems();
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(30);
    setUserAnswer("");
    setGameState("playing");

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          finishGame(score, correctCount);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 정답 제출
  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || gameState !== "playing") return;

    const currentP = problems[currentProblemIndex];
    const isCorrect = parseInt(userAnswer.trim(), 10) === currentP.answer;

    let newScore = score;
    let newCorrect = correctCount;

    if (isCorrect) {
      newScore += 100 + timeLeft * 2;
      newCorrect += 1;
    }

    setScore(newScore);
    setCorrectCount(newCorrect);
    setUserAnswer("");

    if (currentProblemIndex + 1 < problems.length) {
      setCurrentProblemIndex((prev) => prev + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      finishGame(newScore, newCorrect);
    }
  };

  // 게임 종료
  const finishGame = async (finalScore: number, finalCorrect: number) => {
    setGameState("finished");

    const record: QuizScoreRecord = {
      student_id: studentId.trim() || user?.studentId || user?.id || "학생",
      name: name.trim() || user?.name || "학생",
      score: finalScore,
      correct_count: finalCorrect,
      total_questions: problems.length || 10,
    };

    await saveQuizScore(record);
    await fetchLeaderboardData();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* 헤더 섹션 */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-full">
          <Gamepad2 className="w-4 h-4 text-emerald-600" />
          수학 퀴즈 센터
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          재미있는 <span className="text-emerald-600">수학 퀴즈</span> 🎮
        </h1>
        <p className="text-gray-500 font-medium text-sm md:text-base">
          로그인 후 원하는 퀴즈 게임을 선택하여 실력을 겨뤄보세요!
        </p>
      </div>

      {/* 퀴즈 메뉴 허브 (메인 퀴즈 선택 화면) */}
      {selectedGame === "hub" && (
        <div className="space-y-12">
          {/* 게임 선택 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. 단순 암산 퀴즈 카드 */}
            <div
              onClick={() => setSelectedGame("mental")}
              className="group bg-white/80 backdrop-blur-md border border-emerald-200 hover:border-emerald-500 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                  <Zap className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">인기 퀴즈</span>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    단순 암산 퀴즈
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  30초 동안 덧셈, 뺄셈, 곱셈 문제를 번개처럼 풀어 스피드 왕에 도전하세요!
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-bold text-emerald-600">
                <span>게임 시작하기</span>
                <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. 구구단 스피드 챌린지 (예정) */}
            <div className="bg-white/40 backdrop-blur-sm border border-gray-200/60 p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6 opacity-75">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">오픈 예정</span>
                  <h3 className="text-2xl font-bold text-gray-900">구구단 왕중왕전</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  랜덤으로 출제되는 구구단을 거침없이 맞히는 신나는 단원 퀴즈입니다.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs font-bold text-gray-400">
                Coming Soon
              </div>
            </div>

            {/* 3. 도형 & 방정식을 맞혀라 (예정) */}
            <div className="bg-white/40 backdrop-blur-sm border border-gray-200/60 p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6 opacity-75">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center font-bold">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-cyan-600 uppercase tracking-wider">오픈 예정</span>
                  <h3 className="text-2xl font-bold text-gray-900">도형 & 방정식 퀴즈</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  중학교 개념의 일차방정식과 기본 도형의 성질을 퍼즐처럼 푸는 퀴즈입니다.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs font-bold text-gray-400">
                Coming Soon
              </div>
            </div>
          </div>

          {/* 하단 전교 랭킹 리더보드 */}
          <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-gray-900">전교 랭킹 리더보드</h2>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Supabase DB 연동
              </span>
            </div>

            {isLoadingLeaderboard ? (
              <div className="py-12 text-center text-sm text-gray-400">랭킹 데이터를 불러오는 중입니다...</div>
            ) : leaderboard.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">아직 등록된 랭킹 기록이 없습니다. 첫 번째 주인공이 되어보세요!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center text-xs font-black rounded-full">
                        {index === 0 ? (
                          <Medal className="w-7 h-7 text-amber-500" />
                        ) : index === 1 ? (
                          <Medal className="w-6 h-6 text-slate-400" />
                        ) : index === 2 ? (
                          <Medal className="w-6 h-6 text-amber-700" />
                        ) : (
                          <span className="text-gray-400 font-bold text-sm">{index + 1}</span>
                        )}
                      </span>

                      <div>
                        {/* 요청사항: 이름(학번) 포맷 적용 */}
                        <div className="text-base font-extrabold text-gray-900">
                          {item.name}({item.student_id})
                        </div>
                        <div className="text-xs text-gray-400">
                          맞힌 문제: {item.correct_count}개
                        </div>
                      </div>
                    </div>

                    <div className="text-lg font-black text-emerald-600">
                      {item.score}점
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 단순 암산 퀴즈 플레이 화면 */}
      {selectedGame === "mental" && (
        <div className="space-y-6">
          <button
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              setGameState("idle");
              setSelectedGame("hub");
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>퀴즈 메뉴로 돌아가기</span>
          </button>

          {/* 로그인 필수 안치 카드 */}
          {!user ? (
            <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-12 rounded-3xl shadow-sm text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-gray-900">로그인이 필요한 서비스입니다</h2>
                <p className="text-xs text-gray-500">
                  암산 퀴즈 참여 및 전교 랭킹 등록을 위해 먼저 학생 또는 관리자 계정으로 로그인해주세요.
                </p>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인 하러 가기</span>
              </Link>
            </div>
          ) : (
            /* 로그인된 경우 퀴즈 실행 */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 퀴즈 게임 박스 */}
              <div className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
                {gameState === "idle" && (
                  <div className="space-y-6 text-center py-6">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                      <Zap className="w-10 h-10 fill-current" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-3xl font-extrabold text-gray-900">단순 암산 퀴즈</h2>
                      <p className="text-xs text-gray-500">
                        선수 정보: <span className="font-bold text-gray-800">{user.name}({user.studentId || user.id})</span>
                      </p>
                    </div>

                    <button
                      onClick={handleStartGame}
                      className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-base"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>퀴즈 게임 시작!</span>
                    </button>
                  </div>
                )}

                {gameState === "playing" && (
                  <div className="space-y-8 py-2">
                    <div className="flex items-center justify-between bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                        <Timer className="w-5 h-5 animate-pulse text-emerald-600" />
                        <span>남은 시간: {timeLeft}초</span>
                      </div>
                      <div className="text-xs font-bold text-gray-500">
                        문제 <span className="text-emerald-600 font-extrabold text-base">{currentProblemIndex + 1}</span> / 10
                      </div>
                      <div className="font-extrabold text-emerald-600 text-lg">
                        {score}점
                      </div>
                    </div>

                    {problems[currentProblemIndex] && (
                      <div className="text-center space-y-6 py-4">
                        <div className="text-5xl font-black text-gray-900 tracking-wider">
                          {problems[currentProblemIndex].num1} {problems[currentProblemIndex].operator} {problems[currentProblemIndex].num2} = ?
                        </div>

                        <form onSubmit={handleAnswerSubmit} className="space-y-4 max-w-xs mx-auto">
                          <input
                            type="number"
                            autoFocus
                            placeholder="정답 입력 후 엔터"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="w-full text-center text-3xl font-bold px-4 py-4 bg-gray-50 border-2 border-emerald-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                          />
                          <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-bold hover:bg-gray-800 transition-colors text-sm"
                          >
                            정답 제출 (Enter)
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {gameState === "finished" && (
                  <div className="space-y-6 text-center py-6">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                      <Award className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-gray-900">도전 완료! 🎉</h2>
                      <p className="text-sm text-gray-500">
                        {user.name}({user.studentId || user.id}) 님의 최종 랭킹 점수입니다.
                      </p>
                    </div>

                    <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 max-w-sm mx-auto">
                      <div className="text-xs font-semibold text-emerald-800">최종 획득 점수</div>
                      <div className="text-5xl font-black text-emerald-600">{score}점</div>
                      <div className="text-xs text-gray-500 pt-2">
                        정답 수: <span className="font-bold text-gray-900">{correctCount}문제</span> / 10문제
                      </div>
                    </div>

                    <button
                      onClick={handleStartGame}
                      className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>다시 도전하기</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 오른쪽 리더보드 */}
              <div className="lg:col-span-5 bg-white/80 backdrop-blur-md border border-emerald-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-bold text-gray-900">전교 랭킹</h2>
                  </div>
                </div>

                {isLoadingLeaderboard ? (
                  <div className="py-12 text-center text-sm text-gray-400">랭킹 불러오는 중...</div>
                ) : leaderboard.length === 0 ? (
                  <div className="py-12 text-center text-sm text-gray-400">등록된 기록이 없습니다.</div>
                ) : (
                  <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                    {leaderboard.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          index === 0
                            ? "bg-amber-50/70 border-amber-200 text-amber-950 font-bold"
                            : index === 1
                            ? "bg-slate-50 border-slate-200 text-slate-900 font-semibold"
                            : index === 2
                            ? "bg-orange-50/40 border-orange-200 text-orange-950 font-semibold"
                            : "bg-gray-50/50 border-gray-100 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 flex items-center justify-center text-xs font-black rounded-full">
                            {index === 0 ? (
                              <Medal className="w-6 h-6 text-amber-500" />
                            ) : index === 1 ? (
                              <Medal className="w-5 h-5 text-slate-400" />
                            ) : index === 2 ? (
                              <Medal className="w-5 h-5 text-amber-700" />
                            ) : (
                              <span className="text-gray-400 font-bold">{index + 1}</span>
                            )}
                          </span>

                          <div>
                            {/* 이름(학번) 포맷 */}
                            <div className="text-sm font-bold text-gray-900">
                              {item.name}({item.student_id})
                            </div>
                            <div className="text-[11px] text-gray-400">
                              맞힌 문제: {item.correct_count}개
                            </div>
                          </div>
                        </div>

                        <div className="text-base font-black text-emerald-600">
                          {item.score}점
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
