import { Trophy, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Player, GameStatus as Status } from "@/types/game";
import { cn } from "@/lib/utils";

interface GameStatusProps {
  currentPlayer: Player;
  status: Status;
  playerSymbol: Player;
}

export const GameStatus = ({ currentPlayer, status, playerSymbol }: GameStatusProps) => {
  const isMyTurn = currentPlayer === playerSymbol;
  
  const getStatusMessage = () => {
    if (status === 'waiting') return 'Esperando jugador...';
    if (status === 'finished') return 'Partida finalizada';
    
    return isMyTurn 
      ? `Tu turno (${playerSymbol})` 
      : `Turno del oponente (${currentPlayer})`;
  };

  const getStatusColor = () => {
    if (status !== 'playing') return 'text-muted-foreground';
    return isMyTurn ? 'text-primary' : 'text-secondary';
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              status === 'playing' && "animate-pulse-glow",
              isMyTurn ? "bg-primary" : "bg-secondary"
            )} />
            <p className={cn("text-lg font-semibold", getStatusColor())}>
              {getStatusMessage()}
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">En curso</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
