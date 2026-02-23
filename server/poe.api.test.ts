import { describe, expect, it } from "vitest";
import OpenAI from "openai";

describe("Poe API Key Validation", () => {
  it("should connect to Poe API and get a response", async () => {
    const apiKey = process.env.POE_API_KEY;
    expect(apiKey, "POE_API_KEY must be set").toBeTruthy();

    const client = new OpenAI({
      apiKey: apiKey ?? "",
      baseURL: "https://api.poe.com/v1",
    });

    const response = await client.chat.completions.create({
      model: "gemini-3-flash",
      messages: [
        {
          role: "user",
          content: "Reply with exactly: OK",
        },
      ],
      max_tokens: 10,
    });

    const message = response.choices?.[0]?.message as Record<string, unknown>;
    const content = (message?.content as string) ?? "";
    const reasoning = (message?.reasoning_content as string) ?? (message?.reasoning as string) ?? "";
    const hasResponse = content.length > 0 || reasoning.length > 0;
    console.log("Poe API content:", content);
    console.log("Poe API reasoning:", reasoning.slice(0, 100));
    expect(hasResponse, "Response should have content or reasoning").toBe(true);
  }, 30000);
});
