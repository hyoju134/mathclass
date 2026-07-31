import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Supabase 클라이언트 생성 (환경변수가 없는 경우 null 조치하여 런타임 에러 방지)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface QuizScoreRecord {
  id?: number;
  student_id: string;
  name: string;
  score: number;
  correct_count: number;
  total_questions: number;
  created_at?: string;
}

/**
 * 퀴즈 점수 저장
 */
export async function saveQuizScore(record: QuizScoreRecord) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("quiz_scores")
        .insert([
          {
            student_id: record.student_id,
            name: record.name,
            score: record.score,
            correct_count: record.correct_count,
            total_questions: record.total_questions,
          },
        ]);

      if (error) {
        console.warn("Supabase insert warning:", error);
      } else {
        return data;
      }
    } catch (e) {
      console.error("Supabase insert exception:", e);
    }
  }

  // Fallback: LocalStorage에도 함께 저장하여 연동 전/후 항상 동작 보장
  try {
    const existing = JSON.parse(localStorage.getItem("mathclass_quiz_scores") || "[]");
    const newRecord = { ...record, id: Date.now(), created_at: new Date().toISOString() };
    const updated = [newRecord, ...existing];
    localStorage.setItem("mathclass_quiz_scores", JSON.stringify(updated));
  } catch (e) {
    console.error("LocalStorage save error:", e);
  }
}

/**
 * 랭킹 (점수 높은 순) 불러오기
 */
export async function getLeaderboard(): Promise<QuizScoreRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("quiz_scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        return data as QuizScoreRecord[];
      }
    } catch (e) {
      console.error("Supabase fetch exception:", e);
    }
  }

  // Fallback: LocalStorage 데이터점수순 정렬 반환
  try {
    const localData: QuizScoreRecord[] = JSON.parse(localStorage.getItem("mathclass_quiz_scores") || "[]");
    return localData.sort((a, b) => b.score - a.score);
  } catch (e) {
    return [];
  }
}

/**
 * 개별 퀴즈 점수 삭제 (관리자용)
 */
export async function deleteQuizScore(id?: number, studentId?: string, score?: number) {
  if (supabase && id) {
    try {
      await supabase.from("quiz_scores").delete().eq("id", id);
    } catch (e) {
      console.error("Supabase delete score error:", e);
    }
  }

  // LocalStorage 내 항목도 삭제
  try {
    const localData: QuizScoreRecord[] = JSON.parse(localStorage.getItem("mathclass_quiz_scores") || "[]");
    const updated = localData.filter((item) => {
      if (id && item.id === id) return false;
      if (studentId && score !== undefined && item.student_id === studentId && item.score === score) return false;
      return true;
    });
    localStorage.setItem("mathclass_quiz_scores", JSON.stringify(updated));
  } catch (e) {
    console.error("LocalStorage delete score error:", e);
  }
}

/**
 *전체 퀴즈 랭킹 초기화 (관리자용)
 */
export async function resetAllQuizScores() {
  if (supabase) {
    try {
      await supabase.from("quiz_scores").delete().neq("id", 0);
    } catch (e) {
      console.error("Supabase reset all error:", e);
    }
  }

  try {
    localStorage.removeItem("mathclass_quiz_scores");
  } catch (e) {
    console.error("LocalStorage reset all error:", e);
  }
}
