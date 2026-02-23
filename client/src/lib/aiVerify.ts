// ============================================================
// 百分戰局 Percent Battle — AI Verification
// Uses tRPC backend route which calls Poe API (OpenAI SDK format)
// with gemini-3-flash model for vision-based card checking
// ============================================================

export interface AIVerifyResult {
  isValid: boolean;
  message: string;
  reasoning: string;
}

export async function verifyWithAI(
  imageDataUrl: string,
  prompt: string
): Promise<AIVerifyResult> {
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
