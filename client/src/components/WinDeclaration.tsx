// ============================================================
// 百分戰局 — Win Declaration Flow (Candy Pop Design)
// Handles: 火力全開 (自摸/突襲) and 設下陷阱 (出題) flows
// ============================================================

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { getPlayerConfig, buildFirePrompt, buildTrapPrompt } from '@/lib/gameData';
import { verifyWithAI } from '@/lib/aiVerify';

// ============================================================
// Modal wrapper
// ============================================================
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 win-overlay">
      <div className="relative w-full max-w-md animate-bounce-in">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white border-2 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-400 flex items-center justify-center text-sm transition-all shadow-md"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

// ============================================================
// Card count stepper component
// ============================================================
function CardCountStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-slate-600 text-xs font-semibold text-center">{label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-slate-200 text-slate-700 text-xl font-black hover:bg-slate-200 transition-all flex items-center justify-center"
        >
          −
        </button>
        <div
          className="w-16 h-14 rounded-xl border-2 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, oklch(0.96 0.10 55), oklch(0.92 0.14 55))',
            borderColor: 'oklch(0.75 0.22 55)',
          }}
        >
          <span
            className="font-black text-2xl"
            style={{ color: 'oklch(0.45 0.20 55)', fontFamily: "'Nunito', sans-serif" }}
          >
            {value}
          </span>
        </div>
        <button
          onClick={() => onChange(Math.min(30, value + 1))}
          className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-slate-200 text-slate-700 text-xl font-black hover:bg-slate-200 transition-all flex items-center justify-center"
        >
          ＋
        </button>
      </div>
      <p className="text-slate-400 text-xs">張牌</p>
    </div>
  );
}

// ============================================================
// Step 1: Choose win type
// ============================================================
function WinTypeStep() {
  const { state, chooseWinType, cancelDeclaration } = useGame();
  const playerId = state.declaringPlayerId!;
  const config = getPlayerConfig(playerId);

  return (
    <ModalOverlay onClose={cancelDeclaration}>
      <div className="chalk-card p-6">
        {/* Player header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl shadow-md"
            style={{ borderColor: config.color, backgroundColor: `${config.color}18` }}
          >
            {config.emoji}
          </div>
          <div>
            <h3
              className="font-black text-lg text-slate-800"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              {config.name}
            </h3>
            <p className="text-slate-500 text-sm">選擇你的勝利方式！</p>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 mb-5" />

        {/* Win type buttons */}
        <div className="flex flex-col gap-3">
          {/* 火力全開 */}
          <button
            onClick={() => chooseWinType('fire')}
            className="chalk-btn flex items-start gap-4 p-4 text-left transition-all border-2 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, oklch(0.97 0.06 55), oklch(0.94 0.10 45))',
              borderColor: 'oklch(0.75 0.22 55)',
              boxShadow: '0 2px 12px oklch(0.75 0.22 55 / 0.20)',
            }}
          >
            <span className="text-3xl mt-0.5">🔥</span>
            <div>
              <div
                className="font-black text-base text-slate-800"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                火力全開
              </div>
              <div className="text-xs font-bold mb-1" style={{ color: 'oklch(0.55 0.20 45)' }}>
                自摸食糊
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                我已拼出完整的百分數算式！<br />
                拍照讓 AI 幫你驗證！
              </p>
            </div>
          </button>

          {/* 設下陷阱 */}
          <button
            onClick={() => chooseWinType('trap')}
            className="chalk-btn flex items-start gap-4 p-4 text-left transition-all border-2 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, oklch(0.97 0.06 290), oklch(0.94 0.10 280))',
              borderColor: 'oklch(0.72 0.20 290)',
              boxShadow: '0 2px 12px oklch(0.72 0.20 290 / 0.20)',
            }}
          >
            <span className="text-3xl mt-0.5">🪤</span>
            <div>
              <div
                className="font-black text-base text-slate-800"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                設下陷阱
              </div>
              <div className="text-xs font-bold mb-1" style={{ color: 'oklch(0.50 0.20 290)' }}>
                出題
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                我出了一條問題！<br />
                拍照讓 AI 確認問題是否有效！
              </p>
            </div>
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// Step 2: Photo capture — camera-first with fallback file picker
// ============================================================
function PhotoStep() {
  const { state, setPhoto, cancelDeclaration } = useGame();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isFireMode = state.activeDeclaration?.winType === 'fire';
  const playerId = state.declaringPlayerId!;
  const config = getPlayerConfig(playerId);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('請選擇圖片檔案');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('圖片太大，請選擇 10MB 以下的圖片');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleSubmit = () => {
    if (!preview) return;
    setPhoto(preview);
  };

  return (
    <ModalOverlay onClose={cancelDeclaration}>
      <div className="chalk-card p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl shadow-sm"
            style={{ borderColor: config.color, backgroundColor: `${config.color}18` }}
          >
            {isFireMode ? '🔥' : '🪤'}
          </div>
          <div>
            <h3
              className="font-black text-slate-800"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              {isFireMode ? '拍照驗證算式' : '拍照驗證問題'}
            </h3>
            <p className="text-slate-500 text-xs">
              {isFireMode
                ? '把你的卡牌排好，拍一張清楚的照片'
                : '把你的問題卡排好，拍一張清楚的照片'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="rounded-lg p-3 mb-4 border"
          style={{
            background: 'oklch(0.96 0.06 220)',
            borderColor: 'oklch(0.82 0.10 220)',
          }}
        >
          <p className="text-slate-600 text-xs leading-relaxed">
            {isFireMode
              ? '📸 請確保照片清楚顯示所有卡牌，包括：顏色牌、數字牌、符號牌（/、×100%）'
              : '📸 請確保照片清楚顯示問題卡牌，包括：顏色牌、「百分之幾？」牌'}
          </p>
        </div>

        {/* Preview area */}
        {preview ? (
          <div className="relative mb-4">
            <img
              src={preview}
              alt="預覽"
              className="w-full max-h-44 rounded-xl object-contain bg-slate-100"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-slate-200 text-slate-600 text-xs flex items-center justify-center hover:bg-white transition-all shadow-sm"
            >
              ✕
            </button>
            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm">
              ✓ 已選擇
            </div>
          </div>
        ) : (
          /* Camera / upload buttons */
          <div className="flex gap-3 mb-4">
            {/* Primary: Open camera directly */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 photo-upload-zone flex flex-col items-center justify-center gap-2 py-5 transition-all"
            >
              <span className="text-4xl">📷</span>
              <span
                className="text-slate-700 text-sm font-black"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                拍照
              </span>
              <span className="text-slate-400 text-xs">開啟相機</span>
            </button>

            {/* Secondary: Choose from gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 photo-upload-zone flex flex-col items-center justify-center gap-2 py-5 transition-all"
            >
              <span className="text-4xl">🖼️</span>
              <span
                className="text-slate-700 text-sm font-black"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                相簿
              </span>
              <span className="text-slate-400 text-xs">從相簿選擇</span>
            </button>
          </div>
        )}

        {/* Hidden inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {error && (
          <p className="text-red-500 text-xs text-center mb-3">{error}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={cancelDeclaration}
            className="flex-1 chalk-btn py-3 bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 text-sm font-semibold transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!preview}
            className={`
              flex-1 chalk-btn py-3 font-black text-sm transition-all
              ${preview
                ? 'text-white shadow-lg'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
            `}
            style={preview ? {
              background: 'linear-gradient(135deg, oklch(0.68 0.24 28), oklch(0.72 0.22 15))',
              boxShadow: '0 4px 14px oklch(0.68 0.24 28 / 0.35)',
              fontFamily: "'Noto Sans TC', sans-serif",
            } : {}}
          >
            🤖 AI 驗證！
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// Step 3: AI Verifying (loading state)
// ============================================================
function VerifyingStep() {
  const { state, setAIResult, cancelDeclaration } = useGame();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decl = state.activeDeclaration;
    if (!decl?.photoDataUrl || !state.currentContextCard) return;

    const isFireMode = decl.winType === 'fire';
    const prompt = isFireMode
      ? buildFirePrompt(state.currentContextCard)
      : buildTrapPrompt(state.currentContextCard);

    verifyWithAI(decl.photoDataUrl, prompt)
      .then((result) => {
        setAIResult(result.isValid, result.message, result.reasoning);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'AI 驗證失敗，請重試');
      });
  }, []);

  return (
    <ModalOverlay>
      <div className="chalk-card p-8 text-center">
        {error ? (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h3
              className="text-red-500 font-black text-lg mb-2"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              驗證失敗
            </h3>
            <p className="text-slate-500 text-sm mb-4">{error}</p>
            <button
              onClick={cancelDeclaration}
              className="chalk-btn px-6 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold"
            >
              返回重試
            </button>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4 animate-bounce">🤖</div>
            <h3
              className="font-black text-lg mb-2"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: 'oklch(0.55 0.20 55)',
              }}
            >
              AI 老師正在判斷...
            </h3>
            <p className="text-slate-500 text-sm">請稍候，AI 正在仔細看你的卡牌！</p>
            <div className="flex justify-center gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: 'oklch(0.75 0.22 55)',
                    animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// Step 4: Fire result + card count + subtype selection
// ============================================================
function FireResultStep() {
  const { state, cancelDeclaration, setPhase, setCardCount } = useGame();
  const decl = state.activeDeclaration!;
  const isValid = decl.aiVerified ?? false;
  const [cardCount, setLocalCardCount] = useState(decl.cardCount ?? 5);

  const handleProceed = () => {
    setCardCount(cardCount);
    setPhase('fire-subtype');
  };

  return (
    <ModalOverlay>
      <div className="chalk-card p-6">
        {/* Result header */}
        <div className="text-center mb-5">
          {isValid ? (
            <>
              <div className="text-5xl mb-3">🔥</div>
              <h3
                className="font-black text-xl"
                style={{ fontFamily: "'Noto Sans TC', sans-serif", color: 'oklch(0.55 0.22 45)' }}
              >
                算式正確！火力全開！
              </h3>
              <p className="text-slate-500 text-sm mt-1">{decl.aiMessage}</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">❌</div>
              <h3
                className="text-red-500 font-black text-xl"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                算式未通過
              </h3>
              <p className="text-slate-500 text-sm mt-1">{decl.aiMessage}</p>
            </>
          )}
        </div>

        {/* AI reasoning */}
        {decl.aiReasoning && (
          <div className={`rounded-lg p-3 mb-5 text-sm ${isValid ? 'ai-result-pass' : 'ai-result-fail'}`}>
            <p className="font-semibold mb-1">🤖 AI 老師說：</p>
            <p className="leading-relaxed">{decl.aiReasoning}</p>
          </div>
        )}

        {isValid ? (
          <>
            {/* Card count input */}
            <div
              className="rounded-xl p-4 mb-5 border"
              style={{
                background: 'oklch(0.97 0.04 220)',
                borderColor: 'oklch(0.85 0.08 220)',
              }}
            >
              <CardCountStepper
                value={cardCount}
                onChange={setLocalCardCount}
                label="你用了多少張牌來完成這條算式？"
              />
            </div>

            <button
              onClick={handleProceed}
              className="w-full chalk-btn py-3 text-white font-black text-sm shadow-lg transition-all hover:scale-[1.02]"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                background: 'linear-gradient(135deg, oklch(0.75 0.22 55), oklch(0.68 0.24 45))',
                boxShadow: '0 4px 16px oklch(0.75 0.22 55 / 0.35)',
              }}
            >
              下一步：選擇自摸或突襲 →
            </button>
          </>
        ) : (
          <button
            onClick={cancelDeclaration}
            className="w-full chalk-btn py-3 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm"
          >
            返回遊戲
          </button>
        )}
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// Step 5: Fire subtype (自摸 or 突襲) + raid target
// ============================================================
function FireSubtypeStep() {
  const { state, chooseFireSubtype, cancelDeclaration } = useGame();
  const decl = state.activeDeclaration!;
  const otherPlayers = state.players.filter((p) => p.id !== decl.playerId);

  const [subType, setSubType] = useState<'self' | 'raid' | null>(null);
  const [raidTarget, setRaidTarget] = useState<number | null>(null);

  const handleConfirm = () => {
    if (!subType) return;
    if (subType === 'self') {
      chooseFireSubtype('self');
    } else if (subType === 'raid' && raidTarget) {
      chooseFireSubtype('raid', raidTarget);
    }
  };

  const cardCount = decl.cardCount ?? 0;

  return (
    <ModalOverlay>
      <div className="chalk-card p-6">
        <h3
          className="text-slate-800 font-black text-lg text-center mb-2"
          style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
        >
          你是怎麼贏的？
        </h3>
        <p className="text-slate-400 text-xs text-center mb-5">
          用了{' '}
          <span className="font-black" style={{ color: 'oklch(0.55 0.20 55)' }}>
            {cardCount}
          </span>{' '}
          張牌
        </p>

        {/* Subtype buttons */}
        <div className="flex flex-col gap-3 mb-5">
          {/* 自摸 */}
          <button
            onClick={() => setSubType('self')}
            className="chalk-btn flex items-start gap-4 p-4 text-left transition-all border-2 hover:scale-[1.01]"
            style={subType === 'self' ? {
              background: 'linear-gradient(135deg, oklch(0.95 0.10 145), oklch(0.92 0.14 145))',
              borderColor: 'oklch(0.68 0.22 145)',
              boxShadow: '0 4px 16px oklch(0.68 0.22 145 / 0.25)',
            } : {
              background: 'oklch(0.97 0.03 220)',
              borderColor: 'oklch(0.85 0.07 220)',
            }}
          >
            <span className="text-2xl mt-0.5">✋</span>
            <div>
              <div
                className="font-black text-sm text-slate-800"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                自摸
              </div>
              <div
                className="text-xs font-bold mb-1"
                style={{ color: 'oklch(0.50 0.20 145)' }}
              >
                獲得 {cardCount} 分
              </div>
              <div className="text-slate-500 text-xs">我自己摸到了最後一張牌</div>
            </div>
            {subType === 'self' && (
              <span className="ml-auto text-lg" style={{ color: 'oklch(0.60 0.22 145)' }}>✓</span>
            )}
          </button>

          {/* 突襲 */}
          <button
            onClick={() => setSubType('raid')}
            className="chalk-btn flex items-start gap-4 p-4 text-left transition-all border-2 hover:scale-[1.01]"
            style={subType === 'raid' ? {
              background: 'linear-gradient(135deg, oklch(0.96 0.10 55), oklch(0.93 0.14 45))',
              borderColor: 'oklch(0.75 0.22 55)',
              boxShadow: '0 4px 16px oklch(0.75 0.22 55 / 0.25)',
            } : {
              background: 'oklch(0.97 0.03 220)',
              borderColor: 'oklch(0.85 0.07 220)',
            }}
          >
            <span className="text-2xl mt-0.5">⚡</span>
            <div>
              <div
                className="font-black text-sm text-slate-800"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                突襲
              </div>
              <div
                className="text-xs font-bold mb-1"
                style={{ color: 'oklch(0.55 0.22 45)' }}
              >
                出銃者失去 {cardCount} 分，你獲得 {cardCount} 分
              </div>
              <div className="text-slate-500 text-xs">我搶了別人棄掉的牌</div>
            </div>
            {subType === 'raid' && (
              <span className="ml-auto text-lg" style={{ color: 'oklch(0.65 0.22 55)' }}>✓</span>
            )}
          </button>
        </div>

        {/* If raid: choose who threw the card */}
        {subType === 'raid' && (
          <div className="mb-5">
            <p
              className="text-slate-600 text-sm font-semibold mb-3 text-center"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              哪位玩家打出了那張牌？（出銃者）
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {otherPlayers.map((p) => {
                const pc = getPlayerConfig(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => setRaidTarget(p.id)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all hover:scale-105"
                    style={raidTarget === p.id
                      ? { borderColor: pc.color, backgroundColor: `${pc.color}18`, boxShadow: `0 4px 14px ${pc.color}40` }
                      : { borderColor: 'oklch(0.85 0.07 220)', backgroundColor: 'oklch(0.97 0.03 220)' }}
                  >
                    <span className="text-2xl">{pc.emoji}</span>
                    <span className="text-xs font-bold text-slate-700">{p.name}</span>
                    <span className="text-xs font-semibold" style={{ color: 'oklch(0.55 0.22 45)' }}>
                      失去 {cardCount} 分
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={!subType || (subType === 'raid' && !raidTarget)}
          className="w-full chalk-btn py-3 font-black text-sm transition-all"
          style={(subType && (subType !== 'raid' || raidTarget)) ? {
            background: 'linear-gradient(135deg, oklch(0.68 0.24 28), oklch(0.72 0.22 15))',
            color: 'white',
            boxShadow: '0 4px 16px oklch(0.68 0.24 28 / 0.35)',
            fontFamily: "'Noto Sans TC', sans-serif",
          } : {
            backgroundColor: 'oklch(0.92 0.03 220)',
            color: 'oklch(0.70 0.03 220)',
            cursor: 'not-allowed',
          }}
        >
          ✅ 確認得分！
        </button>
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// Step 6: Trap result (設下陷阱 result + answerer selection)
// ============================================================
function TrapResultStep() {
  const { state, cancelDeclaration, chooseTrapAnswerer, setCardCount } = useGame();
  const decl = state.activeDeclaration!;
  const isValid = decl.aiVerified ?? false;

  const otherPlayers = state.players.filter((p) => p.id !== decl.playerId);
  const [answerer, setAnswerer] = useState<number | null>(null);
  const [noAnswer, setNoAnswer] = useState(false);
  const [proposerCardCount, setProposerCardCount] = useState(decl.cardCount ?? 5);
  const [answererCardCount, setAnswererCardCount] = useState(3);
  const [step, setStep] = useState<'cards' | 'answerer'>('cards');

  const handleProceedToAnswerer = () => {
    setCardCount(proposerCardCount);
    setStep('answerer');
  };

  const handleConfirm = () => {
    if (noAnswer) {
      chooseTrapAnswerer(null);
    } else if (answerer) {
      chooseTrapAnswerer(answerer, answererCardCount);
    }
  };

  return (
    <ModalOverlay>
      <div className="chalk-card p-6">
        {/* Result header */}
        <div className="text-center mb-5">
          {isValid ? (
            <>
              <div className="text-5xl mb-3">🪤</div>
              <h3
                className="font-black text-xl"
                style={{ fontFamily: "'Noto Sans TC', sans-serif", color: 'oklch(0.50 0.20 290)' }}
              >
                問題有效！陷阱設下了！
              </h3>
              <p className="text-slate-500 text-sm mt-1">{decl.aiMessage}</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">❌</div>
              <h3
                className="text-red-500 font-black text-xl"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                問題無效
              </h3>
              <p className="text-slate-500 text-sm mt-1">{decl.aiMessage}</p>
            </>
          )}
        </div>

        {/* AI reasoning */}
        {decl.aiReasoning && (
          <div className={`rounded-lg p-3 mb-5 text-sm ${isValid ? 'ai-result-pass' : 'ai-result-fail'}`}>
            <p className="font-semibold mb-1">🤖 AI 老師說：</p>
            <p className="leading-relaxed">{decl.aiReasoning}</p>
          </div>
        )}

        {isValid ? (
          step === 'cards' ? (
            <>
              <div
                className="rounded-xl p-4 mb-5 border"
                style={{
                  background: 'oklch(0.97 0.04 220)',
                  borderColor: 'oklch(0.85 0.08 220)',
                }}
              >
                <CardCountStepper
                  value={proposerCardCount}
                  onChange={setProposerCardCount}
                  label="出題者用了多少張牌出題？"
                />
              </div>
              <button
                onClick={handleProceedToAnswerer}
                className="w-full chalk-btn py-3 text-white font-black text-sm shadow-lg transition-all hover:scale-[1.02]"
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  background: 'linear-gradient(135deg, oklch(0.72 0.20 290), oklch(0.65 0.22 280))',
                  boxShadow: '0 4px 16px oklch(0.72 0.20 290 / 0.35)',
                }}
              >
                下一步：有人答題嗎？ →
              </button>
            </>
          ) : (
            <>
              <p
                className="text-center text-slate-600 text-sm mb-4 font-semibold"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                有沒有人答對了這條問題？
              </p>

              {/* Answerer selection */}
              <div className="flex gap-2 flex-wrap justify-center mb-4">
                {otherPlayers.map((p) => {
                  const pc = getPlayerConfig(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => { setAnswerer(p.id); setNoAnswer(false); }}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all hover:scale-105"
                      style={answerer === p.id && !noAnswer
                        ? { borderColor: pc.color, backgroundColor: `${pc.color}18`, boxShadow: `0 4px 14px ${pc.color}40` }
                        : { borderColor: 'oklch(0.85 0.07 220)', backgroundColor: 'oklch(0.97 0.03 220)' }}
                    >
                      <span className="text-2xl">{pc.emoji}</span>
                      <span className="text-xs font-bold text-slate-700">{p.name}</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: 'oklch(0.50 0.20 290)' }}
                      >
                        答對了
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Answerer card count */}
              {answerer && !noAnswer && (
                <div
                  className="rounded-xl p-4 mb-4 border"
                  style={{
                    background: 'oklch(0.97 0.04 220)',
                    borderColor: 'oklch(0.85 0.08 220)',
                  }}
                >
                  <CardCountStepper
                    value={answererCardCount}
                    onChange={setAnswererCardCount}
                    label="答題者用了多少張牌來回答？"
                  />
                  <p className="text-center text-slate-500 text-xs mt-3">
                    答題者將獲得：題目分 {proposerCardCount} + 答案分 {answererCardCount} ={' '}
                    <span
                      className="font-black"
                      style={{ color: 'oklch(0.55 0.20 55)' }}
                    >
                      {proposerCardCount + answererCardCount}
                    </span>{' '}
                    分
                  </p>
                </div>
              )}

              {/* No one answered */}
              <button
                onClick={() => { setNoAnswer(true); setAnswerer(null); }}
                className="w-full chalk-btn py-2.5 border-2 text-sm font-bold mb-4 transition-all"
                style={noAnswer ? {
                  background: 'oklch(0.93 0.06 220)',
                  borderColor: 'oklch(0.70 0.12 220)',
                  color: 'oklch(0.40 0.10 220)',
                } : {
                  background: 'oklch(0.97 0.03 220)',
                  borderColor: 'oklch(0.85 0.07 220)',
                  color: 'oklch(0.55 0.05 220)',
                }}
              >
                😶 沒有人答到（出題者得 {proposerCardCount} 分）
              </button>

              <button
                onClick={handleConfirm}
                disabled={!answerer && !noAnswer}
                className="w-full chalk-btn py-3 font-black text-sm transition-all"
                style={(answerer || noAnswer) ? {
                  background: 'linear-gradient(135deg, oklch(0.72 0.20 290), oklch(0.65 0.22 280))',
                  color: 'white',
                  boxShadow: '0 4px 16px oklch(0.72 0.20 290 / 0.35)',
                  fontFamily: "'Noto Sans TC', sans-serif",
                } : {
                  backgroundColor: 'oklch(0.92 0.03 220)',
                  color: 'oklch(0.70 0.03 220)',
                  cursor: 'not-allowed',
                }}
              >
                ✅ 確認結果！
              </button>
            </>
          )
        ) : (
          <button
            onClick={cancelDeclaration}
            className="w-full chalk-btn py-3 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm"
          >
            返回遊戲
          </button>
        )}
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// Main WinDeclaration orchestrator
// ============================================================
export default function WinDeclaration() {
  const { state } = useGame();

  switch (state.phase) {
    case 'win-declare':
      return <WinTypeStep />;
    case 'fire-photo':
      return <PhotoStep />;
    case 'fire-verify':
      return <VerifyingStep />;
    case 'fire-result':
      return <FireResultStep />;
    case 'fire-subtype':
      return <FireSubtypeStep />;
    case 'trap-result':
      return <TrapResultStep />;
    default:
      return null;
  }
}
