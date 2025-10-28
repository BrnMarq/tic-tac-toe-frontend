import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Room } from "@/types/game";

interface RoomCardProps {
  room: Room;
  onJoin: (roomId: string) => void;
}

export const RoomCard = ({ room, onJoin }: RoomCardProps) => {
  const isFull = room.players.length >= room.maxPlayers;
  const isPlaying = room.status === 'playing';

  const getStatusText = () => {
    if (isPlaying) return 'Jugando';
    if (isFull) return 'Llena';
    return `Esperando (${room.players.length}/${room.maxPlayers})`;
  };

  const getStatusColor = () => {
    if (isPlaying) return 'text-red-400';
    if (isFull) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  return (
    <Card className="hover:border-primary transition-all duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{room.name}</span>
          <div className="flex items-center gap-1 text-muted-foreground text-sm font-normal">
            <Users className="w-4 h-4" />
            <span>{room.players.length}/{room.maxPlayers}</span>
          </div>
        </CardTitle>
        <CardDescription className={getStatusColor()}>
          {getStatusText()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="game"
          className="w-full"
          onClick={() => onJoin(room.id)}
          disabled={isFull || isPlaying} 
        >
          {isPlaying ? 'En juego' : isFull ? 'Llena' : 'Unirse'}
        </Button>
      </CardContent>
    </Card>
  );
};