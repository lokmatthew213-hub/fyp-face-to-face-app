// ============================================================
// 百分戰局 — Win Declaration Flow
// Design: Playful Classroom Chalkboard
// Handles: 火力全開 (自摸/突襲) and 設下陷阱 (出題) flows
// ============================================================

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { getPlayerConfig, buildFirePrompt, buildTrapPrompt } from '@/lib/gameData';
import { verifyWithAI } from '@/lib/aiVerify';

const WIN_BADGE_URL = 'https://private-us-east-1.manuscdn.com/sessionFile/YKZsA5G4m0dseKBDQdO6Uw/sandbox/UfXXk2fX5Z6axyLj7gwYqo-img-4_1771830805000_na1fn_cGItd2luLWJhZGdl.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvWUtac0E1RzRtMGRzZUtCRFFkTzZVdy9zYW5kYm94L1VmWFhrMmZYNVo2YXh5TGo3Z3dZcW8taW1nLTRfMTc3MTgzMDgwNTAwMF9uYTFmbl9jR0l0ZDJsdUxXSmhaR2RsLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=h0saZGLyjfRRkNC83HZVyMrMEYtPXbVJz3qZdO5-3PjS26tSzCXCERhZ-Jg6L5FFt9s5ZaeCw~pqJobYvfEBVAN8-A7jdoaUom348Ox5b2YOxcpFaTBTl-kV0TJ2jxZWeZpS68j4BwCeKaFxf3VIPs8rKKH73MjtMIZacLrEH4eTORewrGKtXICnTQ5yndQsPeGQoTzfAOJI1ny56yJVVJEZGIGrYXlL9Fm9GS2M4SXXjS7T2KyWBj2SzxuEL6YDxOPTwhtjQrFWoUZyIaXe7tzlWnnpJYNTdsrNAQe4Hm~DLCelgi3eNUW9TszGWV6JpoJMgUVQONXm9Jl2ydU5hA__';

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
            className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 flex items-center justify-center text-sm transition-all"
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
// Step 1: Choose win type
// ============================================================
function WinTypeStep() {
  const { state, chooseWinType, cancelDeclaration, setPhase } = useGame();
  const playerId = state.declaringPlayerId!;
  const config = getPlayerConfig(playerId);

  return (
    <ModalOverlay onClose={cancelDeclaration}>
      <div className="chalk-card p-6">
        {/* Player header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl"
            style={{ borderColor: config.color, backgroundColor: `${config.color}22` }}
          >
            {config.emoji}
          </div>
          <div>
            <h3 className="text-white font-black text-lg" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
              {config.name}
            </h3>
            <p className="text-white/60 text-sm">選擇你的勝利方式！</p>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-5" />

        {/* Win type buttons */}
        <div className="flex flex-col gap-3">
          {/* 火力全開 */}
          <button
            onClick={() => {
              chooseWinType('fire');
            }}
            className="chalk-btn flex items-start gap-4 p-4 bg-orange-500/15 border-2 border-orange-500/40 hover:bg-orange-500/25 hover:border-orange-500/70 text-left transition-all"
          >
            <span className="text-3xl mt-0.5">🔥</span>
            <div>
              <div className="text-white font-black text-base" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
                火力全開
              </div>
              <div className="text-orange-400 text-xs font-semibold mb-1">自摸食糊</div>
              <p className="text-white/60 text-xs leading-relaxed">
                我已拼出完整的百分數算式！<br />
                拍照讓 AI 幫你驗證！
              </p>
            </div>
          </button>

          {/* 設下陷阱 */}
          <button
            onClick={() => {
              chooseWinType('trap');
            }}
            className="chalk-btn flex items-start gap-4 p-4 bg-purple-500/15 border-2 border-purple-500/40 hover:bg-purple-500/25 hover:border-purple-500/70 text-left transition-all"
          >
            <span className="text-3xl mt-0.5">🪤</span>
            <div>
              <div className="text-white font-black text-base" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
                設下陷阱
              </div>
              <div className="text-purple-400 text-xs font-semibold mb-1">出題</div>
              <p className="text-white/60 text-xs leading-relaxed">
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
// Step 2: Photo capture
// ============================================================
function PhotoStep() {
  const { state, setPhoto, cancelDeclaration } = useGame();
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
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
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
            className="w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl"
            style={{ borderColor: config.color, backgroundColor: `${config.color}22` }}
          >
            {isFireMode ? '🔥' : '🪤'}
          </div>
          <div>
            <h3 className="text-white font-black" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
              {isFireMode ? '拍照驗證算式' : '拍照驗證問題'}
            </h3>
            <p className="text-white/60 text-xs">
              {isFireMode
                ? '把你的卡牌排好，拍一張清楚的照片'
                : '把你的問題卡排好，拍一張清楚的照片'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
          <p className="text-white/70 text-xs leading-relaxed">
            {isFireMode
              ? '📸 請確保照片清楚顯示所有卡牌，包括：顏色牌、數字牌、符號牌（/、×100%）'
              : '📸 請確保照片清楚顯示問題卡牌，包括：顏色牌、「百分之幾？」牌'}
          </p>
        </div>

        {/* Upload zone */}
        <div
          className="photo-upload-zone p-4 mb-4 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="預覽"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
              <button
                onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="py-6">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-white/60 text-sm font-semibold">點擊拍照 / 選擇圖片</p>
              <p className="text-white/40 text-xs mt-1">或拖放圖片到這裡</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />

        {error && (
          <p className="text-red-400 text-xs text-center mb-3">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={cancelDeclaration}
            className="flex-1 chalk-btn py-3 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 text-sm"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!preview}
            className={`
              flex-1 chalk-btn py-3 font-black text-sm transition-all
              ${preview
                ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-500/30'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
              }
            `}
            style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
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
  const [retryCount, setRetryCount] = useState(0);

  const isFireMode = state.activeDeclaration?.winType === 'fire';
  const card = state.currentContextCard!;
  const photo = state.activeDeclaration?.photoDataUrl!;

  useEffect(() => {
    let cancelled = false;

    const runVerification = async () => {
      setError(null);
      try {
        const prompt = isFireMode ? buildFirePrompt(card) : buildTrapPrompt(card);
        const result = await verifyWithAI(photo, prompt);
        if (!cancelled) {
          setAIResult(result.isValid, result.message, result.reasoning);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'AI 驗證失敗，請重試');
        }
      }
    };

    runVerification();

    return () => {
      cancelled = true;
    };
  }, [retryCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ModalOverlay>
      <div className="chalk-card p-8 text-center">
        <div className="text-6xl mb-4" style={{ animation: 'bounce 1s ease-in-out infinite' }}>🤖</div>
        <h3
          className="text-white font-black text-xl mb-2"
          style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
        >
          AI 老師正在判斷...
        </h3>
        <p className="text-white/60 text-sm mb-6">
          {isFireMode ? '檢查算式是否完整正確...' : '檢查問題是否有效...'}
        </p>

        {/* Loading dots */}
        {!error && (
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-yellow-400"
                style={{
                  animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="text-white/70 text-xs border border-white/20 rounded px-3 py-1 hover:bg-white/10 transition-colors"
            >
              🔄 重試
            </button>
          </div>
        )}

        <button
          onClick={cancelDeclaration}
          className="text-white/40 text-xs hover:text-white/70 transition-colors"
        >
          取消
        </button>
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// Step 4a: Fire result (火力全開 result)
// ============================================================
function FireResultStep() {
  const { state, setPhase, cancelDeclaration } = useGame();
  const decl = state.activeDeclaration!;
  const config = getPlayerConfig(decl.playerId);
  const isValid = decl.aiVerified ?? false;

  return (
    <ModalOverlay>
      <div className="chalk-card p-6">
        {/* Result header */}
        <div className="text-center mb-5">
          {isValid ? (
            <>
              <img src={WIN_BADGE_URL} alt="百分百!" className="w-24 h-24 mx-auto mb-3 animate-bounce-in" />
              <h3
                className="text-yellow-400 font-black text-2xl"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                🎉 算式正確！
              </h3>
              <p className="text-white/70 text-sm mt-1">{decl.aiMessage}</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-3">❌</div>
              <h3
                className="text-red-400 font-black text-2xl"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                算式不合格
              </h3>
              <p className="text-white/70 text-sm mt-1">{decl.aiMessage}</p>
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
            <p
              className="text-center text-white/70 text-sm mb-4"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              {config.name}，你是怎麼贏的？
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setPhase('fire-subtype')}
                className="chalk-btn py-3 bg-green-500/20 border-2 border-green-500/40 hover:bg-green-500/30 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <span>🙌</span>
                <span style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>自摸 — 我自己拼出來的！</span>
              </button>
              <button
                onClick={() => setPhase('fire-subtype')}
                className="chalk-btn py-3 bg-orange-500/20 border-2 border-orange-500/40 hover:bg-orange-500/30 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>突襲 — 我搶了別人的牌！</span>
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={cancelDeclaration}
            className="w-full chalk-btn py-3 bg-white/10 border border-white/20 text-white font-bold text-sm"
          >
            返回遊戲
          </button>
        )}
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// Step 4b: Fire subtype selection (自摸 vs 突襲)
// ============================================================
function FireSubtypeStep() {
  const { state, chooseFireSubtype, chooseRaidTarget, cancelDeclaration } = useGame();
  const decl = state.activeDeclaration!;
  const config = getPlayerConfig(decl.playerId);

  const otherPlayers = state.players.filter((p) => p.id !== decl.playerId);

  const [subType, setSubType] = useState<'self' | 'raid' | null>(null);
  const [raidTarget, setRaidTarget] = useState<number | null>(null);

  const handleConfirm = () => {
    if (subType === 'self') {
      chooseFireSubtype('self');
    } else if (subType === 'raid' && raidTarget) {
      chooseRaidTarget(raidTarget);
      chooseFireSubtype('raid');
    }
  };

  return (
    <ModalOverlay onClose={cancelDeclaration}>
      <div className="chalk-card p-5">
        <h3
          className="text-white font-black text-lg mb-4 text-center"
          style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
        >
          🏆 {config.name} 的勝利方式
        </h3>

        <div className="flex flex-col gap-3 mb-5">
          {/* 自摸 */}
          <button
            onClick={() => { setSubType('self'); setRaidTarget(null); }}
            className={`
              chalk-btn flex items-center gap-3 p-4 border-2 text-left transition-all
              ${subType === 'self'
                ? 'bg-green-500/25 border-green-400 shadow-lg shadow-green-500/20'
                : 'bg-white/5 border-white/20 hover:bg-white/10'}
            `}
          >
            <span className="text-2xl">🙌</span>
            <div>
              <div className="text-white font-black" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
                自摸
              </div>
              <div className="text-white/60 text-xs">我自己從牌堆摸到最後一張牌</div>
            </div>
            {subType === 'self' && <span className="ml-auto text-green-400 text-lg">✓</span>}
          </button>

          {/* 突襲 */}
          <button
            onClick={() => setSubType('raid')}
            className={`
              chalk-btn flex items-center gap-3 p-4 border-2 text-left transition-all
              ${subType === 'raid'
                ? 'bg-orange-500/25 border-orange-400 shadow-lg shadow-orange-500/20'
                : 'bg-white/5 border-white/20 hover:bg-white/10'}
            `}
          >
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-white font-black" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
                突襲
              </div>
              <div className="text-white/60 text-xs">我搶了別人棄掉的牌</div>
            </div>
            {subType === 'raid' && <span className="ml-auto text-orange-400 text-lg">✓</span>}
          </button>
        </div>

        {/* If raid: choose who threw the card */}
        {subType === 'raid' && (
          <div className="mb-5">
            <p
              className="text-white/70 text-sm font-semibold mb-3 text-center"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              哪位玩家打出了那張牌？
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {otherPlayers.map((p) => {
                const pc = getPlayerConfig(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => setRaidTarget(p.id)}
                    className={`
                      flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                      ${raidTarget === p.id
                        ? 'scale-105 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'}
                    `}
                    style={raidTarget === p.id
                      ? { borderColor: pc.color, backgroundColor: `${pc.color}22`, boxShadow: `0 0 12px ${pc.color}60` }
                      : {}}
                  >
                    <span className="text-2xl">{pc.emoji}</span>
                    <span className="text-xs font-bold text-white/80">{p.name}</span>
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
          className={`
            w-full chalk-btn py-3 font-black text-sm transition-all
            ${(subType && (subType !== 'raid' || raidTarget))
              ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-500/30'
              : 'bg-white/10 text-white/30 cursor-not-allowed'}
          `}
          style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
        >
          ✅ 確認得分！
        </button>
      </div>
    </ModalOverlay>
  );
}

// ============================================================
// Step 5: Trap result (設下陷阱 result)
// ============================================================
function TrapResultStep() {
  const { state, cancelDeclaration, chooseTrapAnswerer } = useGame();
  const decl = state.activeDeclaration!;
  const isValid = decl.aiVerified ?? false;

  const otherPlayers = state.players.filter((p) => p.id !== decl.playerId);
  const [answerer, setAnswerer] = useState<number | null>(null);
  const [noAnswer, setNoAnswer] = useState(false);

  const handleConfirm = () => {
    if (noAnswer) {
      chooseTrapAnswerer(null);
    } else if (answerer) {
      chooseTrapAnswerer(answerer);
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
                className="text-purple-400 font-black text-xl"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                問題有效！陷阱設下了！
              </h3>
              <p className="text-white/70 text-sm mt-1">{decl.aiMessage}</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">❌</div>
              <h3
                className="text-red-400 font-black text-xl"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                問題無效
              </h3>
              <p className="text-white/70 text-sm mt-1">{decl.aiMessage}</p>
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
            <p
              className="text-center text-white/70 text-sm mb-4"
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
                    className={`
                      flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                      ${answerer === p.id && !noAnswer
                        ? 'scale-105 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'}
                    `}
                    style={answerer === p.id && !noAnswer
                      ? { borderColor: pc.color, backgroundColor: `${pc.color}22`, boxShadow: `0 0 12px ${pc.color}60` }
                      : {}}
                  >
                    <span className="text-2xl">{pc.emoji}</span>
                    <span className="text-xs font-bold text-white/80">{p.name}</span>
                    <span className="text-xs text-white/50">答對了</span>
                  </button>
                );
              })}
            </div>

            {/* No one answered */}
            <button
              onClick={() => { setNoAnswer(true); setAnswerer(null); }}
              className={`
                w-full chalk-btn py-2.5 border-2 text-sm font-bold mb-4 transition-all
                ${noAnswer
                  ? 'bg-white/20 border-white/50 text-white'
                  : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'}
              `}
            >
              😶 沒有人答到（題目留在桌上）
            </button>

            <button
              onClick={handleConfirm}
              disabled={!answerer && !noAnswer}
              className={`
                w-full chalk-btn py-3 font-black text-sm transition-all
                ${(answerer || noAnswer)
                  ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'}
              `}
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              ✅ 確認結果！
            </button>
          </>
        ) : (
          <button
            onClick={cancelDeclaration}
            className="w-full chalk-btn py-3 bg-white/10 border border-white/20 text-white font-bold text-sm"
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
