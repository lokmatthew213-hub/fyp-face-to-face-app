// ============================================================
// 百分戰局 — Game Board (Four-Side Layout, No Text Rotation)
// Device held horizontally (landscape)
// Players are on all four sides — icons on edges, text always upright
// Context card fills the CENTER area
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { getPlayerConfig, WIN_SCORE, Player } from '@/lib/gameData';
import ContextCardDisplay from './ContextCardDisplay';
import PlayerZone from './PlayerZone';
import WinDeclaration from './WinDeclaration';
import RoundEnd from './RoundEnd';
import GameOver from './GameOver';

// ============================================================
// Top bar
// ============================================================
function GameTopBar() {
  const { state, resetGame } = useGame();

  return (
    <div className="game-top-bar flex items-center justify-between px-4 py-2 flex-shrink-0 z-20">
      <button
        onClick={resetGame}
        className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
      >
        ← 返回
      </button>
      <div className="flex items-center gap-2">
        <span
          className="font-black text-base"
          style={{
            fontFamily: "'Nunito', 'Noto Sans TC', sans-serif",
            background: 'linear-gradient(90deg, oklch(0.68 0.24 28), oklch(0.75 0.22 55), oklch(0.58 0.24 255))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          百分戰局
        </span>
        <span className="text-slate-400 text-xs">
          {state.playerCount}人 · 第{state.round}回合
        </span>
      </div>
      <div className="w-14" />
    </div>
  );
}

// ============================================================
// Score bar — compact, shows all players' total progress
// ============================================================
function ScoreBar() {
  const { state } = useGame();

  return (
    <div className="score-bar flex items-center justify-center gap-3 px-4 py-1.5 flex-shrink-0 z-20">
      {state.players.map((p) => {
        const cfg = getPlayerConfig(p.id);
        const pct = Math.min(100, (p.totalScore / WIN_SCORE) * 100);
        return (
          <div key={p.id} className="flex items-center gap-1.5 flex-1 max-w-[110px]">
            <span className="text-base flex-shrink-0">{cfg.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-slate-500 text-[10px] truncate font-semibold">{p.name}</span>
                <span
                  className="font-black text-xs flex-shrink-0 ml-1"
                  style={{ color: cfg.color, fontFamily: "'Nunito', sans-serif" }}
                >
                  {p.totalScore}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}cc)`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
      <div className="text-slate-400 text-[10px] flex-shrink-0">/{WIN_SCORE}</div>
    </div>
  );
}

// ============================================================
// Compact player button — icon + name + score, no rotation
// Used for side/top/bottom positions
// ============================================================
function PlayerButton({ player }: { player: Player }) {
  const { declareWin } = useGame();
  const cfg = getPlayerConfig(player.id);

  return (
    <div className={`player-zone player-zone-${player.id} flex flex-col items-center gap-1`}>
      <button
        onClick={() => declareWin(player.id)}
        className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
        style={{
          borderColor: cfg.color,
          backgroundColor: `${cfg.color}20`,
          boxShadow: `0 4px 14px ${cfg.color}35`,
        }}
        title={`${player.name} — 點擊宣告勝利！`}
      >
        <span className="text-2xl leading-none">{cfg.emoji}</span>
        <span className="text-[9px] font-bold leading-none" style={{ color: cfg.color }}>
          百分百!
        </span>
      </button>
      <span className="text-[11px] font-black leading-none" style={{ color: cfg.color, fontFamily: "'Noto Sans TC', sans-serif" }}>
        {player.name}
      </span>
      <div
        className="px-2 py-0.5 rounded-full text-[10px] font-black leading-none"
        style={{
          backgroundColor: `${cfg.color}18`,
          color: cfg.color,
          border: `1px solid ${cfg.color}40`,
        }}
      >
        {player.totalScore}分
      </div>
    </div>
  );
}

// ============================================================
// 2-player layout: Player 1 top-center, Player 2 bottom-center
// ============================================================
function TwoPlayerLayout() {
  const { state } = useGame();
  const [p1, p2] = state.players;

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Player 1 — top */}
      <div className="flex justify-center py-2 flex-shrink-0">
        <PlayerButton player={p1} />
      </div>

      {/* Context card — center, fills remaining space */}
      <div className="flex-1 flex items-center justify-center px-4 py-1 overflow-hidden min-h-0">
        <div className="context-area w-full h-full p-3 overflow-hidden">
          <ContextCardDisplay card={state.currentContextCard!} />
        </div>
      </div>

      {/* Player 2 — bottom */}
      <div className="flex justify-center py-2 flex-shrink-0">
        <PlayerButton player={p2} />
      </div>
    </div>
  );
}

// ============================================================
// 3-player layout: Player 1 top-center, Players 2 & 3 bottom
// ============================================================
function ThreePlayerLayout() {
  const { state } = useGame();
  const [p1, p2, p3] = state.players;

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Player 1 — top center */}
      <div className="flex justify-center py-2 flex-shrink-0">
        <PlayerButton player={p1} />
      </div>

      {/* Context card — center */}
      <div className="flex-1 flex items-center justify-center px-4 py-1 overflow-hidden min-h-0">
        <div className="context-area w-full h-full p-3 overflow-hidden">
          <ContextCardDisplay card={state.currentContextCard!} />
        </div>
      </div>

      {/* Players 2 & 3 — bottom row */}
      <div className="flex justify-around py-2 px-6 flex-shrink-0">
        <PlayerButton player={p2} />
        <PlayerButton player={p3} />
      </div>
    </div>
  );
}

// ============================================================
// 4-player layout: Player 1 top, Player 3 bottom,
//                  Player 4 left side, Player 2 right side
// ALL text faces same direction — no rotation
// Left/right players have icon + text stacked vertically
// ============================================================
function FourPlayerLayout() {
  const { state } = useGame();
  const [p1, p2, p3, p4] = state.players;

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Player 1 — top center */}
      <div className="flex justify-center py-2 flex-shrink-0">
        <PlayerButton player={p1} />
      </div>

      {/* Middle row: Player 4 | Context Card | Player 2 */}
      <div className="flex-1 flex items-center gap-2 px-2 overflow-hidden min-h-0">
        {/* Player 4 — left side (icon + text, no rotation) */}
        <div className="flex-shrink-0">
          <PlayerButton player={p4} />
        </div>

        {/* Context card — fills center */}
        <div className="flex-1 h-full flex items-center justify-center overflow-hidden min-h-0">
          <div className="context-area w-full h-full p-3 overflow-hidden">
            <ContextCardDisplay card={state.currentContextCard!} />
          </div>
        </div>

        {/* Player 2 — right side (icon + text, no rotation) */}
        <div className="flex-shrink-0">
          <PlayerButton player={p2} />
        </div>
      </div>

      {/* Player 3 — bottom center */}
      <div className="flex justify-center py-2 flex-shrink-0">
        <PlayerButton player={p3} />
      </div>
    </div>
  );
}

// ============================================================
// Main GameBoard
// ============================================================
export default function GameBoard() {
  const { state } = useGame();

  const isModalOpen = [
    'win-declare', 'fire-photo', 'fire-verify',
    'fire-result', 'fire-subtype', 'trap-result',
  ].includes(state.phase);

  if (state.phase === 'game-over') {
    return <GameOver />;
  }

  return (
    <div className="game-board-bg flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Top bar */}
      <GameTopBar />

      {/* Player layout + context card */}
      {state.playerCount === 2 && <TwoPlayerLayout />}
      {state.playerCount === 3 && <ThreePlayerLayout />}
      {state.playerCount === 4 && <FourPlayerLayout />}

      {/* Score bar */}
      <ScoreBar />

      {/* Win declaration modal */}
      {isModalOpen && <WinDeclaration />}

      {/* Round end summary */}
      {state.phase === 'round-end' && <RoundEnd />}
    </div>
  );
}
