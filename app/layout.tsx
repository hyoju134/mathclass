import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Calculator } from "lucide-react";

// 애플 스타일의 미니멀하고 세련된 자간이 설정된 Inter 폰트
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "효주T의 수학교실",
  description: "미니멀하고 세련된 디자인의 수학 학습 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased bg-emerald-50/30 text-gray-900 flex flex-col min-h-screen tracking-tight`}>
        {/* 상단 헤더: Glassmorphism 적용, 넓은 여백과 부드러운 그림자 */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-emerald-100/50 shadow-sm transition-all">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative">
            {/* 로고 영역 */}
            <Link href="/" className="flex items-center gap-2 text-emerald-600 font-semibold text-xl tracking-tight z-10 hover:opacity-90 transition-opacity">
              <Calculator className="w-6 h-6" />
              <span>효주T의 수학교실</span>
            </Link>
            
            {/* 네비게이션 공간 (중앙 정렬) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 absolute left-1/2 -translate-x-1/2">
              <a href="#" className="hover:text-emerald-600 transition-colors">중1</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">중2</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">중3</a>
              <Link href="/questions" className="hover:text-emerald-600 transition-colors">질문게시판</Link>
            </nav>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-24">
          {children}
        </main>

        {/* 하단 푸터: 심플하고 여백이 넉넉한 스타일 */}
        <footer className="w-full bg-white border-t border-emerald-100/50 py-12 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} 효주T의 수학교실. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
