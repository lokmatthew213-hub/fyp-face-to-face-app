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
  createPlayers,
  drawRandomContextCard,
} from '@/lib/gameData';

type GameAction =
  | { type: 'SET_PLAYER_COUNT'; count: PlayerCount }
  | { type: 'START_GAME' }
  | { type: 'DRAW_NEW_CARD' }
  | { type: 'DECLARE_WIN'; playerId: number }
  | { type: 'CHOOSE_WIN_TYPE'; winType: WinType }
  | { type: 'SET_PHOTO'; photoDataUrl: string }
  | { type: 'SET_AI_RESULT'; isValid: boolean; message: string; reasoning: string }
  | { type: 'CHOOSE_FIRE_SUBTYPE'; subType: FireSubType }
  | { type: 'CHOOSE_RAID_TARGET'; targetId: number }
  | { type: 'CHOOSE_TRAP_ANSWERER'; answererId: number | null }
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
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_COUNT':
      return { ...state, playerCount: action.count };

    case 'START_GAME':
      return {
        ...state,
        phase: 'playing',
        players: createPlayers(state.playerCount),
        currentContextCard: drawRandomContextCard(),
        activeDeclaration: null,
        declaringPlayerId: null,
      };

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
        phase: action.winType === 'fire' ? 'fire-photo' : 'fire-photo',
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

    case 'CHOOSE_FIRE_SUBTYPE':
      return {
        ...state,
        // 'self' goes straight back to playing; 'raid' also returns to playing (raid target already set)
        phase: 'playing',
        activeDeclaration: state.activeDeclaration
          ? { ...state.activeDeclaration, fireSubType: action.subType }
          : null,
        declaringPlayerId: null,
      };

    case 'CHOOSE_RAID_TARGET':
      return {
        ...state,
        phase: 'playing',
        activeDeclaration: state.activeDeclaration
          ? { ...state.activeDeclaration, raidTargetId: action.targetId }
          : null,
        declaringPlayerId: null,
      };

    case 'CHOOSE_TRAP_ANSWERER':
      return {
        ...state,
        phase: 'playing',
        activeDeclaration: state.activeDeclaration
          ? { ...state.activeDeclaration, trapAnswererId: action.answererId ?? undefined }
          : null,
        declaringPlayerId: null,
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
  drawNewCard: () => void;
  declareWin: (playerId: number) => void;
  chooseWinType: (winType: WinType) => void;
  setPhoto: (dataUrl: string) => void;
  setAIResult: (isValid: boolean, message: string, reasoning: string) => void;
  chooseFireSubtype: (subType: FireSubType) => void;
  chooseRaidTarget: (targetId: number) => void;
  chooseTrapAnswerer: (answererId: number | null) => void;
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
  const drawNewCard = useCallback(() => dispatch({ type: 'DRAW_NEW_CARD' }), []);
  const declareWin = useCallback((playerId: number) =>
    dispatch({ type: 'DECLARE_WIN', playerId }), []);
  const chooseWinType = useCallback((winType: WinType) =>
    dispatch({ type: 'CHOOSE_WIN_TYPE', winType }), []);
  const setPhoto = useCallback((photoDataUrl: string) =>
    dispatch({ type: 'SET_PHOTO', photoDataUrl }), []);
  const setAIResult = useCallback((isValid: boolean, message: string, reasoning: string) =>
    dispatch({ type: 'SET_AI_RESULT', isValid, message, reasoning }), []);
  const chooseFireSubtype = useCallback((subType: FireSubType) =>
    dispatch({ type: 'CHOOSE_FIRE_SUBTYPE', subType }), []);
  const chooseRaidTarget = useCallback((targetId: number) =>
    dispatch({ type: 'CHOOSE_RAID_TARGET', targetId }), []);
  const chooseTrapAnswerer = useCallback((answererId: number | null) =>
    dispatch({ type: 'CHOOSE_TRAP_ANSWERER', answererId }), []);
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
      drawNewCard,
      declareWin,
      chooseWinType,
      setPhoto,
      setAIResult,
      chooseFireSubtype,
      chooseRaidTarget,
      chooseTrapAnswerer,
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
