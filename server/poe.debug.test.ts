import { describe, expect, it } from "vitest";
import OpenAI from "openai";

describe("Poe API Debug", () => {
  it("should inspect full response structure", async () => {
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
      max_tokens: 50,
    });

    console.log("Full response:", JSON.stringify(response, null, 2));
    console.log("Choices:", response.choices);
    console.log("First choice:", response.choices?.[0]);
    console.log("Message:", response.choices?.[0]?.message);
    console.log("Content:", response.choices?.[0]?.message?.content);

    // Just check the response is an object
    expect(response).toBeDefined();
    expect(typeof response).toBe("object");
  }, 30000);
});
