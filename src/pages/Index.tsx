import { useState, useEffect } from "react";
import { MainMenu } from "@/components/game/MainMenu";
import { WaitingRoom } from "@/components/game/WaitingRoom";
import { Game } from "@/components/game/Game";
import { useSocket } from "@/hooks/useSocket";

type View = 'menu' | 'waiting' | 'game';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('menu');
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const { 
    socket, 
    isConnected, 
    rooms, 
    currentRoom: socketRoom, 
    createRoom, 
    joinRoom, 
    leaveRoom 
  } = useSocket();

  // Navegación automática basada en eventos WebSocket
  useEffect(() => {
    if (!socket) return;

    console.log('🔧 Configurando listeners de navegación en Index.tsx');

    // Evento cuando el juego comienza
    const handleGameStarted = (gameState: any) => {
      console.log(' GAME-STARTED - Navegando a juego');
      setCurrentView('game');
    };

    // Evento cuando se une a una sala
    const handleRoomJoined = (room: any) => {
      console.log(' ROOM-JOINED - Sala:', room.name);
      setCurrentRoom(room.name);
      
      // Navegar basado en el estado de la sala
      if (room.status === 'playing' || room.players?.length === 2) {
        console.log(' Navegando a GAME (sala completa)');
        setCurrentView('game');
      } else {
        console.log(' Navegando a WAITING (esperando jugador)');
        setCurrentView('waiting');
      }
    };

    // Registrar listeners
    socket.on('game-started', handleGameStarted);
    socket.on('room-joined', handleRoomJoined);

    return () => {
      socket.off('game-started', handleGameStarted);
      socket.off('room-joined', handleRoomJoined);
    };
  }, [socket]);

  // navegación basada en cambios de socketRoom
  useEffect(() => {
    if (socketRoom) {
      console.log(' SocketRoom actualizado:', socketRoom);
      setCurrentRoom(socketRoom.name);
      
      if (socketRoom.status === 'playing' || socketRoom.players?.length === 2) {
        console.log(' Navegando a GAME desde socketRoom change');
        setCurrentView('game');
      } else if (socketRoom.players?.length === 1) {
        console.log(' Navegando a WAITING desde socketRoom change');
        setCurrentView('waiting');
      }
    } else {
      console.log(' No hay sala - Navegando a MENU');
      setCurrentView('menu');
    }
  }, [socketRoom]);

  //  Handlers para MainMenu
  const handleJoinRoom = (roomId: string) => {
    console.log(' Uniéndose a sala:', roomId);
    joinRoom(roomId);
  };

  const handleCreateRoom = (roomName: string) => {
    console.log(' Creando sala:', roomName);
    createRoom(roomName);
  };

  const handleLeaveRoom = () => {
    console.log(' Saliendo de la sala');
    leaveRoom();
    setCurrentView('menu');
    setCurrentRoom('');
  };

  console.log(' RENDER - Vista:', currentView, 'Sala:', currentRoom, 'Conectado:', isConnected);

  return (
    <>
      {currentView === 'menu' && (
        <MainMenu 
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
          rooms={rooms} 
        />
      )}
      
      {currentView === 'waiting' && (
        <WaitingRoom 
          roomName={currentRoom}
          onLeave={handleLeaveRoom}
        />
      )}
      
      {currentView === 'game' && (
        <Game 
          roomName={currentRoom}
          onLeave={handleLeaveRoom}
        />
      )}
    </>
  );
};

export default Index;