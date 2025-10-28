export type Player = 'X' | 'O' | null;
export type GameStatus = 'waiting' | 'playing' | 'finished';
export type WinnerStatus = 'X' | 'O' | 'draw' | null;

export interface Room {
  id: string;
  name: string;
  players: string[];  
  maxPlayers: number;
  status: 'waiting' | 'full' | 'playing';
  gameState?: GameState; 
  playerSymbol?: Player; 
}

export interface GameState {
  board: Player[];
  currentPlayer: Player;
  status: GameStatus;
  winner: WinnerStatus;
  winningLine: number[] | null;
  roomId: string | null;
  playerSymbol: Player;
}