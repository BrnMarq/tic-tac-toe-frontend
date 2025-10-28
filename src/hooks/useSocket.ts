import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room, GameState, Player } from '@/types/game';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket']
    });

    const socket = socketRef.current;

    // Eventos básicos de conexión
    socket.on('connect', () => {
      console.log(' Conectado al servidor WebSocket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log(' Desconectado del servidor WebSocket');
      setIsConnected(false);
    });

    // Evento principal: lista de salas actualizada
    socket.on('rooms-updated', (updatedRooms: Room[]) => {
      console.log(' Salas actualizadas:', updatedRooms.length, 'salas');
      setRooms(updatedRooms);
    });

    // Evento cuando se une a una sala
    socket.on('room-joined', (room: Room & { playerSymbol: Player }) => {
      console.log(' EVENTO ROOM-JOINED:', {
        roomName: room.name,
        roomId: room.id,
        players: room.players.length,
        playerSymbol: room.playerSymbol,
        status: room.status,
        gameState: room.gameState 
      });
      setCurrentRoom(room);
    });

    // Evento cuando el juego comienza
    socket.on('game-started', (gameState: GameState) => {
      console.log(' EVENTO GAME-STARTED recibido en frontend');
      console.log('Estado del juego:', gameState);
    
      setCurrentRoom(prev => {
        if (!prev) return null;
        
        const updatedRoom = {
          ...prev,
          gameState: gameState,
          status: 'playing' as const
        };
        
        console.log('🔄 CurrentRoom actualizado después de game-started:', updatedRoom);
        return updatedRoom;
      });
    });

    // Evento cuando el oponente hace un movimiento
    socket.on('opponent-moved', (gameState: GameState) => {
      console.log(' EVENTO OPPONENT-MOVED recibido');
      console.log('Movimiento del oponente - Estado actualizado:', gameState);
      
      // Actualizar el estado del juego cuando el oponente mueve
      setCurrentRoom(prev => {
        if (!prev) return null;
        
        const updatedRoom = {
          ...prev,
          gameState: gameState
        };
        
        console.log(' CurrentRoom actualizado después de opponent-moved:', updatedRoom);
        return updatedRoom;
      });
    });

    // Evento cuando el juego termina
    socket.on('game-over', (result: any) => {
      console.log(' EVENTO GAME-OVER:', result);
    });

    // Eventos de jugadores
    socket.on('player-joined', (playersCount: number) => {
      console.log(' EVENTO PLAYER-JOINED - Jugadores en sala:', playersCount);
    });

    socket.on('player-left', (playersCount: number) => {
      console.log(' EVENTO PLAYER-LEFT - Jugadores en sala:', playersCount);
    });

    // Manejo de errores
    socket.on('error', (error: string) => {
      console.error(' ERROR DEL SERVIDOR:', error);
      alert(`Error: ${error}`);
    });

    // Limpieza al desmontar
    return () => {
      socket.disconnect();
    };
  }, []);

  // Métodos para emitir eventos al servidor
  const createRoom = (roomName: string) => {
    if (socketRef.current) {
      console.log(' Emitiendo create-room:', roomName);
      socketRef.current.emit('create-room', roomName);
    }
  };

  const joinRoom = (roomId: string) => {
    if (socketRef.current) {
      console.log(' Emitiendo join-room:', roomId);
      socketRef.current.emit('join-room', roomId);
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      console.log(' Emitiendo leave-room');
      socketRef.current.emit('leave-room');
      setCurrentRoom(null);
    }
  };

  // Método para hacer movimientos
  const makeMove = (position: number) => {
    if (socketRef.current && currentRoom) {
      console.log('Emitiendo make-move:', position);
      socketRef.current.emit('make-move', { position });
    } else {
      console.log(' No se puede hacer movimiento - socket o currentRoom no disponibles');
    }
  };

  // Método para reiniciar juego
  const restartGame = () => {
    if (socketRef.current) {
      console.log('🔄 Emitiendo restart-game');
      socketRef.current.emit('restart-game');
    }
  };

  console.log(' useSocket returning - currentRoom:', currentRoom);
  
  return {
    socket: socketRef.current,
    isConnected,
    rooms,
    currentRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    makeMove,       
    restartGame     
  };
};