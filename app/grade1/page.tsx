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

const VISANG_GRADE1_UNITS: Unit[] = [
  {
    id: 1,
    unitNumber: "Ⅰ",
    title: "소인수분해와 정수와 유리수",
    subUnits: ["1. 소인수분해", "2. 정수와 유리수"],
    summary: "자연수의 소인수분해를 이해하고, 음수의 개념을 통해 정수와 유리수의 사칙연산을 익힙니다.",
    activities: [
      { name: "소인수분해 트리 탐구", type: "개념정리", desc: "자연수를 소수의 곱으로 분해하는 과정을 연습합니다." },
      { name: "정수와 유리수 부호 계산기", type: "문제풀이", desc: "음수와 양수의 덧셈, 뺄셈, 곱셈의 부호 법칙을 정립합니다." },
    ],
  },
  {
    id: 2,
    unitNumber: "Ⅱ",
    title: "문자와 식",
    subUnits: ["1. 문자의 사용과 식의 계산", "2. 일차방정식"],
    summary: "문자를 사용하여 수량을 식으로 나타내고, 등식의 성질을 이용해 일차방정식을 해결합니다.",
    activities: [
      { name: "문자 표현과 식의 값 세우기", type: "개념정리", desc: "곱셈·나눗셈 기호를 생략하고 문자로 식을 만드는 방법을 익힙니다." },
      { name: "등식의 성질 밸런스 게임", type: "문제풀이", desc: "양변에 같은 수를 더하거나 곱해도 등식이 성립함을 확인합니다." },
    ],
  },
  {
    id: 3,
    unitNumber: "Ⅲ",
    title: "좌표평면과 그래프",
    subUnits: ["1. 좌표평면과 그래프", "2. 정비례와 반비례"],
    summary: "순서쌍과 좌표평면을 이해하고, 정비례와 반비례 관계를 그래프로 나타냅니다.",
    activities: [
      { name: "사분면 순서쌍 점 찍기", type: "개념정리", desc: "x축과 y축 상의 위치를 찾아 점을 찍는 그래픽 탐구입니다." },
      { name: "정비례 vs 반비례 그래프 비교", type: "문제풀이", desc: "y = ax 와 y = a/x 그래프의 모양적 차이를 파악합니다." },
    ],
  },
  {
    id: 4,
    unitNumber: "Ⅳ",
    title: "기본 도형과 평면도형",
    subUnits: ["1. 기본 도형", "2. 평면도형의 성질"],
    summary: "점·선·면·각의 기본 요소를 이해하고, 다각형과 원, 부채꼴의 넓이와 호의 길이를 구합니다.",
    activities: [
      { name: "맞동위각과 평행선 각도 구하기", type: "개념정리", desc: "동위각과 엇각의 성질을 이용해 미지의 각도를 찾습니다." },
      { name: "부채꼴 호의 길이와 넓이 공식", type: "문제풀이", desc: "중심각의 크기에 비례하는 부채꼴의 호의 길이와 넓이를 구합니다." },
    ],
  },
  {
    id: 5,
    unitNumber: "Ⅴ",
    title: "입체도형",
    subUnits: ["1. 입체도형의 성질", "2. 입체도형의 겉넓이와 부피"],
    summary: "다면체와 회전체의 성질을 파악하고, 각기둥·원기둥·뿔·구의 겉넓이와 부피를 계산합니다.",
    activities: [
      { name: "회전체와 단면 모양 관찰", type: "개념정리", desc: "평면도형을 회전축을 중심으로 회전시켰을 때의 입체를 확인합니다." },
      { name: "구와 원뿔의 부피 비 공식 탐구", type: "문제풀이", desc: "기둥, 뿔, 구 사이의 3:1:2 부피 비 관계를 계산합니다." },
    ],
  },
  {
    id: 6,
    unitNumber: "Ⅵ",
    title: "통계",
    subUnits: ["1. 자료의 정리와 해석"],
    summary: "줄기와 잎 그림, 도수분포표, 히스토그램을 작성하고 자료의 분포 상태를 해석합니다.",
    activities: [
      { name: "도수분포표와 히스토그램 그리기", type: "개념정리", desc: "계급과 도수를 나누어 데이터를 그래프로 표현해봅니다." },
      { name: "상대도수와 전체 그래프 비교", type: "문제풀이", desc: "전체 도수가 다른 두 집단의 자료 분포를 비교 분석합니다." },
    ],
  },
];

export default function Grade1Page() {
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const selectedUnit = VISANG_GRADE1_UNITS.find((u) => u.id === selectedUnitId) || VISANG_GRADE1_UNITS[0];

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
          중학교 1학년 <span className="text-emerald-600">수학 대단원별 학습관</span> 📖
        </h1>
        <p className="text-gray-500 font-medium text-sm md:text-base">
          비상 교과서 1학년 단원별 핵심 개념과 학습 활동을 파악하세요!
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
        {VISANG_GRADE1_UNITS.map((unit) => (
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
