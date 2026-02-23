# 百分戰局 Percent Battle — TODO

## Phase 1: Core Features (Current)

- [x] Project scaffold with tRPC + Express + React
- [x] Chalkboard design system (dark green, chalk-white, color blocks)
- [x] Google Fonts integration (Nunito + Noto Sans TC)
- [x] Player count selection screen (2/3/4 players)
- [x] Layout preview for each player count (2=opposite, 3=triangle, 4=four-sides)
- [x] Context card display with color boxes (no numbers shown)
- [x] 10 context cards with correct color/total data
- [x] Color block grid (students count themselves)
- [x] Player zone components with rotation for each side
- [x] Win declaration flow trigger (tap player icon)
- [x] Win type selection: 火力全開 vs 設下陷阱
- [x] Photo capture for AI verification
- [x] Poe API integration (OpenAI SDK format, gemini-3-flash)
- [x] Backend tRPC route for AI verification (server-side API key)
- [x] 火力全開 result display with AI reasoning
- [x] 火力全開 subtype: 自摸 vs 突襲
- [x] 突襲 target player selection
- [x] 設下陷阱 result display with AI reasoning
- [x] Trap answerer selection (which player answered / no one)
- [x] Game state reducer with all phases
- [x] Score display bar
- [x] Game top bar with back + draw new card
- [x] CSS animations (block reveal, bounce-in, fade-in-up)
- [x] Responsive layout for mobile/tablet
- [x] Unit tests for game logic (13 tests passing)
- [x] Unit tests for Poe API key validation

## Phase 2: Score Calculation (Pending)

- [ ] Define scoring rules for 火力全開 自摸
- [ ] Define scoring rules for 火力全開 突襲
- [ ] Define scoring rules for 設下陷阱 (出題者 + 答題者)
- [ ] Score update after each round
- [ ] Score history / round log
- [ ] Win condition (max score / rounds limit)

## Phase 3: Additional Features (Future)

- [ ] Player name editing
- [ ] Sound effects for win/lose
- [ ] Confetti animation on win
- [ ] Round counter
- [ ] Game history export
- [ ] Teacher mode (show hints/answers)
