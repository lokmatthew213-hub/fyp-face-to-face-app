// ============================================================
// 百分戰局 Percent Battle — AI Verification
// - GitHub Pages / static mode: calls Poe API directly from browser
//   (Poe API supports access-control-allow-origin: *, CORS is fine)
// - Manus hosted mode: calls tRPC backend → Poe API (server-side)
// ============================================================

export interface AIVerifyResult {
  isValid: boolean;
  message: string;
  reasoning: string;
}

// ── Config ─────────────────────────────────────────────────
const POE_API_KEY = 'ltlR246-T-Uo3dZOySLphdQgOl_BEEyFw6FWhHXtIt8';
const POE_BASE_URL = 'https://api.poe.com/v1';
const POE_MODEL = 'gemini-3-flash';

// Detect GitHub Pages (static) mode — no Express backend available
const IS_STATIC_MODE =
  typeof window !== 'undefined' &&
  (window.location.hostname.endsWith('github.io') ||
    import.meta.env.VITE_STATIC_MODE === 'true');

// ── Response parsing helpers ───────────────────────────────

function extractJSON(content: string): string | null {
  const stripped = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : null;
}

function cleanReasoning(raw: string): string {
  if (!raw) return '';
  let cleaned = raw
    .replace(/```json[\s\S]*?```/gi, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .trim();
  cleaned = cleaned
    .split('\n')
    .filter(line => {
      const t = line.trim();
      if (!t) return false;
      if (t.startsWith('{') || t.startsWith('}')) return false;
      if (t.includes('"isValid"') || t.includes('"message"') || t.includes('"reasoning"')) return false;
      if (t.startsWith('"') && t.includes(':')) return false;
      return true;
    })
    .join('\n')
    .trim();
  return cleaned || raw.slice(0, 200);
}

function parseAIContent(content: string): AIVerifyResult {
  try {
    const jsonStr = extractJSON(content);
    if (jsonStr) {
      const parsed = JSON.parse(jsonStr);
      const isValid = Boolean(parsed.isValid);
      const rawReasoning = parsed.reasoning ?? parsed.message ?? '';
      const reasoning = cleanReasoning(rawReasoning);
      const message =
        parsed.message && !parsed.message.includes('{')
          ? parsed.message
          : isValid
          ? '✅ 算式合格，驗證通過！'
          : '❌ 算式未通過驗證';
      return {
        isValid,
        message,
        reasoning:
          reasoning ||
          (isValid
            ? '你的算式符合百分數的表達方式，計算正確！'
            : '算式未能完整表達兩個物件之間的百分數關係，請再試一次。'),
      };
    }
  } catch {
    // fall through
  }
  // Plain-text fallback
  const lower = content.toLowerCase();
  const isValid =
    lower.includes('"isvalid": true') ||
    lower.includes('"isvalid":true') ||
    (lower.includes('合格') && !lower.includes('不合格')) ||
    (lower.includes('正確') && !lower.includes('不正確') && !lower.includes('計算錯誤'));
  return {
    isValid,
    message: isValid ? '✅ 驗證通過！' : '❌ 驗證未通過',
    reasoning: isValid
      ? '你的算式符合百分數的表達方式！'
      : '算式未能完整表達兩個物件之間的百分數關係，請再試一次。',
  };
}

// ── Static mode: call Poe API directly from browser ───────
// Mirrors the Python example exactly:
//   client = openai.OpenAI(api_key=..., base_url="https://api.poe.com/v1")
//   chat = client.chat.completions.create(model="gemini-3-flash", messages=[...])
//
// Poe API sets access-control-allow-origin: * so CORS is fully supported.

async function verifyWithPoeDirectly(
  imageDataUrl: string,
  prompt: string
): Promise<AIVerifyResult> {
  const parts = imageDataUrl.split(',');
  const base64 = parts[1] ?? '';
  const mimeType = parts[0]?.split(';')[0]?.split(':')[1] ?? 'image/jpeg';

  // Equivalent to: client.chat.completions.create(model=..., messages=[...])
  const response = await fetch(`${POE_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${POE_API_KEY}`,
    },
    body: JSON.stringify({
      model: POE_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Poe API 請求失敗：${response.status} ${errText}`);
  }

  const data = await response.json();
  // Equivalent to: chat.choices[0].message.content
  const content: string = data?.choices?.[0]?.message?.content ?? '';

  if (!content) {
    throw new Error('Poe API 回應內容為空');
  }

  return parseAIContent(content);
}

// ── Server mode: call tRPC backend (Manus hosted) ─────────

async function verifyWithBackend(
  imageDataUrl: string,
  prompt: string
): Promise<AIVerifyResult> {
  const parts = imageDataUrl.split(',');
  const base64 = parts[1] ?? '';
  const mimeType = parts[0]?.split(';')[0]?.split(':')[1] ?? 'image/jpeg';

  const response = await fetch('/api/trpc/game.verifyCard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      json: { imageBase64: base64, mimeType, prompt },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI 驗證請求失敗：${response.status} ${errText}`);
  }

  const data = await response.json();
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

// ── Public entry point ─────────────────────────────────────

export async function verifyWithAI(
  imageDataUrl: string,
  prompt: string
): Promise<AIVerifyResult> {
  if (IS_STATIC_MODE) {
    // GitHub Pages: call Poe API directly from browser (CORS supported)
    return verifyWithPoeDirectly(imageDataUrl, prompt);
  }
  // Manus hosted: call via tRPC backend
  return verifyWithBackend(imageDataUrl, prompt);
}
