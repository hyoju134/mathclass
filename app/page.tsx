import Link from "next/link";
import { Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      
      {/* 텍스트 영역: 극도로 미니멀하며 세련된 타이포그래피 */}
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 leading-tight">
          함께하는 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            수학교실
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
          어렵고 복잡한 수학, 이제는 쉽고 아름답게 시작하세요.
          <br className="hidden md:block" />
          당신의 학습 경험을 완전히 새롭게 디자인했습니다.
        </p>

        <div className="pt-4 flex justify-center">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:scale-105 transition-all text-base"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>스피드 암산 퀴즈 왕중왕전 도전하기</span>
          </Link>
        </div>
      </div>
      
      {/* 서브 콘텐츠 카드 영역 (Glassmorphism + Apple 스타일 여백) */}
      <div className="w-full mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {[
          { title: "개인 맞춤 학습", desc: "나의 수준에 딱 맞는 문제와 개념을 추천받아 효율적으로 학습합니다." },
          { title: "직관적인 풀이", desc: "복잡한 수식을 아름답고 직관적인 UI로 한눈에 이해할 수 있습니다." },
          { title: "실시간 피드백", desc: "문제를 푸는 즉시 정확한 해설과 피드백을 제공받아 실력을 키웁니다." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-md border border-emerald-100/60 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
}
