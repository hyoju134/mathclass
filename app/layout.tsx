import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";

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
      <body className="font-sans antialiased bg-emerald-50/30 text-gray-900 flex flex-col min-h-screen tracking-tight">
        <AuthProvider>
          {/* 상단 헤더 */}
          <Header />

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 md:py-24">
            {children}
          </main>

          {/* 하단 푸터 */}
          <footer className="w-full bg-white border-t border-emerald-100/50 py-12 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} 효주T의 수학교실. All rights reserved.</p>
          </footer>

          {/* OpenAI 효주T AI 튜터 챗봇 */}
          <ChatBot />
        </AuthProvider>
      </body>
    </html>
  );
}
