import { MainMenu } from "@/components/game/MainMenu";
import { WaitingRoom } from "@/components/game/WaitingRoom";
import { Game } from "@/components/game/Game";
import { useSocket } from "@/hooks/useSocket";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { 
    isConnected, 
    rooms, 
    viewState, 
    currentRoom,
    gameState,
    result,
    createRoom, 
    joinRoom, 
    leaveRoom, 
    makeMove,
    restartGame
  } = useSocket();


  // Handlers para interactuar con el hook
  const handleJoinRoom = (roomId: string) => joinRoom(roomId);
  const handleCreateRoom = (roomName: string) => createRoom(roomName);
  const handleLeaveRoom = () => leaveRoom();
  const handleMakeMove = (position: number) => makeMove(position);
  const handleRestartGame = () => restartGame();

  if (!isConnected) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Conectando al servidor...</p>
        </div>
    );
  }

  switch (viewState) {
    case 'waiting':
      return (
        <WaitingRoom 
          roomName={currentRoom?.name || 'Sala Desconocida'} 
          onLeave={handleLeaveRoom} 
        />
      );

    case 'game':
      if (gameState && currentRoom?.playerSymbol) {
        return (
          <Game
            roomName={currentRoom.name}
            gameState={gameState}
            playerSymbol={currentRoom.playerSymbol}
            result={result} 
            onLeave={handleLeaveRoom}
            onMove={handleMakeMove} 
            onRestart={handleRestartGame} 
          />
        );
      }
      return (
        <MainMenu 
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
          rooms={rooms}
        />
      );

    case 'menu':
    default:
      return (
        <MainMenu 
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
          rooms={rooms} 
        />
      );
  }
};

export default Index;