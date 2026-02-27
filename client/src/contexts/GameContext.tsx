// ============================================================
// 百分戰局 Percent Battle — Game State Context
// Design: Playful Classroom Chalkboard
// ============================================================

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  GameState,
  GamePhase,
  PlayerCount,
  WinType,
  FireSubType,
  WinDeclaration,
  Player,
  ScoreEvent,
  createPlayers,
  drawRandomContextCard,
  calculateScoreChanges,
  WIN_SCORE,
} from '@/lib/gameData';

type GameAction =
  | { type: 'SET_PLAYER_COUNT'; count: PlayerCount }
  | { type: 'START_GAME' }
  | { type: 'SKIP_TUTORIAL' }
  | { type: 'START_CARD_DRAW' }
  | { type: 'FINISH_CARD_DRAW' }
  | { type: 'DRAW_NEW_CARD' }
  | { type: 'DECLARE_WIN'; playerId: number }
  | { type: 'CHOOSE_WIN_TYPE'; winType: WinType }
  | { type: 'SET_PHOTO'; photoDataUrl: string }
  | { type: 'SET_AI_RESULT'; isValid: boolean; message: string; reasoning: string }
  | { type: 'SET_CARD_COUNT'; cardCount: number }
  | { type: 'CHOOSE_FIRE_SUBTYPE'; subType: FireSubType; raidTargetId?: number }
  | { type: 'CHOOSE_TRAP_ANSWERER'; answererId: number | null; answererCardCount?: number }
  | { type: 'CONFIRM_ROUND_END' }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'CANCEL_DECLARATION' }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  phase: 'setup',
  playerCount: 2,
  players: [],
  currentContextCard: null,
  activeDeclaration: null,
  declaringPlayerId: null,
  round: 0,
  scoreLog: [],
  winnerId: null,
  lastRoundSummary: null,
};

function applyScoreChanges(
  players: Player[],
  changes: Array<{ playerId: number; delta: number; reason: string }>,
  round: number,
  scoreLog: ScoreEvent[]
): { players: Player[]; scoreLog: ScoreEvent[]; winnerId: number | null } {
  let winnerId: number | null = null;
  const newPlayers = players.map((p) => {
    const change = changes.find((c) => c.playerId === p.id);
    if (!change || change.delta === 0) return p;
    const newTotal = Math.max(0, p.totalScore + change.delta);
    return { ...p, totalScore: newTotal };
  });

  // Check win condition
  for (const p of newPlayers) {
    if (p.totalScore >= WIN_SCORE) {
      winnerId = p.id;
      break;
    }
  }

  const newLog: ScoreEvent[] = [
    ...scoreLog,
    ...changes
      .filter((c) => c.delta !== 0)
      .map((c) => ({ round, playerId: c.playerId, delta: c.delta, reason: c.reason })),
  ];

  return { players: newPlayers, scoreLog: newLog, winnerId };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_COUNT':
      return { ...state, playerCount: action.count };

    case 'START_GAME':
      return {
        ...state,
        phase: 'tutorial',
        players: createPlayers(state.playerCount),
        currentContextCard: drawRandomContextCard(),
        activeDeclaration: null,
        declaringPlayerId: null,
        round: 1,
        scoreLog: [],
        winnerId: null,
        lastRoundSummary: null,
      };

    case 'SKIP_TUTORIAL':
      return { ...state, phase: 'card-draw' };

    case 'START_CARD_DRAW':
      return { ...state, phase: 'card-draw' };

    case 'FINISH_CARD_DRAW':
      return { ...state, phase: 'playing' };

    case 'DRAW_NEW_CARD':
      return {
        ...state,
        currentContextCard: drawRandomContextCard(),
      };

    case 'DECLARE_WIN':
      return {
        ...state,
        phase: 'win-declare',
        declaringPlayerId: action.playerId,
        activeDeclaration: {
          playerId: action.playerId,
          winType: 'fire',
        },
      };

    case 'CHOOSE_WIN_TYPE':
      return {
        ...state,
        phase: 'fire-photo',
        activeDeclaration: state.activeDeclaration
          ? { ...state.activeDeclaration, winType: action.winType }
          : null,
      };

    case 'SET_PHOTO':
      return {
        ...state,
        phase: 'fire-verify',
        activeDeclaration: state.activeDeclaration
          ? { ...state.activeDeclaration, photoDataUrl: action.photoDataUrl }
          : null,
      };

    case 'SET_AI_RESULT':
      return {
        ...state,
        phase: state.activeDeclaration?.winType === 'fire' ? 'fire-result' : 'trap-result',
        activeDeclaration: state.activeDeclaration
          ? {
              ...state.activeDeclaration,
              aiVerified: action.isValid,
              aiMessage: action.message,
              aiReasoning: action.reasoning,
            }
          : null,
      };

    case 'SET_CARD_COUNT':
      return {
        ...state,
        activeDeclaration: state.activeDeclaration
          ? { ...state.activeDeclaration, cardCount: action.cardCount }
          : null,
      };

    case 'CHOOSE_FIRE_SUBTYPE': {
      // Build the complete declaration with subtype and optional raidTarget
      const updatedDecl: WinDeclaration = {
        ...state.activeDeclaration!,
        fireSubType: action.subType,
        raidTargetId: action.raidTargetId,
      };

      // Calculate score changes
      const changes = calculateScoreChanges(updatedDecl, state.players);
      const { players, scoreLog, winnerId } = applyScoreChanges(
        state.players,
        changes,
        state.round,
        state.scoreLog
      );

      const summary = { events: changes };

      return {
        ...state,
        phase: winnerId ? 'game-over' : 'round-end',
        players,
        scoreLog,
        winnerId,
        activeDeclaration: updatedDecl,
        declaringPlayerId: null,
        lastRoundSummary: summary,
      };
    }

    case 'CHOOSE_TRAP_ANSWERER': {
      const updatedDecl: WinDeclaration = {
        ...state.activeDeclaration!,
        trapAnswererId: action.answererId ?? undefined,
        answererCardCount: action.answererCardCount,
      };

      const changes = calculateScoreChanges(updatedDecl, state.players);
      const { players, scoreLog, winnerId } = applyScoreChanges(
        state.players,
        changes,
        state.round,
        state.scoreLog
      );

      const summary = { events: changes };

      return {
        ...state,
        phase: winnerId ? 'game-over' : 'round-end',
        players,
        scoreLog,
        winnerId,
        activeDeclaration: updatedDecl,
        declaringPlayerId: null,
        lastRoundSummary: summary,
      };
    }

    case 'CONFIRM_ROUND_END':
      // Start next round: draw new card with animation, reset round scores, keep totalScores
      return {
        ...state,
        phase: 'card-draw',
        currentContextCard: drawRandomContextCard(),
        activeDeclaration: null,
        declaringPlayerId: null,
        round: state.round + 1,
        lastRoundSummary: null,
        // Reset per-round score (totalScore persists)
        players: state.players.map((p) => ({ ...p, score: 0 })),
      };

    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'CANCEL_DECLARATION':
      return {
        ...state,
        phase: 'playing',
        activeDeclaration: null,
        declaringPlayerId: null,
      };

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  setPlayerCount: (count: PlayerCount) => void;
  startGame: () => void;
  skipTutorial: () => void;
  finishCardDraw: () => void;
  drawNewCard: () => void;
  declareWin: (playerId: number) => void;
  chooseWinType: (winType: WinType) => void;
  setPhoto: (dataUrl: string) => void;
  setAIResult: (isValid: boolean, message: string, reasoning: string) => void;
  setCardCount: (count: number) => void;
  chooseFireSubtype: (subType: FireSubType, raidTargetId?: number) => void;
  chooseTrapAnswerer: (answererId: number | null, answererCardCount?: number) => void;
  confirmRoundEnd: () => void;
  setPhase: (phase: GamePhase) => void;
  cancelDeclaration: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setPlayerCount = useCallback((count: PlayerCount) =>
    dispatch({ type: 'SET_PLAYER_COUNT', count }), []);
  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const skipTutorial = useCallback(() => dispatch({ type: 'SKIP_TUTORIAL' }), []);
  const finishCardDraw = useCallback(() => dispatch({ type: 'FINISH_CARD_DRAW' }), []);
  const drawNewCard = useCallback(() => dispatch({ type: 'DRAW_NEW_CARD' }), []);
  const declareWin = useCallback((playerId: number) =>
    dispatch({ type: 'DECLARE_WIN', playerId }), []);
  const chooseWinType = useCallback((winType: WinType) =>
    dispatch({ type: 'CHOOSE_WIN_TYPE', winType }), []);
  const setPhoto = useCallback((photoDataUrl: string) =>
    dispatch({ type: 'SET_PHOTO', photoDataUrl }), []);
  const setAIResult = useCallback((isValid: boolean, message: string, reasoning: string) =>
    dispatch({ type: 'SET_AI_RESULT', isValid, message, reasoning }), []);
  const setCardCount = useCallback((cardCount: number) =>
    dispatch({ type: 'SET_CARD_COUNT', cardCount }), []);
  const chooseFireSubtype = useCallback((subType: FireSubType, raidTargetId?: number) =>
    dispatch({ type: 'CHOOSE_FIRE_SUBTYPE', subType, raidTargetId }), []);
  const chooseTrapAnswerer = useCallback((answererId: number | null, answererCardCount?: number) =>
    dispatch({ type: 'CHOOSE_TRAP_ANSWERER', answererId, answererCardCount }), []);
  const confirmRoundEnd = useCallback(() =>
    dispatch({ type: 'CONFIRM_ROUND_END' }), []);
  const setPhase = useCallback((phase: GamePhase) =>
    dispatch({ type: 'SET_PHASE', phase }), []);
  const cancelDeclaration = useCallback(() =>
    dispatch({ type: 'CANCEL_DECLARATION' }), []);
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), []);

  return (
    <GameContext.Provider value={{
      state,
      setPlayerCount,
      startGame,
      skipTutorial,
      finishCardDraw,
      drawNewCard,
      declareWin,
      chooseWinType,
      setPhoto,
      setAIResult,
      setCardCount,
      chooseFireSubtype,
      chooseTrapAnswerer,
      confirmRoundEnd,
      setPhase,
      cancelDeclaration,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
