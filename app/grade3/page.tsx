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
  }[];
}

const VISANG_GRADE3_UNITS: Unit[] = [
  {
    id: 1,
    unitNumber: "Ⅰ",
    title: "실수와 그 연산",
    subUnits: ["1. 제곱근과 실수", "2. 근호를 포함한 식의 계산"],
    summary: "제곱근의 뜻과 성질을 이해하고, 무리수와 실수의 개념을 확장하여 덧셈, 뺄셈, 곱셈, 나눗셈 연산을 익힙니다.",
    activities: [
      { name: "제곱근 계산 및 유리화 탐구", type: "개념정리", desc: "분모의 유리화 및 근호 안의 수를 밖으로 꺼내는 계산 훈련입니다." },
      { name: "실수 수직선 대응 퀴즈", type: "문제풀이", desc: "√2, √3 등 무리수를 수직선 상의 점으로 표현해보는 문제입니다." },
    ],
  },
  {
    id: 2,
    unitNumber: "Ⅱ",
    title: "인수분해와 이차방정식",
    subUnits: ["1. 다항식의 곱셈과 인수분해", "2. 이차방정식"],
    summary: "다항식의 곱셈공식과 인수분해를 습득하고, 인수분해 및 근의 공식을 활용해 이차방정식을 해결합니다.",
    activities: [
      { name: "인수분해 공식 마스터 챌린지", type: "개념정리", desc: "완전제곱식과 합차공식을 이용하여 식을 인수분해합니다." },
      { name: "근의 공식 연산 시뮬레이터", type: "문제풀이", desc: "ax² + bx + c = 0 의 해를 근의 공식으로 빠르게 구합니다." },
    ],
  },
  {
    id: 3,
    unitNumber: "Ⅲ",
    title: "이차함수와 그 그래프",
    subUnits: ["1. 이차함수 y = ax²의 그래프", "2. 이차함수 y = a(x-p)² + q의 그래프"],
    summary: "이차함수의 기본 개념을 이해하고, 평행이동을 통한 포물선의 꼭짓점과 축의 방정식을 구합니다.",
    activities: [
      { name: "포물선의 꼭짓점과 축 탐구", type: "개념정리", desc: "a의 부호 및 p, q값 변화에 따른 포물선의 이동을 관찰합니다." },
      { name: "이차함수의 최댓값과 최솟값", type: "문제풀이", desc: "실생활 문제에서 이차함수를 세우고 최댓값과 최솟값을 구합니다." },
    ],
  },
  {
    id: 4,
    unitNumber: "Ⅳ",
    title: "삼각비",
    subUnits: ["1. 삼각비", "2. 삼각비의 활용"],
    summary: "직각삼각형에서 싸인(sin), 코사인(cos), 탄젠트(tan)의 뜻을 알고 30°, 45°, 60°의 특수각 삼각비를 활용합니다.",
    activities: [
      { name: "특수각 삼각비 값 암기 퀴즈", type: "개념정리", desc: "sin 30°, cos 45°, tan 60° 등의 삼각비 값을 빠르게 맞춰보세요." },
      { name: "삼각비를 이용한 높이와 거리 측정", type: "문제풀이", desc: "건물의 높이와 강 건너편 거리를 삼각비로 계산해봅니다." },
    ],
  },
  {
    id: 5,
    unitNumber: "Ⅴ",
    title: "원의 성질",
    subUnits: ["1. 원과 직선", "2. 원주각"],
    summary: "원의 현, 접선의 성질과 원주각과 중심각 사이의 관계를 파악하고 원에 내접하는 사각형의 성질을 구합니다.",
    activities: [
      { name: "원주각 = 1/2 중심각 증명 시뮬레이션", type: "개념정리", desc: "호의 길이에 대한 원주각의 크기가 일정함을 시각적으로 탐구합니다." },
      { name: "원과 접선 길이 구하기 퀴즈", type: "문제풀이", desc: "원 밖의 한 점에서 그은 두 접선의 길이가 같음을 활용합니다." },
    ],
  },
  {
    id: 6,
    unitNumber: "Ⅵ",
    title: "통계",
    subUnits: ["1. 대표값과 산포도", "2. 상자수염과 산점도"],
    summary: "평균, 중앙값, 최빈값 및 분산과 표준편차를 구하여 자료의 흩어진 정도(산포도)를 분석합니다.",
    activities: [
      { name: "평균·중앙값·최빈값 구하기", type: "개념정리", desc: "자료의 특성에 적합한 대푯값을 선택하는 기준을 학습합니다." },
      { name: "분산과 표준편차 계산 훈련", type: "문제풀이", desc: "편차의 제곱의 평균으로 산포도를 정량적으로 측정합니다." },
    ],
  },
];

export default function Grade3Page() {
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const selectedUnit = VISANG_GRADE3_UNITS.find((u) => u.id === selectedUnitId) || VISANG_GRADE3_UNITS[0];

  const [toastMessage, setToastMessage] = useState("");

  const handleActivityClick = (actName: string) => {
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
          중학교 3학년 <span className="text-emerald-600">수학 대단원별 학습관</span> 📖
        </h1>
        <p className="text-gray-500 font-medium text-sm md:text-base">
          비상 교과서 3학년 단원별 핵심 개념과 학습 활동을 파악하세요!
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
        {VISANG_GRADE3_UNITS.map((unit) => (
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

        {/* 대단원 대표 활동 목록 */}
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
