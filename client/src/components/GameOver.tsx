// ============================================================
// 百分戰局 — Game Over Screen (Candy Pop Design)
// Shows winner and final scores, allows returning to home
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { getPlayerConfig, WIN_SCORE } from '@/lib/gameData';
import { useEffect, useState } from 'react';

function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; color: string; delay: number; duration: number; size: number;
  }>>([]);

  useEffect(() => {
    const colors = [
      'oklch(0.75 0.22 55)',
      'oklch(0.65 0.25 28)',
      'oklch(0.68 0.22 220)',
      'oklch(0.65 0.22 145)',
      'oklch(0.72 0.20 290)',
      'oklch(0.70 0.24 15)',
    ];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s infinite`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function GameOver() {
  const { state, resetGame } = useGame();
  const winnerId = state.winnerId;
  const winner = state.players.find((p) => p.id === winnerId);
  const winnerCfg = winnerId ? getPlayerConfig(winnerId) : null;

  const sortedPlayers = [...state.players].sort((a, b) => b.totalScore - a.totalScore);
  const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣'];

  return (
    <>
      <Confetti />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ background: 'oklch(0.98 0.04 220 / 0.92)', backdropFilter: 'blur(8px)' }}
      >
        <div className="relative w-full max-w-sm my-4 animate-bounce-in">
          <div className="chalk-card p-6">
            {/* Winner announcement */}
            {winner && winnerCfg && (
              <div className="text-center mb-6">
                <div className="text-6xl mb-3 animate-bounce">🏆</div>
                <h2
                  className="font-black text-2xl mb-1"
                  style={{ color: winnerCfg.color, fontFamily: "'Noto Sans TC', sans-serif" }}
                >
                  {winner.name} 獲勝！
                </h2>
                <p className="text-slate-500 text-sm">
                  達到{' '}
                  <span
                    className="font-black"
                    style={{ color: 'oklch(0.55 0.20 55)' }}
                  >
                    {winner.totalScore}
                  </span>{' '}
                  分！
                </p>
                <div
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-md"
                  style={{
                    backgroundColor: `${winnerCfg.color}15`,
                    borderColor: `${winnerCfg.color}50`,
                  }}
                >
                  <span className="text-2xl">{winnerCfg.emoji}</span>
                  <span className="font-black text-slate-800">{winner.name}</span>
                  <span className="font-black" style={{ color: winnerCfg.color }}>
                    {winner.totalScore} 分
                  </span>
                </div>
              </div>
            )}

            <div className="w-full h-px bg-slate-200 mb-5" />

            {/* Final leaderboard */}
            <h3
              className="text-slate-500 text-sm font-semibold text-center mb-4"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              最終排名
            </h3>
            <div className="flex flex-col gap-2 mb-6">
              {sortedPlayers.map((p, idx) => {
                const cfg = getPlayerConfig(p.id);
                const pct = Math.min(100, (p.totalScore / WIN_SCORE) * 100);
                const isWinner = p.id === winnerId;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isWinner ? 'scale-[1.02]' : ''
                    }`}
                    style={{
                      backgroundColor: `${cfg.color}${isWinner ? '18' : '0a'}`,
                      borderColor: `${cfg.color}${isWinner ? '55' : '25'}`,
                      boxShadow: isWinner ? `0 4px 16px ${cfg.color}30` : 'none',
                    }}
                  >
                    <span className="text-xl w-7 text-center">{rankEmojis[idx]}</span>
                    <span className="text-xl">{cfg.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-bold text-sm">{p.name}</p>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}cc)`,
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className="font-black text-xl flex-shrink-0"
                      style={{ color: cfg.color, fontFamily: "'Nunito', sans-serif" }}
                    >
                      {p.totalScore}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Game stats */}
            <div
              className="rounded-xl p-3 mb-5 border text-center"
              style={{
                background: 'oklch(0.97 0.04 220)',
                borderColor: 'oklch(0.85 0.08 220)',
              }}
            >
              <p className="text-slate-500 text-xs">
                共進行了{' '}
                <span
                  className="font-black"
                  style={{ color: 'oklch(0.55 0.20 55)' }}
                >
                  {state.round}
                </span>{' '}
                個回合
              </p>
            </div>

            {/* Return to home button */}
            <button
              onClick={resetGame}
              className="w-full chalk-btn py-3 text-white font-black text-base shadow-lg transition-all hover:scale-[1.02]"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                background: 'linear-gradient(135deg, oklch(0.68 0.24 28), oklch(0.72 0.22 15))',
                boxShadow: '0 4px 20px oklch(0.68 0.24 28 / 0.40)',
              }}
            >
              🏠 返回主頁，再玩一次！
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
