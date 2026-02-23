// ============================================================
// 百分戰局 Percent Battle — Game Data & Types
// Design: Playful Classroom Chalkboard
// ============================================================

export type PlayerCount = 2 | 3 | 4;

export interface Player {
  id: number;
  name: string;
  color: string;
  colorName: string;
  emoji: string;
  score: number;
}

export interface ContextCard {
  id: number;
  name: string;
  description: string;
  colors: {
    red?: number;
    yellow?: number;
    blue?: number;
  };
  total: number;
  note?: string;
}

export type WinType = 'fire' | 'trap'; // 火力全開 | 設下陷阱
export type FireSubType = 'self' | 'raid'; // 自摸 | 突襲

export interface WinDeclaration {
  playerId: number;
  winType: WinType;
  fireSubType?: FireSubType;
  raidTargetId?: number; // who threw the card (for 突襲)
  trapAnswererId?: number; // who answered the question (for 設下陷阱)
  photoDataUrl?: string;
  aiVerified?: boolean;
  aiMessage?: string;
  aiReasoning?: string;
}

export type GamePhase =
  | 'setup'        // Player count selection
  | 'playing'      // Main game board
  | 'win-declare'  // Player tapped their icon
  | 'win-type'     // Choose 火力全開 or 設下陷阱
  | 'fire-photo'   // Take photo for 火力全開
  | 'fire-verify'  // AI verifying
  | 'fire-result'  // Show AI result
  | 'fire-subtype' // Choose 自摸 or 突襲
  | 'trap-verify'  // AI verifying 設下陷阱
  | 'trap-result'  // Show trap result
  | 'trap-answerer'; // Choose who answered

export interface GameState {
  phase: GamePhase;
  playerCount: PlayerCount;
  players: Player[];
  currentContextCard: ContextCard | null;
  activeDeclaration: WinDeclaration | null;
  declaringPlayerId: number | null;
}

// ============================================================
// Context Cards Data (10 cards)
// ============================================================
export const CONTEXT_CARDS: ContextCard[] = [
  {
    id: 1,
    name: '標準分佈',
    description: 'Standard',
    colors: { red: 20, yellow: 30, blue: 50 },
    total: 100,
  },
  {
    id: 2,
    name: '零散分佈',
    description: 'Scattered',
    colors: { red: 5, yellow: 15, blue: 80 },
    total: 100,
    note: '需細心數',
  },
  {
    id: 3,
    name: '二元對決',
    description: 'Duel',
    colors: { red: 45, blue: 55 },
    total: 100,
  },
  {
    id: 4,
    name: '數量比較',
    description: 'Majority',
    colors: { red: 25, blue: 10 },
    total: 35,
    note: '分子>分母，答案250%',
  },
  {
    id: 5,
    name: '倍數關係',
    description: 'Multiple',
    colors: { red: 10, blue: 5 },
    total: 15,
    note: '分子>分母，答案200%',
  },
  {
    id: 6,
    name: '50人班級',
    description: 'Class 50',
    colors: { red: 10, yellow: 20, blue: 20 },
    total: 50,
    note: '需擴分',
  },
  {
    id: 7,
    name: '20個氣球',
    description: 'Balloons',
    colors: { red: 5, blue: 15 },
    total: 20,
    note: '需擴分',
  },
  {
    id: 8,
    name: '雙百圖',
    description: 'Double Grid',
    colors: { red: 40, yellow: 60, blue: 100 },
    total: 200,
    note: '需約分',
  },
  {
    id: 9,
    name: '投票結果',
    description: 'Vote',
    colors: { red: 12, yellow: 13, blue: 75 },
    total: 100,
    note: '引導做 12+13=25',
  },
  {
    id: 10,
    name: '派對食物',
    description: 'Party',
    colors: { red: 35, yellow: 35, blue: 30 },
    total: 100,
    note: '引導做 35+35=70',
  },
];

// ============================================================
// Player configuration
// ============================================================
export const PLAYER_CONFIGS = [
  {
    id: 1,
    name: '玩家 1',
    color: 'oklch(0.62 0.22 25)',
    colorName: 'red',
    colorClass: 'text-red-400',
    bgClass: 'bg-red-500/20',
    borderClass: 'border-red-500/60',
    glowClass: 'shadow-red-500/40',
    emoji: '🔴',
  },
  {
    id: 2,
    name: '玩家 2',
    color: 'oklch(0.58 0.18 240)',
    colorName: 'blue',
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/20',
    borderClass: 'border-blue-500/60',
    glowClass: 'shadow-blue-500/40',
    emoji: '🔵',
  },
  {
    id: 3,
    name: '玩家 3',
    color: 'oklch(0.82 0.15 85)',
    colorName: 'yellow',
    colorClass: 'text-yellow-400',
    bgClass: 'bg-yellow-500/20',
    borderClass: 'border-yellow-500/60',
    glowClass: 'shadow-yellow-500/40',
    emoji: '🟡',
  },
  {
    id: 4,
    name: '玩家 4',
    color: 'oklch(0.60 0.18 145)',
    colorName: 'green',
    colorClass: 'text-green-400',
    bgClass: 'bg-green-500/20',
    borderClass: 'border-green-500/60',
    glowClass: 'shadow-green-500/40',
    emoji: '🟢',
  },
];

// ============================================================
// Utility functions
// ============================================================
export function drawRandomContextCard(): ContextCard {
  const idx = Math.floor(Math.random() * CONTEXT_CARDS.length);
  return CONTEXT_CARDS[idx];
}

export function createPlayers(count: PlayerCount): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: PLAYER_CONFIGS[i].id,
    name: PLAYER_CONFIGS[i].name,
    color: PLAYER_CONFIGS[i].color,
    colorName: PLAYER_CONFIGS[i].colorName,
    emoji: PLAYER_CONFIGS[i].emoji,
    score: 0,
  }));
}

export function getPlayerConfig(id: number) {
  return PLAYER_CONFIGS[id - 1];
}

// Build the AI prompt for 火力全開 verification
export function buildFirePrompt(contextCard: ContextCard): string {
  const colorDesc = Object.entries(contextCard.colors)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      const name = k === 'red' ? '紅色' : k === 'yellow' ? '黃色' : '藍色';
      return `${name}有${v}格`;
    })
    .join('，');

  return `你是一個小學數學老師助手，正在判斷學生的百分數卡牌遊戲答案是否正確。

【情境地圖】
${colorDesc}，總共${contextCard.total}格。

【判斷標準】
學生需要用手中的卡牌拼出一條完整的百分數算式。正確的算式必須：
1. 包含顏色詞（例如：紅色、藍色、黃色）
2. 包含數字（用多張數字牌拼出，例如用「2」和「5」拼出25）
3. 包含完整的數學概念：A/B × 100%，其中A和B都是具體的顏色數量或總數
4. 算式必須表達兩個物件之間的關係（例如：紅色佔全部的百分之幾，或紅色是藍色的百分之幾）
5. 數學計算必須正確
6. 不能只說「紅色是75%」，因為沒有表達兩個物件的關係

【不合格例子】
- 「紅色是75%」❌ （沒有表達關係）
- 只有數字沒有顏色詞 ❌
- 算式計算錯誤 ❌

【合格例子】
- 「紅色佔全部的20/100×100%」✅
- 「紅色是藍色的25/10×100%」✅
- 「紅色加黃色佔全部的25/100×100%」✅（心算加法）

請看圖片中學生排列的卡牌，判斷是否構成一條合格的完整算式。

請以JSON格式回答：
{
  "isValid": true/false,
  "message": "簡短的中文判斷結果（一句話）",
  "reasoning": "詳細解釋為什麼合格或不合格（中文，2-3句）"
}`;
}

// Build the AI prompt for 設下陷阱 verification
export function buildTrapPrompt(contextCard: ContextCard): string {
  const colorDesc = Object.entries(contextCard.colors)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      const name = k === 'red' ? '紅色' : k === 'yellow' ? '黃色' : '藍色';
      return `${name}有${v}格`;
    })
    .join('，');

  return `你是一個小學數學老師助手，正在判斷學生的百分數卡牌遊戲中的「問題」是否有效。

【情境地圖】
${colorDesc}，總共${contextCard.total}格。

【判斷標準】
學生需要用手中的卡牌拼出一條有效的百分數問題。有效的問題必須：
1. 包含顏色詞（例如：紅色、藍色、黃色）
2. 包含「百分之幾？」這張問題卡
3. 問題必須基於情境地圖中存在的顏色
4. 問題必須有明確的答案（即基於情境地圖可以計算出答案）
5. 問題格式例如：「紅色是全部的百分之幾？」或「紅色是藍色的百分之幾？」

請看圖片中學生排列的卡牌，判斷是否構成一條有效的問題。

請以JSON格式回答：
{
  "isValid": true/false,
  "message": "簡短的中文判斷結果（一句話）",
  "reasoning": "詳細解釋為什麼有效或無效（中文，2-3句）"
}`;
}
