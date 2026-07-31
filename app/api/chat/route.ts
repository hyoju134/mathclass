import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          reply: "OPENAI_API_KEY 환경변수가 설정되지 않았습니다. Vercel 환경변수 설정을 확인해 주세요.",
        },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "당신은 중학생을 친절하게 가르쳐주는 '효주T 수학 AI 튜터'입니다. 학생이 수학 개념, 문제 풀이 과정, 공부 팁 등을 질문할 때 명쾌하고 다정하며 친절하게 한국어로 설명해 주세요. 어려운 공식은 쉬운 예시와 함께 단계별로 풀어서 설명해주시고, 학생을 칭찬하고 격려해 주는 태도를 유지해 주세요.",
          },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API call failed:", data);
      return NextResponse.json(
        { reply: `OpenAI API 오류: ${data?.error?.message || "답변 생성 실패"}` },
        { status: 500 }
      );
    }

    const reply = data.choices?.[0]?.message?.content || "답변을 생성하지 못했습니다.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "서버 응답 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
