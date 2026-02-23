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

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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
            max_tokens: 600,
          });

          const content = response.choices?.[0]?.message?.content ?? "";

          // Parse JSON from response
          try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found in response");
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              isValid: Boolean(parsed.isValid),
              message: parsed.message ?? "判斷完成",
              reasoning: parsed.reasoning ?? "",
            };
          } catch {
            // Fallback: detect from text
            const lower = content.toLowerCase();
            const isValid =
              lower.includes('"isvalid": true') ||
              lower.includes("合格") ||
              lower.includes("正確") ||
              lower.includes("有效");
            return {
              isValid,
              message: isValid ? "✅ 驗證通過！" : "❌ 驗證未通過",
              reasoning: content.slice(0, 300),
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
