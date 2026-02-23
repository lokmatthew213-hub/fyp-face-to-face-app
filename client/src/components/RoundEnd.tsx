// ============================================================
// 百分戰局 — Round End Summary Screen (Candy Pop Design)
// Shows score changes for the round, then starts next round
// ============================================================

import { useGame } from '@/contexts/GameContext';
import { getPlayerConfig, WIN_SCORE } from '@/lib/gameData';

export default function RoundEnd() {
  const { state, confirmRoundEnd } = useGame();
  const summary = state.lastRoundSummary;

  if (!summary) return null;

  const events = summary.events.filter((e) => e.delta !== 0);
  const zeroEvents = summary.events.filter((e) => e.delta === 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 win-overlay">
      <div className="relative w-full max-w-sm animate-bounce-in">
        <div className="chalk-card p-6">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="text-4xl mb-2">🏁</div>
            <h2
              className="font-black text-xl"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: 'oklch(0.55 0.20 55)',
              }}
            >
              回合結束！
            </h2>
            <p className="text-slate-400 text-xs mt-1">第 {state.round} 回合</p>
          </div>

          {/* Score changes */}
          <div className="flex flex-col gap-2 mb-5">
            {events.map((event, i) => {
              const player = state.players.find((p) => p.id === event.playerId);
              const cfg = getPlayerConfig(event.playerId);
              const isPositive = event.delta > 0;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{
                    backgroundColor: `${cfg.color}12`,
                    borderColor: `${cfg.color}35`,
                  }}
                >
                  <span className="text-xl">{cfg.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-bold text-sm truncate">{player?.name ?? cfg.name}</p>
                    <p className="text-slate-400 text-xs truncate">{event.reason}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span
                      className="font-black text-lg"
                      style={{
                        color: isPositive ? 'oklch(0.55 0.22 145)' : 'oklch(0.55 0.22 25)',
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      {isPositive ? '+' : ''}{event.delta}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Zero-delta events */}
            {zeroEvents.map((event, i) => {
              const player = state.players.find((p) => p.id === event.playerId);
              const cfg = getPlayerConfig(event.playerId);
              return (
                <div
                  key={`zero-${i}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <span className="text-xl">{cfg.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-500 font-bold text-sm truncate">{player?.name ?? cfg.name}</p>
                    <p className="text-slate-400 text-xs truncate">{event.reason}</p>
                  </div>
                  <span
                    className="text-slate-400 font-black text-lg"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    +0
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total scores */}
          <div
            className="rounded-xl p-4 mb-5 border"
            style={{
              background: 'oklch(0.97 0.04 220)',
              borderColor: 'oklch(0.85 0.08 220)',
            }}
          >
            <p
              className="text-slate-500 text-xs font-semibold text-center mb-3"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              目前總分
            </p>
            <div className="flex justify-around gap-2 flex-wrap">
              {state.players.map((p) => {
                const cfg = getPlayerConfig(p.id);
                const pct = Math.min(100, (p.totalScore / WIN_SCORE) * 100);
                return (
                  <div key={p.id} className="flex flex-col items-center gap-1 min-w-[60px]">
                    <span className="text-xl">{cfg.emoji}</span>
                    <span className="text-slate-600 text-xs font-semibold">{p.name}</span>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}cc)`,
                        }}
                      />
                    </div>
                    <span
                      className="font-black text-base"
                      style={{ color: cfg.color, fontFamily: "'Nunito', sans-serif" }}
                    >
                      {p.totalScore}
                    </span>
                    <span className="text-slate-400 text-xs">/ {WIN_SCORE}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next round button */}
          <button
            onClick={confirmRoundEnd}
            className="w-full chalk-btn py-3 text-white font-black text-sm shadow-lg transition-all hover:scale-[1.02]"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              background: 'linear-gradient(135deg, oklch(0.68 0.24 28), oklch(0.72 0.22 15))',
              boxShadow: '0 4px 16px oklch(0.68 0.24 28 / 0.35)',
            }}
          >
            🎴 下一回合！抽新情境牌
          </button>
        </div>
      </div>
    </div>
  );
}
