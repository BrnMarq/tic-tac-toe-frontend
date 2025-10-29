import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameBoard } from "./GameBoard";
import { GameStatus } from "./GameStatus";
import { GameResultModal } from "./GameResultModal";
import { Player, GameState, WinnerStatus } from "@/types/game";

interface GameProps {
  roomName: string;
  gameState: GameState;
  playerSymbol: Player;
  result: { winner: WinnerStatus; winningLine: number[] | null } | null; 
  onLeave: () => void;
  onMove: (position: number) => void; 
  onRestart: () => void; 
}

export const Game = ({ 
    roomName, 
    gameState, 
    playerSymbol, 
    result, 
    onLeave, 
    onMove, 
    onRestart 
}: GameProps) => {

  const [showResultModal, setShowResultModal] = useState(false);

  const handleCellClick = (position: number) => {
    if (gameState.status === 'playing' && gameState.currentPlayer === playerSymbol) {
        onMove(position); 
    }
  };

  useEffect(() => {
    if (gameState.status === 'finished' && result) {
      console.log(' Juego terminado - mostrando modal');
      setTimeout(() => setShowResultModal(true), 500); 
    } else {
        setShowResultModal(false);
    }
  }, [gameState.status, result]); 

  const handlePlayAgain = () => {
    onRestart(); 
    setShowResultModal(false);
  };

  const handleBackToMenu = () => {
    onLeave(); 
    setShowResultModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-bg w-full sm:p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header con nombre de sala y botón salir */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{roomName}</h2>
            <p className="text-sm text-muted-foreground">
              Tu símbolo: <span className="font-bold">{playerSymbol}</span>
            </p>
          </div>
          <Button variant="outline" onClick={onLeave}>
            <LogOut className="w-4 h-4" />
            Salir
          </Button>
        </div>

        {/* Estado del juego */}
        <GameStatus 
          currentPlayer={gameState.currentPlayer}
          status={gameState.status}
          playerSymbol={playerSymbol}
        />

        {/* Tablero de juego */}
        <GameBoard
          board={gameState.board}
          onCellClick={handleCellClick}
          winningLine={gameState.winningLine}
          currentPlayer={gameState.currentPlayer}
          disabled={gameState.status !== 'playing' || gameState.currentPlayer !== playerSymbol}
        />

        {/* Modal de resultados */}
        <GameResultModal
          isOpen={showResultModal && !!result && gameState.status === 'finished'} 
          winner={result?.winner || null}
          playerSymbol={playerSymbol}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
        />
      </div>
    </div>
  );
};