// ============================================================
// 百分戰局 Percent Battle — AI Verification
// Uses tRPC backend route which calls Poe API (OpenAI SDK format)
// with gemini-3-flash model for vision-based card checking
// Falls back to manual confirmation when running on GitHub Pages
// (no backend server available in static hosting)
// ============================================================

export interface AIVerifyResult {
  isValid: boolean;
  message: string;
  reasoning: string;
}

// Detect if we are running in GitHub Pages (static) mode
// In static mode, /api/trpc is not available
const IS_STATIC_MODE =
  typeof window !== 'undefined' &&
  (window.location.hostname.endsWith('github.io') ||
    import.meta.env.VITE_STATIC_MODE === 'true');

/**
 * Mock AI verification for GitHub Pages static hosting.
 * Since there is no backend, we simulate a "teacher confirms" flow:
 * the result is always marked as valid with a note that the teacher
 * should verify manually.
 */
async function mockVerify(): Promise<AIVerifyResult> {
  // Simulate a short network delay for realism
  await new Promise((r) => setTimeout(r, 800));
  return {
    isValid: true,
    message: '✅ 靜態模式：請老師人工確認答案是否正確',
    reasoning:
      '此版本運行於 GitHub Pages 靜態模式，AI 自動判卷功能需要後端伺服器支援。請老師或同學人工確認學生的算式是否正確後，再繼續遊戲。',
  };
}

export async function verifyWithAI(
  imageDataUrl: string,
  prompt: string
): Promise<AIVerifyResult> {
  // Use mock in static/GitHub Pages mode
  if (IS_STATIC_MODE) {
    return mockVerify();
  }

  // Convert data URL to base64 and mime type
  const parts = imageDataUrl.split(',');
  const base64 = parts[1] ?? '';
  const mimeType = (parts[0]?.split(';')[0]?.split(':')[1]) ?? 'image/jpeg';

  // Call our tRPC backend which uses Poe API
  const response = await fetch('/api/trpc/game.verifyCard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      json: {
        imageBase64: base64,
        mimeType,
        prompt,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI 驗證請求失敗：${response.status} ${errText}`);
  }

  const data = await response.json();

  // tRPC response format: { result: { data: { json: ... } } }
  const result = data?.result?.data?.json ?? data?.result?.data ?? data;

  if (result?.error) {
    throw new Error(result.error.message ?? 'AI 驗證失敗');
  }

  return {
    isValid: Boolean(result?.isValid),
    message: result?.message ?? '判斷完成',
    reasoning: result?.reasoning ?? '',
  };
}
