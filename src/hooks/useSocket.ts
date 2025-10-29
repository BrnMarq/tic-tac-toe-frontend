import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room, GameState, Player, WinnerStatus } from '@/types/game';
import { useToast } from './use-toast';

type GameView = 'menu' | 'waiting' | 'game';
const SOCKET_URL = 'http://localhost:3001'; 

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room & { playerSymbol: Player } | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [result, setResult] = useState<{ winner: WinnerStatus; winningLine: number[] | null } | null>(null);
  const [viewState, setViewState] = useState<GameView>('menu');
  const { toast } = useToast();

  // Función para limpiar el estado del juego/sala y volver al menú
  const leaveRoom = useCallback(() => {
    if (socketRef.current) {
      console.log(' Emitiendo leave-room');
      socketRef.current.emit('leave-room');
      setCurrentRoom(null);
      setGameState(null);
      setResult(null);
      setViewState('menu'); 
    }
  }, []);

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

  const makeMove = (position: number) => {
    if (socketRef.current && currentRoom) {
      console.log('Emitiendo make-move:', position);
      socketRef.current.emit('make-move', { position });
    } else {
      console.log(' No se puede hacer movimiento - socket o currentRoom no disponibles');
    }
  };

  const restartGame = () => {
    if (socketRef.current) {
        console.log('🔄 Emitiendo restart-game');
        socketRef.current.emit('restart-game');
        setResult(null); 
    }
  };
  
  // --- Efecto de inicialización y listeners ---

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log(' Conectado al servidor WebSocket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log(' Desconectado del servidor WebSocket');
      setIsConnected(false);
      setViewState('menu');
      setCurrentRoom(null);
      setGameState(null);
    });

    // Evento principal: lista de salas actualizada
    socket.on('rooms-updated', (updatedRooms: Room[]) => {
      console.log(' Salas actualizadas:', updatedRooms.length, 'salas');
      setRooms(updatedRooms);
    });

    // Evento cuando se une a una sala 
    socket.on('room-joined', (room: Room & { playerSymbol: Player }) => {
      console.log(' EVENTO ROOM-JOINED - Sala:', room.name, 'Símbolo:', room.playerSymbol);
      setCurrentRoom(room);
      setGameState(room.gameState || null);
      setViewState('waiting'); 
    });

    // Evento cuando el juego comienza 
    socket.on('game-started', (data: GameState) => {
      console.log(' EVENTO GAME-STARTED - Iniciando juego');
      setGameState(data);
      setResult(null); 
      setViewState('game'); 
      toast({ title: '¡A Jugar!', description: 'La partida ha comenzado', duration: 3000 });
    });
    
    // Evento de actualización del juego 
    socket.on('opponent-moved', (newGameState: GameState) => {
      setGameState(newGameState);
    });

    // Evento de fin de juego
    socket.on('game-over', (resultData: { winner: WinnerStatus; winningLine: number[] | null }) => {
      setResult(resultData);
      setGameState(prev => prev ? { 
          ...prev, 
          status: 'finished', 
          winner: resultData.winner, 
          winningLine: resultData.winningLine 
      } : null);
      toast({ title: 'Partida finalizada', description: `Ganador: ${resultData.winner}`, duration: 5000 });
    });
    
    // Evento cuando el otro jugador se va
    socket.on('player-left', () => {
        toast({ title: 'Oponente Desconectado', description: 'El otro jugador ha salido. Volviendo al menú.', duration: 5000 });
        leaveRoom(); 
    });
    
    socket.on('error', (message: string) => {
        toast({ title: 'Error', description: message, variant: 'destructive', duration: 5000 });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('rooms-updated');
      socket.off('room-joined');
      socket.off('game-started');
      socket.off('opponent-moved');
      socket.off('game-over');
      socket.off('player-left');
      socket.off('error');
      socket.disconnect();
    };
  }, [leaveRoom, toast]);

  return {
    isConnected,
    rooms,
    currentRoom,
    gameState,
    result,
    viewState, 
    createRoom,
    joinRoom,
    leaveRoom,
    makeMove,
    restartGame,
  };
};