import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import OpenAI from "openai";

// Poe API client (OpenAI SDK format)
const poeClient = new OpenAI({
  apiKey: process.env.POE_API_KEY || "",
  baseURL: "https://api.poe.com/v1",
});

/**
 * Strip markdown code fences and extract clean JSON from AI response.
 * Handles: ```json {...} ```, ```{...}```, or raw {...}
 */
function extractJSON(content: string): string | null {
  // Remove markdown code fences first
  const stripped = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Find the first complete JSON object
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : null;
}

/**
 * Clean the reasoning field: remove any JSON artifacts, code blocks, or English text.
 * Return only clean Chinese explanation.
 */
function cleanReasoning(raw: string): string {
  if (!raw) return '';

  // Remove markdown code blocks
  let cleaned = raw
    .replace(/```json[\s\S]*?```/gi, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .trim();

  // Remove lines that look like JSON (start with { or contain "isValid")
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

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // AI verification route for card game
  game: router({
    verifyCard: publicProcedure
      .input(z.object({
        imageBase64: z.string(),
        mimeType: z.string(),
        prompt: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { imageBase64, mimeType, prompt } = input;

        try {
          const response = await poeClient.chat.completions.create({
            model: "gemini-3-flash",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: prompt,
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${mimeType};base64,${imageBase64}`,
                    },
                  },
                ],
              },
            ],
            max_tokens: 800,
          });

          const content = response.choices?.[0]?.message?.content ?? "";

          // Try to parse JSON from response
          try {
            const jsonStr = extractJSON(content);
            if (!jsonStr) throw new Error("No JSON found in response");

            const parsed = JSON.parse(jsonStr);
            const isValid = Boolean(parsed.isValid);

            // Clean reasoning to remove any JSON artifacts
            const rawReasoning = parsed.reasoning ?? parsed.message ?? "";
            const reasoning = cleanReasoning(rawReasoning);

            // Build a friendly message
            const message = parsed.message && !parsed.message.includes('{')
              ? parsed.message
              : isValid
                ? "✅ 算式合格，驗證通過！"
                : "❌ 算式未通過驗證";

            return {
              isValid,
              message,
              reasoning: reasoning || (isValid
                ? "你的算式符合百分數的表達方式，計算正確！"
                : "算式未能完整表達兩個物件之間的百分數關係，請再試一次。"),
            };
          } catch {
            // Fallback: detect from plain text
            const lower = content.toLowerCase();
            const isValid =
              lower.includes('"isvalid": true') ||
              lower.includes('"isvalid":true') ||
              (lower.includes('合格') && !lower.includes('不合格')) ||
              (lower.includes('正確') && !lower.includes('不正確') && !lower.includes('計算錯誤'));

            return {
              isValid,
              message: isValid ? "✅ 驗證通過！" : "❌ 驗證未通過",
              reasoning: isValid
                ? "你的算式符合百分數的表達方式！"
                : "算式未能完整表達兩個物件之間的百分數關係，請再試一次。",
            };
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : "AI 驗證失敗";
          throw new Error(`AI 驗證錯誤：${msg}`);
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
