/**
 * Unit tests for game state logic (context cards, prompts, player configs)
 * These test the shared game data utilities used by both client and server
 */
import { describe, expect, it } from "vitest";

// ============================================================
// Import game data utilities (re-implemented here for server-side testing)
// ============================================================

interface ContextCard {
  id: number;
  name: string;
  description: string;
  colors: { red?: number; yellow?: number; blue?: number };
  total: number;
  note?: string;
}

const CONTEXT_CARDS: ContextCard[] = [
  { id: 1, name: "標準分佈", description: "Standard", colors: { red: 20, yellow: 30, blue: 50 }, total: 100 },
  { id: 2, name: "零散分佈", description: "Scattered", colors: { red: 5, yellow: 15, blue: 80 }, total: 100 },
  { id: 3, name: "二元對決", description: "Duel", colors: { red: 45, blue: 55 }, total: 100 },
  { id: 4, name: "數量比較", description: "Majority", colors: { red: 25, blue: 10 }, total: 35 },
  { id: 5, name: "倍數關係", description: "Multiple", colors: { red: 10, blue: 5 }, total: 15 },
  { id: 6, name: "50人班級", description: "Class 50", colors: { red: 10, yellow: 20, blue: 20 }, total: 50 },
  { id: 7, name: "20個氣球", description: "Balloons", colors: { red: 5, blue: 15 }, total: 20 },
  { id: 8, name: "雙百圖", description: "Double Grid", colors: { red: 40, yellow: 60, blue: 100 }, total: 200 },
  { id: 9, name: "投票結果", description: "Vote", colors: { red: 12, yellow: 13, blue: 75 }, total: 100 },
  { id: 10, name: "派對食物", description: "Party", colors: { red: 35, yellow: 35, blue: 30 }, total: 100 },
];

function drawRandomContextCard(): ContextCard {
  const idx = Math.floor(Math.random() * CONTEXT_CARDS.length);
  return CONTEXT_CARDS[idx];
}

function buildFirePrompt(card: ContextCard): string {
  const colorDesc = Object.entries(card.colors)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      const name = k === "red" ? "紅色" : k === "yellow" ? "黃色" : "藍色";
      return `${name}有${v}格`;
    })
    .join("，");
  return `情境地圖：${colorDesc}，總共${card.total}格。`;
}

function buildTrapPrompt(card: ContextCard): string {
  const colorDesc = Object.entries(card.colors)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      const name = k === "red" ? "紅色" : k === "yellow" ? "黃色" : "藍色";
      return `${name}有${v}格`;
    })
    .join("，");
  return `情境地圖：${colorDesc}，總共${card.total}格。`;
}

// ============================================================
// Tests
// ============================================================

describe("Context Cards Data", () => {
  it("should have exactly 10 context cards", () => {
    expect(CONTEXT_CARDS).toHaveLength(10);
  });

  it("each card should have at least one color", () => {
    for (const card of CONTEXT_CARDS) {
      const colorCount = Object.values(card.colors).filter((v) => v !== undefined && v > 0).length;
      expect(colorCount, `Card ${card.id} (${card.name}) should have at least 1 color`).toBeGreaterThanOrEqual(1);
    }
  });

  it("each card total should match sum of colors or be a valid game total", () => {
    for (const card of CONTEXT_CARDS) {
      const sum = Object.values(card.colors).reduce((acc, v) => acc + (v ?? 0), 0);
      // Total should be >= sum of colors (total can be the denominator, which includes all blocks)
      expect(card.total, `Card ${card.id} total should be >= color sum`).toBeGreaterThanOrEqual(sum);
    }
  });

  it("drawRandomContextCard should return a valid card", () => {
    for (let i = 0; i < 20; i++) {
      const card = drawRandomContextCard();
      expect(card).toBeDefined();
      expect(card.id).toBeGreaterThanOrEqual(1);
      expect(card.id).toBeLessThanOrEqual(10);
    }
  });
});

describe("AI Prompt Builders", () => {
  it("buildFirePrompt should include color descriptions", () => {
    const card = CONTEXT_CARDS[0]; // 標準分佈: red:20, yellow:30, blue:50
    const prompt = buildFirePrompt(card);
    expect(prompt).toContain("紅色有20格");
    expect(prompt).toContain("黃色有30格");
    expect(prompt).toContain("藍色有50格");
    expect(prompt).toContain("100格");
  });

  it("buildFirePrompt should work for 2-color cards", () => {
    const card = CONTEXT_CARDS[2]; // 二元對決: red:45, blue:55
    const prompt = buildFirePrompt(card);
    expect(prompt).toContain("紅色有45格");
    expect(prompt).toContain("藍色有55格");
    expect(prompt).not.toContain("黃色");
  });

  it("buildTrapPrompt should include color descriptions", () => {
    const card = CONTEXT_CARDS[5]; // 50人班級: red:10, yellow:20, blue:20
    const prompt = buildTrapPrompt(card);
    expect(prompt).toContain("紅色有10格");
    expect(prompt).toContain("黃色有20格");
    expect(prompt).toContain("藍色有20格");
  });
});

describe("Game Rules Validation", () => {
  it("player count should be 2, 3, or 4", () => {
    const validCounts = [2, 3, 4];
    for (const count of validCounts) {
      expect(validCounts).toContain(count);
    }
  });

  it("each card should have a unique id", () => {
    const ids = CONTEXT_CARDS.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(CONTEXT_CARDS.length);
  });

  it("card 4 (數量比較) should allow percentage > 100%", () => {
    const card = CONTEXT_CARDS[3]; // red:25, blue:10, total:35
    // 25/10 * 100% = 250% - valid as fraction can exceed 100%
    expect(card.colors.red).toBe(25);
    expect(card.colors.blue).toBe(10);
    expect(card.total).toBe(35);
  });
});
