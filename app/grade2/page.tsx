"use client";

import { useState } from "react";
import { BookOpen, CheckCircle, ChevronRight, Layers, Lightbulb, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Unit {
  id: number;
  unitNumber: string;
  title: string;
  subUnits: string[];
  summary: string;
  activities: {
    name: string;
    type: "개념정리" | "문제풀이" | "활동지";
    desc: string;
    hasContent?: boolean; // 입력값 / 자료 존재 여부
  }[];
}

const VISANG_GRADE2_UNITS: Unit[] = [
  {
    id: 1,
    unitNumber: "Ⅰ",
    title: "수와 식의 계산",
    subUnits: ["1. 유리수와 순환소수", "2. 단항식과 다항식의 계산"],
    summary: "분수를 소수로 나타내어 순환소수의 성질을 이해하고, 지수법칙 및 식의 계산을 익힙니다.",
    activities: [
      { name: "순환소수의 분수 변환 탐구", type: "개념정리", desc: "순환마디를 찾아 분수로 바꾸는 수리 과정을 탐구합니다.", hasContent: false },
      { name: "지수법칙 마스터 훈련", type: "문제풀이", desc: "곱셈, 나눗셈, 거듭제곱의 지수 계산을 빠르게 숙달합니다.", hasContent: false },
      { name: "다항식의 덧셈과 뺄셈 훈련", type: "활동지", desc: "동류항끼리 모아 식을 단순화하는 시각적 훈련을 진행합니다.", hasContent: false },
    ],
  },
  {
    id: 2,
    unitNumber: "Ⅱ",
    title: "부등식과 연립방정식",
    subUnits: ["1. 일차부등식", "2. 연립일차방정식"],
    summary: "부등식의 성질을 활용해 일차부등식을 풀고, 미지수가 2개인 연립일차방정식을 해결합니다.",
    activities: [
      { name: "일차부등식 영역과 수직선 탐구", type: "개념정리", desc: "부등호의 방향이 바뀌는 조건을 수직선 상에서 확인합니다.", hasContent: false },
      { name: "가감법 vs 대입법 훈련", type: "문제풀이", desc: "연립방정식을 가장 효율적인 방법으로 해결해봅니다.", hasContent: false },
      { name: "실생활 연립방정식 활용 문제", type: "활동지", desc: "거리·속력·시간 문제와 농도 문제를 방정식으로 세워봅니다.", hasContent: false },
    ],
  },
  {
    id: 3,
    unitNumber: "Ⅲ",
    title: "일차함수",
    subUnits: ["1. 일차함수와 그 그래프", "2. 일차함수와 일차방정식의 관계"],
    summary: "일차함수의 기울기와 y절편의 의미를 이해하고, 일차방정식과 그래프의 관계를 파악합니다.",
    activities: [
      { name: "기울기와 y절편 시뮬레이터", type: "개념정리", desc: "a와 b의 값 변화에 따라 직선이 어떻게 움직이는지 관찰합니다.", hasContent: false },
      { name: "두 직선의 교점과 연립방정식", type: "문제풀이", desc: "그래프의 교점이 곧 연립방정식의 해임을 직관적으로 이해합니다.", hasContent: false },
    ],
  },
  {
    id: 4,
    unitNumber: "Ⅳ",
    title: "도형의 성질",
    subUnits: ["1. 삼각형의 성질", "2. 사각형의 성질"],
    summary: "이등변삼각형과 직각삼각형의 성질, 삼각형의 외심과 내심, 사각형의 성질을 증명하고 탐구합니다.",
    activities: [
      { name: "외심과 내심의 위치 탐구", type: "개념정리", desc: "예각·직각·둔각삼각형의 외심과 내심 위치 차이를 발견합니다.", hasContent: false },
      { name: "평행사변형 조건 판별", type: "문제풀이", desc: "여러 사각형 중 평행사변형의 조건을 만족하는지 판별합니다.", hasContent: false },
    ],
  },
  {
    id: 5,
    unitNumber: "Ⅴ",
    title: "도형의 닮음과 피타고라스 정리",
    subUnits: ["1. 도형의 닮음", "2. 평행선과 선분의 길이의 비", "3. 피타고라스 정리"],
    summary: "도형의 닮음 조건과 평행선 사이의 선분 비를 이해하고, 피타고라스 정리를 적용합니다.",
    activities: [
      { name: "닮음비와 넓이·부피의 비 탐구", type: "개념정리", desc: "닮음비 m:n 일 때 넓이의 비 m²:n²의 관계를 알아봅니다.", hasContent: false },
      { name: "피타고라스 정리 변 길이 탐구", type: "문제풀이", desc: "직각삼각형의 두 변을 알고 나머지 한 변의 길이를 계산합니다.", hasContent: false },
    ],
  },
  {
    id: 6,
    unitNumber: "Ⅵ",
    title: "확률",
    subUnits: ["1. 경우의 수", "2. 확률"],
    summary: "사건이 일어나는 경우의 수를 세고, 일어날 확률을 구하여 실생활의 확률적 상황을 판단합니다.",
    activities: [
      { name: "경우의 수 (합의 법칙 & 곱의 법칙)", type: "개념정리", desc: "동시 일어나는 경우와 따로 일어나는 경우의 차이를 학습합니다.", hasContent: false },
      { name: "적어도 하나는 ~일 확률 구하기", type: "문제풀이", desc: "여사건의 확률을 활용하여 복잡한 확률 문제를 쉽게 풀어봅니다.", hasContent: false },
    ],
  },
];

export default function Grade2Page() {
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const selectedUnit = VISANG_GRADE2_UNITS.find((u) => u.id === selectedUnitId) || VISANG_GRADE2_UNITS[0];

  const [toastMessage, setToastMessage] = useState("");

  const handleActivityClick = (actName: string) => {
    // 퀴즈 페이지와 연동되지 않으며, 준비중 안내 출력
    setToastMessage(`[${actName}] 활동은 현재 교안 업로드 준비 중입니다. 오픈 준비중입니다!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* 헤더 섹션 */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors mb-2">
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-full">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          2022 개정 교육과정 비상 교과서 기준
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          중학교 2학년 <span className="text-emerald-600">수학 대단원별 학습관</span> 📖
        </h1>
        <p className="text-gray-500 font-medium text-sm md:text-base">
          비상 교과서 단원별 핵심 개념과 학습 활동을 파악하세요!
        </p>
      </div>

      {/* 준비 중 메시지 팝업 Banner */}
      {toastMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 대단원 탭 메뉴 */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
        {VISANG_GRADE2_UNITS.map((unit) => (
          <button
            key={unit.id}
            onClick={() => setSelectedUnitId(unit.id)}
            className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedUnitId === unit.id
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-white/80 border border-gray-200/80 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="opacity-80">{unit.unitNumber}.</span>
            <span>{unit.title}</span>
          </button>
        ))}
      </div>

      {/* 선택된 대단원 상세 카드 */}
      <div className="bg-white/80 backdrop-blur-md border border-emerald-100 p-8 md:p-10 rounded-3xl shadow-sm space-y-8">
        <div className="space-y-3 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs">
            <Layers className="w-4 h-4" />
            <span>대단원 {selectedUnit.unitNumber}</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900">{selectedUnit.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{selectedUnit.summary}</p>
        </div>

        {/* 소단원 구성 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>소단원 구성</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedUnit.subUnits.map((sub, idx) => (
              <div key={idx} className="p-4 bg-emerald-50/50 border border-emerald-100/80 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 대단원 대표 활동 목록 (퀴즈 연동 제거, 독립된 안내) */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>대단원 학습 활동 목록</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedUnit.activities.map((act, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border border-gray-100 hover:border-emerald-200 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                    act.type === "개념정리" ? "bg-blue-50 text-blue-700" : act.type === "문제풀이" ? "bg-emerald-50 text-emerald-700" : "bg-purple-50 text-purple-700"
                  }`}>
                    {act.type}
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm leading-snug">{act.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{act.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleActivityClick(act.name)}
                  className="inline-flex items-center justify-between w-full text-xs font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200 px-3 py-2 rounded-xl transition-all pt-2 mt-2"
                >
                  <span>활동 시작하기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
