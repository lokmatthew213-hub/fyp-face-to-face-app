// ============================================================
// 百分戰局 — Game Board
// Design: Playful Classroom Chalkboard
// Layout adapts to 2, 3, or 4 players
// Players are positioned on different sides of the screen
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { getPlayerConfig } from '@/lib/gameData';
import ContextCardDisplay from './ContextCardDisplay';
import PlayerZone from './PlayerZone';
import WinDeclaration from './WinDeclaration';

// ============================================================
// 2-player layout: top vs bottom
// ============================================================
function TwoPlayerLayout() {
  const { state } = useGame();
  const [p1, p2] = state.players;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Player 1 - top (rotated 180°) */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="rotate-180">
          <PlayerZone player={p1} position="top" />
        </div>
      </div>

      {/* Context card - center */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-hidden">
        <div className="w-full max-w-sm">
          <ContextCardDisplay card={state.currentContextCard!} />
        </div>
      </div>

      {/* Player 2 - bottom */}
      <div className="flex justify-center pb-3 pt-2">
        <PlayerZone player={p2} position="bottom" />
      </div>
    </div>
  );
}

// ============================================================
// 3-player layout: top center, bottom-left, bottom-right
// ============================================================
function ThreePlayerLayout() {
  const { state } = useGame();
  const [p1, p2, p3] = state.players;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Player 1 - top center (rotated) */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="rotate-180">
          <PlayerZone player={p1} position="top" />
        </div>
      </div>

      {/* Context card - center */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-hidden">
        <div className="w-full max-w-sm">
          <ContextCardDisplay card={state.currentContextCard!} />
        </div>
      </div>

      {/* Players 2 & 3 - bottom row */}
      <div className="flex justify-around pb-3 pt-2 px-4">
        <PlayerZone player={p2} position="bottom" />
        <PlayerZone player={p3} position="bottom" />
      </div>
    </div>
  );
}

// ============================================================
// 4-player layout: top, bottom, left, right
// ============================================================
function FourPlayerLayout() {
  const { state } = useGame();
  const [p1, p2, p3, p4] = state.players;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Player 1 - top */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="rotate-180">
          <PlayerZone player={p1} position="top" />
        </div>
      </div>

      {/* Middle row: Player 4 | Context Card | Player 2 */}
      <div className="flex-1 flex items-center gap-2 px-2 overflow-hidden">
        {/* Player 4 - left (rotated 90°) */}
        <div className="flex-shrink-0">
          <div className="rotate-90">
            <PlayerZone player={p4} position="left" />
          </div>
        </div>

        {/* Context card - center */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-xs">
            <ContextCardDisplay card={state.currentContextCard!} />
          </div>
        </div>

        {/* Player 2 - right (rotated -90°) */}
        <div className="flex-shrink-0">
          <div className="-rotate-90">
            <PlayerZone player={p2} position="right" />
          </div>
        </div>
      </div>

      {/* Player 3 - bottom */}
      <div className="flex justify-center pb-3 pt-1">
        <PlayerZone player={p3} position="bottom" />
      </div>
    </div>
  );
}

// ============================================================
// Top bar with game info
// ============================================================
function GameTopBar() {
  const { state, resetGame, drawNewCard } = useGame();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-sm border-b border-white/10">
      <button
        onClick={resetGame}
        className="text-white/50 hover:text-white text-xs flex items-center gap-1 transition-colors"
      >
        ← 返回
      </button>
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 text-sm font-black" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
          百分戰局
        </span>
        <span className="text-white/40 text-xs">
          {state.playerCount}人對戰
        </span>
      </div>
      <button
        onClick={drawNewCard}
        className="text-white/50 hover:text-yellow-400 text-xs flex items-center gap-1 transition-colors"
      >
        🔀 換牌
      </button>
    </div>
  );
}

// ============================================================
// Score display overlay (bottom center)
// ============================================================
function ScoreBar() {
  const { state } = useGame();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center gap-3 px-4 py-2 bg-black/20 backdrop-blur-sm border-t border-white/10">
      {state.players.map((p) => {
        const cfg = getPlayerConfig(p.id);
        return (
          <div
            key={p.id}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: `${cfg.color}22`,
              border: `1px solid ${cfg.color}44`,
              color: cfg.color,
            }}
          >
            <span>{cfg.emoji}</span>
            <span>{p.name}</span>
            <span className="text-white/80 font-black">{p.score}</span>
          </div>
        );
      })}
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
    'fire-result', 'fire-subtype', 'trap-result', 'trap-answerer'
  ].includes(state.phase);

  return (
    <div className="relative min-h-screen">
      {/* Top bar */}
      <div className="pt-10">
        {/* Player layout */}
        {state.playerCount === 2 && <TwoPlayerLayout />}
        {state.playerCount === 3 && <ThreePlayerLayout />}
        {state.playerCount === 4 && <FourPlayerLayout />}
      </div>

      {/* Score bar */}
      <ScoreBar />

      {/* Top bar overlay */}
      <GameTopBar />

      {/* Win declaration modal flow */}
      {isModalOpen && <WinDeclaration />}
    </div>
  );
}
