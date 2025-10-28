import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameBoard } from "./GameBoard";
import { GameStatus } from "./GameStatus";
import { GameResultModal } from "./GameResultModal";
import { Player, GameState } from "@/types/game";
import { useSocket } from "@/hooks/useSocket";

interface GameProps {
  roomName: string;
  onLeave: () => void;
}

export const Game = ({ roomName, onLeave }: GameProps) => {
  const { currentRoom, makeMove, socket } = useSocket();

  const gameState = currentRoom?.gameState;

  const [showResultModal, setShowResultModal] = useState(false);

  // Escuchar eventos de game-over del WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleGameOver = (result: any) => {
      console.log(' Game-over recibido:', result);
      setShowResultModal(true);
    };

    socket.on('game-over', handleGameOver);

    return () => {
      socket.off('game-over', handleGameOver);
    };
  }, [socket]);

  // Mostrar modal cuando el juego termina 
  useEffect(() => {
    if (gameState?.status === 'finished') {
      console.log(' Juego terminado - mostrando modal');
      setTimeout(() => setShowResultModal(true), 500);
    }
  }, [gameState?.status]);

  const handleCellClick = (index: number) => {
    if (!gameState || !currentRoom) {
      console.log(' No hay gameState o currentRoom');
      return;
    }

    //  Validaciones del movimiento
    if (gameState.board[index]) {
      console.log(' Casilla ya ocupada');
      return;
    }

    if (gameState.status !== 'playing') {
      console.log(' Juego no está en estado playing');
      return;
    }

    //  Validar que es el turno del jugador actual
    if (gameState.currentPlayer !== currentRoom.playerSymbol) {
      console.log(' No es tu turno. Turno actual:', gameState.currentPlayer, 'Tu símbolo:', currentRoom.playerSymbol);
      return;
    }

    console.log('Haciendo movimiento en posición:', index);
    console.log(' Estado actual - Turno:', gameState.currentPlayer, 'Tu símbolo:', currentRoom.playerSymbol);
    
    //  Enviar movimiento al servidor via WebSocket
    makeMove(index);
  };

  const handlePlayAgain = () => {
    console.log(' Solicitando reinicio de juego');
    setShowResultModal(false);
    
  };

  const handleBackToMenu = () => {
    setShowResultModal(false);
    onLeave();
  };


if (!gameState) {
  //  Mostrar información más específica del problema
  const isLoading = !currentRoom;
  const isWaitingForGameState = currentRoom && !gameState;
  const roomStatus = currentRoom?.status;

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold">
          {isLoading ? 'Conectando...' : 'Sincronizando juego'}
        </h2>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Estado de la sala: <strong>{roomStatus || 'Desconocido'}</strong></p>
          <p>Jugadores en sala: <strong>{currentRoom?.players?.length || 0}</strong></p>
          <p>gameState: <strong>{gameState ? 'Recibido' : 'Esperando'}</strong></p>
        </div>

        {isWaitingForGameState && roomStatus === 'playing' && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
            <p className="text-yellow-600 font-medium">
              ⚠️ Esperando estado del juego...
            </p>
            <p className="text-yellow-600/80 text-xs mt-1">
              El juego ha comenzado pero no hemos recibido el estado inicial.
            </p>
          </div>
        )}

        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

  console.log('🎮 Renderizando Game - Estado:', {
    status: gameState.status,
    currentPlayer: gameState.currentPlayer,
    playerSymbol: currentRoom?.playerSymbol,
    board: gameState.board
  });

  return (
    <div className="min-h-screen bg-gradient-bg p-4 sm:p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header con nombre de sala y botón salir */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{roomName}</h2>
            <p className="text-sm text-muted-foreground">
              Tu símbolo: <span className="font-bold">{currentRoom?.playerSymbol}</span>
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
          playerSymbol={currentRoom?.playerSymbol}
        />

        {/* Tablero de juego */}
        <GameBoard
          board={gameState.board}
          onCellClick={handleCellClick}
          winningLine={gameState.winningLine}
          currentPlayer={gameState.currentPlayer}
          disabled={gameState.status !== 'playing' || gameState.currentPlayer !== currentRoom?.playerSymbol}
        />

        {/* Modal de resultados */}
        <GameResultModal
          isOpen={showResultModal}
          winner={gameState.winner}
          playerSymbol={currentRoom?.playerSymbol}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
        />
      </div>
    </div>
  );
};